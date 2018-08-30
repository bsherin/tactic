
from docker_functions import create_container, ContainerCreateError
import copy
import datetime
from users import User, load_user
import tactic_app


# noinspection PyAttributeOutsideInit
class GlobalTileManager(object):

    def __init__(self):
        self.initialize()

    def initialize(self):
        self.user_tiles = {}  # dict[usernamer][category][tile_name] = module_code
        self.loaded_user_modules = {}  # dict[username] = [list of tile_module_names]
        self.tile_module_index = {}  # dict[username][tile_name] = tile_module_name
        self.default_tiles = {}  # dict[username] = [list of tile_names]
        self.failed_loaded_default_modules = {}  # dict[username] = [list of tile_module_names]
        try:
            self.test_tile_container_id, container_id = create_container("tactic_tile_image",
                                                                         network_mode="bridge",
                                                                         container_name="tile_test_container",
                                                                         register_container=False,
                                                                         other_name="test_container")
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
        self.failed_loaded_default_modules[username] = []
        self.default_tiles[username] = []
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
        if module_name not in self.failed_loaded_default_modules[username]:
            self.failed_loaded_default_modules[username].append(module_name)

    def add_user(self, username):
        if username not in self.loaded_user_modules:
            self.loaded_user_modules[username] = []
        if username not in self.user_tiles:
            self.user_tiles[username] = {}
        if username not in self.tile_module_index:
            self.tile_module_index[username] = {}
        if username not in self.failed_loaded_default_modules:
            self.failed_loaded_default_modules[username] = []
        if username not in self.default_tiles:
            self.default_tiles[username] = []

    def remove_user(self, username):
        if username in self.loaded_user_modules:
            del self.loaded_user_modules[username]
        if username in self.user_tiles:
            del self.user_tiles[username]
        if username in self.tile_module_index:
            del self.tile_module_index[username]
        if username in self.failed_loaded_default_modules:
            del self.failed_loaded_default_modules[username]
        if username in self.default_tiles:
            del self.default_tiles[username]

    def get_tile_code(self, tile_type, user_id):
        user_obj = load_user(user_id)
        if user_obj.username in self.user_tiles:
            for (category, the_dict) in self.user_tiles[user_obj.username].items():
                if tile_type in the_dict:
                    return the_dict[tile_type]
        for (category, the_dict) in self.tile_classes.items():
            if tile_type in the_dict:
                return the_dict[tile_type]
        return None

    def get_user_available_tile_types(self, username):
        tile_types = {}
        if username in self.user_tiles:
            for (category, the_dict) in self.user_tiles[username].items():
                if category not in tile_types:
                    tile_types[category] = []
                tile_types[category] += the_dict.keys()
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
        if username in self.user_tiles:
            for (category, the_dict) in self.user_tiles[username].items():
                loaded_tiles += the_dict.keys()
        return loaded_tiles

    def get_failed_loads_list(self, username):
        return sorted(self.failed_loaded_default_modules[username])

    def get_default_tiles(self, username):
        return sorted(self.default_tiles[username])

    def get_nondefault_tiles_list(self, username):
        loaded_tiles = self.get_loaded_user_tiles_list(username)
        default_tiles = self.default_tiles[username]
        return [tname for tname in loaded_tiles if tname not in default_tiles]

    def unload_user_tiles(self, username):
        self.loaded_user_modules[username] = []
        self.user_tiles[username] = {}
        self.tile_module_index[username] = {}
        self.load_user_default_tiles(username)

    def get_module_from_type(self, username, tile_type):
        # First check to see if this is actually one of the default tiles
        self.add_user(username)
        if tile_type not in self.tile_module_index[username]:
            return None
        else:
            return self.tile_module_index[username][tile_type]

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name, is_default=False):
        self.add_user(username)
        if tile_module_name in self.failed_loaded_default_modules[username]:
            self.failed_loaded_default_modules[username].remove(tile_module_name)
        if tile_name in self.default_tiles[username]:
            self.default_tiles[username].remove(tile_name)
        if category not in self.user_tiles[username]:
            self.user_tiles[username][category] = {}
        self.user_tiles[username][category][tile_name] = tile_module
        self.tile_module_index[username][tile_name] = tile_module_name
        if tile_module_name not in self.loaded_user_modules[username]:
            self.loaded_user_modules[username].append(tile_module_name)
        if is_default:
            self.default_tiles[username].append(tile_name)
        return


tactic_app.global_tile_manager = GlobalTileManager()
