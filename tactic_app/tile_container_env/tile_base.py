import sys
import re
import time
from bson.binary import Binary
# noinspection PyUnresolvedReferences
from matplotlib_utilities import MplFigure, color_palette_names, ColorMapper
# from types import NoneType
import os
import traceback
import pickle
from pickle import UnpicklingError
from communication_utils import is_jsonizable, make_python_object_jsonizable, debinarize_python_object
from fuzzywuzzy import fuzz, process
# from volume_manager import VolumeManager
from redis_tools import redis_tm
from tile_o_plex import app
from flask import render_template
from data_access_mixin import DataAccessMixin
from filtering_mixin import FilteringMixin
from library_access_mixin import LibraryAccessMixin
from object_api_mixin import ObjectAPIMixin
from other_api_mixin import OtherAPIMIxin
from refreshing_mixin import RefreshingMixin
from exception_mixin import ExceptionMixin, generic_exception_handler
from document_object import ROWS_TO_PRINT, DetachedTacticCollection
import copy

RETRIES = 60

# noinspection PyUnresolvedReferences
from qworker import task_worthy_methods


def _task_worthy(m):
    task_worthy_methods[m.__name__] = "tilebase"
    return m


_jsonizable_types = {
    "str": str,
    "list": list,
    "tuple": tuple,
    "int": int,
    "float": float,
    "bool": bool,
    "dict": dict,
    "NoneType": type(None)
}


_code_names = {"classes": {},
               "functions": {}}

_tworker = None


def user_function(the_func):
    _code_names["functions"][the_func.__name__] = the_func
    return the_func


def user_class(the_class):
    _code_names["classes"][the_class.__name__] = the_class
    return the_class


# noinspection PyRedundantParentheses
def exec_user_code(the_code):
    try:
        exec(the_code)
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_dict(ex)
    return {"success": True,
            "classes": list(_code_names["classes"].keys()),
            "functions": list(_code_names["functions"].keys())}


def clear_and_exec_user_code(the_code):
    _code_names["classes"] = {}
    _code_names["functions"] = {}
    return exec_user_code(the_code)


class CollectionNotFound(Exception):
    pass


