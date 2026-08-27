import ast
import sys
import unittest
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "module_viewer_container_env"))

from tile_code_parser import (  # noqa: E402
    TileParser,
    prepare_user_methods_for_render,
    prepare_user_methods_for_tile_maker,
)


MODULE_CODE = '''@user_tile
class DividerTile(TileBase):
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        pass

    @property
    def options(self):
        return []

    def before(self):
        return 1

    # tactic:user-method-divider: Data preparation

    def after(self):
        # tactic:user-method-divider: This is inside a method
        return 2

    def placeholder_divider(self):
        pass

    def divider_renderer(self):
        return "<hr>"

    def render_content(self):
        return "done"
'''


class TileCodeParserDividerTests(unittest.TestCase):
    def setUp(self):
        self.parser = TileParser(MODULE_CODE, [])

    def test_explicit_divider_is_merged_with_methods_in_source_order(self):
        entries = self.parser.get_user_methods_list()

        self.assertEqual(
            [entry["name"] for entry in entries],
            ["before", "Data preparation", "after", "placeholder_divider", "divider_renderer"],
        )
        self.assertEqual(entries[1]["kind"], "divider")
        self.assertNotIn("method_body", entries[1])

    def test_marker_inside_method_body_is_ignored(self):
        divider_names = [
            entry["name"] for entry in self.parser.get_user_methods_list()
            if entry["kind"] == "divider" and not entry.get("legacy")
        ]

        self.assertEqual(divider_names, ["Data preparation"])

    def test_inert_legacy_divider_is_safe_to_migrate(self):
        entry = next(
            entry for entry in self.parser.get_user_methods_list()
            if entry["name"] == "placeholder_divider"
        )

        self.assertEqual(entry["kind"], "divider")
        self.assertTrue(entry["legacy"])
        self.assertFalse(entry["preserve_as_method"])

    def test_bare_name_legacy_placeholder_is_safe_to_migrate(self):
        node = ast.parse("def old_divider(self):\n    path\n").body[0]

        self.assertTrue(TileParser.is_inert_legacy_divider(node))

    def test_meaningful_legacy_divider_is_preserved_as_a_method(self):
        entry = next(
            entry for entry in self.parser.get_user_methods_list()
            if entry["name"] == "divider_renderer"
        )

        self.assertEqual(entry["kind"], "divider")
        self.assertTrue(entry["legacy"])
        self.assertTrue(entry["preserve_as_method"])

    def test_template_emits_a_parseable_divider_comment(self):
        environment = Environment(
            loader=FileSystemLoader(ROOT / "module_viewer_container_env" / "templates"),
            autoescape=True,
        )
        environment.filters["pyrepr"] = repr
        template = environment.get_template("tile_creator_template.html")
        rendered = template.render(
            globals_code="",
            class_name="GeneratedTile",
            category="none",
            exports=[],
            couple_save_attrs_and_exports=False,
            additional_save_attrs=[],
            options=[],
            widgets=[],
            jscript_functions=[],
            user_methods=[
                {"kind": "divider", "name": "Research & development"},
                {
                    "kind": "method",
                    "name": "calculate",
                    "arg_string": "",
                    "method_body": "        return 1",
                },
            ],
            used_handler_methods=[],
            standard_methods=[{
                "name": "render_content",
                "arg_string": "",
                "method_body": "        return 'done'",
            }],
        )

        self.assertIn(
            "    # tactic:user-method-divider: Research & development",
            rendered,
        )
        entries = TileParser(rendered, []).get_user_methods_list()
        self.assertEqual([entry["name"] for entry in entries], ["Research & development", "calculate"])

    def test_render_preparation_converts_new_dividers_but_preserves_legacy_code(self):
        entries = prepare_user_methods_for_render([
            {"kind": "divider", "name": "Data\npreparation"},
            {
                "kind": "divider",
                "name": "divider_renderer",
                "preserve_as_method": True,
                "argString": "size=1",
                "codeText": "return size",
            },
        ])

        self.assertEqual(entries[0], {"kind": "divider", "name": "Data preparation"})
        self.assertEqual(entries[1]["kind"], "method")
        self.assertEqual(entries[1]["arg_string"], ", size=1")
        self.assertIn("return size", entries[1]["method_body"])

    def test_tile_maker_preparation_keeps_dividers_out_of_code_editors(self):
        entries = prepare_user_methods_for_tile_maker(self.parser.get_user_methods_list())
        explicit = next(entry for entry in entries if entry["name"] == "Data preparation")
        inert_legacy = next(entry for entry in entries if entry["name"] == "placeholder_divider")
        meaningful_legacy = next(entry for entry in entries if entry["name"] == "divider_renderer")

        self.assertNotIn("codeText", explicit)
        self.assertNotIn("codeText", inert_legacy)
        self.assertTrue(meaningful_legacy["preserve_as_method"])
        self.assertIn("return \"<hr>\"", meaningful_legacy["codeText"])


if __name__ == "__main__":
    unittest.main()
