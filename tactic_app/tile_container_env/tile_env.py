import sys
import nltk
import numpy
import wordcloud
# from tactic_app.clusterer_classes import CentroidClusterer, OptCentroidClusterer
from sentiment_tools import vader_sentiment_analyzer, sentiwordnet
from matplotlib_utilities import GraphList, ColorMapper, FigureCanvas, ArrayHeatmap, ImageShow, MplFigure
from matplotlib.cm import get_cmap
from bson.binary import Binary
from tile_base import TileBase
import sklearn

class_info = {"class_name": "",
              "tile_class": None}

tile_name = ""
tile_class = None

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['/code/lexicons/']


def user_tile(tclass):
    class_info["class_name"] = tclass.__name__
    class_info["tile_class"] = tclass
    return tclass


def exec_tile_code(tile_code):
    try:
        exec tile_code
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "tile_name": class_info["class_name"], "category": class_info["tile_class"].category}