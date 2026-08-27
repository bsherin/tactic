import sys
import threading
import types
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY_ROOT / "shared_python"))

try:
    import pika  # noqa: F401
except ModuleNotFoundError:
    pika = types.ModuleType("pika")
    pika.exceptions = types.SimpleNamespace(AMQPError=Exception)
    pika.BasicProperties = lambda **kwargs: kwargs
    sys.modules["pika"] = pika


class FakeLog:
    def __getattr__(self, _name):
        return lambda *args, **kwargs: None


rabbit_manage = types.ModuleType("rabbit_manage")
rabbit_manage.get_pika_connection_with_retries = lambda *_args, **_kwargs: (None, None)
rabbit_manage.declare_queue = lambda *_args, **_kwargs: None
sys.modules.setdefault("rabbit_manage", rabbit_manage)

exception_mixin = types.ModuleType("exception_mixin")
exception_mixin.ExceptionMixin = type("ExceptionMixin", (), {})
exception_mixin.MessagePostException = type("MessagePostException", (Exception,), {})
sys.modules.setdefault("exception_mixin", exception_mixin)

tactic_logging = types.ModuleType("tactic_logging")
tactic_logging.bind_request = lambda *_args, **_kwargs: MagicMock()
tactic_logging.new_task_id = lambda: "test-task"
tactic_logging.log = FakeLog()
sys.modules.setdefault("tactic_logging", tactic_logging)

service_controls = types.ModuleType("service_controls")
service_controls.CONTROL_EXCHANGE = "control"
service_controls.process_control_message = lambda _message: None
sys.modules.setdefault("service_controls", service_controls)

import qworker_alt  # noqa: E402


class FakeConnection:
    def __init__(self):
        self.is_closed = False

    def close(self):
        self.is_closed = True


class QWorkerInterruptTests(unittest.TestCase):
    def setUp(self):
        self.original_thread = qworker_alt.thread
        self.original_connections = qworker_alt.pika_connections
        self.original_channels = qworker_alt.pika_channels
        qworker_alt.pika_connections = {}
        qworker_alt.pika_channels = {}

    def tearDown(self):
        qworker_alt.thread = self.original_thread
        qworker_alt.pika_connections = self.original_connections
        qworker_alt.pika_channels = self.original_channels

    def test_interrupt_closes_interrupted_worker_connection_not_callers(self):
        interrupted_thread = threading.Thread(name="tile-worker")
        caller_thread_name = threading.current_thread().name
        interrupted_connection = FakeConnection()
        caller_connection = FakeConnection()
        qworker_alt.thread = interrupted_thread
        qworker_alt.pika_connections.update({
            interrupted_thread.name: interrupted_connection,
            caller_thread_name: caller_connection,
        })
        qworker_alt.pika_channels.update({
            interrupted_thread.name: object(),
            caller_thread_name: object(),
        })

        worker = qworker_alt.QWorker.__new__(qworker_alt.QWorker)
        with patch.object(qworker_alt, "stop_thread") as stop_thread, \
                patch.object(worker, "start") as start:
            worker.interrupt_and_restart()

        stop_thread.assert_called_once_with(interrupted_thread)
        start.assert_called_once_with()
        self.assertTrue(interrupted_connection.is_closed)
        self.assertFalse(caller_connection.is_closed)
        self.assertNotIn(interrupted_thread.name, qworker_alt.pika_connections)
        self.assertNotIn(interrupted_thread.name, qworker_alt.pika_channels)
        self.assertIs(qworker_alt.pika_connections[caller_thread_name], caller_connection)
        self.assertIsNone(qworker_alt.thread)


if __name__ == "__main__":
    unittest.main()
