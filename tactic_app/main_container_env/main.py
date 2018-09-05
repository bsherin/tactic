
from gevent import monkey; monkey.patch_all()
import sys
import re
# noinspection PyUnresolvedReferences
import requests
import copy
import pymongo
import gridfs
import datetime
import traceback
import os
import uuid
import markdown
from communication_utils import make_python_object_jsonizable, debinarize_python_object, store_temp_data
from communication_utils import make_jsonizable_and_compress, read_project_dict, read_temp_data, delete_temp_data

from doc_info import docInfo, FreeformDocInfo, PROTECTED_METADATA_KEYS

# noinspection PyUnresolvedReferences
from qworker import task_worthy_methods, task_worthy_manual_submit_methods, error_response_statuses

# getting environment variables
INITIAL_LEFT_FRACTION = .69


if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60


if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"


def task_worthy(m):
    task_worthy_methods[m.__name__] = "mainwindow"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "mainwindow"
    return m


mongo_uri = os.environ.get("MONGO_URI")


# noinspection PyPep8Naming,PyUnusedLocal,PyTypeChecker
class mainWindow(object):
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
        print "entering mainwindow_init"
        self.mworker = mworker
        try:
            client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
            client.server_info()
            # noinspection PyUnresolvedReferences
            self.db = client[db_name]
            self.fs = gridfs.GridFS(self.db)
        except:
            error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            self.mworker.debug_log("error getting pymongo client: " + error_string)
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
        self.project_dict = None
        self.tile_save_results = None
        self.mdata = None
        self.pseudo_tile_id = None
        self.loaded_modules = None
        self.tile_id_dict = {}  # dict with the keys the names of tiles and ids as the values.

        if "project_name" not in data_dict:
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
            if self.doc_type == "notebook":
                self.collection_name = ""
                self.short_collection_name = ""
                self.doc_dict = {}
                self.visible_doc_name = ""
            else:
                self.collection_name = data_dict["collection_name"]
                self.short_collection_name = re.sub("^.*?\.data_collection\.", "", self.collection_name)
                self.doc_dict = self._build_doc_dict()
                self.visible_doc_name = self.doc_dict.keys()[0]

        print "done with init"

    # Save and load-related methods
    @task_worthy_manual_submit
    def compile_save_dict(self, data, task_packet):
        def track_tile_compile_receipts(tile_save_dict):
            tile_id = tile_save_dict["tile_id"]
            del tile_save_dict["tile_id"]
            module_name = tile_save_dict["module_name"]
            if module_name is not None:
                result["used_modules"].append(module_name)
            del tile_save_dict["module_name"]
            tile_save_dicts[tile_id] = tile_save_dict
            if tile_id in tile_ids_to_compile:
                tile_ids_to_compile.remove(tile_id)
            if not tile_ids_to_compile:
                if self.pseudo_tile_id is None:
                    result["pseudo_tile_instance"] = None
                else:
                    result["pseudo_tile_instance"] = tile_save_dicts[self.pseudo_tile_id]
                    del tile_save_dicts[self.pseudo_tile_id]
                result["tile_instances"] = tile_save_dicts
                result["used_tile_types"] = []
                for tid in tile_save_dicts.keys():
                    tile_type = tile_save_dicts[tid]["tile_type"]
                    result["used_tile_types"].append(tile_type)
                self.mworker.submit_response(task_packet, result)
                return
        result = {}
        result["used_modules"] = []

        if self.doc_type == "notebook":
            save_attrs = self.notebook_save_attrs
        else:
            save_attrs = self.save_attrs
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
        tile_save_dicts = {}
        if not self.doc_type == "notebook":
            tile_ids_to_compile = copy.copy(self.tile_instances)
            if not tile_ids_to_compile:
                result["used_tile_types"] = []
                result["used_modules"] = []
                result["pseudo_tile_instance"] = None
                result["tile_instances"] = {}
                if self.purgetiles:
                    result["loaded_modules"] = []
                self.mworker.submit_response(task_packet, result)
                return

            if self.pseudo_tile_id is not None:
                tile_ids_to_compile.append(self.pseudo_tile_id)
                self.mworker.post_task(self.pseudo_tile_id, "compile_save_dict",
                                       callback_func=track_tile_compile_receipts)
            for _tid in self.tile_instances:
                self.mworker.post_task(_tid, "compile_save_dict", callback_func=track_tile_compile_receipts)
        else:
            if self.pseudo_tile_id is not None:
                tile_ids_to_compile = [self.pseudo_tile_id]
                self.mworker.post_task(self.pseudo_tile_id, "compile_save_dict",
                                       callback_func=track_tile_compile_receipts)
            else:
                self.mworker.submit_response(task_packet, result)
        return

    def show_main_message(self, message, timeout=None):
        data = {"message": message, "timeout": timeout, "main_id": self.mworker.my_id}
        self.mworker.post_task("host", "show_main_status_message_task", data)

    def clear_um_message(self, user_manage_id):
        data = {"user_manage_id": user_manage_id}
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

    @task_worthy
    def do_full_notebook_recreation(self, data_dict):
        tile_containers = {}
        try:
            print "Entering do_full_notebook_recreation"
            self.show_main_status_message("Entering do_full_recreation")
            if "unique_id" in data_dict:
                success = self.recreate_from_save("", "", data_dict["unique_id"])
            else:
                success = self.recreate_from_save(data_dict["project_collection_name"], data_dict["project_name"])
            if not success:
                self.show_main_status_message("Error trying to recreate the project from save")
                self.show_error_window(tile_info_dict)
                return

            if self.pseudo_tile_id is None:
                self.create_pseudo_tile()

            matches = re.findall(r"/figure_source/(.*?)/([0-9A-Fa-f-]*)", self.console_html)
            if len(matches) > 0:
                for match in matches:  # really they should all be the same, but loop over just in case
                    self.console_html = re.sub(match[0], self.pseudo_tile_id, self.console_html)

            self.update_legacy_console_html()

            self.clear_main_status_message()
            self.mworker.ask_host("emit_to_client", {"message": "finish-post-load",
                                                     "collection_name": "",
                                                     "short_collection_name": "",
                                                     "doc_names": [],
                                                     "console_html": self.console_html})

        except Exception as ex:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            error_string = "<pre>" + error_string + "</pre>"
            self.show_error_window(error_string)
            container_list = [self.mworker.my_id] + tile_containers.keys()
            self.mworker.ask_host("delete_container_list", {"container_list": container_list})
        return

    def dmsg(self, tname, msg):
        print "rot: {} {}".format(tname, msg)

    @task_worthy_manual_submit
    def recreate_one_tile(self, data, task_packet):
        old_tile_id = data["old_tile_id"]
        tile_save_dict = data["tile_save_dict"]
        tile_name = tile_save_dict["tile_name"]
        new_id = []

        def handle_response_error(task_packet_passed):
            tphrc = copy.copy(task_packet_passed)
            self.tile_sort_list.remove(old_tile_id)
            if "response_data" in tphrc and tphrc["response_data"] is not None:
                response_data = tphrc["response_data"]
            else:
                response_data = {}
            status = tphrc["status"]
            if new_id:
                self.mworker.ask_host("delete_container", {"container_id": new_id[0]})
            if "message" in response_data:
                message = response_data["message"]
            elif "message_string" in response_data:
                message = response_data["message_string"]
            else:
                message = "Got a response error with status {} for event_type {}".format(tphrc["status"],
                                                                                         tphrc["task_type"])
            self.mworker.print_to_console(message, True, True, summary="Project recreation tphrc")
            self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
            return

        def got_module_code(gmc_response):
            tile_code = gmc_response["module_code"]

            def got_container(gtc_response):
                new_id.append(gtc_response["tile_id"])

                def loaded_source(ls_response):

                    def recreate_done(recreate_response):
                        exports = recreate_response["exports"]
                        self.update_pipe_dict(exports, new_id[0], tile_name)
                        self.mworker.emit_export_viewer_message("update_exports_popup", {})

                        def got_form_info(form_info):
                            def rendered_tile(rt_response):
                                recreate_response["tile_html"] = rt_response["tile_html"]
                                self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                                                       {"tile_id": new_id[0]})
                                self.tile_id_dict[tile_name] = new_id[0]
                                self.tile_save_results[new_id[0]] = recreate_response
                                self.tile_sort_list[self.tile_sort_list.index(old_tile_id)] = new_id[0]
                                self.tile_instances.append(new_id[0])
                                self.mworker.ask_host("emit_to_client", {"message": "recreate-saved-tile",
                                                                         "tile_id": new_id[0],
                                                                         "tile_saved_results": recreate_response,
                                                                         "tile_sort_list": self.tile_sort_list})
                                self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
                                return

                            self.mworker.post_task(new_id[0], "render_tile", form_info,
                                                   rendered_tile, expiration=10, error_handler=handle_response_error)

                        self.mworker.post_task(self.mworker.my_id, "compile_form_info_task",
                                               {"tile_id": new_id[0]},
                                               got_form_info, expiration=5, error_handler=handle_response_error)

                    tile_save_dict["new_base_figure_url"] = self.base_figure_url.replace("tile_id", new_id[0])
                    self.mworker.post_task(new_id[0], "recreate_from_save", tile_save_dict, recreate_done,
                                           expiration=10, error_handler=handle_response_error)
                self.mworker.post_task(new_id[0], "load_source", {"tile_code": tile_code}, loaded_source,
                                       expiration=10, error_handler=handle_response_error)

            self.mworker.post_task("host", "create_tile_container",
                                   {"user_id": self.user_id, "parent": self.mworker.my_id, "other_name": tile_name},
                                   got_container, expiration=10, error_handler=handle_response_error)

        self.mworker.post_task("host", "get_module_code",
                               {"user_id": self.user_id, "tile_type": tile_save_dict["tile_type"]},
                               got_module_code, expiration=5, error_handler=handle_response_error)

    @task_worthy
    def do_full_recreation(self, data_dict):

        def track_loaded_modules(tlmdata):
            def track_recreated_tiles(trcdata):
                if trcdata["old_tile_id"] in tiles_to_recreate:
                    tiles_to_recreate.remove(trcdata["old_tile_id"])
                if not tiles_to_recreate:
                    self.clear_main_status_message()
                    self.stop_main_status_spinner()
                return

            if tlmdata["module_name"] in modules_to_load:
                modules_to_load.remove(tlmdata["module_name"])
            if not modules_to_load:
                self.show_main_status_message("Recreating tiles")
                self.tile_save_results = {}

                tiles_to_recreate = self.project_dict["tile_instances"].keys()
                for old_tile_id, tile_save_dict in self.project_dict["tile_instances"].items():
                    data_for_tile = {"old_tile_id": old_tile_id,
                                     "tile_save_dict": tile_save_dict}
                    self.mworker.post_task(self.mworker.my_id, "recreate_one_tile", data_for_tile,
                                           track_recreated_tiles)

        print "Entering do_full_recreation"
        self.show_main_status_message("Entering do_full_recreation")
        self.tile_instances = []
        tile_info_dict, loaded_modules, success = self.recreate_from_save(data_dict["project_collection_name"],
                                                                          data_dict["project_name"])
        if not success:
            self.show_main_status_message("Error trying to recreate the project from save")
            self.show_error_window(tile_info_dict)
            return

        self.show_main_status_message("Recreating the console")

        self.update_legacy_console_html()
        matches = re.findall(r"/figure_source/(.*?)/([0-9A-Fa-f-]*)", self.console_html)
        if len(matches) > 0:
            if self.pseudo_tile_id is None:  # This really shouldn't be necessary
                self.create_pseudo_tile()
            for match in matches:  # really they should all be the same, but loop over just in case
                self.console_html = re.sub(match[0], self.pseudo_tile_id, self.console_html)

        self.mworker.ask_host("emit_to_client", {"message": "finish-post-load",
                                                 "collection_name": self.collection_name,
                                                 "short_collection_name": self.short_collection_name,
                                                 "doc_names": self.doc_names,
                                                 "console_html": self.console_html})

        self.show_main_status_message("Making modules available")
        modules_to_load = copy.copy(loaded_modules)
        for the_module in loaded_modules:
            self.mworker.post_task("host", "load_module_if_necessary",
                                   {"tile_module_name": the_module, "user_id": self.user_id},
                                   track_loaded_modules)
        return

    def recreate_from_save(self, project_collection_name, project_name, unique_id=None):
        if unique_id is None:
            save_dict = self.db[project_collection_name].find_one({"project_name": project_name})
            self.mdata = save_dict["metadata"]
            try:
                project_dict = read_project_dict(self.fs, self.mdata, save_dict["file_id"])
            except Exception as ex:
                error_string = self.handle_exception(ex, "<pre>Error loading project dict</pre>", print_to_console=True)
                print error_string
                return_data = {"success": False, "message_string": error_string}
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
            self.visible_doc_name = self.doc_dict.keys()[0]  # This is necessary for recreating the tiles
            return tile_info_dict, project_dict["loaded_modules"], True
        else:
            return True

    @task_worthy
    def change_collection(self, data_dict):
        try:
            short_collection_name = data_dict["new_collection_name"]
            data = {"user_id": self.user_id, "collection_name": short_collection_name}
            full_collection_name = self.mworker.post_and_wait("host",
                                                              "get_full_collection_name",
                                                              data)["full_collection_name"]
            the_collection = self.db[full_collection_name]
            mdata = the_collection.find_one({"name": "__metadata__"})
            if "type" in mdata and mdata["type"] == "freeform":
                doc_type = "freeform"
            else:
                doc_type = "table"
            if not doc_type == self.doc_type:
                error_string = "Cannot replace a collection with a different type"
                return_data = {"success": False, "message_string": error_string}
                return return_data
            doc_names = []
            self.short_collection_name = short_collection_name
            self.collection_name = full_collection_name
            for f in the_collection.find():
                fname = f["name"].encode("ascii", "ignore")
                if fname == "__metadata__":
                    continue
                else:
                    doc_names.append(fname)
            self.doc_dict = self._build_doc_dict()
            self.visible_doc_name = self.doc_dict.keys()[0]
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
            return_data = {"success": True,
                           "collection_name": self.collection_name,
                           "short_colleciton_name": self.short_collection_name,
                           "doc_names": doc_names}

        except Exception as ex:
            self.mworker.debug_log("got an error in changing collection")
            error_string = self.handle_exception(ex, "<pre>Error changing changing collection</pre>",
                                                 print_to_console=False)
            return_data = {"success": False, "message_string": error_string}
        return return_data

    @task_worthy_manual_submit
    def save_new_project(self, data_dict, task_packet):

        def got_loaded_modules(lm_response):
            self.loaded_modules = lm_response["loaded_modules"]
            self.loaded_modules = [str(the_module) for the_module in self.loaded_modules]

            self.show_main_status_message("compiling save dictionary")

            def got_save_dict(project_dict):
                print "in got_save_dict in main"
                self.mdata = self.create_initial_metadata()
                self.mdata["type"] = self.doc_type
                self.mdata["collection_name"] = self.collection_name
                self.mdata["loaded_tiles"] = project_dict["used_tile_types"]
                self.mdata["save_style"] = "b64save"
                if self.purgetiles:
                    project_dict["loaded_modules"] = project_dict["used_modules"]
                save_dict = {"metadata": self.mdata,
                             "project_name": project_dict["project_name"]}
                self.show_main_status_message("Pickle, convert, compress")
                pdict = make_jsonizable_and_compress(project_dict)
                self.show_main_status_message("Writing the data")
                save_dict["file_id"] = self.fs.put(pdict)
                self.db[self.project_collection_name].insert_one(save_dict)
                self.clear_main_status_message()

                return_data = {"project_name": data_dict["project_name"],
                               "success": True,
                               "message_string": "Project Successfully Saved"}
                self.mworker.submit_response(task_packet, return_data)

            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        try:
            self.project_name = data_dict["project_name"]
            self.purgetiles = data_dict["purgetiles"]
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]

            self.show_main_status_message("Getting loaded modules")
            self.mworker.post_task("host", "get_loaded_user_modules", {"user_id": self.user_id}, got_loaded_modules)

        except Exception as ex:
            self.mworker.debug_log("got an error in save_new_project")
            error_string = self.handle_exception(ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message_string": error_string}
            self.mworker.submit_reponse(task_packet, _return_data)
        return

    @task_worthy
    def console_to_notebook(self, data_dict):
        self.console_html = data_dict["console_html"]
        self.console_cm_code = data_dict["console_cm_code"]

        self.show_main_status_message("compiling save dictionary")
        console_dict = self.compile_save_dict()
        console_dict["doc_type"] = "notebook"
        cdict = make_jsonizable_and_compress(console_dict)
        save_dict = {}
        save_dict["file_id"] = self.fs.put(cdict)
        save_dict["user_id"] = self.user_id
        unique_id = store_temp_data(self.db, save_dict)
        self.mworker.ask_host("emit_to_client", {"message": "notebook-open", "the_id": unique_id})
        return {"success": True}

    @task_worthy_manual_submit
    def save_new_notebook_project(self, data_dict, task_packet):
        # noinspection PyBroadException
        def got_save_dict(project_dict):
            self.mdata = self.create_initial_metadata()
            self.mdata["type"] = self.doc_type
            self.mdata["collection_name"] = ""
            self.mdata["loaded_tiles"] = []
            self.mdata["save_style"] = "b64save"
            save_dict = {"metadata": self.mdata,
                         "project_name": project_dict["project_name"]}
            self.show_main_status_message("Pickle, convert, compress")
            pdict = make_jsonizable_and_compress(project_dict)
            self.show_main_status_message("Writing the data")
            save_dict["file_id"] = self.fs.put(pdict)
            self.db[self.project_collection_name].insert_one(save_dict)
            self.clear_main_status_message()

            return_data = {"project_name": data_dict["project_name"],
                           "success": True,
                           "message_string": "Project Successfully Saved"}
            self.mworker.submit_response(task_packet, return_data)

        try:
            self.project_name = data_dict["project_name"]
            self.purgetiles = True
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]

            self.show_main_status_message("compiling save dictionary")
            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        except Exception as ex:
            self.mworker.debug_log("got an error in save_new_project")
            error_string = self.handle_exception(ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message_string": error_string}
            self.mworker.submit_response(task_packet, _return_data)
        return

    def get_used_tile_types(self):
        result = []
        for tile_id in self.tile_instances:
            result.append(self.get_tile_property(tile_id, "tile_type"))
        return result

    @task_worthy_manual_submit
    def update_project(self, data_dict, task_packet):
        # noinspection PyBroadException
        print "entering update_project"

        def got_loaded_modules(lm_response):
            print "got_loaded_modules"
            if not self.doc_type == "notebook":
                self.loaded_modules = lm_response["loaded_modules"]
                self.loaded_modules = [str(the_module) for the_module in self.loaded_modules]

            self.show_main_status_message("compiling save dictionary")

            def got_save_dict(project_dict):
                print "got save dict in update_project"
                pname = project_dict["project_name"]
                self.mdata["updated"] = datetime.datetime.utcnow()
                self.mdata["save_style"] = "b64save"
                if not self.doc_type == "notebook":
                    self.mdata["collection_name"] = self.collection_name
                    self.mdata["loaded_tiles"] = project_dict["used_tile_types"]
                    if self.purgetiles:
                        project_dict["loaded_modules"] = project_dict["used_modules"]
                self.show_main_status_message("Pickle, convert, compress")
                pdict = make_jsonizable_and_compress(project_dict)
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
                return_data = {"project_name": pname,
                               "success": True,
                               "message": "Project Successfully Saved"}
                self.mworker.submit_response(task_packet, return_data)

            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        try:
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]
            self.show_main_status_message("Getting loaded modules")
            self.mworker.post_task("host", "get_loaded_user_modules", {"user_id": self.user_id}, got_loaded_modules)

        except Exception as ex:
            error_string = self.handle_exception(ex, "Error saving project", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_response(task_worker, _return_data)
        return

    @task_worthy
    def update_project_old(self, data_dict):
        # noinspection PyBroadException
        try:
            self.console_html = data_dict["console_html"]
            self.console_cm_code = data_dict["console_cm_code"]
            if not self.doc_type == "notebook":
                self.show_main_status_message("Getting loaded modules")
                self.loaded_modules = self.mworker.post_and_wait("host", "get_loaded_user_modules",
                                                                 {"user_id": self.user_id})["loaded_modules"]
                self.loaded_modules = [str(the_module) for the_module in self.loaded_modules]
                self.mdata["loaded_tiles"] = self.get_used_tile_types()
                self.mdata["collection_name"] = self.collection_name  # legacy shouldn't be necessary for newer saves
            self.show_main_status_message("compiling save dictionary")
            project_dict = self.compile_save_dict()
            pname = project_dict["project_name"]
            self.mdata["updated"] = datetime.datetime.utcnow()
            self.mdata["save_style"] = "b64save"

            self.show_main_status_message("Pickle, convert, compress")
            pdict = make_jsonizable_and_compress(project_dict)
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
                if "file_id" in f:
                    f["data_rows"] = debinarize_python_object(self.fs.get(f["file_id"]).read())
                result[fname] = docInfo(f)
            else:
                if "encoding" in f:
                    the_text = self.fs.get(f["file_id"]).read().decode(f["encoding"])
                else:
                    the_text = self.fs.get(f["file_id"]).read()
                result[fname] = FreeformDocInfo(f, the_text)
        return result

    def _set_row_column_data(self, doc_name, the_id, column_header, new_content):
        self.doc_dict[doc_name].data_rows[str(the_id)][column_header] = new_content
        return

    def _set_freeform_data(self, doc_name, new_content):
        self.doc_dict[doc_name].data_text = new_content
        return

    @property
    def doc_names(self):
        return sorted([str(key) for key in self.doc_dict.keys()])

    def tablespec_dict(self):
        tdict = {}
        for (key, docinfo) in self.doc_dict.items():
            if docinfo.table_spec:  # This will be false if table_spec == {}
                tdict[key] = docinfo.table_spec.compile_save_dict()
        return tdict

    def create_initial_metadata(self):
        mdata = {"datetime": datetime.datetime.utcnow(),
                 "updated": datetime.datetime.utcnow(),
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
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        error_string = "<pre>" + error_string + "</pre>"
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
    @task_worthy_manual_submit
    def create_tile(self, data_dict, task_packet):
        tile_name = data_dict["tile_name"]
        local_task_packet = task_packet

        def got_container(create_container_dict):
            def got_module_code(code_result):
                data_dict["tile_code"] = code_result["module_code"]

                def loaded_source(result):
                    if not result["success"]:
                        self.mworker.debug_log("got an exception " + result["message_string"])
                        raise Exception(result["message_string"])

                    def instantiated_result(instantiate_result):
                        if not instantiate_result["success"]:
                            self.mworker.debug_log("got an exception " + instantiate_result["message_string"])
                            raise Exception(instantiate_result["message_string"])

                        exports = instantiate_result["exports"]
                        self.update_pipe_dict(exports, tile_container_id, tile_name)

                        def got_form_info(form_info):

                            def got_form_html(response):
                                form_html = response["form_html"]
                                self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                                                       {"tile_id": tile_container_id})
                                self.tile_sort_list.append(tile_container_id)
                                self.current_tile_id += 1
                                response_data = {"success": True, "html": form_html, "tile_id": tile_container_id}
                                self.mworker.submit_response(local_task_packet, response_data)
                            self.mworker.post_task(tile_container_id, "_create_form_html", form_info, got_form_html)
                        self.mworker.post_task(self.mworker.my_id, "compile_form_info_task",
                                               {"tile_id": tile_container_id}, got_form_info)
                    self.mworker.post_task(tile_container_id, "instantiate_tile_class", data_dict, instantiated_result)
                self.mworker.post_task(tile_container_id, "load_source", data_dict, loaded_source)

            if not create_container_dict["success"]:
                raise Exception("Error creating empty tile container")
            tile_container_id = create_container_dict["tile_id"]
            self.tile_instances.append(tile_container_id)
            self.tile_id_dict[tile_name] = tile_container_id

            data_dict["base_figure_url"] = self.base_figure_url.replace("tile_id", tile_container_id)
            data_dict["doc_type"] = self.doc_type

            self.mworker.post_task("host", "get_module_code", data_dict, got_module_code)

        self.mworker.post_task("host", "create_tile_container", {"user_id": self.user_id, "parent": self.mworker.my_id,
                               "other_name": tile_name}, got_container)
        return

    @task_worthy
    def get_column_data(self, data):
        result = []
        ddata = copy.copy(data)
        for doc_name in self.doc_dict.keys():
            ddata["doc_name"] = doc_name
            result += self.get_column_data_for_doc(ddata)
        return result

    def sort_rows(self, row_dict):
        result = []
        sorted_int_keys = sorted([int(key) for key in row_dict.keys()])
        for r in sorted_int_keys:
            result.append(row_dict[str(r)])
        return result

    @task_worthy_manual_submit
    def get_user_collection(self, task_data, task_packet):
        local_task_packet = task_packet

        def finish_get_user_collection(response_data):
            full_collection_name = response_data["full_collection_name"]
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
                    if "file_id" in f:
                        f["data_rows"] = debinarize_python_object(self.fs.get(f["file_id"]).read())
                    result[fname] = self.sort_rows(f["data_rows"])
                else:
                    if "encoding" in f:
                        result[fname] = self.fs.get(f["file_id"]).read().decode(f["encoding"])
                    else:
                        result[fname] = self.fs.get(f["file_id"]).read()

            self.mworker.submit_response(local_task_packet, {"the_collection": result})
            return
        self.mworker.post_task("host", "get_full_collection_name", task_data, finish_get_user_collection)
        return

    @task_worthy
    def get_document_data(self, data):
        doc_name = data["document_name"]
        return self.doc_dict[doc_name].all_data

    @task_worthy
    def get_document_metadata(self, data):
        doc_name = data["document_name"]
        mdata = self.doc_dict[doc_name].metadata
        mdata["name"] = doc_name  # legacy Some older tiles expect this to be in the metadata
        return mdata

    @task_worthy
    def set_document_metadata(self, data):
        doc_name = data["document_name"]
        self.doc_dict[doc_name].set_additional_metadata(data["metadata"])
        return None

    @task_worthy
    def get_document_data_as_list(self, data):
        doc_name = data["document_name"]
        data_list = self.doc_dict[doc_name].all_sorted_data_rows
        return {"data_list": data_list}

    @task_worthy
    def get_column_names(self, data):
        doc_name = data["document_name"]
        header_list = self.doc_dict[doc_name].table_spec.header_list
        return {"header_list": header_list}

    @task_worthy
    def get_number_rows(self, data):
        doc_name = data["document_name"]
        nrows = self.doc_dict[doc_name].number_of_rows
        return {"number_rows": nrows}

    @task_worthy
    def SendTileMessage(self, data):
        tile_id = self.tile_id_dict[data["tile_name"]]
        self.mworker.post_task(tile_id, "TileMessage", data)
        return None

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
            self.mworker.distribute_event("DocChange", data)
        self.visible_doc_name = doc_name
        return {"success": True}

    @task_worthy
    def print_to_console_event(self, data):
        to_print = self.move_figures_to_pseudo_tile(data["print_string"])
        return self.mworker.print_to_console(to_print,
                                             force_open=data["force_open"],
                                             is_error=data["is_error"],
                                             summary=data["summary"])

    @task_worthy
    def create_console_code_area(self, data):
        unique_id = str(uuid.uuid4())
        return self.mworker.print_code_area_to_console(unique_id, force_open=True)

    @task_worthy
    def create_blank_text_area(self, data):
        unique_id = str(uuid.uuid4())
        return self.mworker.print_text_area_to_console(unique_id, force_open=True)

    @task_worthy
    def got_console_result(self, data):
        self.mworker.emit_table_message("stopConsoleSpinner", {"console_id": data["console_id"],
                                                               "force_open": True})
        return {"success": True}

    @task_worthy
    def got_console_print(self, data):
        self.mworker.emit_table_message("consoleCodePrint", {"message_string": data["result_string"],
                                                             "console_id": data["console_id"],
                                                             "force_open": True})
        return {"success": True}

    @task_worthy
    def exec_console_code(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        the_code = data["the_code"]
        self.dict = self._pipe_dict
        data["pipe_dict"] = self.dict
        self.mworker.post_task(self.pseudo_tile_id, "exec_console_code", data, self.got_console_result)
        return {"success": True}

    @task_worthy
    def convert_markdown(self, data):
        the_text = data["the_text"]
        the_text = re.sub("<br>", "\n", the_text)
        the_text = re.sub("&gt;", ">", the_text)
        the_text = re.sub("&nbsp;", " ", the_text)
        converted_markdown = markdown.markdown(the_text)
        return {"success": True, "converted_markdown": converted_markdown}

    @task_worthy
    def clear_console_namespace(self, data):
        self.show_main_message("Resetting notebook ...")
        if self.pseudo_tile_id is not None:
            self.mworker.post_task(self.pseudo_tile_id, "kill_me", {})

            def container_restarted(nodata):
                data_dict = {"base_figure_url": self.base_figure_url.replace("tile_id", self.pseudo_tile_id),
                             "doc_type": self.doc_type, "globals_dict": {}, "img_dict": {}}

                def instantiate_done(instantiate_result):
                    if not instantiate_result["success"]:
                        self.mworker.debug_log("got an exception " + instantiate_result["message_string"])
                        self.show_main_message("Error resetting notebook", 7)
                        raise Exception(instantiate_result["message_string"])
                    self.show_main_message("Notebook reset", 7)
                self.mworker.post_task(self.pseudo_tile_id, "instantiate_as_pseudo_tile", data_dict, instantiate_done)
            self.mworker.post_task("host", "restart_container", {"tile_id": self.pseudo_tile_id}, container_restarted)
        self.show_main_message("Notebook reset", 7)
        return {"success": True}

    def get_exports_list_html_old(self, data):
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
    def get_exports_list_html(self, data):
        the_html = ""
        export_list = []
        for tile_id, tile_entry in self._pipe_dict.items():
            first_full_name = tile_entry.keys()[0]
            first_short_name = tile_entry.values()[0]["export_name"]
            tile_name = re.sub("_" + first_short_name, "", first_full_name)
            group_created = False
            group_html = "<optgroup label={}>".format(tile_name)
            group_len = 0
            first_one = True
            for full_export_name, edict in tile_entry.items():
                export_list.append(full_export_name)
                group_len += 1
                if first_one:
                    group_html += self.select_option_val_selected_template.format(full_export_name,
                                                                                  edict["export_name"])
                    first_one = False
                else:
                    group_html += self.select_option_val_template.format(full_export_name, edict["export_name"])
            if group_len > 0:
                group_html += "</optgroup>"
                the_html += group_html
        return {"success": True, "the_html": the_html, "export_list": export_list}

    @task_worthy_manual_submit
    def evaluate_export(self, data, task_packet):
        local_task_packet = task_packet
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        ndata = {}
        ndata["export_name"] = data["export_name"]
        ndata["pipe_dict"] = self._pipe_dict
        if "key" in data:
            ndata["key"] = data["key"]
        ndata["tail"] = data["tail"]

        def got_evaluation(eval_result):
            self.mworker.submit_response(local_task_packet, eval_result)
            return

        self.mworker.post_task(self.pseudo_tile_id, "_evaluate_export", ndata, got_evaluation)
        return

    @task_worthy_manual_submit
    def get_export_info(self, data, task_packet):
        local_task_packet = task_packet
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        ndata = {}
        ndata["export_name"] = data["export_name"]
        ndata["pipe_dict"] = self._pipe_dict

        def got_info(info):
            self.mworker.submit_response(local_task_packet, info)
            return

        self.mworker.post_task(self.pseudo_tile_id, "_get_export_info", ndata, got_info)
        return

    def create_pseudo_tile(self, globals_dict=None):
        data = self.mworker.post_and_wait("host", "create_tile_container", {"user_id": self.user_id,
                                                                            "parent": self.mworker.my_id,
                                                                            "other_name": "pseudo_tile"})
        if not data["success"]:
            raise Exception("Error creating empty tile container")
        self.pseudo_tile_id = data["tile_id"]
        if globals_dict is None:
            globals_dict = {}
        data_dict = {"base_figure_url": self.base_figure_url.replace("tile_id", self.pseudo_tile_id),
                     "doc_type": self.doc_type, "globals_dict": globals_dict}
        instantiate_result = self.mworker.post_and_wait(self.pseudo_tile_id,
                                                        "instantiate_as_pseudo_tile", data_dict)
        if not instantiate_result["success"]:
            self.mworker.debug_log("got an exception " + instantiate_result["message_string"])
            raise Exception(instantiate_result["message_string"])

        return {"success": True}

    @task_worthy
    def get_property(self, data_dict):
        allowed_properties = ["doc_names", "visible_doc_name", "selected_text"]
        prop_name = data_dict["property"]
        if prop_name in allowed_properties:
            val = getattr(self, prop_name)
            return {"success": True, "val": val}
        else:
            return {"success": False, "val": None}

    @task_worthy
    def export_data(self, data):
        mdata = self.create_initial_metadata()
        mdata["name"] = "__metadata__"
        mdata["type"] = self.doc_type
        full_collection_name = data["full_collection_name"]
        self.db[full_collection_name].insert_one(mdata)
        for docinfo in self.doc_dict.values():
            tspec = docinfo.table_spec.compile_save_dict()
            if self.doc_type == "freeform":
                ddict = {"name": docinfo.name, "data_text": docinfo.data_text,
                         "metadata": docinfo.metadata, "table_spec": tspec}
            else:
                ddict = {"name": docinfo.name, "data_rows": docinfo.data_rows,
                         "metadata": docinfo.metadata, "table_spec": tspec}
            self.db[full_collection_name].insert_one(ddict)
        return {"success": True}

    def finish_create_collection(self, response_data, context_data):
        full_collection_name = response_data["full_collection_name"]
        mdata = self.create_initial_metadata()
        mdata["name"] = "__metadata__"
        doc_dict = context_data["doc_dict"]
        mdata["number_of_docs"] = len(doc_dict.keys())
        doc_type = context_data["doc_type"]
        document_metadata = context_data["doc_metadata"]
        if document_metadata is None:
            document_metadata = {}
        if doc_type == "table":
            mdata["type"] = "table"
            self.db[full_collection_name].insert_one(mdata)
            for docname, doc_as_list in doc_dict.items():
                header_list = doc_as_list[0].keys()
                doc_as_dict = {}
                for r, the_row in enumerate(doc_as_list):
                    if "__id__" in the_row:
                        del the_row["__id__"]
                    if "__filename__" in the_row:
                        del the_row["__filename__"]
                    the_row["__id__"] = r
                    the_row["__filename__"] = docname
                    doc_as_dict[str(r)] = the_row
                header_list = ["__id__", "__filename__"] + header_list
                table_spec = {"doc_name": docname, "header_list": header_list}
                metadata = {}
                if docname in document_metadata:
                    for k, val in document_metadata[docname].items():
                        if k not in PROTECTED_METADATA_KEYS:
                            metadata[k] = val
                ddict = {"name": docname, "data_rows": doc_as_dict, "table_spec": table_spec, "metadata": metadata}
                self.db[full_collection_name].insert_one(ddict)
        else:
            mdata["type"] = "freeform"
            self.db[full_collection_name].insert_one(mdata)
            for docname, doc in doc_dict.items():
                file_id = self.fs.put(str(doc))

                metadata = {}
                if docname in document_metadata:
                    for k, val in document_metadata[docname].items():
                        if k not in PROTECTED_METADATA_KEYS:
                            metadata[k] = val
                ddict = {"name": docname, "file_id": file_id, "metadata": metadata}
                self.db[full_collection_name].insert_one(ddict)
            self.mworker.ask_host("update_collection_selector_list", {"user_id": self.user_id})
        return {"success": True}

    @task_worthy
    def create_collection(self, data):
        new_name = data["name"]
        self.mworker.post_task("host",
                               "get_full_collection_name",
                               {"collection_name": new_name,
                                "user_id": self.user_id},
                               self.finish_create_collection,
                               data)
        return {"success": True}

    @task_worthy
    def get_pseudo_tile_id(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        return {"success": True, "pseudo_tile_id": self.pseudo_tile_id}

    @task_worthy
    def get_tile_ids(self, data):
        tile_ids = self.tile_instances
        if self.pseudo_tile_id is not None:
            tile_ids.append(self.pseudo_tile_id)
        return {"success": True, "tile_ids": tile_ids}

    @task_worthy
    def set_property(self, data_dict):
        prop_name = data_dict["property"]
        val = data_dict["val"]
        setattr(self, prop_name, val)
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
                    "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict(),
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
                    "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict(),
                    "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                    "max_table_size": self.doc_dict[doc_name].max_table_size,
                    "tile_save_results": self.tile_save_results}
        else:
            return {"doc_name": doc_name,
                    "is_shrunk": self.is_shrunk,
                    "tile_ids": self.tile_sort_list,
                    "left_fraction": self.left_fraction,
                    "data_text": self.doc_dict[doc_name].data_text,
                    "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict(),
                    "tile_save_results": self.tile_save_results}

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

    @task_worthy_manual_submit
    def compile_form_info_task(self, data, task_packet):
        local_task_packet = task_packet
        tile_id = data["tile_id"]

        def got_form_data(form_data):
            if tile_id is None:
                other_tile_names = self.tile_id_dict.keys()
            else:
                other_tile_names = self.get_other_tile_names(tile_id)
            form_info = {"current_header_list": self.current_header_list,
                         "pipe_dict": self._pipe_dict,
                         "doc_names": self.doc_names,
                         "list_names": form_data["list_names"],
                         "function_names": form_data["function_names"],
                         "class_names": form_data["class_names"],
                         "collection_names": form_data["collection_names"],
                         "other_tile_names": other_tile_names}
            self.mworker.submit_response(task_packet, form_info)
            return
        self.mworker.post_task("host", "get_lists_classes_functions", {"user_id": self.user_id}, got_form_data)
        return

    @task_worthy
    def rebuild_tile_forms_task(self, ddict):
        if "tile_id" not in ddict:
            tile_id = None
        else:
            tile_id = ddict["tile_id"]

        def finish_rebuild_tile_forms(form_data):
            if tile_id is None:
                other_tile_names = self.tile_id_dict.keys()
            else:
                other_tile_names = self.get_other_tile_names(tile_id)
            form_info = {"current_header_list": self.current_header_list,
                         "pipe_dict": self._pipe_dict,
                         "doc_names": self.doc_names,
                         "list_names": form_data["list_names"],
                         "function_names": form_data["function_names"],
                         "class_names": form_data["class_names"],
                         "collection_names": form_data["collection_names"],
                         "other_tile_names": other_tile_names}
            for tid in self.tile_instances:
                if tile_id is None or not tid == tile_id:
                    form_info["other_tile_names"] = self.get_other_tile_names(tid)
                    self.mworker.post_task(tid, "RebuildTileForms", form_info)
            return

        self.mworker.post_task("host",
                               "get_lists_classes_functions",
                               {"user_id": self.user_id},
                               finish_rebuild_tile_forms)
        return

    @task_worthy_manual_submit
    def reload_tile(self, ddict, task_packet):
        local_task_packet = task_packet
        tile_id = ddict["tile_id"]

        def got_tile_type(gtp_response):
            tile_type = gtp_response["val"]
            data = {"tile_type": tile_type, "user_id": self.user_id}

            def got_module_code(code_result):
                module_code = code_result["module_code"]

                def got_reload_attrs(gra_response):
                    reload_dict = copy.copy(gra_response["val"])

                    def got_current_options(gco_response):
                        saved_options = copy.copy(gco_response["val"])
                        reload_dict.update(saved_options)
                        reload_dict["old_option_names"] = saved_options.keys()
                        self.mworker.post_task(tile_id, "kill_me", {})
                        self.mworker.post_task("host", "restart_container", {"tile_id": tile_id})

                        def loaded_source(result):
                            if not result["success"]:
                                raise Exception(result["message_string"])

                            def got_form_info(form_info):
                                reload_dict["form_info"] = form_info

                                def reinstantiate_done(reinst_result):
                                    if reinst_result["success"]:
                                        exports = reinst_result["exports"]  # This is the issue
                                        self.update_pipe_dict(exports, tile_id, ddict["tile_name"])
                                        form_info["pipe_dict"] = self._pipe_dict
                                        self.rebuild_other_tile_forms(tile_id, form_info)
                                        self.mworker.emit_export_viewer_message("update_exports_popup", {})
                                        final_result = {"success": True, "html": reinst_result["form_html"],
                                                        "options_changed": reinst_result["options_changed"]}
                                        self.mworker.submit_response(local_task_packet, final_result)
                                    else:
                                        raise Exception(reinst_result["message_string"])

                                self.mworker.post_task(tile_id, "reinstantiate_tile", reload_dict, reinstantiate_done)

                            self.mworker.post_task(self.mworker.my_id, "compile_form_info_task", {"tile_id": tile_id},
                                                   got_form_info)
                        self.mworker.post_task(tile_id, "load_source", {"tile_code": module_code}, loaded_source)
                    self.get_tile_property(tile_id, "_current_options", got_current_options)
                self.get_tile_property(tile_id, "_current_reload_attrs", got_reload_attrs)
            self.mworker.post_task("host", "get_module_code", data, got_module_code)

        self.get_tile_property(tile_id, "tile_type", got_tile_type)

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
                "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict(),
                "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                "max_table_size": self.doc_dict[doc_name].max_table_size,
                "actual_row": self.doc_dict[doc_name].get_actual_row(row_id)}

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
        success = self.mworker.distribute_event(event_name, data_dict, tile_id)
        return {"success": success}

    @task_worthy
    def grab_next_chunk(self, data_dict):
        doc_name = data_dict["doc_name"]
        step_amount = self.doc_dict[doc_name].advance_to_next_chunk()
        return {"doc_name": doc_name,
                "data_rows": self.doc_dict[doc_name].displayed_data_rows,
                "background_colors": self.doc_dict[doc_name].displayed_background_colors,
                "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict(),
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
                "header_list": self.doc_dict[doc_name].table_spec.header_list,
                "is_last_chunk": self.doc_dict[doc_name].is_last_chunk,
                "is_first_chunk": self.doc_dict[doc_name].is_first_chunk,
                "step_size": step_amount}

    @task_worthy
    def RemoveTile(self, data):
        self._delete_tile_instance(data["tile_id"])
        return None

    def get_other_tile_names(self, tile_id):
        other_tile_names = []
        for n, tid in self.tile_id_dict.items():
            if not tid == tile_id:
                other_tile_names.append(n)
        return other_tile_names

    @task_worthy
    def UpdateHeaderListOrder(self, data):
        header_list = data["header_list"]
        hidden_columns_list = data["hidden_columns_list"]
        if "doc_name" in data:
            doc = self.doc_dict[data["doc_name"]]
            doc.table_spec.header_list = header_list
            doc.table_spec.hidden_columns_list = hidden_columns_list
        else:
            for doc in self.doc_dict.values():
                current_list = doc.table_spec.header_list
                doc.table_spec.header_list = header_list
                doc.table_spec.hidden_columns_list = hidden_columns_list
                for header in current_list:
                    if header not in header_list:
                        doc.table_spec.header_list.append(header)

        self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
        return None

    @task_worthy
    def HideColumnInAllDocs(self, data):
        column_name = data["column_name"]
        for doc in self.doc_dict.values():
            if column_name in doc.table_spec.header_list and column_name not in doc.table_spec.hidden_columns_list:
                doc.table_spec.hidden_columns_list.append(column_name)
        return None

    @task_worthy
    def UpdateColumnWidths(self, data):
        doc = self.doc_dict[data["doc_name"]]
        doc.table_spec.column_widths = data["column_widths"]
        # doc.table_spec.table_width = data["table_width"]
        return None

    @task_worthy
    def CreateColumn(self, data):
        column_name = data["column_name"]
        if not data["all_docs"]:
            doc = self.doc_dict[data["doc_name"]]
            doc.table_spec.header_list.append(column_name)
            doc.table_spec.column_widths.append(data["column_width"])
            for r in doc.data_rows.values():
                r[column_name] = ""
        else:
            for doc in self.doc_dict.values():
                doc.table_spec.header_list.append(column_name)
                if doc.table_spec.column_widths is not None:
                    doc.table_spec.column_widths.append(data["column_width"])
                for r in doc.data_rows.values():
                    r[column_name] = ""

        self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
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
        self.mworker.emit_table_message("dehighlightAllText")
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
            self.mworker.emit_table_message("colorTxtInCell", data)
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
                self.mworker.emit_table_message("setFreeformContent", data)
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
        if "force_open" in data:
            force_open = data["force_open"]
        else:
            force_open = True
        if "is_error" in data:
            is_error = data["is_error"]
        else:
            is_error = False
        self.mworker.print_to_console(data["message"], force_open, is_error)
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

    # stopped here

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
                self.mworker.emit_table_message("setCellBackground", data)
