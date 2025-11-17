
import copy
import datetime
import copy
from main_tasks_mixin import task_worthy, task_worthy_manual_submit
from mongo_accesser import bytes_to_string
from qworker import debug_log
import base64

class TileCreationTasksMixin:

    def create_tile_container(self, sid, other_name=None, is_pseudo=False, callback=None):
        print("in create_tile_container")
        sess = self.get_session(sid)
        mdata = {"ppi": sess.ppi, is_pseudo: is_pseudo}
        if other_name:
            mdata["other_name"] = other_name

        self.mworker.post_task("host5000", "provide_tile", {
            "username": sess.username,
            "owner": sess.user_id,
            "parent": sid,
            "meta": mdata
        }, callback_func=callback)

    @task_worthy_manual_submit
    def create_n_tile_containers(self, data, task_packet):
        print("in create_n_tile_containers")
        sid = data["sid"]
        new_ids = []
        new_creds = []
        number_to_create = data["number_to_create"]
        if "tile_names" in data:
            tile_names = data["tile_names"]
        else:
            tile_names = ["tile_{}".format(n) for n in range(number_to_create)]

        def got_container(cresult):
            if not cresult["success"]:
                print("got an error in got_container")
                self.mworker.submit_response(task_packet, {"success": False, "message": cresult["message"]})
            else:
                new_ids.append(cresult["the_id"])
                new_creds.append(cresult["creds"])
                if len(new_ids) == number_to_create:
                    self.mworker.submit_response(task_packet, {"success": True, "new_ids": new_ids, "new_creds": new_creds})
        print(f"creating {number_to_create} tile containers")
        for n in range(number_to_create):
            print("creating tile container {}".format(n))
            self.create_tile_container(sid, other_name=tile_names[n], callback=got_container)
        return

    @task_worthy_manual_submit
    def create_tile(self, data_dict, task_packet):
        sid = data_dict["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info

        tile_name = data_dict["tile_name"]
        local_task_packet = task_packet
        self.tstart = datetime.datetime.now()

        def got_container(create_container_dict):
            if not create_container_dict["success"]:
                raise Exception("Error creating empty tile container")
            self.tstart = datetime.datetime.now()

            tile_container_id = create_container_dict["the_id"]
            tile_info.add_tile(tile_container_id, tile_name)

            additional_data = {
                "tile_code": self.get_loaded_tile_code(sid, data_dict["tile_type"]),
                "form_info": self.compile_form_info(sid, tile_container_id),
                "tile_name": tile_name,
                "creds": create_container_dict["creds"],
                "instance_params": {
                    "base_figure_url": sess.base_figure_url,
                    "doc_type": sess.doc_type,
                    "user_id": sess.user_id,
                    "sid": sid,
                    "username": sess.username,
                    "ppi": sess.ppi,
                }
            }
            data_dict.update(additional_data)

            def instantiated_result(instantiate_result):
                self.tstart = datetime.datetime.now()
                if not instantiate_result["success"]:
                    debug_log("got an exception " + instantiate_result["message"])
                    self.mworker.submit_response(local_task_packet, instantiate_result)
                exports = instantiate_result["exports"]
                self.update_pipe_dict(sid, exports, tile_container_id, tile_name)

                tile_info.set_reload_dict(tile_container_id, instantiate_result["reload_dict"])
                form_data = instantiate_result["form_data"]
                self.mworker.post_task("main_service", "rebuild_tile_forms_task",
                                       {"tile_id": tile_container_id, "sid": sid})
                response_data = {"success": True, "form_data": form_data, "tile_id": tile_container_id}
                self.mworker.submit_response(local_task_packet, response_data)

            self.mworker.post_task(tile_container_id, "load_source_and_instantiate", data_dict, instantiated_result)

        self.create_tile_container(sid, other_name=tile_name, callback=got_container)

        return

    def create_pseudo_tile(self, sid, globals_dict=None, callback=None):
        sess = self.get_session(sid)

        if sess.pseudo_tile_id is not None or sess.pseudo_creation_in_progress:
            if callback is not None:
                callback()
            return {"success": True}

        sess.pseudo_creation_in_progress = True

        lgdict = globals_dict.copy() if globals_dict else {}

        def got_container(data):
            if not data["success"]:
                sess.pseudo_creation_in_progress = False
                raise Exception("Error creating empty tile container")
            pseudo_tile_id = data["the_id"]
            sess.pseudo_tile_id = pseudo_tile_id
            sess.pseudo_tile_creds = data["creds"]
            data_dict = {
                "globals_dict": lgdict,
                "creds": data["creds"],
                "instance_params": {
                    "base_figure_url": sess.base_figure_url,
                    "user_id": sess.user_id,
                    "sid": sid,
                    "doc_type": sess.doc_type,
                    "username": sess.username,
                    "ppi": sess.ppi,
                }
            }

            def instantiate_done(instantiate_result):
                _pipe_dict = sess.pipe_dict
                if not instantiate_result["success"]:
                    sess.pseudo_creation_in_progress = False
                    raise Exception(instantiate_result["message"])
                else:
                    if len(instantiate_result["current_globals"]) == 0:
                        if pseudo_tile_id in _pipe_dict:
                            del _pipe_dict[self.pseudo_tile_id]
                    else:
                        _pipe_dict[pseudo_tile_id] = {}
                        tile_name = "__log__"
                        for gname, gtype in instantiate_result["current_globals"]:
                            _pipe_dict[pseudo_tile_id][tile_name + "_" + gname] = {
                                "export_name": gname,
                                "export_tags": "",
                                "tile_id": pseudo_tile_id,
                                "type": gtype
                            }
                    sess.pipe_dict = _pipe_dict
                    sess.pseudo_creation_in_progress = False
                    if callback is not None:
                        callback()
                    print("leaving instantiate_done")


                self.mworker.emit_export_viewer_message(sid, "update_exports_popup", {})
            self.mworker.post_task(pseudo_tile_id, "instantiate_as_pseudo_tile", data_dict, instantiate_done)

        self.create_tile_container(sid, other_name="pseudo_tile", is_pseudo=True, callback=got_container)
        return {"success": True}

    @task_worthy_manual_submit
    def recreate_one_tile(self, data, task_packet):
        print("in recreate_one_tile in main")
        sid = data["sid"]
        creds = data["creds"]
        tile_id = data["tile_id"]
        tile_save_dict = data["tile_save_dict"]

        sess = self.get_session(sid)
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
            self.mworker.send_error_entry(sid, "Project recreation tphrc", message)
            self.mworker.submit_response(task_packet, {"old_tile_id": old_tile_id})
            return

        tile_code = self.get_loaded_tile_code(sid, tile_save_dict["tile_type"])
        print("got tile_code")
        tile_name = tile_save_dict["tile_name"]

        tile_save_dict["new_base_figure_url"] = sess.base_figure_url
        tile_save_dict["ppi"] = sess.ppi
        additional_instance_params = {
            "user_id": sess.user_id,
            "sid": sid,
            "username": sess.username,
            "ppi": sess.ppi,
        }

        print('got additional_instance_params')
        tile_save_dict.update(additional_instance_params)

        lsdata = {"tile_code": tile_code, "tile_save_dict": tile_save_dict, "creds": creds}

        def recreate_done(recreate_response):
            if not recreate_response["success"]:
                tile_info = sess.tile_info
                tile_info.set_save_dict(tile_id, recreate_response["tile_save_dict"])
                self.mworker.ask_host("delete_container", {"container_id": new_id, "notify": False})
                self.mworker.submit_response(task_packet, {"tile_id": tile_id})
                return

            exports = recreate_response["exports"]
            self.update_pipe_dict(sid, exports, tile_id, tile_name)
            self.mworker.emit_export_viewer_message(sid, "update_exports_popup", {})
            tile_info = sess.tile_info
            tile_info.set_reload_dict(tile_id, recreate_response["reload_dict"])
            self.mworker.submit_response(task_packet, {"tile_id": tile_id, "success": True})
            return

        self.mworker.post_task(tile_id, "load_source_and_recreate", lsdata, recreate_done,
                               expiration=60, error_handler=handle_response_error)


    @task_worthy_manual_submit
    def reload_tile(self, ddict, task_packet):
        sid = ddict["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        def recreated_tile(rcdata):
            if rcdata["success"]:
                form_info["pipe_dict"] = self._pipe_dict
                self.rebuild_tile_forms_task({"sid": sid})
                self.mworker.emit_to_main_client(sid, "tile-finished-loading", {"message": "tile-finished-loading",
                                                                           "success": True,
                                                                           "tile_id": tile_id})
                final_result = {"success": True, "form_data": None,
                                "options_changed": True}
                self.mworker.submit_response(local_task_packet, final_result)
            else:
                raise Exception("Tried to recreate from tile_save_dict but wasn't able to.")

        local_task_packet = task_packet
        tile_id = bytes_to_string(ddict["tile_id"])
        form_info = self.compile_form_info(sid, tile_id)
        reload_dict = tile_info.get_reload_dict(tile_id)
        save_dict = tile_info.get_save_dict(tile_id)

        if not reload_dict and not save_dict:
            error_string = ("Tile ID {} not found in tile_info".format(tile_id))
            self.mworker.send_error_entry(sid, "Couldn't reload the tile", error_string)
            self.mworker.submit_response(local_task_packet, {"success": False, "message": error_string})
            return

        if reload_dict is None:
            data = {"old_tile_id": tile_id, "tile_save_dict": self.tile_save_dicts[tile_id], "sid": sid}
            self.mworker.post_task("main_service", "recreate_one_tile", data, recreated_tile)
            return

        def container_restarted(restart_result):
            if not restart_result["success"]:
                self.mworker.send_error_entry(sid, "Tile restart error", restart_result["message"])
                self.mworker.submit_response(local_task_packet, {"success": False})
                return

            def reinstantiate_done(reinst_result):
                if reinst_result["success"]:
                    exports = reinst_result["exports"]
                    tile_info.set_reload_dict(tile_id, reinst_result["reload_dict"])
                    self.update_pipe_dict(sid, exports, tile_id, ddict["tile_name"])
                    form_info["pipe_dict"] = sess.pipe_dict
                    self.rebuild_other_tile_forms(sid, tile_id, form_info)
                    self.mworker.emit_export_viewer_message(sid, "update_exports_popup", {})
                    final_result = {"success": True, "form_data": reinst_result["form_data"],
                                    "options_changed": reinst_result["options_changed"]}
                    self.mworker.submit_response(local_task_packet, final_result)
                else:
                    self.mworker.send_error_entry(sid, "Tile reinstantiate error", reinst_result["message"])
                    self.mworker.submit_response(local_task_packet, {"success": False})

            reload_dict["form_info"] = form_info
            additional_instance_params = {
                "user_id": sess.user_id,
                "sid": sid,
                "username": sess.username,
                "ppi": sess.ppi,
            }
            reload_dict.update(additional_instance_params)
            self.mworker.post_task(tile_id,
                                   "load_source_and_reinstantiate",
                                   {"tile_code": module_code,
                                    "creds": tile_info.get_creds(tile_id),
                                    "reload_dict": reload_dict},
                                   reinstantiate_done)

        tile_type = reload_dict["tile_type"]
        module_code = self.get_loaded_tile_code(sid, tile_type)
        self.mworker.post_task("host5000", "restart_tile_container", {"tile_id": tile_id}, container_restarted)

    @task_worthy
    def update_tile_collection_objects_task(self, ddict):
        sid = ddict["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        try:
            if self.am_notebook_type(sid):
                return
            for tid in tile_info.tile_ids:
                self.mworker.post_task(tid, "RebuildCollectionObject", ddict)
            if sess.pseudo_tile_id is not None:
                self.mworker.post_task(sess.pseudo_tile_id, "RebuildCollectionObject", ddict)
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, "Error updating collection objects")
            print(error_string)
            return

    @task_worthy
    def rebuild_tile_forms_task(self, ddict):
        sid = ddict["sid"]
        sess = self.get_session(sid)
        try:
            if sess.am_notebook_type:
                return
            if "tile_id" not in ddict:
                tile_id = None
            else:
                tile_id = ddict["tile_id"]

            tile_info = sess.tile_info
            if tile_id is None:
                other_tile_names = tile_info.tile_ids
            else:
                other_tile_names = self.get_other_tile_names(tile_id, tile_info)
            debug_log("getting the form info")
            username = sess.username

            form_info = {"current_header_list": self.current_header_list(sid),
                         "pipe_dict": sess.pipe_dict,
                         "doc_names": sess.doc_names,
                         "list_names": self.list_tags_dict(username),
                         "function_names": self.function_tags_dict(username),
                         "class_names": self.class_tags_dict(username),
                         "collection_names": self.collection_tags_dict(username),
                         "other_tile_names": other_tile_names}
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, "Error assembling form info")
            print(error_string)
            return
        try:
            for tid in tile_info.tile_ids:
                if tile_id is None or not tid == tile_id:
                    form_info["other_tile_names"] = self.get_other_tile_names(tid, tile_info)
                    the_id = tid
                    self.mworker.post_task(the_id, "RebuildTileForms", form_info)
            if sess.pseudo_tile_id is not None:
                self.mworker.post_task(sess.pseudo_tile_id, "RebuildTileForms", {})
        except Exception as ex:
            error_string = self.handle_exception(sid, ex, "Error rebuilding the forms")
            print(error_string)
        return

    @task_worthy
    def RemoveTile(self, data):
        tile_id = data["tile_id"]
        sid = data["sid"]
        self._delete_tile_instance(sid, tile_id)
        return None

    @task_worthy
    def OtherTileData(self, data):
        sid = data["sid"]
        sess = self.get_session(sid)
        tile_info = sess.tile_info
        other_tile_data = {}
        pipe_dict = sess.pipe_dict
        for n, tid in tile_info.tile_ids:
            if not tid == data["tile_id"]:
                new_entry = {"tile_id": tid}
                if tid in pipe_dict:
                    new_entry["pipes"] = list(self._pipe_dict[tid].values())
                else:
                    new_entry["pipes"] = None
                other_tile_data[n] = new_entry
        return other_tile_data
