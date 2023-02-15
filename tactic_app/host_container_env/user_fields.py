

user_data_fields = [
    {"name": "username", "editable": False},
    {"name": "alt_id", "editable": False, "default": None},
    {"name": "status", "editable": False, "default": "active"},
    {"name": "email", "editable": True, "display_text": "email", "type": "text", "default": "", "info_type": "info"},
    {"name": "full_name", "editable": True, "display_text": "full name", "type": "text", "default": "", "info_type": "info"},
    {"name": "favorite_dumpling", "editable": True, "display_text": "favorite dumpling", "type": "text", "default": "", "info_type": "info"},
    {"name": "tzoffset", "editable": False, "default": None},
    {"name": "theme", "editable": True, "display_text": "tactic theme",
     "type": "select", "default": "dark", "options": ["dark", "light"], "info_type": "setting"},
    {"name": "preferred_dark_theme", "editable": True, "display_text": "codemirror dark theme",
     "type": "select", "default": "nord", "options": ["material", "nord", "oceanic-next", "pastel-on-dark"], "info_type": "setting"},
    {"name": "preferred_light_theme", "editable": True, "display_text": "codemirror light theme",
     "type": "select", "default": "default", "options": ["default", "elegant", "juejin", "neat", "solarized"], "info_type": "setting"},
    {"name": "preferred_interface", "editable": True, "display_text": "preferred interface",
     "type": "select", "default": "single-window", "options": ["separate-tabs", "single-window"], "info_type": "setting"},
    {"name": "library_style", "editable": True, "display_text": "library style",
     "type": "select", "default": "unified", "options": ["tabbed", "unified"], "info_type": "setting"}
]
