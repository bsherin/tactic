import datetime
from docker_functions import create_container, get_address, send_direct_request_to_container
from users import User, load_user

# tactic_todo mainwindow_instances isn't used anymoe I think
mainwindow_instances = {}
tile_classes = {}

# tactic_todo user_tiles and loaded_user_modules will need to somehow be shared across workers
user_tiles = {}
loaded_user_modules = {}

# tactic_todo test tile container: should there be one for every worker? That's probably okay.
test_tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
test_tile_container_address = get_address(test_tile_container_id, "bridge")

def get_all_default_tiles():
    repository_user = User.get_user_by_username("repository")
    if repository_user is not None:
        tm_list = repository_user.get_resource_names("tile", tag_filter="default")

        for tm in tm_list:
            module_code = repository_user.get_tile_module(tm)
            result = send_direct_request_to_container(test_tile_container_id, "load_source", {"tile_code": module_code,
                                                                                              "megaplex_address": None})
            res_dict = result.json()
            if res_dict["success"]:
                category = res_dict["category"]
                if category not in tile_classes:
                    tile_classes[category] = {}
                tile_classes[category][res_dict["tile_name"]] = module_code
            else:
                print "Error loading tile " + res_dic["message_string"]


def get_tile_code(tile_type, user_id):
    user_obj = load_user(user_id)
    if user_obj.username in user_tiles:
        for (category, the_dict) in user_tiles[user_obj.username].items():
            if tile_type in the_dict:
                return the_dict[tile_type]
    for (category, the_dict) in tile_classes.items():
        if tile_type in the_dict:
            return the_dict[tile_type]


def create_initial_metadata():
    mdata = {"datetime": datetime.datetime.today(),
             "updated": datetime.datetime.today(),
             "tags": "",
             "notes": ""}
    return mdata
