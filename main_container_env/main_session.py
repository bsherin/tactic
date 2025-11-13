from unittest import case

from session_store_s3 import SessionStoreS3

from collection_info import FreeformCollectionInfo, TableCollectionInfo
from tile_info import TileInfo


INITIAL_LEFT_FRACTION = .69

class MainSessionAccessor(object):
    def __init__(self, ss, sid):
        object.__setattr__(self, "ss", ss)
        object.__setattr__(self, "sid", sid)

    def __getattr__(self, name):
        return self.get_val(name)

    def __setattr__(self, name, value):
        if name in {"ss", "sid"}:
            object.__setattr__(self, name, value)
        else:
            self.set_val(name, value)


    @property
    def tile_info(self):
        return TileInfo(self.ss, self.sid)

    @property
    def collection_info(self):
        if self.doc_type == "freeform":
            return FreeformCollectionInfo(self.ss, self.sid)
        else:
            return TableCollectionInfo(self.ss, self.sid)

    def get_val(self, name):
        match name:
            case "tile_info":
                return self.tile_info
            case _:
                return self.ss.get(self.sid, name)

    def set_val(self, name, value):
        self.ss.set(self.sid, name, value)

    @property
    def am_notebook_type(self):
        return self.doc_type in ["freeform", "table"]


class MainSessionStore(SessionStoreS3):
    recreate_values = {
        "username": None,
        "user_id": None,
        "doc_type": "table",
        "is_legacy_save": False,
        "project_name": None,
        "left_fraction": INITIAL_LEFT_FRACTION,
        "is_shrunk": False,
        "collection_name": "",
        "short_collection_name": "",
        "ppi": None,
        "base_figure_url": ""
    }
    doc_info_keys = ["metadata", "data_text", "data_rows", "current_data_rows"]
    mapped_values = {
        "loaded_modules": "used_modules"
    }
    table_spec_keys = ["doc_name", "header_list", "column_widths", "cell_backgrounds", "hidden_columns_list"]

    inits = {
        "pipe_dict": {},
        "pseudo_creation_in_progress": False,
        "ppid": None,
        "selected_text": "",
        "pseudo_tile_id": None,
        "pseudo_tile_creds": None,
        "openai_api_key": "unset",
        "openai_client": "unset",
        "purgetiles": True
    }

    @property
    def init_functions(self):
        return {
            "visible_doc_name": self.initial_visible_doc,
            "doc_names": self.get_doc_names,
        }

    @staticmethod
    def tinfo_base(tile_id):
        return f"tile_info.{tile_id}"

    @staticmethod
    def dinfo_base(doc_name):
        return f"doc_info.{doc_name}"

    def set(self, sid, key, value):
        self.put_small(sid, key, value)

    def get(self, sid, key):
        return self.get_small(sid, key)

    def initialize(self, sid, sdict):
        for key, default in self.recreate_values.items():
            if key in sdict:
                self.put_small(sid, key, sdict[key])
            else:
                self.put_small(sid, key, default)
        if "tile_instances" in sdict:
            tile_info = TileInfo(self, sid)
            for old_tile_id, tile_save_dict in sdict["tile_instances"].items():
                tile_info.add_tile(old_tile_id, tile_save_dict["tile_name"], tile_save_dict["tile_type"])
                tile_info.set_save_dict(old_tile_id, tile_save_dict)
        if "doc_dict" in sdict:
            if sdict["doc_type"] == "freeform":
                collection_info = FreeformCollectionInfo(self, sid)
            else:
                collection_info = TableCollectionInfo(self, sid)
            for doc_name, dinfo in sdict["doc_dict"].items():
                collection_info.add_doc(doc_name, dinfo)
        for key, new_key in self.mapped_values.items():
            if key in sdict:
                self.put_small(sid, new_key, sdict[key])
            else:
                self.put_small(sid, new_key, None)
        for key, value in self.inits.items():
            self.put_small(sid, key, value)
        for key, func in self.init_functions.items():
            val = func(sdict)
            self.put_small(sid, key, val)

    @staticmethod
    def initial_visible_doc(sdict):
        if "doc_dict" in sdict and sdict["doc_dict"]:
            return list(sdict["doc_dict"].keys())[0]
        else:
            return None

    @staticmethod
    def get_doc_names(sdict):
        if "doc_dict" in sdict:
            return list(sdict["doc_dict"].keys())
        else:
            return []

    def set_from_dict(self, sid, data_dict):
        for key, value in data_dict.items():
            self.put_small(sid, key, value)

    def set_doc_info(self, sid, doc_name, key, value):
        base_name = self.dinfo_base(doc_name)
        if key in ["current_data_rows", "data_rows", "data_text"]:
            self.put_large_object(sid, f"{base_name}.{key}", value)
        else:
            self.put_hsmall(sid, base_name, key, value)

    def get_doc_info(self, sid, doc_name, key):
        base_name = self.dinfo_base(doc_name)
        if key in ["current_data_rows", "data_rows", "data_text"]:
            return self.get_large_object(sid, f"{base_name}.{key}")
        else:
            return self.get_hsmall(sid, base_name, key)
