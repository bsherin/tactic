import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "main_container_env"))

from notebook_ai_context import build_notebook_background  # noqa: E402


class NotebookAIContextTests(unittest.TestCase):
    def test_includes_only_code_fields_and_excludes_active_cell(self):
        context = build_notebook_background({
            "kind": "notebook",
            "active_editor": {"identifier": "active"},
            "cells": [
                {
                    "identifier": "earlier",
                    "execution_count": 2,
                    "code": "value = prepare_data()",
                    "output_dict": {"text": "private output must not appear"},
                },
                {"identifier": "active", "execution_count": 3, "code": "active_secret = 1"},
            ],
        })
        self.assertIn("value = prepare_data()", context)
        self.assertNotIn("private output", context)
        self.assertNotIn("active_secret", context)

    def test_executed_cells_win_when_budget_is_limited(self):
        context = build_notebook_background({
            "kind": "notebook",
            "cells": [
                {"identifier": "draft", "execution_count": 0, "code": "DRAFT_MARKER = " + "d" * 80},
                {"identifier": "ran", "execution_count": 7, "code": "EXECUTED_MARKER = " + "e" * 30},
            ],
        }, max_chars=260)
        self.assertIn("EXECUTED_MARKER", context)
        self.assertNotIn("DRAFT_MARKER", context)
        self.assertLessEqual(len(context), 260)

    def test_selected_cells_are_rendered_in_notebook_order(self):
        context = build_notebook_background({
            "kind": "notebook",
            "cells": [
                {"identifier": "first", "execution_count": 1, "code": "FIRST = 1"},
                {"identifier": "second", "execution_count": 2, "code": "SECOND = 2"},
            ],
        })
        self.assertLess(context.index("FIRST = 1"), context.index("SECOND = 2"))

    def test_large_single_cell_is_bounded(self):
        context = build_notebook_background({
            "kind": "notebook",
            "cells": [
                {"identifier": "large", "execution_count": 1, "code": "x" * 5_000},
            ],
        }, max_chars=300)
        self.assertLessEqual(len(context), 300)
        self.assertIn("</NOTEBOOK_CELL>", context)

    def test_rejects_other_context_kinds(self):
        self.assertEqual(build_notebook_background({"kind": "tile", "cells": []}), "")


if __name__ == "__main__":
    unittest.main()
