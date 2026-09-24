import math
import time
from dataclasses import dataclass


@dataclass(frozen=True)
class CoalescedPoolRefresh:
    username: str
    event_count: int


@dataclass
class _PendingRefresh:
    first_seen: float
    last_seen: float
    event_count: int


def username_from_s3_key(key):
    """Return the pool owner for keys below users/<username>/... ."""
    parts = (key or "").lstrip("/").split("/")
    if len(parts) < 3 or parts[0] != "users" or not parts[1]:
        return None
    return parts[1]


class PoolEventCoalescer:
    """Collapse S3 object bursts into per-user pool refreshes."""

    def __init__(self, quiet_seconds=2.0, max_delay_seconds=10.0, clock=None):
        if quiet_seconds <= 0:
            raise ValueError("quiet_seconds must be positive")
        if max_delay_seconds < quiet_seconds:
            raise ValueError("max_delay_seconds must be at least quiet_seconds")

        self.quiet_seconds = float(quiet_seconds)
        self.max_delay_seconds = float(max_delay_seconds)
        self.clock = clock or time.monotonic
        self._pending = {}

    def mark(self, username, event_count=1, now=None):
        if not username or event_count <= 0:
            return

        timestamp = self.clock() if now is None else now
        pending = self._pending.get(username)
        if pending is None:
            self._pending[username] = _PendingRefresh(
                first_seen=timestamp,
                last_seen=timestamp,
                event_count=event_count,
            )
            return

        pending.last_seen = timestamp
        pending.event_count += event_count

    def pop_due(self, now=None, force=False):
        timestamp = self.clock() if now is None else now
        due = []

        for username, pending in list(self._pending.items()):
            quiet_for = timestamp - pending.last_seen
            pending_for = timestamp - pending.first_seen
            if force or quiet_for >= self.quiet_seconds or pending_for >= self.max_delay_seconds:
                due.append(CoalescedPoolRefresh(username, pending.event_count))
                del self._pending[username]

        return due

    def next_wait_seconds(self, max_wait_seconds=20, now=None):
        """Choose an SQS long-poll duration without delaying a due refresh."""
        if not self._pending:
            return int(max_wait_seconds)

        timestamp = self.clock() if now is None else now
        next_due = min(
            min(
                pending.last_seen + self.quiet_seconds,
                pending.first_seen + self.max_delay_seconds,
            )
            for pending in self._pending.values()
        )
        delay = max(0.0, next_due - timestamp)
        return max(1, min(int(max_wait_seconds), int(math.ceil(delay))))

    @property
    def pending_users(self):
        return set(self._pending)
