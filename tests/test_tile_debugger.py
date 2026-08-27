import hashlib
import linecache
import sys
import threading
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY_ROOT / "tile_container_env"))

from tile_debugger import TileDebugger  # noqa: E402


def compile_test_source(source):
    source_hash = hashlib.sha256(source.encode("utf-8")).hexdigest()
    filename = f"/tactic/user-code/{source_hash[:16]}.py"
    lines = source.splitlines(keepends=True)
    linecache.cache[filename] = (len(source), None, lines, filename)
    namespace = {}
    exec(compile(source, filename, "exec"), namespace, namespace)
    return namespace, {
        "filename": filename,
        "source_hash": source_hash,
        "line_count": len(source.splitlines()),
    }


class TileDebuggerTests(unittest.TestCase):
    def setUp(self):
        self.events = []
        self.paused = threading.Event()
        self.completed = threading.Event()

        def receive_event(event, data):
            self.events.append((event, data))
            if event == "debug-paused":
                self.paused.set()
            elif event == "debug-completed":
                self.completed.set()

        self.debugger = TileDebugger(receive_event, pause_timeout=2)

    def _wait_for_pause(self):
        self.assertTrue(self.paused.wait(2), "debugger did not pause")
        self.paused.clear()
        return [data for event, data in self.events if event == "debug-paused"][-1]

    def test_breakpoint_reports_locals_then_step_and_continue(self):
        source = (
            "def target():\n"
            "    message = 'before breakpoint'\n"
            "    count = 12\n"
            "    result = count + 1\n"
            "    return result\n"
        )
        namespace, source_info = compile_test_source(source)
        arm_result = self.debugger.arm(
            source_info, [4], session_id="session-1"
        )
        self.assertTrue(arm_result["success"])

        result = []
        thread = threading.Thread(
            target=lambda: result.append(
                self.debugger.run_event(namespace["target"])
            )
        )
        thread.start()

        first_pause = self._wait_for_pause()
        self.assertEqual(first_pause["line"], 4)
        local_values = {item["name"]: item["value"] for item in first_pause["locals"]}
        self.assertEqual(local_values["count"], "12")
        self.assertEqual(local_values["message"], "'before breakpoint'")

        step_result = self.debugger.submit_command("session-1", "step")
        self.assertTrue(step_result["success"])
        second_pause = self._wait_for_pause()
        self.assertEqual(second_pause["line"], 5)
        self.assertTrue(self.debugger.submit_command("session-1", "continue")["success"])

        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertEqual(result, [13])
        self.assertTrue(self.completed.wait(1))
        self.assertFalse(self.debugger.is_armed)

    def test_breakpoint_session_survives_events_that_do_not_pause(self):
        source = (
            "def framework_generated_property():\n"
            "    return 'framework value'\n"
            "\n"
            "def target():\n"
            "    value = 12\n"
            "    return value\n"
        )
        namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(
            source_info, [5], session_id="later-event"
        )["success"])

        self.assertEqual(
            self.debugger.run_event(namespace["framework_generated_property"]),
            "framework value",
        )
        self.assertTrue(self.debugger.is_armed)
        self.assertFalse(self.completed.is_set())

        thread = threading.Thread(
            target=lambda: self.debugger.run_event(namespace["target"])
        )
        thread.start()
        pause = self._wait_for_pause()
        self.assertEqual(pause["line"], 5)
        self.assertTrue(self.debugger.submit_command("later-event", "continue")["success"])
        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertTrue(self.completed.wait(1))

    def test_abort_unwinds_debugged_event_without_raising_in_worker_thread(self):
        source = "def target():\n    value = 1\n    return value\n"
        namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(source_info, [2], session_id="abort-me")["success"])

        result = []
        thread = threading.Thread(
            target=lambda: result.append(self.debugger.run_event(namespace["target"]))
        )
        thread.start()
        self._wait_for_pause()
        self.assertTrue(self.debugger.submit_command("abort-me", "abort")["success"])

        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertEqual(result, [None])
        completed = [data for event, data in self.events if event == "debug-completed"]
        self.assertEqual(completed[-1]["status"], "aborted")

    def test_abort_disarms_session_before_an_event_starts(self):
        source = "def target():\n    return 1\n"
        _namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(source_info, [2], session_id="armed")['success'])

        result = self.debugger.submit_command("armed", "abort")

        self.assertTrue(result["success"])
        self.assertEqual(result["state"], "disarmed")
        self.assertFalse(self.debugger.is_armed)

    def test_rejects_breakpoint_on_non_executable_line(self):
        source = "def target():\n\n    return 1\n"
        _namespace, source_info = compile_test_source(source)
        result = self.debugger.arm(source_info, [2], session_id="bad-breakpoint")
        self.assertFalse(result["success"])
        self.assertEqual(result["breakpoint_errors"][0]["line"], 2)

    def test_rejects_command_for_wrong_session(self):
        source = "def target():\n    return 1\n"
        _namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(source_info, [2], session_id="right")["success"])
        result = self.debugger.submit_command("wrong", "continue")
        self.assertFalse(result["success"])

    def test_pause_timeout_resumes_event(self):
        source = "def target():\n    value = 1\n    return value\n"
        namespace, source_info = compile_test_source(source)
        timeout_events = []
        debugger = TileDebugger(
            lambda event, data: timeout_events.append((event, data)),
            pause_timeout=0.01,
        )
        self.assertTrue(debugger.arm(source_info, [2], session_id="timeout")["success"])

        self.assertEqual(debugger.run_event(namespace["target"]), 1)
        self.assertIn("debug-timeout", [event for event, _data in timeout_events])
        self.assertFalse(debugger.is_armed)

    def test_exception_only_session_pauses_at_origin_with_stack_and_frame_locals(self):
        source = (
            "def inner(value):\n"
            "    adjusted = value + 1\n"
            "    raise ValueError(f'bad value: {adjusted}')\n"
            "\n"
            "def outer():\n"
            "    label = 'caller local'\n"
            "    return inner(4)\n"
        )
        namespace, source_info = compile_test_source(source)
        arm_result = self.debugger.arm(
            source_info,
            [],
            session_id="exception-only",
            pause_on_exceptions=True,
        )
        self.assertTrue(arm_result["success"])

        raised = []

        def run_target():
            try:
                self.debugger.run_event(namespace["outer"])
            except ValueError as ex:
                raised.append(str(ex))

        thread = threading.Thread(target=run_target)
        thread.start()

        pause = self._wait_for_pause()
        self.assertEqual(pause["event"], "exception")
        self.assertEqual(pause["line"], 3)
        self.assertEqual(pause["exception"]["type"], "ValueError")
        self.assertIn("bad value: 5", pause["exception"]["message"])
        self.assertEqual([frame["function"] for frame in pause["stack"]], ["inner", "outer"])

        inner_locals = {item["name"]: item["value"] for item in pause["stack"][0]["locals"]}
        outer_locals = {item["name"]: item["value"] for item in pause["stack"][1]["locals"]}
        self.assertEqual(inner_locals["adjusted"], "5")
        self.assertEqual(outer_locals["label"], "'caller local'")

        self.assertTrue(self.debugger.submit_command(
            "exception-only", "continue"
        )["success"])
        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertEqual(raised, ["bad value: 5"])

        exception_pauses = [
            data for event, data in self.events
            if event == "debug-paused" and data["event"] == "exception"
        ]
        self.assertEqual(len(exception_pauses), 1)
        completed = [data for event, data in self.events if event == "debug-completed"]
        self.assertEqual(completed[-1]["status"], "exception")

    def test_exception_pause_can_continue_into_a_local_handler(self):
        source = (
            "def target():\n"
            "    try:\n"
            "        int('not a number')\n"
            "    except ValueError:\n"
            "        recovered = True\n"
            "    return recovered\n"
        )
        namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(
            source_info,
            [],
            session_id="caught-exception",
            pause_on_exceptions=True,
        )["success"])

        result = []
        thread = threading.Thread(
            target=lambda: result.append(self.debugger.run_event(namespace["target"]))
        )
        thread.start()
        pause = self._wait_for_pause()
        self.assertEqual(pause["exception"]["type"], "ValueError")
        self.assertTrue(self.debugger.submit_command(
            "caught-exception", "continue"
        )["success"])
        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertEqual(result, [True])

    def test_framework_control_flow_exception_is_ignored_before_tile_exception(self):
        source = (
            "def inner():\n"
            "    raise RuntimeError('user failure')\n"
            "\n"
            "def outer():\n"
            "    return inner()\n"
        )
        namespace, source_info = compile_test_source(source)
        self.assertTrue(self.debugger.arm(
            source_info,
            [],
            session_id="ignore-framework-exception",
            pause_on_exceptions=True,
        )["success"])

        class FrameworkControlFlow(Exception):
            pass

        def framework_wrapper():
            try:
                raise FrameworkControlFlow()
            except FrameworkControlFlow:
                pass
            return namespace["outer"]()

        raised = []

        def run_target():
            try:
                self.debugger.run_event(framework_wrapper)
            except RuntimeError as ex:
                raised.append(str(ex))

        thread = threading.Thread(target=run_target)
        thread.start()
        pause = self._wait_for_pause()

        self.assertEqual(pause["exception"]["type"], "RuntimeError")
        self.assertEqual(pause["function"], "inner")
        self.assertEqual(pause["line"], 2)
        self.assertEqual(len([
            data for event, data in self.events if event == "debug-paused"
        ]), 1)

        self.assertTrue(self.debugger.submit_command(
            "ignore-framework-exception", "continue"
        )["success"])
        thread.join(2)
        self.assertFalse(thread.is_alive())
        self.assertEqual(raised, ["user failure"])


if __name__ == "__main__":
    unittest.main()
