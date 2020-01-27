
print ("in gtm")
from docker_functions import create_container, ContainerCreateError
from communication_utils import megaplex_address
import copy
import datetime
import os
import re
from users import User, load_user
import tactic_app
from redis_tools import redis_client
print('about to import volume_manager')
# from volume_manager import VolumeManager
#
# print("initializing vmanager")
# vmanager = VolumeManager("/code/persist")


# noinspection PyAttributeOutsideInit
class GlobalTileManager(object):

    def __init__(self):
        self.initialize()

    def initialize(self):
        print("initializing the gtm")
        all_keys = redis_client.keys("tile_manager*")
        if len(all_keys) > 0:
            redis_client.delete(*all_keys)

        print("about to create the test_tile_container")
        env_vars = {"PPI": 0, "MEGAPLEX_ADDRESS": megaplex_address}
        try:
            self.test_tile_container_id, container_id = create_container("tactic_tile_image",
                                                                         network_mode="bridge",
                                                                         container_name="tile_test_container",
                                                                         register_container=False,
                                                                         other_name="test_container",
                                                                         env_vars=env_vars)
            print('created the test_tile_container')
        except ContainerCreateError:
            print("failed to create the test tile_container. That's very bad.")
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
        self.hadd(username, "failed_loaded_default_modules", module_name)

    # def add_user(self, username):
    #     if username not in self.tile_manager.keys():
    #         self.tile_manager.add_key(username)
    #         umanager = self.tile_manager[username]
    #         umanager.add_keys(["loaded_user_modules",
    #                            "user_tiles",
    #                            "tile_module_index",
    #                            "failed_loaded_default_modules",
    #                            "default_tiles"])
    #         self.load_user_default_tiles(username)
    #     return

    def remove_user(self, username):
        all_keys = redis_client.keys("tile_manager.{}.*".format(username))
        if len(all_keys) > 0:
            redis_client.delete(*all_keys)

    def get_tile_code(self, tile_type, user_id):
        user_obj = load_user(user_id)
        username = user_obj.username

        klist = redis_client.keys("tile_manager.{}.user_tiles.*.{}".format(username, tile_type))
        if len(klist) > 0:
            return redis_client.get(klist[0])
        else:
            return None

    def tile_type_string(self, username):
        return "tile_manager\.{}\.user_tiles\.(.*)?\.(.*)".format(username)

    def get_user_available_tile_types(self, username, nested=False):
        tile_types = {}
        all_keys = redis_client.keys("tile_manager.{}.user_tiles.*".format(username))

        try:
            for k in all_keys:
                sstring = tile_type_string(username)
                cat, tile_type = re.findall(sstring, k)[0]
                tile_types[cat] = tile_type

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
        all_keys = redis_client.keys("tile_manager.{}.user_tiles.*".format(username))
        for k in all_keys:
            sstring = self.tile_type_string(username)
            _cat, tile_type = re.findall(sstring, k)[0]
            loaded_tiles.append(tile_type)

        return loaded_tiles

    def get_failed_loads_list(self, username):
        if self.hexists(username, "failed_loaded_default_modules"):
            return sorted(self.hkeys(username, "failed_loaded_default_modules"))
        else:
            return []

    def get_default_tiles(self, username):
        if self.hexists(username, "default_tiles"):
            return sorted(self.hkeys(username, "default_tiles"))
        else:
            return []

    def get_nondefault_tiles_list(self, username):
        loaded_tiles = self.get_loaded_user_tiles_list(username)
        default_tiles = self.get_default_tiles(username)
        return [tname for tname in loaded_tiles if tname not in default_tiles]

    def unload_user_tiles(self, username):

        kstr = "tile_manager.{}.*".format(username)
        all_keys = redis_client.keys(kstr)
        for k in all_keys:
            redis_client.delete(k)
        self.load_user_default_tiles(username)

    def get_module_from_type(self, username, tile_type):
        if self.hexists(username, "tile_module_index"):
            the_types = self.hkeys(username, "tile_module_index")
            if tile_type not in the_types:
                return None
            else:
                return self.hget(username, "tile_module_index", the_type)

    def unload_one_tile(self, username, tile_name, tile_module_name):

        all_user_tiles_keys = redis_client.keys("tile_manager.{}.user_tiles.*".format(username))
        for k in all_user_tiles_keys:
            sstring = tile_type_string(username)
            _cat, tile_type = re.findall(sstring, k)[0]
            if tile_name == tile_type:
                redis_client.delete(k)

        if self.hexists(username, "loaded_user_modules"):
            if tile_module_name in self.hkeys(username, "loaded_user_modules"):
                self.hdel(username, "loaded_user_modules", tile_module_name)

        if self.hexists(username, "tile_module_index"):
            if tile_name in self.hkeys(username, "tile_module_index"):
                self.hdel(username, "tile_module_index", tile_name)
        return

    def hset(self, username, d, k, v):
        redis_client.hset("tile_manager.{}.{}".format(username, d), k, v)

    def hadd(self, username, d, k):
        redis_client.hincrby("tile_manager.{}.{}".format(username, d), k)

    def hdel(self, username, d, k):
        redis_client.hdel("tile_manager.{}.{}".format(username, d), k)

    def hexists(self, username, d):
        return redis_client.exists("tile_manager.{}.{}".format(username, d))

    def hget(self, username, d, k):
        return redis_client.hget("tile_manager.{}.{}".format(username, d), k)

    def hkeys(self, username, d):
        return redis_client.hkeys("tile_manager.{}.{}".format(username, d))

    def vset(self, username, k, v):
        redis_client.set("tile_manager.{}.{}".format(username, k), v)

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name, is_default=False):
        print("adding tile {}".format(tile_name))

        # self.unload_one_tile(username, tile_name, tile_module_name)
        if self.hexists(username, "failed_loaded_default_modules"):
            if tile_module_name in self.hkeys(username, "failed_loaded_default_modules"):
                self.hdel(username, "failed_loaded_default_modules", tile_module_name)

        self.vset(username, "user_tiles.{}.{}".format(category, tile_name), tile_module)

        self.hset(username, "tile_module_index", tile_name, tile_module_name)
        self.hadd(username, "loaded_user_modules", tile_module_name)

        if is_default:
            self.hadd(username, "default_tiles", tile_name)
        return


tactic_app.global_tile_manager = GlobalTileManager()

