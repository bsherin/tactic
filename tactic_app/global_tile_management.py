
from docker_functions import create_container, ContainerCreateError
import copy
import datetime
import os
from users import User, load_user
import tactic_app

from volume_manager import VolumeManager, host_persist_dir

vmanager = VolumeManager(host_persist_dir)


# noinspection PyAttributeOutsideInit
class GlobalTileManager(object):

    def __init__(self):
        self.initialize()

    def initialize(self):
        vmanager.delete_all_contents()
        self.tile_manager = vmanager["tile_manager"]
        try:
            self.test_tile_container_id, container_id = create_container("tactic_tile_image",
                                                                         network_mode="bridge",
                                                                         container_name="tile_test_container",
                                                                         register_container=False,
                                                                         other_name="test_container",
                                                                         env_vars={"PPI": 0})
        except ContainerCreateError:
            print "failed to create the test tile_container. That's very bad."
            exit()

    def get_repository_tiles_matching_tag(self, tag):
        repository_user = User.get_user_by_username("repository")
        if repository_user is not None:
            tm_list = repository_user.get_resource_names("tile", tag_filter=tag)
        else:
            tm_list = []
        return tm_list

    def load_user_default_tiles(self, username):
        the_user = User.get_user_by_username(username)
        self.add_user(username)
        error_list = []
        if the_user is not None:
            tm_list = the_user.get_resource_names("tile", tag_filter="default")

            for tm in tm_list:
                tactic_app.host_worker.post_task("host", "load_tile_module_task", {"tile_module_name": tm,
                                                                                   "user_id": the_user.get_id(),
                                                                                   "show_failed_loads": True,
                                                                                   "is_default": True})

        else:
            error_list.append("unable to load user")
        return error_list

    def add_failed_load(self, module_name, username):
        self.add_user(username)
        if module_name not in self.failed_loaded_default_modules[username].keys():
            self.tile_manager[username].failed_loaded_default_modules[module_name] = ""

    def add_user(self, username):
        if username not in self.tile_manager.keys():
            self.tile_manager.add_key(username)
            umanager = self.tile_manager[username]
            umanager.add_keys(["loaded_user_modules",
                              "user_tiles",
                              "tile_module_index",
                              "failed_loaded_default_modules",
                              "default_tiles"])

    def remove_user(self, username):
        if username in self.tile_manager.keys():
            del self.tile_manager[username]

    def get_tile_code(self, tile_type, user_id):
        user_obj = load_user(user_id)
        username = user_obj.username
        self.add_user(username)
        if user_obj.username in self.tile_manager[username].user_tiles.keys():
            for category in self.tile_manager[username].user_tiles.keys():
                cat = self.tile_manager[username].user_tiles[category]
                catnames = cat.keys()
                if tile_type in catnames:
                    return cat[tile_type].value
        return None

    def get_user_available_tile_types(self, username):
        self.add_user(username)
        tile_types = {}
        umanager = self.tile_manager[username]
        for category in umanager.user_tiles.keys():
            cat = umanager.user_tiles[category]
            if category not in tile_types:
                tile_types[category] = []
            tile_types[category] += cat.keys()
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
        self.add_user(username)
        umanager = self.tile_manager[username]
        for category in umanager.user_tiles.keys():
            cat = umanager.user_tiles[category]
            loaded_tiles += cat.keys()
        return loaded_tiles

    def get_failed_loads_list(self, username):
        self.add_user(username)
        umanager = self.tile_manager[username]
        return sorted(umanager.failed_loaded_default_modules.keys())

    def get_default_tiles(self, username):
        self.add_user(username)
        umanager = self.tile_manager[username]
        return sorted(umanager.default_tiles.keys())

    def get_nondefault_tiles_list(self, username):
        self.add_user(username)
        umanager = self.tile_manager[username]
        loaded_tiles = self.get_loaded_user_tiles_list(username)
        default_tiles = umanager.default_tiles.keys()
        return [tname for tname in loaded_tiles if tname not in default_tiles]

    def unload_user_tiles(self, username):
        self.add_user(username)
        umanager = self.tile_manager[username]
        umanager.loaded_user_modules.delete_all_contents()
        umanager.user_tiles.delete_all_contents()
        umanager.tile_module_index.delete_all_contents()
        self.load_user_default_tiles(username)

    def get_module_from_type(self, username, tile_type):
        # First check to see if this is actually one of the default tiles
        self.add_user(username)
        umanager = self.tile_manager[username]

        if tile_type not in umanager.tile_module_index.keys():
            return None
        else:
            return umanager.tile_module_index[tile_type].value

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name, is_default=False):
        self.add_user(username)
        umanager = self.tile_manager[username]
        if tile_module_name in umanager.failed_loaded_default_modules.keys():
            umanager.failed_loaded_default_modules.add_key(tile_module_name)
        if category not in umanager.user_tiles.keys():
            umanager.user_tiles.add_key(category)
        umanager.user_tiles[category][tile_name] = tile_module
        umanager.tile_module_index[tile_name] = tile_module_name
        if tile_module_name not in umanager.loaded_user_modules.keys():
            umanager.loaded_user_modules[tile_module_name] = ""
        if is_default:
            umanager.default_tiles[tile_name] = ""
        return


tactic_app.global_tile_manager = GlobalTileManager()
