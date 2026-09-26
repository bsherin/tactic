"""Map generated tile source locations back to Tile Maker editors."""


def _line_count(text):
    return max(1, len((text or "").splitlines()))


def find_editor_location(data_dict, module_code, line_number):
    """Return an editor identifier and 1-based local line when possible.

    This intentionally does not parse *module_code*. It is used when parsing
    failed, so it derives the mapping from the stable generated method headers
    and the editor payload that produced the module.
    """
    if not line_number or not module_code:
        return None

    globals_info = data_dict.get("globals_info") or {}
    globals_text = globals_info.get("codeText") or ""
    globals_line_count = len(globals_text.splitlines())
    if globals_line_count and 1 <= line_number <= globals_line_count:
        return {
            "editor_identifier": globals_info.get("identifier", "globals"),
            "editor_line_number": line_number,
        }

    lines = module_code.splitlines()
    search_from = 0
    editor_entries = []
    editor_entries.extend(data_dict.get("user_methods") or [])
    editor_entries.extend(data_dict.get("used_handler_methods") or [])
    render_info = data_dict.get("render_content_info")
    if render_info:
        editor_entries.append(render_info)

    for entry in editor_entries:
        name = entry.get("name")
        if not name:
            continue
        header_prefix = "    def {}(".format(name)
        header_index = next(
            (index for index in range(search_from, len(lines))
             if lines[index].startswith(header_prefix)),
            None,
        )
        if header_index is None:
            continue
        search_from = header_index + 1
        body_start = header_index + 2  # convert index and advance past def
        body_end = body_start + _line_count(entry.get("codeText")) - 1
        if header_index + 1 <= line_number <= body_end:
            local_line = max(1, line_number - body_start + 1)
            return {
                "editor_identifier": entry.get("identifier", name),
                "editor_line_number": local_line,
            }

    return None
