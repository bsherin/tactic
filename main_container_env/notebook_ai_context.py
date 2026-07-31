MAX_NOTEBOOK_CONTEXT_CHARS = 30_000
MAX_NOTEBOOK_CELLS = 100


def _was_executed(execution_count):
    try:
        return int(execution_count) > 0
    except (TypeError, ValueError):
        return False


def _format_cell(cell):
    identifier = cell["identifier"]
    execution_count = cell["execution_count"]
    code = cell["code"]
    return (
        f'<NOTEBOOK_CELL identifier="{identifier}" '
        f'execution_count="{execution_count}">\n'
        f"{code}\n"
        "</NOTEBOOK_CELL>"
    )


def build_notebook_background(ai_context, max_chars=MAX_NOTEBOOK_CONTEXT_CHARS):
    """Build a bounded, code-only view of cells preceding the active notebook cell."""
    if not isinstance(ai_context, dict) or ai_context.get("kind") != "notebook":
        return ""

    try:
        max_chars = max(0, int(max_chars))
    except (TypeError, ValueError):
        max_chars = MAX_NOTEBOOK_CONTEXT_CHARS
    if max_chars == 0:
        return ""

    active_editor = ai_context.get("active_editor") or {}
    active_identifier = active_editor.get("identifier")
    raw_cells = ai_context.get("cells")
    if not isinstance(raw_cells, list):
        return ""

    cells = []
    for index, raw_cell in enumerate(raw_cells[-MAX_NOTEBOOK_CELLS:]):
        if not isinstance(raw_cell, dict):
            continue
        identifier = raw_cell.get("identifier") or raw_cell.get("unique_id") or f"cell-{index}"
        if identifier == active_identifier:
            continue
        code = raw_cell.get("code")
        if not isinstance(code, str) or not code.strip():
            continue
        execution_count = raw_cell.get("execution_count")
        cells.append({
            "index": index,
            "identifier": str(identifier),
            "execution_count": execution_count if execution_count is not None else "",
            "executed": _was_executed(execution_count),
            "code": code,
        })

    if not cells:
        return ""

    intro = (
        "Relevant code cells preceding the active notebook editor are shown below. "
        "Executed cells are preferred when the context budget is limited."
    )
    if len(intro) >= max_chars:
        return intro[:max_chars]

    # Spend the budget on the newest executed cells first, then on newer
    # unexecuted cells. Render selected cells back in notebook order.
    priority = sorted(cells, key=lambda cell: (not cell["executed"], -cell["index"]))
    selected = []
    used_chars = len(intro)
    for cell in priority:
        block = _format_cell(cell)
        separator_chars = 2
        if used_chars + separator_chars + len(block) <= max_chars:
            selected.append((cell["index"], block))
            used_chars += separator_chars + len(block)

    if not selected:
        # A single large recent cell is still more useful than no context.
        cell = priority[0]
        opening = (
            f'<NOTEBOOK_CELL identifier="{cell["identifier"]}" '
            f'execution_count="{cell["execution_count"]}">\n'
        )
        closing = "\n</NOTEBOOK_CELL>"
        marker = "\n# ... earlier notebook code omitted ...\n"
        available = max_chars - len(intro) - 2 - len(opening) - len(closing)
        if available > 0:
            code = cell["code"]
            if len(code) > available:
                if available > len(marker):
                    code = marker + code[-(available - len(marker)):]
                else:
                    code = code[-available:]
            selected.append((cell["index"], opening + code + closing))

    if not selected:
        return intro

    selected.sort(key=lambda entry: entry[0])
    return intro + "\n\n" + "\n\n".join(block for _, block in selected)
