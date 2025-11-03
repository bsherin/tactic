
print ("in gtm")
import copy
import datetime
import os
import re
from redis_tools import RedisManager, redis_client

class LoadedTileManager(RedisManager):
    def __init__(self, cli):
        self.prefix = "tm"
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
        self.increment_hash_entry(username, "failed_loaded_default_modules", module_name, increment=1)

    def remove_user(self, username):
        all_keys = self.scan_keys_with_prefix(username, "*")
        if len(all_keys) > 0:
            self.cli.delete(*all_keys)

    @staticmethod
    def tile_type_string(username):
        return "tm\.{}\.user_tiles\.(.*)?\.(.*)".format(username)

    def get_user_available_tile_types(self, username, nested=False):
        tile_types = {}
        all_keys = self.scan_keys_with_prefix(username, "user_tiles.*")
        try:
            for k in all_keys:
                sstring = self.tile_type_string(username)
                cat, tile_type = re.findall(sstring, k)[0]
                if cat not in tile_types:
                    tile_types[cat] = []
                tile_types[cat].append(tile_type)

            if len(list(tile_types.keys())) == 0:
                print("user tiles don't seem to be loaded. so load them")
                self.load_user_default_tiles(username)
                return self.get_user_available_tile_types(username, nested=True)

        except AttributeError:
            if nested:  # avoid infinite recursion
                return {}
            print("user tiles don't seem to be loaded. so load them")
            self.load_user_default_tiles(username)
            return self.get_user_available_tile_types(username, nested=True)
        return tile_types

    @staticmethod
    def create_initial_metadata():
        initial_metadata = {"datetime": datetime.datetime.utcnow(),
                            "updated": datetime.datetime.utcnow(),
                            "tags": "",
                            "notes": ""}
        return initial_metadata

    def get_loaded_user_tiles_list(self, username):
        loaded_tiles = []
        all_keys = self.scan_keys_with_prefix(username, "user_tiles.*")
        for k in all_keys:
            sstring = self.tile_type_string(username)
            _cat, tile_type = re.findall(sstring, k)[0]
            loaded_tiles.append(tile_type)
        return loaded_tiles

    def get_failed_loads_list(self, username):
        if self.exists(username, "failed_loaded_default_modules"):
            return sorted(self.get_hash_keys(username, "failed_loaded_default_modules"))
        else:
            return []

    def get_default_tiles(self, username):
        if self.exists(username, "default_tiles"):
            return sorted(self.get_hash_keys(username, "default_tiles"))
        else:
            return []

    def get_nondefault_tiles_list(self, username):
        loaded_tiles = self.get_loaded_user_tiles_list(username)
        default_tiles = self.get_default_tiles(username)
        return [tname for tname in loaded_tiles if tname not in default_tiles]


    def unload_user_tiles(self, username):
        all_keys = self.scan_keys_with_prefix(username, "*")
        for k in all_keys:
            redis_client.delete(k)
        self.load_user_default_tiles(username)


    def get_loaded_tile_types(self, username):
        if self.exists(username, "tile_module_index"):
            return self.get_hash_keys(username, "tile_module_index")
        else:
            return []

    def get_module_from_type(self, username, tile_type):
        if self.exists(username, "tile_module_index"):
            the_types = self.get_hash_keys(username, "tile_module_index")
            if tile_type not in the_types:
                print("** couldn't get module **")
                return None
            else:
                return self.get_hash_entry(username, "tile_module_index", tile_type)
        return None

    def get_loaded_user_modules(self, username):
        if self.exists(username, "loaded_user_modules"):
            return self.get_hash_keys(username, "loaded_user_modules")
        else:
            return []

    def unload_one_tile(self, username, tile_name, tile_module_name):
        all_user_tiles_keys = self.scan_keys_with_prefix(username, "user_tiles.*")
        for k in all_user_tiles_keys:
            sstring = self.tile_type_string(username)
            _cat, tile_type = re.findall(sstring, k)[0]
            if tile_name == tile_type:
                self.cli.delete(k)

        if self.exists(username, "loaded_user_modules"):
            if tile_module_name in self.get_hash_keys(username, "loaded_user_modules"):
                self.delete_hash_entry(username, "loaded_user_modules", tile_module_name)

        if self.exists(username, "tile_module_index"):
            if tile_name in self.get_hash_keys(username, "tile_module_index"):
                self.delete_hash_entry(username, "tile_module_index", tile_name)
        return

    def unload_one_module(self, username, tile_module_name):
        all_user_tiles_keys =  self.scan_keys_with_prefix(username, f"user_tiles.*")
        for k in all_user_tiles_keys:
            sstring = self.tile_type_string(username)
            _cat, tile_type = re.findall(sstring, k)[0]
            mod = self.get_module_from_type(username, tile_type)
            if mod == tile_module_name:
                self.cli.delete(k)
            if self.exists(username, "tile_module_index"):
                if tile_type in self.get_hash_keys(username, "tile_module_index"):
                    self.delete_hash_entry(username, "tile_module_index", tile_type)
        if self.exists(username, "loaded_user_modules"):
            if tile_module_name in self.get_hash_keys(username, "loaded_user_modules"):
                self.delete_hash_entry(username, "loaded_user_modules", tile_module_name)
        return

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name, is_default=False,):
        self.unload_one_tile(username, tile_name, tile_module_name)
        if self.exists(username, "failed_loaded_default_modules"):
            if tile_module_name in self.get_hash_keys(username, "failed_loaded_default_modules"):
                self.delete_has_entry(username, "failed_loaded_default_modules", tile_module_name)

        self.set(username, f"user_tiles.{category}.{tile_name}", tile_module)
        self.set_hash_entry(username, "tile_module_index", tile_name, tile_module_name)
        self.increment_hash_entry(username, "loaded_user_modules", tile_module_name)

        if is_default:
            self.increment_hash_entry(username, "default_tiles", tile_name)
        return

    def get_tile_code(self, tile_type, username):
        klist = self.scan_keys_with_prefix(username, f"user_tiles.*.{tile_type}")
        if len(klist) > 0:
            return self.cli.get(klist[0])
        else:
            return None

loaded_tile_manager = LoadedTileManager(redis_client)
