
import datetime
import re
import os
import uuid
import copy
import json
from flask import render_template
from qworker import task_worthy_methods, task_worthy_manual_submit_methods
from loaded_tile_management import loaded_tile_manager
from communication_utils import make_python_object_jsonizable, debinarize_python_object
from communication_utils import make_jsonizable_and_compress
from mongo_accesser import bytes_to_string, NameExistsError
from qworker import debug_log
import base64

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))

def task_worthy(m):
    task_worthy_methods[m.__name__] = "mainwindow"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "mainwindow"
    return m

class StateTasksMixin:
    @task_worthy
    def SaveTableSpec(self, data):
        new_spec = data["tablespec"]
        sess = self.get_session(data["sid"])
        collection_info = sess.collection_info
        collection_info.set_table_spec_from_dict(new_spec)
        return None

    @task_worthy
    def UpdateLeftFraction(self, data):
        sess = self.get_session(data["sid"])
        sess.left_fraction = data["leftfraction"]
        return None

    @task_worthy
    def UpdateTableShrinkState(self, data):
        sess = self.get_session(data["sid"])
        sess.is_shrunk = data["is_shrunk"]
        return None

    @task_worthy
    def TextSelect(self, data):
        sess = self.get_session(data["sid"])
        sess.selected_text = data["selected_text"]
        return None

