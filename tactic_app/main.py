__author__ = 'bls910'

import Queue
import threading
import re
from tactic_app import db
from flask_login import current_user
import copy
import pymongo

from collections import OrderedDict
from shared_dicts import mainwindow_instances
from shared_dicts import tile_classes, user_tiles
from tactic_app import socketio
current_main_id = 0

def distribute_event(event_name, main_id, data_dict=None, tile_id=None):
    mwindow = mainwindow_instances[main_id]
    if tile_id is not None:
        tile_instance = mwindow.tile_instances[tile_id]
        if event_name in tile_instance.update_events:
            tile_instance.post_event(event_name, data_dict)
    else:
        for tile_id, tile_instance in mwindow.tile_instances.items():
            if event_name in tile_instance.update_events:
                tile_instance.post_event(event_name, data_dict)
    if event_name in mwindow.update_events:
        mwindow.post_event(event_name, data_dict)

def create_new_mainwindow(user_id, collection_name):
    mw = mainWindow(user_id, collection_name)
    mainwindow_instances[mw.main_id] = mw
    mw.start()
    return mw.main_id

def create_new_mainwindow_from_project(project_dict):
    doc_dict = {}
    for (handle, doc_instance) in project_dict["doc_info_instances"].items():
        doc_dict[handle] = docInfo(doc_instance["name"], doc_instance["data_rows"])
        doc_dict[handle].table_spec = doc_instance["table_spec"]
    mw = mainWindow(project_dict["user_id"], project_dict["collection_name"], doc_dict)
    for (key, val) in project_dict.items():
        if not((key == "tile_instances") or (key == "doc_info_instances")):
            mw.__dict__[key] = val
    tile_dict = project_dict["tile_instances"]
    for (handle, tile_instance) in tile_dict.items():
        mw.create_tile_from_save(tile_instance, handle)
    # mw.doc_dict = doc_dict
    mainwindow_instances[mw.main_id] = mw
    mw.start()
    return mw.main_id

class docInfo():
    def __init__(self, name, data_rows):
        self.name = name
        self.data_rows = data_rows
        self.signature_list = self._build_signature_list()
        self.ordered_sig_dict = OrderedDict()
        for it in self.signature_list:
            self.ordered_sig_dict[self.get_sig_string_from_sig(it)] = it
        self.table_spec = {}

    def _build_signature_list(self):
        ddict = self.data_rows[0]
        result = []
        for (the_key, the_item) in ddict.items():
            if type(the_item) != dict:
                result.append(the_key)
            else:
                result += self._build_sig_step(the_item, [the_key])
        return result

    def rebuild_vars(self):
        self.signature_list = self._build_signature_list()
        self.ordered_sig_dict = OrderedDict()
        for it in self.signature_list:
            self.ordered_sig_dict[self.get_sig_string_from_sig(it)] = it

    def _build_sig_step(self, ddict, sofar):
        result = []
        for (the_key, the_item) in ddict.items():
            newsofar = copy.deepcopy(sofar)
            newsofar.append(the_key)
            if type(the_item) == dict:
                newsofar.append(self._build_sig_step(the_item, newsofar))
            result.append(newsofar)
        return result

    def get_sig_string_from_sig(self, sig):
        if type(sig) == str or type(sig) == unicode:
            return sig
        else:
            return "-".join(sig)

    @staticmethod
    def _get_data_for_signature(row, signature):
        if type(signature) is not list:
            return row[signature]
        result = row
        for field in signature:
            if not field in result:
                return ""
            result = result[field]
        return result

    def compile_save_dict(self):
        return ({"name": self.name, "data_rows": self.data_rows, "table_spec": self.table_spec})

