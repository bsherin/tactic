import copy


def prepare_tile_context(ai_context):
    """Return a tile save dictionary with the active editor body redacted."""
    ai_context = ai_context or {}
    if ai_context.get("kind") != "tile":
        return None

    tile_data = ai_context.get("tile")
    active_editor = ai_context.get("active_editor") or {}
    if not isinstance(tile_data, dict):
        return None

    tile_data = copy.deepcopy(tile_data)
    group = active_editor.get("group")
    identifier = active_editor.get("identifier")
    name = active_editor.get("name")
    replacement = "// Active JavaScript editor supplied separately."
    if active_editor.get("mode", "python") == "python":
        replacement = "pass  # Active Python editor supplied separately."

    direct_groups = {
        "globals": "globals_info",
        "render_content": "render_content_info",
    }
    list_groups = {
        "user_methods": "user_methods",
        "used_handler_methods": "used_handler_methods",
        "javascript_functions": "javascript_functions",
    }

    if group in direct_groups:
        entry = tile_data.get(direct_groups[group])
        if not isinstance(entry, dict):
            return None
        if group == "globals":
            replacement = "# Active globals editor supplied separately."
        entry["codeText"] = replacement
    elif group in list_groups:
        entries = tile_data.get(list_groups[group], [])
        matching_entry = next(
            (
                entry for entry in entries
                if (identifier and entry.get("identifier") == identifier)
                or (name and entry.get("name") == name)
            ),
            None,
        )
        if matching_entry is None:
            return None
        matching_entry["codeText"] = replacement
    else:
        return None

    return tile_data
