from qworker import QWorker, task_worthy, task_worthy_manual_submit, current_timestamp, debug_log
from flask import render_template, url_for
from flask_login import current_user
import json
from users import load_user, ModuleNotFoundError, user_data_fields
import gevent
import pika
from communication_utils import make_python_object_jsonizable, store_temp_data, read_temp_data, delete_temp_data
from docker_functions import create_container, destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, restart_container
from docker_functions import get_matching_user_containers
from tactic_app import app, socketio, db
from library_views import tile_manager, project_manager, collection_manager, list_manager
from library_views import code_manager
from redis_tools import redis_ht, delete_ready_block_participant
import datetime
from mongo_accesser import bytes_to_string
import tactic_app
import uuid
import sys
import copy
import datetime
import time
import os

# inactive_container_time is the max time a tile can
# go without making active contact with the megaplex.
# we will let containers hang around for quite a while.
inactive_container_time = 10 * 3600

# old_container_time is the max time a tile can exist after being created.
old_container_time = 3 * 24 * 3600

# how frequently we will look for dead containers and dead mainwindows
health_check_time = 5 * 60


import loaded_tile_management
import os

from js_source_management import _develop

myport = os.environ.get("MYPORT")

from qworker import max_pika_retries


class HostWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.my_id = "host" + str(myport)

    def start_background_thread(self, retries=0):
        try:
            print("entering start_background_thread")
            params = pika.ConnectionParameters(
                heartbeat=600,
                blocked_connection_timeout=300,
                host="megaplex",
                port=5672,
                virtual_host='/'
            )
            self.connection = pika.BlockingConnection(params)
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue="host", durable=False, exclusive=False)
            self.channel.queue_declare(queue=self.my_id, durable=False, exclusive=False)
            self.channel.basic_consume(queue="host", auto_ack=True, on_message_callback=self.handle_delivery)
            self.channel.basic_consume(queue=self.my_id, auto_ack=True, on_message_callback=self.handle_delivery)
            print(' [*] Waiting for messages:')
            self.channel.start_consuming()
        except Exception as ex:
            debug_log("Couldn't connect to pika")
            if retries > max_pika_retries:
                print("giving up. No more processing of tasks by this qworker")
                debug_log(self.handle_exception(ex, "Here's the error"))
            else:
                print("sleeping ...")
                gevent.sleep(3)
                new_retries = retries + 1
                self.start_background_thread(retries=new_retries)

    def show_um_status_message(self, msg, library_id, timeout=3):
        if timeout is None:
            data = {"message": msg, "main_id": library_id}
        else:
            data = {"message": msg, "timeout": timeout, "main_id": library_id}
        socketio.emit('show-status-msg', data, namespace='/main', room=library_id)

    def clear_um_status_message(self, library_id):
        socketio.emit('clear-status-msg', {"main_id": library_id}, namespace='/main', room=library_id)

    def add_error_drawer_entry(self, title, content, library_id):
        data = {"title": title, "content": content, "main_id": library_id}
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=library_id)

    @task_worthy
    def participant_ready(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        rb_id = data["rb_id"]
        participant = data["participant"]
        result, main_id = delete_ready_block_participant(user_obj.username, rb_id, participant)
        if result:
            print("** all participants ready **")
            for pid in result:
                if pid == "main_id":
                    continue
                if pid == "client":
                    print(str(data))
                    socketio.emit("remove-ready-block", {main_id: main_id}, namespace='/main', room=main_id)
                else:
                    self.post_task(pid, "remove_ready_block", data)

    @task_worthy
    def container_heartbeat(self, data):
        container_id = data["container_id"]
        tactic_app.health_tracker.register_container_heartbeat(container_id)
        return

    @task_worthy
    def set_user_theme(self, data):
        print("in set_user_theme")
        print("data is " + str(data))
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        print("got user_obj")
        return user_obj.update_account({"theme": data["theme"]})

    @task_worthy
    def get_user_settings(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_data = user_obj.user_data_dict
        setting_dict = {}
        for fdict in user_data_fields:
            if not fdict["editable"]:
                continue
            if fdict["info_type"] == "setting":
                setting_dict[fdict["name"]] = user_data[fdict["name"]]
        return {"settings": setting_dict}

    @task_worthy_manual_submit
    def update_code_task(self, data_dict, task_packet):
        try:
            user_id = data_dict["user_id"]
            user_obj = load_user(user_id)
            local_task_packet = task_packet
            code_name = data_dict["code_name"]
            the_code = data_dict["new_code"]
            doc = db[user_obj.code_collection_name].find_one({"code_name": code_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = data_dict["tags"]
            mdata["notes"] = data_dict["notes"]
            mdata["updated"] = datetime.datetime.utcnow()

            def get_result(load_result):
                if not load_result["success"]:
                    return self.submit_response(task_packet, load_result)

                mdata["classes"] = load_result["classes"]
                mdata["functions"] = load_result["functions"]

                db[user_obj.code_collection_name].update_one({"code_name": code_name},
                                                             {'$set': {"the_code": the_code, "metadata": mdata}})
                # self.update_selector_row(self.build_res_dict(code_name, mdata))
                result = {"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"}
                self.submit_response(local_task_packet, result)
                return

            self.post_task("tile_test_container", "clear_and_load_code",
                           {"the_code": the_code}, get_result)

        except Exception as ex:
            self.submit_response(task_packet, self.get_short_exception_dict(ex, "Error saving code resource"))
            return

    def emit_loaded_tile_update(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit('update-loaded-tile-list', {"tile_load_dict": tile_manager.loaded_tile_lists(user_obj)},
                      namespace='/main', room=user_obj.get_id())

    @task_worthy
    def load_user_default_tiles_task(self, data):
        error_list = loaded_tile_management.load_user_default_tiles(data["username"])
        return {"success": True, "tile_loading_errors": error_list}

    @task_worthy_manual_submit
    def load_tile_module_task(self, data, task_packet):
        def loaded_source(res_dict):
            print("in loaded_source")
            if not res_dict["success"]:
                if "show_failed_loads" in data and data["show_failed_loads"]:
                    loaded_tile_management.add_failed_load(tile_module_name, user_obj.username)
                    tile_manager.update_selector_row({"name": tile_module_name, "icon:upload": "icon:error"}, user_obj)
                if "main_id" not in task_packet:
                    task_packet["room"] = user_id
                if not task_packet["callback_type"] == "no_callback":
                    self.submit_response(task_packet, {"success": False, "message": res_dict["message"],
                                                       "alert_type": "alert-warning"})
                else:
                    print(res_dict["message"])
                return
            category = res_dict["category"]

            if "is_default" in data:
                is_default = data["is_default"]
            else:
                is_default = False
            print("about to call add_user_tile_module")
            loaded_tile_management.add_user_tile_module(user_obj.username,
                                                        category,
                                                        res_dict["tile_name"],
                                                        tile_module,
                                                        tile_module_name,
                                                        is_default)
            print("about to emit update_selector_row with tile_module_name " + tile_module_name)
            tile_manager.update_selector_row({"name": tile_module_name, "icon:upload": "icon:upload"}, user_obj)
            if "main_id" in task_packet:
                umdata = {"main_id": task_packet["main_id"]}
            else:
                umdata = {}
            socketio.emit('update-menus', umdata, namespace='/main', room=user_obj.get_id())
            if not task_packet["callback_type"] == "no_callback":
                print("about to submit response with task_packet " + str(task_packet))
                self.submit_response(task_packet, {"success": True, "message": "Tile module successfully loaded",
                                                   "alert_type": "alert-success"})
            return

        try:
            print("in load_tile_module_task with tile module {}".format(data["tile_module_name"]))
            user_id = data["user_id"]
            tile_module_name = data["tile_module_name"]
            user_obj = load_user(user_id)

            try:
                print("getting the module")
                tile_module = user_obj.get_tile_module(tile_module_name)
            except ModuleNotFoundError as ex:
                special_string = "Error finding the tile module " + tile_module_name
                if not task_packet["callback_type"] == "no_callback":
                    self.submit_response(task_packet, self.get_short_exception_dict(ex, special_string))
                else:
                    print(self.extract_short_error_message(ex, special_string))

            else:
                print("posting load_source")
                self.post_task("tile_test_container", "load_source",
                               {"tile_code": tile_module}, loaded_source)

        except Exception as ex:
            if not task_packet["callback_type"] == "no_callback":
                self.submit_response(task_packet, self.get_short_exception_dict(ex, "Error loading tile"))
            else:
                print(self.extract_short_error_message(ex, "Error loading tile"))
            return

    @task_worthy
    def send_tile_source_changed_message(self, data):
        socketio.emit('tile-source-change', data, namespace='/main', room=data["user_id"])

    @task_worthy
    def show_main_status_message(self, data):
        socketio.emit('show-status-msg', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def clear_main_status_message(self, data):
        socketio.emit('clear-status-msg', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def stop_main_status_spinner(self, data):
        socketio.emit('stop-spinner', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def show_um_status_message_task(self, data):
        data["main_id"] = data["library_id"]
        socketio.emit('show-status-msg', data, namespace='/main', room=data["library_id"])

    @task_worthy
    def show_main_status_message_task(self, data):
        socketio.emit('show-status-msg', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def clear_um_status_message_task(self, data):
        socketio.emit('clear-status-msg', {"main_id": data["library_id"]}, namespace='/main', room=data["library_id"])

    @task_worthy
    def update_collection_selector_list(self, data):
        return
        # collection_manager.update_selector_list(user_obj=load_user(data["user_id"]))

    @task_worthy
    def destroy_a_users_containers(self, data):
        destroy_user_containers(data["user_id"], data["notify"])
        return {"success": True}

    @task_worthy
    def go_to_module_viewer_if_exists(self, data):
        user_id = data["user_id"]
        tile_type = data["tile_type"]
        matching_ids = get_matching_user_containers(user_id, "bsherin/tactic:module_viewer", tile_type)
        if len(matching_ids) == 0:
            return {"success": False}
        else:
            socketio.emit("focus-me", {"line_number": data["line_number"]}, namespace='/main', room=matching_ids[0])
            return {"success": True, "window_name": matching_ids[0]}

    @task_worthy
    def remove_mainwindow_task(self, data):
        print("in remove_mainwindow_task")
        main_id = data["main_id"]
        destroy_child_containers(main_id)
        destroy_container(main_id, notify=False)
        return {"success": True}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        return {"success": True, "log_text": bytes_to_string(get_log(container_id))}

    @task_worthy
    def get_lists_classes_functions(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_tags_dict,
                "class_names": the_user.class_tags_dict,
                "function_names": the_user.function_tags_dict,
                "collection_names": the_user.data_collection_tags_dict}

    @task_worthy
    def get_resource_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        res_names = the_user.get_resource_names(data["res_type"], data["tag_filter"],
                                                search_filter=data["search_filter"])
        return {"res_names": res_names}

    @task_worthy
    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_names}

    @task_worthy
    def get_list_tags_dict(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_tags_dict}

    @task_worthy
    def get_collection_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"collection_names": the_user.data_collection_names}

    @task_worthy
    def get_collection_tags_dict(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"collection_names": the_user.data_collection_tags_dict}

    @task_worthy
    def get_class_tags_dict(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"class_names": the_user.class_tags_dict}

    # @task_worthy
    # def get_loaded_user_modules(self, data):
    #     user_id = data["user_id"]
    #     user_obj = load_user(user_id)
    #     return {"loaded_modules": global_tile_manager.tile_manager[user_obj.username].loaded_user_modules.keys()}

    @task_worthy_manual_submit
    def load_module_if_necessary(self, data, task_packet):

        def did_load(result_data):
            result_data["module_name"] = tile_module_name
            self.submit_response(task_packet, result_data)
            return

        user_id = data["user_id"]
        user_obj = load_user(user_id)
        tile_module_name = data["tile_module_name"]
        if data["tile_module_name"] in loaded_tile_management.get_loaded_user_modules(user_obj.username):
            self.submit_response(task_packet, {"success": True, "module_name": tile_module_name})
            return
        else:
            self.post_task("host", "load_tile_module_task", data, did_load)
        return

    @task_worthy_manual_submit
    def load_tile_type_if_necessary(self, data, task_packet):

        def did_load(result_data):
            self.submit_response(task_packet, result_data)
            return

        if data["tile_type"] in loaded_tile_management.get_loaded_tile_types(username):
            self.submit_response(task_packet, {"success": True})
            return
        else:
            self.post_task("host", "load_tile_module_task", data, did_load)
        return

    # @task_worthy
    # def update_tile_selector_list(self, data):
    #     user_id = data["user_id"]
    #     user_obj = load_user(user_id)
    #     tile_manager.update_selector_list(user_obj=user_obj)
    #     return {"success": True}
    #
    @task_worthy
    def refresh_project_selector_list(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        project_manager.refresh_selector_list(user_obj=user_obj)
        return {"success": True}

    @task_worthy
    def get_tile_code(self, data_dict):
        result = {}
        tile_info_dict = data_dict["tile_info_dict"]
        user_id = data_dict["user_id"]
        user_obj = load_user(user_id)
        for old_tile_id, tile_type in tile_info_dict.items():
            result[old_tile_id] = loaded_tile_management.get_tile_code(tile_type, user_obj.username)
        return result

    @task_worthy
    def get_project_names(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return {"project_names": user_obj.project_names}

    @task_worthy
    def get_tile_names(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return {"tile_names": user_obj.tile_module_names}

    @task_worthy
    def get_code_names(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return {"code_names": user_obj.code_names}

    @task_worthy
    def delete_container(self, data):
        container_id = data["container_id"]
        if "notify" in data:
            nfy = data["notify"]
        else:
            nfy = True
        destroy_container(container_id, nfy)
        return {"success": True}

    @task_worthy
    def restart_container(self, data):
        tile_id = data["tile_id"]
        restart_container(tile_id)
        return {"success": True}

    @task_worthy
    def delete_container_list(self, data):
        container_list = data["container_list"]
        for container_id in container_list:
            destroy_container(container_id)
        return {"success": True}

    @task_worthy
    def get_list(self, data):
        user_id = data["user_id"]
        list_name = data["list_name"]
        the_user = load_user(user_id)
        return {"the_list": the_user.get_list(list_name)}

    @task_worthy
    def get_code_with_function(self, data):
        user_id = data["user_id"]
        function_name = data["function_name"]
        the_user = load_user(user_id)
        return {"the_code": the_user.get_code_with_function(function_name)}

    @task_worthy
    def get_code_with_class(self, data):
        user_id = data["user_id"]
        class_name = data["class_name"]
        the_user = load_user(user_id)
        return {"the_code": the_user.get_code_with_class(class_name)}

    @task_worthy
    def get_tile_types(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        result = {"tile_types": loaded_tile_management.get_user_available_tile_types(the_user.username)}
        return result

    # tactic_todo I'm in the middle of figuring out how to do this send_file_to_client
    # currently I'm thinking I'll do it with something like the temp page loading
    # @task_worthy
    # def send_file_to_client(self, data):
        # from tactic_app import socketio
        # str_io = cPickle.loads(data["encoded_str_io"]).decode("utf-8", "ignore").encode("ascii")

    @task_worthy
    def emit_table_message(self, data):
        from tactic_app import socketio
        socketio.emit("table-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_console_message(self, data):
        from tactic_app import socketio
        socketio.emit("console-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_to_client(self, data):
        from tactic_app import socketio
        socketio.emit(data["message"], data, namespace='/main', room=data["main_id"])

        return {"success": True}

    @task_worthy
    def emit_export_viewer_message(self, data):
        from tactic_app import socketio

        socketio.emit("export-viewer-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def print_to_console(self, data):
        from tactic_app import app, socketio
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_tstring = user_obj.get_timestrings(datetime.datetime.utcnow())[0]
        console_text = data["message"]
        unique_id = str(uuid.uuid4())
        if data["is_error"]:
            if "summary" in data:
                summary_text = data["summary"]
            else:
                summary_text = "error " + user_tstring
                data["message"] = {"unique_id": unique_id,
                                   "type": "fixed",
                                   "is_error": True,
                                   "am_shrunk": False,
                                   "summary_text": summary_text,
                                   "console_text": console_text,
                                   "show_markdown": False}
        else:
            if "summary" in data:
                summary_text = data["summary"]
            else:
                summary_text = "log_it item " + user_tstring

        data["message"] = {"unique_id": unique_id,
                           "type": "fixed",
                           "is_error": data["is_error"],
                           "am_shrunk": False,
                           "summary_text": summary_text,
                           "console_text": console_text,
                           "show_markdown": False}
        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True}

    @task_worthy
    def flash_to_main(self, data):
        socketio.emit("doFlash", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def flash_to_user(self, data):
        socketio.emit("doFlash", data, namespace='/main', room=data["user_id"])
        return {"success": True}

    @task_worthy
    def print_text_area_to_console(self, data):
        from tactic_app import socketio
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_tstring = user_obj.get_timestrings(datetime.datetime.utcnow())[0]
        unique_id = str(uuid.uuid4())
        summary_text = "text item " + user_tstring
        data["message"] = {"unique_id": unique_id,
                           "type": "text",
                           "am_shrunk": False,
                           "search_string": None,
                           "summary_text": summary_text,
                           "console_text": data["console_text"],
                           "show_markdown": False}
        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True, "unique_id": unique_id}

    @task_worthy
    def print_divider_area_to_console(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        data["message"] = {"unique_id": unique_id,
                           "type": "divider",
                           "am_shrunk": False,
                           "search_string": None,
                           "header_text": data["header_text"]}
        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True, "unique_id": unique_id}

    @task_worthy
    def print_link_area_to_console(self, data):
        from tactic_app import socketio
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_tstring = user_obj.get_timestrings(datetime.datetime.utcnow())[0]
        unique_id = str(uuid.uuid4())
        summary_text = "text item " + user_tstring
        data["message"] = {"unique_id": unique_id,
                           "type": "text",
                           "am_shrunk": False,
                           "search_string": None,
                           "summary_text": summary_text,
                           "console_text": "",
                           "show_markdown": True}
        data["console_message"] = "createLink"
        self.emit_console_message(data)
        return {"success": True, "unique_id": unique_id}

    @task_worthy
    def print_code_area_to_console(self, data):
        from tactic_app import socketio
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_tstring = user_obj.get_timestrings(datetime.datetime.utcnow())[0]
        unique_id = str(uuid.uuid4())
        summary_text = "code item " + user_tstring
        data["message"] = {"unique_id": unique_id,
                           "type": "code",
                           "am_shrunk": False,
                           "show_spinner": False,
                           "running": False,
                           "summary_text": summary_text,
                           "search_string": None,
                           "console_text": data["console_text"],
                           "output_text": "",
                           "execution_count": 0}

        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True}

    @task_worthy
    def copy_console_cells(self, data):
        uid = "copied_cell_" + data["user_id"]
        delete_temp_data(db, uid)
        store_temp_data(db, {"console_items": data["console_items"]}, uid)
        return {"success": True}

    @task_worthy
    def get_copied_console_cells(self, data):
        uid = "copied_cell_" + data["user_id"]
        res_dict = read_temp_data(db, uid)
        if res_dict:
            for citem in res_dict["console_items"]:
                citem["unique_id"] = str(uuid.uuid4())
            return {"success": True, "console_items": res_dict["console_items"]}
        else:
            return {"success": False, "message": "No copied cell found"}

    @task_worthy
    def go_to_row_in_document(self, data):
        from tactic_app import socketio
        socketio.emit("change-doc", data, namespace='/main', room=data["main_id"])

    @task_worthy
    def emit_tile_message(self, data):
        from tactic_app import socketio
        socketio.emit("tile-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def get_empty_tile_containers(self, data):
        tile_containers = []
        for i in range(data["number"]):
            tile_container_id, container_id = create_container("bsherin/tactic:tile",
                                                               network_mode="bridge",
                                                               owner=data["user_id"],
                                                               parent=data["parent"])
            tile_containers.append(tile_container_id)
        return {"tile_containers": tile_containers}

    @task_worthy
    def get_module_code(self, data):
        user_obj = load_user(data["user_id"])
        module_code = loaded_tile_management.get_tile_code(data["tile_type"], user_obj.username)
        if module_code is None:
            return {"module_code": module_code, "success": False, "message": "Couldn't get module " + data["tile_type"]}
        else:
            return {"module_code": module_code, "success": True}

    @task_worthy
    def get_module_from_tile_type(self, data):
        user_obj = load_user(data["user_id"])
        module_name = loaded_tile_management.get_module_from_type(user_obj.username, data["tile_type"])
        return {"module_name": module_name}

    @task_worthy
    def render_tile(self, data):
        tile_id = data["tile_id"]
        form_html = data["form_html"]
        tname = data["tile_name"]
        with app.test_request_context():
            the_html = render_template("tile.html", tile_id=tile_id,
                                       tile_name=tname,
                                       form_text=form_html)
        ddict = data
        ddict["success"] = True
        ddict["html"] = the_html
        return ddict

    @task_worthy
    def register_container(self, data):
        print("registering a container")
        tactic_app.health_tracker.register_container(data["container_id"])

    @task_worthy
    def deregister_container(self, data):
        tactic_app.health_tracker.deregister_container(data["container_id"])

    def forward_client_post(self, task_packet):
        dest_id = task_packet["dest"]
        task_packet["status"] = "presend"
        task_packet["reply_to"] = "host"
        task_packet["client_post"] = "Yes"
        if dest_id == "host":
            super(HostWorker, self).handle_event(task_packet)
        else:

            self.post_packet(dest_id, task_packet, reply_to="host", callback_id=task_packet["callback_id"])
        tactic_app.health_tracker.check_health()
        return

    def handle_event(self, task_packet):
        if "client_post" in task_packet:
            self.handle_client_event(task_packet)
        else:
            super(HostWorker, self).handle_event(task_packet)
        tactic_app.health_tracker.check_health()

    def handle_client_event(self, task_packet):

        task_packet["table_message"] = task_packet["task_type"]
        socketio.emit("table-message", task_packet, namespace='/main', room=task_packet["main_id"])
        return

    def handle_response(self, task_packet):
        if "client_post" in task_packet:
            self.handle_client_response(task_packet)
        else:
            super(HostWorker, self).handle_response(task_packet)
        tactic_app.health_tracker.check_health()

    def handle_client_response(self, task_packet):

        try:
            if "room" in task_packet:
                room = task_packet["room"]
            else:
                room = task_packet["main_id"]
                task_packet["room"] = room
            if "namespace" in task_packet:
                namespace = task_packet["namespace"]
            else:
                namespace = "/main"
            socketio.emit("handle-callback", task_packet, namespace=namespace, room=room)
        except Exception as ex:
            special_string = "Error handling callback for task type {} for my_id {}".format(task_packet["task_type"],
                                                                                            self.my_id)
            self.handle_exception(ex, special_string)
        return


class HealthTracker:
    def __init__(self):
        self.last_health_check = current_timestamp()  # I don't want to be hitting redis constantly
        if not redis_ht.exists("last_health_check"):
            redis_ht.set("last_health_check", current_timestamp())

    def is_container_health_data(self, k):
        return redis_ht.type(k) == "hash" and redis_ht.hexists(k, "am_health_data")

    def register_container(self, container_id):
        print("in register_container in healthtracker with container_id {}".format(container_id))
        ctime = current_timestamp()
        starting_data = {
            "created": ctime,
            "last_contact": ctime,
            "am_health_data": "True"
        }
        print("about to register in redis")
        redis_ht.hmset(container_id, starting_data)
        print("did the register")

    def register_container_heartbeat(self, container_id):
        if not redis_ht.exists(container_id):
            self.register_container(container_id)
        else:
            redis_ht.hset(container_id, "last_contact", current_timestamp())

    def check_health(self):
        print("entering check_health")
        current_time = current_timestamp()
        if (current_time - self.last_health_check) > health_check_time:
            print("doing a health check")
            if not redis_ht.exists("last_health_check"):
                # we want to see if another worker has done a check more recently
                last_worker_check = float(redis_ht.get("last_health_check"))
                if (current_time - last_worker_check) < health_check:
                    return
            self.check_for_dead_containers()
            redis_ht.set("last_health_check", current_time)
        return

    def deregister_container(self, container_id):
        if redis_ht.exists(container_id):
            redis_ht.delete(container_id)

    def update_contact(self, container_id):
        if redis_ht.exists(container_id):
            redis_ht.hset(container_id, "last_contact", current_timestamp())

    def last_contact(self, container_id):
        return float(redis_ht.hget(container_id, "last_contact"))

    def created(self, container_id):
        return float(redis_ht.hget(container_id, "created"))

    def check_for_dead_containers(self):
        current_time = current_timestamp()
        cont_list = []
        all_keys = redis_ht.keys()
        for k in all_keys:
            if self.is_container_health_data(k):
                if (current_time - self.last_contact(k)) > inactive_container_time:
                    print("found an inactive container")
                    cont_list.append(k)
                    continue
                if (current_time - self.created(k)) > old_container_time:
                    print("found and old container")
                    cont_list.append(k)
        for cont_id in cont_list:
            destroy_container(cont_id)


tactic_app.health_tracker = HealthTracker()
tactic_app.host_worker = HostWorker()
tactic_app.host_worker.start()
