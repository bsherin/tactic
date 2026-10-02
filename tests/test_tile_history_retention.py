import datetime
import sys
import types
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "shared_python"))
sys.path.insert(0, str(ROOT / "shared_mongo_python"))

if "bson" not in sys.modules:
    bson_stub = types.ModuleType("bson")
    bson_stub.ObjectId = object
    sys.modules["bson"] = bson_stub

from tile_accesser import TileAccess  # noqa: E402


class TileHistoryRetentionTests(unittest.TestCase):
    def test_recent_history_keeps_all_of_today_and_yesterday_and_latest_of_older_days(self):
        timezone = datetime.timezone.utc
        now = datetime.datetime(2026, 10, 2, 12, tzinfo=timezone)

        def entry(day, hour, **extra):
            return {
                "updated": datetime.datetime(2026, 10, day, hour, tzinfo=timezone),
                "tile_module": f"day-{day}-hour-{hour}",
                **extra,
            }

        history = [
            entry(1, 9),
            entry(1, 17),
            entry(2, 8),
            entry(2, 11),
        ]
        history.extend([
            {"updated": datetime.datetime(2026, 9, 30, 9, tzinfo=timezone), "tile_module": "old-early"},
            {"updated": datetime.datetime(2026, 9, 30, 17, tzinfo=timezone), "tile_module": "old-late"},
        ])

        pruned = TileAccess.prune_recent_history(history, now=now)
        modules = [item["tile_module"] for item in pruned]

        self.assertIn("day-1-hour-9", modules)
        self.assertIn("day-1-hour-17", modules)
        self.assertIn("day-2-hour-8", modules)
        self.assertIn("day-2-hour-11", modules)
        self.assertNotIn("old-early", modules)
        self.assertIn("old-late", modules)

    def test_protected_checkpoint_is_never_pruned(self):
        timezone = datetime.timezone.utc
        now = datetime.datetime(2026, 10, 2, 12, tzinfo=timezone)
        protected = {
            "updated": datetime.datetime(2026, 9, 1, 8, tzinfo=timezone),
            "tile_module": "protected",
            "is_checkpoint": True,
        }
        later_same_day = {
            "updated": datetime.datetime(2026, 9, 1, 18, tzinfo=timezone),
            "tile_module": "daily-latest",
        }

        pruned = TileAccess.prune_recent_history([protected, later_same_day], now=now)

        self.assertEqual(
            {item["tile_module"] for item in pruned},
            {"protected", "daily-latest"},
        )

    def test_new_history_entries_include_metadata_and_checkpoint_message(self):
        updated = datetime.datetime(2026, 10, 2, tzinfo=datetime.timezone.utc)
        doc = {
            "tile_module": "class Example: pass",
            "metadata": {"updated": updated, "tags": "example"},
        }

        checkpoint = TileAccess.build_history_entry(
            doc, message="Explain the change", is_checkpoint=True
        )
        doc["metadata"]["tags"] = "mutated later"

        self.assertEqual(checkpoint["metadata"]["tags"], "example")
        self.assertEqual(checkpoint["message"], "Explain the change")
        self.assertTrue(checkpoint["is_checkpoint"])
        self.assertTrue(checkpoint["history_id"])

    def test_legacy_history_entries_remain_readable(self):
        updated = datetime.datetime(2024, 5, 3, 10, tzinfo=datetime.timezone.utc)

        class LegacyHistoryAccess(TileAccess):
            def get_tile_doc(self, module_name, username=None):
                return {
                    "history": [{"updated": updated, "tile_module": "legacy source"}],
                    "recent_history": [{"updated": updated, "tile_module": "duplicate autosave"}],
                }

            @staticmethod
            def get_timestrings(value):
                return "May 03, 10:00", value.strftime("%Y%m%d%H%M%S")

            @staticmethod
            def simple_process_metadata(metadata):
                return metadata

        checkpoint = LegacyHistoryAccess().get_checkpoint_history("LegacyTile", include_code=True)[0]

        self.assertEqual(checkpoint["tile_module"], "legacy source")
        self.assertEqual(checkpoint["message"], "")
        self.assertTrue(checkpoint["is_checkpoint"])
        self.assertFalse(checkpoint["metadata_available"])

    def test_checkpoints_in_the_same_minute_have_distinct_ids_and_labels(self):
        first = datetime.datetime(2026, 10, 2, 10, 15, 5, 123000, tzinfo=datetime.timezone.utc)
        second = datetime.datetime(2026, 10, 2, 10, 15, 42, 456000, tzinfo=datetime.timezone.utc)

        class SameMinuteHistoryAccess(TileAccess):
            def get_tile_doc(self, module_name, username=None):
                return {"history": [
                    {"updated": first, "tile_module": "first"},
                    {"updated": second, "tile_module": "second"},
                ]}

            @staticmethod
            def get_timestrings(value):
                return "Oct 02, 10:15", value.strftime("%Y%m%d%H%M%S")

        checkpoints = SameMinuteHistoryAccess().get_checkpoint_history("Example")

        self.assertEqual(len({item["checkpoint_id"] for item in checkpoints}), 2)
        self.assertEqual(
            {item["updatestring_detailed"] for item in checkpoints},
            {"Oct 02, 10:15:05.123", "Oct 02, 10:15:42.456"},
        )


if __name__ == "__main__":
    unittest.main()
