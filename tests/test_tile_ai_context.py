import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "module_viewer_container_env"))

from tile_ai_context import prepare_tile_context  # noqa: E402


class TileAIContextTests(unittest.TestCase):
    def setUp(self):
        self.tile = {
            "globals_info": {"name": "globals", "codeText": "import pandas as pd"},
            "render_content_info": {"name": "render_content", "codeText": "return self.value"},
            "user_methods": [
                {"identifier": "method-1", "name": "calculate", "codeText": "return 42"},
                {"identifier": "method-2", "name": "format_value", "codeText": "return str(value)"},
            ],
            "used_handler_methods": [],
            "javascript_functions": [
                {"identifier": "js-1", "name": "draw", "codeText": "return value;"},
            ],
        }

    def test_redacts_only_active_python_method(self):
        prepared = prepare_tile_context({
            "kind": "tile",
            "tile": self.tile,
            "active_editor": {
                "group": "user_methods",
                "identifier": "method-1",
                "name": "calculate",
                "mode": "python",
            },
        })
        self.assertIn("Active Python editor", prepared["user_methods"][0]["codeText"])
        self.assertEqual(prepared["user_methods"][1]["codeText"], "return str(value)")
        self.assertEqual(self.tile["user_methods"][0]["codeText"], "return 42")

    def test_redacts_javascript_editor(self):
        prepared = prepare_tile_context({
            "kind": "tile",
            "tile": self.tile,
            "active_editor": {
                "group": "javascript_functions",
                "identifier": "js-1",
                "mode": "javascript",
            },
        })
        self.assertTrue(prepared["javascript_functions"][0]["codeText"].startswith("//"))

    def test_unknown_editor_does_not_send_unredacted_tile(self):
        prepared = prepare_tile_context({
            "kind": "tile",
            "tile": self.tile,
            "active_editor": {"group": "user_methods", "identifier": "missing"},
        })
        self.assertIsNone(prepared)


if __name__ == "__main__":
    unittest.main()
