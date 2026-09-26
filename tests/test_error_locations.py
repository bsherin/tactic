import sys
import types
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "shared_python"))
sys.path.insert(0, str(ROOT / "module_viewer_container_env"))
sys.modules.setdefault("flask", types.SimpleNamespace(jsonify=lambda value: value))

from exception_mixin import ExceptionMixin
from source_location import find_editor_location


class ExceptionLineNumberTests(unittest.TestCase):
    def test_prefers_generated_user_frame_over_inner_library_frame(self):
        def library_call():
            raise ValueError("bad value")

        namespace = {"library_call": library_call}
        generated_filename = "/tactic/user-code/example.py"
        exec(compile(
            "def user_method():\n"
            "    return library_call()\n",
            generated_filename,
            "exec",
        ), namespace)

        try:
            namespace["user_method"]()
        except ValueError as error:
            self.assertEqual(
                ExceptionMixin.get_exception_line_number(error, generated_filename),
                2,
            )

    def test_uses_syntax_error_line_without_a_traceback(self):
        try:
            compile("first = 1\nif True print('no')\n", "bad.py", "exec")
        except SyntaxError as error:
            self.assertEqual(ExceptionMixin.get_exception_line_number(error), 2)

    def test_can_fall_back_to_any_generated_user_source(self):
        namespace = {"fail": lambda: (_ for _ in ()).throw(RuntimeError("boom"))}
        generated_filename = "/tactic/user-code/older-module.py"
        exec(compile("def run():\n    fail()\n", generated_filename, "exec"), namespace)

        try:
            namespace["run"]()
        except RuntimeError as error:
            self.assertEqual(ExceptionMixin.get_exception_line_number(
                error,
                preferred_filename="/tactic/user-code/newer-module.py",
                preferred_filename_prefix="/tactic/user-code/",
            ), 2)


class EditorLocationTests(unittest.TestCase):
    def setUp(self):
        self.data = {
            "globals_info": {
                "identifier": "globals",
                "codeText": "import math\nGLOBAL = 1",
            },
            "user_methods": [{
                "identifier": "method-id",
                "name": "calculate",
                "codeText": "first = 1\nif True print('no')\nreturn first",
            }],
            "used_handler_methods": [],
            "render_content_info": {
                "identifier": "render_content",
                "name": "render_content",
                "codeText": "return 'ok'",
            },
        }
        self.module_code = (
            "import math\n"
            "GLOBAL = 1\n"
            "@user_tile\n"
            "class Demo(TileBase):\n"
            "    def calculate(self):\n"
            "        first = 1\n"
            "        if True print('no')\n"
            "        return first\n"
            "    def render_content(self):\n"
            "        return 'ok'\n"
        )

    def test_maps_generated_method_line_to_local_editor_line(self):
        with self.assertRaises(SyntaxError) as caught:
            compile(self.module_code, "generated.py", "exec")
        self.assertEqual(find_editor_location(
            self.data,
            self.module_code,
            caught.exception.lineno,
        ), {
            "editor_identifier": "method-id",
            "editor_line_number": 2,
        })

    def test_maps_globals_without_parsing_generated_module(self):
        self.assertEqual(find_editor_location(self.data, self.module_code, 2), {
            "editor_identifier": "globals",
            "editor_line_number": 2,
        })

    def test_maps_method_header_error_to_first_editor_line(self):
        self.assertEqual(find_editor_location(self.data, self.module_code, 5), {
            "editor_identifier": "method-id",
            "editor_line_number": 1,
        })


if __name__ == "__main__":
    unittest.main()
