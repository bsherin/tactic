
from collections import OrderedDict
from typing import Optional
import copy


class TileInfo:
    def __init__(self, ss, sid):
        self.ss = ss
        self.sid = sid

    @staticmethod
    def ti_base(tile_id):
        return f"tile_info.{tile_id}"

    def add_tile(self, tile_id: str, tile_name: Optional[str] = None, tile_type: Optional[str] = None, creds: Optional[dict] = None):
        tdict = {
            "tile_name": tile_name,
            "tile_type": tile_type,
            "tile_reload_dict": None,
            "tile_save_dict": None,
            "old_id": None,
            "creds": creds
        }
        self.set_multi(tile_id, tdict)

    def set_param(self, tile_id, param_name, value):
        self.ss.put_val_hash(self.sid, self.ti_base(tile_id), param_name, value)

    def get_param(self, tile_id, param_name):
        return self.ss.get_val_hash(self.sid, self.ti_base(tile_id), param_name)

    def get_tile_params(self, tile_id):
        return self.ss.get_hash_all(self.sid, self.ti_base(tile_id))

    def set_multi(self, tile_id, pdict):
        for k, v in pdict.items():
            self.set_param(tile_id, k, v)

    @property
    def tile_ids(self):
        pattern = f"sess.{{{self.sid}}}.v:tile_info.*"
        cursor = 0
        tile_ids = []

        while True:
            cursor, keys = self.ss.r.scan(cursor=cursor, match=pattern, count=500)
            for key in keys:
                if isinstance(key, bytes):
                    key = key.decode("utf-8")
                tile_id = key.split("tile_info.", 1)[1]
                tile_ids.append(tile_id)
            if cursor == 0:
                break
        return tile_ids

    def remove_tile(self, tile_id: str):
        self.ss.delete_small(self.sid, self.ti_base(tile_id))

    def id_from_name(self, tile_name: str) -> Optional[str]:
        tile_ids = self.tile_ids
        for tile_id in tile_ids:
            tname = self.get_param(tile_id, "tile_name")
            if tname == tile_name:
                return tname
        return None

    def set_reload_dict(self, tile_id: str, reload_dict: dict):
        self.set_param(tile_id, "tile_reload_dict", reload_dict)

    def set_creds(self, tile_id: str, creds: dict):
        self.set_param(tile_id, "creds", creds)

    def get_creds(self, tile_id: str) -> Optional[dict]:
        return self.get_param(tile_id, "creds")

    def set_save_dict(self, tile_id: str, save_dict: dict):
        self.set_param(tile_id, "tile_save_dict", save_dict)

    def get_reload_dict(self, tile_id: str) -> Optional[dict]:
        return self.get_param(tile_id, "tile_reload_dict")

    def get_save_dict(self, tile_id: str) -> Optional[dict]:
        return self.get_param(tile_id, "tile_save_dict")

    def update_id(self, old_id: str, new_id: str):
        the_dict = self.get_tile_params(old_id)
        if the_dict:
            the_dict = self.get_tile_params(old_id)
            the_dict["old_id"] = old_id
            if the_dict["tile_save_dict"] is not None:
                the_dict["tile_save_dict"]["tile_id"] = new_id
            self.set_multi(new_id, the_dict)
            self.remove_tile(old_id)
        else:
            raise KeyError(f"Tile ID {old_id} not found.")

    def current_from_old(self, old_id):
        tile_ids = self.tile_ids
        for tile_id in tile_ids:
            if self.get_param(tile_id, "old_id") == old_id:
                return tile_id
        return None

    def id_exists(self, tile_id: str) -> bool:
        return tile_id in self.tile_ids

    @property
    def tile_names(self):
        tile_ids = self.tile_ids
        tnames = []
        for tile_id in tile_ids:
            tnames.append(self.get_param(tile_id, "tile_name"))
        return tnames