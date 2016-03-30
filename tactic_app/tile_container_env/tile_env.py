import sys

import nltk

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
from flask_login import current_user

from tactic_app.shared_dicts import tile_classes, user_tiles


# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    if not tclass.category in tile_classes:
        tile_classes[tclass.category] = {}
    tile_classes[tclass.category][tclass.__name__] = tclass
    return tclass



def user_tile(tclass):
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