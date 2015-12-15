import Queue
import threading
from flask_login import current_user
from flask import url_for
from tactic_app import socketio
from shared_dicts import mainwindow_instances, distribute_event, get_tile_class
from shared_dicts import tokenizer_dict, weight_functions
from users import load_user
import sys
from matplotlib_utilities import color_palette_names

class TileBase(threading.Thread):
    category = "basic"
    exports = {}
    save_attrs = ["current_html", "tile_id", "tile_type", "tile_name"]
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
        self._stopevent = threading.Event()
        self._sleepperiod = .05
        threading.Thread.__init__(self)
        self._my_q = Queue.Queue(0)

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
        self.img_dict = {}
        self.current_fig_id = 0
        self.base_figure_url = url_for("figure_source", main_id=main_id, tile_id=tile_id, figure_name="X")[:-1]
        return

    """
    Basic Machinery to make the tile work.
    """

    def run(self):
        while not self._stopevent.isSet():
            if not self._my_q.empty():
                q_item = self._my_q.get()
                if type(q_item) == dict:
                    self.handle_event(q_item["event_name"], q_item["data"])
                else:
                    self.handle_event(q_item)
            self._stopevent.wait(self._sleepperiod)

    def join(self, timeout=None):
        """ Stop the thread and wait for it to end.
        :param timeout:
        """
        self._stopevent.set()
        threading.Thread.join(self, timeout)

    def post_event(self, event_name, data=None):
        self._my_q.put({"event_name": event_name, "data": data})

    def handle_event(self, event_name, data=None):
        try:
            if event_name == "RefreshTile":
                self.do_the_refresh()
            elif event_name == "TileSizeChange":
                self.width = data["width"]
                self.height = data["height"]
                self.handle_size_change()
            elif event_name == "RefreshTileFromSave":
                self.refresh_from_save()
            elif event_name == "UpdateOptions":
                self.update_options(data)
            elif event_name == "CellChange":
                self.handle_cell_change(data["column_header"], data["id"], data["old_content"],
                                        data["new_content"], data["doc_name"])
            elif event_name == "TileButtonClick":
                self.handle_button_click(data["button_value"], data["doc_name"], data["active_row_index"])
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
            elif event_name == "ShowFront":
                self.show_front()
            elif event_name == "StartSpinner":
                self.start_spinner()
            elif event_name == "StopSpinner":
                self.stop_spinner()
            elif event_name == "RebuildTileForms":
                form_html = self.create_form_html()
                self.emit_tile_message("displayFormContent", {"html": form_html})
        except:
            self.display_message("error in handle_event in " + self.__class__.__name__ + " tile: processing event " + event_name + " " +
                                 str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
        return

    def create_form_html(self):
        try:
            form_html = ""
            for option in self.options:
                if option["type"] == "column_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    current_doc_name = mainwindow_instances[self.main_id].visible_doc_name
                    current_doc = mainwindow_instances[self.main_id].doc_dict[current_doc_name]
                    for choice in current_doc.header_list:
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "tokenizer_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in tokenizer_dict.keys():
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'

                elif option["type"] == "weight_function_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in weight_functions.keys():
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "pipe_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in self.get_current_pipe_list():
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "document_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in self.get_document_names():
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "list_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in self.current_user.list_names:
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "palette_select":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in color_palette_names:
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "custom_list":
                    the_template = self.input_start_template + self.select_base_template
                    form_html += the_template.format(option["name"])
                    for choice in option["special_list"]:
                        if choice == option["placeholder"]:
                            form_html += self.select_option_selected_template.format(choice)
                        else:
                            form_html += self.select_option_template.format(choice)
                    form_html += '</select></div>'
                elif option["type"] == "textarea":
                    the_template = self.input_start_template + self.textarea_template
                    form_html += the_template.format(option["name"], option["type"], option["placeholder"])
                elif option["type"] == "text":
                    the_template = self.input_start_template + self.basic_input_template
                    form_html += the_template.format(option["name"], option["type"], option["placeholder"])
                elif option["type"] == "int":
                    the_template = self.input_start_template + self.basic_input_template
                    form_html += the_template.format(option["name"], option["type"], str(option["placeholder"]))
                elif option["type"] == "boolean":
                    the_template = self.boolean_template
                    if option["placeholder"]:
                        val = "checked"
                    else:
                        val = " '"
                    form_html += the_template.format(option["name"], val)
                else:
                    print "Unknown option type specified"
            return form_html
        except:
            self.display_message("error creating form for  " + self.__class__.__name__ + " tile: " + self.tile_id + " " +
                                 str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
            return "error"

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["message"] = message
        data["tile_id"] = self.tile_id
        socketio.emit("tile-message", data, namespace='/main', room=self.main_id)

    def show_front(self):
        self.emit_tile_message("showFront")

    def do_the_refresh(self, new_html=None):
        if new_html is None:
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
                result[attr] = attr_val
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        tile_type = save_dict["tile_type"]
        tile_cls = get_tile_class(current_user.username, tile_type)
        if tile_cls is None:
            print "Missing Tile type"
            return None
        new_instance = tile_cls(-1, save_dict["tile_id"], save_dict["tile_name"])
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

    """
    Default Handlers

    """

    def update_options(self, form_data):
        for opt in self.options:
            if opt["type"] == "int":
                setattr(self, opt["name"], int(form_data[opt["name"]]))
            else:
                setattr(self, opt["name"], form_data[opt["name"]])
        self.show_front()
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
        return mainwindow_instances[self.main_id].doc_names

    def get_current_document_name(self):
        return mainwindow_instances[self.main_id].visible_doc_name

    def get_document_data(self, document_name):
        return mainwindow_instances[self.main_id].doc_dict[document_name].data_rows_int_keys

    def get_document_data_as_list(self, document_name):
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows

    def get_column_names(self, document_name):
        return mainwindow_instances[self.main_id].doc_dict[document_name].header_list

    def get_number_rows(self, document_name):
        return len(mainwindow_instances[self.main_id].doc_dict[document_name].data_rows.keys())

    def get_row(self, document_name, row_number):
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows[row_number]

    def get_cell(self, document_name, row_number, column_name):
        return mainwindow_instances[self.main_id].doc_dict[document_name].all_sorted_data_rows[int(row_number)][
            column_name]

    def get_column_data(self, column_name, document_name=None):
        if document_name is not None:
            result = mainwindow_instances[self.main_id].get_column_data_for_doc(column_name, document_name)
        else:
            result = mainwindow_instances[self.main_id].get_column_data(column_name)
        return result

    def get_column_data_dict(self, column_name):
        result = {}
        for doc_name in self.get_document_names():
            result[doc_name] = mainwindow_instances[self.main_id].get_column_data_for_doc(column_name, doc_name)
        return result

    def set_cell(self, document_name, row_number, column_name, text, cellchange=True):
        mainwindow_instances[self.main_id]._set_cell_content(document_name, row_number, column_name, text, cellchange)
        return

    def set_cell_background(self, document_name, row_number, column_name, color):
        mainwindow_instances[self.main_id]._set_cell_background(document_name, row_number, column_name, color)
        return

    def set_row(self, document_name, row_number, row_dictionary, cellchange=True):
        for c in row_dictionary.keys():
            mainwindow_instances[self.main_id]._set_cell_content(document_name, row_number,
                                                                 c, row_dictionary[c], cellchange)
        return

    def set_column_data(self, document_name, column_name, data_list, cellchange=False):
        for rnum in range(len(data_list)):
            self.set_cell(document_name, rnum, column_name, data_list[rnum], cellchange)

    # Filtering and iteration

    def get_matching_rows(self, filter_function, document_name):
        return mainwindow_instances[self.main_id].get_matching_rows(filter_function, document_name)

    def display_matching_rows(self, filter_function, document_name=None):
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
        mainwindow_instances[self.main_id].apply_to_rows(func, document_name)
        return

    # Other

    def get_selected_text(self):
        return mainwindow_instances[self.main_id].selected_text

    def display_message(self, message_string, force_open=False):
        mainwindow_instances[self.main_id].print_to_console(message_string, force_open)


    def dm(self, message_string, force_open=False):
        self.display_message(message_string, force_open)

    def color_cell_text(self, doc_name, row_index, column_name, tokenized_text, color_dict):
        distribute_event("ColorTextInCell", self.main_id, {"doc_name": doc_name,
                                                           "row_index": row_index,
                                                           "column_header": column_name,
                                                           "token_text": tokenized_text,
                                                           "color_dict": color_dict})

    def get_user_list(self, the_list):
        return self.current_user.get_list(the_list)

    def get_tokenizer(self, tokenizer_name):
        return tokenizer_dict[tokenizer_name]

    def get_pipe_value(self, pipe_key):
        mw = mainwindow_instances[self.main_id]
        for(tile_id, tile_entry) in mainwindow_instances[self.main_id]._pipe_dict.items():
            if pipe_key in tile_entry:
                return getattr(mw.tile_instances[tile_id], tile_entry[pipe_key])
        return None

    def get_weight_function(self, weight_function_name):
        return weight_functions[weight_function_name]

    def create_figure_html(self, fig):
        figname = str(self.current_fig_id)
        self.current_fig_id += 1
        self.img_dict[figname] = fig.img
        fig_url = self.base_figure_url + figname
        image_string = "<img class='output-plot' src='{}' onclick=showZoomedImage(this) lt='Image Placeholder'>"
        the_html = image_string.format(fig_url)
        return the_html

    """

    Odd utility methods

    """

    def dict_to_list(self, the_dict):
        result = []
        for it in the_dict.values():
            result += it
        return result

    def build_html_table_from_data_list(self, data_list, title=None, row_clickable=False):
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
