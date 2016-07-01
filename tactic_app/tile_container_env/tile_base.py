import cPickle
import exceptions
import json
import sys
import time
import requests
import gevent
from gevent import monkey; monkey.patch_all()
import numpy as np
from bson.binary import Binary
from flask import url_for, render_template
from gevent.queue import Queue
from qworker import QWorker, task_worthy

from tokenizers import tokenizer_dict
from weight_function_module import weight_functions
from cluster_metrics import cluster_metric_dict
from matplotlib_utilities import MplFigure, Mpld3Figure, color_palette_names
from types import NoneType
import traceback

jsonizable_types = {
    "str": str,
    "list": list,
    "tuple": tuple,
    "unicode": unicode,
    "int": int,
    "float": float,
    "long": long,
    "bool": bool,
    "dict": dict,
    "NoneType": NoneType
}


class TileBase(QWorker):
    category = "basic"
    exports = []
    input_start_template = '<div class="form-group form-group-sm"">' \
                           '<label>{0}</label>'
    basic_input_template = '<input type="{1}" class="form-control input-sm" id="{0}" value="{2}"></input>' \
                           '</div>'
    textarea_template = '<textarea type="{1}" class="form-control input-sm" id="{0}" value="{2}">{2}</textarea>' \
                        '</div>'
    codearea_template = '<textarea type="{1}" class="form-control input-sm codearea" id="{0}" value="{2}">{2}' \
                        '</textarea></div>'
    select_base_template = '<select class="form-control input-sm" id="{0}">'
    select_option_template = '<option value="{0}">{0}</option>'
    select_option_selected_template = '<option value="{0}" selected>{0}</option>'
    boolean_template = '<div class="checkbox"><label style="font-weight: 700">'\
                       '<input type="checkbox" id="{0}" value="{0}" {1}>{0}</label>' \
                       '</div>'
    reload_attrs = ["tile_name", "tile_type", "base_figure_url", "user_id",
                    "my_id", "header_height", "front_height", "front_width", "back_height",
                    "back_width", "tda_width", "tda_height", "width", "height", "full_tile_width",
                    "full_tile_height", "is_shrunk", "configured"
                    ]

    def __init__(self, main_id, tile_id, tile_name=None):
        # from tile_main import app, megaplex_address
        # QWorker.__init__(self, app, megaplex_address, tile_id)
        self._sleepperiod = .0001
        self.save_attrs = ["current_html", "tile_type", "tile_name", "main_id", "configured",
                           "header_height", "front_height", "front_width", "back_height", "back_width",
                           "tda_width", "tda_height", "width", "height", "user_id", "base_figure_url",
                           "full_tile_width", "full_tile_height", "is_shrunk", "img_dict", "current_fig_id"]
        # These define the state of a tile and should be saved

        self.tile_id = tile_id
        self.tile_type = self.__class__.__name__
        if tile_name is None:
            self.tile_name = self.tile_type
        else:
            self.tile_name = tile_name

        self.current_html = None

        # These will differ each time the tile is instantiated.
        self.main_id = main_id
        self.figure_id = 0
        self.width = ""
        self.height = ""
        self.full_tile_width = ""
        self.full_tile_height = ""
        self.img_dict = {}
        self.user_id = None
        self.data_dict = {}
        self.current_fig_id = 0
        self.current_data_id = 0
        self.current_unique_id_index = 0
        self.is_shrunk = False
        # tactic_todo base_data_url keep or get rid of? Seems like this is used for d3plots maybe old ones only?
        # self.base_data_url = url_for("data_source", main_id=main_id, tile_id=tile_id, data_name="X")[:-1]
        self.base_data_url = ""
        self.configured = False
        self.list_names = []
        self._pipe_dict = None # This is set when the form is created
        return

    """
    Basic Machinery to make the tile work.
    """

    def init_qworker(self, app, megaplex_address):
        QWorker.__init__(self, app, megaplex_address, self.tile_id)
        return

    def post_event(self, event_name):
        self.post_task(self.my_id, event_name)
        return

    @property
    def current_reload_attrs(self):
        result = {}
        for attr in self.reload_attrs:
            result[attr] = getattr(self, attr)
        return result

    def debug_log(self, msg):
        with self.app.test_request_context():
            self.app.logger.debug(msg)

    @task_worthy
    def RefreshTile(self, data):
        self.do_the_refresh()
        return None

    @task_worthy
    def get_property(self, data):
        data["val"] = getattr(self, data["property"])
        return data

    @task_worthy
    def TileSizeChange(self, data):
        self.width = data["width"]
        self.height = data["height"]
        self.full_tile_width = data["full_tile_width"]
        self.full_tile_height = data["full_tile_height"]
        self.header_height = data["header_height"]
        self.front_height = data["front_height"]
        self.front_width = data["front_width"]
        self.back_height = data["back_height"]
        self.back_width = data["back_width"]
        self.tda_height = data["tda_height"]
        self.tda_width = data["tda_width"]
        self.margin = data["margin"]
        if self.configured:
            if isinstance(self, MplFigure) or isinstance(self, Mpld3Figure):
                self.resize_mpl_tile()
            else:
                self.handle_size_change()
        return None

    @task_worthy
    def RefreshTileFromSave(self, data):
        self.refresh_from_save()
        return None

    @task_worthy
    def SetSizeFromSave(self, data):
        self.set_tile_size(self.full_tile_width, self.full_tile_height)
        return None

    @task_worthy
    def UpdateOptions(self, data):
        self.update_options(data)
        return None

    @task_worthy
    def CellChange(self, data):
        self.handle_cell_change(data["column_header"], data["id"], data["old_content"],
                                data["new_content"], data["doc_name"])
        return None

    @task_worthy
    def TileButtonClick(self, data):
        try:
            self.handle_button_click(data["button_value"], data["doc_name"], data["active_row_index"])
        except Exception as ex:
            self.handle_exception(ex)
        return None

    @task_worthy
    def TileTextAreaChange(self, data):
        self.handle_textarea_change(data["text_value"])
        return None

    @task_worthy
    def TextSelect(self, data):
        self.handle_text_select(data["selected_text"], data["doc_name"], data["active_row_index"])
        return None

    @task_worthy
    def PipeUpdate(self, data):
        self.handle_pipe_update(data["pipe_name"])
        return None

    @task_worthy
    def TileWordClick(self, data):
        self.handle_tile_word_click(data["clicked_text"], data["doc_name"], data["active_row_index"])
        return None

    @task_worthy
    def TileRowClick(self, data):
        self.handle_tile_row_click(data["clicked_row"], data["doc_name"], data["active_row_index"])
        return None

    @task_worthy
    def TileCellClick(self, data):
        self.handle_tile_cell_click(data["clicked_cell"], data["doc_name"], data["active_row_index"])
        return None

    @task_worthy
    def TileElementClick(self, data):
        self.handle_tile_element_click(data["dataset"], data["doc_name"], data["active_row_index"])
        return None

    @task_worthy
    def HideOptions(self, data):
        self.hide_options()
        return None

    @task_worthy
    def StartSpinner(self, data):
        self.start_spinner()
        return None

    @task_worthy
    def StopSpinner(self, data):
        self.stop_spinner()
        return None

    @task_worthy
    def ShrinkTile(self, data):
        self.is_shrunk = True
        return None

    @task_worthy
    def ExpandTile(self, data):
        self.is_shrunk = False
        return None

    @task_worthy
    def LogTile(self, data):
        self.handle_log_tile()
        return None

    @task_worthy
    def LogParams(self, data):
        parray = [["name", "value"]]
        for opt in self.options:
            parray.append([opt["name"], getattr(self, opt["name"])])

        self.log_it(self.build_html_table_from_data_list(parray, title=self.tile_name,
                                                         sidebyside=True))

    @task_worthy
    def RebuildTileForms(self, data):
        form_html = self.create_form_html(data)["form_html"]
        self.emit_tile_message("displayFormContent", {"html": form_html})
        return None

    # Info needed here: list_names, current_header_list, pipe_dict, doc_names
    @task_worthy
    def create_form_html(self, data):
        self.debug_log("entering create_form_html")
        self._pipe_dict = data["pipe_dict"]
        try:
            form_html = ""
            for option in self.options:
                att_name = option["name"]
                if not hasattr(self, att_name):
                    setattr(self, att_name, None)
                self.save_attrs.append(att_name)
                starting_value = getattr(self, att_name)
                self.debug_log("option is " + str(option["name"]) + " " + str(option["type"]))
                if option["type"] == "column_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    header_list = data["current_header_list"]
                    for choice in header_list:
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "tokenizer_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in tokenizer_dict.keys():
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'

                elif option["type"] == "weight_function_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in weight_functions.keys():
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "pipe_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in self.get_current_pipe_list():
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "document_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in data["doc_names"]:
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "list_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in data["list_names"]:
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "palette_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in color_palette_names:
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "custom_list":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in option["special_list"]:
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "cluster_metric":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in cluster_metric_dict.keys():
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "textarea":
                    the_template = self.input_start_template + self.textarea_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "codearea":
                    the_template = self.input_start_template + self.codearea_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "text":
                    the_template = self.input_start_template + self.basic_input_template
                    form_html += the_template.format(att_name, option["type"], starting_value)
                elif option["type"] == "int":
                    the_template = self.input_start_template + self.basic_input_template
                    form_html += the_template.format(att_name, option["type"], str(starting_value))
                elif option["type"] == "boolean":
                    the_template = self.boolean_template
                    if starting_value:
                        val = "checked"
                    else:
                        val = " '"
                    form_html += the_template.format(att_name, val)
                else:
                    print "Unknown option type specified"
            self.save_attrs = list(set(self.save_attrs))
            return {"form_html": form_html}
        except:
            error_string = ("error creating form for  " + self.__class__.__name__ + " tile: " + self.my_id + " " +
                            str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]))
            self.debug_log("Got an error creating form " + error_string)
            # self.display_message(error_string, True)
            return error_string

    def resize_mpl_tile(self):
        self.draw_plot()
        new_html = self.create_figure_html()
        self.refresh_tile_now(new_html)
        return

    @property
    def current_options(self):
        result = {}
        for option in self.options:
            attr = option["name"]
            if hasattr(self, attr):
                result[attr] = getattr(self, attr)
        return result

    def send_request_to_container(self, taddress, msg_type, data_dict, wait_for_success=True,
                                  timeout=3, tries=30, wait_time=.1):
        self.debug_log("Entering send request {0} to {1}".format(msg_type, taddress))
        if wait_for_success:
            for attempt in range(tries):
                try:
                    self.debug_log("Trying request {0} to {1}".format(msg_type, taddress))
                    res = requests.post("http://{0}:5000/{1}".format(taddress, msg_type),
                                        timeout=timeout, json=data_dict)
                    # self.debug_log("container returned: " + res.text)
                    return res
                except:
                    error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                    self.debug_log("Got error on reqiest: " + error_string)
                    time.sleep(wait_time)
                    continue
            self.debug_log("Request {0} to {1} timed out".format(msg_type, taddress))
        else:
            return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)

    def send_request_to_host(self, msg_type, data_dict=None, wait_for_success=True,
                             timeout=3, tries=30, wait_time=.1):
        if data_dict is None:
            data_dict = {}
        data_dict["main_id"] = self.main_id
        self.debug_log("sending request to host: " + msg_type)
        if wait_for_success:
            for attempt in range(tries):
                try:
                    result = requests.get("http://{0}:5000/{1}".format(self.host_address, msg_type),
                                          timeout=timeout, json=data_dict)
                    return result.json()
                except:
                    time.sleep(wait_time)
                    continue
        else:
            result = requests.get("http://{0}:5000/{1}".format(self.host_address, msg_type),
                                  timeout=timeout, json=data_dict)
            return result.json()

    def distribute_event(self, event_name, data_dict):
        data_dict["event_name"] = event_name
        self.post_task(self.main_id, "distribute_events_stub", data_dict)

    def get_main_property(self, prop_name):
        data_dict = {"property": prop_name}
        result = self.post_and_wait(self.main_id, "get_property", data_dict)
        return result["val"]

    def perform_main_function(self, func_name, args):
        data_dict = {}
        data_dict["args"] = args
        data_dict["func"] = func_name
        result = self.post_and_wait(self.main_id, "get_func", data_dict)
        return result["val"]

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.main_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["tile_message"] = message
        data["tile_id"] = self.my_id
        self.ask_host("emit_tile_message", data)
        return

    def hide_options(self):
        self.emit_tile_message("hideOptions")

    def do_the_refresh(self, new_html=None):
        try:
            self.debug_log("Entering do_the_refresh")
            if new_html is None:
                if not self.configured:
                    new_html = "Tile not configured"
                else:
                    self.debug_log("About to call render_content")
                    new_html = self.render_content()
            self.current_html = new_html
            self.emit_tile_message("displayTileContent", {"html": new_html})
        except Exception as ex:
            self.handle_exception(ex)
        return

    def display_status(self, message):
        self.do_the_refresh(message)
        return

    @task_worthy
    def compile_save_dict(self, data):
        self.debug_log('Entering compile_save_dict in tile_base')
        result = {"my_class_for_recreate": "TileBase"}
        result["binary_attrs"] = []
        for attr in self.save_attrs:
            attr_val = getattr(self, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif((type(attr_val) == dict) and(len(attr_val) > 0) and
                 hasattr(attr_val.values()[0], "compile_save_dict")):
                res = {}
                for(key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                if type(attr_val) in jsonizable_types.values():
                    try:
                        _ = json.dumps(attr_val)
                        result[attr] = attr_val
                        continue
                    except (TypeError, exceptions.UnicodeDecodeError) as e:
                        pass
                try:
                    self.debug_log("Found non jsonizable attribute " + attr)
                    result["binary_attrs"].append(attr)
                    bser_attr_val = Binary(cPickle.dumps(attr_val))
                    result[attr] = bser_attr_val
                except TypeError:
                    continue

        return result

    @task_worthy
    def recreate_from_save(self, save_dict):
        self.debug_log("entering recreate_from_save in tile_base")
        if "binary_attrs" not in save_dict:
            save_dict["binary_attrs"] = []
        for(attr, attr_val) in save_dict.items():
            if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(self, attr, cls.recreate_from_save(attr_val))
            elif((type(attr_val) == dict) and(len(attr_val) > 0) and
                 hasattr(attr_val.values()[0], "recreate_from_save")):
                cls = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                res = {}
                for(key, val) in attr_val.items():
                    res[key] = cls.recreate_from_save(val)
                setattr(self, attr, res)
            else:
                if isinstance(attr_val, Binary) or attr in save_dict["binary_attrs"]:
                    self.debug_log("Found Binary attribute " + attr)
                    decoded_val = cPickle.loads(str(attr_val.decode()))
                    setattr(self, attr, decoded_val)
                else:
                    setattr(self, attr, attr_val)
        return

    @task_worthy
    def render_tile(self, data):
        return {"tile_html": self.render_me(data)}

    def render_me(self, form_info):
        self.debug_log("Entering render_me in tile")
        form_html = self.create_form_html(form_info)["form_html"]
        self.debug_log("Done creating form_html")
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
        with self.app.test_request_context():
            result = render_template("saved_tile.html", tile_id=self.my_id,
                                     tile_name=self.tile_name,
                                     form_text=form_html,
                                     current_html=self.current_html,
                                     whole_width=self.full_tile_width,
                                     whole_height=main_height,
                                     front_height=self.front_height,
                                     front_width=self.front_width,
                                     back_height=self.back_height,
                                     back_width=self.back_width,
                                     tda_height=self.tda_height,
                                     tda_width=self.tda_width,
                                     is_strunk=self.is_shrunk,
                                     triangle_right_display_string=dsr_string,
                                     triangle_bottom_display_string=dbr_string,
                                     front_back_display_string=bda_string

                                 )
        self.debug_log("Rendered the result " + str(result[:200]))
        return result

    def get_current_pipe_list(self):
        pipe_list = []
        for tile_entry in self._pipe_dict.values():
            pipe_list += tile_entry.keys()
        return pipe_list

    def refresh_from_save(self):
        self.emit_tile_message("displayTileContent", {"html": self.current_html})

    def set_tile_size(self, owidth, oheight):
        self.emit_tile_message("setTileSize", {"width": owidth, "height": oheight})

    """
    Default Handlers

    """

    def update_options(self, form_data):
        self.debug_log("entering update_options")
        for opt in self.options:
            if opt["type"] == "int":
                setattr(self, opt["name"], int(form_data[opt["name"]]))
            else:
                setattr(self, opt["name"], form_data[opt["name"]])
        self.configured = True
        self.hide_options()
        self.spin_and_refresh()
        return

    @property
    def options(self):
        return []

    def handle_size_change(self):
        return

    def handle_cell_change(self, column_header, row_index, old_content, new_content, doc_name):
        return

    def handle_text_select(self, selected_text, doc_name, active_row_index):
        return

    def handle_pipe_update(self, pipe_name):
        return

    def handle_button_click(self, value, doc_name, active_row_index):
        return

    def handle_textarea_change(self, value):
        return

    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        return

    def handle_tile_cell_click(self, clicked_text, doc_name, active_row_index):
        self.clear_table_highlighting()
        self.highlight_matching_text(clicked_text)
        return

    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        return

    def handle_log_tile(self):
        self.log_it(self.current_html)
        return

    def handle_tile_word_click(self, clicked_word, doc_name, active_row_index):
        self.distribute_event("DehighlightTable", {})
        self.distribute_event("SearchTable", {"text_to_find": clicked_word})
        return

    def render_content(self):
        self.debug_log("render_content not implemented")
        return " "

    """

    API

    """

    # Refreshing a tile

    def spin_and_refresh(self):
        self.debug_log("Entering spin_and_refresh in tile_base")
        self.post_event("StartSpinner")
        self.post_event("RefreshTile")
        self.post_event("StopSpinner")

    def start_spinner(self):
        self.emit_tile_message("startSpinner")

    def stop_spinner(self):
        self.emit_tile_message("stopSpinner")

    def refresh_tile_now(self, new_html=None):
        if new_html is None:
            self.post_event("RefreshTile")
        else:
            self.current_html = new_html
            self.post_event("RefreshTileFromSave")

    # Basic setting and access

    def get_document_names(self):
        return self.get_main_property("doc_names")

    def get_current_document_name(self):
        return self.get_main_property("visible_doc_name")

    def get_document_data(self, document_name):
        return self.post_and_wait(self.main_id, "get_document_data", {"document_name": document_name})

    def get_document_data_as_list(self, document_name):
        result = self.post_and_wait(self.main_id, "get_document_data_as_list", {"document_name": document_name})
        return result["data_list"]

    def get_column_names(self, document_name):
        result = self.post_and_wait(self.main_id, "get_column_names", {"document_name": document_name})
        return result["header_list"]

    def get_number_rows(self, document_name):
        result = self.post_and_wait(self.main_id, "get_number_rows", {"document_name": document_name})
        return result["number_rows"]

    def get_row(self, document_name, row_number):
        data = {"document_name": document_name, "row_number": row_number}
        result = self.post_and_wait(self.main_id, "get_row", data)
        return result

    def get_cell(self, document_name, row_number, column_name):
        data = {"document_name": document_name, "row_number": row_number, "column_name": column_name}
        result = self.post_and_wait(self.main_id, "get_cell", data)
        return result["the_cell"]

    def get_column_data(self, column_name, document_name=None):
        self.debug_log("entering get_column_data")
        if document_name is not None:
            task_data = {"column_name": column_name, "doc_name": document_name}
            result = self.post_and_wait(self.main_id, "get_column_data_for_doc", task_data)
        else:
            task_data = {"column_name": column_name}
            result = self.post_and_wait(self.main_id, "get_column_data", task_data)
        self.debug_log("leaving get_column_data")
        return result

    def get_column_data_dict(self, column_name):
        result = {}
        for doc_name in self.get_document_names():
            task_data = {"column_name": column_name, "doc_name": doc_name}
            result[doc_name] = self.post_and_wait(self.main_id, "get_column_data_for_doc", task_data)
        return result

    def set_cell(self, document_name, row_number, column_name, text, cellchange=True):
        self.perform_main_function("_set_cell_content", [document_name, row_number, column_name, text, cellchange])
        return

    def set_cell_background(self, document_name, row_number, column_name, color):
        self.perform_main_function("_set_cell_background", [document_name, row_number, column_name, color])
        return

    def set_row(self, document_name, row_number, row_dictionary, cellchange=True):
        for c in row_dictionary.keys():
            self.perform_main_function("_set_cell_content",
                                       [document_name, row_number,c, row_dictionary[c], cellchange])
        return

    def set_column_data(self, document_name, column_name, data_list, cellchange=False):
        for rnum in range(len(data_list)):
            self.set_cell(document_name, rnum, column_name, data_list[rnum], cellchange)

    # Filtering and iteration

    def get_matching_rows(self, filter_function, document_name=None):
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
        return result

    def update_document(self, new_data, document_name):
        self.post_and_wait(self.main_id, "update_document", {"new_data": new_data, "document_name": document_name})
        return

    @task_worthy
    def display_matching_rows(self, filter_function, document_name=None):
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
        self.post_task(self.main_id, "display_matching_rows",
                       {"result": result, "document_name": document_name})
        return

    def clear_table_highlighting(self):
        self.distribute_event(self.main_id, {})

    def highlight_matching_text(self, txt):
        self.distribute_event("SearchTable", {"text_to_find": txt})

    def display_all_rows(self):
        self.post_task(self.main_id, "UnfilterTable")
        return

    def apply_to_rows(self, func, document_name=None):
        self.perform_main_function("apply_to_rows", [func, document_name])
        return

    # Other

    def go_to_document(self, doc_name):
        data = {}
        data["doc_name"] = doc_name
        self.ask_host('go_to_row_in_document', data)

    def go_to_row_in_document(self, doc_name, row_id):
        data = {}
        data["doc_name"] = doc_name
        data["row_id"] = row_id
        self.ask_host('go_to_row_in_document', data)

    def get_selected_text(self):
        return self.get_main_property("selected_text")

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        self.dm("<pre>" + error_string + "</pre>")
        return

    def display_message(self, message_string, force_open=False):
        self.post_task(self.main_id, "print_to_console_event", {"print_string": message_string})
        return

    def dm(self, message_string, force_open=False):
        self.display_message(message_string, force_open)

    def log_it(self, message_string, force_open=False):
        self.post_task(self.main_id, "print_to_console_event", {"print_string": message_string})

    def color_cell_text(self, doc_name, row_index, column_name, tokenized_text, color_dict):
        data = {"doc_name": doc_name, "row_index": row_index}
        actual_row = self.post_and_wait(self.main_id, "get_actual_row", data)["actual_row"]
        self.distribute_event("ColorTextInCell", {"doc_name": doc_name,
                                                  "row_index": actual_row,
                                                  "column_header": column_name,
                                                  "token_text": tokenized_text,
                                                  "color_dict": color_dict})

    def get_user_list(self, the_list):
        self.debug_log("entering get_user_list")
        result = self.post_and_wait("host", "get_list", {"user_id": self.user_id, "list_name": the_list})
        self.debug_log("leaving get_user_list")
        return result["the_list"]

    def get_tokenizer(self, tokenizer_name):
        return tokenizer_dict[tokenizer_name]

    def get_cluster_metric(self, metric_name):
        return cluster_metric_dict[metric_name]

    def get_pipe_value(self, pipe_key):
        self.debug_log("entering get_pipe_value with pipe_key: " + str(pipe_key))
        for(tile_id, tile_entry) in self._pipe_dict.items():
            if pipe_key in tile_entry:
                self.debug_log("found tile_entry: " + str(tile_entry))
                result = self.post_and_wait(tile_entry[pipe_key]["tile_id"],
                                            "transfer_pipe_value", {"export_name": tile_entry[pipe_key]["export_name"]},
                                            timeout=60,
                                            tries=30)
                encoded_val = result["encoded_val"]
                val = cPickle.loads(encoded_val.decode("utf-8", "ignore").encode("ascii"))
                return val
        return None

    @task_worthy
    def transfer_pipe_value(self, data):
        export_name = data["export_name"]
        encoded_val = Binary(cPickle.dumps(getattr(self, export_name)))
        return {"encoded_val": encoded_val}

    def get_weight_function(self, weight_function_name):
        return weight_functions[weight_function_name]

    def create_data_source(self, data):
        dataname = str(self.current_data_id)
        self.current_data_id += 1
        self.data_dict[dataname] = data
        return dataname

    def create_lineplot_html(self, data, xlabels=None):
        if xlabels is None:
            xlabels = []
        data_name = self.create_data_source({"data_list": data, "xlabels": xlabels})
        uid = self.get_unique_div_id()
        the_html = "<div id='{}'><div class='d3plot'></div>".format(str(uid))

        the_script = "createLinePlot('{0}', '{1}', '{2}')".format(self.my_id, data_name, uid)
        the_html += "<script class='resize-rerun'>{}</script></div>".format(the_script)
        return the_html

    def create_scatterplot_html(self, data, xlabels=None, margins=None):
        if margins is None:
            margins = {"top": 20, "bottom": 20, "left": 20, "right": 20}
        if xlabels is None:
            xlabels = []
        data_name = self.create_data_source({"data_list": data, "xlabels": xlabels, "margins": margins})
        uid = self.get_unique_div_id()
        the_html = "<div id='{}'><div class='d3plot'></div>".format(str(uid))

        the_script = "createScatterPlot('{0}', '{1}', '{2}')".format(self.my_id, data_name, uid)
        the_html += "<script class='resize-rerun'>{}</script></div>".format(the_script)
        return the_html

    def create_heatmap(self, data, row_labels=None, margins=None, domain=None, title=None):
        if margins is None:
            margins = {"top": 20, "bottom": 20, "left": 20, "right": 20}
        if row_labels is None:
            row_labels = []

        if domain is None:
            domain = [np.amin(data), np.amax(data)]
        data_name = self.create_data_source({"data_list": data, "row_labels": row_labels, "margins": margins, "domain": domain, "title": title})
        uid = self.get_unique_div_id()
        the_html = "<div id='{}'><div class='d3plot'></div>".format(str(uid))
        the_script = "createHeatmap('{0}', '{1}', '{2}')".format(self.my_id, data_name, uid)
        the_html += "<script class='resize-rerun' >{}</script></div>".format(the_script)
        return the_html

    def get_unique_div_id(self):
        unique_id = "div-{0}-{1}-{2}".format(self.main_id, self.my_id, self.current_unique_id_index)
        self.current_unique_id_index += 1
        return str(unique_id)

    """

    Odd utility methods

    """

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def build_html_table_from_data_list(self, data_list, title=None, click_type="word-clickable", sortable=True, sidebyside=False):
        if sortable:
            if not sidebyside:
                the_html = "<table class='tile-table table table-striped table-bordered table-condensed sortable'>"
            else:
                the_html = "<table class='tile-table sidebyside-table table-striped table-bordered table-condensed sortable'>"
        else:
            if not sidebyside:
                the_html = "<table class='tile-table table table-striped table-bordered table-condensed'>"
            else:
                the_html = "<table class='tile-table sidebyside-table table-striped table-bordered table-condensed'>"

        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for rnum, r in enumerate(data_list[1:]):
            if click_type == "row-clickable":
                the_html += "<tr class='row-clickable'>"
                for c in r:
                    the_html += "<td>{0}</td>".format(c)
                the_html += "</tr>"
            elif click_type == "word-clickable":
                the_html += "<tr>"
                for c in r:
                    the_html += "<td class='word-clickable'>{0}</td>".format(c)
                the_html += "</tr>"
            else:
                the_html += "<tr>"
                for cnum, c in enumerate(r):
                    the_html += "<td class='element-clickable' data-row='{1}' " \
                                "data-col='{2}' data-val='{0}'>{0}</td>".format(c, str(rnum), str(cnum))
                the_html += "</tr>"
        the_html += "</tbody></table>"
        return the_html
