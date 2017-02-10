import sys
import re
# noinspection PyUnresolvedReferences
import requests
import copy
from gevent import monkey; monkey.patch_all()
from flask import render_template
import pymongo
import gridfs
import cPickle
from bson.binary import Binary
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy
import datetime
# noinspection PyUnresolvedReferences
from communication_utils import send_request_to_container
import traceback
import zlib
import os
import uuid


# getting environment variables
INITIAL_LEFT_FRACTION = .69
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))
if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60

PROTECTED_METADATA_KEYS = ["_id", "file_id", "name", "my_class_for_recreate", "table_spec", "data_text", "length",
                           "data_rows", "header_list", "number_of_rows"]


class DocInfoAbstract(object):
    def __init__(self, f):
        self.name = f["name"]
        self.table_spec = {}
        self.metadata = None
        return

    def compile_metadata(self, f):
        mdata = {"name": self.name}
        for key, val in f.items():
            if key not in PROTECTED_METADATA_KEYS:
                mdata[key] = val
        return mdata

    def set_additional_metadata(self, mdict):
        for k, d in mdict.items():
            if k not in PROTECTED_METADATA_KEYS:
                self.metadata[k] = d
        return

    @property
    def additional_metadata(self):
        result = {"name": self.name}
        for k, val in self.metadata.items():
            if k not in PROTECTED_METADATA_KEYS:
                result[k] = val
        return result

    def compile_save_dict(self):
        result = {"name": self.name,
                  "table_spec": self.table_spec}
        result.update(self.additional_metadata)
        return result


class FreeformDocInfo(DocInfoAbstract):

    def __init__(self, f, data_text=None):
        DocInfoAbstract.__init__(self, f)
        if data_text is None:
            self.data_text = f["data_text"]
        else:
            self.data_text = data_text
        self.metadata = self.compile_metadata(f)

    def compile_metadata(self, f):
        mdata = DocInfoAbstract.compile_metadata(self, f)
        mdata.update({"length": len(self.data_text)})
        return mdata

    def compile_save_dict(self):
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_text": self.data_text,
                       "my_class_for_recreate": "FreeformDocInfo"})
        return result

    @property
    def all_data(self):
        return self.data_text

    @property
    def all_sorted_data_rows(self):
        return self.data_text.splitlines()

    @property
    def number_of_rows(self):
        return len(self.data_text.splitlines())

    def get_row(self, line_number):
        return self.all_sorted_data_rows[line_number]

    def get_actual_row(self, row_id):
        return row_id

    @staticmethod
    def recreate_from_save(save_dict):
        new_instance = FreeformDocInfo(save_dict)
        new_instance.table_spec = save_dict["table_spec"]
        return new_instance


# noinspection PyPep8Naming
class docInfo(DocInfoAbstract):
    def __init__(self, f):
        DocInfoAbstract.__init__(self, f)
        self.data_rows = copy.deepcopy(f["data_rows"])  # All the data rows in the doc
        self.current_data_rows = self.data_rows  # The current filtered set of data rows
        # Get rid of any duplicate headers without changing the order
        self.header_list = []
        if "header_list" in f:
            for h in f["header_list"]:
                if h not in self.header_list:
                    self.header_list.append(h)

        self.start_of_current_chunk = None
        self.is_first_chunk = None
        self.infinite_scroll_required = None
        self.is_last_chunk = None
        if "cell_backgrounds" in f:
            self.cell_backgrounds = f["cell_backgrounds"]
        else:
            self.cell_backgrounds = {}

        self.configure_for_current_data()
        if len(self.data_rows.keys()) > CHUNK_SIZE:
            self.max_table_size = CHUNK_SIZE
        else:
            self.max_table_size = len(self.data_rows.keys())
        self.metadata = self.compile_metadata(f)

    def compile_metadata(self, f):
        mdata = DocInfoAbstract.compile_metadata(self, f)
        mdata.update({"number_of_rows": len(f["data_rows"].keys()),
                      "header_list": f["header_list"]})
        return mdata

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

    @property
    def number_of_rows(self):
        return len(self.data_rows.keys())

    def get_row(self, row_id):
        return self.data_rows_int_keys[int(row_id)]

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
        result = DocInfoAbstract.compile_save_dict(self)
        result.update({"data_rows": self.data_rows,
                       "cell_backgrounds": self.cell_backgrounds,
                       "my_class_for_recreate": "docInfo",
                       "header_list": self.header_list})
        return result

    def get_id_from_actual_row(self, actual_row):
        return self.sorted_data_rows[actual_row]["__id__"]

    @property
    def all_data(self):
        return self.data_rows

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
        self.start_of_current_chunk += STEP_SIZE
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
        self.start_of_current_chunk -= STEP_SIZE
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
        new_instance = docInfo(save_dict)
        new_instance.table_spec = save_dict["table_spec"]
        return new_instance


