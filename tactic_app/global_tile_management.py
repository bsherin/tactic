
from docker_functions import create_container, ContainerCreateError
from users import User, load_user, initial_metadata
import tactic_app

class GlobalTileManager(object):

    def __init__(self):
        self.initialize()

    def initialize(self):
        self.tile_classes = {}
        self.user_tiles = {}
        self.loaded_user_modules = {}
        self.tile_module_index = {}
        try:
            self.test_tile_container_id, container_id = create_container("tactic_tile_image",
                                                                         network_mode="bridge",
                                                                         container_name="tile_test_container",
                                                                         register_container=False)
        except ContainerCreateError:
            print "failed to create the test tile_container. That's very bad."
            exit()

    def get_all_default_tiles(self):
        repository_user = User.get_user_by_username("repository")
        if repository_user is not None:
            tm_list = repository_user.get_resource_names("tile", tag_filter="default")

            for tm in tm_list:
                module_code = repository_user.get_tile_module(tm)
                res_dict = tactic_app.host_worker.post_and_wait(self.test_tile_container_id, "load_source",
                                                  {"tile_code": module_code})
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
        if username not in self.tile_module_index:
            self.tile_module_index[username] = {}

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
        mdata = initial_metadata
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

    def get_module_from_type(self, username, tile_type):
        # First check to see if this is actually one of the default tiles
        self.add_user(username)
        if tile_type not in self.tile_module_index[username]:
            return None
        else:
            return self.tile_module_index[username][tile_type]

    def add_user_tile_module(self, username, category, tile_name, tile_module, tile_module_name):
        self.add_user(username)
        if category not in self.user_tiles[username]:
            self.user_tiles[username][category] = {}
        self.user_tiles[username][category][tile_name] = tile_module
        self.tile_module_index[username][tile_name] = tile_module_name
        if tile_module_name not in self.loaded_user_modules[username]:
            self.loaded_user_modules[username].append(tile_module_name)

tactic_app.global_tile_manager = GlobalTileManager()