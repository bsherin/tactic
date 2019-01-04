import sys
import re
import time
from bson.binary import Binary
# noinspection PyUnresolvedReferences
from matplotlib_utilities import MplFigure, color_palette_names, ColorMapper
# from types import NoneType
import traceback
import os
import pickle
from pickle import UnpicklingError
from communication_utils import is_jsonizable, make_python_object_jsonizable, debinarize_python_object
from fuzzywuzzy import fuzz, process

from document_object import TacticDocument


if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
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


def exec_user_code(the_code):
    try:
        exec(the_code)
    except:
        error_string = sys.exc_info()[0] + " " + str(sys.exc_info()[1])
        return {"success": False, "message_string": error_string}
    return {"success": True, "classes": list(_code_names["classes"].keys()), "functions": list(_code_names["functions"].keys())}


def clear_and_exec_user_code(the_code):
    _code_names["classes"] = {}
    _code_names["functions"] = {}
    return exec_user_code(the_code)


class CollectionNotFound(Exception):
    pass


# noinspection PyMiss
# ingConstructor
# noinspection PyUnusedLocal
class TileBase(object):
    category = "basic"
    exports = []
    _input_start_template = '<div class="form-group form-group-sm""><label>{0}</label>'
    _basic_input_template = ('<input type="{1}" class="form-control form-control-sm" id="{0}" value="{2}"></input>'
                             '</div>')
    _textarea_template = ('<textarea type="{1}" class="form-control form-control-sm" id="{0}" value="{2}">'
                          '{2}</textarea></div>')
    _codearea_template = ('<textarea type="{1}" class="form-control form-control-sm codearea" id="{0}" value="{2}">{2}'
                          '</textarea></div>')
    _select_base_template = '<select class="form-control form-control-sm" id="{0}">'
    _select_option_template = '<option value="{0}">{0}</option>'
    _select_option_val_template = '<option value="{0}">{1}</option>'
    _select_option_selected_template = '<option value="{0}" selected>{0}</option>'
    _select_option_val_selected_template = '<option value="{0}" selected>{1}</option>'
    _boolean_template = ('<div class="form-group form-check"><label class="form-check-label" style="font-weight: 700">'
                         '<input type="checkbox" class="form-check-input" id="{0}" value="{0}" {1}>{0}</label>'
                         '</div>')
    _reload_attrs = ["tile_name", "tile_type", "base_figure_url", "user_id", "doc_type",
                     "header_height", "front_height", "front_width", "back_height",
                     "back_width", "tda_width", "tda_height", "width", "height", "full_tile_width",
                     "tile_log_height", "tile_log_width",
                     "full_tile_height", "is_shrunk", "configured"]

    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        self._sleepperiod = .0001
        self.save_attrs = ["current_html", "tile_type", "tile_name", "doc_type", "configured",
                           "header_height", "front_height", "front_width", "back_height", "back_width",
                           "tile_log_height", "tile_log_width",
                           "tda_width", "tda_height", "width", "height", "user_id", "base_figure_url",
                           "full_tile_width", "full_tile_height", "is_shrunk", "img_dict", "is_d3"]
        # These define the state of a tile and should be saved

        self.tile_type = self.__class__.__name__
        if tile_name is None:
            self.tile_name = self.tile_type
        else:
            self.tile_name = tile_name
        self.doc_type = None

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
        return

    """
    Basic Machinery to make the tile work.
    """

    def post_event(self, event_name, task_data=None):
        self._tworker.post_task(self._tworker.my_id, event_name, task_data)
        return

    @property
    def _current_reload_attrs(self):
        result = {}
        for attr in self._reload_attrs:
            result[attr] = getattr(self, attr)
        return result

    @_task_worthy
    def RefreshTile(self, data):
        self._do_the_refresh()
        return None

    @_task_worthy
    def _get_property(self, data):
        data["val"] = getattr(self, data["property"])
        return data

    def get_function_names(self, tag=None):
        func_tag_dict = self._tworker.post_and_wait("host", "get_function_tags_dict",
                                                    {"user_id": self.user_id})["function_names"]
        if tag is None:
            fnames = list(func_tag_dict.keys())
        else:
            fnames = []
            for func_name, tags in func_tag_dict.items():
                if tag in tags.split():
                    fnames.append(func_name)
        return fnames

    def get_class_names(self, tag=None):
        class_tag_dict = self._tworker.post_and_wait("host", "get_class_tags_dict",
                                                     {"user_id": self.user_id})["class_names"]
        if tag is None:
            cnames = list(class_tag_dict.keys())
        else:
            cnames = []
            for class_name, tags in class_tag_dict.items():
                if tag in tags.split():
                    cnames.append(class_name)
        return cnames

    # noinspection PyAttributeOutsideInit
    @_task_worthy
    def TileSizeChange(self, data):
        self.width = data["width"]  # this might not be used for anything
        self.height = data["height"]  # this might not be used for anything
        self.full_tile_width = data["full_tile_width"]
        self.full_tile_height = data["full_tile_height"]
        self.header_height = data["header_height"]
        self.front_height = data["front_height"]
        self.front_width = data["front_width"]
        self.back_height = data["back_height"]
        self.back_width = data["back_width"]
        self.tile_log_height = data["tile_log_height"]
        self.tile_log_width = data["tile_log_width"]
        self.tda_height = data["tda_height"]
        self.tda_width = data["tda_width"]
        self._margin = data["margin"]
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
            self.handle_select_change(data["select_value"], data["doc_name"], data["active_row_id"])
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
        form_html = self._create_form_html(data)["form_html"]
        self._tworker.emit_tile_message("displayFormContent", {"html": form_html})
        return None

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

    # Info needed here: list_names, current_header_list, pipe_dict, doc_names
    @_task_worthy
    def _create_form_html(self, data):
        self._pipe_dict = data["pipe_dict"]
        try:
            form_html = ""
            for option in self.options:
                print("got option " + str(option))
                att_name = option["name"]
                if "tags" in option:
                    option_tags = option["tags"].split()
                else:
                    option_tags = []
                if not hasattr(self, att_name):
                    setattr(self, att_name, None)
                self.save_attrs.append(att_name)
                starting_value = getattr(self, att_name)
                if option["type"] == "column_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    header_list = data["current_header_list"]
                    form_html += self._create_select_list_html(header_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "tokenizer_select":  # for backward compatibility
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    fnames = self._get_sorted_match_list(["tokenizer"], data["function_names"])
                    form_html += self._create_select_list_html(fnames, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "weight_function_select":  # for backward compatibility
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    fnames = self._get_sorted_match_list(["weight_function"], data["function_names"])
                    form_html += self._create_select_list_html(fnames, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "cluster_metric":  # for backward comptibility
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    cmetricnames = self._get_sorted_match_list(["cluster_metric"], data["function_names"])
                    form_html += self._create_select_list_html(cmetricnames, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "pipe_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    best_pipe_match = self._find_best_pipe_match(starting_value, att_name, option_tags)
                    for tile_id, tile_entry in self._pipe_dict.items():
                        if tile_id == self._tworker.my_id:
                            continue
                        first_full_name = list(tile_entry)[0]
                        first_short_name = list(tile_entry.values())[0]["export_name"]
                        tile_name = re.sub("_" + first_short_name, "", first_full_name)
                        group_created = False
                        group_html = "<optgroup label={}>".format(tile_name)
                        group_len = 0
                        for full_export_name, edict in tile_entry.items():
                            if self._check_for_tag_match(option_tags, edict["export_tags"].split()):
                                group_len += 1
                                if full_export_name == best_pipe_match:
                                    group_html += self._select_option_val_selected_template.format(full_export_name,
                                                                                                   edict["export_name"])
                                else:
                                    group_html += self._select_option_val_template.format(full_export_name,
                                                                                          edict["export_name"])
                        if group_len > 0:
                            group_html += "</optgroup>"
                            form_html += group_html
                    form_html += '</select></div>'
                elif option["type"] == "tile_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    tile_name_list = data["other_tile_names"]
                    tile_name_list.sort()
                    form_html += self._create_select_list_html(tile_name_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "document_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    form_html += self._create_select_list_html(data["doc_names"], starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "list_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    choice_list = self._get_sorted_match_list(option_tags, data["list_names"])
                    form_html += self._create_select_list_html(choice_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "collection_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    choice_list = self._get_sorted_match_list(option_tags, data["collection_names"])
                    form_html += self._create_select_list_html(choice_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "function_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    choice_list = self._get_sorted_match_list(option_tags, data["function_names"])
                    form_html += self._create_select_list_html(choice_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "class_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    choice_list = self._get_sorted_match_list(option_tags, data["class_names"])
                    form_html += self._create_select_list_html(choice_list, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "palette_select":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    color_palette_names.sort()
                    form_html += self._create_select_list_html(color_palette_names, starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "custom_list":
                    the_template = self._input_start_template + self._select_base_template
                    form_html += the_template.format(att_name)
                    form_html += self._create_select_list_html(option["special_list"], starting_value, att_name)
                    form_html += '</select></div>'
                elif option["type"] == "textarea":
                    the_template = self._input_start_template + self._textarea_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "codearea":
                    the_template = self._input_start_template + self._codearea_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "text":
                    the_template = self._input_start_template + self._basic_input_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "int":
                    the_template = self._input_start_template + self._basic_input_template
                    form_html += the_template.format(att_name, option["type"], str(starting_value))
                elif option["type"] == "boolean":
                    the_template = self._boolean_template
                    if starting_value:
                        val = "checked"
                    else:
                        val = " '"
                    form_html += the_template.format(att_name, val)
                else:
                    print("Unknown option type specified")
            fixed_attrs = []
            for attr in self.save_attrs:  # legacy to deal with tiles that have self.save_attrs += exports
                if isinstance(attr, dict):
                    fixed_attrs.append(attr["name"])
                else:
                    fixed_attrs.append(attr)
            self.save_attrs = list(set(fixed_attrs))
            return {"form_html": form_html}
        except:
            error_string = ("error creating form for  " + self.__class__.__name__ + " tile: "
                            + self._tworker.my_id + " " +
                            str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]))
            self._tworker.debug_log("Got an error creating form " + error_string)
            # self.display_message(error_string, True)
            return error_string

    # noinspection PyUnresolvedReferences
    def _resize_mpl_tile(self):
        self.draw_plot()
        new_html = self.create_figure_html()
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

    def _do_the_refresh(self, new_html=None):
        try:
            if new_html is None:
                if not self.configured:
                    new_html = "Tile not configured"
                else:
                    new_html = self.render_content()
            self.current_html = new_html
            self._tworker.emit_tile_message("displayTileContent", {"html": new_html})
        except Exception as ex:
            self._handle_exception(ex)
        return

    def display_status(self, message):
        self._do_the_refresh(message)
        return

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
            elif((type(attr_val) == dict) and(len(attr_val) > 0) and
                 hasattr(list(attr_val.values())[0], "compile_save_dict")):
                res = {}
                for(key, val) in attr_val.items():
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

                except TypeError:
                    print("got a TypeError")
                    continue
        data = {"tile_type": self.tile_type, "user_id": self.user_id}
        result["tile_id"] = self._tworker.my_id
        result["module_name"] = self._tworker.post_and_wait("host", "get_module_from_tile_type", data)["module_name"]
        print("done compiling attributes")
        return result

    def recreate_from_save(self, save_dict):
        print("entering recreate from save in tile_base")
        if "binary_attrs" not in save_dict:
            save_dict["binary_attrs"] = []
        for(attr, attr_val) in save_dict.items():
            print("processing attribute {}".format(attr))
            if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(self, attr, cls.recreate_from_save(attr_val))
            elif((type(attr_val) == dict) and(len(attr_val) > 0) and
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
                        self._handle_exception(ex, "debinarizing failed for attr {}".format(attr), print_to_console=True)  # tactic_working
                        if attr == "img_dict":
                            decoded_val = {}
                        else:
                            decoded_val = None
                    setattr(self, attr, decoded_val)
                else:
                    setattr(self, attr, attr_val)
        self._main_id = os.environ["PARENT"]  # this is for backward compatibility with some old project saves
        return None

    def _get_type_info(self, avar):
        result = {}
        if avar == "__none__":
            result["type"] = "none"
            result["info_string"] = "Not set"
        elif type(avar) is dict:
            result["type"] = "dict"
            result["info_string"] = "Dict with {} keys".format(str(len(avar.keys())))
            keys_html = ""
            klist = list(avar.keys())
            klist.sort()
            for kname in klist:
                keys_html += "<option>{}</option>\n".format(kname)
            result["key_list"] = klist
            result["keys_html"] = keys_html
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

    @_task_worthy
    def _set_current_html(self, data):
        self.current_html = data["current_html"]
        return {"success": True}

    @_task_worthy
    def _get_export_info(self, data):
        try:
            ename = data["export_name"]
            self._pipe_dict = data["pipe_dict"]
            pipe_value = self.get_pipe_value(ename)
            result = self._get_type_info(pipe_value)
            result["success"] = True
        except Exception as Ex:
            result = {"success": False,
                      "info_string": self._handle_exception(Ex, "", print_to_console=False)}
        return result

    @_task_worthy
    def _evaluate_export(self, data):
        self._pipe_dict = data["pipe_dict"]
        pipe_val = self.get_pipe_value(data["export_name"])
        success = True
        if pipe_val == "__none__":
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
                if eval_type_info["type"] == "dict":
                    the_array = []
                    for key, the_val in eval_result.items():
                        the_array.append([key, the_val])
                    the_html = self._build_html_table_for_exports(the_array, title=eval_type_info["info_string"],
                                                                  has_header=False)
                elif eval_type_info["type"] == "list":
                    the_array = []
                    for i, the_val in enumerate(eval_result):
                        the_array.append([i, the_val])
                    the_html = self._build_html_table_for_exports(the_array, title=eval_type_info["info_string"],
                                                                  has_header=False)
                else:
                    the_html = "<h5>{}</h5>".format(eval_type_info["info_string"])
                    the_html += str(eval_result)
            except:
                succcess = False
                print("error in _evaluate_export in tile_base")
                the_html = sys.exc_info()[0] + " " + sys.exc_info()[1]
        return {"success": success, "the_html": the_html}

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
        result = self._tworker.post_and_wait("host",
                                             "request_render",
                                             {"template": "saved_tile.html", "render_fields": render_fields})
        return {"success": True, "tile_html": result["render_result"]}

    def _handle_exception(self, ex, special_string=None, print_to_console=True):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        error_string = "<pre>" + error_string + "</pre>"
        self._tworker.debug_log(error_string)
        summary = "Exception of type {}".format(type(ex).__name__)
        if print_to_console:
            self.log_it(error_string, force_open=True, is_error=True, summary=summary)
        return error_string

    def _refresh_from_save(self):
        self._tworker.emit_tile_message("displayTileContent", {"html": self.current_html})

    def _set_tile_size(self, owidth, oheight):
        self._tworker.emit_tile_message("setTileSize", {"width": owidth, "height": oheight})

    """
    Default Handlers

    """

    def update_options(self, form_data):
        for opt in self.options:
            if opt["type"] == "int":
                setattr(self, opt["name"], int(form_data[opt["name"]]))
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

    def handle_select_change(self, value, doc_name, active_row_id):
        return

    def handle_textarea_change(self, value):
        return

    def handle_tile_row_click(self, clicked_row, doc_name, active_row_id):
        return

    def handle_tile_cell_click(self, clicked_text, doc_name, active_row_id):
        self.clear_table_highlighting()
        self.highlight_matching_text(clicked_text)
        return

    def handle_tile_element_click(self, dataset, doc_name, active_row_id):
        return

    def handle_log_tile(self):
        summary = "Log from tile " + self.tile_name
        self.log_it(self.current_html, summary=summary)
        return

    def handle_tile_word_click(self, clicked_word, doc_name, active_row_id):
        self.distribute_event("DehighlightTable", {})
        self.distribute_event("SearchTable", {"text_to_find": clicked_word})
        return

    def render_content(self):
        self._tworker.debug_log("render_content not implemented")
        return " "

    """

    API

    """

    # Refreshing a tile

    def spin_and_refresh(self):

        self.post_event("StartSpinner")
        self.post_event("RefreshTile")
        self.post_event("StopSpinner")

    def start_spinner(self):
        self._tworker.emit_tile_message("startSpinner")

    def stop_spinner(self):
        self._tworker.emit_tile_message("stopSpinner")

    def refresh_tile_now(self, new_html=None):
        if new_html is None:
            self.post_event("RefreshTile")
        else:
            self.current_html = new_html
            self.post_event("RefreshTileFromSave")

    # Basic setting and access

    def _save_stdout(self):
        self._old_stdout = sys.stdout
        sys.stdout = sys.stderr
        return

    def _restore_stdout(self):
        sys.stdout = self._old_stdout

    def gdn(self):
        return self.get_document_names()

    def get_document_names(self):
        self._save_stdout()
        result = self._get_main_property("doc_names")
        self._restore_stdout()
        return result

    def gcdn(self):
        return self.get_current_document_name()

    def get_current_document_name(self):
        self._save_stdout()
        result = self._get_main_property("visible_doc_name")
        self._restore_stdout()
        return result

    def gdd(self, document_name):
        return self.get_document_data(document_name)

    def get_document(self, docname=None, grab_all_rows=True):
        protected_standout = sys.stdout  # Need to do it this way because other calls were writing over self._old_stdout
        sys.stdout = sys.stderr
        if docname is None:
            docname = self.get_current_document_name()
        result = TacticDocument(self, docname, grab_all_rows)
        sys.stdout = protected_standout
        return result

    def get_document_data(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_data", {"document_name": document_name})
        self._restore_stdout()
        return result

    def gdm(self, document_name):
        return self.get_document_metadata(document_name)

    def get_document_metadata(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_metadata", {"document_name": document_name})
        self._restore_stdout()
        return result

    def sdm(self, document_name, metadata):
        self.set_document_metadata(document_name, metadata)
        return

    def set_document_metadata(self, document_name, metadata):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "set_document_metadata", {"document_name": document_name,
                                                                         "metadata": metadata})
        self._restore_stdout()
        return

    def gddl(self, document_name):
        return self.get_document_data_as_list(document_name)

    def get_document_data_as_list(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_document_data_as_list",
                                             {"document_name": document_name})
        self._restore_stdout()
        return result["data_list"]

    def gcn(self, document_name):
        return self.get_column_names(document_name)

    def get_column_names(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_column_names", {"document_name": document_name})
        self._restore_stdout()
        return result["header_list"]

    def gnr(self, document_name):
        return self.get_number_rows(document_name)

    def get_number_rows(self, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_number_rows", {"document_name": document_name})
        self._restore_stdout()
        return result["number_rows"]

    def gr(self, document_name, row_id):
        return self.get_row(document_name, row_id)

    def get_row(self, document_name, row_id):
        self._save_stdout()
        data = {"document_name": document_name, "row_id": row_id}
        result = self._tworker.post_and_wait(self._main_id, "get_row", data)
        self._restore_stdout()
        return result

    def gl(self, document_name, line_number):
        return self.get_line(document_name, line_number)

    def get_line(self, document_name, line_number):
        data = {"document_name": document_name, "line_number": line_number}
        result = self._tworker.post_and_wait(self._main_id, "get_line", data)
        return result

    def gc(self, document_name, row_id, column_name):
        return self.get_cell(document_name, row_id, column_name)

    def get_cell(self, document_name, row_id, column_name):
        self._save_stdout()
        data = {"document_name": document_name, "row_id": row_id, "column_name": column_name}
        result = self._tworker.post_and_wait(self._main_id, "get_cell", data)
        self._restore_stdout()
        return result["the_cell"]

    def gcd(self, column_name, document_name=None):
        return self.get_column_data(column_name, document_name)

    def get_column_data(self, column_name, document_name=None):
        self._save_stdout()

        if document_name is not None:
            task_data = {"column_name": column_name, "doc_name": document_name}
            result = self._tworker.post_and_wait(self._main_id, "get_column_data_for_doc", task_data)
        else:
            task_data = {"column_name": column_name}
            result = self._tworker.post_and_wait(self._main_id, "get_column_data", task_data)

        self._restore_stdout()
        return result

    def gcdd(self, column_name):
        return self.get_column_data_dict(column_name)

    def get_column_data_dict(self, column_name):
        self._save_stdout()
        result = {}
        for doc_name in self.get_document_names():
            task_data = {"column_name": column_name, "doc_name": doc_name}
            result[doc_name] = self._tworker.post_and_wait(self._main_id, "get_column_data_for_doc", task_data)
        self._restore_stdout()
        return result

    def sc(self, document_name, row_id, column_name, text, cellchange=True):
        self.set_cell(document_name, row_id, column_name, text, cellchange)
        return

    def set_cell(self, document_name, row_id, column_name, text, cellchange=True):
        self._save_stdout()
        task_data = {
            "doc_name": document_name,
            "id": row_id,
            "column_header": column_name,
            "new_content": text,
            "cellchange": cellchange
        }
        self._tworker.post_task(self._main_id, "SetCellContent", task_data)
        self._restore_stdout()
        return

    def scb(self, document_name, row_id, column_name, color):
        self.set_cell_background(document_name, row_id, column_name, color)
        return

    def set_cell_background(self, document_name, row_id, column_name, color):
        self._save_stdout()
        task_data = {"doc_name": document_name,
                     "row_id": row_id,
                     "column_name": column_name,
                     "color": color}
        self._tworker.post_task(self._main_id, "SetCellBackground", task_data)
        self._restore_stdout()
        return

    def stm(self, tile_name, event_name, data=None):
        self.send_tile_message(tile_name, event_name, data)
        return

    def send_tile_message(self, tile_name, event_name, data=None):
        self._save_stdout()
        task_data = {"tile_name": tile_name,
                     "event_name": event_name,
                     "event_data": data}
        self._tworker.post_task(self._main_id, "SendTileMessage", task_data)
        self._restore_stdout()
        return

    def scd(self, document_name, column_name, data_list_or_dict, cellchange=False):
        self.set_column_data(document_name, column_name, data_list_or_dict, cellchange)
        return

    def set_column_data(self, document_name, column_name, data_list_or_dict, cellchange=False):
        self._save_stdout()
        task_data = {
            "doc_name": document_name,
            "column_header": column_name,
            "new_content": data_list_or_dict,
            "cellchange": cellchange
        }
        self._tworker.post_task(self._main_id, "SetColumnData", task_data)
        self._restore_stdout()
        return

    # Filtering and iteration

    def gmr(self, filter_function, document_name=None):
        return self.get_matching_rows(filter_function, document_name)

    def get_matching_rows(self, filter_function, document_name=None):
        self._save_stdout()
        result = []
        if document_name is not None:
            data_list = self.get_document_data_as_list(document_name)
            for r in data_list:
                if filter_function(r):
                    result.append(r)
        else:
            for docname in self.get_document_names():
                data_list = self.get_document_data_as_list(docname)
                for r in data_list:
                    if filter_function(r):
                        result.append(r)
        self._restore_stdout()
        return result

    def update_document(self, new_data, document_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "update_document",
                                             {"new_data": new_data, "document_name": document_name})
        self._restore_stdout()
        return

    def dmr(self, filter_function, document_name=None):
        self.display_matching_rows(filter_function, document_name)
        return

    def display_matching_rows(self, filter_function, document_name=None):
        self._save_stdout()
        if self.doc_type == "table":
            if document_name is not None:
                result = []
                data_list = self.get_document_data_as_list(document_name)
                for r in data_list:
                    if filter_function(r):
                        result.append(r["__id__"])
            else:
                result = {}
                for docname in self.get_document_names():
                    result[docname] = []
                    data_list = self.get_document_data_as_list(docname)
                    for r in data_list:
                        if filter_function(r):
                            result[docname].append(r["__id__"])
        else:
            if document_name is not None:
                result = []
                data_list = self.get_document_data_as_list(document_name)
                for rnum, rtxt in enumerate(data_list):
                    if filter_function(rtxt):
                        result.append(rnum)
            else:
                result = {}
                for docname in self.get_document_names():
                    result[docname] = []
                    data_list = self.get_document_data_as_list(docname)
                    for rnum, rtxt in enumerate(data_list):
                        if filter_function(rtxt):
                            result[docname].append(rnum)
        self._tworker.post_task(self._main_id, "display_matching_rows",
                                {"result": result, "document_name": document_name})
        self._restore_stdout()
        return

    def cth(self):
        self.clear_table_highlighting()
        return

    def clear_table_highlighting(self):
        self._save_stdout()
        self.distribute_event("DehighlightTable", {})
        self._restore_stdout()
        return

    def hmt(self, txt):
        self.highlight_matching_text(txt)
        return

    def highlight_matching_text(self, txt):
        self._save_stdout()
        self.distribute_event("SearchTable", {"text_to_find": txt})
        self._restore_stdout()
        return

    def dar(self):
        self.display_all_rows()
        return

    def display_all_rows(self):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "UnfilterTable")
        self._restore_stdout()
        return

    def atr(self, func, document_name=None, cellchange=False):
        self.apply_to_rows(func, document_name, cellchange)
        return

    def apply_to_rows(self, func, document_name=None, cellchange=False):
        self._save_stdout()
        if document_name is not None:
            doc_dict = self.get_document_data(document_name)
            new_doc_dict = {}
            for the_id, r in doc_dict.items():
                new_doc_dict[the_id] = func(r)
            self.set_document(document_name, new_doc_dict, cellchange)
            self._restore_stdout()
            return None
        else:
            for doc_name in self.get_document_names():
                self.apply_to_rows(func, doc_name, cellchange)
            self._restore_stdout()
            return None

    def sd(self, document_name, new_data, cellchange=False):
        self.set_document(document_name, new_data, cellchange)

    def set_document(self, document_name, new_data, cellchange=False):
        self._save_stdout()
        task_data = {"new_data": new_data,
                     "doc_name": document_name,
                     "cellchange": cellchange}
        self._tworker.post_and_wait(self._main_id, "SetDocument", task_data)
        self._restore_stdout()
        return

    # Other

    def gtd(self, doc_name):
        self.go_to_document(doc_name)
        return

    def go_to_document(self, doc_name):
        self._save_stdout()
        data = {"doc_name": doc_name}
        self._tworker.ask_host('go_to_row_in_document', data)
        self._restore_stdout()
        return

    def gtrid(self, doc_name, row_id):
        self.go_to_row_in_document(doc_name, row_id)
        return

    def go_to_row_in_document(self, doc_name, row_id):
        self._save_stdout()
        data = {"doc_name": doc_name,
                "row_id": row_id}
        self._tworker.ask_host('go_to_row_in_document', data)
        self._restore_stdout()
        return

    def gst(self):
        return self.get_selected_text()

    def get_selected_text(self):
        self._save_stdout()
        result = self._get_main_property("selected_text")
        self._restore_stdout()
        return result

    def display_message(self, message_string, force_open=True, is_error=False, summary=None):
        self.log_it(message_string, force_open, is_error, summary)
        return

    def dm(self, message_string, force_open=True, is_error=False, summary=None):
        self.log_it(message_string, force_open, is_error, summary)
        return

    def log_it(self, message_string, force_open=True, is_error=False, summary=None):
        self._save_stdout()
        self._tworker.post_task(self._main_id, "print_to_console_event", {"print_string": message_string,
                                                                          "force_open": force_open,
                                                                          "is_error": is_error,
                                                                          "summary": summary})
        self._restore_stdout()
        return

    def get_container_log(self):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_container_log", {"container_id": self._tworker.my_id})
        self._restore_stdout()
        return result["log_text"]

    def cct(self, doc_name, row_id, column_name, tokenized_text, color_dict):
        self.color_cell_text(doc_name, row_id, column_name, tokenized_text, color_dict)
        return

    def color_cell_text(self, doc_name, row_id, column_name, tokenized_text, color_dict):
        self._save_stdout()
        data_dict = {"doc_name": doc_name,
                     "row_id": row_id,
                     "column_header": column_name,
                     "token_text": tokenized_text,
                     "color_dict": color_dict}
        self._tworker.post_task(self._main_id, "ColorTextInCell", data_dict)
        self._restore_stdout()
        return

    def gulist(self, the_list):
        return self.get_user_list(the_list)

    def get_user_list(self, the_list):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_list", {"user_id": self.user_id, "list_name": the_list})
        self._restore_stdout()
        return result["the_list"]

    def gufunction(self, function_name):
        return self.get_user_function(function_name)

    def get_user_function(self, function_name):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_code_with_function", {"user_id": self.user_id,
                                                                                "function_name": function_name})
        the_code = result["the_code"]
        result = exec_user_code(the_code)
        self._restore_stdout()
        return _code_names["functions"][function_name]

    def guclass(self, class_name):
        return self.get_user_class(class_name)

    def get_user_class(self, class_name):
        self._save_stdout()
        result = self._tworker.post_and_wait("host", "get_code_with_class", {"user_id": self.user_id,
                                                                             "class_name": class_name})
        the_code = result["the_code"]
        result = exec_user_code(the_code)
        self._restore_stdout()
        return _code_names["classes"][class_name]

    def gucol(self, collection_name):
        return self.get_user_collection(collection_name)

    def get_user_collection(self, collection_name):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_user_collection",
                                             {"user_id": self.user_id, "collection_name": collection_name})
        self._restore_stdout()
        if not result["success"]:
            raise CollectionNotFound("Couldn't find collection with name {}".format(collection_name))
        return result["the_collection"]

    def get_collection_names(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_collection_names",
                                             {"user_id": self.user_id})
        self._restore_stdout()
        return result["collection_names"]

    def get_list_names(self):
        self._save_stdout()
        result = self._tworker.post_and_wait(self._main_id, "get_list_names",
                                             {"user_id": self.user_id})
        self._restore_stdout()
        return result["list_names"]

    # deprecated
    def get_tokenizer(self, tokenizer_name):
        self._save_stdout()
        result = self.get_user_function(tokenizer_name)
        self._restore_stdout()
        return result

    # deprecated
    def get_cluster_metric(self, metric_name):
        self._save_stdout()
        result = self.get_user_function(metric_name)
        self._restore_stdout()
        return result

    def get_pipe_value(self, pipe_key):
        self._save_stdout()
        for(tile_id, tile_entry) in self._pipe_dict.items():
            if pipe_key in tile_entry:
                result = self._tworker.post_and_wait_for_pipe(tile_entry[pipe_key]["tile_id"],
                                                              "_transfer_pipe_value",
                                                              {"export_name": tile_entry[pipe_key]["export_name"],
                                                               "requester_address": self.my_address},
                                                              timeout=60,
                                                              tries=RETRIES)
                encoded_val = result["encoded_val"]
                val = debinarize_python_object(encoded_val)
                self._restore_stdout()
                return val
        self._restore_stdout()
        return None

    @_task_worthy
    def _transfer_pipe_value(self, data):
        self._save_stdout()
        export_name = data["export_name"]
        if hasattr(self, export_name):
            res = getattr(self, export_name)
        else:
            res = "__none__"
        encoded_val = make_python_object_jsonizable(res)
        self._restore_stdout()
        return {"encoded_val": encoded_val}

    def get_weight_function(self, weight_function_name):
        self._save_stdout()
        result = self.get_user_function(weight_function_name)
        self._restore_stdout()
        return result

    def cc(self, name, doc_dict, doc_type="table", doc_metadata=None):
        self.create_collection(name, doc_dict, doc_type, doc_metadata)
        return

    def create_collection(self, name, doc_dict, doc_type="table", doc_metadata=None):
        self._save_stdout()
        data = {"name": name,
                "doc_dict": doc_dict,
                "doc_type": doc_type}
        if doc_metadata is not None:
            data["doc_metadata"] = doc_metadata
        else:
            data["doc_metadata"] = {}
        result = self._tworker.post_and_wait(self._main_id, "create_collection", data)
        self._restore_stdout()
        if not result["success"]:
            raise Exception(result["message_string"])
        return result["message_string"]

    """

    Odd utility methods

    """

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def bht(self, data_list, title=None, click_type="word-clickable",
            sortable=True, sidebyside=False, has_header=True):
        return self.build_html_table_from_data_list(data_list, title, click_type,
                                                    sortable, sidebyside, has_header)

    def build_html_table_from_data_list(self, data_list, title=None, click_type="word-clickable",
                                        sortable=True, sidebyside=False, has_header=True):
        self._save_stdout()
        if sortable:
            if not sidebyside:
                the_html = u"<table class='tile-table table table-striped table-bordered table-sm sortable'>"
            else:
                the_html = u"<table class='tile-table sidebyside-table table-striped table-bordered table-sm sortable'>"
        else:
            if not sidebyside:
                the_html = u"<table class='tile-table table table-striped table-bordered table-sm'>"
            else:
                the_html = u"<table class='tile-table sidebyside-table table-striped table-bordered table-sm'>"

        if title is not None:
            the_html += u"<caption>{0}</caption>".format(title)
        if has_header:
            the_html += u"<thead><tr>"
            for c in data_list[0]:
                the_html += u"<th>{0}</th>".format(c)
            the_html += u"</tr></thead>"
            start_from = 1
        else:
            start_from = 0
        the_html += u"<tbody>"

        for rnum, r in enumerate(data_list[start_from:]):
            if click_type == u"row-clickable":
                the_html += u"<tr class='row-clickable'>"
                for c in r:
                    the_html += u"<td>{0}</td>".format(c)
                the_html += u"</tr>"
            elif click_type == u"word-clickable":
                the_html += u"<tr>"
                for c in r:
                    the_html += u"<td class='word-clickable'>{0}</td>".format(c)
                the_html += u"</tr>"
            else:
                the_html += u"<tr>"
                for cnum, c in enumerate(r):
                    the_html += "<td class='element-clickable' data-row='{1}' " \
                                "data-col='{2}' data-val='{0}'>{0}</td>".format(c, str(rnum), str(cnum))
                the_html += "</tr>"
        the_html += "</tbody></table>"
        self._restore_stdout()
        return the_html

    def _build_html_table_for_exports(self, data_list, has_header=False, title=None):
        the_html = u"<table class='tile-table table sortable table-striped table-bordered table-sm'>"
        if title is not None:
            the_html += u"<caption>{0}</caption>".format(title)
        if has_header:
            the_html += u"<thead><tr>"
            for c in data_list[0]:
                the_html += u"<th>{0}</th>".format(c)
            the_html += u"</tr><tbody>"
            start = 1
        else:
            start = 0
        for r in data_list[start:]:
            the_html += "<tr>".format()
            for c in r:
                the_html += "<td>{0}</td>".format(str(c))
            the_html += "</tr>"

        the_html += "</tbody></table>"
        return the_html
