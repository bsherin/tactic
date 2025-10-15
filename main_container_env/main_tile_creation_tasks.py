
import copy
import datetime
import copy
from main_tasks_mixin import task_worthy, task_worthy_manual_submit
import docker_functions
from mongo_accesser import bytes_to_string
from qworker import debug_log
import base64

class TileCreationTasksMixin:

    def create_tile_container(self, other_name=None, is_pseudo=False, callback=None):
        mdata = {"ppi": self.ppi, is_pseudo: is_pseudo}
        if other_name:
            mdata["other_name"] = other_name

        self.mworker.post_task("host5000", "provide_tile", {
            "username": self.username,
            "owner": self.user_id,
            "parent": self.mworker.my_id,
            "meta": mdata
        }, callback_func=callback)

    @task_worthy_manual_submit
    def create_n_tile_containers(self, data, task_packet):
        new_ids = []
        new_creds = []
        print("in create_n_tile_containers")
        number_to_create = data["number_to_create"]
        if "tile_names" in data:
            tile_names = data["tile_names"]
        else:
            tile_names = ["tile_{}".format(n) for n in range(number_to_create)]

        def got_container(cresult):
            print("in got_container in create_n_containers with cresult = {}".format(cresult))
            if not cresult["success"]:
                print("got an error in got_container")
                self.mworker.submit_response(task_packet, {"success": False, "message": cresult["message"]})
            else:
                print("got container in create_n with id {}".format(cresult["the_id"]))
                new_ids.append(cresult["the_id"])
                new_creds.append(cresult["creds"])
                print("new_ids is now {}".format(new_ids))
                if len(new_ids) == number_to_create:
                    print("all containers created, submitting response")
                    self.mworker.submit_response(task_packet, {"success": True, "new_ids": new_ids, "new_creds": new_creds})
        for n in range(number_to_create):
            self.create_tile_container(other_name=tile_names[n], callback=got_container)
        return

    @task_worthy_manual_submit
    def create_tile(self, data_dict, task_packet):
        print("entering create tile")
        tile_name = data_dict["tile_name"]
        local_task_packet = task_packet
        self.tstart = datetime.datetime.now()

        def got_container(create_container_dict):
            if not create_container_dict["success"]:
                raise Exception("Error creating empty tile container")
            self.tstart = datetime.datetime.now()

            tile_container_id = create_container_dict["the_id"]
            self.tile_info.add_tile(tile_container_id, tile_name)

            additional_data = {
                "tile_code": self.get_loaded_tile_code(data_dict["tile_type"]),
                "form_info": self.compile_form_info(tile_container_id),
                "tile_name": tile_name,
                "creds": create_container_dict["creds"],
                "instance_params": {
                    "base_figure_url": self.base_figure_url,
                    "doc_type": self.doc_type,
                    "user_id": self.user_id,
                    "_main_id": self.mworker.my_id,
                    "username": self.username,
                    "ppi": self.ppi,
                }
            }
            data_dict.update(additional_data)

            def instantiated_result(instantiate_result):
                print("got instantiate result, time is {}".format(self.microdsecs(self.tstart)))
                self.tstart = datetime.datetime.now()
                if not instantiate_result["success"]:
                    debug_log("got an exception " + instantiate_result["message"])
                    self.mworker.submit_response(local_task_packet, instantiate_result)
                exports = instantiate_result["exports"]
                self.update_pipe_dict(exports, tile_container_id, tile_name)

                self.tile_info.set_reload_dict(tile_container_id, instantiate_result["reload_dict"])
                # self.tile_reload_dicts[tile_container_id] = instantiate_result["reload_dict"]
                form_data = instantiate_result["form_data"]
                self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task",
                                       {"tile_id": tile_container_id})
                response_data = {"success": True, "form_data": form_data, "tile_id": tile_container_id}
                self.mworker.submit_response(local_task_packet, response_data)

            print("about to load source and instantiate tid = " + str(tile_container_id))
            self.mworker.post_task(tile_container_id, "load_source_and_instantiate", data_dict, instantiated_result)

        self.create_tile_container(other_name=tile_name, callback=got_container)

        return

    def create_pseudo_tile(self, globals_dict=None, callback=None):
        if self.pseudo_tile_id is not None:
            callback()
            return {"success": True}

        print("entering create_pseudo_tile")
        lgdict = globals_dict.copy() if globals_dict else {}

        def got_container(data):
            print("in got container with data = " + str(data))
            if not data["success"]:
                raise Exception("Error creating empty tile container")
            print("extracting pseudo tile id")
            self.pseudo_tile_id = data["the_id"]
            creds = data["creds"]
            print("pseudo_tile_id is " + str(self.pseudo_tile_id))
            data_dict = {
                "globals_dict": lgdict,
                "creds": creds,
                "instance_params": {
                    "base_figure_url": self.base_figure_url,
                    "user_id": self.user_id,
                    "_main_id": self.mworker.my_id,
                    "doc_type": self.doc_type,
                    "username": self.username,
                    "ppi": self.ppi
                }
            }
            print("about to instantiate")

            def instantiate_done(instantiate_result):
                print("in instantiate_done in main in create_pseudo_tile")
                if not instantiate_result["success"]:
                    debug_log("got an exception " + instantiate_result["message"])
                    raise Exception(instantiate_result["message"])
                else:
                    if len(instantiate_result["current_globals"]) == 0:
                        if self.pseudo_tile_id in self._pipe_dict:
                            del self._pipe_dict[self.pseudo_tile_id]
                    else:
                        self._pipe_dict[self.pseudo_tile_id] = {}
                        tile_name = "__log__"
                        for gname, gtype in instantiate_result["current_globals"]:
                            self._pipe_dict[self.pseudo_tile_id][tile_name + "_" + gname] = {
                                "export_name": gname,
                                "export_tags": "",
                                "tile_id": self.pseudo_tile_id,
                                "type": gtype
                            }
                    print("about to call callback if its there")
                    if callback is not None:
                        print("calling callback")
                        callback()

                self.mworker.emit_export_viewer_message("update_exports_popup", {})
                # self.mworker.post_task(self.mworker.my_id, "rebuild_tile_forms_task", {"tile_id": None})

            self.mworker.post_task(self.pseudo_tile_id, "instantiate_as_pseudo_tile", data_dict, instantiate_done)

        self.create_tile_container(other_name="pseudo_tile", is_pseudo=True, callback=got_container)
        return {"success": True}

    @task_worthy_manual_submit
    def recreate_one_tile(self, data, task_packet):
        print("in recreate one tile")

        def handle_response_error(task_packet_passed):
            tphrc = copy.copy(task_packet_passed)
            if "response_data" in tphrc and tphrc["response_data"] is not None:
                response_data = tphrc["response_data"]
            else:
                response_data = {}
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

        def got_container(gtc_response):
            if not gtc_response["success"]:
                self.mworker.send_error_entry("Project recreation tphrc", gtc_response["message"])
                self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
                return

            new_id = gtc_response["the_id"]
            creds = gtc_response["creds"]

            tile_save_dict["new_base_figure_url"] = self.base_figure_url
            tile_save_dict["ppi"] = self.ppi
            additional_instance_params = {
                "user_id": self.user_id,
                "_main_id": self.mworker.my_id,
                "username": self.username,
                "ppi": self.ppi,
            }
            tile_save_dict.update(additional_instance_params)

            lsdata = {"tile_code": tile_code, "tile_save_dict": tile_save_dict, "creds": creds}

            def recreate_done(recreate_response):
                if not recreate_response["success"]:
                    print("tile didn't recreate successfully")
                    self.tile_info.set_save_dict(new_tile_id, recreate_response["tile_save_dict"])
                    # self.tile_save_dicts[new_tile_id] = recreate_response["tile_save_dict"]
                    # self.tile_instances.append(new_id[0])
                    self.mworker.ask_host("delete_container", {"container_id": new_id, "notify": False})
                    self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id, "new_id": new_id,
                                                               "success": False})
                    return

                exports = recreate_response["exports"]
                self.update_pipe_dict(exports, new_id, tile_name)
                self.mworker.emit_export_viewer_message("update_exports_popup", {})
                # self.tile_save_results[new_id[0]] = recreate_response
                # self.tile_instances.append(new_id)
                self.tile_info.set_reload_dict(new_id, recreate_response["reload_dict"])
                self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id, "new_id": new_id,
                                                           "success": True})
                return

            self.mworker.post_task(new_id, "load_source_and_recreate", lsdata, recreate_done,
                                   expiration=60, error_handler=handle_response_error)

        old_tile_id = data["old_tile_id"]
        tile_save_dict = data["tile_save_dict"]
        tile_code = self.get_loaded_tile_code(tile_save_dict["tile_type"])
        tile_name = tile_save_dict["tile_name"]
        if "new_id" in data:
            got_container({"success": True, "the_id": data["new_id"], "creds": data["creds"]})
        else:
            self.create_tile_container(other_name=tile_name,
                                       callback=got_container)

    @task_worthy_manual_submit
    def reload_tile(self, ddict, task_packet):
        def recreated_tile(rcdata):
            if rcdata["success"]:
                form_info["pipe_dict"] = self._pipe_dict
                self.rebuild_tile_forms_task({})
                self.mworker.emit_to_main_client("tile-finished-loading", {"message": "tile-finished-loading",
                                                                           "success": True,
                                                                           "tile_id": tile_id})
                final_result = {"success": True, "form_data": None,
                                "options_changed": True}
                self.mworker.submit_response(local_task_packet, final_result)
            else:
                raise Exception("Tried to recreate from tile_save_dict but wasn't able to.")

        local_task_packet = task_packet
        tile_id = bytes_to_string(ddict["tile_id"])
        form_info = self.compile_form_info(tile_id)
        reload_dict = self.tile_info.get_reload_dict(tile_id)
        save_dict = self.tile_info.get_save_dict(tile_id)

        if not reload_dict and not save_dict:
            error_string = ("Tile ID {} not found in tile_info".format(tile_id))
            self.mworker.send_error_entry("Couldn't reload the tile", error_string)
            self.mworker.submit_response(local_task_packet, {"success": False, "message": error_string})
            return

        if reload_dict is None:
            print("trying to recreate rather than reload")
            data = {"old_tile_id": tile_id, "tile_save_dict": self.tile_save_dicts[tile_id]}
            self.mworker.post_task(self.mworker.my_id, "recreate_one_tile", data, recreated_tile)
            return

        def container_restarted(restart_result):
            if not restart_result["success"]:
                self.mworker.send_error_entry("Tile restart error", restart_result["message"])
                self.mworker.submit_response(local_task_packet, {"success": False})
                return

            def reinstantiate_done(reinst_result):
                if reinst_result["success"]:
                    exports = reinst_result["exports"]
                    self.tile_info.set_reload_dict(tile_id, reinst_result["reload_dict"])
                    self.update_pipe_dict(exports, tile_id, ddict["tile_name"])
                    form_info["pipe_dict"] = self._pipe_dict
                    self.rebuild_other_tile_forms(tile_id, form_info)
                    self.mworker.emit_export_viewer_message("update_exports_popup", {})
                    final_result = {"success": True, "form_data": reinst_result["form_data"],
                                    "options_changed": reinst_result["options_changed"]}
                    self.mworker.submit_response(local_task_packet, final_result)
                else:
                    self.mworker.send_error_entry("Tile reinstantiate error", reinst_result["message"])
                    self.mworker.submit_response(local_task_packet, {"success": False})

            reload_dict["form_info"] = form_info
            print("about to load_source")
            print("tile container status is {}".format(docker_functions.container_status(tile_id)))
            additional_instance_params = {
                "user_id": self.user_id,
                "_main_id": self.mworker.my_id,
                "username": self.username,
                "ppi": self.ppi,
            }
            reload_dict.update(additional_instance_params)
            self.mworker.post_task(tile_id, "load_source_and_reinstantiate", {"tile_code": module_code,
                                                                              "reload_dict": reload_dict},
                                   reinstantiate_done)

        tile_type = reload_dict["tile_type"]
        module_code = self.get_loaded_tile_code(tile_type)
        print("tile_id is {}".format(tile_id))
        print("restarting container from main")
        self.mworker.post_task("host5000", "restart_tile_container", {"tile_id": tile_id}, container_restarted)
        # docker_functions.restart_container(tile_id)
        # docker_functions.wait_until_running(tile_id)

    @task_worthy
    def update_tile_collection_objects_task(self, ddict):
        debug_log('entering rebuild_tile_forms_task')
        try:
            if self.am_notebook_type:
                return
            for tid in self.tile_info.tile_ids:
                self.mworker.post_task(tid, "RebuildCollectionObject", ddict)
            if self.pseudo_tile_id is not None:
                self.mworker.post_task(self.pseudo_tile_id, "RebuildCollectionObject", ddict)
        except Exception as ex:
            error_string = self.handle_exception(ex, "Error updating collection objects")
            print(error_string)
            return

    @task_worthy
    def rebuild_tile_forms_task(self, ddict):
        debug_log('entering rebuild_tile_forms_task')
        try:
            if self.am_notebook_type:
                return
            if "tile_id" not in ddict:
                tile_id = None
            else:
                tile_id = ddict["tile_id"]

            if tile_id is None:
                other_tile_names = self.tile_info.tile_ids
            else:
                other_tile_names = self.get_other_tile_names(tile_id)
            debug_log("getting the form info")

            form_info = {"current_header_list": self.current_header_list,
                         "pipe_dict": self._pipe_dict,
                         "doc_names": self.doc_names,
                         "list_names": self.list_tags_dict,
                         "function_names": self.function_tags_dict,
                         "class_names": self.class_tags_dict,
                         "collection_names": self.collection_tags_dict,
                         "other_tile_names": other_tile_names}
        except Exception as ex:
            error_string = self.handle_exception(ex, "Error assembling form info")
            print(error_string)
            return
        print("got form_info")
        try:
            for tid in self.tile_info.tile_ids:
                if tile_id is None or not tid == tile_id:
                    form_info["other_tile_names"] = self.get_other_tile_names(tid)
                    the_id = tid
                    self.mworker.post_task(the_id, "RebuildTileForms", form_info)
            if self.pseudo_tile_id is not None:
                self.mworker.post_task(self.pseudo_tile_id, "RebuildTileForms", {})
        except Exception as ex:
            error_string = self.handle_exception(ex, "Error rebuilding the forms")
            print(error_string)
        print('leaving rebuild_tile_forms_task')
        return

    @task_worthy
    def RemoveTile(self, data):
        tile_id = data["tile_id"]
        self._delete_tile_instance(tile_id)
        return None

    @task_worthy
    def OtherTileData(self, data):
        other_tile_data = {}
        for n, tid in self.tile_info.tile_ids:
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
            other_tile_names = self.tile_info.tile_ids
        else:
            other_tile_names = self.get_other_tile_names(tile_id)
        form_info = {"current_header_list": self.current_header_list,
                     "pipe_dict": self._pipe_dict,
                     "doc_names": self.doc_names,
                     "list_names": self.list_tags_dict,
                     "function_names": self.function_tags_dict,
                     "class_names": self.class_tags_dict,
                     "collection_names": self.collection_tags_dict,
                     "other_tile_names": other_tile_names}
        self.mworker.submit_response(task_packet, form_info)
        return