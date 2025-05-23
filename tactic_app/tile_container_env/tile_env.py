import sys
import importlib
import warnings
import matplotlib
from exception_mixin import generic_exception_handler
matplotlib.use("Agg")
print(f"matplotlib version is {matplotlib.__version__}")

with (warnings.catch_warnings()):
    warnings.simplefilter("ignore")
    from matplotlib_utilities import ColorMapper, FigureCanvas, MplFigure
    # noinspection PyUnresolvedReferences
    # get_cmap = matplotlib.cm.ColormapRegistry.get_cmap

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

def escape_html(html):
    return (
        str(html).replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&#39;")
    )
xh = escape_html

def ds(txt):
    if Tile:
        Tile.display_status(txt)
    return


def tactic_import(code_name):
    the_code = Library.codes[code_name].the_code
    fname = f"{code_name}.py"
    with open(fname, "w") as f:
        f.write(the_code)
    module = importlib.import_module(code_name)
    globals()[code_name] = module
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
    ## Note it shouldn't be necessary to return the category anymore
    return {"success": True, "tile_name": class_info["class_name"], "category": class_info["tile_class"].category}

