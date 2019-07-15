# from gevent import monkey; monkey.patch_all()
import sys
import re
# noinspection PyUnresolvedReferences
import requests
import pickle
import copy
import pymongo
import gridfs
import datetime
import os
from communication_utils import debinarize_python_object, store_temp_data
from communication_utils import make_jsonizable_and_compress, read_project_dict, read_temp_data, delete_temp_data
import docker_functions
from volume_manager import VolumeManager, host_persist_dir
from mongo_accesser import MongoAccess
from main_tasks_mixin import StateTasksMixin, LoadSaveTasksMixin, TileCreationTasksMixin, APISupportTasksMixin
from main_tasks_mixin import ExportsTasksMixin, ConsoleTasksMixin, DataSupportTasksMixin
from exception_mixin import ExceptionMixin

docker_functions.megaplex_address = os.environ.get("MEGAPLEX_ADDRESS")

from doc_info import docInfo, FreeformDocInfo

# getting environment variables
INITIAL_LEFT_FRACTION = .69

RETRIES = 60


if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"


mongo_uri = os.environ.get("MONGO_URI")
true_host_persist_dir = os.environ.get("TRUE_HOST_PERSIST_DIR")
true_host_nltk_data_dir = os.environ.get("TRUE_HOST_NLTK_DATA_DIR")


