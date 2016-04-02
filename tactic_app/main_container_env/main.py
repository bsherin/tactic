import sys
import re
# noinspection PyUnresolvedReferences
import requests
import copy
import gevent
from flask import render_template
from gevent.queue import Queue
import pymongo
import gridfs

INITIAL_LEFT_FRACTION = .69
CHUNK_SIZE = 200
STEP_SIZE = 100

# noinspection PyProtectedMember
# def create_new_mainwindow(user_id, collection_name):
#     mw = mainWindow(user_id, collection_name)
#     mainwindow_instances[mw._main_id] = mw
#     mw.start()
#     return mw._main_id

# todo create_new_mainwindow_from_project
# noinspection PyProtectedMember
# def create_new_mainwindow_from_project(project_dict):
#     mw = mainWindow.recreate_from_save(project_dict)
#     mw.mdata = project_dict["metadata"]
#     mainwindow_instances[mw.main_id] = mw
#     mw.start()
#     return mw.main_id


# def delete_mainwindow(main_id):
#     for tile_id, tile in mainwindow_instances[main_id].tile_instances.values():
#         tile.kill()
#         del mainwindow_instances[main_id].tile_instances[key]
#     # I think this is happening from within the greenlet that I'm closing.
#     # So I have to do the join at the very end
#     mainwindow_instances[main_id].kill()
#     del mainwindow_instances[main_id]


# noinspection PyPep8Naming
class docInfo:
    def __init__(self, name, data_rows, header_list=None, cell_backgrounds=None):
        self.name = name
        self.data_rows = data_rows  # All the data rows in the doc
        self.current_data_rows = data_rows  # The current filtered set of data rows
        self.header_list = header_list
        self.table_spec = {}
        self.start_of_current_chunk = None
        self.is_first_chunk = None
        self.infinite_scroll_required = None
        self.is_last_chunk = None
        if cell_backgrounds is None:
            self.cell_backgrounds = {}
        else:
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
        result = {}
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        for i, r in enumerate(sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + CHUNK_SIZE)]):
            if str(r) in self.cell_backgrounds:
                result[i] = self.cell_backgrounds[str(r)]
        return result

    def configure_for_current_data(self):
        self.start_of_current_chunk = 0
        self.is_first_chunk = True
        if len(self.current_data_rows.keys()) <= CHUNK_SIZE:
            self.infinite_scroll_required = False
            self.is_last_chunk = True
        else:
            self.infinite_scroll_required = True
            self.is_last_chunk = False
    def get_actual_row(self, row_id):
        for i, the_row in enumerate(self.displayed_data_rows):
            if str(row_id) == str(the_row["__id__"]):
                return i
        return None

    def compile_save_dict(self):
        return ({"name": self.name,
                 "data_rows": self.data_rows,
                 "table_spec": self.table_spec,
                 "cell_backgrounds": self.cell_backgrounds,
                 "my_class_for_recreate": "docInfo",
                 "header_list": self.header_list})

    def get_id_from_actual_row(self, actual_row):
        return self.sorted_data_rows[actual_row]["__id__"]

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

    def row_is_visible(self, row_id):
        sorted_int_keys = sorted([int(key) for key in self.current_data_rows.keys()])
        displayed_int_keys = sorted_int_keys[self.start_of_current_chunk:(self.start_of_current_chunk + STEP_SIZE)]
        return int(row_id) in displayed_int_keys

    def move_to_row(self, row_id):
        self.current_data_rows = self.data_rows  # Undo any filtering
        self.configure_for_current_data()
        while not self.is_last_chunk and not(self.row_is_visible(row_id)):
            self.advance_to_next_chunk()

    def go_to_previous_chunk(self):
        if self.is_first_chunk:
            return None
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
        new_instance = docInfo(save_dict["name"],
                               save_dict["data_rows"],
                               save_dict["header_list"],
                               save_dict["cell_backgrounds"])
        new_instance.table_spec = save_dict["table_spec"]
        return new_instance


