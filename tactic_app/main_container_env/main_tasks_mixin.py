
import datetime
import re
import os
import uuid
import copy
import json
from qworker import task_worthy_methods, task_worthy_manual_submit_methods
from communication_utils import make_python_object_jsonizable, debinarize_python_object, store_temp_data
from communication_utils import make_jsonizable_and_compress, read_project_dict
import docker_functions
from mongo_accesser import bytes_to_string

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))


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
    def TextSelect(self, data):
        self.selected_text = data["selected_text"]
        return None


# noinspection PyUnusedLocal
class LoadSaveTasksMixin:

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
            elif (type(attr_val) == dict) and (len(attr_val) > 0) and hasattr(list(attr_val.values())[0],
                                                                              "compile_save_dict"):
                res = {}
                for (key, val) in attr_val.items():
                    res[key] = val.compile_save_dict()
                result[attr] = res
            else:
                result[attr] = attr_val
        tile_save_dicts = {}
        if not self.doc_type == "notebook":
            tile_ids_to_compile = copy.copy(self.tile_instances)
            if self.pseudo_tile_id is not None:
                tile_ids_to_compile.append(self.pseudo_tile_id)
                self.mworker.post_task(self.pseudo_tile_id, "compile_save_dict",
                                       callback_func=track_tile_compile_receipts)
            if not tile_ids_to_compile:
                result["used_tile_types"] = []
                result["used_modules"] = []
                result["pseudo_tile_instance"] = None
                result["tile_instances"] = {}
                if self.purgetiles:
                    result["loaded_modules"] = []
                self.mworker.submit_response(task_packet, result)
                return

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

    def convert_jupyter_cells(self, jupyter_cell_list):
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
                    "output_text": "",
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

    @task_worthy
    def do_full_jupyter_recreation(self, data_dict):
        tile_containers = {}
        try:
            print("Entering do_full_jupyter_recreation")
            self.show_main_status_message("Entering do_full_jupyter_recreation")
            project_name = data_dict["project_name"]
            save_dict = self.db[self.project_collection_name].find_one({"project_name": project_name})
            self.mdata = save_dict["metadata"]
            project_dict = read_project_dict(self.fs, self.mdata, save_dict["file_id"])
            jupyter_text = project_dict["jupyter_text"]
            jupyter_dict = json.loads(jupyter_text)
            converted_cells = self.convert_jupyter_cells(jupyter_dict["cells"])
            interface_state = {"console_items": converted_cells}
            self.clear_main_status_message()
            self.mworker.emit_to_main_client("finish-post-load", {"message": "finish-post-load",
                                                                  "collection_name": "",
                                                                  "short_collection_name": "",
                                                                  "interface_state": interface_state,
                                                                  "doc_names": []})

        except Exception as ex:
            error_string = self.get_traceback_message(ex)
            self.show_error_window(error_string)
            container_list = [self.mworker.my_id] + list(tile_containers.keys())
            self.mworker.ask_host("delete_container_list", {"container_list": container_list})
        return

    @task_worthy
    def do_full_recreation(self, data_dict):
        def track_loaded_modules(tlmdata):
            print("entering track_loaded_modules")

            def track_recreated_tiles(trcdata):
                print("tracking created tiles")
                if trcdata["old_tile_id"] in tiles_to_recreate:
                    self.mworker.emit_to_main_client("tile-finished-loading", {"message": "tile-finished-loading",
                                                                               "tile_id": trcdata["old_tile_id"]})
                    tiles_to_recreate.remove(trcdata["old_tile_id"])
                    tsdict = self.project_dict["tile_instances"][trcdata["old_tile_id"]]
                    self.tile_id_dict[tsdict["tile_name"]] = trcdata["old_tile_id"]
                if not tiles_to_recreate:
                    print("done recreating tiles")
                    self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {})
                    self.clear_main_status_message()
                    self.stop_main_status_spinner()
                return

            if tlmdata is not None:
                if tlmdata["module_name"] in modules_to_load:
                    modules_to_load.remove(tlmdata["module_name"])
            if not modules_to_load:
                print("finished loading modules, ready to recreate tiles")
                self.show_main_status_message("Recreating tiles")
                self.tile_save_results = {}

                tiles_to_recreate = list(self.project_dict["tile_instances"].keys())
                if not tiles_to_recreate:
                    print("no tiles to recreate")
                    self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {})
                    self.clear_main_status_message()
                    self.stop_main_status_spinner()
                    return
                print("about to recreate tiles one at a time")
                for old_tile_id, tile_save_dict in self.project_dict["tile_instances"].items():
                    data_for_tile = {"old_tile_id": old_tile_id,
                                     "tile_save_dict": tile_save_dict}
                    self.mworker.post_task(self.mworker.my_id, "recreate_one_tile", data_for_tile,
                                           track_recreated_tiles)

        print("Entering do_full_recreation")
        self.show_main_status_message("Entering do_full_recreation")
        self.tile_instances = []
        tile_info_dict, loaded_modules, interface_state, success = self.recreate_from_save(data_dict["project_name"])
        if not success:
            self.show_main_status_message("Error trying to recreate the project from save")
            self.show_error_window(tile_info_dict)
            return

        self.show_main_status_message("Recreating the console")

        task_data = {"message": "finish-post-load",
                     "collection_name": self.collection_name,
                     "short_collection_name": self.short_collection_name,
                     "doc_names": self.doc_names,
                     "interface_state": interface_state}

        if self.doc_type == "table":
            task_data.update(self.grab_chunk_by_row_index(
                {"doc_name": self.doc_names[0], "row_index": 0, "set_visible_doc": True}))
        else:
            task_data.update(
                self.grab_freeform_data({"doc_name": self.doc_names[0], "set_visible_doc": True}))

        self.mworker.emit_to_main_client("finish-post-load", task_data)

        self.show_main_status_message("Making modules available")
        modules_to_load = copy.copy(loaded_modules)
        if not modules_to_load:
            track_loaded_modules(None)
        else:
            for the_module in loaded_modules:
                self.mworker.post_task("host", "load_module_if_necessary",
                                       {"tile_module_name": the_module, "user_id": self.user_id},
                                       track_loaded_modules)
        return

    @task_worthy
    def do_full_notebook_recreation(self, data_dict):
        tile_containers = {}
        try:
            print("Entering do_full_notebook_recreation")
            self.show_main_status_message("Entering do_full_notebook_recreation")
            if "unique_id" in data_dict:
                interface_state, success = self.recreate_from_save("", data_dict["unique_id"])
            else:
                interface_state, success = self.recreate_from_save(data_dict["project_name"])
            print("returned from recreate_from_save")
            if not success:
                self.show_main_status_message("Error trying to recreate the project from save")
                self.show_error_window(tile_info_dict)
                return

            if self.pseudo_tile_id is None:
                self.create_pseudo_tile()

            self.clear_main_status_message()
            print("about to emit finished to client")
            self.mworker.emit_to_main_client("finish-post-load",
                                             {"message": "finish-post-load",
                                              "collection_name": "",
                                              "short_collection_name": "",
                                              "interface_state": interface_state,
                                              "doc_names": []})
        except Exception as ex:
            error_string = self.get_traceback_message(ex)
            self.show_error_window(error_string)
            container_list = [self.mworker.my_id] + list(tile_containers.keys())
            self.mworker.ask_host("delete_container_list", {"container_list": container_list})
        return

    @task_worthy_manual_submit
    def save_new_project(self, data_dict, task_packet):

        def got_save_dict(project_dict):
            print("in got_save_dict in main")
            self.mdata = self.create_initial_metadata()
            self.mdata["type"] = self.doc_type
            self.mdata["collection_name"] = self.collection_name
            self.mdata["loaded_tiles"] = project_dict["used_tile_types"]
            self.mdata["save_style"] = "b64save_react"
            project_dict["interface_state"] = data_dict["interface_state"]
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
                           "message": "Project Successfully Saved"}
            self.mworker.submit_response(task_packet, return_data)

        try:
            self.project_name = data_dict["project_name"]
            self.purgetiles = data_dict["purgetiles"]
            self.show_main_status_message("Getting loaded modules")
            self.loaded_modules = self.get_loaded_user_modules()
            self.show_main_status_message("compiling save dictionary")
            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        except Exception as ex:
            self.mworker.debug_log("got an error in save_new_project")
            error_string = self.handle_exception(ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_reponse(task_packet, _return_data)
        return

    @task_worthy_manual_submit
    def save_new_notebook_project(self, data_dict, task_packet):
        # noinspection PyBroadException
        def got_save_dict(project_dict):
            self.mdata = self.create_initial_metadata()
            self.mdata["type"] = "notebook"
            self.mdata["collection_name"] = ""
            self.mdata["loaded_tiles"] = []
            self.mdata["save_style"] = "b64save_react"
            project_dict["interface_state"] = data_dict["interface_state"]
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
                           "message": "Project Successfully Saved"}
            self.mworker.submit_response(task_packet, return_data)

        try:
            self.project_name = data_dict["project_name"]
            self.purgetiles = True

            self.show_main_status_message("compiling save dictionary")
            self.doc_type = "notebook"  # This is necessary in case we're saving a juypyter notebook
            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        except Exception as ex:
            self.mworker.debug_log("got an error in save_new_project")
            error_string = self.handle_exception(ex, "<pre>Error saving new project</pre>", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_response(task_packet, _return_data)
        return

    @task_worthy_manual_submit
    def update_project(self, data_dict, task_packet):
        # noinspection PyBroadException
        print("entering update_project")

        def got_save_dict(project_dict):
            try:
                print("got save dict in update_project")
                pname = data_dict["project_name"]
                self.mdata["updated"] = datetime.datetime.utcnow()
                self.mdata["save_style"] = "b64save_react"
                project_dict["interface_state"] = data_dict["interface_state"]
                project_dict["project_name"] = pname  # sync these up for no reason
                if not self.doc_type == "notebook":
                    self.mdata["collection_name"] = self.collection_name
                    self.mdata["loaded_tiles"] = project_dict["used_tile_types"]
                    if self.purgetiles:
                        project_dict["loaded_modules"] = project_dict["used_modules"]
                self.show_main_status_message("Pickle, convert, compress")
                pdict = make_jsonizable_and_compress(project_dict)
                self.show_main_status_message("Writing the data")
                new_file_id = self.fs.put(pdict)
                print("using pname {}, project_collection_name {}".format(pname, self.project_collection_name))
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
                return
            except Exception as lex:
                lerror_string = self.handle_exception(lex, "Error saving project", print_to_console=False)
                _lreturn_data = {"success": False, "message": lerror_string}
                self.mworker.submit_response(task_packet, _lreturn_data)
                return

        try:
            self.show_main_status_message("Getting loaded modules")
            self.loaded_modules = self.get_loaded_user_modules()
            self.show_main_status_message("compiling save dictionary")
            self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)

        except Exception as ex:
            error_string = self.handle_exception(ex, "Error saving project", print_to_console=False)
            _return_data = {"success": False, "message": error_string}
            self.mworker.submit_response(task_packet, _return_data)
        return

    @task_worthy
    def export_to_jupyter_notebook(self, data_dict):
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
            metadata = {}
            metadata["kernelspec"] = {"display_name": "Python 3", "language": "python", "name": "python3"}
            full_dict = {"metadata": metadata,
                         "nbformat": 4,
                         "nbformat_minor": 2,
                         "cells": data_dict["cell_list"]}
            notebook_json = json.dumps(full_dict, indent=1, sort_keys=True)
            mdata = self.create_initial_metadata()
            mdata["type"] = "jupyter"
            mdata["save_style"] = "b64save"
            save_dict = {"metadata": mdata,
                         "project_name": new_project_name}
            project_dict = {"jupyter_text": notebook_json}
            pdict = make_jsonizable_and_compress(project_dict)
            save_dict["file_id"] = self.fs.put(pdict)
            self.db[self.project_collection_name].insert_one(save_dict)
            _return_data = {"project_name": data_dict["project_name"],
                            "success": True,
                            "message": "Notebook Successfully Exported"}

        except Exception as ex:
            self.mworker.debug_log("got an error in export_to_jupyter_notebook")
            error_string = self.handle_exception(ex, "<pre>Error exporting to jupyter notebook</pre>",
                                                 print_to_console=False)
            _return_data = {"success": False, "message": error_string}
        return _return_data

    @task_worthy
    def console_to_notebook(self, data_dict):
        self.show_main_status_message("compiling save dictionary")

        def got_save_dict(console_dict):
            console_dict["doc_type"] = "notebook"
            console_dict["interface_state"] = {"console_items": data_dict["console_items"]}
            cdict = make_jsonizable_and_compress(console_dict)
            save_dict = {}
            save_dict["file_id"] = self.fs.put(cdict)
            save_dict["user_id"] = self.user_id
            unique_id = store_temp_data(self.db, save_dict)
            self.mworker.emit_to_main_client("notebook-open", {"message": "notebook-open", "the_id": unique_id})
            return

        self.mworker.post_task(self.mworker.my_id, "compile_save_dict", {}, got_save_dict)
        return {"success": True}

    @task_worthy_manual_submit
    def change_collection(self, data_dict, task_packet):
        local_task_packet = task_packet

        def got_full_collection_name(fcn_result):
            full_collection_name = fcn_result["full_collection_name"]
            the_collection = self.db[full_collection_name]
            mdata = the_collection.find_one({"name": "__metadata__"})
            if "type" in mdata and mdata["type"] == "freeform":
                doc_type = "freeform"
            else:
                doc_type = "table"
            if not doc_type == self.doc_type:
                error_string = "Cannot replace a collection with a different type"
                return_data = {"success": False, "message": error_string}
                return return_data
            doc_names = []
            self.short_collection_name = short_collection_name
            self.collection_name = full_collection_name
            for f in the_collection.find():
                fname = bytes_to_string(f["name"])
                if fname == "__metadata__":
                    continue
                else:
                    doc_names.append(fname)
            self.doc_dict = self._build_doc_dict()
            self.visible_doc_name = list(self.doc_dict)[0]
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
            print("type of collection name is {}".format(type(self.collection_name)))
            print(type(self.collection_name))
            print("type of short collection name is {}".format(type(self.short_collection_name)))
            return_data = {"success": True,
                           "collection_name": self.collection_name,
                           "short_collection_name": self.short_collection_name,
                           "doc_names": doc_names}
            self.mworker.submit_respone(return_data, local_task_packet)

        short_collection_name = data_dict["new_collection_name"]
        data = {"user_id": self.user_id, "collection_name": short_collection_name}

        self.mworker.post_task("host", "get_full_collection_name", data, got_full_collection_name)

        return


