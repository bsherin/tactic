import uuid
import os
import re

from qworker import task_worthy, task_worthy_manual_submit
from tactic_app import socketio
from exception_mixin import TileModuleNotFoundError

from docker_functions import create_container

class TileTasksMixin:

    @task_worthy
    def get_last_saved_task(self, data):
        the_user = self.get_user_from_data(data)
        tile_module_name = data["tile_module_name"]
        last_saved = the_user.get_tile_last_saved(tile_module_name)
        return {"success": True, "last_saved": last_saved}

    @task_worthy
    def get_tile_content_with_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        tile_module_name = data["tile_module_name"]

        result = the_user.get_tile_content_with_metadata(tile_module_name, process_metadata=True)
        if not result:
            print(f"Tile module {tile_module_name} not found.")
            return {"success": False, "message": "Tile module not found."}
        result["success"] = True
        return result

    # @task_worthy
    # def last_saved_view_in_context(self, data):
    #     the_user = self.get_user_from_data(data)
    #     module_name = data["tile_module_name"]
    #     tile_dict = the_user.get_tile_doc(module_name)
    #     if tile_dict is None:
    #         return {"success": False, "message": "Tile not found."}
    #     if "last_saved" in tile_dict and tile_dict["last_saved"] == "creator":
    #         return self.view_in_creator_in_context(data)
    #     if "last_saved" not in tile_dict or tile_dict["last_save"] is None:
    #         return self.view_in_creator_in_context(data)
    #     return self.view_module_in_context(data)

    # @task_worthy
    # def initiate_module_viewer_in_context(self, data):
    #     the_user = self.get_user_from_data(data)
    #     module_name = data["tile_module_name"]
    #     the_user.clear_old_recent_history(module_name)
    #     module_code = the_user.get_tile_content(module_name)
    #     mdata = the_user.get_processed_tile_metadata(module_name)
    #     mdata["icon"] = the_user.get_tile_icon_from_mdata(mdata)
    #     data = {
    #         "success": True,
    #         "kind": "module-viewer",
    #         "res_type": "tile",
    #         "the_content": module_code,
    #         "mdata": mdata,
    #         "resource_name": module_name,
    #         "read_only": False,
    #         "is_repository": False,
    #         "local_id": data["local_id"]
    #     }
    #     return data

    @task_worthy
    def initiate_creator_in_context(self, data):
        print("initiating creator in context with data: ", data)
        the_user = self.get_user_from_data(data)
        module_name = data["tile_module_name"]
        the_user.clear_old_recent_history(module_name)
        local_id = data.get("local_id", str(uuid.uuid4()))
        print("local_id is: ", local_id)

        self.post_task("module_viewer", "start_session", {
            "local_id": local_id,
            "module_name": module_name,
            "user_id": the_user.get_id(),
            "username": the_user.username,
            "openai_api_key": the_user.get_openai_api_key()
        })

        mdata = the_user.get_processed_tile_metadata(module_name)
        result = {
            "success": True,
            "kind": "creator-viewer",
            "res_type": "tile",
            "resource_name": module_name,
            "local_id": local_id,
            "tile_collection_name": the_user.tile_collection_name(),
            "mdata": mdata
        }
        print("returning result from initiate_creator_in_context: ", result)
        return result

    # def initialize_module_viewer_container(self, module_name, the_user, rb_id, local_id):
    #     openai_api_key = the_user.get_openai_api_key()
    #     environ = {"RB_ID": rb_id, "OPENAI_API_KEY": openai_api_key}
    #     vol_dict = {}
    #     _, container_id = create_container("bsherin/tactic-module-viewer",
    #                                                       env_vars=environ,
    #                                                       volume_dict=vol_dict,
    #                                                       owner=the_user.get_id(),
    #                                                       username=the_user.username,
    #                                                       special_unique_id=local_id,
    #                                                       other_name=module_name, register_container=True)
    #
    #     the_content = {"module_name": module_name,
    #                    "local_id": local_id,
    #                    "container_id": container_id,
    #                    "rb_id": rb_id,
    #                    "tile_collection_name": the_user.tile_collection_name}
    #
    #     return the_content

    @task_worthy
    def update_tile_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            tile_module_name = data["tile_module_name"]
            new_tile_module = data["new_tile_module"]
            last_saved = data.get("last_saved", None)
            the_user.update_tile(tile_module_name, new_tile_module, last_saved)
            the_user.create_recent_checkpoint(tile_module_name)

            return {"success": True, "message": "tile Successfully Saved", "alert_type": "alert-success"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Unable to Update tile.")
            print(msg)
            return {"success": False, "message": msg}

    @task_worthy
    def checkpoint_module_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            module_name = data["module_name"]
            doc = the_user.get_tile_doc(module_name)
            if doc is None:
                return {"success": False, "message": "Tile not found."}
            history = doc.get("history", [])
            history.append({"updated": doc["metadata"]["updated"],
                            "tile_module": doc["tile_module"]})
            the_user.update_tile_from_doc(module_name, {"history": history})
            result = {"success": True, "message": "Module successfully saved and checkpointed",
                      "alert_type": "alert-success"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error checkpointing module")
            print(msg)
            return {"success": False, "message": msg, "alert_type": "alert-danger"}

        return result

    @task_worthy
    def get_tile_content_task(self, data):
        try:
            print("get_tile_content_task called with data: ", data)
            the_user = self.get_user_from_data(data)
            print("got the user from data")
            tile_module_name = data["tile_module_name"]
            tile_content = the_user.get_tile_content(tile_module_name)
            print("got the content for tile module: ", tile_module_name)
            if tile_content is None:
                print(f"Tile module {tile_module_name} not found.")
                return {"success": False, "message": f"Tile module {tile_module_name} not found."}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error getting tile content")
            print(msg)
            return {"success": False, "message": msg}
        print("returning tile content")
        return {"tile_content": tile_content, "success": True}

    @task_worthy
    def get_tile_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"tile_names": the_user.tile_names}

    @task_worthy
    def create_duplicate_tile_task(self, data):
        the_user = self.get_user_from_data(data)
        tile_to_copy = data['res_to_copy']
        new_tile_name = data['new_res_name']
        the_user.create_tile(new_tile_name, tile_to_copy)
        return {"success": True}

    @task_worthy
    def create_tile_from_repository_template(self, data):
        the_user = self.get_user_from_data(data)
        template_name = data["template_name"]
        template_doc = self.repository_user.get_tile_doc(template_name)
        new_tile_name = data["new_tile_name"]
        last_saved = data.get("last_saved", "creator")
        the_user.create_tile_from_doc(new_tile_name, template_doc, last_saved)
        return {"success": True}

    @task_worthy
    def rename_tile_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_tile(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_tile_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        tile_module_name = data["res_name"]
        result = the_user.get_processed_tile_metadata(
            tile_module_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_all_tile_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_tile_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_tile_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        tile_module_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_tile_metadata(tile_module_name, metadata)
        return {"success": True, "message": "tile metadata saved successfully."}

    @task_worthy
    def delete_tag_in_tiles_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_tiles(tag)
        return {"success": True, "message": "Tag deleted from tiles successfully."}

    @task_worthy
    def rename_tag_in_tiles_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_tiles(tag_changes)
        return {"success": True, "message": "Tag deleted from tiles successfully."}

    @task_worthy
    def unload_all_tiles_task(self, data):
        from loaded_tile_management import loaded_tile_manager
        the_user = self.get_user_from_data(data)
        try:
            loaded_tile_manager.unload_user_tiles(the_user.username)
            self.refresh_selector_list(data["user_id"])
            socketio.emit('update-menus', {}, namespace='/main', room=the_user.get_id())
            return {"message": "Tiles successfully unloaded", "success": True}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Unable to Update tile.")
            return {"success": False, "message": msg}

    @task_worthy
    def unload_one_module_task(self, data):
        from loaded_tile_management import loaded_tile_manager
        the_user = self.get_user_from_data(data)
        tile_module_name = data["tile_module_name"]
        loaded_tile_manager.unload_one_module(the_user.username, tile_module_name)
        _id = the_user.get_tile_id(tile_module_name)
        self.update_selector_row({"name": tile_module_name, "doc_id": str(_id), "event_type": "update",
                                  "icon:upload": "", "res_type": "tile"}, the_user)
        socketio.emit('update-menus', {}, namespace='/main', room=the_user.get_id())
        return {"success": True, "message": "Tile unloaded"}

    @task_worthy_manual_submit
    def load_tile_module_task(self, data, task_packet):
        print("entering load_tile_module_task")
        from loaded_tile_management import loaded_tile_manager
        the_user = self.get_user_from_data(data)
        def loaded_source(res_dict):
            print("got loaded_source")
            if not res_dict["success"]:
                print("load_source didn't return success")
                if "show_failed_loads" in data and data["show_failed_loads"]:
                    loaded_tile_manager.add_failed_load(tile_module_name, the_user.username)
                    _id = the_user.get_tile_id(tile_module_name)
                    self.update_selector_row({"name": tile_module_name, "doc_id": str(_id), "event_type": "update",
                                                      "icon:upload": "icon:error", "res_type": "tile"}, the_user)
                if "local_id" not in task_packet:
                    task_packet["room"] = user_id
                print(res_dict["message"])
                if not task_packet["callback_type"] == "no_callback":
                    self.submit_response(task_packet, {"success": False, "message": res_dict["message"],
                                                       "alert_type": "alert-warning"})
                return
            mdata = the_user.get_tile_metadata(res_dict["tile_name"])
            category = mdata["category"] if "category" in mdata else "basic"

            if "is_default" in data:
                is_default = data["is_default"]
            else:
                is_default = False
            loaded_tile_manager.add_user_tile_module(the_user.username,
                                                        category,
                                                        res_dict["tile_name"],
                                                        tile_module,
                                                        tile_module_name,
                                                        is_default,
                                                        )
            _id = the_user.get_tile_id(tile_module_name)
            self.update_selector_row(
                {"name": tile_module_name, "doc_id": str(_id), "event_type": "update",
                 "icon:upload": "icon:upload", "res_type": "tile"}, the_user)
            socketio.emit('update-menus', {}, namespace='/main', room=the_user.get_id())
            if not task_packet["callback_type"] == "no_callback":
                self.submit_response(task_packet, {"success": True, "message": "Tile module successfully loaded",
                                                   "alert_type": "alert-success"})
            return

        try:
            user_id = data["user_id"]
            tile_module_name = data["tile_module_name"]

            try:
                print("getting the module")
                tile_module = the_user.get_tile_content(tile_module_name)
            except TileModuleNotFoundError as ex:
                special_string = "Error finding the tile module " + tile_module_name
                if not task_packet["callback_type"] == "no_callback":
                    self.submit_response(task_packet, self.get_short_exception_dict(ex, special_string))
                else:
                    print(self.extract_short_error_message(ex, special_string))

            else:
                print("posting load_source")
                pattern = re.compile(r'.*?(@user_tile.*)', re.DOTALL)
                result = pattern.match(tile_module)
                tile_module_no_globals = result.groups()[0]
                print("just about to post load_source")
                self.post_task("tile_test_container", "load_source",
                               {"tile_code": tile_module_no_globals}, loaded_source)
                print("posted load_source")
        except Exception as ex:
            print(self.extract_short_error_message(ex, "Error loading tile"))
            if not task_packet["callback_type"] == "no_callback":
                self.submit_response(task_packet, self.get_short_exception_dict(ex, "Error loading tile"))
            return

    @task_worthy
    def load_user_default_tiles_task(self, data):
        from loaded_tile_management import loaded_tile_manager
        error_list = loaded_tile_manager.load_user_default_tiles(data["username"])
        return {"success": True, "tile_loading_errors": error_list}

    @task_worthy
    def get_checkpoint_dates_task(self, data):
        the_user = self.get_user_from_data(data)
        try:
            module_name = data["module_name"]
            checkpoints = the_user.get_checkpoint_history(module_name, False)
            if len(checkpoints) == 0:
                return {"success": False, "message": "no history found", "alert_type": "alert-warning"}
            return {"success": True, "checkpoints": checkpoints}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error getting checkpoint dates")
            return {"success": False, "message": msg, "alert_type": "alert-danger"}

    @task_worthy
    def get_checkpoint_code_task(self, data):
        the_user = self.get_user_from_data(data)
        try:
            updatestring_for_sort = data["updatestring_for_sort"]
            module_name = data["module_name"]
            checkpoints = the_user.get_checkpoint_history(module_name, True)
            for cp in checkpoints:
                if cp["updatestring_for_sort"] == updatestring_for_sort:
                    return {"success": True, "module_code": cp["tile_module"]}
            return {"success": False, "message": "Checkpoint not found", "alert_type": "alert-warning"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error getting checkpoint code")
            return {"success": False, "message": msg, "alert_type": "alert-danger"}

    @task_worthy
    def update_from_left_task(self, data):
        the_user = self.get_user_from_data(data)
        try:
            module_name = data["module_name"]
            module_code = data["module_code"]
            the_user.update_tile(module_name, module_code)
            the_user.create_recent_checkpoint(module_name)
            return {"success": True, "message": "Module successfully saved; refresh any open viewers",
                    "alert_type": "alert-success"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error saving module")
            return {"success": False, "message": msg, "alert_type": "alert-danger"}