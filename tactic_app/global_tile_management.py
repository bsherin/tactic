import datetime
from docker_functions import create_container, get_address, send_direct_request_to_container
from users import User, load_user

# global_stuff

class GlobalTileManager(object):

    def __init__(self):
        self.initialize()

    def initialize(self):
        self.tile_classes = {}
        self.user_tiles = {}
        self.loaded_user_modules = {}
        self.test_tile_container_id = create_container("tactic_tile_image",
                                                  network_mode="bridge",
                                                  container_name="tile_test_container")
        self.test_tile_container_address = get_address(self.test_tile_container_id, "bridge")

    def get_all_default_tiles(self):
        repository_user = User.get_user_by_username("repository")
        if repository_user is not None:
            tm_list = repository_user.get_resource_names("tile", tag_filter="default")

            for tm in tm_list:
                module_code = repository_user.get_tile_module(tm)
                result = send_direct_request_to_container(self.test_tile_container_id, "load_source", {"tile_code": module_code,
                                                                                                  "megaplex_address": None})
                res_dict = result.json()
                if res_dict["success"]:
                    category = res_dict["category"]
                    if category not in self.tile_classes:
                        self.tile_classes[category] = {}
                    self.tile_classes[category][res_dict["tile_name"]] = module_code
                else:
                    print "Error loading tile " + res_dict["message_string"]

    def add_user(self, username):
        if username not in self.loaded_user_modules:
            self.loaded_user_modules[username] = []
        if username not in self.user_tiles:
            self.user_tiles[username] = {}

    def remove_user(self, username):
        if username in self.user_tiles:
            del self.user_tiles[username]
        if username in self.loaded_user_modules:
            del self.loaded_user_modules[username]

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

    def get_default_tile_types(self):
        tile_types = {}
        for (category, the_dict) in self.tile_classes.items():
            tile_types[category] = the_dict.keys()
        return tile_types

    def get_user_available_tile_types(self, username):
        tile_types = self.get_default_tile_types()

        if username in self.user_tiles:
            for (category, the_dict) in self.user_tiles[username].items():
                if category not in tile_types:
                    tile_types[category] = []
                tile_types[category] += the_dict.keys()
        return tile_types

    @staticmethod
    def create_initial_metadata():
        mdata = {"datetime": datetime.datetime.today(),
                 "updated": datetime.datetime.today(),
                 "tags": "",
                 "notes": ""}
        return mdata

    def get_loaded_user_tiles_list(self, username):
        loaded_tiles = []
        if username in self.user_tiles:
            for (category, the_dict) in self.user_tiles[username].items():
                loaded_tiles += the_dict.keys()
        return loaded_tiles

    def unload_user_tiles(self, username):
        self.loaded_user_modules[username] = []
        self.user_tiles[username] = {}

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name):
        self.add_user(username)
        if category not in self.user_tiles[username]:
            self.user_tiles[username][category] = {}
        self.user_tiles[username][category][tile_name] = tile_module

        if username not in self.loaded_user_modules:
            self.loaded_user_modules[username] = []
        if tile_module_name not in self.loaded_user_modules[username]:
            self.loaded_user_modules[username].append(tile_module_name)

global_tile_manager = GlobalTileManager()