class TileCreationTasksMixin:

    @task_worthy_manual_submit
    def create_tile(self, data_dict, task_packet):
        print("entering create tile")
        tile_name = data_dict["tile_name"]
        local_task_packet = task_packet
        print("about to create container, starting timer")
        self.tstart = datetime.datetime.now()

        create_container_dict = self.create_tile_container({"user_id": self.user_id, "parent": self.mworker.my_id,
                                                            "other_name": tile_name, "ppi": self.ppi,
                                                            "tile_id": None})

        if not create_container_dict["success"]:
            raise Exception("Error creating empty tile container")
        print("got container, time is {}".format(self.microdsecs(self.tstart)))
        self.tstart = datetime.datetime.now()

        tile_container_id = create_container_dict["tile_id"]
        self.tile_instances.append(tile_container_id)
        self.tile_addresses[tile_container_id] = create_container_dict["tile_address"]
        data_dict["tile_address"] = create_container_dict["tile_address"]
        self.tile_id_dict[tile_name] = tile_container_id

        data_dict["base_figure_url"] = self.base_figure_url.replace("tile_id", tile_container_id)
        data_dict["doc_type"] = self.doc_type
        print("about to get tile_code")
        data_dict["tile_code"] = self.get_tile_code(data_dict["tile_type"])
        print("got tile code")
        data_dict["form_info"] = self.compile_form_info(tile_container_id)
        print("compiled form info")

        def instantiated_result(instantiate_result):
            print("got instantiate result, time is {}".format(self.microdsecs(self.tstart)))
            self.tstart = datetime.datetime.now()
            if not instantiate_result["success"]:
                self.mworker.debug_log("got an exception " + instantiate_result["message"])
                raise Exception(instantiate_result["message"])

            exports = instantiate_result["exports"]
            self.update_pipe_dict(exports, tile_container_id, tile_name)

            form_data = instantiate_result["form_data"]
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                                   {"tile_id": tile_container_id})
            self.tile_sort_list.append(tile_container_id)
            response_data = {"success": True, "form_data": form_data, "tile_id": tile_container_id}
            self.mworker.submit_response(local_task_packet, response_data)
            #
            # def got_form_data(response):
            #     print("got form data, time is {}".format(self.microdsecs(self.tstart)))
            #     self.tstart = datetime.datetime.now()
            #     form_data = response["form_data"]
            #     self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
            #                            {"tile_id": tile_container_id})
            #     self.tile_sort_list.append(tile_container_id)
            #     response_data = {"success": True, "form_data": form_data, "tile_id": tile_container_id}
            #     self.mworker.submit_response(local_task_packet, response_data)

            # form_info = self.compile_form_info(tile_container_id)
            # self.mworker.post_task(tile_container_id, "_create_form_data", form_info, got_form_data)

        print("about to load source and instantiate tid = " + str(tile_container_id))
        self.mworker.post_task(tile_container_id, "load_source_and_instantiate", data_dict, instantiated_result)
        return

    @task_worthy_manual_submit
    def recreate_one_tile(self, data, task_packet):
        print("in recreate one tile")
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
            if new_id:
                self.mworker.ask_host("delete_container", {"container_id": new_id[0]})
            if "message" in response_data:
                message = response_data["message"]
            elif "message" in response_data:
                message = response_data["message"]
            else:
                message = "Got a response error with status {} for event_type {}".format(tphrc["status"],
                                                                                         tphrc["task_type"])
            self.mworker.send_error_entry("Project recreation tphrc", message)
            self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
            return

        tile_code = self.get_tile_code(tile_save_dict["tile_type"])

        gtc_response = self.create_tile_container({"user_id": self.user_id, "parent": self.mworker.my_id,
                                                   "other_name": tile_name, "ppi": self.ppi, "tile_id": old_tile_id})
        if not gtc_response["success"]:
            self.mworker.send_error_entry("Project recreation tphrc", gtc_response["message"],)
            self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
            return

        new_id.append(gtc_response["tile_id"])

        self.tile_addresses[gtc_response["tile_id"]] = gtc_response["tile_address"]
        tile_save_dict["new_base_figure_url"] = self.base_figure_url.replace("tile_id", new_id[0])
        tile_save_dict["my_address"] = gtc_response["tile_address"]
        tile_save_dict["ppi"] = self.ppi
        lsdata = {"tile_code": tile_code, "tile_save_dict": tile_save_dict}

        def recreate_done(recreate_response):
            exports = recreate_response["exports"]
            self.update_pipe_dict(exports, new_id[0], tile_name)
            self.mworker.emit_export_viewer_message("update_exports_popup", {})
            self.tile_save_results[new_id[0]] = recreate_response
            self.tile_instances.append(new_id[0])
            self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
            return

        self.mworker.post_task(new_id[0], "load_source_and_recreate", lsdata, recreate_done,
                               expiration=60, error_handler=handle_response_error)

    @task_worthy
    def rebuild_tile_forms_task(self, ddict):
        if "tile_id" not in ddict:
            tile_id = None
        else:
            tile_id = ddict["tile_id"]

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

        for tid in self.tile_instances:
            if tile_id is None or not tid == tile_id:
                form_info["other_tile_names"] = self.get_other_tile_names(tid)
                self.mworker.post_task(tid, "RebuildTileForms", form_info)
        return

    @task_worthy_manual_submit
    def reload_tile(self, ddict, task_packet):
        local_task_packet = task_packet
        tile_id = bytes_to_string(ddict["tile_id"])
        print("got tile_id {}".format(str(tile_id)))
        print(str(ddict))

        def got_tile_type(gtp_response):
            tile_type = gtp_response["val"]
            module_code = self.get_tile_code(tile_type)

            def got_reload_attrs(gra_response):
                reload_dict = copy.copy(gra_response["val"])

                def got_current_options(gco_response):
                    saved_options = copy.copy(gco_response["val"])
                    reload_dict.update(saved_options)
                    reload_dict["old_option_names"] = list(saved_options.keys())
                    print("tile_id is {}".format(tile_id))
                    print("tile container status is {}".format(docker_functions.container_status(tile_id)))
                    self.mworker.post_task(tile_id, "kill_me", {})
                    docker_functions.wait_until_stopped(tile_id)
                    print("restarting container from main")
                    print("tile container status is {}".format(docker_functions.container_status(tile_id)))
                    docker_functions.restart_container(tile_id)
                    docker_functions.wait_until_running(tile_id)
                    # self.mworker.post_task("host", "restart_container", {"tile_id": tile_id})

                    def reinstantiate_done(reinst_result):
                        if reinst_result["success"]:
                            exports = reinst_result["exports"]  # This is the issue
                            self.update_pipe_dict(exports, tile_id, ddict["tile_name"])
                            form_info["pipe_dict"] = self._pipe_dict
                            self.rebuild_other_tile_forms(tile_id, form_info)
                            self.mworker.emit_export_viewer_message("update_exports_popup", {})
                            final_result = {"success": True, "form_data": reinst_result["form_data"],
                                            "options_changed": reinst_result["options_changed"]}
                            self.mworker.submit_response(local_task_packet, final_result)
                        else:
                            raise Exception(reinst_result["message"])

                    form_info = self.compile_form_info(tile_id)
                    reload_dict["form_info"] = form_info
                    reload_dict["tile_address"] = self.tile_addresses[tile_id]
                    print("about to load_source")
                    print("tile container status is {}".format(docker_functions.container_status(tile_id)))
                    self.mworker.post_task(tile_id, "load_source_and_reinstantiate", {"tile_code": module_code,
                                                                                      "reload_dict": reload_dict},
                                           reinstantiate_done)

                self.get_tile_property(tile_id, "_current_options", got_current_options)

            self.get_tile_property(tile_id, "_current_reload_attrs", got_reload_attrs)

        self.get_tile_property(tile_id, "tile_type", got_tile_type)

    @task_worthy
    def RemoveTile(self, data):
        self._delete_tile_instance(data["tile_id"])
        return None

    @task_worthy
    def OtherTileData(self, data):
        other_tile_data = {}
        for n, tid in self.tile_id_dict.items():
            if not tid == data["tile_id"]:
                new_entry = {"tile_id": tid}
                if tid in self._pipe_dict:
                    new_entry["pipes"] = list(self._pipe_dict[tid].values())
                else:
                    new_entry["pipes"] = None
                other_tile_data[n] = new_entry
        return other_tile_data

    @task_worthy_manual_submit
    def compile_form_info_task(self, data, task_packet):
        tile_id = data["tile_id"]
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
        self.mworker.submit_response(task_packet, form_info)
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
        success = self.mworker.distribute_event(event_name, data_dict, tile_id)
        return {"success": success}

    @task_worthy
    def get_column_data(self, data):
        result = []
        ddata = copy.copy(data)
        for doc_name in self.doc_dict.keys():
            ddata["doc_name"] = doc_name
            result += self.get_column_data_for_doc(ddata)
        return result

    @task_worthy
    def get_matching_documents(self, data):
        ffunction = debinarize_python_object(data["filter_function"])
        result = []
        for doc_name, dinfo in self.doc_dict.items():
            if ffunction(dinfo.metadata):
                result.append(doc_name)
        return result

    @task_worthy
    def get_collection_names(self, data):
        return {"success": True, "collection_names": self.data_collections}

    @task_worthy
    def get_list_names(self, data):
        return {"success": True, "list_names": self.list_names}

    @task_worthy
    def get_function_tags_dict(self, data):
        return {"success": True, "list_names": self.function_tags_dict}

    @task_worthy
    def get_resource_names_task(self, data):
        print("in get_resource_names_task")
        res_names = self.get_resource_names(data["res_type"], data["tag_filter"], data["search_filter"])
        return {"success": True, "res_names": res_names}

    @task_worthy
    def get_user_collection(self, task_data):
        new_collection_dict, dmdict, hldict, cm = self.get_all_collection_info(task_data["collection_name"])
        if new_collection_dict is None:
            result = {"success": False, "message": "Collection doesn't exist."}
        else:
            result = {"success": True, "the_collection": new_collection_dict}
        return result

    @task_worthy
    def get_user_collection_with_metadata(self, task_data):
        new_collection_dict, dmdict, hldict, cm = self.get_all_collection_info(task_data["collection_name"])
        if new_collection_dict is None:
            result = {"success": False, "message": "Collection doesn't exist."}
        else:
            result = {"the_collection": new_collection_dict,
                      "doc_metadata": dmdict,
                      "collection_metadata": cm}
        return {"success": True, "collection_data": make_python_object_jsonizable(result)}

    @task_worthy
    def get_list_with_metadata(self, data):
        result = self.db[self.list_collection_name].find_one({"list_name": data["list_name"]})
        list_dict = {"the_list": result["the_list"],
                     "list_name": result["list_name"],
                     "metadata": result["metadata"]}
        print("returning")
        return {"list_data": make_python_object_jsonizable(list_dict)}

    @task_worthy
    def get_function_names(self, data):
        tag_filter = data["tag_filter"]
        search_filter = data["search_filter"]
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
            return {}
        function_names = []
        for doc in self.db[self.code_collection_name].find():
            if tag_filter is not None:
                if "metadata" in doc:
                    if "tags" in doc["metadata"]:
                        if tag_filter in doc["metadata"]["tags"].lower():
                            function_names += doc["metadata"]["functions"]
            elif search_filter is not None:
                for fname in doc["metadata"]["functions"]:
                    if search_filter in fname.lower():
                        function_names += doc[fnames]
            else:
                function_names += doc["metadata"]["functions"]
        return {"function_names": function_names}

    @task_worthy
    def get_function_with_metadata(self, data):
        function_name = data["function_name"]
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
        found = False
        doc = None
        for doc in self.db[self.code_collection_name].find():
            if function_name in doc["metadata"]["functions"]:
                found = True
                break
        if not found:
            function_dict = None
        else:
            function_dict = {"the_code": doc["the_code"],
                             "code_name": doc["code_name"],
                             "metadata": doc["metadata"]}
        return {"function_data": make_python_object_jsonizable(function_dict)}

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
    def get_collection_info(self, data):
        print("in get_collection_info")
        info = {}
        for doc_name, ddict in self.doc_dict.items():
            info[doc_name] = {}
            info[doc_name]["number_rows"] = ddict.number_of_rows
            if self.doc_type == "table":
                info[doc_name]["column_names"] = ddict.table_spec.header_list
        print("about to return from get_collection_info")
        return info

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
    def get_rows(self, data):
        doc_name = data["document_name"]
        start = data["start"]
        stop = data["stop"]
        row_list = self.doc_dict[doc_name].get_rows(start, stop)
        return row_list

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
        doc_dict = {}
        metadata_dict = {}
        header_list_dict = {}
        for doc_name in self.doc_dict.keys():
            if self.doc_type == "table":
                doc_dict[doc_name] = self.doc_dict[doc_name].all_sorted_data_rows
                header_list_dict[doc_name] = self.doc_dict[doc_name].table_spec.header_list
            else:
                doc_dict[doc_name] = self.doc_dict[doc_name].all_data
            metadata_dict[doc_name] = self.doc_dict[doc_name].metadata
        try:
            result = self.create_complete_collection(data["export_name"],
                                                     doc_dict,
                                                     self.doc_type,
                                                     metadata_dict,
                                                     header_list_dict)
            self.mworker.ask_host("update_collection_selector_list", {"user_id": self.user_id})
            return result
        except Exception as ex:
            error_string = self.handle_exception(ex, print_to_console=True)
            return {"success": False, "message": error_string}

    @task_worthy
    def create_collection(self, data):
        print("in create_collection")
        try:
            result = self.create_complete_collection(data["name"],
                                                     data["doc_dict"],
                                                     data["doc_type"],
                                                     data["doc_metadata"],
                                                     data["header_list_dict"],
                                                     data["collection_metadata"])
            print('got result form create_complete_collection')

            if result["success"]:
                print("got success")
                self.mworker.ask_host("update_collection_selector_list", {"user_id": self.user_id})
            print("done with create_collection")
            return result
        except Exception as ex:
            error_string = self.handle_exception(ex, print_to_console=True)
            return {"success": False, "message": error_string}

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
    def SearchTable(self, data):
        self.highlight_table_text(data["text_to_find"])
        return None

    @task_worthy
    def FilterTable(self, data):
        txt = data["text_to_find"]
        self.display_matching_rows_applying_filter(lambda r: self.txt_in_dict(txt, r))
        # self.highlight_table_text(txt)
        return None

    @task_worthy
    def DehighlightTable(self, data):
        self.mworker.emit_table_message("dehighlightAllText")
        return None

    @task_worthy
    def UnfilterTable(self, data):
        for doc in self.doc_dict.values():
            doc.current_data_rows = doc.data_rows
        self.refill_table()
        return None

    @task_worthy
    def ColorTextInCell(self, data):
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
                    if key not in ["__id__", "__filename__"]:
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
            self.refill_table()
        else:
            for docname, doc in self.doc_dict.items():
                doc.current_data_rows = {}
                for (key, val) in doc.data_rows.items():
                    if int(key) in result[docname]:
                        doc.current_data_rows[key] = val
            self.refill_table()
        return

    @task_worthy
    def SetCellBackground(self, data):
        self._set_cell_background(data["doc_name"], data["row_id"], data["column_name"], data["color"])
        return None

    @task_worthy
    def get_code_with_class(self, data):  # tactic_working This won't work now
        class_name = data["class_name"]
        the_code = mongo_accesser.get_code_with_class(class_name)
        if the_code is None:
            return {"succcess": False, "message": "Couldn't get the code."}
        return {"success": True, "the_code": the_code}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        log_text = docker_functions.get_log(container_id).decode()
        return {"success": True, "log_text": log_text}


