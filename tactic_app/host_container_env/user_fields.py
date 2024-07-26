

user_data_fields = [
    {"name": "username", "editable": False, "is_setting": False, "default": None},
    {"name": "alt_id", "editable": False, "is_setting": False, "default": None},
    {"name": "status", "editable": False, "is_setting": False, "default": "active"},
    {"name": "email", "editable": True, "display_text": "email", "type": "text", "is_setting": False, "default": "", "info_type": "info"},
    {"name": "full_name", "editable": True, "display_text": "full name", "type": "text", "is_setting": False, "default": "", "info_type": "info"},
    {"name": "favorite_dumpling", "editable": True, "display_text": "favorite dumpling", "type": "text", "is_setting": False, "default": "", "info_type": "info"},
    {"name": "tzoffset", "editable": False, "is_setting": False, "default": None},
    {"name": "theme", "editable": True, "display_text": "tactic theme", "is_setting": True,
     "type": "select", "default": "dark", "options": ["dark", "light"], "info_type": "setting"},
    {"name": "preferred_dark_theme", "editable": True, "display_text": "codemirror dark theme", "is_setting": True,
     "type": "select", "default": "nord", "options": ["material", "nord", "oceanic-next", "pastel-on-dark"], "info_type": "setting"},
    {"name": "preferred_light_theme", "editable": True, "display_text": "codemirror light theme", "is_setting": True,
     "type": "select", "default": "default", "options": ["default", "elegant", "juejin", "neat", "solarized", "github"], "info_type": "setting"},
    {"name": "preferred_interface", "editable": True, "display_text": "preferred interface", "is_setting": True,
     "type": "select", "default": "single-window", "options": ["separate-tabs", "single-window"], "info_type": "setting"},
    {"name": "openai_api_key", "editable": True, "display_text": "openai api key", "type": "text", "is_setting": False, "default": "", "info_type": "setting"},
]
