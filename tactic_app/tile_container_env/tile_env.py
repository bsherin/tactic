import sys
# import nltk
# import wordcloud
# from sentiment_tools import vader_sentiment_analyzer, sentiwordnet, TacticVader
import warnings
import matplotlib
from exception_mixin import generic_exception_handler
matplotlib.use("Agg")

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    from matplotlib_utilities import ColorMapper, FigureCanvas, MplFigure
    # noinspection PyUnresolvedReferences
    from matplotlib.cm.ColorMapRegistry import get_cmap

from tile_base import TileBase
from d3utilities import D3Tile

class_info = {"class_name": "",
              "tile_class": None}

tile_name = ""
tile_class = None

Tile = None
from document_object import Collection
from library_object import Library
from remote_tile_object import Tiles
from remote_tile_object import Pipes
from settings_object import Settings


def global_import(*argv):
    for imp in argv:
        globals()[imp] = __import__(imp, globals(), locals(), [], 0)
    return


def user_tile(tclass):
    class_info["class_name"] = tclass.__name__
    class_info["tile_class"] = tclass
    return tclass


# noinspection PyRedundantParentheses
def exec_tile_code(tile_code):
    try:
        exec(tile_code, globals(), globals())
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_dict(ex)
    return {"success": True, "tile_name": class_info["class_name"], "category": class_info["tile_class"].category}

# I want nltk to only search here so that I can see
# what behavior on remote will be like.
# nltk.data.path = ['/code/lexicons/']
