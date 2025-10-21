from gevent import monkey
monkey.patch_all()
import threading
import docker
import os
import flask_socketio
from flask_socketio import SocketIO

from docker_functions import get_log, container_id, get_container

socketio = SocketIO(
    message_queue="redis://tactic-redis:6379/0",
    channel="socketio",
    logger=False,
    engineio_logger=False,
)

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

def bytes_to_string(bstr):
    if isinstance(bstr, bytes):
        return bstr.decode()
    else:
        return bstr

def get_container_log(cont_id, since=None):
    log_text = bytes_to_string(get_log(cont_id, since=since))
    return log_text


class LogTailer:
    def __init__(self, room, cont_id):
        self.room = room
        self.cont_id = cont_id
        self.cont = get_container(cont_id)
        self._stop = threading.Event()
        self._t = None

    def start(self):
        if self._t and self._t.is_alive():
            return
        self._t = threading.Thread(target=self._run, name=f"tail-{self.room}", daemon=True)
        self._t.start()

    def stop(self, timeout=3):
        self._stop.set()
        if self._t:
            self._t.join(timeout=timeout)

    def send_fn(self, msg):
        base_data = {"message": "updateLog", "container_id": self.cont_id, "new_line": msg}
        socketio.emit("searchable-console-message", base_data, namespace="/main", room=self.room)

    def _run(self):
        if self.cont is not None:
            for line in self.cont.logs(stream=True, tail=0):
                # Shouldn't do anything here that will cause something to be entered in the log of a
                # container being streamed. That will give an infinite loop.
                if self._stop.is_set():
                    return
                self.send_fn(line.decode())
        else:
            print("cont was None")
        self.send_fn("stream exited")
        print("exiting")