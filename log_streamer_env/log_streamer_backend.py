import threading
import docker

from tactic_logging import log

from docker_functions import get_log, get_container

from qworker_alt import close_connection, simple_uid

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

def bytes_to_string(bstr):
    if isinstance(bstr, bytes):
        return bstr.decode()
    else:
        return bstr

def get_container_log(cont_id, session_start_ms=None):
    since = session_start_ms / 1000 if session_start_ms else None
    log_text = bytes_to_string(get_log(cont_id, since=since))
    return log_text


class LogTailer:
    def __init__(self, ls_worker, local_id, sc_id, cont_id, session_start_ms=None):
        self.ls_worker = ls_worker
        self.sc_id = sc_id
        self.local_id = local_id
        self.cont_id = cont_id
        self.session_start_ms = session_start_ms
        self.cont = get_container(cont_id)
        self._stop = threading.Event()
        self._t = None

    def start(self):
        if self._t and self._t.is_alive():
            return
        self._t = threading.Thread(target=self._run, name=simple_uid(), daemon=True)
        self._t.start()

    def stop(self, timeout=3):
        self._stop.set()
        if self._t:
            self._t.join(timeout=timeout)

    def send_fn(self, msg):
        base_data = {"console_message": "updateLog", "local_id": self.local_id,
                     "container_id": self.cont_id, "new_line": msg, "sc_id": self.sc_id}
        self.ls_worker.emit_to_client("searchable-console-message", base_data)

    def _run(self):
        since = self.session_start_ms / 1000 if self.session_start_ms else None
        if self.cont is not None:
            for line in self.cont.logs(stream=True, tail=0, since=since):
                # Shouldn't do anything here that will cause something to be entered in the log of a
                # container being streamed. That will give an infinite loop.
                if self._stop.is_set():
                    return
                self.send_fn(line.decode())
        else:
            log.error("self.cont was None")
        self.send_fn("stream exited")
        close_connection()
        log.debug("exiting")