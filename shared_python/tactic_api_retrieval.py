"""Select a small, receiver-aware slice of the Tactic API catalog.

Autocomplete runs frequently, so retrieval is deliberately local and
deterministic.  It uses the code nearest the cursor instead of making another
model or embedding request.
"""

import re


DEFAULT_MAX_API_ENTRIES = 12
DEFAULT_MAX_API_CONTEXT_CHARS = 3_000
MAX_SUMMARY_CHARS = 180
RECENT_CODE_CHARS = 1_500


KNOWN_RECEIVER_ROOTS = (
    "self",
    "Collection",
    "Tiles",
    "Pipes",
    "Library",
    "Settings",
)

RECEIVER_AT_CURSOR_RE = re.compile(
    r"(?P<receiver>(?:{})(?:\.[A-Za-z_]\w*)*)\."
    r"(?P<partial>[A-Za-z_]\w*)$".format("|".join(KNOWN_RECEIVER_ROOTS))
)
IDENTIFIER_AT_CURSOR_RE = re.compile(r"(?P<partial>[A-Za-z_]\w*)$")
IDENTIFIER_RE = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


STOP_WORDS = frozenset({
    "and", "as", "assert", "async", "await", "break", "class", "continue",
    "def", "del", "elif", "else", "except", "false", "finally", "for",
    "from", "get", "global", "if", "import", "in", "is", "lambda", "none", "not",
    "or", "pass", "raise", "return", "self", "true", "try", "value",
    "set", "while", "with", "yield",
})


def _identifier_terms(text):
    terms = set()
    for identifier in IDENTIFIER_RE.findall(text or ""):
        lowered = identifier.lower()
        if len(lowered) >= 3 and lowered not in STOP_WORDS:
            terms.add(lowered)
        for part in lowered.split("_"):
            if len(part) >= 3 and part not in STOP_WORDS:
                terms.add(part)
    return terms


def _terms_match(left, right):
    """Allow useful near-prefixes such as doc/documents and col/column."""
    if left == right:
        return True
    if min(len(left), len(right)) < 3:
        return False
    return left.startswith(right) or right.startswith(left)


def _term_overlap(query_terms, candidate_terms):
    return sum(
        1
        for query_term in query_terms
        if any(_terms_match(query_term, candidate) for candidate in candidate_terms)
    )


def cursor_api_query(prefix):
    """Return the receiver and partial identifier immediately before the cursor."""
    tail = (prefix or "")[-RECENT_CODE_CHARS:]
    receiver_match = RECEIVER_AT_CURSOR_RE.search(tail)
    if receiver_match:
        return receiver_match.group("receiver"), receiver_match.group("partial")
    identifier_match = IDENTIFIER_AT_CURSOR_RE.search(tail)
    if identifier_match:
        return None, identifier_match.group("partial")
    return None, ""


def _receiver_paths(entry):
    # A global's access path describes the global itself, not an object on which
    # another member can be selected.  Owned members use their paths as receivers.
    if entry.get("owner") or entry.get("receiver"):
        return entry.get("access_paths") or [entry.get("receiver")]
    return []


def _handler_is_relevant(entry, recent_code, partial):
    if entry.get("surface") != "handler":
        return True
    partial = (partial or "").lower()
    lowered = recent_code.lower()
    return (
        partial.startswith("handle")
        or entry.get("name", "").lower() in lowered
        or ("def " in lowered and "handle" in lowered)
    )


def _entry_score(entry, receiver, partial, recent_code, query_terms):
    name = entry.get("name", "").lower()
    partial = (partial or "").lower()
    aliases = [alias.lower() for alias in entry.get("aliases", [])]
    name_terms = _identifier_terms(entry.get("name", ""))
    alias_terms = _identifier_terms(" ".join(entry.get("aliases", [])))
    partial_terms = _identifier_terms(partial)
    score = 0

    partial_matches_name = (
        not partial
        or name.startswith(partial)
        or partial in name
        or partial in aliases
        or any(alias.startswith(partial) for alias in aliases)
        or bool(_term_overlap(partial_terms, name_terms | alias_terms))
    )

    if partial and not partial_matches_name:
        return 0

    if receiver:
        matching_paths = [
            path for path in _receiver_paths(entry)
            if isinstance(path, str) and path.lower() == receiver.lower()
        ]
        if not matching_paths:
            return 0
        score += 200

    if partial:
        if name == partial:
            score += 180
        elif name.startswith(partial):
            score += 150
        elif partial in name:
            score += 75

        if partial in aliases:
            score += 170
        elif any(alias.startswith(partial) for alias in aliases):
            score += 140

    category_terms = _identifier_terms(entry.get("category", ""))
    summary_terms = _identifier_terms(entry.get("summary", ""))
    score += 24 * _term_overlap(query_terms, name_terms)
    score += 20 * _term_overlap(query_terms, alias_terms)
    score += 6 * _term_overlap(query_terms, category_terms)
    score += 3 * _term_overlap(query_terms, summary_terms)

    canonical = entry.get("canonical", "").lower()
    if canonical and canonical in recent_code.lower():
        score += 25
    return score