# noinspection PyUnusedLocal
class ExportsTasksMixin:

    @task_worthy
    def get_full_pipe_dict(self, data):
        converted_pipe_dict = {}
        for tile_id, tile_entry in self._pipe_dict.items():
            first_full_name = list(tile_entry)[0]
            first_short_name = list(tile_entry.values())[0]["export_name"]
            tile_name = re.sub("_" + first_short_name, "", first_full_name)
            converted_pipe_dict[tile_name] = []

            for full_export_name, edict in tile_entry.items():
                converted_pipe_dict[tile_name].append([full_export_name, edict["export_name"]])

        return {"success": True, "pipe_dict": converted_pipe_dict}

    @task_worthy
    def get_exports_list_html(self, data):
        the_html = ""
        export_list = []
        for tile_id, tile_entry in self._pipe_dict.items():
            first_full_name = list(tile_entry)[0]
            first_short_name = list(tile_entry.values())[0]["export_name"]
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


# noinspection PyUnusedLocal
class ConsoleTasksMixin:

    @task_worthy
    def get_pseudo_tile_id(self, data):
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        return {"success": True, "pseudo_tile_id": self.pseudo_tile_id}

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
    def create_console_text_item(self, data):
        unique_id = str(uuid.uuid4())
        return self.mworker.print_text_area_to_console(unique_id, data["the_text"], force_open=True)

    @task_worthy
    def got_console_result(self, data):
        self.mworker.emit_console_message("stopConsoleSpinner", {"console_id": data["console_id"],
                                                                 "execution_count": data["execution_count"],
                                                                 "force_open": True})
        return {"success": True}

    @task_worthy
    def got_console_print(self, data):
        self.mworker.emit_console_message("consoleCodePrint", {"message": data["result_string"],
                                                               "console_id": data["console_id"],
                                                               "force_open": True})
        return {"success": True}

    @task_worthy
    def exec_console_code(self, data):
        print("in exec_console_code")
        if self.pseudo_tile_id is None:
            self.create_pseudo_tile()
        print("pseudo_tile is created")
        the_code = data["the_code"]
        self.dict = self._pipe_dict
        data["pipe_dict"] = self.dict
        data["am_notebook"] = self.am_notebook_type
        print("posting exec_console_code to the pseudo_tile")
        self.mworker.post_task(self.pseudo_tile_id, "exec_console_code", data)
        return {"success": True}

    @task_worthy
    def clear_console_namespace(self, data):
        self.show_main_message("Resetting notebook ...")
        if self.pseudo_tile_id is not None:
            self.mworker.post_task(self.pseudo_tile_id, "kill_me", {})
            docker_functions.restart_container(self.pseudo_tile_id)

            def instantiate_done(instantiate_result):
                if not instantiate_result["success"]:
                    self.mworker.debug_log("got an exception " + instantiate_result["message"])
                    self.show_main_message("Error resetting notebook", 7)
                    raise Exception(instantiate_result["message"])
                # self.mworker.post_task(self.pseudo_tile_id, "create_pseudo_tile_collection_object",
                #                        {"am_notebook": self.am_notebook_type})
                self.show_main_message("Notebook reset", 7)

            data_dict = {"base_figure_url": self.base_figure_url.replace("tile_id", self.pseudo_tile_id),
                         "doc_type": self.doc_type, "globals_dict": {}, "img_dict": {},
                         "tile_address": self.pseudo_tile_address}
            self.mworker.post_task(self.pseudo_tile_id, "instantiate_as_pseudo_tile", data_dict, instantiate_done)

        self.show_main_message("Notebook reset", 7)
        return {"success": True}


