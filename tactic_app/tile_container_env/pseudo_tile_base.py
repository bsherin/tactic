import sys, copy
from io import StringIO
import ast
from bson.binary import Binary
import os
import types
import pickle
from pickle import UnpicklingError
from tile_base import TileBase, _task_worthy, _jsonizable_types
from communication_utils import is_jsonizable, make_python_object_jsonizable, debinarize_python_object
import document_object

# noinspection PyUnresolvedReferences
from qworker import task_worthy_methods

from matplotlib_utilities import MplFigure, ColorMapper

PSEUDO_WIDTH = 300
PSEUDO_HEIGHT = 300

print("initializing objects")

Tile = None
Collection = None
Tiles = None
Pipes = None


# noinspection PyTypeChecker
class ConsoleStringIO(StringIO):
    def __init__(self, tile, data):
        self.my_tile = tile
        self.data = data
        StringIO.__init__(self)
        return

    def write(self, s):
        StringIO.write(self, s)
        if not s == "\n":   # The print commmand automatically adds a \n. We don't want to print it.
            self.data["result_string"] = s
            self.my_tile._tworker.post_task(self.my_tile._main_id, "got_console_print", self.data)
        return


# noinspection PyUnusedLocal
class PseudoTileClass(TileBase, MplFigure):
    category = "word"
    exports = []
    measures = ["raw_freq", "student_t", "chi_sq", "pmi", "likelihood_ratio"]

    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self, tile_name=tile_name)
        self.width = PSEUDO_WIDTH
        self.height = PSEUDO_HEIGHT
        MplFigure.__init__(self)
        globals()["self"] = self
        self._saved_globals = copy.copy(globals())
        self.execution_counter = 0
        return

    @_task_worthy
    def compile_save_dict(self, data):
        print("entering compile_save_dict")
        result = {"binary_attrs": [], "imports": []}
        attrs = globals().keys()
        for attr in attrs:
            if attr in self._saved_globals:
                continue
            attr_val = globals()[attr]
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict(data)
            elif isinstance(attr_val, types.ModuleType):
                result["imports"].append(attr)
            elif((type(attr_val) == dict) and (len(attr_val) > 0) and
                 hasattr(list(attr_val.values())[0], "compile_save_dict")):
                res = {}
                for(key, val) in attr_val.items():
                    res[key] = attr_val.compile_save_dict(data)
                result[attr] = res
            else:
                if type(attr_val) in _jsonizable_types.values():
                    if is_jsonizable(attr_val):
                        result[attr] = attr_val
                        continue
                try:
                    self._tworker.debug_log("Found non jsonizable attribute " + attr)
                    result["binary_attrs"].append(attr)
                    bser_attr_val = make_python_object_jsonizable(attr_val)
                    result[attr] = bser_attr_val
                    if is_jsonizable(bser_attr_val):
                        print("new bser_attr_val is jsonizable")
                    else:
                        print("new bser_attr_val is not jsonizable")
                except TypeError:
                    print("got a TypeError")
                    continue
        result["tile_id"] = self._tworker.my_id  # I had to move this down here because it was being overwritten
        result["img_dict"] = make_python_object_jsonizable(self.img_dict)
        result["module_name"] = None
        result["execution_counter"] = self.execution_counter
        print("done compiling attributes " + str(list(result.keys())))
        return result

    def recreate_from_save(self, save_dict):
        print("entering recreate from save in pseudo_tile_base")
        print(str(list(save_dict.keys())))
        if "binary_attrs" not in save_dict:
            save_dict["binary_attrs"] = []
        if "imports" in save_dict:
            for imp in save_dict["imports"]:
                try:
                    globals()[imp] = __import__(imp, globals(), locals(), [], -1)
                except:
                    print("problem importing " + str(imp))
        if "img_dict" in save_dict:
            try:
                self.img_dict = debinarize_python_object(save_dict["img_dict"])
            except Exception as ex:  # legacy if above fails
                self.img_dict = {}
                self._handle_exception(ex, "debinarizing failed for img_dict",
                                       print_to_console=True)

        if "execution_counter" in save_dict:
            self.execution_counter = save_dict["execution_counter"]
        for (attr, attr_val) in save_dict.items():
            print("attr is " + attr)
            try:
                if attr in ["binary_attrs", "imports", "functions", "img_dict", "execution_counter"]:
                    continue
                if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                    cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                    globals()[attr] = cls.recreate_from_save(attr_val)
                elif((type(attr_val) == dict) and(len(attr_val) > 0) and
                     hasattr(list(attr_val.values())[0], "recreate_from_save")):
                    cls = getattr(sys.modules[__name__], list(attr_val.values())[0]["my_class_for_recreate"])
                    res = {}
                    for(key, val) in attr_val.items():
                        res[key] = cls.recreate_from_save(val)
                    globals()[attr] = res
                else:
                    if isinstance(attr_val, Binary):  # seems like this is never true even for old-style saves
                        decoded_val = pickle.loads(str(attr_val.decode()))
                        globals()[attr] = decoded_val
                    elif attr in save_dict["binary_attrs"]:
                        try:
                            print("trying to debinarize")
                            decoded_val = debinarize_python_object(attr_val)
                            print("debinarize succeeded")
                        except Exception as ex:  # legacy if above fails
                            self._handle_exception(ex, "debinarizing failed for attr {}".format(attr),
                                                   print_to_console=True)
                            decoded_val = None
                        globals()[attr] = decoded_val
                    else:
                        globals()[attr] = attr_val
            except:
                print("failed to recreate attribute " + attr)

        self._main_id = os.environ["PARENT"]  # this is for backward compatibility with some old project saves
        return None

    @_task_worthy
    def store_image(self, data):
        encoded_img = data["img"]
        self.img_dict[data["figure_name"]] = debinarize_python_object(encoded_img)
        return {"success": True}

    @_task_worthy
    def exec_console_code(self, data):
        old_stdout = sys.stdout
        try:
            if not Collection:
                self._tworker.create_pseudo_tile_collection_object(data)
            self._pipe_dict = data["pipe_dict"]
            redirected_output = ConsoleStringIO(self, data)
            sys.stdout = redirected_output
            the_code = data["the_code"]
            as_tree = ast.parse(the_code)
            if as_tree.body[-1].__class__.__name__ == "Expr":
                lnumber = as_tree.body[-1].lineno - 1
                code_lines = the_code.splitlines()
                code_to_eval = code_lines[lnumber]
                code_to_exec = "\n".join(code_lines[:lnumber])
                exec(code_to_exec, globals(), globals())
                print(eval(code_to_eval, globals(), globals()))
            else:
                exec(data["the_code"], globals(), globals())
            sys.stdout = old_stdout
            self.execution_counter += 1
            data["execution_count"] = self.execution_counter
        except Exception as ex:
            data["execution_count"] = "*"
            data["result_string"] = self._handle_exception(ex, "Error executing console code", print_to_console=False)
            sys.stdout = old_stdout
        return data