def select_api_entries(catalog, prefix, suffix="", scope=None,
                       max_entries=DEFAULT_MAX_API_ENTRIES):
    """Rank catalog entries against the active code near the cursor."""
    if not isinstance(catalog, dict) or not isinstance(catalog.get("entries"), list):
        return []

    try:
        max_entries = max(0, int(max_entries))
    except (TypeError, ValueError):
        max_entries = DEFAULT_MAX_API_ENTRIES
    if max_entries == 0:
        return []

    recent_prefix = (prefix or "")[-RECENT_CODE_CHARS:]
    recent_suffix = (suffix or "")[:300]
    recent_code = recent_prefix + "\n" + recent_suffix
    receiver, partial = cursor_api_query(recent_prefix)
    query_terms = _identifier_terms(recent_code)
    ranked = []

    for source_index, entry in enumerate(catalog["entries"]):
        scopes = entry.get("scopes") or []
        if scope in ("tile", "notebook") and scopes and scope not in scopes:
            continue
        if not _handler_is_relevant(entry, recent_code, partial):
            continue
        score = _entry_score(entry, receiver, partial, recent_code, query_terms)
        if score > 0:
            ranked.append((-score, source_index, entry))

    ranked.sort(key=lambda item: (item[0], item[1]))
    if not ranked:
        return []
    best_score = -ranked[0][0]
    minimum_score = max(1, int(best_score * 0.35))
    return [
        item[2] for item in ranked
        if -item[0] >= minimum_score
    ][:max_entries]


def _call_forms(entry, preferred_receiver=None):
    if entry.get("surface") == "handler":
        return [entry.get("canonical", entry.get("signature", ""))]

    signature = entry.get("signature", "")
    paths = [path for path in _receiver_paths(entry) if path]
    if not paths:
        return [entry.get("canonical", signature)]

    if preferred_receiver:
        paths.sort(key=lambda path: path.lower() != preferred_receiver.lower())
    return ["{}.{}".format(path, signature) for path in paths]


def _truncate_summary(summary, max_chars=MAX_SUMMARY_CHARS):
    summary = " ".join((summary or "").split())
    if len(summary) <= max_chars:
        return summary
    return summary[:max(0, max_chars - 1)].rstrip() + "…"


def format_api_entries(entries, preferred_receiver=None,
                       max_chars=DEFAULT_MAX_API_CONTEXT_CHARS):
    """Render selected entries without exceeding the prompt character budget."""
    try:
        max_chars = max(0, int(max_chars))
    except (TypeError, ValueError):
        max_chars = DEFAULT_MAX_API_CONTEXT_CHARS
    if not entries or max_chars == 0:
        return ""

    header = (
        "Relevant Tactic API references. Use the exact receiver and call form shown; "
        "do not invent an unqualified version:"
    )
    if len(header) > max_chars:
        return header[:max_chars]

    lines = [header]
    used = len(header)
    for entry in entries:
        forms = _call_forms(entry, preferred_receiver)
        line = "- " + " | ".join(forms)
        aliases = entry.get("aliases") or []
        if aliases:
            line += " [aliases: {}]".format(", ".join(aliases))
        summary = _truncate_summary(entry.get("summary", ""))
        if summary:
            line += " — " + summary
        if used + 1 + len(line) > max_chars:
            continue
        lines.append(line)
        used += 1 + len(line)
    return "\n".join(lines) if len(lines) > 1 else ""


def build_relevant_api_context(catalog, prefix, suffix="", scope=None,
                               language="python", max_entries=DEFAULT_MAX_API_ENTRIES,
                               max_chars=DEFAULT_MAX_API_CONTEXT_CHARS):
    """Build bounded prompt text for the active completion request."""
    if str(language or "").lower() not in ("python", "py"):
        return ""
    receiver, _partial = cursor_api_query(prefix)
    entries = select_api_entries(
        catalog,
        prefix,
        suffix=suffix,
        scope=scope,
        max_entries=max_entries,
    )
    return format_api_entries(entries, preferred_receiver=receiver, max_chars=max_chars)


def build_legacy_api_context(api_response, max_entries=50):
    """Compatibility prompt for hosts that do not yet provide a catalog."""
    try:
        max_entries = max(0, int(max_entries))
        lines = []
        categories = api_response.get("api_dict_by_category", {})
        ordered_categories = api_response.get("ordered_api_categories", [])
        for category in ordered_categories:
            for entry in categories.get(category, []):
                name = entry.get("name", "")
                signature = entry.get("signature", "")
                display = signature if signature.startswith(name) else name + signature
                if display:
                    lines.append("- " + display)
                if len(lines) >= max_entries:
                    break
            if len(lines) >= max_entries:
                break
        return "\n".join(lines)
    except Exception:
        return ""
