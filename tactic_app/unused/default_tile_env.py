import sys
import nltk
from tactic_app.global_tile_management import tile_classes, weight_functions
from tactic_app.users import User

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']


def weight_function(wfunc):
    weight_functions[wfunc.__name__] = wfunc
    return wfunc


# Decorator function used to register runnable analyses in analysis_dict
def user_tile(tclass):
    if tclass.category not in tile_classes:
        tile_classes[tclass.category] = {}
    tile_classes[tclass.category][tclass.__name__] = tclass
    return tclass


