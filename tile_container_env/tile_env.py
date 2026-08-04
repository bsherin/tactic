
import hashlib
import importlib
import linecache
from exception_mixin import generic_exception_handler

from tile_base import TileBase

class_info = {"class_name": "",
              "tile_class": None}

loaded_source_info = None

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
    global loaded_source_info
    try:
        source_hash = hashlib.sha256(tile_code.encode("utf-8")).hexdigest()
        # Use an absolute pseudo-path instead of an angle-bracket name such as
        # <tactic-tile:...>.  Tracebacks are displayed as HTML in the error
        # drawer, where angle-bracket filenames are parsed as tags and vanish.
        filename = f"/tactic/user-code/{source_hash[:16]}.py"
        source_lines = tile_code.splitlines(keepends=True)
        if tile_code and not tile_code.endswith(("\n", "\r")):
            source_lines[-1] += "\n"
        linecache.cache[filename] = (len(tile_code), None, source_lines, filename)
        compiled_code = compile(tile_code, filename, "exec")
        exec(compiled_code, globals(), globals())
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_dict(ex)
    loaded_source_info = {
        "filename": filename,
        "source_hash": source_hash,
        "line_count": len(tile_code.splitlines()),
    }
    ## Note it shouldn't be necessary to return the category anymore
    return {"success": True, "tile_name": class_info["class_name"],
            "category": class_info["tile_class"].category,
            "source_info": dict(loaded_source_info)}


def get_loaded_source_info():
    if loaded_source_info is None:
        return None
    return dict(loaded_source_info)
