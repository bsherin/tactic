
import nltk
import sys
import copy
# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
from nltk.corpus import wordnet as wn
from flask_login import current_user
from flask import url_for
from matplotlib_utilities import GraphList, ColorMapper, FigureCanvas, ArrayHeatmap, ImageShow, MplFigure

from tile_base import TileBase
from tactic_app.shared_dicts import mainwindow_instances, distribute_event
from tactic_app.shared_dicts import tile_classes, user_tiles, tokenizer_dict, weight_functions
from users import load_user
from tactic_app.clusterer_classes import CentroidClusterer, OptCentroidClusterer
from tactic_app.sentiment_tools import vader_sentiment_analyzer, sentiwordnet
import numpy
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
    tm_list = repository_user.get_resource_names("tile", tag_filter="default")

    for tm in tm_list:
        module_code = repository_user.get_tile_module(tm)
        create_default_tiles(module_code)