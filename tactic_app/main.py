__author__ = 'bls910'

import Queue
import threading
import re
from tactic_app import db
from flask_login import current_user
import copy
import pymongo
import sys

from collections import OrderedDict
from shared_dicts import mainwindow_instances, distribute_event
from shared_dicts import tile_classes, user_tiles
from tiles import TileBase
from tactic_app import socketio
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
    def __init__(self, name, data_rows, header_list=None):
        self.name = name
        self.data_rows = data_rows
        self.signature_list = self._build_signature_list()
        self.header_list = header_list
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
        return ({"name": self.name, "data_rows": self.data_rows, "table_spec": self.table_spec, "my_class_for_recreate": "docInfo", "header_list": self.header_list})

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = docInfo(save_dict["name"], save_dict["data_rows"], save_dict["header_list"])
        new_instance.table_spec = save_dict["table_spec"]
        return new_instance

class mainWindow(threading.Thread):
    save_attrs = ["short_collection_name", "collection_name", "current_tile_id", "user_id", "doc_dict", "tile_instances", "project_name", "loaded_modules"]
    update_events = ["CellChange", "CreateColumn", "SearchTable", "SaveTableSpec",
                    "DehighlightTable", "SetFocusRowCellContent", "SetCellContent", "RemoveTile", "ColorTextInCell"]
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
        self._visible_doc_name = None
        self._pipe_dict = {}

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

    def get_sig_string_from_sig(self, sig):
        if type(sig) == str or type(sig) == unicode:
            return sig
        else:
            return "-".join(sig)

    def add_blank_column(self, column_name):
        for doc in self.doc_dict.values():
            doc.header_list.append(column_name)
            for r in doc.data_rows:
                r[column_name] = ""
            # We have to rebuild the signature list and dicts to include the new column
            doc.rebuild_vars()

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
        if (current_user.username in user_tiles) and (tile_type in user_tiles[current_user.username]):
            new_tile = user_tiles[current_user.username][tile_type](self._main_id, new_id, tile_name)
        else:
            new_tile = tile_classes[tile_type](self._main_id, new_id, tile_name)
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
        if event_name == "CellChange":
            self._set_row_column_data(data["doc_name"], data["row_index"], data["signature"], data["new_content"])
            self._change_list.append(data["row_index"])
        elif event_name == "RemoveTile":
            self._delete_tile_instance(data["tile_id"])
        elif event_name == "CreateColumn":
            self.add_blank_column(data["column_name"])
            distribute_event("RebuildTileForms", self._main_id)
        elif event_name == "SearchTable":
            self.highlight_table_text(data["text_to_find"])
        elif event_name == "DehighlightTable":
            self.dehighlight_all_table_text()
        elif event_name == "ColorTextInCell":
            print "About to emit colorTxtInCell"
            self.emit_table_message("colorTxtInCell", data)
        elif event_name == "SetCellContent":
            self._set_cell_content(data["doc_name"], data["row_index"], data["signature"], data["new_content"], data["cellchange"])
        elif event_name == "SaveTableSpec":
            new_spec = data["tablespec"]
            self.doc_dict[new_spec["doc_name"]].table_spec = new_spec
        return


    def _set_cell_content(self, doc_name, row_index, signature_string, new_content, cellchange=True):
        doc = self.doc_dict[doc_name]
        the_row = doc.data_rows[row_index]
        old_content = doc._get_data_for_signature(the_row, doc.ordered_sig_dict[signature_string])
        if (new_content != old_content):
            signature = doc.ordered_sig_dict[signature_string]
            data = {"doc_name": doc_name, "row_index": row_index, "signature": signature, "new_content": new_content}

            # If cellchange is True then we use a CellChange event to handle any updates.
            # Otherwise just change things right here.
            if cellchange:
                distribute_event("CellChange", self._main_id, data)
            else:
                self._set_row_column_data(doc_name, row_index, signature, new_content)
                self._change_list.append(row_index)
            if doc_name == self._visible_doc_name:
                self.emit_table_message("setCellContent", data)

    def highlight_table_text(self, txt):
        row_index = 0;
        dinfo = self.doc_dict[self._visible_doc_name]
        for the_row in dinfo.data_rows:
            for sig in dinfo.signature_list:
                if type(sig) != list:
                    sig = [sig]
                cdata = dinfo._get_data_for_signature(the_row, sig);
                if cdata is None:
                    continue
                if txt.lower() in cdata.lower():
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
                if "header_list" in f:
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], f["header_list"]) # Note conversion of unicode filenames to strings
                else:
                    result[str(f["name"])] = docInfo(str(f["name"]), f["data_rows"], [])
        except pymongo.errors.PyMongoError as err:
            print("There's a problem with the PyMongo database. ", err)
            return
        return result

    def _set_row_column_data(self, doc_name, row_index, sig, new_content):
        the_row = self.doc_dict[doc_name].data_rows[row_index]
        result = the_row
        if type(sig) is not list:
            result[sig] = new_content
            return
        for field in sig[0:-1]:
            if not field in result:
                result[field] = {}
            result = result[field]
        result[sig[-1]] = new_content
        return

