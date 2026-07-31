DEFAULT_COPILOT_MODEL = "gpt-5.6-luna"

ALLOWED_COPILOT_MODELS = frozenset({
    "gpt-5.6-luna",
    "gpt-5.6-terra",
    "gpt-5.6-sol",
})

MAX_AI_BACKGROUND_CHARS = 32_000


def normalize_copilot_model(model_name):
    if isinstance(model_name, str) and model_name in ALLOWED_COPILOT_MODELS:
        return model_name
    return DEFAULT_COPILOT_MODEL


def split_code_at_cursor(code_str, cursor_pos, before_lines=40, after_lines=10):
    """Return bounded code before and after the exact insertion point."""
    code_str = code_str or ""
    try:
        cursor_pos = int(cursor_pos or 0)
    except (TypeError, ValueError):
        cursor_pos = 0
    cursor_pos = max(0, min(cursor_pos, len(code_str)))

    before_cursor = code_str[:cursor_pos]
    after_cursor = code_str[cursor_pos:]

    before_parts = before_cursor.splitlines(keepends=True)
    after_parts = after_cursor.splitlines(keepends=True)

    prefix = "".join(before_parts[-before_lines:]) if before_lines else ""
    # The first part can be the remainder of the cursor's current line.
    suffix = "".join(after_parts[:after_lines + 1]) if after_lines >= 0 else ""
    return prefix, suffix


def limit_background_context(text, max_chars=MAX_AI_BACKGROUND_CHARS):
    """Keep both the class header and later methods when context is oversized."""
    text = text or ""
    max_chars = max(0, int(max_chars))
    if len(text) <= max_chars:
        return text

    omitted_marker = "\n\n# ... background context omitted to stay within the AI context budget ...\n\n"
    if max_chars <= len(omitted_marker):
        return omitted_marker[:max_chars]
    available = max(0, max_chars - len(omitted_marker))
    head_size = (available * 2) // 3
    tail_size = available - head_size
    return text[:head_size] + omitted_marker + text[-tail_size:]


def build_completion_input(prefix, suffix, mode, background_context=""):
    content = []
    if background_context:
        content.append({
            "type": "input_text",
            "text": (
                "Background project context follows. The active editor is represented "
                "by a placeholder in this context. Do not continue code in this block.\n\n"
                f"<BACKGROUND_CONTEXT language=\"{mode}\">\n"
                f"{background_context}\n"
                "</BACKGROUND_CONTEXT>"
            ),
        })

    content.append({
        "type": "input_text",
        "text": (
            "Insert the code that belongs at <CURSOR> in the active editor below. "
            "Use the suffix to avoid repeating code that already follows the cursor.\n\n"
            f"<ACTIVE_EDITOR language=\"{mode}\">\n"
            f"<BEFORE_CURSOR>{prefix}</BEFORE_CURSOR>"
            f"<CURSOR>"
            f"<AFTER_CURSOR>{suffix}</AFTER_CURSOR>\n"
            "</ACTIVE_EDITOR>"
        ),
    })
    return [{"role": "user", "content": content}]


def extract_response_usage(response):
    """Return stable numeric usage fields from an OpenAI Responses API result."""
    usage = getattr(response, "usage", None)
    input_details = getattr(usage, "input_tokens_details", None)
    return {
        "input_tokens": getattr(usage, "input_tokens", None),
        "cached_input_tokens": getattr(input_details, "cached_tokens", None),
        "output_tokens": getattr(usage, "output_tokens", None),
        "total_tokens": getattr(usage, "total_tokens", None),
    }
