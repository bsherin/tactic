import sys

import nltk

# I want nltk to only search here so that I can see
# what behavior on remote will be like
nltk.data.path = ['./nltk_data/']
#import sklearn

from users import User

def user_tile(tclass):
    from tactic_app.shared_dicts import user_tiles
    from flask_login import current_user
    uname = current_user.username
    if not (uname in user_tiles):
        user_tiles[uname] = {}
    if not tclass.category in user_tiles[uname]:
        user_tiles[uname][tclass.category] = {}
    user_tiles[uname][tclass.category][tclass.__name__] = tclass
    return tclass

def create_user_tiles(tile_code):
    try:
        exec tile_code
    except:
        return str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
    return "success"

def create_default_tiles(tile_code):
    try:
        exec tile_code
    except:
        return str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
    return "success"


def get_all_default_tiles():
    repository_user = User.get_user_by_username("repository")
    tm_list = repository_user.get_resource_names("tile", tag_filter="default")

    for tm in tm_list:
        module_code = repository_user.get_tile_module(tm)
        create_default_tiles(module_code)