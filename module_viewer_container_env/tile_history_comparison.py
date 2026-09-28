import copy
import json


PRESENTATION_FIELDS = {
    "identifier",
    "pane_height",
    "firstLineNumber",
    "lastLineNumber",
    "body_start",
    "last_line",
    "start_line",
    "mode",
    "show_dot",
    "helperText",
    "cmObject",
    "scrollTop",
}


def _clean(value):
    """Remove editor/source-location details that are not tile content."""
    if isinstance(value, dict):
        return {
            key: _clean(item)
            for key, item in value.items()
            if key not in PRESENTATION_FIELDS
        }
    if isinstance(value, list):
        return [_clean(item) for item in value]
    return copy.deepcopy(value)


def _display_name(item, index):
    if isinstance(item, dict):
        name = item.get("name")
        if name not in (None, ""):
            return str(name)
        kind = item.get("kind")
        if kind not in (None, ""):
            return f"{kind} {index + 1}"
    return f"item {index + 1}"


def _keyed(items):
    """Key a list by semantic name, retaining duplicate names deterministically."""
    result = {}
    counts = {}
    for index, item in enumerate(items or []):
        name = _display_name(item, index)
        counts[name] = counts.get(name, 0) + 1
        occurrence = counts[name]
        key = name if occurrence == 1 else f"{name}#{occurrence}"
        result[key] = (name, item)
    return result


def _code_text(item, fallback_name=""):
    if not item:
        return ""
    code = item.get("codeText", "")
    name = item.get("name", fallback_name)
    if name == "globals":
        return code
    if name == "__raw_code__":
        return code
    args = item.get("argString", "")
    if item.get("mode") == "javascript":
        return f"function {name}({args}) {{\n{code}\n}}"
    signature_args = "self" + (f", {args}" if args else "")
    body = code or "pass"
    indented = "\n".join(f"    {line}" if line else "" for line in body.splitlines())
    return f"def {name}({signature_args}):\n{indented}"


def _structured_text(item):
    if item is None:
        return ""
    return json.dumps(_clean(item), indent=2, sort_keys=True, ensure_ascii=False)


def _status(current, historical):
    if current is None:
        return "removed"
    if historical is None:
        return "added"
    return "unchanged" if _clean(current) == _clean(historical) else "changed"


def _single_item(section_id, name, current, historical, kind="code", mode="python"):
    text_func = _code_text if kind == "code" else _structured_text
    return {
        "key": f"{section_id}:{name}",
        "name": name,
        "status": _status(current, historical),
        "kind": kind,
        "mode": mode,
        "current_text": text_func(current),
        "historical_text": text_func(historical),
    }


def _list_items(section_id, current_items, historical_items, kind="structured", mode="python"):
    current_by_key = _keyed(current_items)
    historical_by_key = _keyed(historical_items)
    ordered_keys = list(current_by_key)
    ordered_keys.extend(key for key in historical_by_key if key not in current_by_key)
    result = []
    for key in ordered_keys:
        current_entry = current_by_key.get(key)
        historical_entry = historical_by_key.get(key)
        current = current_entry[1] if current_entry else None
        historical = historical_entry[1] if historical_entry else None
        name = (current_entry or historical_entry)[0]
        is_divider = any(
            item and item.get("kind") == "divider"
            for item in (current, historical)
        )
        item_kind = "structured" if is_divider else kind
        text_func = _code_text if item_kind == "code" else _structured_text
        result.append({
            "key": f"{section_id}:{key}",
            "name": name,
            "status": _status(current, historical),
            "kind": item_kind,
            "mode": mode,
            "current_text": text_func(current, name) if item_kind == "code" else text_func(current),
            "historical_text": text_func(historical, name) if item_kind == "code" else text_func(historical),
        })
    return result


def build_tile_history_comparison(current, historical):
    """Build a Tilemaker-shaped, JSON-serializable comparison model."""
    overview_current = {
        "tile_type": current.get("tile_type"),
        "category": current.get("category"),
        "is_mpl": current.get("is_mpl", False),
    }
    overview_historical = {
        "tile_type": historical.get("tile_type"),
        "category": historical.get("category"),
        "is_mpl": historical.get("is_mpl", False),
    }

    sections = [
        {
            "id": "overview",
            "title": "Tile",
            "icon": "application",
            "items": [_single_item(
                "overview", "Tile definition", overview_current, overview_historical,
                kind="structured",
            )],
        },
        {
            "id": "globals",
            "title": "Globals",
            "icon": "globe",
            "items": [_single_item(
                "globals", "globals", current.get("globals_info"), historical.get("globals_info")
            )],
        },
        {
            "id": "render_content",
            "title": "Required",
            "icon": "control",
            "items": [_single_item(
                "render_content", "render_content",
                current.get("render_content_info"), historical.get("render_content_info")
            )],
        },
        {
            "id": "options",
            "title": "Options",
            "icon": "select",
            "items": _list_items(
                "options", current.get("option_dict"), historical.get("option_dict")
            ),
        },
        {
            "id": "widgets",
            "title": "Widgets",
            "icon": "widget",
            "items": _list_items(
                "widgets", current.get("widget_list"), historical.get("widget_list")
            ),
        },
        {
            "id": "exports",
            "title": "Exports",
            "icon": "export",
            "items": _list_items(
                "exports", current.get("export_list"), historical.get("export_list")
            ),
        },
        {
            "id": "save_attrs",
            "title": "Save attributes",
            "icon": "floppy-disk",
            "items": _list_items(
                "save_attrs", current.get("additional_save_attrs"),
                historical.get("additional_save_attrs")
            ),
        },
        {
            "id": "user_methods",
            "title": "User methods",
            "icon": "user",
            "items": _list_items(
                "user_methods", current.get("user_methods_list"),
                historical.get("user_methods_list"), kind="code"
            ),
        },
        {
            "id": "handler_methods",
            "title": "Handler methods",
            "icon": "wrench",
            "items": _list_items(
                "handler_methods", current.get("used_handler_methods_list"),
                historical.get("used_handler_methods_list"), kind="code"
            ),
        },
        {
            "id": "javascript",
            "title": "JavaScript",
            "icon": "function",
            "items": _list_items(
                "javascript", current.get("javascript_functions_list"),
                historical.get("javascript_functions_list"), kind="code", mode="javascript"
            ),
        },
    ]

    counts = {name: 0 for name in ("changed", "added", "removed", "unchanged")}
    for section in sections:
        section["counts"] = {name: 0 for name in counts}
        for item in section["items"]:
            counts[item["status"]] += 1
            section["counts"][item["status"]] += 1

    return {"sections": sections, "counts": counts}
