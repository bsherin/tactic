import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "module_viewer_container_env"))

from tile_history_comparison import build_tile_history_comparison  # noqa: E402


def parsed_tile(**overrides):
    result = {
        "tile_type": "ExampleTile",
        "category": "none",
        "is_mpl": False,
        "globals_info": {"name": "globals", "codeText": "import math", "firstLineNumber": 1},
        "render_content_info": {
            "name": "render_content", "argString": "", "codeText": "return 'ok'",
            "firstLineNumber": 20,
        },
        "option_dict": [],
        "widget_list": [],
        "export_list": [],
        "additional_save_attrs": [],
        "user_methods_list": [],
        "used_handler_methods_list": [],
        "javascript_functions_list": [],
    }
    result.update(overrides)
    return result


class TileHistoryComparisonTests(unittest.TestCase):
    def test_source_locations_do_not_create_false_changes(self):
        current = parsed_tile()
        historical = parsed_tile(
            globals_info={"name": "globals", "codeText": "import math", "firstLineNumber": 99}
        )

        comparison = build_tile_history_comparison(current, historical)
        globals_item = next(
            section for section in comparison["sections"] if section["id"] == "globals"
        )["items"][0]

        self.assertEqual(globals_item["status"], "unchanged")

    def test_methods_are_matched_by_name_and_additions_and_removals_are_explicit(self):
        current = parsed_tile(user_methods_list=[
            {"name": "same", "argString": "value", "codeText": "return value + 1"},
            {"name": "new_name", "argString": "", "codeText": "return 2"},
        ])
        historical = parsed_tile(user_methods_list=[
            {"name": "same", "argString": "value", "codeText": "return value"},
            {"name": "old_name", "argString": "", "codeText": "return 2"},
        ])

        comparison = build_tile_history_comparison(current, historical)
        methods = next(
            section for section in comparison["sections"] if section["id"] == "user_methods"
        )["items"]
        statuses = {item["name"]: item["status"] for item in methods}

        self.assertEqual(statuses, {
            "same": "changed",
            "new_name": "added",
            "old_name": "removed",
        })

    def test_structured_items_are_compared_by_semantic_name_not_position(self):
        one = {"name": "one", "type": "text", "default": "first"}
        two = {"name": "two", "type": "int", "default": 2}
        current = parsed_tile(option_dict=[one, two])
        historical = parsed_tile(option_dict=[two, one])

        comparison = build_tile_history_comparison(current, historical)
        options = next(
            section for section in comparison["sections"] if section["id"] == "options"
        )["items"]

        self.assertEqual([item["status"] for item in options], ["unchanged", "unchanged"])

    def test_dividers_are_not_rendered_as_fake_methods(self):
        divider = {"kind": "divider", "name": "Data preparation", "legacy": False}
        comparison = build_tile_history_comparison(
            parsed_tile(user_methods_list=[divider]),
            parsed_tile(user_methods_list=[]),
        )
        item = next(
            section for section in comparison["sections"] if section["id"] == "user_methods"
        )["items"][0]

        self.assertEqual(item["kind"], "structured")
        self.assertNotIn("def Data preparation", item["current_text"])

    def test_raw_javascript_is_not_wrapped_as_a_named_function(self):
        raw = {"name": "__raw_code__", "codeText": "const answer = 42;", "mode": "javascript"}
        comparison = build_tile_history_comparison(
            parsed_tile(javascript_functions_list=[raw]),
            parsed_tile(javascript_functions_list=[]),
        )
        item = next(
            section for section in comparison["sections"] if section["id"] == "javascript"
        )["items"][0]

        self.assertEqual(item["current_text"], "const answer = 42;")


if __name__ == "__main__":
    unittest.main()
