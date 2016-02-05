
import gevent
from gevent.queue import Queue
from flask_login import current_user
from flask import url_for
from tactic_app import socketio
from tactic_app.shared_dicts import mainwindow_instances, distribute_event, get_tile_class
from tactic_app.shared_dicts import tokenizer_dict, weight_functions
from tactic_app.matplotlib_utilities import MplFigure
from users import load_user
import sys
from matplotlib_utilities import color_palette_names, FigureCanvas
import numpy as np
from bson.binary import Binary
import cPickle
import json
from types import NoneType
import exceptions
import StringIO


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


class TileBase(gevent.Greenlet):
    category = "basic"
    exports = {}
    input_start_template = '<div class="form-group form-group-sm"">' \
                           '<label>{0}</label>'
    basic_input_template = '<input type="{1}" class="form-control input-sm" id="{0}" value="{2}"></input>' \
                           '</div>'
    textarea_template = '<textarea type="{1}" class="form-control input-sm" id="{0}" value="{2}">{2}</textarea>' \
                        '</div>'
    select_base_template = '<select class="form-control input-sm" id="{0}">'
    select_option_template = '<option value="{0}">{0}</option>'
    select_option_selected_template = '<option value="{0}" selected>{0}</option>'
    boolean_template = '<div class="checkbox"><label style="font-weight: 700">'\
                       '<input type="checkbox" id="{0}" value="{0}" {1}>{0}</label>' \
                       '</div>'

    def __init__(self, main_id, tile_id, tile_name=None):
        self._my_q = Queue()
        gevent.Greenlet.__init__(self)
        self._sleepperiod = .0001
        self.save_attrs = ["current_html", "tile_id", "tile_type", "tile_name", "main_id", "configured",
                           "header_height", "front_height", "front_width", "back_height", "back_width",
                           "tda_width", "tda_height", "width", "height",
                           "full_tile_width", "full_tile_height", "is_shrunk", "img_dict", "current_fig_id"]
        # These define the state of a tile and should be saved

        self.tile_type = self.__class__.__name__
        if tile_name is None:
            self.tile_name = self.tile_type
        else:
            self.tile_name = tile_name

        self.current_html = None

        # These will differ each time the tile is instantiated.
        self.tile_id = tile_id
        self.main_id = main_id
        self.figure_id = 0
        self.width = ""
        self.height = ""
        self.full_tile_width = ""
        self.full_tile_height = ""
        self.img_dict = {}
        self.data_dict = {}
        self.current_fig_id = 0
        self.current_data_id = 0
        self.current_unique_id_index = 0
        self.is_shrunk = False
        self.base_figure_url = url_for("figure_source", main_id=main_id, tile_id=tile_id, figure_name="X")[:-1]
        self.base_data_url = url_for("data_source", main_id=main_id, tile_id=tile_id, data_name="X")[:-1]
        self.configured = False
        return

    """
    Basic Machinery to make the tile work.
    """

    def _run(self):
        self.running = True
        while self.running:
            if not self._my_q.empty():
                q_item = self._my_q.get()
                if type(q_item) == dict:
                    self.handle_event(q_item["event_name"], q_item["data"])
                else:
                    self.handle_event(q_item)
            self.tile_yield()

    def tile_yield(self):
        gevent.sleep(self._sleepperiod)

    def post_event(self, event_name, data=None):
        self._my_q.put({"event_name": event_name, "data": data})

    def handle_event(self, event_name, data=None):
        try:
            if event_name == "RefreshTile":
                self.do_the_refresh()
            elif event_name == "TileSizeChange":
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
                    if isinstance(self, MplFigure):
                        self.resize_mpl_tile()
                    else:
                        self.handle_size_change()
            elif event_name == "RefreshTileFromSave":
                self.refresh_from_save()
            if event_name == "SetSizeFromSave":
                self.set_tile_size(self.full_tile_width, self.full_tile_height)
            elif event_name == "UpdateOptions":
                self.update_options(data)
            elif event_name == "CellChange":
                self.handle_cell_change(data["column_header"], data["id"], data["old_content"],
                                        data["new_content"], data["doc_name"])
            elif event_name == "TileButtonClick":
                self.handle_button_click(data["button_value"], data["doc_name"], data["active_row_index"])
            elif event_name == "TileTextAreaChange":
                self.handle_textarea_change(data["text_value"])
            elif event_name == "TextSelect":
                self.handle_text_select(data["selected_text"], data["doc_name"], data["active_row_index"])
            elif event_name == "PipeUpdate":
                self.handle_pipe_update(data["pipe_name"])
            elif event_name == "TileWordClick":
                self.handle_tile_word_click(data["clicked_text"], data["doc_name"], data["active_row_index"])
            elif event_name == "TileRowClick":
                self.handle_tile_row_click(data["clicked_row"], data["doc_name"], data["active_row_index"])
            elif event_name == "TileCellClick":
                self.handle_tile_cell_click(data["clicked_cell"], data["doc_name"], data["active_row_index"])
            elif event_name == "HideOptions":
                self.hide_options()
            elif event_name == "StartSpinner":
                self.start_spinner()
            elif event_name == "StopSpinner":
                self.stop_spinner()
            elif event_name == "ShrinkTile":
                self.is_shrunk = True
            elif event_name == "ExpandTile":
                self.is_shrunk = False
            elif event_name == "RebuildTileForms":
                form_html = self.create_form_html()
                self.emit_tile_message("displayFormContent", {"html": form_html})
        except:
            self.display_message("error in handle_event in " + self.__class__.__name__ +
                                 " tile: processing event " + event_name + " " +
                                 str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
        return

    def create_form_html(self):
        try:
            form_html = ""
            for option in self.options:
                att_name = option["name"]
                if not hasattr(self, att_name):
                    setattr(self, att_name, None)
                self.save_attrs.append(att_name)
                starting_value = getattr(self, att_name)
                if option["type"] == "column_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    current_doc_name = mainwindow_instances[self.main_id].visible_doc_name
                    current_doc = mainwindow_instances[self.main_id].doc_dict[current_doc_name]
                    for choice in current_doc.header_list:
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
                    for choice in self.get_document_names():
                        if choice == starting_value:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "list_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(att_name)
                    for choice in self.current_user.list_names:
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
                elif option["type"] == "textarea":
                    the_template = self.input_start_template + self.textarea_template
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
            return form_html
        except:
            self.display_message("error creating form for  " + self.__class__.__name__ +
                                 " tile: " + self.tile_id + " " +
                                 str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
            return "error"

    def resize_mpl_tile(self):
        self.draw_plot()
        new_html = self.create_figure_html()
        self.refresh_tile_now(new_html)
        return

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["message"] = message
        data["tile_id"] = self.tile_id
        socketio.emit("tile-message", data, namespace='/main', room=self.main_id)

    def hide_options(self):
        self.emit_tile_message("hideOptions")

    def do_the_refresh(self, new_html=None):
        if new_html is None:
            if not self.configured:
                new_html = "Tile not configured"
            else:
                new_html = self.render_content()
        self.current_html = new_html
        self.emit_tile_message("displayTileContent", {"html": new_html})

    def compile_save_dict(self):
        result = {"my_class_for_recreate": "TileBase"}
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
                    bser_attr_val = Binary(cPickle.dumps(attr_val))
                    result[attr] = bser_attr_val
                except TypeError:
                    continue

        return result

    @staticmethod
    def recreate_from_save(save_dict):
        tile_type = save_dict["tile_type"]
        tile_cls = get_tile_class(current_user.username, tile_type)
        if tile_cls is None:
            print "Missing Tile type"
            return None
        new_instance = tile_cls(save_dict["main_id"], save_dict["tile_id"], save_dict["tile_name"])
        for(attr, attr_val) in save_dict.items():
            if type(attr_val) == dict and hasattr(attr_val, "recreate_from_save"):
                cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(new_instance, attr, cls.recreate_from_save(attr_val))
            elif((type(attr_val) == dict) and(len(attr_val) > 0) and
                 hasattr(attr_val.values()[0], "recreate_from_save")):
                cls = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                res = {}
                for(key, val) in attr_val.items():
                    res[key] = cls.recreate_from_save(val)
                setattr(new_instance, attr, res)
            else:
                if isinstance(attr_val, Binary):
                    decoded_val = cPickle.loads(str(attr_val.decode()))
                    setattr(new_instance, attr, decoded_val)
                else:
                    setattr(new_instance, attr, attr_val)
        return new_instance


    @property
    def current_user(self):
        user_id = mainwindow_instances[self.main_id].user_id
        return load_user(user_id)

    def get_current_pipe_list(self):
        pipe_list = []
        for tile_entry in mainwindow_instances[self.main_id]._pipe_dict.values():
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

    def handle_tile_word_click(self, clicked_word, doc_name, active_row_index):
        distribute_event("DehighlightTable", self.main_id, {})
        distribute_event("SearchTable", self.main_id, {"text_to_find": clicked_word})
        return

    def render_content(self):
        print "not implemented"

    """

    API

    """

    # Refreshing a tile

    def spin_and_refresh(self):
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
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_names

    def get_current_document_name(self):
        self.tile_yield()
        return mainwindow_instances[self.main_id].visible_doc_name

    def get_document_data(self, document_name):
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_dict[document_name].data_rows_int_keys

    def get_document_data_as_list(self, document_name):
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows

    def get_column_names(self, document_name):
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_dict[document_name].header_list

    def get_number_rows(self, document_name):
        self.tile_yield()
        return len(mainwindow_instances[self.main_id].doc_dict[document_name].data_rows.keys())

    def get_row(self, document_name, row_number):
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows[row_number]

    def get_cell(self, document_name, row_number, column_name):
        self.tile_yield()
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows[int(row_number)][
            column_name]

    def get_column_data(self, column_name, document_name=None):
        self.tile_yield()
        if document_name is not None:
            result = mainwindow_instances[self.main_id].get_column_data_for_doc(column_name, document_name)
        else:
            result = mainwindow_instances[self.main_id].get_column_data(column_name)
        return result

    def get_column_data_dict(self, column_name):
        self.tile_yield()
        result = {}
        for doc_name in self.get_document_names():
            result[doc_name] = mainwindow_instances[self.main_id].get_column_data_for_doc(column_name, doc_name)
        return result

    def set_cell(self, document_name, row_number, column_name, text, cellchange=True):
        self.tile_yield()
        mainwindow_instances[self.main_id]._set_cell_content(document_name, row_number, column_name, text, cellchange)
        return

    def set_cell_background(self, document_name, row_number, column_name, color):
        self.tile_yield()
        mainwindow_instances[self.main_id]._set_cell_background(document_name, row_number, column_name, color)
        return

    def set_row(self, document_name, row_number, row_dictionary, cellchange=True):
        self.tile_yield()
        for c in row_dictionary.keys():
            mainwindow_instances[self.main_id]._set_cell_content(document_name, row_number,
                                                                 c, row_dictionary[c], cellchange)
        return

    def set_column_data(self, document_name, column_name, data_list, cellchange=False):
        self.tile_yield()
        for rnum in range(len(data_list)):
            self.set_cell(document_name, rnum, column_name, data_list[rnum], cellchange)

    # Filtering and iteration

    def get_matching_rows(self, filter_function, document_name=None):
        self.tile_yield()
        return mainwindow_instances[self.main_id].get_matching_rows(filter_function, document_name)

    def display_matching_rows(self, filter_function, document_name=None):
        self.tile_yield()
        mainwindow_instances[self.main_id].display_matching_rows(filter_function, document_name)
        return

    def clear_table_highlighting(self):
        distribute_event("DehighlightTable", self.main_id, {})

    def highlight_matching_text(self, txt):
        distribute_event("SearchTable", self.main_id, {"text_to_find": txt})

    def display_all_rows(self):
        mainwindow_instances[self.main_id].unfilter_all_rows()
        return

    def apply_to_rows(self, func, document_name=None):
        self.tile_yield()
        mainwindow_instances[self.main_id].apply_to_rows(func, document_name)
        return

    # Other

    def go_to_document(self, doc_name):
        data = {}
        data["doc_name"] = doc_name
        socketio.emit('change-doc', data, namespace='/main', room=self.main_id)

    def go_to_row_in_document(self, doc_name, row_id):
        data = {}
        data["doc_name"] = doc_name
        data["row_id"] = row_id
        socketio.emit('change-doc', data, namespace='/main', room=self.main_id)

    def get_selected_text(self):
        return mainwindow_instances[self.main_id].selected_text

    def display_message(self, message_string, force_open=False):
        self.tile_yield()
        mainwindow_instances[self.main_id].print_to_console(message_string, force_open)


    def dm(self, message_string, force_open=False):
        self.tile_yield()
        self.display_message(message_string, force_open)

    def color_cell_text(self, doc_name, row_index, column_name, tokenized_text, color_dict):
        self.tile_yield()
        distribute_event("ColorTextInCell", self.main_id, {"doc_name": doc_name,
                                                           "row_index": row_index,
                                                           "column_header": column_name,
                                                           "token_text": tokenized_text,
                                                           "color_dict": color_dict})

    def get_user_list(self, the_list):
        return self.current_user.get_list(the_list)

    def get_tokenizer(self, tokenizer_name):
        self.tile_yield()
        return tokenizer_dict[tokenizer_name]

    def get_pipe_value(self, pipe_key):
        self.tile_yield()
        mw = mainwindow_instances[self.main_id]
        for(tile_id, tile_entry) in mainwindow_instances[self.main_id]._pipe_dict.items():
            if pipe_key in tile_entry:
                return getattr(mw.tile_instances[tile_id], tile_entry[pipe_key])
        return None

    def get_weight_function(self, weight_function_name):
        self.tile_yield()
        return weight_functions[weight_function_name]

    def create_figure_html(self):
        canvas=FigureCanvas(self) # This does seem to be necessary or savefig won't work.
        img_file = StringIO.StringIO()
        self.savefig(img_file)
        img_file.seek(0)
        figname = str(self.current_fig_id)
        self.current_fig_id += 1
        self.img_dict[figname]  = img_file.getvalue()
        fig_url = self.base_figure_url + figname
        image_string = "<img class='output-plot' src='{}' onclick=showZoomedImage(this) lt='Image Placeholder'>"
        the_html = image_string.format(fig_url)
        return the_html

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

        the_script = "createLinePlot('{0}', '{1}', '{2}')".format(self.tile_id, data_name, uid)
        the_html += "<script>{}</script></div>".format(the_script)
        return the_html

    def create_scatterplot_html(self, data, xlabels=None, margins=None):
        if margins is None:
            margins = {"top": 20, "bottom": 20, "left": 20, "right": 20}
        if xlabels is None:
            xlabels = []
        data_name = self.create_data_source({"data_list": data, "xlabels": xlabels, "margins": margins})
        uid = self.get_unique_div_id()
        the_html = "<div id='{}'><div class='d3plot'></div>".format(str(uid))

        the_script = "createScatterPlot('{0}', '{1}', '{2}')".format(self.tile_id, data_name, uid)
        the_html += "<script>{}</script></div>".format(the_script)
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


        the_script = "createHeatmap('{0}', '{1}', '{2}')".format(self.tile_id, data_name, uid)
        the_html += "<script>{}</script></div>".format(the_script)
        return the_html

    def get_unique_div_id(self):
        unique_id = "div-{0}-{1}-{2}".format(self.main_id, self.tile_id, self.current_unique_id_index)
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

    def build_html_table_from_data_list(self, data_list, title=None, row_clickable=False, sortable=True):
        if sortable:
            the_html = "<table class='tile-table table table-striped table-bordered table-condensed sortable'>"
        else:
            the_html = "<table class='tile-table table table-striped table-bordered table-condensed'>"
        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            if row_clickable:
                the_html += "<tr class='row-clickable'>"
                for c in r:
                    the_html += "<td>{0}</td>".format(c)
                the_html += "</tr>"
            else:
                the_html += "<tr>"
                for c in r:
                    the_html += "<td class='cell-clickable'>{0}</td>".format(c)
                the_html += "</tr>"
        the_html += "</tbody></table>"
        return the_html
