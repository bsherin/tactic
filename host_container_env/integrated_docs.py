"""Compatibility exports backed by the packaged Tactic API catalog."""

from tactic_api_catalog import catalog_to_legacy, load_catalog
from tactic_logging import log


try:
    api_catalog = load_catalog()
    legacy_catalog = catalog_to_legacy(api_catalog)
    api_dict_by_category = legacy_catalog["api_dict_by_category"]
    api_dict_by_name = legacy_catalog["api_dict_by_name"]
    ordered_api_categories = legacy_catalog["ordered_api_categories"]
    object_api_dict_by_category = legacy_catalog["object_api_dict_by_category"]
    ordered_object_categories = legacy_catalog["ordered_object_categories"]
    handler_methods = legacy_catalog["handler_methods"]
    log.info(
        "Loaded packaged Tactic API catalog",
        schema_version=api_catalog["schema_version"],
        source_hash=api_catalog["source_hash"],
        entry_count=len(api_catalog["entries"]),
    )
except Exception:
    log.exception("Problem loading packaged Tactic API catalog")
    api_catalog = {
        "schema_version": 1,
        "source_hash": None,
        "source_files": [],
        "categories": {},
        "types": {},
        "globals": {},
        "entries": [],
    }
    api_dict_by_category = {}
    api_dict_by_name = {}
    ordered_api_categories = []
    object_api_dict_by_category = {}
    ordered_object_categories = []
    handler_methods = {}
