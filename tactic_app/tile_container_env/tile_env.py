import sys
import nltk
import numpy
import wordcloud
from sentiment_tools import vader_sentiment_analyzer, sentiwordnet
from matplotlib_utilities import GraphList, ColorMapper, FigureCanvas, ArrayHeatmap, ImageShow, MplFigure
# noinspection PyUnresolvedReferences
from matplotlib.cm import get_cmap
from bson.binary import Binary
from tile_base import TileBase
import sklearn

class_info = {"class_name": "",
              "tile_class": None}

tile_name = ""
tile_class = None

code_names = {"classes":{},
              "functions": {}}

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
nltk.data.path = ['/code/lexicons/']

def user_tile(tclass):
    class_info["class_name"] = tclass.__name__
    class_info["tile_class"] = tclass
    return tclass

def user_function(the_func):
    code_names["functions"][the_func.__name__] = the_func
    return the_func

def user_class(the_class):
    code_names["classes"][the_class.__name__] = the_class
    return the_class

def exec_tile_code(tile_code):
    try:
        exec tile_code
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "tile_name": class_info["class_name"], "category": class_info["tile_class"].category}

def clear_and_exec_user_code(the_code):
    code_names["classes"] = {}
    code_names["functions"] = {}
    try:
        exec the_code
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "classes": code_names["classes"].keys(), "functions": code_names["functions"].keys()}
