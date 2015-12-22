__author__ = 'bls910'

import Queue
import threading
import re
from tactic_app import db
from flask_login import current_user
import copy
import pymongo
import sys
from tile_base import TileBase # This is needed from recreating tiles from saves
from collections import OrderedDict

from shared_dicts import mainwindow_instances, distribute_event, get_tile_class
from shared_dicts import tile_classes, user_tiles
from tactic_app import socketio

from tactic_app import CHUNK_SIZE, STEP_SIZE

current_main_id = 0

def create_new_mainwindow(user_id, collection_name):
    mw = mainWindow(user_id, collection_name)
    mainwindow_instances[mw._main_id] = mw
    mw.start()
    return mw._main_id

def create_new_mainwindow_from_project(project_dict):
    mw = mainWindow.recreate_from_save(project_dict)
    mainwindow_instances[mw._main_id] = mw
    mw.start()
    return mw._main_id

class docInfo():
    def __init__(self, name, data_rows, header_list=None, cell_backgrounds = {}):
        self.name = name
        self.data_rows = data_rows  # All the data rows in the doc
        self.current_data_rows = data_rows  # The current filtered set of data rows
        self.header_list = header_list
        self.table_spec = {}
        self.cell_backgrounds = cell_backgrounds
        self.configure_for_current_data()
        if len(self.data_rows.keys()) > CHUNK_SIZE:
            self.max_table_size = CHUNK_SIZE
        else:
            self.max_table_size = len(self.data_rows.keys())

    def set_background_color(self, row, column_header, color):
        if not str(row) in self.cell_backgrounds:
            self.cell_backgrounds[str(row)] = {}
        self.cell_backgrounds[str(row)][column_header] = color


    @property
    def displayed_background_colors(self):
        if not self.infinite_scroll_required:
            return self.cell_backgrounds
        result = {}
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + CHUNK_SIZE)]:
            if str(r) in self.cell_backgrounds:
                result[str(r)] = self.cell_backgrounds[str(r)]
        return result

    def configure_for_current_data(self):
        self.start_of_current_chunk = 0
        self.is_first_chunk = True
        if (len(self.current_data_rows.keys()) <= CHUNK_SIZE):
            self.infinite_scroll_required = False
            self.is_last_chunk = True
        else:
            self.infinite_scroll_required = True
            self.is_last_chunk = False

    def get_actual_row(self, row_id):
        row = int(row_id)
        if (row >= self.start_of_current_chunk and row < (self.start_of_current_chunk + CHUNK_SIZE)):
            return row - self.start_of_current_chunk
        else:
            return None

    def compile_save_dict(self):
        return ({"name": self.name,
                 "data_rows": self.data_rows,
                 "table_spec": self.table_spec,
                 "cell_backgrounds": self.cell_backgrounds,
                 "my_class_for_recreate": "docInfo",
                 "header_list": self.header_list})

    @property
    def sorted_data_rows(self):
        result = []
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    @property
    def all_sorted_data_rows(self):
        result = []
        sorted_int_keys = sorted([int(key) for key in self.data_rows.keys()])
        for r in sorted_int_keys:
            result.append(self.data_rows[str(r)])
        return result

    @property
    def displayed_data_rows(self):
        if not self.infinite_scroll_required:
            return self.sorted_data_rows
        result = []
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for r in sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + CHUNK_SIZE)]:
            result.append(self.current_data_rows[str(r)])
        return result

    def advance_to_next_chunk(self):
        if self.is_last_chunk:
            return
        old_start = self.start_of_current_chunk
        self.start_of_current_chunk = self.start_of_current_chunk + STEP_SIZE
        self.is_first_chunk = False
        if (self.start_of_current_chunk + CHUNK_SIZE) >= len(self.current_data_rows):
            self.start_of_current_chunk = len(self.current_data_rows) - CHUNK_SIZE
            self.is_last_chunk = True
        return self.start_of_current_chunk - old_start

    def go_to_previous_chunk(self):
        if self.is_first_chunk:
            return
        old_start = self.start_of_current_chunk
        self.start_of_current_chunk = self.start_of_current_chunk - STEP_SIZE
        self.is_last_chunk = False
        if self.start_of_current_chunk <= 0:
            self.start_of_current_chunk = 0
            self.is_first_chunk = True
        return old_start - self.start_of_current_chunk

    @property
    def data_rows_int_keys(self):
        result = {}
        for (key, val) in self.data_rows.items():
            result[int(key)] = val
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = docInfo(save_dict["name"], save_dict["data_rows"], save_dict["header_list"], save_dict["cell_backgrounds"])
        new_instance.table_spec = save_dict["table_spec"]
        return new_instance

