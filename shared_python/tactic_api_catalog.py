"""Build and load Tactic's receiver-aware API catalog.

The generated JSON is the runtime artifact. Parsing documentation belongs in a
build step so the host service does not depend on GitHub or Sphinx at startup.
"""

import hashlib
import html
import json
import re
from pathlib import Path


CATALOG_SCHEMA_VERSION = 1
DEFAULT_CATALOG_PATH = Path(__file__).with_name("tactic_api_catalog.json")


# These are semantic access paths, not presentation guesses. They describe how
# instances of documented API classes are reached in tile and notebook code.
TYPE_ACCESS_PATHS = {
    "TileBase": ["self"],
    "TacticCollection": ["Collection", "self.collection"],
    "RemoteTiles": ["Tiles", "self.tiles"],
    "RemotePipes": ["Pipes"],
    "TacticLibrary": ["Library"],
    "TacticListSet": ["Library.lists"],
    "TacticCollectionSet": ["Library.collections"],
    "TacticFunctionSet": ["Library.functions"],
    "TacticClassSet": ["Library.classes"],
    "TacticCodeSet": ["Library.codes"],
    "TacticSettings": ["Settings"],
}

GLOBAL_VALUE_TYPES = {
    "Collection": "TacticCollection",
    "Tiles": "RemoteTiles",
    "Pipes": "RemotePipes",
    "Library": "TacticLibrary",
    "Settings": "TacticSettings",
}

MEMBER_VALUE_TYPES = {
    ("TileBase", "collection"): "TacticCollection",
    ("TileBase", "tiles"): "RemoteTiles",
    ("TacticCollection", "current_document"): "TacticDocument",
    ("TacticLibrary", "collections"): "TacticCollectionSet",
    ("TacticLibrary", "lists"): "TacticListSet",
    ("TacticLibrary", "functions"): "TacticFunctionSet",
    ("TacticLibrary", "classes"): "TacticClassSet",
    ("TacticLibrary", "codes"): "TacticCodeSet",
}


DIRECTIVE_RE = re.compile(
    r"^(?P<indent>\s*)\.\.\s+py:(?P<kind>method|attribute|class|data)::\s*(?P<signature>.+?)\s*$"
)
MYST_DIRECTIVE_RE = re.compile(
    r"^(?P<indent>\s*)`{3,}\{py:(?P<kind>method|attribute|class|data)\}\s*(?P<signature>.+?)\s*$"
)
NAME_RE = re.compile(r"^(?P<name>[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)")


def _strip_quote_prefix(line):
    return re.sub(r"^(\s*)>\s?", r"\1", line)


def _normalize_lines(text):
    return [_strip_quote_prefix(line.rstrip()) for line in text.splitlines()]


def _directive_match(line):
    return DIRECTIVE_RE.match(line) or MYST_DIRECTIVE_RE.match(line)


def _category_map(lines):
    active = False
    category = None
    categories = []
    result = {}
    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped == "% category_start":
            active = True
            category = None
            continue
        if stripped == "% category_end":
            active = False
            category = None
            continue
        if active and category is None and stripped.startswith("## "):
            category = stripped[3:].strip()
            categories.append(category)
        result[index] = category if active else None
    return result, categories