# noinspection PyMiss
# ingConstructor
# noinspection PyUnusedLocal
class TileBase(DataAccessMixin, FilteringMixin, LibraryAccessMixin, ObjectAPIMixin,
               OtherAPIMIxin, RefreshingMixin, ExceptionMixin):
    category = "basic"
    exports = []

    _reload_attrs = ["tile_name", "tile_type", "base_figure_url", "user_id", "doc_type",
                     "width", "height", "configured"]

    _selector_types = ["column_select", "tokenizer_select", "weight_function_select",
                       "cluster_metric", "tile_select", "document_select", "list_select", "collection_select",
                       "function_select", "class_select", "palette_select", "custom_list"]

    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        self._sleepperiod = .0001
        self.save_attrs = ["current_html", "tile_type", "tile_name", "doc_type", "configured",
                           "width", "height", "user_id", "base_figure_url",
                           "img_dict", "is_d3"]
        # These define the state of a tile and should be saved

        self.tile_type = self.__class__.__name__
        if tile_name is None:
            self.tile_name = self.tile_type
        else:
            self.tile_name = tile_name
        self.doc_type = None
        # self.vmanager = VolumeManager("/code/persist")
        self.width = ""
        self.height = ""
        self.full_tile_width = ""
        self.full_tile_height = ""
        self.img_dict = {}
        self.user_id = None
        self.is_shrunk = False
        self.configured = False
        self.is_d3 = False
        self.current_html = None
        self._old_stdout = None
        self._pipe_dict = None  # This is set when the form is created
        self.my_address = None
        self._main_id = os.environ["PARENT"]
        self._tworker = _tworker
        self._collection = None  # I have to create this later to impose a post loop when creating the pseudo_tile
        self._remote_tiles = None
        self.RETRIES = RETRIES  # This is here so that it can be easily accessible form the mixins
        self._std_out_nesting = 0
        self._last_exports = {}
        return

    # <editor-fold desc="_task_worthy methods (events)">
    @_task_worthy
    def RefreshTile(self, data):
        print("got RefreshTile")
        self._do_the_refresh()
        return None

    @_task_worthy
    def _get_property(self, data):
        data["val"] = getattr(self, data["property"])
        return data

    # noinspection PyAttributeOutsideInit
    @_task_worthy
    def TileSizeChange(self, data):
        self.width = data["width"]  # this might not be used for anything
        self.height = data["height"]  # this might not be used for anything
        # self.full_tile_width = data["full_tile_width"]
        # self.full_tile_height = data["full_tile_height"]
        # self.header_height = data["header_height"]
        # self.front_height = data["front_height"]
        # self.front_width = data["front_width"]
        # self.back_height = data["back_height"]
        # self.back_width = data["back_width"]
        # self.tile_log_height = data["tile_log_height"]
        # self.tile_log_width = data["tile_log_width"]
        # self.tda_height = data["tda_height"]
        # self.tda_width = data["tda_width"]
        # self._margin = data["margin"]
        if self.configured:
            if isinstance(self, MplFigure):
                self._resize_mpl_tile()
            else:
                self.handle_size_change()
        return None

    @_task_worthy
    def RefreshTileFromSave(self, data):
        print("in RefreshTileFromSave")
        self._refresh_from_save()
        return None

    @_task_worthy
    def SetSizeFromSave(self, data):
        self._set_tile_size(self.full_tile_width, self.full_tile_height)
        return None

    @_task_worthy
    def UpdateOptions(self, data):
        self.update_options(data)
        return None

    @_task_worthy
    def CellChange(self, data):
        self.handle_cell_change(data["column_header"], data["id"], data["old_content"],
                                data["new_content"], data["doc_name"])
        return None

    @_task_worthy
    def FreeformTextChange(self, data):
        self.handle_freeform_text_change(data["new_content"], data["doc_name"])
        return None

    @_task_worthy
    def TileButtonClick(self, data):
        try:
            self.handle_button_click(data["button_value"], data["doc_name"], data["active_row_id"])
        except Exception as ex:
            self._handle_exception(ex)
        return None

    @_task_worthy
    def TileMessage(self, data):
        try:
            self.handle_tile_message(data["event_name"], data["event_data"])
        except Exception as ex:
            self._handle_exception(ex)
        return None

    @_task_worthy
    def TileFormSubmit(self, data):
        try:
            self.handle_form_submit(data["form_data"], data["doc_name"], data["active_row_id"])
        except Exception as ex:
            self._handle_exception(ex)
        return None

    @_task_worthy
    def SelectChange(self, data):
        try:
            self.handle_select_change(data["select_value"], data["doc_name"],
                                      data["active_row_id"], data["select_name"])
        except Exception as ex:
            self._handle_exception(ex)
        return None

    @_task_worthy
    def TileTextAreaChange(self, data):
        self.handle_textarea_change(data["text_value"])
        return None

    @_task_worthy
    def TextSelect(self, data):
        self.handle_text_select(data["selected_text"])
        return None

    @_task_worthy
    def DocChange(self, data):
        self.handle_doc_change(data["doc_name"])
        return None

    @_task_worthy
    def PipeUpdate(self, data):
        self.handle_pipe_update(data["pipe_name"])
        return None

    @_task_worthy
    def TileWordClick(self, data):
        self.handle_tile_word_click(data["clicked_text"], data["doc_name"], data["active_row_id"])
        return None

    @_task_worthy
    def TileRowClick(self, data):
        self.handle_tile_row_click(data["clicked_row"], data["doc_name"], data["active_row_id"])
        return None

    @_task_worthy
    def TileSVGClick(self, data):
        self.handle_tile_svg_click(data["gid"], data["dataset"], data["doc_name"], data["active_row_id"])
        return None

    @_task_worthy
    def TileCellClick(self, data):
        self.handle_tile_cell_click(data["clicked_cell"], data["doc_name"], data["active_row_id"])
        return None

    @_task_worthy
    def TileElementClick(self, data):
        self.handle_tile_element_click(data["dataset"], data["doc_name"], data["active_row_id"])
        return None

    @_task_worthy
    def HideOptions(self, data):
        self._hide_options()
        return None

    @_task_worthy
    def StartSpinner(self, data):
        self.start_spinner()
        return None

    @_task_worthy
    def StopSpinner(self, data):
        self.stop_spinner()
        return None

    @_task_worthy
    def ShrinkTile(self, data):
        self.is_shrunk = True
        return None

    @_task_worthy
    def ExpandTile(self, data):
        self.is_shrunk = False
        return None

    @_task_worthy
    def LogTile(self, data):
        self.handle_log_tile()
        return None

    @_task_worthy
    def LogParams(self, data):
        parray = [["name", "value"]]
        for opt in self.options:
            parray.append([opt["name"], getattr(self, opt["name"])])
        summary = "Parameters for tile " + data["tile_name"]

        self.log_it(self.build_html_table_from_data_list(parray, title=self.tile_name, sidebyside=True),
                    summary=summary)
        return None

    @_task_worthy
    def RebuildTileForms(self, data):
        form_data = self._create_form_data(data)["form_data"]
        self._tworker.emit_tile_message("displayFormContent", {"form_data": form_data})
        return None

    @_task_worthy
    def _transfer_pipe_value(self, data):
        print("in _transfer_pipe_value")
        self._save_stdout()
        export_name = data["export_name"]
        if hasattr(self, export_name):
            res = getattr(self, export_name)
        else:
            res = "__none__"
        encoded_val = make_python_object_jsonizable(res)
        self._restore_stdout()
        return {"encoded_val": encoded_val}

    @_task_worthy
    def _create_form_data(self, data):
        self._pipe_dict = data["pipe_dict"]
        try:
            form_data = []
            for option in self.options:
                form_item = {}
                print("got option " + str(option))
                att_name = option["name"]
                form_item["name"] = att_name
                form_item["type"] = option["type"]
                if "tags" in option:
                    option_tags = option["tags"].split()
                else:
                    option_tags = []
                if not hasattr(self, att_name):
                    setattr(self, att_name, None)
                self.save_attrs.append(att_name)
                starting_value = getattr(self, att_name)
                form_item["starting_value"] = starting_value
                if option["type"] == "column_select":
                    form_item["option_list"] = data["current_header_list"]
                elif option["type"] == "tokenizer_select":  # for backward compatibility
                    form_item["option_list"] = self._get_sorted_match_list(["tokenizer"], data["function_names"])
                elif option["type"] == "weight_function_select":  # for backward compatibility
                    form_item["option_list"] = self._get_sorted_match_list(["weight_function"], data["function_names"])
                elif option["type"] == "cluster_metric":  # for backward comptibility
                    form_item["option_list"] = self._get_sorted_match_list(["cluster_metric"], data["function_names"])
                elif option["type"] == "pipe_select":
                    form_item["starting_value"] = self._find_best_pipe_match(starting_value, att_name, option_tags)
                    form_item["pipe_dict"] = {}
                    for tile_id, tile_entry in self._pipe_dict.items():
                        if tile_id == self._tworker.my_id:
                            continue
                        first_full_name = list(tile_entry)[0]
                        first_short_name = list(tile_entry.values())[0]["export_name"]
                        tile_name = re.sub("_" + first_short_name, "", first_full_name)
                        form_item["pipe_dict"][tile_name] = []

                        for full_export_name, edict in tile_entry.items():
                            if self._check_for_tag_match(option_tags, edict["export_tags"].split()):
                                form_item["pipe_dict"][tile_name].append([full_export_name, edict["export_name"]])

                elif option["type"] == "tile_select":
                    form_item["option_list"] = data["other_tile_names"]
                elif option["type"] == "document_select":
                    form_item["option_list"] = data["doc_names"]
                elif option["type"] == "list_select":
                    form_item["option_list"] = self._get_sorted_match_list(option_tags, data["list_names"])
                elif option["type"] == "collection_select":
                    form_item["option_list"] = self._get_sorted_match_list(option_tags, data["collection_names"])
                elif option["type"] == "function_select":
                    form_item["option_list"] = self._get_sorted_match_list(option_tags, data["function_names"])
                elif option["type"] == "class_select":
                    form_item["option_list"] = self._get_sorted_match_list(option_tags, data["class_names"])
                elif option["type"] == "palette_select":
                    form_item["option_list"] = color_palette_names
                elif option["type"] == "custom_list":
                    form_item["option_list"] = option["special_list"]
                elif option["type"] == "int":
                    if starting_value is None:
                        starting_value = 0
                    form_item["starting_value"] = str(starting_value)
                elif option["type"] == "float":
                    if starting_value is None:
                        starting_value = 0
                    form_item["starting_value"] = str(starting_value)
                if form_item["starting_value"] is None:
                    if option["type"] in self._selector_types and len(form_item["option_list"]) > 0:
                        form_item["starting_value"] = form_item["option_list"][0]
                    else:
                        form_item["starting_value"] = ""

                form_data.append(form_item)

            fixed_attrs = []
            for attr in self.save_attrs:  # legacy to deal with tiles that have self.save_attrs += exports
                if isinstance(attr, dict):
                    fixed_attrs.append(attr["name"])
                else:
                    fixed_attrs.append(attr)
            self.save_attrs = list(set(fixed_attrs))
            return {"form_data": form_data}
        except Exception as ex:
            special_string = ("error creating form for  " + self.__class__.__name__ + " tile: " + self._tworker.my_id)
            error_string = self.get_traceback_message(ex, special_string)
            self._tworker.debug_log(error_string)
            # self.display_message(error_string, True)
            return error_string

    @_task_worthy
    def _set_current_html(self, data):
        self.current_html = data["current_html"]
        return {"success": True}

    @_task_worthy
    def compile_save_dict(self, data):
        result = {"my_class_for_recreate": "TileBase",
                  "binary_attrs": []}
        for attr in self.save_attrs:
            if not hasattr(self, attr):
                result[attr] = None
                continue
            attr_val = getattr(self, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif ((type(attr_val) == dict) and (len(attr_val) > 0) and
                  hasattr(list(attr_val.values())[0], "compile_save_dict")):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
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

                except TypeError as ex:
                    print(self.extract_short_error_message(ex))
                    continue
        data = {"tile_type": self.tile_type, "user_id": self.user_id}
        result["tile_id"] = self._tworker.my_id
        tmi_string = "{}.tile_module_index".format(os.environ.get("USERNAME"))
        result["module_name"] = redis_tm.hget(tmi_string, self.tile_type)
        print("got module_name {}".format(result["module_name"]))
        print("done compiling attributes")
        return result
    # </editor-fold>

    # <editor-fold desc="Tile Internal Machinery">

    def post_event(self, event_name, task_data=None):
        self._tworker.post_task(self._tworker.my_id, event_name, task_data)
        return

    @property
    def _current_reload_attrs(self):
        result = {}
        for attr in self._reload_attrs:
            result[attr] = getattr(self, attr)
        return result

    def _get_tag_base(self, the_tag):
        if "/" not in the_tag:
            return the_tag
        else:
            base = re.findall(r"/(\w*)$", the_tag)[0]
            return base

    def _check_for_tag_match(self, option_tags, source_tags):
        full_source_tag_list = []
        for source_tag in source_tags:
            full_source_tag_list.append(source_tag)
            tbase = self._get_tag_base(source_tag)
            if tbase not in full_source_tag_list:
                full_source_tag_list.append(tbase)

        for opt_tag in option_tags:
            if opt_tag not in full_source_tag_list:
                return False
        return True

    def _get_sorted_match_list(self, option_tags, choice_dict):
        choice_list = []
        for choice, tags in choice_dict.items():
            if self._check_for_tag_match(option_tags, tags.split()):
                choice_list.append(choice)
        choice_list.sort()
        return choice_list

    def _create_select_list_html(self, choice_list, starting_value=None, att_name=None):
        if not choice_list:
            return ""
        if starting_value is None:
            new_start_value = process.extractOne(att_name, choice_list, scorer=fuzz.partial_ratio)[0]
        elif starting_value not in choice_list:
            new_start_value = process.extractOne(starting_value, choice_list, scorer=fuzz.partial_ratio)[0]
        else:
            new_start_value = starting_value
        new_html = ""
        for choice in choice_list:
            if choice == new_start_value:
                new_html += self._select_option_selected_template.format(choice)
            else:
                new_html += self._select_option_template.format(choice)
        return new_html

    def _find_best_pipe_match(self, starting_value, att_name, option_tags):
        best_match_item = None
        best_match_value = 0
        for tile_id, tile_entry in self._pipe_dict.items():
            if tile_id == self._tworker.my_id:
                continue
            if starting_value is None:
                att_to_match = att_name
            else:
                att_to_match = starting_value
            for full_export_name, edict in tile_entry.items():
                if self._check_for_tag_match(option_tags, edict["export_tags"].split()):
                    if full_export_name == starting_value:
                        return full_export_name
                    else:
                        new_val = fuzz.partial_ratio(att_to_match, full_export_name)
                        if best_match_item is None or new_val > best_match_value:
                            best_match_item = full_export_name
                            best_match_value = new_val
        return best_match_item

    # noinspection PyUnresolvedReferences
    def _resize_mpl_tile(self):
        self.draw_plot()
        new_html = self.create_figure_html(self._tworker.use_svg)
        self.refresh_tile_now(new_html)
        return

    @property
    def _current_options(self):
        result = {}
        for option in self.options:
            attr = option["name"]
            if hasattr(self, attr):
                result[attr] = getattr(self, attr)
        return result

    def distribute_event(self, event_name, data_dict):
        data_dict["event_name"] = event_name
        self._tworker.post_task(self._main_id, "distribute_events_stub", data_dict)

    def _get_main_property(self, prop_name):
        data_dict = {"property": prop_name}
        result = self._tworker.post_and_wait(self._main_id, "get_property", data_dict)
        return result["val"]

    def _hide_options(self):
        self._tworker.emit_tile_message("hideOptions")

    def exports_have_changed(self, new_exports):
        ne_dict = {exp["name"]: exp["type"] for exp in new_exports}
        oe_dict = {exp["name"]: exp["type"] for exp in self._last_exports}
        if not set(ne_dict.keys()) == set(oe_dict.keys()):
            return True
        for g, t in ne_dict.items():
            if not oe_dict[g] == t:
                return True
        return False

    def get_export_type_info(self):
        exports_with_type_info = []
        for exp in self.exports:
            new_exp = copy.deepcopy(exp)
            if hasattr(self, exp["name"]):
                new_exp["type"] = type(getattr(self, exp["name"])).__name__
            else:
                new_exp["type"] = "unknown"
            exports_with_type_info.append(new_exp)
        return exports_with_type_info

    def _do_the_refresh(self, new_html=None):
        try:
            if new_html is None:
                if not self.configured:
                    new_html = "Tile not configured"
                else:
                    new_html = self.render_content()
            self.current_html = new_html
            current_exports = self.get_export_type_info()
            if self.exports_have_changed(current_exports):
                self._last_exports = current_exports
                self._tworker.post_task(self._main_id, "update_pipe_dict_task",
                                        {"exports": current_exports,
                                         "tile_id": self._tworker.my_id,
                                         "tile_name": self.tile_name})
                message = {"html": new_html, "exports_changed": True}
            else:
                message = {"html": new_html, "exports_changed": False}
            self._tworker.emit_tile_message("displayTileContent", message)
        except Exception as ex:
            self._handle_exception(ex)
        return

    def recreate_from_save(self, save_dict):
        print("entering recreate from save in tile_base")
        if "binary_attrs" not in save_dict:
            save_dict["binary_attrs"] = []
        for(attr, attr_val) in save_dict.items():
            print("processing attribute {}".format(attr))
            if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(self, attr, cls.recreate_from_save(attr_val))
            elif((type(attr_val) == dict) and (len(attr_val) > 0) and
                 hasattr(list(attr_val.values())[0], "recreate_from_save")):
                cls = getattr(sys.modules[__name__], list(attr_val.values())[0]["my_class_for_recreate"])
                res = {}
                for(key, val) in attr_val.items():
                    res[key] = cls.recreate_from_save(val)
                setattr(self, attr, res)
            else:
                if isinstance(attr_val, Binary):  # seems like this is never true even for old-style saves
                    decoded_val = pickle.loads(str(attr_val.decode()))
                    setattr(self, attr, decoded_val)
                elif attr in save_dict["binary_attrs"]:
                    try:
                        decoded_val = debinarize_python_object(attr_val)
                    except Exception as ex:  # legacy if above fails try the old method
                        self._handle_exception(ex, "debinarizing failed for attr {}".format(attr),
                                               print_to_console=True)
                        if attr == "img_dict":
                            decoded_val = {}
                        else:
                            decoded_val = None
                    setattr(self, attr, decoded_val)
                else:
                    setattr(self, attr, attr_val)
        self._main_id = os.environ["PARENT"]  # this is for backward compatibility with some old project saves
        return None

    def _render_me(self, form_info):
        form_html = self._create_form_html(form_info)["form_html"]
        if self.is_shrunk:
            dsr_string = ""
            dbr_string = "display: none"
            bda_string = "display: none"
            main_height = self.header_height
        else:
            dsr_string = "display: none"
            dbr_string = ""
            bda_string = ""
            main_height = self.full_tile_height

        render_fields = {"tile_id": self._tworker.my_id,
                         "tile_name": self.tile_name,
                         "form_text": form_html,
                         "current_html": self.current_html,
                         "whole_width": self.full_tile_width,
                         "whole_height": main_height,
                         "front_height": self.front_height,
                         "front_width": self.front_width,
                         "back_height": self.back_height,
                         "back_width": self.back_width,
                         "tile_log_height":  self.tile_log_height,
                         "tile_log_width":  self.tile_log_width,
                         "tda_height": self.tda_height,
                         "tda_width": self.tda_width,
                         "is_strunk": self.is_shrunk,
                         "triangle_right_display_string": dsr_string,
                         "triangle_bottom_display_string": dbr_string,
                         "front_back_display_string": bda_string}

        with app.test_request_context():
            render_result = render_template("saved_tile.html", **render_fields)

        return {"success": True, "tile_html": render_result}

    def _handle_exception(self, ex, special_string=None, print_to_console=True):
        error_string = self.get_traceback_message(ex, special_string)
        self._tworker.debug_log(error_string)
        summary = "Exception of type {}".format(type(ex).__name__)
        tb = ex.__traceback__
        line_number = traceback.extract_tb(tb)[-1].lineno
        if print_to_console:
            self._tworker.send_error_entry(summary, error_string, line_number)
        return error_string

    def _refresh_from_save(self):
        self._tworker.emit_tile_message("displayTileContent", {"html": self.current_html})

    def _set_tile_size(self, owidth, oheight):
        self._tworker.emit_tile_message("setTileSize", {"width": owidth, "height": oheight})
    # </editor-fold>

    # <editor-fold desc="Default Handlers">

    def update_options(self, form_data):
        for opt in self.options:
            if opt["type"] == "int":
                setattr(self, opt["name"], int(form_data[opt["name"]]))
            elif opt["type"] == "float":
                setattr(self, opt["name"], float(form_data[opt["name"]]))
            elif opt["type"] == "boolean":
                v = form_data[opt["name"]]
                if isinstance(v, str):
                    if v.lower() == "true":
                        setattr(self, opt["name"], True)
                    else:
                        setattr(self, opt["name"], False)
                else:
                    setattr(self, opt["name"], v)
            else:
                setattr(self, opt["name"], form_data[opt["name"]])
        self.configured = True
        self._hide_options()
        self.spin_and_refresh()
        return

    @property
    def options(self):
        return [{}]

    def handle_size_change(self):
        return

    def handle_tile_message(self, event_name, data):
        return

    def handle_cell_change(self, column_header, row_index, old_content, new_content, doc_name):
        return

    def handle_freeform_text_change(self, new_content, doc_name):
        return

    def handle_text_select(self, selected_text):
        return

    def handle_doc_change(self, doc_name):
        return

    def handle_pipe_update(self, pipe_name):
        return

    def handle_button_click(self, value, doc_name, active_row_id):
        return

    def handle_form_submit(self, form_data, doc_name, active_row_id):
        return

    def handle_select_change(self, value, doc_name, active_row_id, select_name):
        return

    def handle_textarea_change(self, value):
        return

    def handle_tile_row_click(self, clicked_row, doc_name, active_row_id=None):
        return

    def handle_tile_svg_click(self, gid, dataset, doc_name, active_row_id=None):
        return

    def handle_tile_cell_click(self, clicked_text, doc_name, active_row_id=None):
        self.clear_table_highlighting()
        self.highlight_matching_text(clicked_text)
        return

    def handle_tile_element_click(self, dataset, doc_name, active_row_id=None):
        return

    def handle_log_tile(self):
        summary = "Log from tile " + self.tile_name
        self.log_it(self.current_html, summary=summary)
        return

    def handle_tile_word_click(self, clicked_word, doc_name, active_row_id=None):
        self.distribute_event("DehighlightTable", {})
        self.distribute_event("SearchTable", {"text_to_find": clicked_word})
        return

    def render_content(self):
        self._tworker.debug_log("render_content not implemented")
        return " "

    # </editor-fold>

    def _save_stdout(self):
        if self._std_out_nesting == 0:
            self._old_stdout = sys.stdout
            sys.stdout = sys.stderr
        self._std_out_nesting += 1
        return

    def _restore_stdout(self):
        if self._std_out_nesting == 1:
            sys.stdout = self._old_stdout
        self._std_out_nesting -= 1
        return

    # These two methods here, rather than in library_access_mixin
    # because its simpler having the execing machinery here.
    def get_user_function_with_metadata(self, function_name):
        self._save_stdout()
        raw_result = self._tworker.post_and_wait(self._main_id, "get_function_with_metadata",
                                                 {"function_name": function_name})

        result = debinarize_python_object(raw_result["function_data"])

        the_code = result["the_code"]
        _ = exec_user_code(the_code)
        result["the_function"] = _code_names["functions"][function_name]
        self._restore_stdout()
        return result

    def get_user_class(self, class_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_code_with_class", {"class_name": class_name})
        the_code = result["the_code"]
        _ = exec_user_code(the_code)
        self._restore_stdout()
        return _code_names["classes"][class_name]

    # tactic_todo This doesn't seem to be used
    def update_document(self, new_data, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "update_document",
                                             {"new_data": new_data, "document_name": document_name})
        self._restore_stdout()
        return