class mainWindow(threading.Thread):
    save_attrs = ["short_collection_name", "collection_name", "current_tile_id",
                  "user_id", "doc_dict", "tile_instances", "project_name", "loaded_modules", "hidden_columns_list"]
    update_events = ["CellChange", "CreateColumn", "SearchTable", "SaveTableSpec",
                    "DehighlightTable", "SetCellContent", "RemoveTile", "ColorTextInCell", "FilterTable", "UnfilterTable", "TextSelect"]
    def __init__(self, user_id, collection_name, doc_dict=None):
        global current_main_id
        self._stopevent = threading.Event()
        self._sleepperiod = .01
        threading.Thread.__init__(self)
        self._my_q = Queue.Queue(0)

        # These are the main attributes that define a project state
        self.tile_instances = {}
        self.collection_name = collection_name
        self.short_collection_name = re.sub("^.*?\.data_collection\.", "", collection_name)
        self.user_id = user_id
        self.project_name = None
        if doc_dict is None:
            self.doc_dict = self._build_doc_dict()
        else:
            self.doc_dict = doc_dict

        # These are working attributes that will change whenever the project is instantiated.
        self.current_tile_id = 0
        self._main_id = str(current_main_id)
        current_main_id += 1
        self._change_list = []
        self.visible_doc_name = None
        self._pipe_dict = {}
        self.selected_text = ""

        # self.cells_with_highlights = []

    def compile_save_dict(self):
        result = {}
        for attr in self.save_attrs:
            attr_val = getattr(self, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif ((type(attr_val) == dict) and (len(attr_val) > 0) and hasattr(attr_val.values()[0], "compile_save_dict")):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                result[attr] = attr_val
        return result

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = mainWindow(save_dict["user_id"], save_dict["collection_name"])
        for (attr, attr_val) in save_dict.items():
            if type(attr_val) == dict and ("my_class_for_recreate" in attr_val):
                cls  = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                setattr(new_instance, attr, cls.recreate_from_save(attr_val))
            elif ((type(attr_val) == dict) and (len(attr_val) > 0) and ("my_class_for_recreate" in attr_val.values()[0])):
                cls_name =  attr_val.values()[0]["my_class_for_recreate"]
                cls  = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = cls.recreate_from_save(val)
                setattr(new_instance, attr, res)
            else:
                setattr(new_instance, attr, attr_val)

        # There's some extra work I have to do once all of the tiles are built.
        # Each tile needs to know the main_id it's associated with.
        # Also I have to build the pipe machinery.
        for tile in new_instance.tile_instances.values():
            tile.main_id = new_instance._main_id
            if len(tile.exports) > 0:
                if tile.tile_id not in new_instance._pipe_dict:
                    new_instance._pipe_dict[tile.tile_id] = {}
                for export in tile.exports:
                    new_instance._pipe_dict[tile.tile_id][tile.tile_name + "_" + export] = export
            tile.start()
        return new_instance

    @property
    def doc_names(self):
        return sorted([str(key) for key in self.doc_dict.keys()])

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec: # This will be false if table_spec == {}
                tdict[key] = docinfo.table_spec
        return tdict

    @property
    def tile_ids(self):
        return self.tile_instances.keys()

    def add_blank_column(self, column_name):
        for doc in self.doc_dict.values():
            doc.header_list.append(column_name)
            for r in doc.data_rows.values():
                r[column_name] = ""

    def post_event(self, event_name, data=None):
        self._my_q.put({"event_name": event_name, "data": data})

    def _delete_tile_instance(self, tile_id):
        del self.tile_instances[tile_id]
        if tile_id in self._pipe_dict:
            del self._pipe_dict[tile_id]
            distribute_event("RebuildTileForms", self._main_id)

    def create_tile_instance_in_mainwindow(self, tile_type, tile_name = None):
        new_id = "tile_id_" + str(self.current_tile_id)
        # The user version of a tile should take precedence if both exist
        new_tile = get_tile_class(current_user.username, tile_type)(self._main_id, new_id, tile_name)
        self.tile_instances[new_id] = new_tile
        if len(new_tile.exports) > 0:
            if new_id not in self._pipe_dict:
                self._pipe_dict[new_id] = {}
            for export in new_tile.exports:
                self._pipe_dict[new_id][tile_name + "_" + export] = export
            distribute_event("RebuildTileForms", self._main_id)
        new_tile.start()
        self.current_tile_id += 1
        return new_tile

    def handle_exception(self, unique_message=None):
        error_string = str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        if unique_message is None:
            self.print_to_console(error_string, force_open=True)
        else:
            self.print_to_console(unique_message + " " + error_string, force_open=True)

    def print_to_console(self, message_string, force_open=False):
        self.emit_table_message("consoleLog", {"message_string": message_string, "force_open": force_open})

    def get_column_data(self, column_header):
        result = []
        for doc_name in self.doc_dict.keys():
            result = result + self.get_column_data_for_doc(column_header, doc_name)
        return result

    def get_column_data_for_doc(self, column_header, doc_name):
        the_rows = self.doc_dict[doc_name].all_sorted_data_rows
        result = []
        for the_row in the_rows:
            result.append(the_row[column_header])
        return result

    def get_matching_rows(self, filter_function, document_name):
        result = []
        if document_name is not None:
            for r in self.doc_dict[document_name].sorted_data_rows:
                if filter_function(r):
                    result.append(r)
        else:
            for doc in self.doc_dict.keys():
                for r in self.doc_dict[doc].sorted_data_rows:
                    if filter_function(r):
                        result.append(r)
        return result

    def unfilter_all_rows(self):
        for doc in self.doc_dict.values():
            doc.current_data_rows = doc.data_rows
            doc.configure_for_current_data()
        self.refill_table()


    def refill_table(self):
        doc = self.doc_dict[self.visible_doc_name]
        data_object = {}
        data_object["data_rows"] = doc.sorted_data_rows
        data_object["doc_name"] = self.visible_doc_name
        data_object["is_first_chunk"] = doc.is_first_chunk
        data_object["is_last_chunk"] = doc.is_last_chunk
        self.emit_table_message("refill_table", data_object)

    def display_matching_rows(self, filter_function, document_name=None):
        if document_name is not None:
            doc = self.doc_dict[document_name]
            doc.current_data_rows = {}
            for (key, val) in doc.data_rows.items():
                if filter_function(val):
                    doc.current_data_rows[key] = val
            doc.configure_for_current_data()
            self.refill_table()
        else:
            for doc in self.doc_dict.values():
                doc.current_data_rows = {}
                for (key, val) in doc.data_rows.items():
                    if filter_function(val):
                        doc.current_data_rows[key] = val
                doc.configure_for_current_data()
        self.refill_table()
        return

    def apply_to_rows(self, func, document_name=None):
        if document_name is not None:
            i = 0
            for r in self.doc_dict[document_name].sorted_data_rows:
                new_r = func(r)
                for (key, val) in new_r.items():
                    # self.doc_dict[document_name].data_rows[i][key] = val
                    self._set_cell_content(document_name, i, key, val, cellchange=False)
                i += 1
        else:
            for doc in self.doc_dict.keys():
                i = 0
                for r in self.doc_dict[doc].sorted_data_rows:
                    new_r = func(r)
                    for (key, val) in new_r.itesm():
                        # self.doc_dict[document_name].data_rows[i][key] = val
                        self._set_cell_content(doc, i, key, val, cellchange=False)
                    i += 1
        return

    def run(self):
        while not self._stopevent.isSet( ):
            if (not self._my_q.empty()):
                self.emit_table_message("startTableSpinner")
                q_item = self._my_q.get()
                self._handle_event(q_item["event_name"], q_item["data"])
            else:
                self.emit_table_message("stopTableSpinner")
            self._stopevent.wait(self._sleepperiod)

    def join(self, timeout=None):
        """ Stop the thread and wait for it to end. """
        self._stopevent.set()
        threading.Thread.join(self, timeout)

    def emit_table_message(self, message, data={}):
        data["message"] = message
        socketio.emit("table-message", data, namespace='/main', room=self._main_id)

    def _handle_event(self, event_name, data=None):
        try:
            if event_name == "CellChange":
                self._set_row_column_data(data["doc_name"], data["id"], data["column_header"], data["new_content"])
                self._change_list.append(data["id"])
            elif event_name == "RemoveTile":
                self._delete_tile_instance(data["tile_id"])
            elif event_name == "CreateColumn":
                self.add_blank_column(data["column_name"])
                distribute_event("RebuildTileForms", self._main_id)
            elif event_name == "SearchTable":
                self.highlight_table_text(data["text_to_find"])
            elif event_name == "FilterTable":
                self.filter_table_rows(data["text_to_find"])
            elif event_name == "DehighlightTable":
                self.dehighlight_all_table_text()
            elif event_name == "UnfilterTable":
                self.unfilter_all_rows()
            elif event_name == "ColorTextInCell":
                self.emit_table_message("colorTxtInCell", data)
            elif event_name == "SetCellContent":
                self._set_cell_content(data["doc_name"], data["id"], data["column_header"], data["new_content"], data["cellchange"])
            elif event_name == "TextSelect":
                self.selected_text = data["selected_text"]
            elif event_name == "SaveTableSpec":
                new_spec = data["tablespec"]
                self.doc_dict[new_spec["doc_name"]].table_spec = new_spec
        except:
            self.print_to_console("error in handle_event  " + self.__class__.__name__ +
                                 str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
        return

    def _set_cell_content(self, doc_name, id, column_header, new_content, cellchange=True):
        doc = self.doc_dict[doc_name]
        the_row = doc.data_rows[str(id)]
        old_content = the_row[column_header]
        if (new_content != old_content):
            data = {"doc_name": doc_name, "id": id, "column_header": column_header, "new_content": new_content, "old_content": old_content}

            # If cellchange is True then we use a CellChange event to handle any updates.
            # Otherwise just change things right here.
            if cellchange:
                distribute_event("CellChange", self._main_id, data)
            else:
                self._set_row_column_data(doc_name, id, column_header, new_content)
                self._change_list.append(id)
            if doc_name == self.visible_doc_name:
                self.emit_table_message("setCellContent", data)

    def _set_cell_background(self, doc_name, id, column_header, color):
        doc = self.doc_dict[doc_name]
        doc.set_background_color(id, column_header, color)
        if doc_name == self.visible_doc_name:
            actual_row = doc.get_actual_row(id)
            if actual_row is not None:
                data = {"row": actual_row,
                        "column_header": column_header,
                        "color": color}
                self.emit_table_message("setCellBackground", data)

    def highlight_table_text(self, txt):
        row_index = 0;
        dinfo = self.doc_dict[self.visible_doc_name]
        for the_row in dinfo.displayed_data_rows:
            for cheader in dinfo.header_list:
                cdata = the_row[cheader]
                if cdata is None:
                    continue
                if str(txt).lower() in str(cdata).lower():
                    self.emit_table_message("highlightTxtInCell",
                      {"row_index": row_index, "column_header": cheader, "text_to_find": txt})
            row_index += 1

    @staticmethod
    def txt_in_dict(txt, d):
        for val in d.values():
            if str(txt).lower() in str(val).lower():
                return True
        return False

    def filter_table_rows(self, txt):
        self.display_matching_rows(lambda r: self.txt_in_dict(txt, r))
        self.highlight_table_text(txt)

    def dehighlight_all_table_text(self):
        self.emit_table_message("dehiglightAllCells")

    def _build_doc_dict(self):
        result = {}
        try:
            the_collection = db[self.collection_name]
            for f in the_collection.find():
                if str(f["name"]) == "__metadata__":
                    continue;
                if "header_list" in f:
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], f["header_list"]) # Note conversion of unicode filenames to strings
                else:
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], [])
        except pymongo.errors.PyMongoError as err:
            print("There's a problem with the PyMongo database. ", err)
            return
        return result

    def _set_row_column_data(self, doc_name, id, column_header, new_content):
        the_row = self.doc_dict[doc_name].data_rows[str(id)][column_header] = new_content
        return