def _plain_text(text):
    text = re.sub(r":py:(?:class|meth|attr|data):`([^`]+)`", r"\1", text)
    text = re.sub(r"\{(?:doc|ref)\}`([^`]+)`", r"\1", text)
    text = re.sub(r"`([^`<]+)\s*<[^>]+>`__?", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    text = text.replace("``", "").replace("`", "")
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def _summary_from_body(lines):
    paragraphs = []
    current = []
    in_code_block = False
    for raw_line in lines:
        stripped = raw_line.strip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue
        if not stripped:
            if current:
                paragraphs.append(" ".join(current))
                current = []
            continue
        if (
            stripped.startswith(":")
            or stripped.startswith(".. ")
            or stripped.startswith(":::")
            or stripped.startswith("% ")
        ):
            continue
        current.append(stripped)
    if current:
        paragraphs.append(" ".join(current))

    for paragraph in paragraphs:
        cleaned = _plain_text(paragraph)
        if cleaned:
            return cleaned[:600]
    return ""


def _aliases_from_body(body_text):
    aliases = re.findall(
        r"(?i)\bsynonym(?:\s+for\s+this)?(?:\s+is|\s*:)?\s+``([A-Za-z_]\w*)``",
        body_text,
    )
    return list(dict.fromkeys(aliases))


def _name_from_signature(signature):
    match = NAME_RE.match(signature.strip())
    return match.group("name") if match else ""


def _unqualify_signature(signature, qualified_name):
    if "." not in qualified_name:
        return signature
    owner, member_name = qualified_name.rsplit(".", 1)
    prefix = owner + "."
    if signature.startswith(prefix):
        return signature[len(prefix):]
    return member_name


def _canonical(owner, kind, signature, name):
    if kind == "class" or owner is None:
        return signature
    access_paths = TYPE_ACCESS_PATHS.get(owner, [])
    if not access_paths:
        return signature
    if kind == "attribute":
        return access_paths[0] + "." + name
    return access_paths[0] + "." + signature


def _scopes(surface, signature):
    if surface == "handler":
        return ["tile"]
    if "[notebook only]" in signature.lower():
        return ["notebook"]
    return ["tile", "notebook"]


def _handler_arguments(signature):
    match = re.search(r"\((.*)\)", signature)
    if not match:
        return ""
    arguments = match.group(1).strip()
    arguments = re.sub(r"^self\s*,?\s*", "", arguments)
    return arguments


def parse_api_document(path, surface):
    """Parse the Python-domain directives used by the current MyST docs."""
    path = Path(path)
    text = path.read_text(encoding="utf-8")
    lines = _normalize_lines(text)
    category_by_line, categories = _category_map(lines)

    directives = []
    for index, line in enumerate(lines):
        match = _directive_match(line)
        if match and category_by_line.get(index):
            directives.append({
                "line": index,
                "indent": len(match.group("indent")),
                "kind": match.group("kind"),
                "signature": match.group("signature").strip(),
                "category": category_by_line[index],
            })

    entries = []
    current_class = None
    current_class_indent = None
    current_category = None
    for directive_index, directive in enumerate(directives):
        category = directive["category"]
        if category != current_category:
            current_class = None
            current_class_indent = None
            current_category = category

        next_line = (
            directives[directive_index + 1]["line"]
            if directive_index + 1 < len(directives)
            else len(lines)
        )
        body_lines = lines[directive["line"] + 1:next_line]
        body_text = "\n".join(body_lines)
        kind = directive["kind"]
        raw_signature = directive["signature"]
        qualified_name = _name_from_signature(raw_signature)
        if not qualified_name:
            continue

        owner = None
        name = qualified_name.rsplit(".", 1)[-1]
        signature = _unqualify_signature(raw_signature, qualified_name)

        if surface == "tile":
            if category != "Global and Notebook-Only" and kind in ("method", "attribute"):
                owner = "TileBase"
            elif "." in qualified_name:
                owner, name = qualified_name.rsplit(".", 1)
        elif surface == "handler":
            owner = "TileBase"
        elif surface == "object":
            if kind == "class":
                current_class = name
                current_class_indent = directive["indent"]
            elif kind == "data" and (
                current_class_indent is None or directive["indent"] <= current_class_indent
            ):
                current_class = None
                current_class_indent = None
            elif current_class is not None and directive["indent"] > current_class_indent:
                owner = current_class
            elif "." in qualified_name:
                owner, name = qualified_name.rsplit(".", 1)

        entry_id = ".".join(filter(None, (surface, owner or "global", name)))
        receiver_paths = TYPE_ACCESS_PATHS.get(owner, []) if owner else []
        value_type = (
            MEMBER_VALUE_TYPES.get((owner, name))
            if owner
            else GLOBAL_VALUE_TYPES.get(name)
        )
        access_paths = receiver_paths
        if kind == "data" and owner is None:
            access_paths = [name]
        entry = {
            "id": entry_id,
            "surface": surface,
            "category": category,
            "owner": owner,
            "receiver": receiver_paths[0] if receiver_paths else None,
            "access_paths": access_paths,
            "kind": kind,
            "name": name,
            "signature": signature,
            "canonical": _canonical(owner, kind, signature, name),
            "summary": _summary_from_body(body_lines),
            "aliases": _aliases_from_body(body_text),
            "scopes": _scopes(surface, raw_signature),
            "source": {"file": path.name, "line": directive["line"] + 1},
        }
        if value_type:
            entry["value_type"] = value_type
        if surface == "handler":
            entry["arguments"] = _handler_arguments(raw_signature)
            entry["canonical"] = "def " + raw_signature
        entries.append(entry)

    return entries, categories, text


def _deduplicate_entries(entries):
    result = []
    by_id = {}
    for entry in entries:
        previous = by_id.get(entry["id"])
        if previous is None:
            by_id[entry["id"]] = entry
            result.append(entry)
            continue
        if previous["signature"] != entry["signature"]:
            raise ValueError(
                "Conflicting API entries for {}: {!r} and {!r}".format(
                    entry["id"], previous["signature"], entry["signature"]
                )
            )
    return result


def build_catalog(docs_dir):
    docs_dir = Path(docs_dir)
    sources = [
        ("tile", docs_dir / "Tile-Commands.md"),
        ("object", docs_dir / "Object-Oriented-API.md"),
        ("handler", docs_dir / "Handler-Methods.md"),
    ]
    entries = []
    categories = {}
    source_text = {}
    for surface, path in sources:
        parsed_entries, parsed_categories, text = parse_api_document(path, surface)
        entries.extend(parsed_entries)
        categories[surface] = parsed_categories
        source_text[path.name] = text

    entries = _deduplicate_entries(entries)
    digest = hashlib.sha256()
    for filename in sorted(source_text):
        digest.update(filename.encode("utf-8"))
        digest.update(b"\0")
        digest.update(source_text[filename].encode("utf-8"))

    return {
        "schema_version": CATALOG_SCHEMA_VERSION,
        "source_hash": digest.hexdigest(),
        "source_files": sorted(source_text),
        "categories": categories,
        "types": {
            owner: {"access_paths": paths}
            for owner, paths in TYPE_ACCESS_PATHS.items()
        },
        "globals": GLOBAL_VALUE_TYPES,
        "entries": entries,
    }


def validate_catalog(catalog):
    if catalog.get("schema_version") != CATALOG_SCHEMA_VERSION:
        raise ValueError("Unsupported Tactic API catalog schema")
    entries = catalog.get("entries")
    if not isinstance(entries, list) or not entries:
        raise ValueError("Tactic API catalog contains no entries")
    ids = [entry.get("id") for entry in entries]
    if len(ids) != len(set(ids)):
        raise ValueError("Tactic API catalog contains duplicate entry IDs")
    for entry in entries:
        for required in ("id", "surface", "category", "kind", "name", "signature", "canonical"):
            if required not in entry:
                raise ValueError("Catalog entry {} has no {}".format(entry.get("id"), required))
    return catalog


def load_catalog(path=DEFAULT_CATALOG_PATH):
    with Path(path).open(encoding="utf-8") as catalog_file:
        return validate_catalog(json.load(catalog_file))


def catalog_to_legacy(catalog):
    """Create the dictionaries expected by existing host and browser callers."""
    validate_catalog(catalog)
    categories = catalog.get("categories", {})

    ordered_api_categories = categories.get("tile", [])
    api_dict_by_category = {category: [] for category in ordered_api_categories}
    for entry in catalog["entries"]:
        if entry["surface"] != "tile" or entry["kind"] not in ("method", "attribute"):
            continue
        api_dict_by_category.setdefault(entry["category"], []).append({
            "name": entry["name"],
            "signature": entry["signature"],
            "body": "<p>{}</p>".format(html.escape(entry.get("summary", ""))),
            "kind": entry["kind"],
        })

    api_dict_by_name = {}
    for category in ordered_api_categories:
        for entry in api_dict_by_category.get(category, []):
            api_dict_by_name[entry["name"]] = {
                "signature": entry["signature"],
                "category": category,
            }

    ordered_object_categories = categories.get("object", [])
    object_api_dict_by_category = {category: [] for category in ordered_object_categories}
    class_records = {}
    for entry in catalog["entries"]:
        if entry["surface"] != "object":
            continue
        category = entry["category"]
        if entry["kind"] == "data" and entry["owner"] is None:
            body = "<p>{}</p>".format(html.escape(entry.get("summary", "")))
            object_api_dict_by_category.setdefault(category, []).append([
                entry["name"],
                {"signature": entry["signature"], "body": body, "kind": "global"},
                "global",
            ])
        elif entry["kind"] == "class":
            record = [entry["signature"], [], "class"]
            object_api_dict_by_category.setdefault(category, []).append(record)
            class_records[(category, entry["name"])] = record
        elif entry["owner"]:
            record = class_records.get((category, entry["owner"]))
            if record is None:
                record = [entry["owner"], [], "class"]
                object_api_dict_by_category.setdefault(category, []).append(record)
                class_records[(category, entry["owner"])] = record
            record[1].append({
                "signature": entry["signature"],
                "body": "<p>{}</p>".format(html.escape(entry.get("summary", ""))),
                "kind": entry["kind"],
            })

    handler_methods = {
        entry["name"]: entry.get("arguments", "")
        for entry in catalog["entries"]
        if entry["surface"] == "handler"
    }
    return {
        "api_dict_by_category": api_dict_by_category,
        "api_dict_by_name": api_dict_by_name,
        "ordered_api_categories": ordered_api_categories,
        "object_api_dict_by_category": object_api_dict_by_category,
        "ordered_object_categories": ordered_object_categories,
        "handler_methods": handler_methods,
    }
