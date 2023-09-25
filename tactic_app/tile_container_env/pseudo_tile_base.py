import sys, copy
from io import StringIO
import ast
from bson.binary import Binary
import os
import re
import types
import pickle
from pickle import UnpicklingError
from tile_base import TileBase, _task_worthy, _jsonizable_types
from communication_utils import is_jsonizable, make_python_object_jsonizable, debinarize_python_object
from communication_utils import emit_direct, socketio
import document_object
from document_object import ROWS_TO_PRINT, DetachedTacticCollection
from qworker import debug_log

from threading import Lock
import gevent

ethread = None
executing_console_id = None
exec_queue = []

# noinspection PyUnresolvedReferences
from qworker import task_worthy_methods

from matplotlib_utilities import MplFigure, ColorMapper

PSEUDO_WIDTH = 300
PSEUDO_HEIGHT = 300

ROUGH_CHARS_PER_EVAL_ROW = 150

Tile = None
Collection = None
Tiles = None
Pipes = None


def display(txt):
    sys.stdout.overwrite(txt)
    return

# noinspection PyTypeChecker
MAX_SINGLE_WRITE = 5000

class ConsoleStringIO(StringIO):
    def __init__(self, tile, data, old_stdout):
        self.my_tile = tile
        self.data = data
        self.old_stdout = old_stdout
        StringIO.__init__(self)
        return

    def crop_output(self, s):
        new_s = s[:150]
        new_s = re.sub("<", "&lt;", new_s)
        new_s = re.sub(">", "&gt;", new_s) + " ..."
        return new_s

    def write(self, s):
        sv_stdout = sys.stdout
        sys.stdout = self.old_stdout  # This is necessary in case there is a print statement in post_task.
        if len(s) > MAX_SINGLE_WRITE:
            s = self.crop_output(s)
        StringIO.write(self, s)
        if not s == "\n":   # The print commmand automatically adds a \n. We don't want to print it.
            self.data["force_open"] = True
            self.data["message"] = s
            self.data["console_message"] = "consoleCodePrint"
            # self.my_tile._tworker.post_task(self.my_tile._main_id, "got_console_print", self.data)
            self.my_tile.emit_console_message("consoleCodePrint", self.data)
        sys.stdout = sv_stdout
        return

    def overwrite(self, s):
        self.data["force_open"] = True
        if len(s) > MAX_SINGLE_WRITE:
            s = self.crop_output(s)
        self.data["message"] = s
        self.data["console_message"] = "consoleCodeOverwrite"
        self.my_tile.emit_console_message("consoleCodeOverwrite", self.data)


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
        self._last_globals = []
        self.execution_counter = 0
        self._base_stdout = sys.stdout
        return

    # Note that task_data must contain console_id
    def emit_console_message(self, console_message, task_data, force_open=True):
        ldata = copy.copy(task_data)
        ldata["console_message"] = console_message
        ldata["force_open"] = force_open
        ldata["main_id"] = self._main_id
        emit_direct("console-message", ldata, namespace="/main", room=self._main_id)

    def emit_export_viewer_message(self, export_viewer_message, task_data):
        ldata = copy.copy(task_data)
        ldata["export_viewer_message"] = export_viewer_message
        ldata["main_id"] = self._main_id
        emit_direct("export-viewer-message", ldata, namespace="/main", room=self._main_id)

    @_task_worthy
    def compile_save_dict(self, data):
        result = {"binary_attrs": [], "imports": []}
        is_lite = "lite_save" in data and data["lite_save"]
        if not is_lite:
            attrs = globals().keys()
            for attr in attrs:
                try:
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
                            debug_log("Found non jsonizable attribute " + attr)
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
                except Exception as ex:
                    error_string = self._handle_exception(ex, "Error compiling attr {}".format(attr),
                                                          print_to_console=False)
                    print(error_string)

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
                elif((type(attr_val) == dict) and (len(attr_val) > 0) and
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
        self._last_globals = self.get_user_globals()
        self._main_id = os.environ["PARENT"]  # this is for backward compatibility with some old project saves
        return None

    @_task_worthy
    def store_image(self, data):
        print("storing image")
        encoded_img = data["img"]
        self.img_dict[data["figure_name"]] = debinarize_python_object(encoded_img)
        return {"success": True}

    @_task_worthy
    def delete_image(self, data):
        del self.img_dict[data["figure_name"]]
        return {"success": True}

    def get_user_globals(self):
        attrs = globals().keys()
        user_globals = []
        for attr in attrs:
            try:
                if attr in self._saved_globals or attr == "Library" or attr == "Settings":
                    continue
                attr_val = globals()[attr]
                if isinstance(attr_val, types.ModuleType):
                    continue
                else:
                    user_globals.append([attr, type(attr_val).__name__])
            except Exception as ex:
                error_string = self._handle_exception(ex, "Error getting attr {}".format(attr),
                                                      print_to_console=False)
                print(error_string)
        return user_globals

    @_task_worthy
    def RebuildTileForms(self, data):
        self.tiles._other_tile_data = None
        return None

    @_task_worthy
    def _transfer_pipe_value(self, data):
        print("in _transfer_pipe_value in pseudo_tile_base")
        self._save_stdout()
        export_name = data["export_name"]
        if export_name in globals().keys():
            res = globals()[export_name]
        else:
            res = "__none__"
        encoded_val = make_python_object_jsonizable(res)
        self._restore_stdout()
        return {"encoded_val": encoded_val}

    def _eval_name(self, name):
        return eval(name, globals(), globals())

    def _get_export_info_thread(self, data):
        global executing_console_id
        self.emit_export_viewer_message("startMySpinner", data)
        try:
            ename = data["export_name"]
            self._pipe_dict = data["pipe_dict"]
            pipe_value = self.get_pipe_value(ename)
            result = self._get_type_info(pipe_value)
            result["success"] = True
        except Exception as Ex:
            result = {"success": False,
                      "info_string": self._handle_exception(Ex, "", print_to_console=False)}
        data.update(result)
        self.emit_export_viewer_message("got_export_info", data)
        executing_console_id = None
        self.post_event("check_exec_queue", {})
        return

    @_task_worthy
    def _get_export_info(self, data):
        global ethread
        global exec_queue
        global executing_console_id
        if ethread and not ethread.dead:
            exec_queue.append([self._get_export_info_thread, copy.deepcopy(data)])
        else:
            executing_console_id = "export_viewer"
            ethread = socketio.start_background_task(self._get_export_info_thread, data)
        return

    def _eval_thread(self, data):
        global executing_console_id
        self.emit_export_viewer_message("startMySpinner", data)
        self._pipe_dict = data["pipe_dict"]
        pipe_val = self.get_pipe_value(data["export_name"])
        success = True
        if isinstance(pipe_val, str) and pipe_val == "__none__":
            success = False
            the_html = "pipe not found"
        else:
            ev_string = "pipe_val"
            if "key" in data:
                ev_string += "['{}']".format(data["key"])
            ev_string += data["tail"]
            try:
                print("evaluating string " + ev_string)
                eval_result = eval(ev_string)
                eval_type_info = self._get_type_info(eval_result)
                use_html_table = False
                for c in self.html_table_classes:
                    if isinstance(eval_result, c):
                        use_html_table = True
                if use_html_table:
                    the_html = self.html_table(eval_result, title=eval_type_info["info_string"],
                                               header_style="font-size:12px",
                                               body_style="font-size:12px",
                                               max_rows=data["max_rows"])
                else:
                    max_chars = data["max_rows"] * ROUGH_CHARS_PER_EVAL_ROW
                    the_html = "<div class='export-header-text'>{}</div>".format(eval_type_info["info_string"])
                    the_html += str(eval_result)[:max_chars]
            except Exception as ex:
                succcess = False
                print("error in _evaluate_export in tile_base")
                the_html = self.get_traceback_message(ex)

        data.update({"success": success, "the_html": the_html})
        self.emit_export_viewer_message("display_result", data)
        executing_console_id = None
        self.post_event("check_exec_queue", {})
        return

    @_task_worthy
    def _evaluate_export(self, data):
        global ethread
        global exec_queue
        global executing_console_id
        if ethread and not ethread.dead:
            exec_queue.append([self._eval_thread, copy.deepcopy(data)])
        else:
            executing_console_id = "export_viewer"
            ethread = socketio.start_background_task(self._eval_thread, data)
        return

    # @_task_worthy
    # def _stop_evaluate_export(self, data):
    #     global eval_thread
    #     if executing_console_id:
    #         eval_thread.kill()
    #     self.emit_export_viewer_message("stop_eval", data)

    def _get_type_info(self, avar):
        result = {}
        if isinstance(avar, str) and avar == "__none__":
            result["type"] = "none"
            result["info_string"] = "Not set"
        elif type(avar) is dict:
            result["type"] = "dict"
            result["info_string"] = "Dict with {} keys".format(str(len(avar.keys())))
            keys_html = ""
            klist = list(avar.keys())
            klist.sort()
            result["key_list"] = klist
        elif isinstance(avar, DetachedTacticCollection):
            result["type"] = "DetachedTacticCollection"
            result["info_string"] = str(avar)
            klist = list(avar.document_names)
            klist.sort()
            result["key_list"] = klist
        elif type(avar) is list:
            result["type"] = "list"
            result["info_string"] = "List with {} elements".format(str(len(avar)))
        elif type(avar) is set:
            result["type"] = "set"
            result["info_string"] = "Set with {} elements".format(str(len(avar)))
        elif type(avar) is str:
            result["type"] = "string"
            result["info_string"] = "String with {} characters".format(str(len(avar)))
        else:
            findtype = re.findall("(?:type|class) \'(.*?)\'", str(type(avar)))
            if len(findtype) > 0:
                result["type"] = findtype[0]
            else:
                result["type"] = "no type"
            try:
                thel = len(avar)
                result["info_string"] = "{} of length {}".format(result["type"], thel)
            except:
                result["info_string"] = result["type"]
        return result

    def globals_have_changed(self, new_globals):
        ng_dict = {k: v for k, v in new_globals}
        og_dict = {k: v for k, v in self._last_globals}
        if not set(ng_dict.keys()) == set(og_dict.keys()):
            return True
        for g, t in ng_dict.items():
            if not og_dict[g] == t:
                return True
        return False

    def _restore_base_stdout(self):
        sys.stdout = self._base_stdout
        self._std_out_nesting = 0
        return

    def exec_thread(self, data):
        global executing_console_id
        self.emit_console_message("consoleCodeRun", data)
        try:
            if not Collection:
                self._tworker.create_pseudo_tile_collection_object(data)
            self._pipe_dict = data["pipe_dict"]
            redirected_output = ConsoleStringIO(self, data, self._base_stdout)
            sys.stdout = redirected_output
            the_code = data["the_code"]
            as_tree = ast.parse(the_code)
            if as_tree.body[-1].__class__.__name__ == "Expr":
                lnumber = as_tree.body[-1].lineno - 1
                code_lines = the_code.splitlines()
                code_to_eval = code_lines[lnumber]
                code_to_exec = "\n".join(code_lines[:lnumber])
                exec(code_to_exec, globals(), globals())
                eval_res = eval(code_to_eval, globals(), globals())
                if eval_res is not None:
                    print(eval_res)
            else:
                exec(data["the_code"], globals(), globals())

            self.execution_counter += 1
            data["execution_count"] = self.execution_counter
            data["message"] = "success"
        except Exception as ex:
            data["execution_count"] = "*"
            data["message"] = self._handle_exception(ex, None, print_to_console=False)
            print(data["message"])
        self._restore_base_stdout()
        self.emit_console_message("stopConsoleSpinner", data)
        current_globals = self.get_user_globals()
        self.check_globals()
        executing_console_id = None
        self.post_event("check_exec_queue", {})
        return

    @_task_worthy
    def check_exec_queue(self, data):
        global ethread
        global exec_queue
        global executing_console_id
        if len(exec_queue) > 0:
            thr, ndata = exec_queue.pop(0)
            executing_console_id = ndata["console_id"]
            ethread = socketio.start_background_task(thr, ndata)
        return

    def remove_from_queue(self, console_id):
        global exec_queue
        exec_queue = [entry for entry in exec_queue if not entry[1]["console_id"] == console_id]
        return

    def check_globals(self):
        current_globals = self.get_user_globals()
        if self.globals_have_changed(current_globals):
            self._last_globals = current_globals
            data = {"current_globals": current_globals, "globals_changed": True}
            self._tworker.post_task(self._main_id, "updated_globals", data)
        return

    @_task_worthy
    def stop_console_code(self, data):
        console_id = data["console_id"]
        global ethread
        global executing_console_id
        self.remove_from_queue(console_id)
        if console_id == "export_viewer":
            self.emit_export_viewer_message("stopMySpinner", data)
        if executing_console_id == console_id:
            executing_console_id = None
            self._restore_base_stdout()
            ethread.kill()
            self.post_event("check_exec_queue", {})
            self.check_globals()
        return

    @_task_worthy
    def stop_all_console_code(self, data):
        global ethread
        global executing_console_id
        global exec_queue
        self._restore_base_stdout()
        if ethread and not ethread.dead:
            ethread.kill()
        if executing_console_id is not None:
            data["console_id"] = executing_console_id
            executing_console_id = None
            if data["console_id"] == "export_viewer":
                self.emit_export_viewer_message("stopMySpinner", data)
            else:
                self.emit_console_message("stopConsoleSpinner", data)
        for thr, ndata in exec_queue:
            if ndata["console_id"] == "export_viewer":
                self.emit_export_viewer_message("stopMySpinner", data)
            else:
                self.emit_console_message("stopConsoleSpinner", ndata)
        exec_queue = []
        self.check_globals()
        return

    @_task_worthy
    def exec_console_code(self, data):
        global ethread
        global exec_queue
        global executing_console_id
        if ethread and not ethread.dead:
            exec_queue.append([self.exec_thread, copy.deepcopy(data)])
        else:
            executing_console_id = data["console_id"]
            ethread = socketio.start_background_task(self.exec_thread, data)
        return
