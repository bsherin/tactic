from qworker import QWorker, task_worthy, task_worthy_manual_submit, current_timestamp
from flask import render_template, url_for
from flask_login import current_user
import json
from users import load_user, ModuleNotFoundError
import gevent
import pika
from communication_utils import make_python_object_jsonizable
from docker_functions import create_container, destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, ContainerCreateError, container_exec, restart_container, get_address
from tactic_app import app, socketio, use_ssl, db
from library_views import tile_manager, project_manager, collection_manager, list_manager
from library_views import code_manager
from redis_tools import redis_client
import datetime
from mongo_accesser import bytes_to_string
import tactic_app
import uuid
import sys
import copy
import datetime
import time
import os

no_heartbeat_time = 10 * 60  # If a mainwindow does send a heartbeat after this amount of time, remove mainwindow.
# inactive_container_time is the max time a tile can
# go without making active contact with the megaplex.

inactive_container_time = 10 * 3600

# old_container_time is the max time a tile can exist after being created.
old_container_time = 3 * 24 * 3600

# how frequently we will look for dead containers and dead mainwindows
health_check_time = 10


import loaded_tile_management

from js_source_management import _develop

if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True


class HostWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.my_id = "host"

    @task_worthy
    def stop_library_spinner(self, data):
        socketio.emit('stop-spinner', {}, namespace='/library', room=data["library_id"])

    def show_um_status_message(self, msg, library_id, timeout=3):
        if timeout is None:
            data = {"message": msg}
        else:
            data = {"message": msg, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/library', room=library_id)

    def clear_um_status_message(self, library_id):
        socketio.emit('clear-status-msg', {}, namespace='/library', room=library_id)

    @task_worthy
    def container_heartbeat(self, data):
        container_id = data["container_id"]
        tactic_app.health_tracker.register_container_heartbeat(container_id)
        return

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
                      namespace='/library', room=user_obj.get_id())

    @task_worthy_manual_submit
    def load_tile_module_task(self, data, task_packet):
        def loaded_source(res_dict):
            print("in loaded_source")
            if not res_dict["success"]:
                if "show_failed_loads" in data and data["show_failed_loads"]:
                    loaded_tile_management.add_failed_load(tile_module_name, user_obj.username)
                    self.emit_loaded_tile_update(user_obj)
                if "main_id" not in task_packet:
                    task_packet["room"] = user_id
                    task_packet["namespace"] = "/library"
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
            self.emit_loaded_tile_update(user_obj)
            socketio.emit('update-menus', {}, namespace='/main', room=user_obj.get_id())
            if "main_id" not in task_packet:
                task_packet["room"] = user_id
                task_packet["namespace"] = "/library"

            if not task_packet["callback_type"] == "no_callback":
                self.submit_response(task_packet, {"success": True, "message": "Tile module successfully loaded",
                                                   "alert_type": "alert-success"})
            return

        try:
            print("in load_tile_module_task")
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
        socketio.emit('clear-status-msg', {}, namespace='/main', room=data["main_id"])

    @task_worthy
    def stop_main_status_spinner(self, data):
        socketio.emit('stop-spinner', {}, namespace='/main', room=data["main_id"])

    @task_worthy
    def show_um_status_message_task(self, data):
        socketio.emit('show-status-msg', data, namespace='/library', room=data["library_id"])

    @task_worthy
    def show_main_status_message_task(self, data):
        socketio.emit('show-status-msg', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def clear_um_status_message_task(self, data):
        socketio.emit('clear-status-msg', {}, namespace='/library', room=data["library_id"])

    @task_worthy
    def update_collection_selector_list(self, data):
        return
        # collection_manager.update_selector_list(user_obj=load_user(data["user_id"]))

    @task_worthy
    def destroy_a_users_containers(self, data):
        destroy_user_containers(data["user_id"])
        return {"success": True}

    @task_worthy
    def remove_mainwindow_task(self, data):
        main_id = data["main_id"]
        destroy_child_containers(main_id)
        destroy_container(main_id, notify=True)
        socketio.emit('stop-heartbeat', {}, namespace='/main', room=main_id)
        tactic_app.health_tracker.remove_from_heartbeat_table(main_id)
        return {"success": True}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        return {"success": True, "log_text": bytes_to_string(get_log(container_id))}

    @task_worthy
    def get_full_collection_name(self, data):
        user_id = data["user_id"]
        collection_name = data["collection_name"]
        the_user = load_user(user_id)
        name_exists = collection_name in the_user.data_collections
        full_collection_name = the_user.build_data_collection_name(collection_name)
        return {"full_collection_name": full_collection_name,
                "name_exists": name_exists}

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
        return {"collection_names": the_user.data_collections}

    @task_worthy
    def get_collection_tags_dict(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"collection_names": the_user.data_collection_tags_dict}

    @task_worthy
    def get_class_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"class_names": the_user.class_tags_dict}

    @task_worthy
    def get_function_tags_dict(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"function_names": the_user.function_tags_dict}

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

        user_id = data["user_id"]
        user_obj = load_user(user_id)
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
                           "summary_text": summary_text,
                           "console_text": data["console_text"],
                           "show_markdown": False}
        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True}

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
                           "summary_text": summary_text,
                           "console_text": data["console_text"],
                           "output_text": "",
                           "execution_count": 0}

        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True}

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
            tile_container_id, container_id = create_container("tactic_tile_image",
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
        all_keys = redis_client.keys()
        delete_list = []
        for k in all_keys:
            if self.is_health_data(k):
                delete_list.append(k)
        if len(delete_list) > 0:
            redis_client.delete(*delete_list)
        if redis_client.exists("heartbeat_table"):
            redis_client.delete("heartbeat_table")
        self.last_health_check = current_timestamp()  # I don't want to be hitting redis constantly
        if not redis_client.exists("last_health_check"):
            redis_client.set("last_health_check", current_timestamp())

    def is_health_data(self, k):
        return redis_client.type(k) == "hash" and redis_client.hexists(k, "am_health_data")

    def register_container(self, container_id):
        print("in register_container in healthtracker with container_id {}".format(container_id))
        ctime = current_timestamp()
        starting_data = {
            "created": ctime,
            "last_contact": ctime,
            "am_health_data": "True"
        }
        print("about to register in redis")
        redis_client.hmset(container_id, starting_data)
        print("did the register")

    def register_container_heartbeat(self, container_id):
        if not redis_client.exists(container_id):
            self.register_container(container_id)
        else:
            redis_client.hset(container_id, "last_contact", current_timestamp())

    def register_heartbeat(self, main_id):
        redis_client.hset("heartbeat_table", main_id, current_timestamp())

    def check_health(self):
        print("entering check_health")
        current_time = current_timestamp()
        if (current_time - self.last_health_check) > health_check_time:
            print("doing a health check")
            if not redis_client.exists("last_health_check"):
                # we want to see if another worker has done a check more recently
                last_worker_check = float(redis_client.get("last_health_check"))
                if (current_time - last_worker_check) < health_check:
                    return
            self.check_for_dead_containers()
            self.check_for_dead_mainwindows()
            redis_client.set("last_health_check", current_time)
        return

    def deregister_container(self, container_id):
        if redis_client.exists(container_id):
            redis_client.delete(container_id)

    def update_contact(self, container_id):
        if redis_client.exists(container_id):
            redis_client.hset(container_id, "last_contact", current_timestamp())

    def update_heartbeat_table(self, main_id):
        self.main_heartbeat_table[main_id] = datetime.datetime.utcnow()

    def remove_from_heartbeat_table(self, main_id):
        if redis_client.exists("heartbeat_table"):
            if redis_client.hexists("heartbeat_table", main_id):
                redis_client.hdel("heartbeat_table", main_id)

    def check_for_dead_mainwindows(self):
        current_time = current_timestamp()
        htable = redis_client.hgetall("heartbeat_table")
        for main_id, last_contact in htable.items():
            tdelta = current_time - float(last_contact)
            if tdelta > no_heartbeat_time:
                print("No heartbeat from mainwindow " + str(main_id))
                tactic_app.host_worker.post_task("host", "remove_mainwindow_task", {"main_id": main_id})

    def last_contact(self, container_id):
        return float(redis_client.hget(container_id, "last_contact"))

    def created(self, container_id):
        return float(redis_client.hget(container_id, "created"))

    def check_for_dead_containers(self):
        current_time = current_timestamp()
        cont_list = []
        all_keys = redis_client.keys()
        for k in all_keys:
            if self.is_health_data(k):
                if (current_time - self.last_contact(k)) > inactive_container_time:
                    print("found an inactive container")
                    cont_list.append(k)
                    continue
                if (current_time - self.created(k)) > old_container_time:
                    print ("found and old container")
                    cont_list.append(k)
        for cont_id in cont_list:
            destroy_container(cont_id)


tactic_app.health_tracker = HealthTracker()
tactic_app.host_worker = HostWorker()
tactic_app.host_worker.start()

