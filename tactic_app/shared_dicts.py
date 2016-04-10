import datetime
from docker_functions import create_container, get_address, send_request_to_container
from users import User


mainwindow_instances = {}
tile_classes = {}
user_tiles = {}
loaded_user_modules = {}

test_tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
test_tile_conatiner_address = get_address(test_tile_container_id, "bridge")


def get_all_default_tiles():
    repository_user = User.get_user_by_username("repository")
    if repository_user is not None:
        tm_list = repository_user.get_resource_names("tile", tag_filter="default")

        for tm in tm_list:
            module_code = repository_user.get_tile_module(tm)
            result = send_request_to_container(test_tile_container_id, "load_source", {"tile_code": module_code})
            res_dict = result.json()
            if res_dict["success"]:
                category = res_dict["category"]
                if category not in tile_classes:
                    tile_classes[category] = {}
                tile_classes[category][res_dict["tile_name"]] = module_code


def get_tile_code(tile_type):
    for (category, the_dict) in tile_classes.items():
        if tile_type in the_dict:
            return the_dict[tile_type]


def create_initial_metadata():
    mdata = {"datetime": datetime.datetime.today(),
             "updated": datetime.datetime.today(),
             "tags": "",
             "notes": ""}
    return mdata
