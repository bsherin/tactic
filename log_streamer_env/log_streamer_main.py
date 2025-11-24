
import os
if os.environ.get("DEBUG_LOG_STREAMER", "False").lower() == "true":
    print("got debug mode")
    import pydevd_pycharm
    pydevd_pycharm.settrace('host.docker.internal', port=21000)

from flask import Flask
import time
import uuid
from qworker_alt import QWorker, task_worthy
from exception_mixin import ExceptionMixin
from docker_functions import get_container
import exception_mixin

from log_streamer_backend import LogTailer, get_container_log

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    from log_streamer_backend_ecs import ECSLogTailer, get_container_log_ecs

class LogStreamer(QWorker, ExceptionMixin):
    def __init__(self):
        QWorker.__init__(self, service_name="log_streamer", special_id="log_streamer_1")
        self.tailers = {}
        return

    @task_worthy
    def get_container_log(self, data):
        cont_id = data["cont_id"]
        local_id = data["local_id"]
        is_ecs = get_container(cont_id) is None
        if "since" in data and data["since"] is not None:
            dt = datetime.datetime.fromtimestamp(data["since"] / 1000)
        else:
            dt = None
        if is_ecs:
            if use_ecs:
                log_text = get_container_log_ecs(cont_id)
            else:
                log_text = "container not found getting log"
        else:
            log_text = get_container_log(cont_id, dt)
        if "max_lines" in data and data["max_lines"] is not None:
            ltlist = log_text.split("\n")[-1 * data["max_lines"]:]
            log_text = "\n".join(ltlist)
        return {"success": True, "log_text": log_text, "local_id": local_id}

    def emit_to_client(self, message, data):
        if "room" in data and not "local_id" in data:
            data["local_id"] = data["room"]
        data["message"] = message
        self.ask_host("emit_to_client", data)

    def ask_host(self, msg_type, task_data=None):
        self.post_task("host", msg_type, task_data)
        return

    @task_worthy
    def start_log_stream(self, data):
        sc_id = data["sc_id"]
        local_id = data["local_id"]
        cont_id = data["cont_id"]
        if cont_id.startswith("log_streamer"):
            return {"success": False, "message": "can't stream the log streamer"}
        is_ecs = get_container(cont_id) is None
        stream_id = sc_id
        stream_info = {"stream_id": stream_id, "stream_host": self.my_id}
        try:
            if is_ecs:
                if use_ecs:
                    new_tailer = ECSLogTailer(self, local_id, sc_id, cont_id)
                else:
                    return {"success": False, "message": "container not found starting stream"}
            else:
                new_tailer = LogTailer(self, local_id, sc_id, cont_id)

            self.tailers[stream_id] = new_tailer
            new_tailer.start()
        except Exception as e:
            import traceback
            print("ERROR in start_log_stream:", e)
            print(traceback.format_exc())
            return {"success": False, "message": f"error starting log stream: {e}"}
        return {"success": True, "stream_info": stream_info, "local_id": local_id}

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