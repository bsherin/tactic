import sys
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY_ROOT / "pool_container_s3_env"))

from pool_event_coalescer import PoolEventCoalescer, username_from_s3_key  # noqa: E402


class PoolEventCoalescerTests(unittest.TestCase):
    def test_extracts_username_only_from_user_pool_keys(self):
        self.assertEqual(username_from_s3_key("users/alice/data/file.parquet"), "alice")
        self.assertEqual(username_from_s3_key("/users/bob/file.txt"), "bob")
        self.assertIsNone(username_from_s3_key("repository/file.txt"))
        self.assertIsNone(username_from_s3_key("users/alice"))

    def test_many_events_for_one_user_become_one_trailing_refresh(self):
        coalescer = PoolEventCoalescer(quiet_seconds=2, max_delay_seconds=10)
        coalescer.mark("alice", now=0)
        coalescer.mark("alice", now=1)
        coalescer.mark("alice", now=2)

        self.assertEqual(coalescer.pop_due(now=3.9), [])
        self.assertEqual(
            coalescer.pop_due(now=4),
            [self.refresh("alice", 3)],
        )

    def test_users_are_coalesced_independently(self):
        coalescer = PoolEventCoalescer(quiet_seconds=2, max_delay_seconds=10)
        coalescer.mark("alice", event_count=4, now=0)
        coalescer.mark("bob", event_count=2, now=1)

        self.assertEqual(coalescer.pop_due(now=2), [self.refresh("alice", 4)])
        self.assertEqual(coalescer.pending_users, {"bob"})
        self.assertEqual(coalescer.pop_due(now=3), [self.refresh("bob", 2)])

    def test_continuous_activity_flushes_at_maximum_delay(self):
        coalescer = PoolEventCoalescer(quiet_seconds=2, max_delay_seconds=10)
        coalescer.mark("alice", now=0)
        coalescer.mark("alice", now=9.5)

        self.assertEqual(coalescer.pop_due(now=9.9), [])
        self.assertEqual(coalescer.pop_due(now=10), [self.refresh("alice", 2)])

    def test_next_poll_does_not_delay_pending_refresh(self):
        coalescer = PoolEventCoalescer(quiet_seconds=2, max_delay_seconds=10)
        self.assertEqual(coalescer.next_wait_seconds(20, now=0), 20)

        coalescer.mark("alice", now=0)
        self.assertEqual(coalescer.next_wait_seconds(20, now=0.2), 2)
        self.assertEqual(coalescer.next_wait_seconds(20, now=1.2), 1)

    @staticmethod
    def refresh(username, event_count):
        from pool_event_coalescer import CoalescedPoolRefresh

        return CoalescedPoolRefresh(username, event_count)


if __name__ == "__main__":
    unittest.main()
