import json
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = REPOSITORY_ROOT / "static/tactic_js/codemirror_theme_catalog.json"


class CodeMirrorThemeCatalogTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))

    def test_theme_ids_are_unique_and_have_supported_metadata(self):
        themes = self.catalog["themes"]
        ids = [theme["id"] for theme in themes]

        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(themes)
        for theme in themes:
            self.assertIn(theme["variant"], {"dark", "light"})
            self.assertIn(theme["source"], {"fsegurai", "local"})
            self.assertTrue(theme["label"])
            self.assertTrue(theme["export"])

    def test_each_variant_has_a_valid_default(self):
        themes_by_id = {theme["id"]: theme for theme in self.catalog["themes"]}

        for variant in ("dark", "light"):
            default_id = self.catalog["defaults"][variant]
            self.assertIn(default_id, themes_by_id)
            self.assertEqual(themes_by_id[default_id]["variant"], variant)

    def test_local_theme_modules_exist(self):
        for theme in self.catalog["themes"]:
            if theme["source"] != "local":
                continue
            theme_path = (
                REPOSITORY_ROOT
                / "static/tactic_js"
                / f"codemirror_{theme['variant']}_themes"
                / f"{theme['id']}.js"
            )
            self.assertTrue(theme_path.is_file(), theme_path)


if __name__ == "__main__":
    unittest.main()
