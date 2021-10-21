

user_data_fields = [
    {"name": "username", "editable": False},
    {"name": "email", "editable": True, "display_text": "email", "type": "text", "default": "", "info_type": "info"},
    {"name": "full_name", "editable": True, "display_text": "full name", "type": "text", "default": "", "info_type": "info"},
    {"name": "favorite_dumpling", "editable": True, "display_text": "favorite dumpling", "type": "text", "default": "", "info_type": "info"},
    {"name": "tzoffset", "editable": False, "default": None},
    {"name": "theme", "editable": True, "display_text": "tactic theme",
     "type": "select", "default": "dark", "options": ["dark", "light"], "info_type": "setting"},
    {"name": "preferred_dark_theme", "editable": True, "display_text": "codemirror dark theme",
     "type": "select", "default": "nord", "options": ["material", "nord", "oceanic-next", "pastel-on-dark"], "info_type": "setting"},
    {"name": "preferred_interface", "editable": True, "display_text": "preferred interface",
     "type": "select", "default": "single-window", "options": ["separate-tabs", "single-window"], "info_type": "setting"}
]