# noinspection PyPep8Naming
class mainWindow(gevent.Greenlet):
    save_attrs = ["short_collection_name", "collection_name", "current_tile_id", "tile_sort_list", "left_fraction",
                  "is_shrunk", "user_id", "doc_dict", "tile_instances", "project_name", "loaded_modules",
                  "hidden_columns_list", "_main_id", "console_html"]
    update_events = ["CellChange", "CreateColumn", "SearchTable", "SaveTableSpec", "MainClose", "DisplayCreateErrors",
                     "DehighlightTable", "SetCellContent", "RemoveTile", "ColorTextInCell",
                     "FilterTable", "UnfilterTable", "TextSelect", "UpdateSortList", "UpdateLeftFraction",
                     "UpdateTableShrinkState"]

    def __init__(self, app, collection_name, main_container_id, host_address, loaded_user_modules, mongo_uri, doc_dict=None):
        self._my_q = Queue()
        gevent.Greenlet.__init__(self)
        self._sleepperiod = .0001
        self.main_id = main_container_id
        self.host_address = host_address
        self.app = app

        # These are the main attributes that define a project state
        self.tile_instances = {}
        self.tile_sort_list = []
        self.left_fraction = INITIAL_LEFT_FRACTION
        self.is_shrunk = False
        self.collection_name = collection_name
        self.short_collection_name = re.sub("^.*?\.data_collection\.", "", collection_name)
        self.project_name = None
        self.console_html = None

        # These are working attributes that will change whenever the project is instantiated.
        self.current_tile_id = 0
        self._change_list = []
        self.visible_doc_name = None
        self._pipe_dict = {}
        self.selected_text = ""
        self.recreate_errors = []
        self.loaded_user_modules = set(loaded_user_modules)
        try:
            client = pymongo.MongoClient(mongo_uri)
            client.server_info()
            self.db = client.heroku_4ncbq1zd
            self.fs = gridfs.GridFS(self.db)
        except pymongo.errors.PyMongoError as err:
            sys.exit()
        self.doc_dict = self._build_doc_dict()

    def ask_tile(self, tile_id, request_name, data_dict=None):
        if data_dict is None:
            data_dict = {}
        taddress = self.tile_instances[tile_id]
        result = requests.post("http://{0}:5000/{1}".format(taddress, request_name), json=data_dict)
        return result

    def ask_host(self, request_name, data_dict=None):
        if data_dict is None:
            data_dict = {}
        result = requests.post("http://{0}:5000/{1}".format(self.host_address, request_name), json=data_dict)
        return result

    def post_tile_event(self, tile_id, event_name, data_dict=None):
        if data_dict is None:
            data_dict = {}
        taddress = self.tile_instances[tile_id]
        ddict = copy.copy(data_dict)
        ddict["event_name"] = event_name
        requests.post("http://{0}:5000/{1}".format(taddress, "post_event"), json=data_dict)

    def emit_table_message(self, message, data=None):
        if data is None:
            data = {}
        data["message"] = message
        return requests.post("http://{0}:5000"/{1}/{2}.format(self.host_address, "emit_table_message", self.main_id), json=data)

    def distribute_event(self, event_name, data_dict=None, tile_id=None):
        if data_dict is None:
            data_dict = {}
        try:
            if tile_id is not None:
                self.post_tile_event(tile_id, event_name, data_dict)
            else:
                for tile_id in self.tile_instances.keys():
                    self.post_tile_event(tile_id, event_name, data_dict)
            if event_name in self.update_events:
                self.post_event(event_name, data_dict)
            return True
        except:
            self.handle_exception("Error distributing event " + event_name)
            return False

    def compile_save_dict(self):
        result = {}
        for attr in self.save_attrs:
            attr_val = getattr(self, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif (type(attr_val) == dict) and(len(attr_val) > 0) and hasattr(attr_val.values()[0], "compile_save_dict"):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                result[attr] = attr_val
        return result

    @staticmethod
    def recreate_from_save(app, save_dict):
        new_instance = mainWindow(app, save_dict["data_collection_name"], save_dict["main_container_id"], save_dict["host_addres"])
        error_messages = []
        for (attr, attr_val) in save_dict.items():
            try:
                if type(attr_val) == dict and ("my_class_for_recreate" in attr_val):
                    cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                    setattr(new_instance, attr, cls.recreate_from_save(attr_val))
                elif (type(attr_val) == dict) and (len(attr_val) > 0) and \
                        ("my_class_for_recreate" in attr_val.values()[0]):
                    cls = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                    res = {}
                    for (key, val) in attr_val.items():
                        tinstance = cls.recreate_from_save(val)
                        if tinstance is not None:
                            res[key] = tinstance
                        else:
                            error_messages.append("error creating tile {}".format(key))
                    setattr(new_instance, attr, res)
                else:
                    setattr(new_instance, attr, attr_val)
            except TypeError:
                setattr(new_instance, attr, attr_val)
        for tile in new_instance.tile_sort_list:
            if not tile in new_instance.tile_instances:
                new_instance.tile_sort_list.remove(tile)

        # There's some extra work I have to do once all of the tiles are built.
        # Each tile needs to know the main_id it's associated with.
        # Also I have to build the pipe machinery.
        for tile in new_instance.tile_instances.values():
            if len(tile.exports) > 0:
                if tile.tile_id not in new_instance._pipe_dict:
                    new_instance._pipe_dict[tile.tile_id] = {}
                for export in tile.exports:
                    new_instance._pipe_dict[tile.tile_id][tile.tile_name + "_" + export] = export
            tile.start()
        new_instance.recreate_errors = error_messages
        return new_instance

    @property
    def doc_names(self):
        return sorted([str(key) for key in self.doc_dict.keys()])

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec:  # This will be false if table_spec == {}
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
        self.tile_sort_list.remove(tile_id)
        if tile_id in self._pipe_dict:
            del self._pipe_dict[tile_id]
            self.distribute_event("RebuildTileForms")
        return

    def create_tile_instance_in_mainwindow(self, tile_container_address, tile_container_id, tile_name=None):
        # new_id = "tile_id_" + str(self.current_tile_id)
        # The user version of a tile should take precedence if both exist
        # new_tile = get_tile_class(current_user.username, tile_type)(self._main_id, new_id, tile_name)
        self.tile_instances[tile_container_id] = tile_container_address

        # todo tile_request get_tile_expeort
        exports = self.ask_tile(tile_container_id, "get_tile_exports")
        if len(exports) > 0:
            if tile_container_id not in self._pipe_dict:
                self._pipe_dict[tile_container_id] = {}
            for export in tile_container_id.exports:
                self._pipe_dict[tile_container_id][tile_name + "_" + export] = export
            self.distribute_event("RebuildTileForms")
        self.tile_sort_list.append(tile_container_id)
        self.current_tile_id += 1
        return

    def handle_exception(self, unique_message=None):
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        if unique_message is None:
            self.print_to_console(error_string, force_open=True)
        else:
            self.print_to_console(unique_message + " " + error_string, force_open=True)

    # todo xxx here is where I am. this template wasn't found
    # Note that this will be a trial of emit_table_message
    def print_to_console(self, message_string, force_open=False):
        with self.app.test_request_context():
            pmessage = render_template("log_item.html", log_item=message_string)
        self.emit_table_message("consoleLog", {"message_string": pmessage, "force_open": force_open})

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
        data_object = {"data_rows": doc.displayed_data_rows, "doc_name": self.visible_doc_name,
                       "background_colors": doc.displayed_background_colors,
                       "is_first_chunk": doc.is_first_chunk, "is_last_chunk": doc.is_last_chunk}
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

    def _run(self):
        self.running = True
        while self.running:
            if not self._my_q.empty():
                self.emit_table_message("startTableSpinner")
                q_item = self._my_q.get()
                self._handle_event(q_item["event_name"], q_item["data"])
            else:
                self.emit_table_message("stopTableSpinner")
            self.table_yield()

    def table_yield(self):
        gevent.sleep(self._sleepperiod)

    def _handle_event(self, event_name, data=None):
        # noinspection PyBroadException
        try:
            if event_name == "CellChange":
                self._set_row_column_data(data["doc_name"], data["id"], data["column_header"], data["new_content"])
                self._change_list.append(data["id"])
            elif event_name == "BuildDocDict":
                self.doc_dict = self._build_doc_dict(self.collection_name)
            elif event_name == "RemoveTile":
                self._delete_tile_instance(data["tile_id"])
            elif event_name == "CreateColumn":
                self.add_blank_column(data["column_name"])
                self.distribute_event("RebuildTileForms")
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
                self._set_cell_content(data["doc_name"], data["id"], data["column_header"],
                                       data["new_content"], data["cellchange"])
            elif event_name == "TextSelect":
                self.selected_text = data["selected_text"]
            elif event_name == "SaveTableSpec":
                new_spec = data["tablespec"]
                self.doc_dict[new_spec["doc_name"]].table_spec = new_spec
            elif event_name == "UpdateSortList":
                self.tile_sort_list = data["sort_list"]
            elif event_name == "UpdateLeftFraction":
                self.left_fraction = data["left_fraction"]
            elif event_name == "UpdateTableShrinkState":
                self.is_shrunk = data["is_shrunk"]
            elif event_name == "DisplayCreateErrors":
                for msg in self.recreate_errors:
                    self.print_to_console(msg, True)
                self.recreate_errors = []
        except:
            self.print_to_console("error in handle_event  " + self.__class__.__name__ +
                                  str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]), force_open=True)
        return

    def _set_cell_content(self, doc_name, the_id, column_header, new_content, cellchange=True):
        doc = self.doc_dict[doc_name]
        the_row = doc.data_rows[str(the_id)]
        old_content = the_row[column_header]
        if new_content != old_content:
            data = {"doc_name": doc_name, "id": the_id, "column_header": column_header,
                    "new_content": new_content, "old_content": old_content}

            # If cellchange is True then we use a CellChange event to handle any updates.
            # Otherwise just change things right here.
            if cellchange:
                self.distribute_event("CellChange", data)
            else:
                self._set_row_column_data(doc_name, the_id, column_header, new_content)
                self._change_list.append(the_id)
            if doc_name == self.visible_doc_name:
                doc = self.doc_dict[doc_name]
                actual_row = doc.get_actual_row(the_id)
                if actual_row is not None:
                    data["row"] = actual_row
                    self.emit_table_message("setCellContent", data)

    def _set_cell_background(self, doc_name, the_id, column_header, color):
        doc = self.doc_dict[doc_name]
        doc.set_background_color(the_id, column_header, color)
        if doc_name == self.visible_doc_name:
            actual_row = doc.get_actual_row(the_id)
            if actual_row is not None:
                data = {"row": actual_row,
                        "column_header": column_header,
                        "color": color}
                self.emit_table_message("setCellBackground", data)

    def highlight_table_text(self, txt):
        row_index = 0
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
            the_collection = self.db[self.collection_name]
            for f in the_collection.find():
                if str(f["name"]) == "__metadata__":
                    continue
                if "header_list" in f:
                    # Note conversion of unicode filenames to strings
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], f["header_list"])
                else:
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], [])
        except:
            return
        return result

    def _set_row_column_data(self, doc_name, the_id, column_header, new_content):
        _ = self.doc_dict[doc_name].data_rows[str(the_id)][column_header] = new_content
        return
