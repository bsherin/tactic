
import nltk
import sys
import copy
# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']
import numpy
import sklearn
import scipy
from tactic_app.clusterer_classes import CentroidClusterer, OptCentroidClusterer
from matplotlib_utilities import GraphList, ColorMapper, FigureCanvas, ArrayHeatmap

from tile_base import TileBase

def user_tile(tclass):
    from shared_dicts import user_tiles
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