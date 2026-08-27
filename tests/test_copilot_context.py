import sys
import unittest
from pathlib import Path
from types import SimpleNamespace


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "shared_python"))

from copilot_context import (  # noqa: E402
    DEFAULT_COPILOT_MODEL,
    build_completion_input,
    extract_response_usage,
    limit_background_context,
    normalize_copilot_model,
    split_code_at_cursor,
)


class CopilotContextTests(unittest.TestCase):
    def test_cursor_is_preserved_in_middle_of_line(self):
        prefix, suffix = split_code_at_cursor("alpha = bravo\nnext_line()", 9)
        self.assertEqual(prefix, "alpha = b")
        self.assertEqual(suffix, "ravo\nnext_line()")

    def test_context_line_limits_keep_nearest_text(self):
        code = "one\ntwo\nthree\nfour\nfive"
        prefix, suffix = split_code_at_cursor(code, code.index("three") + 2,
                                              before_lines=2, after_lines=1)
        self.assertEqual(prefix, "two\nth")
        self.assertEqual(suffix, "ree\nfour\n")

    def test_unknown_model_falls_back_to_server_default(self):
        self.assertEqual(normalize_copilot_model("made-up-model"), DEFAULT_COPILOT_MODEL)
        self.assertEqual(normalize_copilot_model(["gpt-5.6-sol"]), DEFAULT_COPILOT_MODEL)
        self.assertEqual(normalize_copilot_model("gpt-5.6-terra"), "gpt-5.6-terra")

    def test_background_limit_keeps_beginning_and_end(self):
        limited = limit_background_context("A" * 100 + "Z" * 100, max_chars=100)
        self.assertLessEqual(len(limited), 100)
        self.assertTrue(limited.startswith("A"))
        self.assertTrue(limited.endswith("Z"))

    def test_background_limit_handles_tiny_budget(self):
        limited = limit_background_context("long context", max_chars=5)
        self.assertEqual(len(limited), 5)

    def test_prompt_marks_exact_cursor_boundary(self):
        prompt = build_completion_input("before", "after", "python", "class Tile: pass")
        rendered = "".join(block["text"] for block in prompt[0]["content"])
        self.assertIn("<BEFORE_CURSOR>before</BEFORE_CURSOR><CURSOR>", rendered)
        self.assertIn("<AFTER_CURSOR>after</AFTER_CURSOR>", rendered)
        self.assertIn("class Tile: pass", rendered)

    def test_extracts_response_usage_without_source_content(self):
        response = SimpleNamespace(usage=SimpleNamespace(
            input_tokens=120,
            input_tokens_details=SimpleNamespace(cached_tokens=80),
            output_tokens=12,
            total_tokens=132,
        ))
        self.assertEqual(extract_response_usage(response), {
            "input_tokens": 120,
            "cached_input_tokens": 80,
            "output_tokens": 12,
            "total_tokens": 132,
        })

    def test_missing_response_usage_is_safe(self):
        self.assertEqual(extract_response_usage(None), {
            "input_tokens": None,
            "cached_input_tokens": None,
            "output_tokens": None,
            "total_tokens": None,
        })


if __name__ == "__main__":
    unittest.main()
