"""Small, browser-facing debugger core for dynamically loaded tile code.

The tile's normal RabbitMQ consumer may be paused inside ``user_line``.  Debug
commands therefore have to be delivered by a separate worker thread and call
``submit_command``, which only updates condition-protected state.  The traced
thread applies the corresponding bdb operation before it resumes.
"""

import bdb
import dis
import linecache
import reprlib
import sys
import threading
import time
import types
import uuid


class DebugSessionAborted(BaseException):
    """Unwind a debugged event without treating it as a user-code exception."""


class TileDebugger(bdb.Bdb):
    VALID_COMMANDS = {"continue", "step", "next", "return", "abort"}
    COMMAND_ALIASES = {"step_over": "next", "step_out": "return"}

    def __init__(self, event_callback=None, pause_timeout=300):
        super().__init__()
        self.event_callback = event_callback or (lambda _event, _data: None)
        self.pause_timeout = pause_timeout
        self._condition = threading.Condition()
        self._armed = False
        self._running = False
        self._paused = False
        self._command = None
        self._pause_count = 0
        self._session_id = None
        self._source_info = None
        self._room = None
        self._pause_on_start = False
        self._pause_on_exceptions = False
        self._starting = False
        self._abort_requested = False
        self._seen_exception_ids = set()

        self._repr = reprlib.Repr()
        self._repr.maxstring = 500
        self._repr.maxother = 500
        self._repr.maxlist = 20
        self._repr.maxtuple = 20
        self._repr.maxdict = 20
        self._repr.maxset = 20

    @property
    def session_id(self):
        with self._condition:
            return self._session_id

    @property
    def is_armed(self):
        with self._condition:
            return self._armed

    @property
    def is_paused(self):
        with self._condition:
            return self._paused

    def arm(self, source_info, breakpoints, session_id=None, room=None,
            pause_on_start=False, pause_on_exceptions=False):
        """Arm one debug session against the exact currently loaded source."""
        if not source_info:
            return {"success": False, "message": "No tile source is loaded."}

        normalized_breakpoints = []
        for line in breakpoints or []:
            try:
                line = int(line)
            except (TypeError, ValueError):
                return {"success": False, "message": f"Invalid breakpoint line: {line!r}"}
            if line < 1:
                return {"success": False, "message": f"Invalid breakpoint line: {line}"}
            normalized_breakpoints.append(line)

        if not normalized_breakpoints and not pause_on_start and not pause_on_exceptions:
            return {
                "success": False,
                "message": (
                    "At least one breakpoint is required unless pause-on-start or "
                    "pause-on-exceptions is enabled."
                )
            }

        with self._condition:
            if self._running:
                return {"success": False, "message": "A debug session is already running."}

            self.clear_all_breaks()
            errors = []
            filename = source_info["filename"]
            executable_lines = self._get_executable_lines(filename)
            for line in sorted(set(normalized_breakpoints)):
                if line not in executable_lines:
                    error = f"Line {filename}:{line} is not executable"
                else:
                    error = self.set_break(filename, line)
                if error:
                    errors.append({"line": line, "message": error})
            if errors:
                self.clear_all_breaks()
                return {
                    "success": False,
                    "message": "One or more breakpoints are not executable lines.",
                    "breakpoint_errors": errors,
                }

            self._session_id = session_id or str(uuid.uuid4())
            self._source_info = dict(source_info)
            self._room = room
            self._pause_on_start = bool(pause_on_start)
            self._pause_on_exceptions = bool(pause_on_exceptions)
            self._command = None
            self._pause_count = 0
            self._paused = False
            self._armed = True
            self._abort_requested = False

            return {
                "success": True,
                "session_id": self._session_id,
                "source": dict(self._source_info),
                "breakpoints": sorted(set(normalized_breakpoints)),
                "pause_on_exceptions": self._pause_on_exceptions,
            }

    def disarm(self, session_id=None):
        with self._condition:
            if session_id and session_id != self._session_id:
                return {"success": False, "message": "Unknown debug session."}
            if self._paused:
                self._command = "continue"
                self._condition.notify_all()
            self._armed = False
            return {"success": True, "session_id": self._session_id}

    def should_trace(self, task_type):
        excluded_tasks = {
            "arm_debugger", "disarm_debugger", "load_source",
            "load_source_and_recreate", "load_source_and_reinstantiate",
            "load_source_and_instantiate", "restart", "kill_me", "stop_me",
        }
        with self._condition:
            return self._armed and not self._running and task_type not in excluded_tasks

    def run_event(self, callable_):
        """Run one worker event under bdb.

        An armed breakpoint session survives framework-only events until it
        actually pauses.  A single browser action can enqueue several tile
        events (UpdateOptions, spinner events, then RefreshTile), and the user
        code may not run until a later event in that sequence.
        """
        with self._condition:
            if not self._armed or self._running:
                should_trace = False
            else:
                should_trace = True
                self._running = True
                session_id = self._session_id
                starting_pause_count = self._pause_count
                self._seen_exception_ids = set()

        if not should_trace:
            return callable_()

        result = None
        status = "completed"
        previous_trace = sys.gettrace()
        try:
            self.reset()
            # bdb cannot set a true "continue" stop frame until its first
            # dispatch call establishes botframe.  user_line handles that
            # transition on the first line belonging to the tile source.
            self._starting = True
            sys.settrace(self.trace_dispatch)
            result = callable_()
        except DebugSessionAborted:
            status = "aborted"
        except BaseException:
            status = "exception"
            raise
        finally:
            sys.settrace(previous_trace)
            with self._condition:
                pause_count = self._pause_count
                paused_during_event = pause_count > starting_pause_count
                keep_armed = status == "completed" and not paused_during_event
                self._running = False
                self._paused = False
                self._command = None
                self._abort_requested = False
                if not keep_armed:
                    self._armed = False
                    self.clear_all_breaks()
            if not keep_armed:
                self._emit("debug-completed", {
                    "session_id": session_id,
                    "status": status,
                    "pause_count": pause_count,
                })
        return result

    def submit_command(self, session_id, command):
        command = self.COMMAND_ALIASES.get(command, command)
        if command not in self.VALID_COMMANDS:
            return {"success": False, "message": f"Unknown debug command: {command}"}

        with self._condition:
            if session_id != self._session_id:
                return {"success": False, "message": "Unknown debug session."}
            if command == "abort":
                if self._paused:
                    self._command = command
                    self._condition.notify_all()
                    state = "stopping"
                elif self._running:
                    self._abort_requested = True
                    state = "stopping"
                elif self._armed:
                    self._armed = False
                    self.clear_all_breaks()
                    state = "disarmed"
                else:
                    return {"success": False, "message": "The debugger is not active."}
                return {
                    "success": True,
                    "session_id": session_id,
                    "command": command,
                    "state": state,
                }
            if not self._paused:
                return {"success": False, "message": "The debugger is not paused."}
            self._command = command
            self._condition.notify_all()
            return {"success": True, "session_id": session_id, "command": command}

    def user_line(self, frame):
        if not self._is_tile_frame(frame):
            return
        with self._condition:
            if self._abort_requested:
                raise DebugSessionAborted()
        if self._starting:
            self._starting = False
            if not self._pause_on_start and not self.break_here(frame):
                self._set_continue()
                return
        self._pause(frame, "line")

    def dispatch_exception(self, frame, arg):
        """Pause once where an exception originates in the loaded tile source."""
        if self._pause_on_exceptions and self._is_tile_frame(frame):
            exception_type, exception_value, _traceback = arg
            if exception_type not in (StopIteration, StopAsyncIteration, GeneratorExit):
                exception_id = id(exception_value)
                if exception_id not in self._seen_exception_ids:
                    self._seen_exception_ids.add(exception_id)
                    self.user_exception(frame, arg)
                    if self.quitting:
                        raise bdb.BdbQuit
            return self.trace_dispatch
        return super().dispatch_exception(frame, arg)

    def dispatch_call(self, frame, arg):
        # bdb normally skips new frames when continuing without breakpoints.
        # Exception-only sessions must keep tracing nested tile methods so the
        # pause occurs at the raise site rather than later in a caller.
        if self.botframe is not None and self._pause_on_exceptions and self._is_tile_frame(frame):
            return self.trace_dispatch
        return super().dispatch_call(frame, arg)

    def user_exception(self, frame, exc_info):
        # bdb can call this hook through its default dispatcher while it is
        # still establishing the initial stop frame. Framework libraries use
        # ordinary exceptions for control flow (for example structlog's
        # DropEvent), so enforce the tile-source boundary here as well.
        if not self._pause_on_exceptions or not self._is_tile_frame(frame):
            return
        with self._condition:
            if self._abort_requested:
                raise DebugSessionAborted()
        exception_type, exception_value, _traceback = exc_info
        self._pause(frame, "exception", exception={
            "type": exception_type.__name__,
            "message": self._safe_repr(exception_value),
        })

    def user_return(self, frame, return_value):
        if not self._is_tile_frame(frame):
            return
        with self._condition:
            if self._abort_requested:
                raise DebugSessionAborted()
        self._pause(frame, "return", return_value=return_value)

    def _is_tile_frame(self, frame):
        source_info = self._source_info
        return bool(source_info and frame.f_code.co_filename == source_info["filename"])

    def _pause(self, frame, event, return_value=None, exception=None):
        with self._condition:
            self._paused = True
            self._command = None
            self._pause_count += 1
            snapshot = self._snapshot(frame, event, return_value, exception)

        self._emit("debug-paused", snapshot)

        timed_out = False
        deadline = time.monotonic() + self.pause_timeout
        with self._condition:
            while self._command is None:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    timed_out = True
                    self._command = "continue"
                    break
                self._condition.wait(remaining)
            command = self._command
            self._command = None
            self._paused = False

        if timed_out:
            self._emit("debug-timeout", {
                "session_id": self._session_id,
                "line": frame.f_lineno,
            })

        if command == "continue":
            self._set_continue()
        elif command == "step":
            self.set_step()
        elif command == "next":
            self.set_next(frame)
        elif command == "return":
            self.set_return(frame)
        elif command == "abort":
            self.set_quit()
            raise DebugSessionAborted()

    def _set_continue(self):
        # bdb.set_continue removes tracing when there are no breakpoints. Keep
        # the trace installed for an exception-only session.
        if self._pause_on_exceptions and not self.breaks:
            self._set_stopinfo(self.botframe, None, -1)
        else:
            self.set_continue()

    def _snapshot(self, frame, event, return_value, exception):
        stack, _index = self.get_stack(frame, None)
        stack_data = []
        tile_stack = [item for item in stack if self._is_tile_frame(item[0])]
        for stack_frame, line_number in reversed(tile_stack):
            if self._is_tile_frame(stack_frame):
                stack_data.append({
                    "filename": stack_frame.f_code.co_filename,
                    "function": stack_frame.f_code.co_name,
                    "line": line_number,
                    "locals": self._snapshot_locals(stack_frame),
                })

        variables = self._snapshot_locals(frame)

        data = {
            "session_id": self._session_id,
            "source": dict(self._source_info),
            "event": event,
            "line": frame.f_lineno,
            "function": frame.f_code.co_name,
            "stack": stack_data,
            "locals": variables,
        }
        if event == "return":
            data["return_value"] = self._safe_repr(return_value)
        if exception is not None:
            data["exception"] = exception
        return data

    def _snapshot_locals(self, frame):
        variables = []
        for name, value in sorted(frame.f_locals.items()):
            variables.append({
                "name": name,
                "type": type(value).__name__,
                "value": self._safe_repr(value),
            })
        return variables

    def _safe_repr(self, value):
        try:
            return self._repr.repr(value)
        except Exception as ex:
            return f"<repr failed: {type(ex).__name__}>"

    @staticmethod
    def _get_executable_lines(filename):
        source = "".join(linecache.getlines(filename))
        if not source:
            return set()
        try:
            root_code = compile(source, filename, "exec")
        except (SyntaxError, ValueError, TypeError):
            return set()

        executable = set()
        pending = [root_code]
        while pending:
            code = pending.pop()
            executable.update(line for _offset, line in dis.findlinestarts(code))
            pending.extend(
                const for const in code.co_consts if isinstance(const, types.CodeType)
            )
        return executable

    def _emit(self, event, data):
        payload = dict(data)
        if self._room:
            payload["room"] = self._room
        try:
            self.event_callback(event, payload)
        except Exception:
            # Debug transport failure must never break the user's tile event.
            pass
