import threading
import time


class ExecutionMonitor:
    """Thread-safe view of the event currently occupying a tile worker."""

    def __init__(self, clock=None):
        self.clock = clock or time.monotonic
        self._lock = threading.Lock()
        self._token = None
        self._task_type = None
        self._task_id = None
        self._started_at = None

    def start(self, task_type, task_id=None):
        token = object()
        with self._lock:
            self._token = token
            self._task_type = task_type
            self._task_id = task_id
            self._started_at = self.clock()
        return token

    def finish(self, token):
        with self._lock:
            if self._token is not token:
                return
            self._token = None
            self._task_type = None
            self._task_id = None
            self._started_at = None

    def snapshot(self):
        with self._lock:
            if self._token is None:
                return {
                    "execution_active": False,
                    "execution_task_type": None,
                    "execution_task_id": None,
                    "execution_duration_secs": 0,
                }
            return {
                "execution_active": True,
                "execution_task_type": self._task_type,
                "execution_task_id": self._task_id,
                "execution_duration_secs": max(0, self.clock() - self._started_at),
            }
