
print ("in gtm")
import copy
import datetime
import os
import re
from redis_tools import RedisManager, redis_client

class LoadedTileManager(RedisManager):
    """
    {username}.failed_loaded_default_modules.{tile_type} A hash with tile types are keys. Value set to 1.
    {username}.user_tiles.{tile_type}: A hash with keys
        - module_code
        - category
        - module_name
    """

    prefix = "tm"
    def __init__(self, cli):
        super().__init__(cli)

    @staticmethod
    def get_repository_tiles_matching_tag(tag):
        from users import User
        repository_user = User.get_user_by_username("repository")
        if repository_user is not None:
            tm_list = repository_user.get_filtered_fesource_names("tile", tag_filter=tag)
        else:
            tm_list = []
        return tm_list

    @staticmethod
    def load_user_default_tiles(username):
        from users import User
        import tactic_app
        the_user = User.get_user_by_username(username)
        error_list = []
        if the_user is not None:
            tm_list = the_user.get_filtered_resource_names("tile", tag_filter="default")

            for tm in tm_list:
                tactic_app.host_worker.post_task("host", "load_tile_module_task", {"tile_module_name": tm,
                                                                                   "user_id": the_user.get_id(),
                                                                                   "show_failed_loads": True,
                                                                                   "is_default": True})
        else:
            error_list.append("unable to load user")
        return error_list

    def add_failed_load(self, module_name, username):
        self.set("failed_loaded_default_modules", module_name, narrower=username)

    def remove_user(self, username):
        all_keys = self.scan_keys_with_prefix("*", narrower=username)
        for k in all_keys:
            self.cli.delete(k)

    @staticmethod
    def tile_type_string(username):
        return "tm\.{}\.user_tiles\.(.*)?\.(.*)".format(username)

    def get_user_available_tile_types(self, username, nested=False):
        tile_types = {}
        all_keys = self.scan_keys_with_prefix("user_tiles.*", narrower=username)
        try:
            if len(all_keys) == 0:
                print("user tiles don't seem to be loaded. so load them")
                self.load_user_default_tiles(username)
                if nested:
                    return {}
                return self.get_user_available_tile_types(username, nested=True)
            for k in all_keys:
                tile_type = self.get_tail(k)
                tile_data = self.get_hash_dict(k)
                cat = tile_data.get("category", "nocat")
                if cat not in tile_types:
                    tile_types[cat] = []
                tile_types[cat].append(tile_type)

        except AttributeError:
            if nested:  # avoid infinite recursion
                return {}
            print("user tiles don't seem to be loaded. so load them")
            self.load_user_default_tiles(username)
            return self.get_user_available_tile_types(username, nested=True)
        return tile_types

    def get_failed_loads_list(self, username):
        keys = self.get_keys_with_base("failed_loaded_default_modules", tail_only=True)
        if not keys:
            return []
        else:
            return sorted(keys)

    def unload_user_tiles(self, username):
        self.delete_keys_with_prefix("*", narrower=username)
        self.load_user_default_tiles(username)

    def get_loaded_tile_types(self, username):
        if self.exists("user_tiles", narrower=username):
            return self.get_keys_with_base("user_tiles", narrower=username, tail_only=True)
        else:
            return []

    def get_module_from_type(self, username, tile_type):
        return self.get_hash_entry(f"user_tiles.{tile_type}", "module_name", username)

    def get_loaded_user_modules(self, username):
        keys = self.get_keys_with_base("user_tiles.*", narrower=username)
        if not keys or len(keys) == 0:
            return []
        tile_types = self.get_user_available_tile_types(username)
        modules = [self.get_module_from_type(username, tile_type) for tile_type in tile_types]
        return modules

    def unload_one_tile(self, username, tile_name):
        self.delete(f"user_tiles.{tile_name}", narrower=username)
        return

    def unload_one_module(self, username, tile_module_name):
        tile_types = self.get_user_available_tile_types(username)
        for tile_type in tile_types:
            module_name = self.get_module_from_type(username, tile_type)
            if module_name == tile_module_name:
                self.delete(f"user_tiles.{tile_type}", narrower=username)
        return

    def add_user_tile_module(self, username, category, tile_name, module_code, tile_module_name, is_default=False,):
        self.unload_one_tile(username, tile_name)
        self.delete(f"failed_loaded_default_modules.{tile_module_name}", narrower=username)

        hdict = {
            "category": category,
            "is_default": str(is_default),
            "module_name": tile_module_name,
            "module_code": module_code,
        }

        self.set_hash_dict(f"user_tiles.{tile_name}", hdict, narrower=username)
        return

    def get_tile_code(self, tile_type, username):
        hdict = self.get_hash_dict(f"user_tiles.{tile_type}", narrower=username)
        if hdict and "module_code" in hdict:
            return hdict["module_code"]
        return None

loaded_tile_manager = LoadedTileManager(redis_client)