# noinspection PyUnusedLocal
class LoadSaveTasksMixin:
    @task_worthy

    def end_session_task(self, data):
        sess = self.get_session(data["sid"])
        sess.end_session()
        return

    @task_worthy_manual_submit
    def initialize_session_for_new_notebook(self, data, task_packet):
        user_id = data["user_id"]
        username = data["username"]
        project_name = ""
        self.base_figure_url = data.get("base_figure_url", "")
        local_id = data.get("local_id", str(uuid.uuid4()))
        sdict = {
            "user_id": data["user_id"],
            "username": username,
            "base_figure_url": data.get("base_figure_url", ""),
            "doc_type": "notebook",
        }

        self.ss.initialize_session(local_id, sdict)
        sess = self.get_session(local_id)
        print('returned from create_pseudo_tile')
        doc_type = sess.doc_type
        is_notebook = doc_type == 'notebook' or doc_type == 'jupyter'

        def got_openai_api_key(key_data):
            sess.openai_api_key = key_data["api_key"]

        self.mworker.ask_host(local_id, "get_openai_api_key", {"user_id": user_id}, got_openai_api_key)

        temp_data_id = data.get("temp_data_id", "")

        data_dict = {
            "success": True,
            "temp_data_id": temp_data_id,
            "res_type": "project",
            "project_name": "",
            "resource_name": "new_notebook",
            "local_id": local_id,
            "collection_name": "",
            "doc_names": [],
            "is_legacy_save": False,
            "short_collection_name": "",
            "doc_type": "notebook",
            "is_table": False,
            "is_notebook": True,
            "is_freeform": "False",
            "is_jupyter": False,
            "is_project": False,
            "kind": "notebook-viewer",
            "tile_types": [],
            "base_figure_url": self.base_figure_url
        }
        self.mworker.submit_response(task_packet, data_dict)
        return

    @task_worthy_manual_submit
    def initialize_session_for_new_project(self, data, task_packet):
        local_id = data.get("local_id", str(uuid.uuid4()))
        username = data["username"]
        base_figure_url = data.get("base_figure_url", "")
        doc_type = "none"
        sdict = {
            "user_id": data["user_id"],
            "username": username,
            "base_figure_url": data.get("base_figure_url", ""),
            "short_collection_name": "",
            "collection_name": "",
            "doc_type": doc_type,
        }
        self.ss.initialize_session(local_id, sdict)
        sess = self.get_session(local_id)

        # self.create_pseudo_tile(local_id)
        doc_type = sess.doc_type
        is_notebook = False

        def got_openai_api_key(key_data):
            sess.openai_api_key = key_data["api_key"]

        self.mworker.ask_host(local_id, "get_openai_api_key", {"user_id": sess.user_id}, got_openai_api_key)

        data_dict = {
            "success": True,
            "kind": "main-viewer",
            "res_type": "project",
            "project_name": "",
            "resource_name": "new_project",
            "local_id": local_id,
            "is_legacy_save": False,
            "temp_data_id": "",
            "collection_name": "",
            "short_collection_name": "",
            "doc_type": doc_type,
            "is_table": False,
            "is_notebook": False,
            "is_freeform": False,
            "is_jupyter": False,
            "is_project": False,
            "doc_names": [],
        }

        def got_tile_types(ttdata):
            print("in got_tile_types in initialize_session")
            data_dict["tile_types"] = ttdata["tile_types"]
            data_dict["icon_dict"] = ttdata["icon_dict"]
            self.mworker.submit_response(task_packet, data_dict)

        self.mworker.post_task("host", "get_tile_types_task", {"user_id": sess.user_id}, got_tile_types)
        return

    @task_worthy_manual_submit
    def initialize_session_from_collection(self, data, task_packet):
        local_id = data.get("local_id", str(uuid.uuid4()))
        short_collection_name = data["collection_name"]
        username = data["username"]
        base_figure_url = data.get("base_figure_url", "")
        doc_type = self.get_doc_type(short_collection_name, username)
        sdict = {
            "user_id": data["user_id"],
            "username": username,
            "base_figure_url": data.get("base_figure_url", ""),
            "short_collection_name": short_collection_name,
            "collection_name": short_collection_name,
            "doc_type": doc_type,
        }
        self.ss.initialize_session(local_id, sdict)
        sess = self.get_session(local_id)

        # self.create_pseudo_tile(local_id)
        self.build_doc_dict(local_id)
        doc_type = sess.doc_type
        is_notebook = False

        def got_openai_api_key(key_data):
            sess.openai_api_key = key_data["api_key"]

        self.mworker.ask_host(local_id, "get_openai_api_key", {"user_id": sess.user_id}, got_openai_api_key)
        collection_info = sess.collection_info

        data_dict = {
            "success": True,
            "kind": "main-viewer",
            "res_type": "collection",
            "project_name": "",
            "resource_name": short_collection_name,
            "local_id": local_id,
            "is_legacy_save": False,
            "temp_data_id": "",
            "collection_name": sess.collection_name,
            "short_collection_name": sess.short_collection_name,
            "doc_type": doc_type,
            "is_table": (doc_type == "table"),
            "is_notebook": is_notebook,
            "is_freeform": (doc_type == 'freeform'),
            "is_jupyter": (doc_type == 'jupyter'),
            "is_project": False,
            "doc_names": collection_info.doc_names,
        }

        def got_tile_types(ttdata):
            print("in got_tile_types in initialize_session")
            data_dict["tile_types"] = ttdata["tile_types"]
            data_dict["icon_dict"] = ttdata["icon_dict"]
            if doc_type == "table":
                data_dict.update(self.grab_chunk_by_row_index(
                    {"sid": local_id,
                     "doc_name": sess.visible_doc_name,
                     "row_index": 0,
                     "set_visible_doc": False}))
            elif doc_type == "freeform":
                data_dict.update(
                    self.grab_freeform_data({"sid": local_id, "doc_name": sess.visible_doc_name, "set_visible_doc": True}))

            self.mworker.submit_response(task_packet, data_dict)
        self.mworker.post_task("host", "get_tile_types_task", {"user_id": sess.user_id}, got_tile_types)
        return

    @task_worthy_manual_submit
    def initialize_session_from_save(self, data, task_packet):
        print("entering initialize_session_from_save")
        user_id = data["user_id"]
        username = data["username"]
        project_name = data["project_name"]
        self.base_figure_url = data.get("base_figure_url", "")
        local_id = data.get("local_id", str(uuid.uuid4()))
        sdict, interface_state, globals_dict = self.recreate_from_save(local_id, project_name, username)
        sdict["username"] = username
        sdict["user_id"] = user_id
        sdict["ppi"] = data["ppi"]
        doc_type = sdict["doc_type"]
        self.ss.initialize_session(local_id, sdict)
        sess = self.get_session(local_id)
        self.create_pseudo_tile(local_id, globals_dict)
        doc_type = sess.doc_type
        is_notebook = doc_type == 'notebook' or doc_type == 'jupyter'

        def got_openai_api_key(key_data):
            sess.openai_api_key = key_data["api_key"]

        self.mworker.ask_host(local_id, "get_openai_api_key", {"user_id": user_id}, got_openai_api_key)

        collection_info = sess.collection_info

        data_dict = {
            "success": True,
            "res_type": "project",
            "project_name": project_name,
            "resource_name": project_name,
            "local_id": local_id,
            "is_legacy_save": sess.is_legacy_save,
            "temp_data_id": "",
            "collection_name": sess.collection_name,
            "doc_names": collection_info.doc_names,
            "short_collection_name": sess.short_collection_name,
            "doc_type": doc_type,
            "is_table": (doc_type == "table"),
            "is_notebook": is_notebook,
            "is_freeform": (doc_type == 'freeform'),
            "is_jupyter": (doc_type == 'jupyter'),
            "is_project": True,
        }
        if is_notebook:
            data_dict["kind"] = "notebook-viewer"
            data_dict["tile_types"] = []
            data_dict["icon_dict"] = {}
            data_dict["interface_state"] = interface_state
            self.mworker.submit_response(task_packet, data_dict)

        data_dict["kind"] = "main-viewer"

        def got_tile_types(ttdata):
            print("in got_tile_types in initialize_session")
            data_dict["tile_types"] = ttdata["tile_types"]
            data_dict["icon_dict"] = ttdata["icon_dict"]
            if doc_type == "table":
                data_dict.update(self.grab_chunk_by_row_index(
                    {"sid": local_id,
                     "doc_name": sess.visible_doc_name,
                     "row_index": 0,
                     "set_visible_doc": False}))
            elif doc_type == "freeform":
                data_dict.update(
                    self.grab_freeform_data({"doc_name": sess.visible_doc_name, "set_visible_doc": True}))
            def got_new_ids(nd_data):
                for tile_entry in interface_state["tile_list"]:
                    prior_id = tile_entry["tile_id"]
                    tile_info = sess.tile_info
                    current_id = tile_info.current_from_old(prior_id)
                    if current_id is None:
                        print("Error: prior_id {} not found in tile_info".format(prior_id))
                    else:
                        tile_entry["tile_id"] = current_id
                data_dict["interface_state"] = interface_state
                print("submitting response")
                self.mworker.submit_response(task_packet, data_dict)
                return

            self.mworker.post_task(self.mworker.my_id, "get_new_tile_ids", {"sid": local_id}, got_new_ids)

        self.mworker.post_task("host", "get_tile_types_task", {"user_id": user_id}, got_tile_types)
        return

    @task_worthy_manual_submit
    def get_new_tile_ids(self, data, task_packet):
        sid = data["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        def got_new_ids(new_id_data):
            new_ids = new_id_data["new_ids"]
            new_creds = new_id_data["new_creds"]
            if len(new_ids) > 0:
                for n, old_id in enumerate(tile_info.tile_ids):
                    print("old_id", old_id)
                    tile_info.update_id(old_id, new_ids[n])
                    tile_info.set_creds(new_ids[n], new_creds[n])
                self.mworker.submit_response(task_packet)
        sess = self.get_session(data["sid"])
        tile_info = sess.tile_info
        tile_names = tile_info.tile_names
        if len(tile_names) == 0:
            got_new_ids({"success": True, "new_ids": [], "new_creds": []})
        self.mworker.post_task(self.mworker.my_id, "create_n_tile_containers",
                               {"sid": data["sid"], "number_to_create": len(tile_names), "tile_names": tile_names},
                               callback_func=got_new_ids)

    @task_worthy_manual_submit
    def load_modules(self, data, task_packet):
        sess = self.get_session(data["sid"])
        modules_to_load = copy.copy(sess.used_modules)

        def track_loaded_modules(tlmdata):
            if tlmdata is not None:
                if tlmdata["module_name"] in modules_to_load:
                    modules_to_load.remove(tlmdata["module_name"])
            if not modules_to_load:
                self.mworker.submit_response(task_packet)
                return

        if not modules_to_load:
            self.mworker.submit_response(task_packet)
        else:
            for the_module in modules_to_load:
                self.mworker.post_task("host", "load_module_if_necessary",
                                       {"tile_module_name": the_module, "user_id": sess.user_id},
                                       track_loaded_modules)
        return

    @task_worthy_manual_submit
    def recreate_tiles(self, data, task_packet):
        sid = data["local_id"]
        sess = self.get_session(sid)
        def modules_loaded(mldata):
            tile_info = sess.tile_info
            def track_recreated_tiles(trcdata):
                if trcdata["tile_id"] in tiles_to_recreate:
                    if trcdata["success"]:
                        self.mworker.emit_to_main_client(sid, "tile-finished-loading",
                                                         {"message": "tile-finished-loading",
                                                          "success": True,
                                                          "tile_id": trcdata["tile_id"]})
                        tiles_to_recreate.remove(trcdata["tile_id"])
                    else:
                        print("tile failed to load properly")
                        tiles_to_recreate.remove(trcdata["tile_id"])
                if not tiles_to_recreate:
                    self.mworker.post_task("main_service", "rebuild_tile_forms_task",
                                           {"sid": sid})
                    self.emit_clear_status(sid)
                    self.emit_stop_status_spinner(sid)
            self.emit_status_message(sid, "Recreating tiles")
            if len(tile_info.tile_ids) == 0:
                self.mworker.post_task("main_service", "rebuild_tile_forms_task", {"sid": sid})
                self.emit_clear_status(sid)
                self.emit_stop_status_spinner(sid)
                return

            tiles_to_recreate = tile_info.tile_ids
            for tile_id in tiles_to_recreate:
                tdict = tile_info.get_tile_params(tile_id)
                data_for_tile = {"tile_id": tile_id, "creds": tdict["creds"],
                                 "tile_save_dict": tdict["tile_save_dict"], "sid": sid}
                self.mworker.post_task("main_service", "recreate_one_tile", data_for_tile,
                                       track_recreated_tiles)

        self.mworker.post_task("main_service", "load_modules", {"sid": sid}, modules_loaded)

    @task_worthy_manual_submit
    def compile_save_dict(self, data, task_packet):
        sess = self.get_session(data["sid"])
        is_lite = "lite_save" in data and data["lite_save"]

        def track_tile_compile_receipts(tile_save_dict):
            tile_id = tile_save_dict["tile_id"]
            del tile_save_dict["tile_id"]
            module_name = tile_save_dict["module_name"]
            if "tile_type" in tile_save_dict:
                print("got tile_type " + str(tile_save_dict["tile_type"]))
            else:
                print("no tile_type")
            if module_name is not None:
                result["used_modules"].append(module_name)
            del tile_save_dict["module_name"]
            tile_save_dicts[tile_id] = tile_save_dict
            if tile_id in tile_ids_to_compile:
                tile_ids_to_compile.remove(tile_id)
            if not tile_ids_to_compile:
                print("compiled all tile_ids")
                if pseudo_tile_id is None:
                    result["pseudo_tile_instance"] = None
                else:
                    result["pseudo_tile_instance"] = tile_save_dicts[sess.pseudo_tile_id]
                    del tile_save_dicts[sess.pseudo_tile_id]
                result["tile_instances"] = tile_save_dicts
                result["used_tile_types"] = []
                for tid in tile_save_dicts.keys():
                    tile_type = tile_save_dicts[tid]["tile_type"]
                    result["used_tile_types"].append(tile_type)
                self.mworker.submit_response(task_packet, result)
                return

        result = {"used_modules": []}

        if sess.doc_type == "notebook":
            save_attrs = self.notebook_save_attrs
        else:
            save_attrs = self.save_attrs
        for attr in save_attrs:
            if attr == "doc_dict":
                collection_info = sess.collection_info
                result["doc_dict"] = collection_info.compile_save_dict()
                continue
            attr_val = getattr(sess, attr)
            if hasattr(attr_val, "compile_save_dict"):
                result[attr] = attr_val.compile_save_dict()
            elif (type(attr_val) == dict) and (len(attr_val) > 0) and hasattr(list(attr_val.values())[0],
                                                                              "compile_save_dict"):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                result[attr] = attr_val
        tile_save_dicts = {}
        pseudo_tile_id = sess.pseudo_tile_id
        if not sess.doc_type == "notebook":
            tile_info = sess.tile_info
            tile_ids_to_compile = tile_info.tile_ids

            if pseudo_tile_id is not None:
                tile_ids_to_compile.append(pseudo_tile_id)
                self.mworker.post_task(pseudo_tile_id, "compile_save_dict", {"lite_save": is_lite},
                                       callback_func=track_tile_compile_receipts)
            if not tile_ids_to_compile:
                result["used_tile_types"] = []
                result["used_modules"] = []
                result["pseudo_tile_instance"] = None
                result["tile_instances"] = {}
                if sess.purgetiles:
                    result["loaded_modules"] = []
                self.mworker.submit_response(task_packet, result)
                return

            for _tid in sess.tile_info.tile_ids:
                self.mworker.post_task(_tid, "compile_save_dict", {"lite_save": is_lite}, callback_func=track_tile_compile_receipts)
        else:
            if pseudo_tile_id is not None:
                tile_ids_to_compile = [pseudo_tile_id]
                self.mworker.post_task(pseudo_tile_id, "compile_save_dict", {"lite_save": is_lite},
                                       callback_func=track_tile_compile_receipts)
            else:
                self.mworker.submit_response(task_packet, result)
        return

    @staticmethod
    def convert_jupyter_cells(jupyter_cell_list):
        message = ""
        converted_cells = []
        for cell_dict in jupyter_cell_list:
            unique_id = str(uuid.uuid4())
            if cell_dict["cell_type"] == "code":
                cell_dict = {
                    "unique_id": unique_id,
                    "type": "code",
                    "show_spinner": False,
                    "summary_text": "code item",
                    "console_text": "".join(cell_dict["source"]),
                    "output_dict": {},
                    "execution_count": 0
                }
            elif cell_dict["cell_type"] == "markdown":
                cell_dict = {
                    "unique_id": unique_id,
                    "type": "text",
                    "show_spinner": False,
                    "summary_text": "text items",
                    "console_text": "".join(cell_dict["source"]),
                    "show_markdown": False
                }
            converted_cells.append(cell_dict)
        return converted_cells


    @task_worthy_manual_submit
    def save_new_project_task(self, data_dict, task_packet):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)

        def got_save_dict(project_dict):
            print("in got_save_dict in main")
            save_dict, project_dict, mdata = (
                self.prepare_project_data(sid, sess.project_name, project_dict, sess.doc_type,
                                          sess.collection_name, interface_state, None, sess.purgetiles, True))
            sess.metadata = mdata
            self.save_new_project(sid, save_dict, project_dict)
            self.emit_clear_status(sid)
            return_data = {"project_name": data_dict["project_name"],
                           "success": True,
                           "message": "Project Successfully Saved"}
            self.mworker.submit_response(task_packet, return_data)

        try:
            interface_state = data_dict["interface_state"]
            console_items = interface_state["console_items"]
            sess.project_name = data_dict["project_name"]
            sess.purgetiles = data_dict["purgetiles"]
            self.emit_status_message(sid, "Getting loaded modules")
            self.emit_status_message(sid, "compiling save dictionary")
            self.mworker.post_task("main_service", "compile_save_dict", data_dict, got_save_dict)

        except Exception as ex:
            debug_log("got an error in save_new_project")
            error_string = self.handle_exception(sid, ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_reponse(task_packet, _return_data)
        return

    @task_worthy_manual_submit
    def save_new_notebook_project_task(self, data_dict, task_packet):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)
        def got_save_dict(project_dict):
            doc, project_dict, mdata = (
                self.prepare_project_data(sid, sess.project_name, project_dict, "notebook", "",
                                          interface_state, None, False, True))
            sess.metadata = mdata
            self.save_new_project(sid, doc, project_dict)
            self.emit_clear_status(sid)
            return_data = {"project_name": data_dict["project_name"],
                           "success": True,
                           "message": "Project Successfully Saved"}
            self.mworker.submit_response(task_packet, return_data)

        try:
            interface_state = data_dict["interface_state"]
            console_items = interface_state["console_items"]
            sess.project_name = data_dict["project_name"]
            sess.purgetiles = True

            self.emit_status_message(sid, "compiling save dictionary")
            sess.doc_type = "notebook"  # This is necessary in case we're saving a juypyter notebook
            self.mworker.post_task("main_service", "compile_save_dict", data_dict, got_save_dict)

        except Exception as ex:
            debug_log("got an error in save_new_project")
            error_string = self.handle_exception(sid, ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_response(task_packet, _return_data)
        return


    @task_worthy_manual_submit
    def update_project_task(self, data_dict, task_packet):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)

        def got_save_dict(project_dict):

            try:
                if not sess.doc_type == "notebook":
                    doc, project_dict, mdata = (
                        self.prepare_project_data(sid, sess.project_name, project_dict, sess.doc_type, "",
                                                  interface_state, sess.metadata, False))
                else:
                    doc, project_dict, mdata = (
                        self.prepare_project_data(sid, sess.project_name, project_dict, "notebook", sess.collection_name,
                                                  interface_state, sess.metadata, False))
                sess.metadata = mdata
                self.update_project(sid, doc, project_dict)
                self.emit_clear_status(sid)
                return_data = {"project_name": data_dict["project_name"],
                               "success": True,
                               "message": "Project Successfully Saved"}
                self.mworker.submit_response(task_packet, return_data)
                return
            except Exception as lex:
                lerror_string = self.handle_exception(sid, lex, "Error saving project", print_to_console=False)
                _lreturn_data = {"success": False, "message": lerror_string}
                self.mworker.submit_response(task_packet, _lreturn_data)
                return
        try:
            interface_state = data_dict["interface_state"]
            console_items = interface_state["console_items"]
            self.emit_status_message(sid, "Getting loaded modules")
            self.loaded_modules = self.get_loaded_user_modules(sid)
            self.emit_status_message(sid, "compiling save dictionary")
            self.mworker.post_task("main_service", "compile_save_dict", data_dict, got_save_dict)

        except Exception as ex:
            error_string = self.handle_exception(sid, ex, "Error saving project", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_response(task_packet, _return_data)
        return

    @task_worthy
    def export_as_presentation(self, data_dict):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)
        try:
            cell_list = data_dict["cell_list"]
            new_cell_list = []
            style_text = ""
            in_section = False
            in_styles = False

            for ccell in cell_list:
                if in_styles:
                    if ccell["type"] == "section-end":
                        in_styles = False
                        continue
                    else:
                        if ccell["type"] == "text":
                            style_text += ccell["raw_text"] + "\n"
                        else:
                            style_text += ccell["console_text"] + "\n"
                    continue
                if "summary_text" in ccell:
                    if ccell["summary_text"] is not None and re.findall("^style(?: )*=(?: )*.*", ccell["summary_text"]):
                        ccell["extra_style"] = eval(re.sub("^style(?: )*=(?: )*", "", ccell["summary_text"]))
                    else:
                        ccell["extra_style"] = ""
                else:
                    ccell["extra_style"] = ""
                if not in_section:
                    if not ccell["type"] == "divider":
                        continue
                    if not ccell["header_text"].lower() == "styles":
                        ccell["_id"] = re.sub(" ", "_", ccell["header_text"])
                        in_section = True
                        new_cell_list.append(ccell)
                        continue
                    else:
                        in_styles = True
                        continue
                else:
                    if ccell["type"] == "section-end":
                        new_cell_list.append(ccell)
                        in_section = False
                        continue
                    else:
                        if ccell["type"] == "figure":
                            ccell["image"] = ccell["image_data_str"]
                        new_cell_list.append(ccell)
                        continue

            report_html = render_template("presentation_template.html",
                                          cell_list=new_cell_list,
                                          extra_styles=style_text,
                                          use_dark_theme=data_dict["use_dark_theme"],
                                          project_name=data_dict["project_name"])
            print("rendered the report")
            if data_dict["save_as_collection"]:
                new_collection_name = data_dict["collection_name"]
                self.create_complete_collection(new_collection_name, {"report": report_html},
                                                "freeform", username=sess.username)
                _return_data = {"collection_name": new_collection_name,
                                "success": True,
                                "message": "Presentation Successfully Exported"}
            else:
                unique_id = self.store_temp_data({"the_html": report_html})
                _return_data = {"success": True,
                                "temp_id": unique_id,
                                "message": "Presentation Successfully Created"}

        except Exception as ex:
            debug_log("got an error in export_as_presentation")
            error_string = self.handle_exception(sid, ex, "<pre>Error exporting presentation </pre>",
                                                 print_to_console=False)
            _return_data = {"success": False, "message": error_string}
        return _return_data

    @task_worthy
    def store_temp_data_task(self, data_dict):
        unique_id = self.store_temp_data(data_dict)
        return_data = {"success": True, "temp_id": unique_id}
        return return_data

    @task_worthy
    def export_as_report(self, data_dict):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)
        try:
            cell_list = data_dict["cell_list"]
            new_cell_list = []
            ncells = len(cell_list)
            i = 0
            style_text = ""
            in_section = False
            in_styles = False
            for ccell in cell_list:
                if in_styles:
                    if ccell["type"] == "section-end":
                        in_styles = False
                        continue
                    else:
                        if ccell["type"] == "text":
                            style_text += ccell["raw_text"] + "\n"
                        else:
                            style_text += ccell["console_text"] + "\n"
                    continue
                if "summary_text" in ccell:
                    if ccell["summary_text"] is not None and re.findall("^style(?: )*=(?: )*.*", ccell["summary_text"]):
                        ccell["extra_style"] = eval(re.sub("^style(?: )*=(?: )*", "", ccell["summary_text"]))
                    else:
                        ccell["extra_style"] = ""
                else:
                    ccell["extra_style"] = ""
                if not in_section:
                    if not ccell["type"] == "divider":
                        if ccell["type"] == "figure":
                            ccell["image"] = ccell["image_data_str"]
                        new_cell_list.append(ccell)
                        continue
                    if not ccell["header_text"].lower() == "styles":
                        in_section = True
                        new_cell_list.append(ccell)
                        continue
                    else:
                        in_styles = True
                        continue
                else:
                    if ccell["type"] == "section-end":
                        new_cell_list.append(ccell)
                        in_section = False
                        continue
                    else:
                        if ccell["type"] == "figure":
                            ccell["image"] = ccell["image_data_str"]
                        new_cell_list.append(ccell)
                        continue

            report_html = render_template("report_template.html",
                                          cell_list=new_cell_list,
                                          extra_styles=style_text,
                                          use_dark_theme = data_dict["use_dark_theme"],
                                          collapsible=data_dict["collapsible"],
                                          include_summaries=data_dict["include_summaries"],
                                          project_name=data_dict["project_name"])
            print("rendered the report")
            if data_dict["save_as_collection"]:
                new_collection_name = data_dict["collection_name"]
                self.create_complete_collection(new_collection_name, {"report": report_html},
                                                "freeform", username=sess.username)
                _return_data = {"collection_name": new_collection_name,
                                "success": True,
                                "message": "Report Successfully Exported"}
            else:
                print("not saving to a collection")
                unique_id = self.store_temp_data({"the_html": report_html})
                _return_data = {"success": True,
                                "temp_id": unique_id,
                                "message": "Report Successfully Created"}

        except Exception as ex:
            debug_log("got an error in export_as_report")
            error_string = self.handle_exception(sid, ex, "<pre>Error exporting report </pre>",
                                                 print_to_console=False)
            _return_data = {"success": False, "message": error_string}
        return _return_data

    @task_worthy
    def export_to_jupyter_notebook(self, data_dict):
        sid = data_dict["local_id"]
        try:
            new_project_name = data_dict["project_name"]
            cell_list = data_dict["cell_list"]
            for cell in cell_list:
                source_text = cell["source"]
                source_list = source_text.split("\n")
                revised_source_list = [r + "\n" for r in source_list[:-1]] + [source_list[-1]]
                cell["source"] = revised_source_list
                cell["metadata"] = {}
                if cell["cell_type"] == "code":
                    cell["execution_count"] = 0
            internal_metadata = {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}}
            full_dict = {"metadata": internal_metadata,
                         "nbformat": 4,
                         "nbformat_minor": 2,
                         "cells": data_dict["cell_list"]}
            notebook_json = json.dumps(full_dict, indent=1, sort_keys=True)
            project_dict = {"jupyter_text": notebook_json}
            save_dict, project_dict, _ = self.prepare_project_data(sid, new_project_name,
                                                                   project_dict, "jupyter", "",
                                                                   {}, None, False, True)
            self.save_new_project(sid, save_dict, project_dict)
            _return_data = {"project_name": new_project_name,
                            "success": True,
                            "message": "Notebook Successfully Exported"}

        except Exception as ex:
            debug_log("got an error in export_to_jupyter_notebook")
            error_string = self.handle_exception(sid, ex, "<pre>Error exporting to jupyter notebook</pre>",
                                                 print_to_console=False)
            _return_data = {"success": False, "message": error_string}
        return _return_data

    @task_worthy
    def console_to_notebook(self, data_dict):
        sid = data_dict["local_id"]
        self.emit_status_message(sid, "compiling save dictionary")

        def got_save_dict(console_dict):
            try:
                console_dict["doc_type"] = "notebook"
                console_dict["interface_state"] = {"console_items": data_dict["console_items"]}
                unique_id = self.store_temp_data_with_compress(console_dict)
                self.mworker.emit_to_main_client(sid, "notebook-open", {"message": "notebook-open", "temp_data_id": unique_id})
            except Exception as ex:
                error_string = self.get_traceback_message(ex)
                self.mworker.send_error_entry(sid, "Error converting console to notebook", error_string)
            return

        self.mworker.post_task("main_service", "compile_save_dict", {}, got_save_dict)
        return {"success": True}

    @task_worthy
    def update_reload_dict(self, data_dict):
        sid = data_dict["sid"]
        tile_info = self.get_session(sid).tile_info
        tile_info.set_reload_dict(data_dict["tile_id"], data_dict["reload_dict"])
        return {"success": True}

    @task_worthy
    def remove_collection_from_project(self, data_dict):
        sid = data_dict["sid"]
        sess = self.get_session(sid)
        sess.doc_type = "none"
        sess.collection_name = ""
        sess.short_collection_name = ""
        sess.visible_doc_name = ""
        sess.collection_info.delete_all_docs()
        self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                               {"tile_id": None, "sid": sid})
        self.mworker.post_task(self.mworker.my_id, "update_tile_collection_objects_task",
                               {"doc_type": sess.doc_type, "sid": sid})
        return {"success": True}

    @task_worthy_manual_submit
    def change_collection(self, data_dict, task_packet):
        sid = data_dict["sid"]
        sess = self.get_session(sid)
        local_task_packet = task_packet
        short_collection_name = data_dict["new_collection_name"]
        new_collection_dict, dmdict, hldict, mdata = self.get_all_collection_info(short_collection_name,
                                                                                  username=sess.username)

        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"
        sess.doc_type = doc_type

        sess.short_collection_name = short_collection_name
        sess.collection_name = short_collection_name
        self.build_doc_dict(username, short_collection_name)
        collection_info = sess.collection_info
        doc_names = collection_info.doc_names[0]
        sess.visible_doc_name = doc_names[0]
        self.mworker.post_task("main_service", "rebuild_tile_forms_task",
                               {"tile_id": None, "sid": sid})
        self.mworker.post_task("main_service", "update_tile_collection_objects_task",
                               {"doc_type": sess.doc_type, "sid": sid})

        return_data = {"success": True,
                       "collection_name": short_collection_name,
                       "short_collection_name": short_collection_name,
                       "doc_type": doc_type,
                       "doc_names": doc_names}
        if doc_type == "table":
            return_data.update(self.grab_chunk_by_row_index({
                "sid": sid, "doc_name": doc_names[0], "row_index": 0, "set_visible_doc": True}))
        elif self.doc_type == "freeform":
            return_data.update(self.grab_freeform_data({
                "sid": sid, "doc_name": doc_names[0], "set_visible_doc": True}))
        self.mworker.submit_response(local_task_packet, return_data)
        return


