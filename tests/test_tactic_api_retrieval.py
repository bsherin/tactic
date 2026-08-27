import json
import sys
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY_ROOT / "shared_python"))

from tactic_api_retrieval import (  # noqa: E402
    build_legacy_api_context,
    build_relevant_api_context,
    select_api_entries,
)


class TacticAPIRetrievalTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads(
            (REPOSITORY_ROOT / "shared_python" / "tactic_api_catalog.json").read_text(
                encoding="utf-8"
            )
        )

    def test_self_partial_selects_receiver_aware_tile_methods(self):
        context = build_relevant_api_context(
            self.catalog,
            "names = self.get_doc",
            scope="tile",
        )
        self.assertIn("self.get_document_names()", context)
        self.assertNotIn("Library.lists", context)
        self.assertNotIn("- get_document_names()", context)

    def test_library_chain_selects_object_oriented_method(self):
        context = build_relevant_api_context(
            self.catalog,
            "names = Library.lists.na",
            scope="notebook",
        )
        self.assertIn(
            "Library.lists.names(tag_filter=None, search_filter=None)",
            context,
        )
        self.assertNotIn("self.names", context)

    def test_alternate_collection_receiver_is_preferred_near_cursor(self):
        context = build_relevant_api_context(
            self.catalog,
            "result = self.collection.col",
            scope="tile",
        )
        self.assertIn(
            "- self.collection.column(column_name) | Collection.column(column_name)",
            context,
        )

    def test_handler_definition_is_selected_only_for_tile_scope(self):
        tile_context = build_relevant_api_context(
            self.catalog,
            "def handle_button",
            scope="tile",
        )
        notebook_context = build_relevant_api_context(
            self.catalog,
            "def handle_button",
            scope="notebook",
        )
        self.assertIn(
            "def handle_button_click(self, value, doc_name, active_row_index)",
            tile_context,
        )
        self.assertEqual(notebook_context, "")

    def test_non_python_editor_gets_no_python_api_context(self):
        context = build_relevant_api_context(
            self.catalog,
            "const names = Library.lists.na",
            scope="tile",
            language="javascript",
        )
        self.assertEqual(context, "")

    def test_irrelevant_code_does_not_add_catalog_tokens(self):
        context = build_relevant_api_context(
            self.catalog,
            "value = 1 + 2\n",
            scope="tile",
        )
        self.assertEqual(context, "")

    def test_entry_and_character_budgets_are_enforced(self):
        entries = select_api_entries(
            self.catalog,
            "documents = ",
            scope="tile",
            max_entries=3,
        )
        context = build_relevant_api_context(
            self.catalog,
            "documents = ",
            scope="tile",
            max_entries=3,
            max_chars=700,
        )
        self.assertLessEqual(len(entries), 3)
        self.assertLessEqual(len(context), 700)
        self.assertLessEqual(
            sum(1 for line in context.splitlines() if line.startswith("- ")),
            3,
        )

    def test_legacy_fallback_does_not_duplicate_method_names(self):
        response = {
            "ordered_api_categories": ["Data Access"],
            "api_dict_by_category": {
                "Data Access": [{
                    "name": "get_document_names",
                    "signature": "get_document_names()",
                }],
            },
        }
        self.assertEqual(
            build_legacy_api_context(response),
            "- get_document_names()",
        )


if __name__ == "__main__":
    unittest.main()
