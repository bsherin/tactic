import sys
import nltk
import numpy
import wordcloud
# from tactic_app.clusterer_classes import CentroidClusterer, OptCentroidClusterer
from sentiment_tools import vader_sentiment_analyzer, sentiwordnet
from matplotlib_utilities import GraphList, ColorMapper, FigureCanvas, ArrayHeatmap, ImageShow, MplFigure
from bson.binary import Binary
from tile_base import TileBase

tile_name = ""
tile_class = None

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['./nltk_data/']


def user_tile(tclass):
    global tile_name, tile_class
    tile_name = tclass.__name__
    tile_class = tclass
    return tclass


def exec_tile_code(tile_code):
    try:
        exec tile_code
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "tile_name": tile_name, "category": tile_class.category}