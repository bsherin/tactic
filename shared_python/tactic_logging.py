import logging, os, sys, uuid
import structlog
from contextvars import ContextVar
from contextlib import contextmanager

task_id_var = ContextVar("request_id", default=None)
task_stage_var = ContextVar("task_stage", default=None)
service_var    = ContextVar("service", default=None)
task_type_var   = ContextVar("task_type", default=None)

for noisy in ("pymongo", "pika", "gevent", "engineio", "socketio", "geventwebsocket",
              "urllib3", "botocore"):
    logging.getLogger(noisy).setLevel(logging.WARNING)

def _add_contextvars(_, __, event_dict):
    event_dict["service_name"] = service_var.get() or os.getenv("SERVICE_NAME")
    task_id = task_id_var.get()
    task_stage = task_stage_var.get()
    task_type = task_type_var.get()
    event_dict["task_id"] = task_id if task_id is not None else "unknown"
    event_dict["task_stage"] = task_stage if task_stage is not None else "unknown"
    event_dict["task_type"] = task_type if task_type is not None else "unknown"
    event_dict["project"] = "tactic"
    return event_dict

def setup_logging(service_name: str):
    service_var.set(service_name)
    task_stage_var.set("init")
    task_type_var.set("startup")
    task_id_var.set("startup")
    os.environ["SERVICE_NAME"] = service_name

    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=level)

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.add_log_level,
            _add_contextvars,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ],
        #wrapper_class=structlog.make_filtering_bound_logger(getattr(logging, level, logging.INFO)),
        wrapper_class=structlog.stdlib.BoundLogger,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
    log.info("logging_setup_complete", service_name=service_name, log_level=level)

def new_task_id() -> str:
    return str(uuid.uuid4())

@contextmanager
def bind_request(task_id: str | None = None, task_stage: str | None = None, task_type: str | None = None):
    tok1 = task_id_var.set(task_id)
    tok2 = task_stage_var.set(task_stage)
    tok3 = task_type_var.set(task_type)
    try:
        yield
    finally:
        task_id_var.reset(tok1)
        task_stage_var.reset(tok2)
        task_type_var.reset(tok3)

log = structlog.get_logger()