class DataSupportTasksMixin:

    def grab_chunk(self, doc_name, row_index):
        chunk_number = int(int(row_index) / CHUNK_SIZE)
        chunk_start = chunk_number * CHUNK_SIZE
        data_to_send = self.doc_dict[doc_name].sorted_data_rows[chunk_start:chunk_start + CHUNK_SIZE]
        data_row_dict = {}
        for n, row in enumerate(data_to_send):
            data_row_dict[chunk_start + n] = row

        return {"doc_name": doc_name,
                "total_rows": len(self.doc_dict[doc_name].current_data_rows),
                "data_row_dict": data_row_dict,
                "table_spec": self.doc_dict[doc_name].table_spec.compile_save_dict()}

    @task_worthy
    def grab_chunk_by_row_index(self, data):
        if "set_visible_doc" in data and data["set_visible_doc"]:
            self.set_visible_doc(data)
        return self.grab_chunk(data["doc_name"], data["row_index"])

    @task_worthy
    def grab_freeform_data(self, data):
        print("entering grab_freeformdata with fixed message")
        if "set_visible_doc" in data and data["set_visible_doc"]:
            self.set_visible_doc(data)
        doc_name = data["doc_name"]
        return {"doc_name": doc_name,
                "data_text": self.doc_dict[doc_name].data_text}

    @task_worthy
    def UpdateTableSpec(self, data):
        doc = self.doc_dict[data["doc_name"]]
        if "column_widths" in data:
            doc.table_spec.column_widths = data["column_widths"]
        if "hidden_columns_list" in data:
            doc.table_spec.hidden_columns_list = data["hidden_columns_list"]
        if "column_names" in data:
            doc.table_spec.header_list = data["column_names"]
            self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})
        return None

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
        doc = self.doc_dict[data["doc_to_update"]]
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

    #  tactic_todo this might not be used
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
