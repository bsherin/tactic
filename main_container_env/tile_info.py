
from collections import OrderedDict
from typing import Optional
import copy


class TileInfo:
    def __init__(self):
        self.ti_dict = OrderedDict()

    def add_tile(self, tile_id: str, tile_name: Optional[str] = None, tile_type: Optional[str] = None, creds: Optional[dict] = None):
        self.ti_dict[tile_id] = {
            "tile_name": tile_name,
            "tile_type": tile_type,
            "tile_reload_dict": None,
            "tile_save_dict": None,
            "old_id": None,
            "creds": creds
        }

    def remove_tile(self, tile_id: str):
        if tile_id in self.ti_dict:
            del self.ti_dict[tile_id]

    def id_from_name(self, tile_name: str) -> Optional[str]:
        for tile_id, data in self.ti_dict.items():
            if data["tile_name"] == tile_name:
                return tile_id
        return None

    def set_reload_dict(self, tile_id: str, reload_dict: dict):
        if tile_id in self.ti_dict:
            self.ti_dict[tile_id]["tile_reload_dict"] = reload_dict
        else:
            raise KeyError(f"Tile ID {tile_id} not found.")

    def set_creds(self, tile_id: str, creds: dict):
        if tile_id in self.ti_dict:
            self.ti_dict[tile_id]["creds"] = creds
        else:
            raise KeyError(f"Tile ID {tile_id} not found.")

    def get_creds(self, tile_id: str) -> Optional[dict]:
        if tile_id in self.ti_dict and "creds" in self.ti_dict[tile_id]:
            return self.ti_dict[tile_id]["creds"]
        else:
            return None

    def set_save_dict(self, tile_id: str, save_dict: dict):
        if tile_id in self.ti_dict:
            self.ti_dict[tile_id]["tile_save_dict"] = save_dict
        else:
            raise KeyError(f"Tile ID {tile_id} not found.")

    def get_reload_dict(self, tile_id: str) -> Optional[dict]:
        if tile_id in self.ti_dict and "tile_reload_dict" in self.ti_dict[tile_id]:
            return self.ti_dict[tile_id]["tile_reload_dict"]
        else:
            return None

    def get_save_dict(self, tile_id: str) -> Optional[dict]:
        if tile_id in self.ti_dict and "tile_save_dict" in self.ti_dict[tile_id]:
            return self.ti_dict[tile_id]["tile_save_dict"]
        else:
            return None



    def update_id(self, old_id: str, new_id: str):
        if old_id in self.ti_dict:
            the_dict = copy.copy(self.ti_dict[old_id])
            the_dict["old_id"] = old_id
            if the_dict["tile_save_dict"] is not None:
                the_dict["tile_save_dict"]["tile_id"] = new_id
            self.ti_dict[new_id] = the_dict
            del self.ti_dict[old_id]
        else:
            raise KeyError(f"Tile ID {old_id} not found.")

    def current_from_old(self, old_id):
        for tile_id, data in self.ti_dict.items():
            if data["old_id"] == old_id:
                return tile_id
        return None

    def id_exists(self, tile_id: str) -> bool:
        return tile_id in self.ti_dict

    @property
    def tile_ids(self):
        return list(self.ti_dict.keys())

    @property
    def tile_names(self):
        return [data["tile_name"] for data in self.ti_dict.values() if data["tile_name"] is not None]