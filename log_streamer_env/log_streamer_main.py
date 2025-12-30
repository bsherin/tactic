
from tactic_logging import setup_logging, log
setup_logging("log_streamer")
log.info("starting", extra_flag=True)

try:
    from flask import Flask
    import time
    from qworker_alt import QWorker, task_worthy
    from exception_mixin import ExceptionMixin
    from docker_functions import get_container
    import exception_mixin
    from aws_detection import on_aws

    from log_streamer_backend import LogTailer, get_container_log

    if on_aws:
        from log_streamer_backend_ecs import ECSLogTailer, get_container_log_ecs
except Exception:
    log.exception("*** fatal error during imports in log_streamer ***")
    log.critical("*** exiting log_streamer due to fatal error ***")
    raise

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
            if on_aws:
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
                if on_aws:
                    new_tailer = ECSLogTailer(self, local_id, sc_id, cont_id)
                else:
                    return {"success": False, "message": "container not found starting stream"}
            else:
                new_tailer = LogTailer(self, local_id, sc_id, cont_id)

            self.tailers[stream_id] = new_tailer
            new_tailer.start()
        except Exception as e:
            log.exception("error starting log stream")
            return {"success": False, "message": f"error starting log stream: {e}"}
        return {"success": True, "stream_info": stream_info, "local_id": local_id}

    @task_worthy
    def stop_log_stream(self, data):
        streamer_id = data["streamer_id"]
        if streamer_id in self.tailers:
            self.tailers[streamer_id].stop()
            del self.tailers[streamer_id]


if __name__ == "__main__":
    try:
        app = Flask(__name__)
        exception_mixin.app = app
        log.info("entering log streamer main")
        mworker = LogStreamer()
        log.info("LogSTreamer is created", my_id=mworker.my_id)
        mworker.start()
        log.info("mworker started", my_id=mworker.my_id)
    except Exception:
        log.exception("*** fatal error starting log_streamer ***")
        log.critical("*** exiting due to fatal error ***")
        raise
    while True:
        time.sleep(1000)