import sys

import nltk

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']

from tactic_app.shared_dicts import tile_classes, weight_functions
from users import User

def weight_function(wfunc):
    weight_functions[wfunc.__name__] = wfunc
    return wfunc

# Decorator function used to register runnable analyses in analysis_dict
def user_tile(tclass):
    if not tclass.category in tile_classes:
        tile_classes[tclass.category] = {}
    tile_classes[tclass.category][tclass.__name__] = tclass
    return tclass

def create_default_tiles(tile_code):
    try:
        exec tile_code
    except:
        return str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
    return "success"


def get_all_default_tiles():
    repository_user = User.get_user_by_username("repository")
    if repository_user is not None:
        tm_list = repository_user.get_resource_names("tile", tag_filter="default")

        for tm in tm_list:
            module_code = repository_user.get_tile_module(tm)
            create_default_tiles(module_code)