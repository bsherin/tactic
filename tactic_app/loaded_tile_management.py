
print ("in gtm")
import copy
import datetime
import os
import re
from redis_tools import redis_tm, hadd, hdel, hexists, hget, hkeys, hset, vset


def get_repository_tiles_matching_tag(tag):
    from users import User
    repository_user = User.get_user_by_username("repository")
    if repository_user is not None:
        tm_list = repository_user.get_resource_names("tile", tag_filter=tag)
    else:
        tm_list = []
    return tm_list


def load_user_default_tiles(username):
    from users import User
    import tactic_app
    the_user = User.get_user_by_username(username)
    error_list = []
    if the_user is not None:
        tm_list = the_user.get_resource_names("tile", tag_filter="default")

        for tm in tm_list:
            print('posting task to load tile_module {}'.format(tm))
            tactic_app.host_worker.post_task("host", "load_tile_module_task", {"tile_module_name": tm,
                                                                               "user_id": the_user.get_id(),
                                                                               "show_failed_loads": True,
                                                                               "is_default": True})

    else:
        error_list.append("unable to load user")
    return error_list


def add_failed_load(module_name, username):
    hadd(username, "failed_loaded_default_modules", module_name)


def remove_user(username):
    all_keys = redis_tm.keys("{}.*".format(username))
    if len(all_keys) > 0:
        redis_tm.delete(*all_keys)


def tile_type_string(username):
    return "{}\.user_tiles\.(.*)?\.(.*)".format(username)


def get_user_available_tile_types(username, nested=False):
    tile_types = {}
    all_keys = redis_tm.keys("{}.user_tiles.*".format(username))

    try:
        for k in all_keys:
            sstring = tile_type_string(username)
            cat, tile_type = re.findall(sstring, k)[0]
            if cat not in tile_types:
                tile_types[cat] = []
            tile_types[cat].append(tile_type)

        if len(list(tile_types.keys())) == 0:
            print("user tiles don't seem to be loaded. so load them")
            load_user_default_tiles(username)
            return get_user_available_tile_types(username, nested=True)

    except AttributeError:
        if nested:  # avoid infinite recursion
            return {}
        print("user tiles don't seem to be loaded. so load them")
        load_user_default_tiles(username)
        return get_user_available_tile_types(username, nested=True)
    return tile_types


def create_initial_metadata():

    initial_metadata = {"datetime": datetime.datetime.utcnow(),
                        "updated": datetime.datetime.utcnow(),
                        "tags": "",
                        "notes": ""}

    return initial_metadata


def get_loaded_user_tiles_list(username):
    loaded_tiles = []
    all_keys = redis_tm.keys("{}.user_tiles.*".format(username))
    for k in all_keys:
        sstring = tile_type_string(username)
        _cat, tile_type = re.findall(sstring, k)[0]
        loaded_tiles.append(tile_type)

    return loaded_tiles


def get_failed_loads_list(username):
    if hexists(username, "failed_loaded_default_modules"):
        return sorted(hkeys(username, "failed_loaded_default_modules"))
    else:
        return []


def get_default_tiles(username):
    if hexists(username, "default_tiles"):
        return sorted(hkeys(username, "default_tiles"))
    else:
        return []


def get_nondefault_tiles_list(username):
    loaded_tiles = get_loaded_user_tiles_list(username)
    default_tiles = get_default_tiles(username)
    return [tname for tname in loaded_tiles if tname not in default_tiles]


def unload_user_tiles(username):

    kstr = "{}.*".format(username)
    all_keys = redis_tm.keys(kstr)
    for k in all_keys:
        redis_tm.delete(k)
    load_user_default_tiles(username)


def get_loaded_tile_types(username):
    if hexists(username, "tile_module_index"):
        return hkeys(username, "tile_module_index")
    else:
        return []


def get_module_from_type(username, tile_type):
    if hexists(username, "tile_module_index"):
        the_types = hkeys(username, "tile_module_index")
        if tile_type not in the_types:
            return None
        else:
            return hget(username, "tile_module_index", the_type)


def get_loaded_user_modules(username):
    if hexists(username, "loaded_user_modules"):
        return hkeys(username, "loaded_user_modules")
    else:
        return []


def unload_one_tile(username, tile_name, tile_module_name):

    all_user_tiles_keys = redis_tm.keys("{}.user_tiles.*".format(username))
    for k in all_user_tiles_keys:
        sstring = tile_type_string(username)
        _cat, tile_type = re.findall(sstring, k)[0]
        if tile_name == tile_type:
            redis_tm.delete(k)

    if hexists(username, "loaded_user_modules"):
        if tile_module_name in hkeys(username, "loaded_user_modules"):
            hdel(username, "loaded_user_modules", tile_module_name)

    if hexists(username, "tile_module_index"):
        if tile_name in hkeys(username, "tile_module_index"):
            hdel(username, "tile_module_index", tile_name)
    return


def add_user_tile_module(username, category, tile_name, tile_module, tile_module_name, is_default=False):
    print("adding tile {}".format(tile_name))

    unload_one_tile(username, tile_name, tile_module_name)
    if hexists(username, "failed_loaded_default_modules"):
        if tile_module_name in hkeys(username, "failed_loaded_default_modules"):
            hdel(username, "failed_loaded_default_modules", tile_module_name)

    vset(username, "user_tiles.{}.{}".format(category, tile_name), tile_module)

    hset(username, "tile_module_index", tile_name, tile_module_name)
    hadd(username, "loaded_user_modules", tile_module_name)

    if is_default:
        hadd(username, "default_tiles", tile_name)
    return


def get_tile_code(tile_type, username):
    print("in get_tile_code in loaded_tile_management with username {}, tile_type {}".format(username, tile_type))
    klist = redis_tm.keys("{}.user_tiles.*.{}".format(username, tile_type))
    print("got klist " + str(klist))
    if len(klist) > 0:
        return redis_tm.get(klist[0])
    else:
        return None
