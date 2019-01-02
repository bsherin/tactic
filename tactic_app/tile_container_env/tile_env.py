import sys
# import nltk
# import wordcloud
# from sentiment_tools import vader_sentiment_analyzer, sentiwordnet, TacticVader
import warnings
import matplotlib
matplotlib.use("Agg")

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    from matplotlib_utilities import ColorMapper, FigureCanvas, MplFigure
    # noinspection PyUnresolvedReferences
    from matplotlib.cm import get_cmap

from tile_base import TileBase
from d3utilities import D3Tile

class_info = {"class_name": "",
              "tile_class": None}

tile_name = ""
tile_class = None


def global_import(imp):
    globals()[imp] = __import__(imp, globals(), locals(), [], 0)
    return


def user_tile(tclass):
    class_info["class_name"] = tclass.__name__
    class_info["tile_class"] = tclass
    return tclass


def exec_tile_code(tile_code):
    try:
        exec(tile_code)
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "tile_name": class_info["class_name"], "category": class_info["tile_class"].category}

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
# nltk.data.path = ['/code/lexicons/']


