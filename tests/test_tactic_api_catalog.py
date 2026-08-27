import json
import sys
import tempfile
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY_ROOT / "shared_python"))

from tactic_api_catalog import (  # noqa: E402
    build_catalog,
    catalog_to_legacy,
    load_catalog,
    validate_catalog,
)


DOCS_DIR = REPOSITORY_ROOT.parent / "tacticdocs" / "docs"


class TacticAPICatalogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = build_catalog(DOCS_DIR)
        cls.by_id = {entry["id"]: entry for entry in cls.catalog["entries"]}

    def test_tile_method_has_explicit_self_receiver(self):
        entry = self.by_id["tile.TileBase.get_document_names"]
        self.assertEqual(entry["receiver"], "self")
        self.assertEqual(entry["canonical"], "self.get_document_names()")
        self.assertIn("gdn", entry["aliases"])

    def test_library_chain_has_explicit_types_and_access_paths(self):
        library = self.by_id["object.global.Library"]
        lists = self.by_id["object.TacticLibrary.lists"]
        names = self.by_id["object.TacticListSet.names"]

        self.assertEqual(library["value_type"], "TacticLibrary")
        self.assertEqual(library["access_paths"], ["Library"])
        self.assertEqual(lists["value_type"], "TacticListSet")
        self.assertEqual(names["receiver"], "Library.lists")
        self.assertEqual(
            names["canonical"],
            "Library.lists.names(tag_filter=None, search_filter=None)",
        )

    def test_global_commands_are_not_prefixed_with_self(self):
        entry = self.by_id["tile.global.global_import"]
        self.assertIsNone(entry["receiver"])
        self.assertEqual(entry["canonical"], "global_import(module_name)")

    def test_handler_arguments_preserve_legacy_shape(self):
        legacy = catalog_to_legacy(self.catalog)
        self.assertEqual(
            legacy["handler_methods"]["handle_button_click"],
            "value, doc_name, active_row_index",
        )

    def test_legacy_tile_dictionary_remains_available(self):
        legacy = catalog_to_legacy(self.catalog)
        data_access = legacy["api_dict_by_category"]["Data Access"]
        entry = next(item for item in data_access if item["name"] == "get_document_names")
        self.assertEqual(entry["signature"], "get_document_names()")
        self.assertIn("document names", entry["body"])

    def test_packaged_catalog_matches_current_docs(self):
        packaged = load_catalog()
        self.assertEqual(packaged["source_hash"], self.catalog["source_hash"])
        self.assertEqual(len(packaged["entries"]), len(self.catalog["entries"]))

    def test_catalog_round_trip_validation(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "catalog.json"
            path.write_text(json.dumps(self.catalog), encoding="utf-8")
            self.assertEqual(
                validate_catalog(json.loads(path.read_text(encoding="utf-8")))["schema_version"],
                1,
            )


if __name__ == "__main__":
    unittest.main()