# noinspection PyPep8Naming,PyUnusedLocal,PyTypeChecker
class mainWindow(MongoAccess, StateTasksMixin, LoadSaveTasksMixin, TileCreationTasksMixin, APISupportTasksMixin,
                 ExportsTasksMixin, ConsoleTasksMixin, DataSupportTasksMixin, ExceptionMixin):
    save_attrs = ["short_collection_name", "collection_name", "current_tile_id", "tile_sort_list", "left_fraction",
                  "is_shrunk", "doc_dict", "project_name", "loaded_modules", "user_id",
                  "console_html", "console_cm_code", "doc_type", "purgetiles"]
    notebook_save_attrs = ["project_name", "user_id", "console_html", "console_cm_code", "doc_type"]
    update_events = ["CellChange", "FreeformTextChange", "CreateColumn", "SearchTable", "SaveTableSpec", "MainClose",
                     "DehighlightTable", "SetCellContent", "RemoveTile", "ColorTextInCell",
                     "FilterTable", "UnfilterTable", "TextSelect", "UpdateSortList", "UpdateLeftFraction",
                     "UpdateTableShrinkState", "UpdateHeaderListOrder", "HideColumnInAllDocs", "UpdateColumnWidths"]
    select_option_val_template = '<option value="{0}">{1}</option>'
    select_option_val_selected_template = '<option value="{0}" selected>{1}</option>'

    # noinspection PyUnresolvedReferences
    def __init__(self, mworker, data_dict):
        print("entering mainwindow_init")
        self.mworker = mworker
        try:
            client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
            client.server_info()
            # noinspection PyUnresolvedReferences
            self.db = client[db_name]
            self.fs = gridfs.GridFS(self.db)
        except Exception as ex:
            self.mworker.debug_log(self.extract_short_error_message(ex, "error getting pymongo client"))
            sys.exit()

        self.base_figure_url = data_dict["base_figure_url"]

        # These are the main attributes that define a project state

        self.callbacks = {}

        # These are working attributes that will change whenever the project is instantiated.

        self._change_list = []
        self.visible_doc_name = None
        self._pipe_dict = {}
        self.selected_text = ""
        self.project_dict = None
        self.tile_save_results = None
        self.mdata = None
        self.pseudo_tile_id = None
        self.loaded_modules = None
        self.tile_id_dict = {}  # dict with the keys the names of tiles and ids as the values.
        self.tile_addresses = {}
        self.pseudo_tile_address = None

        self.ppi = data_dict["ppi"]
        self.username = os.environ.get("USERNAME")
        self.vmanager = VolumeManager("/persist")

        if ("project_name" not in data_dict) or (data_dict["doc_type"] == "jupyter"):
            self.doc_type = data_dict["doc_type"]
            self.current_tile_id = 0
            self.tile_instances = []
            self.tile_sort_list = []
            self.left_fraction = INITIAL_LEFT_FRACTION
            self.is_shrunk = False
            self.project_name = None
            self.console_html = None
            self.console_cm_code = {}
            self.user_id = os.environ.get("OWNER")
            self.purgetiles = False
            if self.doc_type == "notebook" or self.doc_type == "jupyter":
                self.collection_name = ""
                self.short_collection_name = ""
                self.doc_dict = {}
                self.visible_doc_name = ""
            else:
                self.collection_name = data_dict["collection_name"]
                self.short_collection_name = self.short_collection_name(self.collection_name)
                self.doc_dict = self._build_doc_dict()
                self.visible_doc_name = list(self.doc_dict)[0]

        print("done with init")

    @property
    def am_notebook_type(self):
        return self.doc_type in ["notebook", "juptyer"]

    def show_main_message(self, message, timeout=None):
        data = {"message": message, "timeout": timeout, "main_id": self.mworker.my_id}
        self.mworker.post_task("host", "show_main_status_message_task", data)

    def clear_um_message(self, library_id):
        data = {"library_id": library_id}
        self.mworker.post_task("host", "clear_um_status_message_task", data)

    def show_main_status_message(self, message, timeout=None):
        data = {"message": message, "timeout": timeout, "main_id": self.mworker.my_id}
        self.mworker.post_task("host", "show_main_status_message", data)

    def show_error_window(self, error_string):
        data_dict = {"error_string": str(error_string),
                     "uses_codemirror": "False",
                     "template_name": "error_window_template.html"}
        unique_id = store_temp_data(self.db, data_dict)
        self.mworker.ask_host("emit_to_client", {"message": "window-open", "the_id": unique_id})
        return

    def clear_main_status_message(self):
        data = {"main_id": self.mworker.my_id}
        self.mworker.post_task("host", "clear_main_status_message", data)

    def stop_main_status_spinner(self):
        data = {"main_id": self.mworker.my_id}
        self.mworker.post_task("host", "stop_main_status_spinner", data)

    # legacy
    def update_legacy_console_html(self):
        self.console_html = re.sub("panel panel-default log-panel ", "card log-panel ", self.console_html)
        self.console_html = re.sub("panel log-panel panel-default ", "card log-panel ", self.console_html)
        self.console_html = re.sub("panel-heading", "card-header", self.console_html)
        self.console_html = re.sub(r'<svg class=\"svg-inline--fa[\s\S]*?/svg>', "", self.console_html)
        self.console_html = re.sub(r'<!-- <span class="fa', '<span class="fa', self.console_html)
        self.console_html = re.sub(r'span> -->', 'span>', self.console_html)

        replacements = {"trash": "trash-alt",
                        "triangle-bottom": "chevron-circle-down",
                        "triangle-right": "chevron-circle-right",
                        "step-forward": "step-forward",
                        "erase": "eraser",
                        "text-size": "font"}

        for old, new in replacements.items():
            self.console_html = re.sub('style=\"font-size:13px\" class=\"glyphicon glyphicon-{}\"'.format(old),
                                       r'class="fas fa-{}"'.format(new),
                                       self.console_html)
        return

    def dmsg(self, tname, msg):
        print("rot: {} {}".format(tname, msg))

    def create_tile_container(self, data):
        try:
            environ = {"PPI": data["ppi"]}
            user_host_persist_dir = true_host_persist_dir + "/tile_manager/" + self.username
            tile_volume_dict = {}
            tile_volume_dict[user_host_persist_dir] = {"bind": "/persist", "mode": "rw"}
            tile_volume_dict[true_host_nltk_data_dir] = {"bind": "/root/nltk_data", "mode": "ro"}
            tile_container_id, container_id = docker_functions.create_container("tactic_tile_image",
                                                                                network_mode="bridge",
                                                                                owner=data["user_id"],
                                                                                parent=data["parent"],
                                                                                other_name=data["other_name"],
                                                                                env_vars=environ,
                                                                                volume_dict=tile_volume_dict,
                                                                                publish_all_ports=True)
            tile_address = docker_functions.get_address(container_id, "bridge")
        except docker_functions.ContainerCreateError as ex:
            print("Error creating tile container")
            return self.get_short_exception_dict(ex, "Error creating empty tile container")
        return {"success": True, "tile_id": tile_container_id, "tile_address": tile_address}

    def recreate_from_save(self, project_name, unique_id=None):
        if unique_id is None:
            save_dict = self.db[self.project_collection_name].find_one({"project_name": project_name})
            self.mdata = save_dict["metadata"]
            try:
                project_dict = read_project_dict(self.fs, self.mdata, save_dict["file_id"])
            except Exception as ex:
                error_string = self.handle_exception(ex, "<pre>Error loading project dict</pre>", print_to_console=True)
                print(error_string)
                return_data = {"success": False, "message": error_string}
                return error_string, {}, False

            project_dict["metadata"] = save_dict["metadata"]
        else:
            save_dict = read_temp_data(self.db, unique_id)
            project_dict = read_project_dict(self.fs, {"save_style": "b64save"}, save_dict["file_id"])
            delete_temp_data(self.db, unique_id, fs=self.fs)

        error_messages = []
        if "doc_type" not in project_dict:  # legacy this is for backward compatibility
            project_dict["doc_type"] = "table"
        for (attr, attr_val) in project_dict.items():
            if str(attr) != "tile_instances" and str(attr) != "pseudo_tile_instance":
                try:
                    if type(attr_val) == dict and ("my_class_for_recreate" in attr_val):
                        cls = getattr(sys.modules[__name__], attr_val["my_class_for_recreate"])
                        setattr(self, attr, cls.recreate_from_save(attr_val))
                    elif (type(attr_val) == dict) and (len(attr_val) > 0) and \
                            ("my_class_for_recreate" in list(attr_val.values())[0]):
                        cls = getattr(sys.modules[__name__], list(attr_val.values())[0]["my_class_for_recreate"])
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

        if self.doc_type == "notebook":
            save_attrs = self.notebook_save_attrs
        else:
            save_attrs = self.save_attrs
        for attr in save_attrs:
            if attr not in project_dict:
                setattr(self, attr, "")

        if "pseudo_tile_instance" in project_dict:
            globals_dict = project_dict["pseudo_tile_instance"]
            self.create_pseudo_tile(globals_dict)

        if self.doc_type != "notebook":
            tile_info_dict = {}
            for old_tile_id, tile_save_dict in project_dict["tile_instances"].items():
                tile_info_dict[old_tile_id] = tile_save_dict["tile_type"]
            self.project_dict = project_dict
            # self.doc_dict = self._build_doc_dict()
            self.visible_doc_name = list(self.doc_dict)[0]  # This is necessary for recreating the tiles
            return tile_info_dict, project_dict["loaded_modules"], True
        else:
            return True

    def get_used_tile_types(self):
        result = []
        for tile_id in self.tile_instances:
            result.append(self.get_tile_property(tile_id, "tile_type"))
        return result

    # utility methods

    def _build_doc_dict(self):
        print("in _build_doc_dict")
        result = {}

        coll_dict, dm_dict, hl_dict, coll_mdata = self.get_all_collection_info(self.short_collection_name,
                                                                               return_lists=False)
        for fname in coll_dict.keys():
            if self.doc_type == "table":
                result[fname] = docInfo(fname, hl_dict[fname], dm_dict[fname], coll_dict[fname])
            else:
                result[fname] = FreeformDocInfo(fname, dm_dict[fname], coll_dict[fname])

        print("leaving _build_doc_dict")
        return result

    def _set_row_column_data(self, doc_name, the_id, column_header, new_content):
        self.doc_dict[doc_name].data_rows[str(the_id)][column_header] = new_content
        return

    def _set_freeform_data(self, doc_name, new_content):
        self.doc_dict[doc_name].data_text = new_content
        return

    @property
    def doc_names(self):
        return sorted([str(key) for key in list(self.doc_dict.keys())])

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec:  # This will be false if table_spec == {}
                tdict[key] = docinfo.table_spec.compile_save_dict()
        return tdict

    def refill_table(self):
        doc = self.doc_dict[self.visible_doc_name]
        if self.doc_type == "table":
            data_object = {"data_rows": doc.displayed_data_rows, "doc_name": self.visible_doc_name,
                           "background_colors": doc.displayed_background_colors,
                           "is_first_chunk": doc.is_first_chunk, "is_last_chunk": doc.is_last_chunk}
        else:
            data_object = {"data_text": doc.data_text, "doc_name": self.visible_doc_name,
                           "background_colors": doc.displayed_background_colors}
        self.mworker.emit_table_message("refill_table", data_object)

    @property
    def tile_ids(self):
        return self.tile_instances

    @property
    def current_header_list(self):
        if self.doc_type == "freeform":
            return []
        dinfo = self.doc_dict[self.visible_doc_name]
        return dinfo.table_spec.header_list

    def _delete_tile_instance(self, tile_id):
        self.tile_instances.remove(tile_id)
        self.tile_sort_list.remove(tile_id)
        del self.tile_addresses[tile_id]
        for n, tid in self.tile_id_dict.items():
            if tid == tile_id:
                del self.tile_id_dict[n]
                break

        if tile_id in self._pipe_dict:
            del self._pipe_dict[tile_id]
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
        self.mworker.ask_host("delete_container", {"container_id": tile_id, "notify": False})
        self.mworker.emit_export_viewer_message("update_exports_popup", {})
        return

    def handle_exception(self, ex, special_string=None, print_to_console=True):
        error_string = self.get_traceback_message(ex, special_string)
        self.mworker.debug_log(error_string)
        if print_to_console:
            summary = "An exception of type {}".format(type(ex).__name__)
            self.mworker.print_to_console(error_string, force_open=True, is_error=True, summary=summary)
        return error_string

    def highlight_table_text(self, txt):
        if self.doc_type == "table":
            row_index = 0
            dinfo = self.doc_dict[self.visible_doc_name]
            for the_row in dinfo.displayed_data_rows:
                for cheader in dinfo.table_spec.header_list:
                    cdata = the_row[cheader]
                    if cdata is None:
                        continue
                    if str(txt).lower() in str(cdata).lower():
                        self.mworker.emit_table_message("highlightTxtInDocument",
                                                        {"row_index": row_index,
                                                         "column_header": cheader,
                                                         "text_to_find": txt})
                row_index += 1
        else:
            self.mworker.emit_table_message("highlightTxtInDocument", {"text_to_find": txt})

    def move_one_figure(self, tid, figid):
        data = {"figure_name": figid}

        def got_image(img_data):
            encoded_img = img_data["img"]
            data["img"] = encoded_img
            self.mworker.post_task(self.pseudo_tile_id, "store_image", data)

        self.mworker.post_task(tid, "get_image", data, got_image)
        return

    def move_figures_to_pseudo_tile(self, html_string):
        matches = re.findall(r"/figure_source/(.*?)/([0-9A-Fa-f-]*)", html_string)
        new_html = html_string
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        for match in matches:
            tid = match[0]
            new_html = re.sub(tid, self.pseudo_tile_id, new_html)
        for match in matches:
            tid = match[0]
            figid = match[1]
            self.move_one_figure(match[0], match[1])
        return new_html

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

    def microdsecs(self, tstart):
        tnow = datetime.datetime.now()
        td = tnow - tstart
        return td.seconds * 1000000 + td.microseconds

    def get_tile_code(self, tile_type):
        user_tiles = self.vmanager["user_tiles"]
        for category in user_tiles.keys():
            cat = user_tiles[category]
            catnames = cat.keys()
            if tile_type in catnames:
                return cat[tile_type].value
        return None

    def get_loaded_user_modules(self):
        return self.vmanager["loaded_user_modules"].keys()

    def create_pseudo_tile(self, globals_dict=None):
        print("entering create_pseudo_tile")

        data = self.create_tile_container({"user_id": self.user_id, "parent": self.mworker.my_id,
                                           "other_name": "pseudo_tile", "ppi": self.ppi})

        if not data["success"]:
            raise Exception("Error creating empty tile container")
        self.pseudo_tile_id = data["tile_id"]
        self.pseudo_tile_address = data["tile_address"]
        if globals_dict is None:
            globals_dict = {}
        data_dict = {"base_figure_url": self.base_figure_url.replace("tile_id", self.pseudo_tile_id),
                     "doc_type": self.doc_type, "globals_dict": globals_dict, "tile_address": data["tile_address"]}
        print("about to instantiate")

        def instantiate_done(instantiate_result):
            self.mworker.post_task(self.pseudo_tile_id, "create_pseudo_tile_collection_object",
                                   {"am_notebook": self.am_notebook_type})
            if not instantiate_result["success"]:
                self.mworker.debug_log("got an exception " + instantiate_result["message"])
                raise Exception(instantiate_result["message"])

        self.mworker.post_task(self.pseudo_tile_id, "instantiate_as_pseudo_tile", data_dict, instantiate_done)

        return {"success": True}

    def get_tile_property(self, tile_id, prop_name, callback=None):
        if callback is None:
            result = self.mworker.post_and_wait(tile_id, '_get_property', {"property": prop_name})["val"]
            return result
        else:
            self.mworker.post_task(tile_id, '_get_property', {"property": prop_name}, callback)
            return

    def update_pipe_dict(self, exports, tile_id, tile_name):
        if len(exports) == 0:
            if tile_id in self._pipe_dict:
                del self._pipe_dict[tile_id]
        else:
            self._pipe_dict[tile_id] = {}
            if not isinstance(exports[0], dict):
                exports = [{"name": exp, "tags": ""} for exp in exports]  # legacy old form of exports list of strings
            for export in exports:
                self._pipe_dict[tile_id][tile_name + "_" + export["name"]] = {
                    "export_name": export["name"],
                    "export_tags": export["tags"],
                    "tile_id": tile_id}
        return

    def rebuild_other_tile_forms(self, tile_id, form_info):
        for tid in self.tile_instances:
            if tile_id is None or not tid == tile_id:
                form_info["other_tile_names"] = self.get_other_tile_names(tid)
                self.mworker.post_task(tid, "RebuildTileForms", form_info)

    def compile_form_info(self, tile_id):
        if tile_id is None:
            other_tile_names = list(self.tile_id_dict.keys())
        else:
            other_tile_names = self.get_other_tile_names(tile_id)
        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": self.list_tags_dict,
                     "function_names": self.function_tags_dict,
                     "class_names": self.class_tags_dict,
                     "collection_names": self.data_collection_tags_dict,
                     "other_tile_names": other_tile_names}
        return form_info

    def get_actual_row(self, data):
        doc_name = data["doc_name"]
        row_id = data["row_id"]
        actual_row = self.doc_dict[doc_name].get_actual_row(row_id)
        return actual_row

    def get_other_tile_names(self, tile_id):
        other_tile_names = []
        for n, tid in self.tile_id_dict.items():
            if not tid == tile_id:
                other_tile_names.append(n)
        return other_tile_names

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
        if column_header not in the_row:
            the_row[column_header] = None
        old_content = the_row[column_header]
        if new_content != old_content:
            data = {"doc_name": doc_name, "id": the_id, "column_header": column_header,
                    "new_content": new_content, "old_content": old_content}

            # If cellchange is True then we use a CellChange event to handle any updates.
            # Otherwise just change things right here.
            if cellchange:
                self.mworker.distribute_event("CellChange", data)
            else:
                self._set_row_column_data(doc_name, the_id, column_header, new_content)
                self._change_list.append(the_id)
            if doc_name == self.visible_doc_name:
                doc = self.doc_dict[doc_name]
                actual_row = doc.get_actual_row(the_id)
                if actual_row is not None:
                    data["row"] = actual_row
                    self.mworker.emit_table_message("setCellContent", data)

    def _set_cell_background(self, doc_name, the_id, column_header, color):
        doc = self.doc_dict[doc_name]
        doc.set_background_color(the_id, column_header, color)
        if doc_name == self.visible_doc_name:
            actual_row = doc.get_actual_row(the_id)
            if actual_row is not None:
                data = {"row": actual_row,
                        "column_header": column_header,
                        "color": color}
                self.mworker.emit_table_message("setCellBackground", data)
