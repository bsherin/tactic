from gevent import monkey; monkey.patch_all()
import os
import time
import uuid
from flask import Flask

from qworker import QWorker, task_worthy
from exception_mixin import ExceptionMixin
from docker_functions import get_container
import exception_mixin

from log_streamer_backend import LogTailer, get_container_log

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    from log_streamer_backend_ecs import ECSLogTailer, get_container_log_ecs

class LogStreamer(QWorker, ExceptionMixin):
    def __init__(self):
        QWorker.__init__(self)
        self.tailers = {}
        return

    @task_worthy
    def get_container_log(self, data):
        cont_id = data["cont_id"]
        is_ecs = get_container(cont_id) is None
        print(f"got is_ecs {is_ecs}")
        if "since" in data and data["since"] is not None:
            dt = datetime.datetime.fromtimestamp(data["since"] / 1000)
        else:
            dt = None
        if is_ecs:
            if use_ecs:
                log_text = get_container_log_ecs(cont_id)
            else:
                log_text = "container not found"
        else:
            log_text = get_container_log(cont_id, dt)
        if "max_lines" in data and data["max_lines"] is not None:
            ltlist = log_text.split("\n")[-1 * data["max_lines"]:]
            log_text = "\n".join(ltlist)
        return {"success": True, "log_text": log_text}


    @task_worthy
    def start_log_stream(self, data):
        room = data["room"]
        cont_id = data["cont_id"]
        is_ecs = get_container(cont_id) is None
        print(f"got is_ecs {is_ecs} in start_log_stream")
        streamer_id = room
        if is_ecs:
            if use_ecs:
                new_tailer = ECSLogTailer(room, cont_id)
            else:
                return {"success": False, "message": "container not found"}
        else:
            new_tailer = LogTailer(room, cont_id)

        self.tailers[streamer_id] = new_tailer
        new_tailer.start()
        return {"success": True}

    @task_worthy
    def stop_log_stream(self, data):
        streamer_id = data["streamer_id"]
        if streamer_id in self.tailers:
            self.tailers[streamer_id].stop()
            del self.tailers[streamer_id]


if __name__ == "__main__":
    app = Flask(__name__)
    exception_mixin.app = app
    print("entering main")
    mworker = LogStreamer()
    print("LogSTreamer is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    while True:
        time.sleep(1000)