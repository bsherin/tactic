from unittest import case

from session_store_s3 import SessionStoreS3, SessionAccessor

from collection_info import FreeformCollectionInfo, TableCollectionInfo
from tile_info import TileInfo


INITIAL_LEFT_FRACTION = .69

class MainSessionAccessor(SessionAccessor):
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
            case "collection_info":
                return self.collection_info
            case _:
                return SessionAccessor.get_val(self, name)

    @property
    def am_notebook_type(self):
        return self.doc_type in ["jupyter", "notebook"]


class MainSessionStore(SessionStoreS3):
    defaults = {
        "username": {"default": None},
        "user_id": {"default": None},
        "doc_type": {"default": "table"},
        "is_legacy_save": {"default": False},
        "project_name":  {"default": None},
        "left_fraction": {"default": INITIAL_LEFT_FRACTION},
        "is_shrunk": {"default": False},
        "collection_name": {"default": ""},
        "short_collection_name": {"default": ""},
        "ppi":  {"default": None},
        "base_figure_url": {"default": ""},
        "pipe_dict": {"default": {}},
        "pseudo_creation_in_progress": {"default": False},
        "ppid":  {"default": None},
        "selected_text": {"default": ""},
        "pseudo_tile_id":  {"default": None},
        "pseudo_tile_creds":  {"default": None},
        "openai_api_key": {"default": "unset"},
        "purgetiles": {"default": True},
    }

    recreate_values = [
        "username",
        "user_id",
        "doc_type",
        "is_legacy_save",
        "project_name",
        "left_fraction",
        "is_shrunk",
        "collection_name",
        "short_collection_name",
        "ppi",
        "base_figure_url"
    ]
    mapped_values = {
        "loaded_modules": "used_modules"
    }

    large_params = ["collection_info\..*\.current_data_rows",
                    "collection_info\..*\.data_rows",
                    "collection_info\..*\.data_text",
                    "tile_info\..*\.tile_save_dict",]

    tile_reload_attrs = ["tile_name", "tile_type", "base_figure_url", "doc_type",
                     "width", "height", "configured"]

    @property
    def init_functions(self):
        return {
            "visible_doc_name": self.initial_visible_doc,
            "doc_names": self.extract_doc_names,
        }

    def reload_dict_from_save_dict(self, sid, save_dict):
        rdict = {}
        for attr in self.tile_reload_attrs:
            rdict[attr] = save_dict.get(attr, None)
        rdict["user_id"] = self.get_val(sid, "user_id")
        return rdict

    def initialize_session(self, sid, sdict=None):
        print("entering initialize_session in main_session")
        SessionStoreS3.initialize_session(self, sid, None)
        print("called the super initialize")
        for key in self.recreate_values:
            if key in sdict:
                self.put_small(sid, key, sdict[key])
        print("did the recreate_values")
        if "tile_instances" in sdict:
            tile_info = TileInfo(self, sid)
            for old_tile_id, tile_save_dict in sdict["tile_instances"].items():
                tile_info.add_tile(old_tile_id, tile_save_dict["tile_name"], tile_save_dict["tile_type"])
                tile_info.set_save_dict(old_tile_id, tile_save_dict)
        print("did the tile instance stuff")
        if "doc_dict" in sdict:
            if sdict["doc_type"] == "freeform":
                collection_info = FreeformCollectionInfo(self, sid)
            else:
                collection_info = TableCollectionInfo(self, sid)
            for doc_name, dinfo in sdict["doc_dict"].items():
                collection_info.add_doc(doc_name, dinfo)
        print("did the doc stuff")
        for key, new_key in self.mapped_values.items():
            if key in sdict:
                self.put_val(sid, new_key, sdict[key])
            else:
                self.put_val(sid, new_key, None)
        print("did the mapped values")
        for key, func in self.init_functions.items():
            val = func(sdict)
            self.put_val(sid, key, val)
        print('did the init-functions')

    @staticmethod
    def initial_visible_doc(sdict):
        if "doc_dict" in sdict and sdict["doc_dict"]:
            return list(sdict["doc_dict"].keys())[0]
        else:
            return None

    @staticmethod
    def extract_doc_names(sdict):
        if "doc_dict" in sdict:
            return list(sdict["doc_dict"].keys())
        else:
            return []