# noinspection PyUnusedLocal
class APISupportTasksMixin:

    @task_worthy
    def distribute_events_stub(self, data_dict):
        event_name = data_dict["event_name"]
        if "tile_id" in data_dict:
            tile_id = data_dict["tile_id"]
        else:
            tile_id = None
        sid = data_dict["local_id"]
        success = self.mworker.distribute_event(sid, event_name, data_dict, tile_id)
        return {"success": success}

    @task_worthy
    def get_column_data(self, data):
        sid = data["sid"]
        sess = self.get_session(data["sid"])
        collection_info = sess.collection_info
        result = []
        ddata = copy.copy(data)
        for doc_name in collection_info.doc_names:
            ddata["doc_name"] = doc_name
            result += self.get_column_data_for_doc(ddata)
        return result

    @task_worthy
    def get_matching_documents(self, data):
        sid = data["sid"]
        sess = self.get_session(data["sid"])
        collection_info = sess.collection_info
        ffunction = debinarize_python_object(data["filter_function"])
        result = []
        for doc_name in collection_info.doc_names:
            if ffunction(collection_info.get_doc_metadata(doc_name)):
                result.append(doc_name)
        return result

    @task_worthy
    def get_collection_names(self, data):
        sess = self.get_session(data["sid"])
        return {"success": True, "collection_names": self.collection_names(sess.username)}

    @task_worthy
    def get_list_names(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        return {"success": True, "list_names": self.list_names(username)}

    @task_worthy
    def get_filtered_resource_names_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        res_names = self.get_filtered_resource_names(data["res_type"], data["tag_filter"],
                                                     data["search_filter"], username=username)
        return {"success": True, "res_names": res_names}

    @task_worthy
    def get_user_collection(self, task_data):
        sid = task_data["sid"]
        username = self.get_session(sid).username
        new_collection_dict, dmdict, hldict, cm = self.get_all_collection_info(
            task_data["collection_name"], username=username)
        result = {"success": True, "the_collection": new_collection_dict}
        return result

    @task_worthy
    def get_user_collection_with_metadata(self, task_data):
        sid = task_data["sid"]
        username = self.get_session(sid).username
        new_collection_dict, dmdict, hldict, cm = self.get_all_collection_info(
            task_data["collection_name"], username=username)
        if new_collection_dict is None:
            result = None
        else:
            result = {"the_collection": new_collection_dict,
                      "doc_metadata": dmdict,
                      "collection_metadata": cm}
        return {"success": True, "collection_data": make_python_object_jsonizable(result)}

    @task_worthy
    def get_list_with_metadata_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        list_dict = self.get_list_content_with_metadata(data["list_name"], username=username)
        return {"list_data": make_python_object_jsonizable(list_dict)}

    @task_worthy
    def get_code_with_metadata_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        code_dict = self.get_code_content_with_metadata(data["code_name"], username=username)
        return {"code_data": make_python_object_jsonizable(code_dict)}

    @task_worthy
    def get_function_names_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        tag_filter = data.get("tag_filter", None)
        search_filter = data.get("search_filter", None)
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        function_names = self.get_filtered_function_names(tag_filter, search_filter, username=username)
        return {"function_names": function_names}

    @task_worthy
    def get_class_names_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        tag_filter = data["tag_filter"]
        search_filter = data["search_filter"]
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        class_names = self.get_filtered_class_names(tag_filter, search_filter, username=username)
        return {"class_names": class_names}

    @task_worthy
    def get_function_with_metadata_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        function_name = data["function_name"]
        function_dict = self.get_function_with_metadata(function_name, username=username)
        return {"function_data": make_python_object_jsonizable(function_dict)}

    @task_worthy
    def get_class_with_metadata_task(self, data):
        sid = data["sid"]
        username = self.get_session(sid).username
        class_name = data["class_name"]
        class_dict = self.get_class_with_metadata(class_name, username=username)
        return {"class_data": make_python_object_jsonizable(class_dict)}

    @task_worthy
    def get_document_data(self, data):
        sid = data["sid"]
        collection_info = self.get_session(sid).collection_info
        doc_name = data["document_name"]
        return collection_info.all_data(doc_name)

    @task_worthy
    def get_document_metadata(self, data):
        sid = data["sid"]
        collection_info = self.get_session(sid).collection_info
        doc_name = data["document_name"]
        mdata = collection_info.get_doc_metadata(doc_name)
        mdata["name"] = doc_name  # legacy Some older tiles expect this to be in the metadata
        return mdata

    @task_worthy
    def get_collection_info_task(self, data):
        info = {}
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        if sess.doc_type not in ["freeform", "table"]:
            return info
        for doc_name in collection_info.doc_names:
            info[doc_name] = {}
            info[doc_name]["number_rows"] = collection_info.number_of_rows(doc_name)
            if sess.doc_type == "table":
                info[doc_name]["column_names"] = collection_info.get_table_spec_param(doc_name, "header_list")
        return info

    @task_worthy
    def set_document_metadata(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_name = data["document_name"]
        collection_info.set_additional_metadata(doc_name, data["metadata"])
        return None

    @task_worthy
    def get_document_data_as_list(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_name = data["document_name"]
        data_list = collection_info.all_sorted_data_rows(doc_name)
        return {"data_list": data_list}

    @task_worthy
    def get_column_names(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_name = data["document_name"]
        header_list = collection_info.get_table_spec_param(doc_name, "header_list")
        return {"header_list": header_list}

    @task_worthy
    def get_number_rows(self, data):
        collection_info = self.get_collection_info(data["sid"])
        doc_name = data["document_name"]
        nrows = collection_info.number_of_rows(doc_name)
        return {"number_rows": nrows}

    @task_worthy_manual_submit
    def SendTileMessage(self, data, task_packet):
        tile_info = self.get_tile_info(data["sid"])
        def got_response(message_response):
            self.mworker.submit_response(task_packet, message_response)
        tile_id = tile_info.id_from_name(data["tile_name"])
        if data["has_callback"]:
            rfunc = got_response
        else:
            rfunc = None
        self.mworker.post_task(tile_id, "TileMessage", data, rfunc)
        return None

    @task_worthy
    def get_row(self, data):
        collection_info = self.get_collection_info(data["sid"])
        doc_name = data["document_name"]
        if "row_id" in data:
            row_id = data["row_id"]
        else:
            row_id = data["line_number"]
        the_row = collection_info.get_row(doc_name, row_id)
        return the_row

    @task_worthy
    def get_rows(self, data):
        collection_info = self.get_collection_info(data["sid"])
        doc_name = data["document_name"]
        start = data["start"]
        stop = data["stop"]
        row_list = collection_info.get_rows(doc_name, start, stop)
        return row_list

    @task_worthy
    def get_line(self, data):
        return self.get_row(data)

    @task_worthy
    def get_cell(self, data):
        collection_info = self.get_collection_info(data["sid"])
        doc_name = data["document_name"]
        row_id = data["row_id"]
        column_name = data["column_name"]
        the_cell = collection_info.data_rows_int_keys(doc_name)[int(row_id)][column_name]
        return {"the_cell": the_cell}

    @task_worthy
    def get_column_data_for_doc(self, data):
        sid = data["sid"]
        collection_info = self.get_collection_info(sid)
        column_header = data["column_name"]
        doc_name = data["doc_name"]
        the_rows = collection_info.all_sorted_data_rows(doc_name)
        result = []
        for the_row in the_rows:
            result.append(the_row[column_header])
        return result

    @task_worthy
    def CellChange(self, data):
        sid = data["sid"]
        self._set_row_column_data(sid, data["doc_name"], data["id"], data["column_header"], data["new_content"])
        self._change_list.append(data["id"])
        return None

    @task_worthy
    def FreeformTextChange(self, data):
        self._set_freeform_data(data["sid"], data["doc_name"], data["new_content"])
        return None

    @task_worthy
    def set_visible_doc(self, data):
        doc_name = data["doc_name"]
        sid = data["sid"]
        sess = self.get_session(sid)
        if not doc_name == sess.visible_doc_name:
            self.mworker.distribute_event("DocChange", data)
        sess.visible_doc_name = doc_name
        return {"success": True}

    @task_worthy
    def get_property(self, data_dict):
        allowed_properties = ["doc_names", "visible_doc_name", "selected_text"]
        prop_name = data_dict["property"]
        if prop_name in allowed_properties:
            collection_info = self.get_collection_info(data_dict["sid"])
            sess = self.get_session(data_dict["sid"])
            if prop_name == "doc_names":
                val = collection_info.doc_names
            elif prop_name == "visible_doc_name":
                val = sess.visible_doc_name
            else:
                val = sess.selected_text
            return {"success": True, "val": val}
        else:
            return {"success": False, "val": None}

    @task_worthy
    def export_data(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_dict = {}
        metadata_dict = {}
        header_list_dict = {}
        for doc_name in collection_info.doc_names:
            if sess.doc_type == "table":
                doc_dict[doc_name] = collection_info.all_sorted_data_rows(doc_name)
                header_list_dict[doc_name] = collection_info.get_table_spec_param(doc_name, "header_list")
            else:
                doc_dict[doc_name] = collection_info.all_data(doc_name)
            metadata_dict[doc_name] = collection_info.get_doc_metadata(doc_name)
        try:
            result = self.create_complete_collection(data["export_name"],
                                                     doc_dict,
                                                     sess.doc_type,
                                                     metadata_dict,
                                                     header_list_dict,
                                                     username=sess.username)
            return {"success": True, "user_id": sess.user_id}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "title": "Error exporting", "content": error_string, "user_id": sess.user_id}

    @task_worthy
    def create_collection_task(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        try:
            temp_data = data["temp_data"] if "temp_data" in data else None
            result = self.create_complete_collection(data["name"],
                                                     data["doc_dict"],
                                                     data["doc_type"],
                                                     data["doc_metadata"],
                                                     data["header_list_dict"],
                                                     data["collection_metadata"],
                                                     temp_data=temp_data,
                                                     username=sess.username)
            return result
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def get_tile_ids(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        tile_ids = tile_info.tile_ids
        if sess.pseudo_tile_id is not None:
            tile_ids.append(sess.pseudo_tile_id)
        return {"success": True, "tile_ids": tile_ids}

    @task_worthy
    def SearchTable(self, data):
        self.highlight_table_text(data["sid"], data["text_to_find"])
        return None

    @task_worthy
    def FilterTable(self, data):
        txt = data["text_to_find"]
        self.display_matching_rows_applying_filter(data["sid"], lambda r: self.txt_in_dict(txt, r))
        return None

    @task_worthy
    def DehighlightTable(self, data):
        self.mworker.emit_table_message(data["sid"], "dehighlightAllText")
        return None

    @task_worthy
    def UnfilterTable(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        for doc_name in collection_info.doc_names:
            collection_info.set_param(doc_name, "current_data_rows", collection_info.get_data_rows(doc_name))
        if "selected_row" in data and data["selected_row"] is not None:
            self.mworker.ask_host("go_to_row_in_document", {"doc_name": sess.visible_doc_name,
                                                            "row_id": data["selected_row"]})
        else:
            self.refill_table(sid)
        return None

    @task_worthy
    def ColorTextInCell(self, data):
        self.mworker.emit_table_message(data["sid"], "colorTxtInCell", data)
        return None

    @task_worthy
    def SetCellContent(self, data):
        self._set_cell_content(data["sid"], data["doc_name"], data["id"], data["column_header"],
                               data["new_content"], data["cellchange"])
        return None

    @task_worthy
    def SetDocument(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        doc_name = data["doc_name"]

        if sess.doc_type == "table":
            new_doc_dict = data["new_data"]
            cellchange = data["cellchange"]

            current_doc_dict = collection_info.get_data_rows(doc_name)
            for the_id, r in new_doc_dict.items():
                old_r = current_doc_dict[the_id]
                for key, val in r.items():
                    if key not in ["__id__", "__filename__"]:
                        if not val == old_r[key]:
                            self._set_cell_content(sid, doc_name, the_id, key, val, cellchange)
        else:
            new_doc_text = data["new_data"]
            self._set_freeform_data(sid, doc_name, new_doc_text)
            if doc_name == sess.visible_doc_name:
                data = {"new_content": new_doc_text,
                        "doc_name": doc_name}
                self.mworker.emit_table_message(sid, "setFreeformContent", data)
        return {"success": True}

    @task_worthy
    def SetColumnData(self, data):
        sid = data["sid"]
        if isinstance(data["new_content"], dict):
            for rid, ntext in data["new_content"].items():
                self._set_cell_content(sid, data["doc_name"], rid, data["column_header"],
                                       ntext, data["cellchange"])

        elif isinstance(data["new_content"], list):
            for rid, ntext in enumerate(data["new_content"]):
                self._set_cell_content(sid, data["doc_name"], rid, data["column_header"],
                                       ntext, data["cellchange"])
        else:
            raise Exception("Got invalid data type in SetColumnData.")
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
        self.mworker.print_to_console(data["sid"], data["message"], force_open, is_error)
        return None

    @task_worthy
    def display_matching_rows(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        result = data["result"]
        doc_name = data["document_name"]
        if doc_name is not None:
            data_rows = collection_info.get_data_rows(doc_name)
            current_data_rows = {}
            for (key, val) in data_rows.items():
                if int(key) in result:
                    current_data_rows[key] = val
            collection_info.set_param(doc_name, "current_data_rows", current_data_rows)
            self.refill_table()
        else:
            for doc_name in collection_info.doc_names:
                current_data_rows = {}
                data_rows = collection_info.get_data_rows(doc_name)
                for (key, val) in data_rows.items():
                    if int(key) in result[docname]:
                        current_data_rows[key] = val
                collection_info.set_param(doc_name, "current_data_rows", current_data_rows)
            self.refill_table(sid)
        return

    @task_worthy
    def SetCellBackground(self, data):
        self._set_cell_background(data["sid"], data["doc_name"], data["row_id"], data["column_name"], data["color"])
        return None


# noinspection PyUnusedLocal
class ExportsTasksMixin:

    @task_worthy
    def update_pipe_dict_task(self, data):
        self.update_pipe_dict(data["sid"], data["exports"], data["tile_id"], data["tile_name"])
        self.mworker.emit_export_viewer_message(data["sid"], "update_exports_popup", {})
        return {"success": True}

    @task_worthy
    def get_full_pipe_dict(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        converted_pipe_dict = {}
        pipe_dict = sess.pipe_dict
        print("got pipe")
        for tile_id, tile_entry in pipe_dict.items():
            if tile_id == sess.pseudo_tile_id:
                tile_name = "__log__"
            else:
                first_full_name = list(tile_entry)[0]
                first_short_name = list(tile_entry.values())[0]["export_name"]
                tile_name = re.sub("_" + first_short_name, "", first_full_name)
            converted_pipe_dict[tile_name] = []

            for full_export_name, edict in tile_entry.items():
                new_entry = [full_export_name, edict["export_name"]]
                if "type" in edict:
                    new_entry.append(edict["type"])
                converted_pipe_dict[tile_name].append(new_entry)

        return {"success": True, "pipe_dict": converted_pipe_dict}

    @task_worthy
    def evaluate_export(self, data):
        sess = self.get_session(data["local_id"])
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(data["sid"])
        ndata = {"export_name": data["export_name"], "pipe_dict": sess.pipe_dict}
        if "key" in data:
            ndata["key"] = data["key"]
        ndata["tail"] = data["tail"]
        ndata["console_id"] = "export_viewer"

        self.mworker.post_task(sess.pseudo_tile_id, "_evaluate_export", ndata)
        return

    @task_worthy
    def remove_widget(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
            return
        self.mworker.post_task(sess.pseudo_tile_id, "remove_widget", data)
        return

    @task_worthy_manual_submit
    def widget_get(self, data, task_packet):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
        def got_response(response_data):
            self.mworker.submit_response(task_packet, response_data)
        self.mworker.post_task(sess.pseudo_tile_id, "widget_get", data, got_response)
        return

    @task_worthy
    def widget_set(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
        self.mworker.post_task(sess.pseudo_tile_id, "widget_set", data)
        return

    @task_worthy
    def widget_action(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
        self.mworker.post_task(sess.pseudo_tile_id, "widget_action", data)
        return

    @task_worthy
    def stop_evaluate_export(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            return

        self.mworker.post_task(sess.pseudo_tile_id, "stop_console_code", {"console_id": "export_viewer", "sid": sid})
        return

    @task_worthy
    def get_export_info(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid)
        ndata = {"export_name": data["export_name"], "pipe_dict": sess.pipe_dict, "console_id": "export_viewer"}
        self.mworker.post_task(sess.pseudo_tile_id, "_get_export_info", ndata)
        return


# noinspection PyUnusedLocal
class ConsoleTasksMixin:

    @task_worthy_manual_submit
    def get_pseudo_tile_id(self, data, task_packet):
        sid = data["local_id"]
        sess = self.get_session(sid)
        def got_id():
            self.mworker.submit_response(task_packet, {"success": True, "pseudo_tile_id": sess.pseudo_tile_id})
            return
        if sess.pseudo_tile_id is None:
            self.create_pseudo_tile(sid, callback=got_id)
        else:
            got_id()
        return

    @task_worthy
    def print_to_console_event(self, data):
        sid = data["sid"]
        to_print = self.move_figures_to_pseudo_tile(sid, data["print_string"])
        return self.mworker.print_to_console(sid, to_print,
                                             force_open=data["force_open"],
                                             is_error=data["is_error"],
                                             summary=data["summary"])

    @task_worthy
    def print_tile_to_console_event(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        self.mworker.post_task(sess.pseudo_tile_id, "store_widgets", data)
        widget_renders = data["current_html"]
        if type(widget_renders) == str:
            widget_renders = [{"widgetKind": "rawHtml", "widgetData": {"value": widget_renders}}]
        elif type(widget_renders) == dict:
            widget_renders = [widget_renders]
        new_renders = []
        for wdict in widget_renders:
            if wdict["widgetKind"] == "rawHtml":
                wdict["widgetData"]["value"] = self.move_figures_to_pseudo_tile(sid, wdict["widgetData"]["value"])
            new_renders.append(wdict)
        return self.mworker.print_to_console(sid, new_renders,
                                             force_open=data["force_open"],
                                             is_error=data["is_error"],
                                             summary=data["summary"])

    # @task_worthy
    # def got_console_result(self, data):
    #     self.mworker.emit_console_message("stopConsoleSpinner", {"console_id": data["console_id"],
    #                                                              "execution_count": data["execution_count"],
    #                                                              "force_open": True})
    #     return {"success": True}

    # @task_worthy
    # def got_console_print(self, data):
    #     self.mworker.emit_console_message("consoleCodePrint", {"result_text": data["result_string"],
    #                                                            "console_id": data["console_id"],
    #                                                            "force_open": True})
    #     return {"success": True}

    @task_worthy
    def updated_globals(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        pipe_dict = sess.pipe_dict
        pseudo_tile_id = sess.pseudo_tile_id
        if data["globals_changed"]:
            if len(data["current_globals"]) == 0:
                if pseudo_tile_id in pipe_dict:
                    del pipe_dict[pseudo_tile_id]
            else:
                pipe_dict[pseudo_tile_id] = {}
                tile_name = "__log__"
                for gname, gtype in data["current_globals"]:
                    pipe_dict[pseudo_tile_id][tile_name + "_" + gname] = {
                        "export_name": gname,
                        "export_tags": "",
                        "tile_id": pseudo_tile_id,
                        "type": gtype
                    }
            sess.pipe_dict = pipe_dict
            self.mworker.emit_export_viewer_message(sid, "update_exports_popup", {})
            self.mworker.post_task("main_service", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
        return {"success": True}

    @task_worthy_manual_submit
    def exec_console_code(self, data, task_packet):
        sid = data["local_id"]
        sess = self.get_session(sid)
        def do_exec():
            print("in do_exec")
            the_code = data["the_code"]
            data["pipe_dict"] = sess.pipe_dict
            data["am_notebook"] = self.am_notebook_type(sid)
            pseudo_tile_id = sess.pseudo_tile_id
            self.mworker.post_task(pseudo_tile_id, "exec_console_code", data)
            self.mworker.submit_response(task_packet, {"success": True})
        self.create_pseudo_tile(sid, callback=do_exec)

        return {"success": True}

    @task_worthy
    def stop_console_code(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        data["pipe_dict"] = sess.pipe_dict
        data["am_notebook"] = sess.am_notebook_type
        self.mworker.post_task(sess.pseudo_tile_id, "stop_console_code", data)
        return {"success": True}

    @task_worthy
    def stop_all_console_code(self, data):
        sid = data["local_id"]
        sess = self.get_session(sid)
        data["pipe_dict"] = sess.pipe_dict
        data["am_notebook"] = sess.am_notebook_type
        self.mworker.post_task(sess.pseudo_tile_id, "stop_all_console_code", data)
        return {"success": True}

    @task_worthy
    def clear_console_namespace(self, data):
        sid = data["local_id"]
        self.emit_status_message("Resetting notebook ...")
        def container_restarted(crdata):
            if not crdata["success"]:
                debug_log("got an exception " + crdata["message"])
                self.emit_status_message(sid, "Error resetting notebook", 7)
                raise Exception(crdata["message"])

            def instantiate_done(instantiate_result):
                if not instantiate_result["success"]:
                    debug_log("got an exception " + instantiate_result["message"])
                    self.emit_status_message(sid, "Error resetting notebook", 7)
                    raise Exception(instantiate_result["message"])
                else:
                    instantiate_result["globals_changed"] = True
                    instantiate_result["sid"] = sid
                    self.updated_globals(instantiate_result)
                self.emit_status_message("Notebook reset", 21)

            data_dict = {
                "globals_dict": {},
                "creds": sess.pseudo_tile_creds,
                "img_dict": {},
                "instance_params": {
                    "base_figure_url": sess.base_figure_url,
                    "user_id": sess.user_id,
                    "sid": sid,
                    "doc_type": sess.doc_type,
                    "username": sess.username,
                    "ppi": sess.ppi
                }
            }

            self.mworker.post_task(sess.pseudo_tile_id,
                                   "instantiate_as_pseudo_tile",
                                   data_dict,
                                   instantiate_done)
            self.emit_status_message("Notebook reset", 21)

        if sess.pseudo_tile_id is not None:
            self.mworker.post_task("host5000",
                                   "restart_tile_container",
                                   {"tile_id": self.pseudo_tile_id},
                                   callback_func=container_restarted)
        return {"success": True}


class DataSupportTasksMixin:

    @task_worthy
    def delete_row(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            doc_name = data["document_name"]
            index = data["index"]
            drows = copy.deepcopy(collection_info.all_sorted_data_rows(doc_name))
            del drows[index]
            doc_as_dict = {}
            for r, the_row in enumerate(drows):
                the_row["__id__"] = r
                doc_as_dict[str(r)] = the_row
            collection_info.set_param(doc_name, "data_rows", doc_as_dict)
            mdata = collection_info.get_doc_metadata(doc_name)
            mdata["number_of_rows"] = len(drows)
            collection_info.set_doc_metadata(doc_name, mdata)
            self.UnfilterTable({"sid": sid})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def insert_row(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            doc_name = data["document_name"]
            index = data["index"]
            row_dict = data["row_dict"]

            dinfo = self.doc_dict[doc_name]
            header_list = collection_info.get_table_spec_param(doc_name, "header_list")
            fixed_row_dict = {}
            for cname in header_list:
                if cname in row_dict:
                    fixed_row_dict[cname] = row_dict[cname]
                else:
                    fixed_row_dict[cname] = ""

            drows = collection_info.all_sorted_data_rows(doc_name)
            drows.insert(index, fixed_row_dict)
            doc_as_dict = {}
            for r, the_row in enumerate(drows):
                the_row.pop("__id__", None)
                the_row.pop("__filename__", None)
                the_row["__id__"] = r
                the_row["__filename__"] = doc_name
                doc_as_dict[str(r)] = the_row
            collection_info.set_param(doc_name, "data_rows", doc_as_dict)

            collection_info.set_doc_metadata(doc_name, "number_of_rows", len(drows))
            self.UnfilterTable({"sid": sid})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def duplicate_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            new_doc_name = data["new_document_name"]
            original_doc_name = data["original_document_name"]
            collection_info.duplicate_doc(original_doc_name, new_doc_name)
            sess.visible_doc_name = new_doc_name
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                                   {"tile_id": None, "sid": sid})
            doc_names = collection_info.doc_names
            doc_names.sort()
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                              "visible_doc": new_doc_name})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def new_blank_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            new_doc_name = data["new_document_name"]
            model_doc_name = data["model_document_name"]

            if sess.doc_type == "freeform":
                collection_info.add_doc(new_doc_name, {
                    "data_text": "",
                    "metadata": {}
                })
            else:
                doc_as_dict = {}
                the_row = {}
                header_list = collection_info.get_table_spec_param(model_doc_name, "header_list")
                for h in header_list:
                    the_row[h] = ""
                the_row["__id__"] = 0
                the_row["__filename__"] = new_doc_name
                doc_as_dict["0"] = the_row


                mdata = {"header_list": header_list}
                collection_info.add_doc(new_doc_name, {
                    "metadata": mdata,
                    "data_rows": doc_as_dict
                })
            sess.visible_doc_name = new_doc_name
            self.mworker.post_task("main_service", "rebuild_tile_forms_task",
                                   {"tile_id": None, "sid": sid})
            doc_names = collection_info.doc_names
            doc_names.sort()
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                              "visible_doc": new_doc_name})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def add_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            new_doc_name = data["document_name"]
            header_list = data["column_names"]
            dict_list = data["dict_list"]
            doc_as_dict = {}
            for r, the_row in enumerate(dict_list):
                the_row.pop("__id__", None)
                the_row.pop("__filename__", None)
                the_row["__id__"] = r
                the_row["__filename__"] = new_doc_name
                doc_as_dict[str(r)] = the_row
            if "__filename__" not in header_list:
                header_list = ["__filename__"] + header_list
            if "__id__" not in header_list:
                header_list = ["__id__"] + header_list

            mdata = {
                "header_list": header_list,
            }
            collection_info.add_doc(new_doc_name, {
                "metadata": mdata,
                "data_rows": doc_as_dict
            })

            sess.visible_doc_name = new_doc_name
            self.mworker.post_task("main_serivce", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
            doc_names = collection_info.doc_names
            doc_names.sort()
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                              "visible_doc": new_doc_name})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def add_freeform_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            new_doc_name = data["document_name"]
            doc_text = data["doc_text"]
            collection_info.add_doc(new_doc_name, {
                "data_text": doc_text,
                "metadata": {},
            })
            sess.visible_doc_name = new_doc_name
            self.mworker.post_task("main_serivce", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
            doc_names = collection_info.doc_names
            doc_names.sort()
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                              "visible_doc": new_doc_name})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def remove_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            doc_name = data["document_name"]
            collection_info.delete_doc(doc_name)
            del self.doc_dict[doc_name]
            doc_names = collection_info.doc_names
            doc_names.sort()
            if sess.visible_doc_name == doc_name:
                sess.visible_doc_name = doc_names[0]
            self.rebuild_tile_forms_task({"sid": sid})
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                              "visible_doc": self.visible_doc_name})
            return {"success": True}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def rename_document(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        try:
            oldname = data["old_document_name"]
            newname = data["new_document_name"]
            name_exists = newname in collection_info.doc_names
            if name_exists:
                raise NameExistsError("Collection name {} already exists".format(newname))
            collection_info.rename_doc(oldname, newname)
            sess.visible_doc_name = newname
            self.mworker.post_task("main_serivce", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
            doc_names = collection_info.doc_names
            doc_names.sort()
            self.mworker.emit_table_message(sid, "updateDocList", {"doc_names": doc_names,
                                                                   "visible_doc": new_doc_name})
            return {"success": True, "message": "Successfully renamed document to " + str(newname)}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, print_to_console=True)
            return {"success": False, "message": error_string}

    def grab_chunk(self, sid, doc_name, row_index):
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        chunk_number = int(int(row_index) / CHUNK_SIZE)
        chunk_start = chunk_number * CHUNK_SIZE
        data_to_send = collection_info.sorted_data_rows(doc_name)[chunk_start:chunk_start + CHUNK_SIZE]
        data_row_dict = {}
        for n, row in enumerate(data_to_send):
            data_row_dict[chunk_start + n] = row
        print("leaving grab_chunk")
        return {"doc_name": doc_name,
                "total_rows": len(collection_info.get_current_data_rows(doc_name)),
                "data_row_dict": data_row_dict,
                "table_spec": collection_info.get_table_spec_params(doc_name)}

    @task_worthy
    def grab_chunk_by_row_index(self, data):
        sid = data["sid"]
        if "set_visible_doc" in data and data["set_visible_doc"]:
            self.set_visible_doc(data)
        return self.grab_chunk(sid, data["doc_name"], data["row_index"])

    @task_worthy
    def grab_freeform_data(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        if "set_visible_doc" in data and data["set_visible_doc"]:
            self.set_visible_doc(data)
        doc_name = data["doc_name"]
        dtext = collection_info.data_text(doc_name)
        return {"doc_name": doc_name,
                "data_text": dtext}

    @task_worthy
    def UpdateTableSpec(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info

        doc_name = data["doc_name"]
        update_dict = {}
        if "column_widths" in data:
            update_dict["column_widths"] = data["column_widths"]
        if "hidden_columns_list" in data:
            update_dict["hidden_columns_list"] = data["hidden_columns_list"]
        if "column_names" in data:
            update_dict["header_list"] = data["column_names"]
        collection_info.set_table_spec_from_dict(doc_name, update_dict)
        self.mworker.post_task("main_service", "rebuild_tile_forms_task", {
            "tile_id": None, "sid": sid})
        return None

    @task_worthy
    def UpdateHeaderListOrder(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        header_list = data["header_list"]
        hidden_columns_list = data["hidden_columns_list"]
        if "doc_name" in data:
            doc_name = data["doc_name"]
            update_dict = {}
            update_dict.header_list = header_list
            update_dict.hidden_columns_list = hidden_columns_list
            collection_info.set_table_spec_from_dict(doc_name, update_dict)
        else:
            for doc_name in collection_info.doc_names:
                current_list = collection_info.get_header_list(doc_name)
                new_header_list = copy.copy(header_list)
                for header in current_list:
                    if header not in new_header_list:
                        new_header_list.append(header)
                update_dict = {
                    "header_list": new_header_list,
                    "hidden_columns_list": hidden_columns_list,
                }
                collection_info.set_table_spec_from_dict(doc_name, update_dict)

        self.mworker.post_task("main_service", "rebuild_tile_forms_task",
                               {"tile_id": None, "sid": sid})
        return None

    @task_worthy
    def HideColumnInAllDocs(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection_info
        column_name = data["column_name"]
        for doc_name in collection_info.doc_names:
            try:
                header_list = collection_info.get_header_list(doc_name)
                hidden_columns_list = collection_info.get_hidden_columns_list(doc_name)
                table_spec = collection_info.get_table_spec_params(doc_name)
                visible_columns = collection_info.get_visible_columns(doc_name)
                if column_name in header_list and column_name not in hidden_columns_list:
                    update_dict = {}
                    if "column_widths" in table_spec and type(table_spec["column_widget"]) == list:
                        column_widths = table_spec["column_widget"]
                        col_index = visible_columns.index(column_name)
                        del column_widths[col_index]
                        update_dict["column_widths"] = column_widths
                    hidden_columns_list.append(column_name)
                    update_dict["hidden_columns_list"] = hidden_columns_list
                    collection_info.set_table_spec_param(doc_name, update_dict)
            except Exception as ex:
                error_string = self.get_traceback_message(ex)
                print(error_string)
        return None

    @task_worthy
    def UpdateColumnWidths(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection
        doc_name = data["doc_to_update"]
        collection_info.set_table_spec_param(doc_name, "column_widths", data["column_widths"])
        return None

    @task_worthy
    def CreateColumn(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection
        column_name = data["column_name"]
        if not data["all_docs"]:
            doc_names = [data["doc_name"]]
        else:
            doc_names = collection_info.doc_names
        for doc_name in doc_names:
            header_list = collection_info.get_header_list(doc_name)
            header_list.append(column_name)
            collection_info.set_table_spec_param(doc_name, "header_list", header_list)
            column_widths = collection_info.get_column_widths(doc_name)
            column_widths.append(data["column_width"])
            collection_info.set_table_spec_param(doc_name, "column_widgets", column_widths)
            data_rows = collection_info.get_data_rows(doc_name)
            for r in data_rows.values():
                r[column_name] = ""
            collection_info.set_param(doc_name, "data_rows", data_rows)

        self.mworker.post_task("main_serivce", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
        return None

    def delete_column_one_doc(self, sid, doc_name, column_name):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection
        try:
            print("in DeleteColumnOneDoc new with " + doc.table_spec.doc_name)
            header_list = collection_info.get_header_list(doc_name)
            if column_name in header_list:
                update_dict = {}
                print("got the column")
                column_widths = collection_info.get_column_widths(doc_name)
                if type(column_widths) is list:
                    print("going to delete from column_widths")
                    col_index = collection_info.visible_columns(doc_name).index(column_name)
                    print("got the index")
                    del column_widths[col_index]
                    update_dict["column_widths"] = column_widths
                header_list.remove(column_name)
                update_dict["header_list"] = header_list
                collection_info.set_table_spec_from_dict(doc_name, update_dict)
            print("deleting from data rows")
            data_rows = collection_info.get_data_rows(doc_name)
            for r in data_rows.values():
                if column_name in r:
                    del r[column_name]
            collection_info.set_param(doc_name, "data_rows", data_rows)
        except Exception as ex:
            error_string = self.get_traceback_message(ex)
            print(error_string)
        print("leaving DeleteColumnOneDoc")
        return

    @task_worthy
    def delete_column(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        collection_info = sess.collection
        column_name = data["column_name"]
        if not data["all_docs"]:
            print("just deleting in one")
            self.delete_column_one_doc(sid, data["doc_name"], column_name)
        else:
            print("deleting in all docs")
            for doc_name in collection_info.doc_names:
                self.delete_column_one_doc(sid, doc_name, column_name)
        self.mworker.post_task("main_servivce", "rebuild_tile_forms_task", {"tile_id": None, "sid": sid})
        return None