class mainWindow(threading.Thread):
    def __init__(self, user_id, collection_name, doc_dict=None):
        global current_main_id
        self._stopevent = threading.Event()
        self._sleepperiod = .1
        threading.Thread.__init__(self)
        self._my_q = Queue.Queue(0)
        self.update_events = ["CellChange", "CreateColumn", "SearchTable", "SaveTableSpec",
                              "DehighlightTable", "SetFocusRowCellContent", "SetCellContent", "RemoveTile"]
        self.tile_instances = {}
        self.current_tile_id = 0
        self.collection_name = collection_name
        self.short_collection_name = re.sub("^.*?\.data_collection\.", "", collection_name) # This isn't used yet.
        self.main_id = str(current_main_id)
        self.user_id = user_id
        if doc_dict is None:
            self.doc_dict = self._build_doc_dict()
        else:
            self.doc_dict = doc_dict
        current_main_id += 1
        self.change_list = []
        self.visible_doc_name = None
        # self.cells_with_highlights = []

    @property
    def doc_names(self):
        return [str(key) for key in self.doc_dict.keys()]

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec: # This will be false if table_spec == {}
                tdict[key] = docinfo.table_spec
        return tdict


    @property
    def tile_ids(self):
        return self.tile_instances.keys()

    def get_sig_string_from_sig(self, sig):
        if type(sig) == str or type(sig) == unicode:
            return sig
        else:
            return "-".join(sig)

    def add_blank_column(self, column_name):
        for doc in self.doc_dict.values():
            for r in doc.data_rows:
                r[column_name] = ""
            # We have to rebuild the signature list and dicts to include the new column
            doc.rebuild_vars()

    def post_event(self, event_name, data=None):
        self._my_q.put({"event_name": event_name, "data": data})

    def create_tile_instance_in_mainwindow(self, tile_type, tile_name = None):
        new_id = "tile_id_" + str(self.current_tile_id)
        # The user version of a tile should take precedence if both exist
        if tile_type in user_tiles[current_user.username]:
            new_tile = user_tiles[current_user.username][tile_type](self.main_id, new_id, tile_name)
        else:
            new_tile = tile_classes[tile_type](self.main_id, new_id, tile_name)
        self.tile_instances[new_id] = new_tile
        new_tile.start()
        self.current_tile_id += 1
        return new_tile

    def create_tile_from_save(self, tile_save, id):
        new_tile = tile_classes[tile_save["tile_type"]](self.main_id, id)
        for (key, val) in tile_save.items():
            new_tile.__dict__[key] = val
        self.tile_instances[id] = new_tile
        new_tile.start()

    def compile_save_dict(self):
        result = {}
        for (attr, val) in self.__dict__.items():
            if not ((attr.startswith("_")) or (attr == "tile_instances")
                    or (attr == "doc_dict") or (str(type(val)) == "<type 'instance'>")):
                result[attr] = val
        tile_instance_saves = {}
        for (tile_handle, tile_instance) in self.tile_instances.items():
            tile_instance_saves[tile_handle] = tile_instance.compile_save_dict()
        result["tile_instances"] = tile_instance_saves
        doc_info_saves = {}
        for (doc_handle, doc_instance) in self.doc_dict.items():
            doc_info_saves[doc_handle] = doc_instance.compile_save_dict()
        result["doc_info_instances"] = doc_info_saves

        return result

    def get_column_data(self, signature):
        result = {}
        for (doc_name, doc) in self.doc_dict.items():
            result[doc_name] = self.get_column_data_for_doc(signature, doc)
        return result

    def get_column_data_for_doc(self, signature, doc):
        the_rows = doc.data_rows
        result = []
        for the_row in the_rows:
            result.append(doc._get_data_for_signature(the_row, doc.ordered_sig_dict[signature]))
        return result

    def run(self):
        while not self._stopevent.isSet( ):
            if (not self._my_q.empty()):
                q_item = self._my_q.get()
                self._handle_event(q_item["event_name"], q_item["data"])
            self._stopevent.wait(self._sleepperiod)

    def join(self, timeout=None):
        """ Stop the thread and wait for it to end. """
        self._stopevent.set()
        threading.Thread.join(self, timeout)

    def emit_table_message(self, message, data={}):
        data["message"] = message
        socketio.emit("table-message", data, namespace='/main', room=self.main_id)

    def _handle_event(self, event_name, data=None):
        if event_name == "CellChange":
            self._set_row_column_data(data["doc_name"], data["row_index"], data["signature"], data["new_content"])
            self.change_list.append(data["row_index"])
        elif event_name == "RemoveTile":
            del self.tile_instances[data["tile_id"]]
        elif event_name == "CreateColumn":
            self.add_blank_column(data["column_name"])
        elif event_name == "SearchTable":
            self.highlight_table_text(data["text_to_find"])
        elif event_name == "DehighlightTable":
            self.dehighlight_all_table_text()
        elif event_name == "SetCellContent":
            self._set_cell_content(data["doc_name"], data["row_index"], data["signature"], data["new_content"])
        elif event_name == "SaveTableSpec":
            new_spec = data["tablespec"]
            self.doc_dict[new_spec["doc_name"]].table_spec = new_spec
        return

    def _set_cell_content(self, doc_name, row_index, signature_string, new_content):
        doc = self.doc_dict[doc_name]
        the_row = doc.data_rows[row_index]
        old_content = doc._get_data_for_signature(the_row, doc.ordered_sig_dict[signature_string])
        if (new_content != old_content):
            signature = doc.ordered_sig_dict[signature_string]
            data = {"doc_name": doc_name, "row_index": row_index, "signature": signature, "new_content": new_content}
            distribute_event("CellChange", self.main_id, data)
            if doc_name == self.visible_doc_name:
                self.emit_table_message("setCellContent", data)

    def highlight_table_text(self, txt):
        row_index = 0;
        dinfo = self.doc_dict[self.visible_doc_name]
        for the_row in dinfo.data_rows:
            for sig in dinfo.signature_list:
                if type(sig) != list:
                    sig = [sig]
                cdata = dinfo._get_data_for_signature(the_row, sig);
                if cdata is None:
                    continue
                if txt in cdata:
                    self.emit_table_message("highlightTxtInCell",
                      {"row_index": row_index, "signature": sig, "text_to_find": txt})
            row_index += 1

    def dehighlight_all_table_text(self):
        self.emit_table_message("dehiglightAllCells")

    def _build_signature_list(self):
        ddict = self.doc_dict["data_rows"][0]
        result = []
        for (the_key, the_item) in ddict.items():
            if type(the_item) != dict:
                result.append(the_key)
            else:
                result += self._build_sig_step(the_item, [the_key])
        return result

    def _build_sig_step(self, ddict, sofar):
        result = []
        for (the_key, the_item) in ddict.items():
            newsofar = copy.deepcopy(sofar)
            newsofar.append(the_key)
            if type(the_item) == dict:
                newsofar.append(self._build_sig_step(the_item, newsofar))
            result.append(newsofar)
        return result


    def _build_doc_dict(self):
        result = {}
        try:
            the_collection = db[self.collection_name]
            for f in the_collection.find():
                result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"]) # Note conversion of unicode filenames to strings
        except pymongo.errors.PyMongoError as err:
            print("There's a problem with the PyMongo database. ", err)
            return
        return result

    def _set_row_column_data(self, doc_name, row_index, sig, new_content):
        the_row = self.doc_dict[doc_name].data_rows[row_index]
        result = the_row
        for field in sig[0:-1]:
            if not field in result:
                result[field] = {}
            result = result[field]
        result[sig[-1]] = new_content