# noinspection PyPep8Naming,PyUnusedLocal
class mainWindow(QWorker):
    save_attrs = ["short_collection_name", "collection_name", "current_tile_id", "tile_sort_list", "left_fraction",
                  "is_shrunk", "doc_dict", "project_name", "loaded_modules", "user_id",
                  "hidden_columns_list", "console_html", "console_cm_code", "doc_type", "purgetiles"]
    update_events = ["CellChange", "FreeformTextChange", "CreateColumn", "SearchTable", "SaveTableSpec", "MainClose",
                     "DisplayCreateErrors", "DehighlightTable", "SetCellContent", "RemoveTile", "ColorTextInCell",
                     "FilterTable", "UnfilterTable", "TextSelect", "UpdateSortList", "UpdateLeftFraction",
                     "UpdateTableShrinkState"]

    # noinspection PyUnresolvedReferences
    def __init__(self, app, data_dict):
        QWorker.__init__(self, app, data_dict["megaplex_address"], data_dict["main_id"])
        print "entering mainwindow_init"
        try:
            client = pymongo.MongoClient(data_dict["mongo_uri"], serverSelectionTimeoutMS=10)
            client.server_info()
            # noinspection PyUnresolvedReferences
            self.db = client.tacticdb
            self.fs = gridfs.GridFS(self.db)
        except:
            error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            self.debug_log("error getting pymongo client: " + error_string)
            sys.exit()

        self.base_figure_url = data_dict["base_figure_url"]
        self.project_collection_name = data_dict["project_collection_name"]

        # These are the main attributes that define a project state

        self.callbacks = {}

        # These are working attributes that will change whenever the project is instantiated.

        self._change_list = []
        self.visible_doc_name = None
        self._pipe_dict = {}
        self.selected_text = ""
        self.recreate_errors = []
        self.project_dict = None
        self.tile_save_results = None
        self.mdata = None
        self.pseudo_tile_id = None
        self.pseudo_tile_address = None
        self.hidden_columns_list = None
        self.loaded_modules = None

        if "project_name" not in data_dict:
            print "determined not a project"
            self.doc_type = data_dict["doc_type"]
            print "doc type is " + self.doc_type
            self.current_tile_id = 0
            self.tile_instances = {}
            self.tile_sort_list = []
            self.left_fraction = INITIAL_LEFT_FRACTION
            self.is_shrunk = False
            self.collection_name = data_dict["collection_name"]
            print "collection_name is " + self.collection_name
            self.short_collection_name = re.sub("^.*?\.data_collection\.", "", self.collection_name)
            self.project_name = None
            self.console_html = None
            self.console_cm_code = {}
            self.user_id = data_dict["user_id"]
            self.doc_dict = self._build_doc_dict()
            self.visible_doc_name = self.doc_dict.keys()[0]
            self.purgetiles = False
        print "done with init"

    # Communication Methods

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def ask_tile(self, tile_id, msg_type, task_data=None, callback_func=None):
        self.post_task(tile_id, msg_type, task_data, callback_func)
        return

    def emit_table_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["table_message"] = message
        self.ask_host("emit_table_message", data, callback_func)
        return

    def distribute_event(self, event_name, data_dict=None, tile_id=None):
        if data_dict is None:
            data_dict = {}
        if tile_id is not None:
            self.ask_tile(tile_id, event_name, data_dict)
        else:
            for tile_id in self.tile_instances.keys():
                self.ask_tile(tile_id, event_name, data_dict)
        if event_name in self.update_events:
            self.post_task(self.my_id, event_name, data_dict)
        return True

    # Save and load-related methods

    def compile_save_dict(self):
        result = {}
        for attr in self.save_attrs:
            if attr == "hidden_columns_list" and self.doc_type == "freeform":
                continue
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
        tile_instances = {}
        for tile_id in self.tile_instances.keys():
            tile_save_dict = self.post_and_wait(tile_id, "compile_save_dict")
            tile_instances[tile_id] = tile_save_dict  # tile_id isn't meaningful going forward.
        result["tile_instances"] = tile_instances
        if self.purgetiles:
            used_modules = []
            for tile_id in self.tile_instances.keys():
                tile_type = self.get_tile_property(tile_id, "tile_type")
                data = {"tile_type": tile_type, "user_id": self.user_id}
                module_name = self.post_and_wait("host", "get_module_from_tile_type", data)["module_name"]
                if module_name is not None:
                    used_modules.append(module_name)
            result["loaded_modules"] = used_modules
        return result

    def show_um_message(self, message, user_manage_id, timeout=None):
        data = {"message": message, "timeout": timeout, "user_manage_id": user_manage_id}
        self.post_task("host", "show_um_status_message_task", data)

    def clear_um_message(self, user_manage_id):
        data = {"user_manage_id": user_manage_id}
        self.post_task("host", "clear_um_status_message_task", data)

    def show_main_status_message(self, message, timeout=None):
        data = {"message": message, "timeout": timeout, "main_id": self.my_id}
        self.post_task("host", "show_main_status_message", data)

    def clear_main_status_message(self):
        data = {"main_id": self.my_id}
        self.post_task("host", "clear_main_status_message", data)

    @task_worthy
    def do_full_recreation(self, data_dict):
        tile_containers = {}
        try:
            print "Entering do_full_recreation"
            self.show_um_message("Entering do_full_recreation", data_dict["user_manage_id"])
            tile_info_dict, loaded_modules = self.recreate_from_save(data_dict["project_collection_name"],
                                                                     data_dict["project_name"])
            self.post_and_wait("host", "load_modules",
                               {"loaded_modules": loaded_modules, "user_id": data_dict["user_id"]})
            doc_names = [str(doc_name) for doc_name in self.doc_names]

            self.show_um_message("Getting tile code", data_dict["user_manage_id"])
            tile_code_dict = self.post_and_wait("host", "get_tile_code", {"tile_info_dict": tile_info_dict,
                                                                          "user_id": data_dict["user_id"]})
            self.show_um_message("Checking tile Code", data_dict["user_manage_id"])
            for old_tile_id in tile_code_dict.keys():
                if tile_code_dict[old_tile_id] is None:
                    self.recreate_errors.append("problem getting tile code for " +
                                                tile_info_dict[old_tile_id] + "\n")
                    del tile_info_dict[old_tile_id]
                    del tile_code_dict[old_tile_id]
            self.show_um_message("Creating empty containers", data_dict["user_manage_id"])
            tile_containers = self.post_and_wait("host", "get_empty_tile_containers",
                                                 {"number": len(tile_info_dict.keys()),
                                                  "user_id": data_dict["user_id"]})
            new_tile_info = {}
            new_tile_keys = tile_containers.keys()
            error_messages = ""
            for i, old_tile_id in enumerate(tile_info_dict.keys()):
                new_id = new_tile_keys[i]
                new_address = tile_containers[new_tile_keys[i]]
                new_tile_info[old_tile_id] = {"new_tile_id": new_id,
                                              "tile_container_address": new_address}

                result = send_request_to_container(new_address, "load_source",
                                                   {"tile_code": tile_code_dict[old_tile_id],
                                                    "megaplex_address": self.megaplex_address}).json()
                if not result["success"]:
                    self.recreate_errors.append("problem loading source into container for "
                                                "{}: {}".format(tile_info_dict[old_tile_id], result["message_string"]))
                    self.ask_host("delete_container", {"container_id": new_id})
                    del new_tile_info[old_tile_id]
                    del tile_info_dict[old_tile_id]
                    del tile_code_dict[old_tile_id]
                    del self.project_dict["tile_instances"][old_tile_id]
                    # raise Exception(result["message_string"])
            self.show_um_message("Recreating the tiles", data_dict["user_manage_id"])
            # Note data_dict has class, function, and list_names
            errors, self.tile_save_results = self.recreate_project_tiles(data_dict, new_tile_info)
            for tid, error in errors.items():
                print "problem recreating tile for {}: {}".format(tile_info_dict[tid], error)
                self.recreate_errors.append("problem recreating tile for "
                                            "{}: {}".format(tile_info_dict[tid], error))
                self.ask_host("delete_container", {"container_id": new_tile_info[tid]["new_tile_id"]})
                del new_tile_info[tid]
                del tile_info_dict[tid]
                del tile_code_dict[tid]
                del self.project_dict["tile_instances"][tid]

            template_data = {"collection_name": self.collection_name,
                             "project_name": self.project_name,
                             "window_title": self.project_name,
                             "main_id": self.my_id,
                             "doc_names": doc_names,
                             "use_ssl": str(data_dict["use_ssl"]),
                             "console_html": self.console_html,
                             "short_collection_name": self.short_collection_name,
                             "new_tile_info": new_tile_info}

            self.clear_um_message(data_dict["user_manage_id"])
            self.post_task("host", "open_project_window", {"user_manage_id": data_dict["user_manage_id"],
                                                           "template_data": template_data,
                                                           "message": "window-open",
                                                           "doc_type": self.doc_type})
        except Exception as ex:
            container_list = [self.my_id] + tile_containers.keys()
            self.ask_host("delete_container_list", {"container_list": container_list})
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            error_string = "<pre>" + error_string + "</pre>"
            self.post_task("host", "open_error_window", {"user_manage_id": data_dict["user_manage_id"],
                                                         "error_string": error_string})
        return

    def recreate_from_save(self, project_collection_name, project_name):
        save_dict = self.db[project_collection_name].find_one({"project_name": project_name})
        project_dict = cPickle.loads(zlib.decompress(self.fs.get(save_dict["file_id"]).read()).decode("utf-8", "ignore").encode("ascii"))
        project_dict["metadata"] = save_dict["metadata"]
        self.mdata = save_dict["metadata"]
        error_messages = []
        if "doc_type" not in project_dict:  # This is for backward compatibility
            project_dict["doc_type"] = "table"
        for (attr, attr_val) in project_dict.items():
            if str(attr) != "tile_instances":
                try:
                    if type(attr_val) == dict and ("my_class_for_recreate" in attr_val):
                        cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                        setattr(self, attr, cls.recreate_from_save(attr_val))
                    elif (type(attr_val) == dict) and (len(attr_val) > 0) and \
                            ("my_class_for_recreate" in attr_val.values()[0]):
                        cls = getattr(sys.modules[__name__], attr_val.values()[0]["my_class_for_recreate"])
                        res = {}
                        for (key, val) in attr_val.items():
                            tinstance = cls.recreate_from_save(val)
                            if tinstance is not None:
                                res[key] = tinstance
                            else:
                                error_messages.append("error creating {}".format(key))
                        setattr(self, attr, res)

                    else:
                        setattr(self, attr, attr_val)
                except TypeError:
                    setattr(self, attr, attr_val)

        for attr in self.save_attrs:
            if attr not in project_dict:
                setattr(self, attr, "")

        tile_info_dict = {}
        for old_tile_id, tile_save_dict in project_dict["tile_instances"].items():
            tile_info_dict[old_tile_id] = tile_save_dict["tile_type"]
        self.project_dict = project_dict
        # self.doc_dict = self._build_doc_dict()
        self.visible_doc_name = self.doc_dict.keys()[0]  # This is necessary for recreating the tiles
        return tile_info_dict, project_dict["loaded_modules"]

    def recreate_project_tiles(self, data_dict, new_tile_info):
        list_names = data_dict["list_names"]
        class_names = data_dict["class_names"]
        function_names = data_dict["function_names"]
        collection_names = data_dict["collection_names"]
        self.tile_instances = {}
        tile_results = {}
        errors = {}
        for old_tile_id, tile_save_dict in self.project_dict["tile_instances"].items():
            if old_tile_id not in new_tile_info:
                continue
            new_tile_id = new_tile_info[old_tile_id]["new_tile_id"]
            new_tile_address = new_tile_info[old_tile_id]["tile_container_address"]
            self.tile_instances[new_tile_id] = new_tile_address
            self.tile_sort_list[self.tile_sort_list.index(old_tile_id)] = new_tile_id
            tile_save_dict = self.project_dict["tile_instances"][old_tile_id]
            tile_save_dict["tile_id"] = new_tile_id
            tile_save_dict["main_id"] = self.my_id
            tile_save_dict["new_base_figure_url"] = self.base_figure_url.replace("tile_id", new_tile_id)
            tresult = send_request_to_container(new_tile_address,
                                                "recreate_from_save",
                                                tile_save_dict,
                                                timeout=60, tries=RETRIES)
            tile_result = tresult.json()
            if not tile_result["success"]:
                errors[old_tile_id] = tile_result["message_string"]
                del self.tile_instances[new_tile_id]
            else:
                tile_results[new_tile_id] = tile_result

        for tile in self.tile_sort_list:
            if tile not in self.tile_instances:
                self.tile_sort_list.remove(tile)

        # There's some extra work I have to do once all of the tiles are built.
        # Each tile needs to know the main_id it's associated with.
        # Also I have to build the pipe machinery.
        for tile_id, tile_result in tile_results.items():
            if "exports" in tile_result:
                if len(tile_result["exports"]) > 0:
                    if tile_id not in self._pipe_dict:
                        self._pipe_dict[tile_id] = {}
                    for export in tile_result["exports"]:
                        self._pipe_dict[tile_id][tile_result["tile_name"] + "_" + export] = {
                            "export_name": export,
                            "tile_id": tile_id,
                            "tile_address": self.tile_instances[tile_id]}

        # We have to wait to here to actually render the tiles because
        # the pipe_dict needs to be complete to build the forms.

        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": list_names,
                     "class_names": class_names,
                     "collection_names": collection_names,
                     "function_names": function_names}
        for tile_id, tile_result in tile_results.items():
            tile_result["tile_html"] = self.post_and_wait(tile_id, "render_tile", form_info)["tile_html"]
        return errors, tile_results

    @task_worthy
    def get_saved_console_code(self, data_dict):
        print "entering saved console code with console_cm_code " + str(self.console_cm_code)
        return {"saved_console_code": self.console_cm_code}

    @task_worthy
    def save_new_project(self, data_dict):
        # noinspection PyBroadException
        try:
            self.project_name = data_dict["project_name"]
            self.purgetiles = data_dict["purgetiles"]
            if self.doc_type == "table":
                self.hidden_columns_list = data_dict["hidden_columns_list"]
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]
            tspec_dict = data_dict["tablespec_dict"]
            for (dname, spec) in tspec_dict.items():
                self.doc_dict[dname].table_spec = spec

            self.show_main_status_message("Getting loaded modules")
            self.loaded_modules = self.post_and_wait("host", "get_loaded_user_modules", {"user_id": self.user_id})[
                "loaded_modules"]
            self.loaded_modules = [str(module) for module in self.loaded_modules]

            self.show_main_status_message("compiling save dictionary")
            project_dict = self.compile_save_dict()

            save_dict = {"metadata": self.create_initial_metadata(),
                         "project_name": project_dict["project_name"]}
            self.show_main_status_message("Pickle, convert, compress")
            pdict = cPickle.dumps(project_dict)
            pdict = Binary(zlib.compress(pdict))
            self.show_main_status_message("Writing the data")
            save_dict["file_id"] = self.fs.put(pdict)
            self.mdata = save_dict["metadata"]
            self.db[self.project_collection_name].insert_one(save_dict)
            self.clear_main_status_message()

            return_data = {"project_name": data_dict["project_name"],
                           "success": True,
                           "message_string": "Project Successfully Saved"}

        except Exception as ex:
            self.debug_log("got an error in save_new_project")
            error_string = self.handle_exception(ex, "<pre>Error saving new project</pre>", print_to_console=False)
            return_data = {"success": False, "message_string": error_string}
        return return_data

    @task_worthy
    def update_project(self, data_dict):
        # noinspection PyBroadException
        try:
            if self.doc_type == "table":
                self.hidden_columns_list = data_dict["hidden_columns_list"]
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]
            tspec_dict = data_dict["tablespec_dict"]
            for (dname, spec) in tspec_dict.items():
                self.doc_dict[dname].table_spec = spec
            self.show_main_status_message("Getting loaded modules")
            self.loaded_modules = self.post_and_wait("host", "get_loaded_user_modules", {"user_id": self.user_id})[
                "loaded_modules"]
            self.loaded_modules = [str(module) for module in self.loaded_modules]
            self.show_main_status_message("compiling save dictionary")
            project_dict = self.compile_save_dict()
            pname = project_dict["project_name"]
            self.mdata["updated"] = datetime.datetime.today()
            self.show_main_status_message("Pickle, convert, compress")
            pdict = cPickle.dumps(project_dict)
            pdict = Binary(zlib.compress(pdict))
            self.show_main_status_message("Writing the data")
            new_file_id = self.fs.put(pdict)
            save_dict = self.db[self.project_collection_name].find_one({"project_name": pname})
            self.fs.delete(save_dict["file_id"])
            save_dict["project_name"] = pname
            save_dict["metadata"] = self.mdata
            save_dict["file_id"] = new_file_id
            self.db[self.project_collection_name].update_one({"project_name": pname},
                                                             {'$set': save_dict})
            self.clear_main_status_message()
            self.mdata = save_dict["metadata"]
            return_data = {"project_name": pname,
                           "success": True,
                           "message": "Project Successfully Saved"}

        except Exception as ex:
            error_string = self.handle_exception(ex, "Error saving project", print_to_console=False)
            return_data = {"success": False, "message": error_string}
        return return_data

    # utility methods

    def _build_doc_dict(self):
        result = {}
        the_collection = self.db[self.collection_name]
        for f in the_collection.find():
            fname = f["name"].encode("ascii", "ignore")
            if fname == "__metadata__":
                continue
            if self.doc_type == "table":
                result[fname] = docInfo(f)
            else:
                result[fname] = FreeformDocInfo(f, self.fs.get(f["file_id"]).read())
        return result

    def _set_row_column_data(self, doc_name, the_id, column_header, new_content):
        self.doc_dict[doc_name].data_rows[str(the_id)][column_header] = new_content
        return

    def _set_freeform_data(self, doc_name, new_content):
        self.doc_dict[doc_name].data_text = new_content
        return

    def print_to_console(self, message_string, force_open=False):
        with self.app.test_request_context():
            # noinspection PyUnresolvedReferences
            pmessage = render_template("log_item.html", log_item=message_string)
        self.emit_table_message("consoleLog", {"message_string": pmessage, "force_open": force_open})
        return {"success": True}

    @property
    def doc_names(self):
        return sorted([str(key) for key in self.doc_dict.keys()])

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec:  # This will be false if table_spec == {}
                tdict[key] = docinfo.table_spec
        return tdict

    def create_initial_metadata(self):
        mdata = {"datetime": datetime.datetime.today(),
                 "updated": datetime.datetime.today(),
                 "tags": "",
                 "notes": ""}
        return mdata

    def refill_table(self):
        doc = self.doc_dict[self.visible_doc_name]
        if self.doc_type == "table":
            data_object = {"data_rows": doc.displayed_data_rows, "doc_name": self.visible_doc_name,
                           "background_colors": doc.displayed_background_colors,
                           "is_first_chunk": doc.is_first_chunk, "is_last_chunk": doc.is_last_chunk}
        else:
            data_object = {"data_text": doc.data_text, "doc_name": self.visible_doc_name,
                           "background_colors": doc.displayed_background_colors}
        self.emit_table_message("refill_table", data_object)

    @property
    def tile_ids(self):
        return self.tile_instances

    @property
    def current_header_list(self):
        if self.doc_type == "freeform":
            return []
        dinfo = self.doc_dict[self.visible_doc_name]
        return dinfo.header_list

    def get_list_names(self):
        list_names = self.post_and_wait("host", "get_list_names", {"user_id": self.user_id})
        return list_names

    def get_class_names(self):
        class_names = self.post_and_wait("host", "get_class_names", {"user_id": self.user_id})
        return class_names

    def get_function_tags_dict(self):
        function_tags_dict = self.post_and_wait("host", "get_function_tags_dict", {"user_id": self.user_id})
        return function_tags_dict

    def get_lists_classes_functions(self):
        result_dict = self.post_and_wait("host", "get_lists_classes_functions", {"user_id": self.user_id})
        return result_dict

    def _delete_tile_instance(self, tile_id):
        send_request_to_container(self.tile_instances[tile_id], "kill_me")
        del self.tile_instances[tile_id]
        self.tile_sort_list.remove(tile_id)
        the_lists = self.get_lists_classes_functions()
        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": the_lists["list_names"],
                     "class_names": the_lists["class_names"],
                     "function_names": the_lists["function_names"],
                     "collection_names": the_lists["collection_names"]}
        if tile_id in self._pipe_dict:
            del self._pipe_dict[tile_id]
            for tid in self.tile_instances.keys():
                self.post_task(tid, "RebuildTileForms", form_info)
        self.ask_host("delete_container", {"container_id": tile_id})
        return

    def get_current_pipe_list(self):
        pipe_list = []
        for tile_entry in self._pipe_dict.values():
            pipe_list += tile_entry.keys()
        return pipe_list

    def handle_exception(self, ex, special_string=None, print_to_console=True):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        error_string = "<pre>" + error_string + "</pre>"
        self.debug_log(error_string)
        if print_to_console:
            self.print_to_console(error_string, force_open=True)
        return error_string

    def highlight_table_text(self, txt):
        if self.doc_type == "table":
            row_index = 0
            dinfo = self.doc_dict[self.visible_doc_name]
            for the_row in dinfo.displayed_data_rows:
                for cheader in dinfo.header_list:
                    cdata = the_row[cheader]
                    if cdata is None:
                        continue
                    if str(txt).lower() in str(cdata).lower():
                        self.emit_table_message("highlightTxtInDocument",
                                                {"row_index": row_index, "column_header": cheader, "text_to_find": txt})
                row_index += 1
        else:
            self.emit_table_message("highlightTxtInDocument", {"text_to_find": txt})

    @staticmethod
    def txt_in_dict(txt, d):
        for val in d.values():
            try:
                if str(txt).lower() in str(val).lower():
                    return True
            except UnicodeEncodeError:
                continue
        return False

    # Task Worthy methods. These are eligible to be the recipient of posted tasks.
    @task_worthy
    def create_tile(self, data_dict):
        tile_container_id = data_dict["tile_id"]
        self.tile_instances[tile_container_id] = data_dict["tile_address"]
        tile_name = data_dict["tile_name"]
        data_dict["user_id"] = self.user_id
        data_dict["base_figure_url"] = self.base_figure_url.replace("tile_id", tile_container_id)
        data_dict["main_id"] = self.my_id
        data_dict["megaplex_address"] = self.megaplex_address
        data_dict["doc_type"] = self.doc_type
        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": data_dict["list_names"],
                     "function_names": data_dict["function_names"],
                     "class_names": data_dict["class_names"],
                     "collection_names": data_dict["collection_names"]}
        # data_dict["form_info"] = form_info
        tile_address = data_dict["tile_address"]
        result = send_request_to_container(tile_address, "load_source", data_dict).json()
        if not result["success"]:
            self.debug_log("got an exception " + result["message_string"])
            raise Exception(result["message_string"])

        instantiate_result = send_request_to_container(tile_address, "instantiate_tile_class", data_dict).json()
        if not instantiate_result["success"]:
            self.debug_log("got an exception " + instantiate_result["message_string"])
            raise Exception(instantiate_result["message_string"])

        exports = instantiate_result["exports"]
        if len(exports) > 0:
            if tile_container_id not in self._pipe_dict:
                self._pipe_dict[tile_container_id] = {}
            for export in exports:
                self._pipe_dict[tile_container_id][tile_name + "_" + export] = {
                    "export_name": export,
                    "tile_id": tile_container_id,
                    "tile_address": tile_address}

        form_html = self.post_and_wait(tile_container_id, "create_form_html", form_info)["form_html"]
        for tid in self.tile_instances.keys():
            if not tid == tile_container_id:
                self.post_task(tid, "RebuildTileForms", form_info)
        self.tile_sort_list.append(tile_container_id)
        self.current_tile_id += 1
        return {"success": True, "html": form_html}

    @task_worthy
    def get_column_data(self, data):
        result = []
        ddata = copy.copy(data)
        for doc_name in self.doc_dict.keys():
            ddata["doc_name"] = doc_name
            result = result + self.get_column_data_for_doc(ddata)
        return result

    def sort_rows(self, row_dict):
        result = []
        sorted_int_keys = sorted([int(key) for key in row_dict.keys()])
        for r in sorted_int_keys:
            result.append(row_dict[str(r)])
        return result

    @task_worthy
    def get_user_collection(self, data):
        full_collection_name = self.post_and_wait("host", "get_full_collection_name", data)["full_collection_name"]
        result = {}
        the_collection = self.db[full_collection_name]
        mdata = the_collection.find_one({"name": "__metadata__"})
        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"
        for f in the_collection.find():
            fname = f["name"].encode("ascii", "ignore")
            if fname == "__metadata__":
                continue
            if doc_type == "table":
                result[fname] = self.sort_rows(f["data_rows"])
            else:
                result[fname] = self.fs.get(f["file_id"]).read()
        return {"the_collection": result}

    @task_worthy
    def get_document_data(self, data):
        doc_name = data["document_name"]
        return self.doc_dict[doc_name].all_data

    @task_worthy
    def get_document_metadata(self, data):
        doc_name = data["document_name"]
        return self.doc_dict[doc_name].metadata

    @task_worthy
    def set_document_metadata(self, data):
        print "In set_document_metadat in main with data " + str(data)
        doc_name = data["document_name"]
        self.doc_dict[doc_name].set_additional_metadata(data["metadata"])
        print "set the document_metadata"
        return None

    @task_worthy
    def get_document_data_as_list(self, data):
        doc_name = data["document_name"]
        data_list = self.doc_dict[doc_name].all_sorted_data_rows
        return {"data_list": data_list}

    @task_worthy
    def get_column_names(self, data):
        doc_name = data["document_name"]
        header_list = self.doc_dict[doc_name].header_list
        return {"header_list": header_list}

    @task_worthy
    def get_number_rows(self, data):

        doc_name = data["document_name"]
        nrows = self.doc_dict[doc_name].number_of_rows
        return {"number_rows": nrows}

    @task_worthy
    def get_row(self, data):
        doc_name = data["document_name"]
        if "row_id" in data:
            row_id = data["row_id"]
        else:
            row_id = data["line_number"]
        the_row = self.doc_dict[doc_name].get_row(row_id)
        return the_row

    @task_worthy
    def get_line(self, data):
        return self.get_row(data)

    @task_worthy
    def get_cell(self, data):
        doc_name = data["document_name"]
        row_id = data["row_id"]
        column_name = data["column_name"]
        the_cell = self.doc_dict[doc_name].data_rows_int_keys[int(row_id)][column_name]
        return {"the_cell": the_cell}

    @task_worthy
    def get_column_data_for_doc(self, data):
        column_header = data["column_name"]
        doc_name = data["doc_name"]
        the_rows = self.doc_dict[doc_name].all_sorted_data_rows
        result = []
        for the_row in the_rows:
            result.append(the_row[column_header])
        return result

    @task_worthy
    def CellChange(self, data):
        self._set_row_column_data(data["doc_name"], data["id"], data["column_header"], data["new_content"])
        self._change_list.append(data["id"])
        return None

    @task_worthy
    def FreeformTextChange(self, data):
        self._set_freeform_data(data["doc_name"], data["new_content"])
        return None

    @task_worthy
    def set_visible_doc(self, data):
        doc_name = data["doc_name"]
        if not doc_name == self.visible_doc_name:
            self.distribute_event("DocChange", data)
        self.visible_doc_name = doc_name
        return {"success": True}

    @task_worthy
    def print_to_console_event(self, data):
        self.print_to_console(data["print_string"], force_open=True)
        return {"success": True}

    @task_worthy
    def create_console_code_area(self, data):
        unique_id = str(uuid.uuid4())
        with self.app.test_request_context():
            # noinspection PyUnresolvedReferences
            pmessage = render_template("code_log_item.html", unique_id=unique_id)
        self.emit_table_message("consoleLog", {"message_string": pmessage, "force_open": True})
        return {"success": True, "unique_id": unique_id}

    @task_worthy
    def got_console_result(self, data):
        self.emit_table_message("consoleCodeLog", {"message_string": data["result_string"],
                                                   "console_id": data["console_id"],
                                                   "force_open": True})
        return {"success": True}

    @task_worthy
    def exec_console_code(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        the_code = data["the_code"]
        data["pipe_dict"] = self._pipe_dict
        self.post_task(self.pseudo_tile_id, "exec_console_code", data, self.got_console_result)
        return {"success": True}

    @task_worthy
    def get_exports_list_html(self, data):
        the_html = ""
        export_list = []
        for (tile_id, tile_entry) in self._pipe_dict.items():
            for pname in tile_entry.keys():
                export_list.append(pname)
        export_list.sort()
        for pname in export_list:
            the_html += "<option>{}</option>\n".format(pname)
        return {"success": True, "the_html": the_html, "export_list": export_list}

    @task_worthy
    def evaluate_export(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        ndata = {}
        ndata["export_name"] = data["export_name"]
        ndata["pipe_dict"] = self._pipe_dict
        if "key" in data:
            ndata["key"] = data["key"]
        ndata["tail"] = data["tail"]
        result = self.post_and_wait(self.pseudo_tile_id, "evaluate_export", ndata)
        return result

    @task_worthy
    def get_export_info(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        ndata = {}
        ndata["export_name"] = data["export_name"]
        ndata["pipe_dict"] = self._pipe_dict
        result = self.post_and_wait(self.pseudo_tile_id, "get_export_info", ndata)
        return result

    def create_pseudo_tile(self):
        data = self.post_and_wait("host", "create_tile_container", {"user_id": self.user_id})
        self.pseudo_tile_id = data["tile_id"]
        self.pseudo_tile_address = data["tile_address"]
        data_dict = {"user_id": self.user_id,
                     "base_figure_url": self.base_figure_url.replace("tile_id", self.pseudo_tile_id),
                     "main_id": self.my_id, "megaplex_address": self.megaplex_address, "doc_type": self.doc_type,
                     "tile_id": self.pseudo_tile_id}
        instantiate_result = send_request_to_container(self.pseudo_tile_address,
                                                       "instantiate_as_pseudo_tile", data_dict).json()
        if not instantiate_result["success"]:
            self.debug_log("got an exception " + instantiate_result["message_string"])
            raise Exception(instantiate_result["message_string"])

        return {"success": True}

    @task_worthy
    def get_property(self, data_dict):
        # tactic_todo eliminate get_property?
        prop_name = data_dict["property"]
        val = getattr(self, prop_name)
        return {"success": True, "val": val}

    @task_worthy
    def export_data(self, data):
        mdata = self.create_initial_metadata()
        mdata["name"] = "__metadata__"
        mdata["type"] = self.doc_type
        full_collection_name = data["full_collection_name"]
        self.db[full_collection_name].insert_one(mdata)
        for docinfo in self.doc_dict.values():
            if self.doc_type == "freeform":
                ddict = {"name": docinfo.name, "data_text": docinfo.data_text}
            else:
                ddict = {"name": docinfo.name, "data_rows": docinfo.data_rows, "header_list": docinfo.header_list}
            ddict.update(docinfo.additional_metadata)
            self.db[full_collection_name].insert_one(ddict)
        return {"success": True}

    @task_worthy
    def create_collection(self, data):
        mdata = self.create_initial_metadata()
        mdata["name"] = "__metadata__"
        new_name = data["name"]
        doc_dict = data["doc_dict"]
        doc_type = data["doc_type"]
        document_metadata = data["doc_metadata"]
        if document_metadata is None:
            document_metadata = {}
        full_collection_name = self.post_and_wait("host", "get_full_collection_name",
                                                  {"collection_name": new_name, "user_id": self.user_id})["full_collection_name"]
        if doc_type == "table":
            mdata["type"] = "table"
            self.db[full_collection_name].insert_one(mdata)
            for docname, doc_as_list in doc_dict.items():
                header_list = doc_as_list[0].keys()
                doc_as_dict = {}
                for r, the_row in enumerate(doc_as_list):
                    the_row["__id__"] = r
                    the_row["__filename__"] = docname
                    doc_as_dict[str(r)] = the_row
                header_list = ["__id__", "__filename__"] + header_list
                ddict = {"name": docname, "data_rows": doc_as_dict, "header_list": header_list}
                if docname in document_metadata:
                    for k, val in document_metadata[docname].items():
                        if k not in PROTECTED_METADATA_KEYS:
                            ddict[k] = val
                self.db[full_collection_name].insert_one(ddict)
        else:
            mdata["type"] = "freeform"
            self.db[full_collection_name].insert_one(mdata)
            for docname, doc in doc_dict.items():
                file_id = self.fs.put(str(doc))
                ddict = {"name": docname, "file_id": file_id}
                if docname in document_metadata:
                    for k, val in document_metadata[docname].items():
                        if k not in PROTECTED_METADATA_KEYS:
                            ddict[k] = val
                self.db[full_collection_name].insert_one(ddict)
        self.ask_host("update_collection_selector_list", {"user_id": self.user_id})
        return {"success": True}

    @task_worthy
    def get_tile_ids(self, data):
        tile_ids = self.tile_instances.keys()
        return {"success": True, "tile_ids": tile_ids}

    @task_worthy
    def set_property(self, data_dict):
        # tactic_todo eliminate set_property as task
        prop_name = data_dict["property"]
        val = data_dict["val"]
        setattr(self, prop_name, val)
        return

    @task_worthy
    def open_log_window(self, task_data):
        self.console_html = task_data["console_html"]
        if self.project_name is None:
            title = self.short_collection_name + " log"
        else:
            title = self.project_name + " log"
        self.post_task("host", "open_log_window", {"console_html": self.console_html,
                                                   "title": title,
                                                   "main_id": self.my_id})
        return

    @task_worthy
    def grab_data(self, data):
        doc_name = data["doc_name"]
        if self.doc_type == "table":
            return {"doc_name": doc_name,
                    "is_shrunk": self.is_shrunk,
                    "left_fraction": self.left_fraction,
                    "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                    "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                    "header_list": self.doc_dict[doc_name].header_list,
                    "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                    "max_table_size": self.doc_dict[doc_name].max_table_size}
        else:
            return {"doc_name": doc_name,
                    "is_shrunk": self.is_shrunk,
                    "left_fraction": self.left_fraction,
                    "data_text": self.doc_dict[doc_name].data_text}

    @task_worthy
    def grab_project_data(self, data_dict):
        doc_name = data_dict["doc_name"]
        if self.doc_type == "table":
            return {"doc_name": doc_name,
                    "is_shrunk": self.is_shrunk,
                    "tile_ids": self.tile_sort_list,
                    "left_fraction": self.left_fraction,
                    "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                    "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                    "header_list": self.doc_dict[doc_name].header_list,
                    "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                    "max_table_size": self.doc_dict[doc_name].max_table_size,
                    "tablespec_dict": self.tablespec_dict(),
                    "hidden_columns_list": self.hidden_columns_list,
                    "tile_save_results": self.tile_save_results}
        else:
            return {"doc_name": doc_name,
                    "is_shrunk": self.is_shrunk,
                    "tile_ids": self.tile_sort_list,
                    "left_fraction": self.left_fraction,
                    "data_text": self.doc_dict[doc_name].data_text,
                    "tablespec_dict": self.tablespec_dict(),
                    "tile_save_results": self.tile_save_results}

    def get_tile_property(self, tile_id, prop_name):
        result = self.post_and_wait(tile_id, 'get_property', {"property": prop_name})["val"]
        return result

    @task_worthy
    def reload_tile(self, ddict):
        tile_id = ddict["tile_id"]
        tile_type = self.get_tile_property(tile_id, "tile_type")
        data = {"tile_type": tile_type, "user_id": self.user_id}
        module_code = self.post_and_wait("host", "get_module_code", data)["module_code"]
        the_lists = self.get_lists_classes_functions()
        reload_dict = copy.copy(self.get_tile_property(tile_id, "current_reload_attrs"))
        saved_options = copy.copy(self.get_tile_property(tile_id, "current_options"))
        reload_dict.update(saved_options)
        result = send_request_to_container(self.tile_instances[tile_id], "load_source",
                                           {"tile_code": module_code, "megaplex_address": self.megaplex_address}).json()
        if not result["success"]:
            raise Exception(result["message_string"])

        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": the_lists["list_names"],
                     "class_names": the_lists["class_names"],
                     "function_names": the_lists["function_names"],
                     "collection_names": the_lists["collection_names"]}
        reload_dict["form_info"] = form_info
        reload_dict["main_id"] = self.my_id
        result = send_request_to_container(self.tile_instances[tile_id], "reinstantiate_tile", reload_dict).json()
        if result["success"]:
            return {"success": True, "html": result["form_html"]}
        else:
            raise Exception(result["message_string"])

    @task_worthy
    def grab_chunk_with_row(self, data_dict):
        doc_name = data_dict["doc_name"]
        row_id = data_dict["row_id"]
        self.doc_dict[doc_name].move_to_row(row_id)
        return {"doc_name": doc_name,
                "left_fraction": self.left_fraction,
                "is_shrunk": self.is_shrunk,
                "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                "header_list": self.doc_dict[doc_name].header_list,
                "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                "max_table_size": self.doc_dict[doc_name].max_table_size,
                "actual_row": self.doc_dict[doc_name].get_actual_row(row_id)}

    @task_worthy
    def get_actual_row(self, data):
        doc_name = data["doc_name"]
        row_id = data["row_id"]
        actual_row = self.doc_dict[doc_name].get_actual_row(row_id)
        return actual_row

    @task_worthy
    def distribute_events_stub(self, data_dict):
        event_name = data_dict["event_name"]
        if "tile_id" in data_dict:
            tile_id = data_dict["tile_id"]
        else:
            tile_id = None
        success = self.distribute_event(event_name, data_dict, tile_id)
        return {"success": success}

    @task_worthy
    def grab_next_chunk(self, data_dict):
        doc_name = data_dict["doc_name"]
        step_amount = self.doc_dict[doc_name].advance_to_next_chunk()
        return {"doc_name": doc_name,
                "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                "header_list": self.doc_dict[doc_name].header_list,
                "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                "step_size": step_amount}

    @task_worthy
    def grab_previous_chunk(self, data_dict):
        doc_name = data_dict["doc_name"]
        step_amount = self.doc_dict[doc_name].go_to_previous_chunk()
        return {"doc_name": doc_name,
                "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                "header_list": self.doc_dict[doc_name].header_list,
                "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                "step_size": step_amount}

    @task_worthy
    def RemoveTile(self, data):
        self._delete_tile_instance(data["tile_id"])
        return None

    @task_worthy
    def CreateColumn(self, data):
        column_name = data["column_name"]
        for doc in self.doc_dict.values():
            doc.header_list.append(column_name)
            for r in doc.data_rows.values():
                r[column_name] = ""

        the_lists = self.get_lists_classes_functions()

        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": the_lists["list_names"],
                     "class_names": the_lists["class_names"],
                     "function_names": the_lists["function_names"],
                     "collection_names": the_lists["collection_names"]}
        for tid in self.tile_instances.keys():
            self.post_task(tid, "RebuildTileForms", form_info)
        return None

    @task_worthy
    def SearchTable(self, data):
        self.highlight_table_text(data["text_to_find"])
        return None

    @task_worthy
    def FilterTable(self, data):
        txt = data["text_to_find"]
        self.display_matching_rows_applying_filter(lambda r: self.txt_in_dict(txt, r))
        self.highlight_table_text(txt)
        return None

    @task_worthy
    def DehighlightTable(self, data):
        self.emit_table_message("dehighlightAllText")
        return None

    @task_worthy
    def UnfilterTable(self, data):
        for doc in self.doc_dict.values():
            doc.current_data_rows = doc.data_rows
            doc.configure_for_current_data()
        self.refill_table()
        return None

    @task_worthy
    def ColorTextInCell(self, data):
        data["row_index"] = self.get_actual_row(data)
        if data["row_index"] is not None:
            self.emit_table_message("colorTxtInCell", data)
        return None

    @task_worthy
    def SetCellContent(self, data):
        self._set_cell_content(data["doc_name"], data["id"], data["column_header"],
                               data["new_content"], data["cellchange"])
        return None

    @task_worthy
    def SetDocument(self, data):
        # tactic_todo compare to update_document
        doc_name = data["doc_name"]

        if self.doc_type == "table":
            new_doc_dict = data["new_data"]
            cellchange = data["cellchange"]

            current_doc_dict = self.doc_dict[doc_name].data_rows
            for the_id, r in new_doc_dict.items():
                old_r = current_doc_dict[the_id]
                for key, val in r.items():
                    if not val == old_r[key]:
                        self._set_cell_content(doc_name, the_id, key, val, cellchange)
        else:
            new_doc_text = data["new_data"]
            self._set_freeform_data(doc_name, new_doc_text)
            if doc_name == self.visible_doc_name:
                data = {"new_content": new_doc_text,
                        "doc_name": doc_name}
                self.emit_table_message("setFreeformContent", data)
        return {"success": True}

    @task_worthy
    def SetColumnData(self, data):
        if isinstance(data["new_content"], dict):
            for rid, ntext in data["new_content"].items():
                self._set_cell_content(data["doc_name"], rid, data["column_header"],
                                       ntext, data["cellchange"])

        elif isinstance(data["new_content"], list):
            for rid, ntext in enumerate(data["new_content"]):
                self._set_cell_content(data["doc_name"], rid, data["column_header"],
                                       ntext, data["cellchange"])
        else:
            raise Exception("Got invalid data type in SetColumnData.")
        return None

    @task_worthy
    def TextSelect(self, data):
        self.selected_text = data["selected_text"]
        return None

    @task_worthy
    def SaveTableSpec(self, data):
        new_spec = data["tablespec"]
        self.doc_dict[new_spec["doc_name"]].table_spec = new_spec
        return None

    @task_worthy
    def UpdateSortList(self, data):
        self.tile_sort_list = data["sort_list"]
        return None

    @task_worthy
    def UpdateLeftFraction(self, data):
        self.left_fraction = data["left_fraction"]
        return None

    @task_worthy
    def UpdateTableShrinkState(self, data):
        self.is_shrunk = data["is_shrunk"]
        return None

    @task_worthy
    def PrintToConsole(self, data):
        self.print_to_console(data["message"], True)
        return None

    @task_worthy
    def DisplayCreateErrors(self, data):
        for msg in self.recreate_errors:
            self.debug_log("Got CreateError: " + msg)
            self.print_to_console(msg, True)
        self.recreate_errors = []
        return None

    @task_worthy
    def display_matching_rows(self, data):
        result = data["result"]
        document_name = data["document_name"]
        if document_name is not None:
            doc = self.doc_dict[document_name]
            doc.current_data_rows = {}
            for (key, val) in doc.data_rows.items():
                if int(key) in result:
                    doc.current_data_rows[key] = val
            doc.configure_for_current_data()
            self.refill_table()
        else:
            for docname, doc in self.doc_dict.items():
                doc.current_data_rows = {}
                for (key, val) in doc.data_rows.items():
                    if int(key) in result[docname]:
                        doc.current_data_rows[key] = val
                doc.configure_for_current_data()
            self.refill_table()
        return

    @task_worthy
    def update_document(self, data):
        new_data = data["new_data"]
        doc_name = data["document_name"]
        doc = self.doc_dict[doc_name]
        if self.doc_type == "table":
            for key, r in new_data.items():
                for c, val in r.items():
                    doc.data_rows[key][c] = val
        else:
            self._set_freeform_data(doc_name, new_data)
        if doc_name == self.visible_doc_name:
            self.refill_table()
        return {"success": True}

    def display_matching_rows_applying_filter(self, filter_function, document_name=None):
        if document_name is not None:
            doc = self.doc_dict[document_name]
            doc.current_data_rows = {}
            for (key, val) in doc.data_rows.items():
                if filter_function(val):
                    doc.current_data_rows[key] = val
            doc.configure_for_current_data()
            self.refill_table()
        else:
            for docname, doc in self.doc_dict.items():
                doc.current_data_rows = {}
                for (key, val) in doc.data_rows.items():
                    if filter_function(val):
                        doc.current_data_rows[key] = val
                doc.configure_for_current_data()
            self.refill_table()
        return

    # tactic_todo apply_to_rows not used here. eliminate?
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

    # _set_cell_content is called from several places
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

    @task_worthy
    def SetCellBackground(self, data):
        self._set_cell_background(data["doc_name"], data["row_id"], data["column_name"], data["color"])
        return None

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
