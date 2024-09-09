from qworker import QWorker, task_worthy, task_worthy_manual_submit, current_timestamp, debug_log
from flask import render_template, url_for
from flask_login import current_user
import json
from users import load_user, ModuleNotFoundError, user_data_fields, User
import gevent
import pika
from bson import ObjectId
from communication_utils import make_python_object_jsonizable, store_temp_data, read_temp_data, delete_temp_data
from communication_utils import make_jsonizable_and_compress
import docker_functions
from docker_functions import create_container, destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, restart_container, create_log_streamer_container
from docker_functions import get_matching_user_containers, get_container, create_assistant_container, get_user_assistant
from tactic_app import app, socketio, db, fs
from library_views import tile_manager, project_manager, collection_manager, list_manager, pool_manager, get_manager_for_type
from library_views import code_manager
from redis_tools import redis_ht, delete_ready_block_participant
import datetime
from mongo_accesser import bytes_to_string
import tactic_app
import uuid
import sys
import copy
import time
import os
import re
from gevent import subprocess

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

    @task_worthy
    def add_error_drawer_entry_task(self, data):
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=data["user_id"])

    def user_to_true(self, user_path, user_obj):
        return re.sub("/mydisk", user_obj.pool_dir, user_path)

    def emit_status_msg(self, message, user_id, timeout=4):
        data = {"message": message, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/main', room=user_id)

    def compress_file_in_place(self, source_file, user_id):
        source_dir = os.path.dirname(source_file)
        base_name = os.path.basename(source_file)
        output_archive = os.path.join(source_dir, f"{base_name}.tar.gz")
        command = ['tar', '-czf', output_archive, '-C', source_dir, base_name]
        self.emit_status_msg(f"Started compression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_msg(f"Finished compression", user_id)
        return

    def compress_directory_in_place(self, source_dir, user_id):
        base_name = os.path.basename(source_dir.rstrip('/'))
        parent_dir = os.path.dirname(source_dir.rstrip('/'))
        output_archive = os.path.join(parent_dir, f"{base_name}.tar.gz")
        command = ['tar', '-czf', output_archive, '-C', parent_dir, base_name]
        self.emit_status_msg(f"Started compression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_msg(f"Finished compression", user_id)
        return

    def decompress_archive_in_places(self, source_archive, user_id):
        source_dir = os.path.dirname(source_archive)
        command = ['tar', '-xzf', source_archive, '-C', source_dir]
        self.emit_status_msg(f"Started decompression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_msg(f"Finished decompression", user_id)
        return

    @task_worthy
    def compress_pool_resource(self, data):
        try:
            full_path = data["full_path"]
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            true_path = self.user_to_true(full_path, user_obj)
            if os.path.isfile(true_path):
                self.compress_file_in_place(true_path, user_id)
            else:
                self.compress_directory_in_place(true_path, user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error compressing resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def decompress_archive(self, data):
        try:
            full_path = data["full_path"]
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            true_path = self.user_to_true(full_path, user_obj)
            self.decompress_archive_in_places(true_path, user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error decompressing archive")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

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
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return user_obj.update_account({"theme": data["theme"]})

    @task_worthy
    def get_user_settings(self, data):
        print("in get_user_settings")
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

    @task_worthy
    def os_command_exec(self, data):
        the_code = data["the_code"]
        print(">> " + the_code)
        if the_code[:3] == "cd ":
            try:
                os.chdir(os.path.abspath(the_code[3:]))
            except Exception:
                print("cd: no such file or directory: {}".format(path))
        else:
            exec(f"os.system('{the_code}')")
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
            print("got loaded_source")
            if not res_dict["success"]:
                print("load_source didn't return success")
                if "show_failed_loads" in data and data["show_failed_loads"]:
                    loaded_tile_management.add_failed_load(tile_module_name, user_obj.username)
                    _id = user_obj.get_tile_dict(tile_module_name)["_id"]
                    tile_manager.update_selector_row({"name": tile_module_name, "doc_id": str(_id), "event_type": "update",
                                                      "icon:upload": "icon:error", "res_type": "tile"}, user_obj)
                if "main_id" not in task_packet:
                    task_packet["room"] = user_id
                print(res_dict["message"])
                if not task_packet["callback_type"] == "no_callback":
                    self.submit_response(task_packet, {"success": False, "message": res_dict["message"],
                                                       "alert_type": "alert-warning"})
                return
            print("load_source returned success")
            mdata = tile_manager.grab_metadata(res_dict["tile_name"], user_obj)
            category = mdata["category"] if "category" in mdata else "basic"

            if "is_default" in data:
                is_default = data["is_default"]
            else:
                is_default = False
            loaded_tile_management.add_user_tile_module(user_obj.username,
                                                        category,
                                                        res_dict["tile_name"],
                                                        tile_module,
                                                        tile_module_name,
                                                        is_default)
            _id = user_obj.get_tile_dict(tile_module_name)["_id"]
            tile_manager.update_selector_row(
                {"name": tile_module_name, "doc_id": str(_id), "event_type": "update",
                 "icon:upload": "icon:upload", "res_type": "tile"}, user_obj)
            if "main_id" in task_packet:
                umdata = {"main_id": task_packet["main_id"]}
            else:
                umdata = {}
            socketio.emit('update-menus', umdata, namespace='/main', room=user_obj.get_id())
            if not task_packet["callback_type"] == "no_callback":
                self.submit_response(task_packet, {"success": True, "message": "Tile module successfully loaded",
                                                   "alert_type": "alert-success"})
            return

        try:
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
        main_id = data["main_id"]
        destroy_child_containers(main_id)
        destroy_container(main_id, notify=False)
        return {"success": True}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        if "since" in data and data["since"] is not None:
            dt = datetime.datetime.fromtimestamp(data["since"] / 1000)
        else:
            dt = None
        log_text = bytes_to_string(get_log(container_id, since=dt))
        if "max_lines" in data and data["max_lines"] is not None:
            ltlist = log_text.split("\n")[-1 * data["max_lines"]:]
            log_text = "\n".join(ltlist)
        return {"success": True, "log_text": log_text}

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
        cnames = the_user.data_collection_names
        return {"collection_names": cnames}

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
    def mongo_event(self, data):
        print(f"got mongo_event with data {str(data)}")
        try:
            event_type = data["event_type"]
            username = data["username"]
            res_type = data["res_type"]
            if res_type == "user":
                return {"success": True}
            print(f"got event {event_type} for {username} res_type {res_type}")
            _id = ObjectId(data["id"])
            manager = get_manager_for_type(res_type)
            user_obj = User.get_user_by_username(username)
            cname = getattr(user_obj, manager.collection_name)
            if event_type == "delete":
                doc_name = ""
                mdata = {}
            else:
                nfield = manager.name_field
                doc = db[cname].find_one({"_id": _id})
                doc_name = doc[nfield]
                if "metadata" in doc:
                    mdata = doc["metadata"]
                else:
                    mdata = {}
            rdict = manager.build_res_dict(doc_name, mdata, res_type=data["res_type"],
                                           user_obj=user_obj, doc_id=str(_id))
            rdict["event_type"] = event_type
            manager.update_selector_row(rdict, user_obj)
            socketio.emit("resource-updated", {
                "user_id": user_obj.get_id(),
                "res_type": res_type,
                "res_name": doc_name,
                "mdata_uid": mdata["mdata_uid"]
            }, namespace='/main', room=user_obj.get_id())
            if username == "repository":
                manager.update_repository_selector_row(rdict)
            user_id =  user_obj.get_id()
            if event_type == "update" and res_type == "tile":
                socketio.emit('tile-source-change', {'user_id': user_id, 'tile_type': doc_name},
                              namespace='/main', room=user_id)
        except Exception as ex:
            print(self.handle_exception(ex, "Error in mongo_event"))
        return {"success": True}

    @task_worthy
    def pool_event(self, data):
        try:
            event_type = data["event_type"]
            path = data["path"]
            dest_path = data["dest_path"]
            is_directory = data["is_directory"]
            username = re.findall("/pool/(.*?)/", path)[0]
            user_obj = User.get_user_by_username(username)
            user_pool_dir = f"/pool/{user_obj.username}"
            new_path = re.sub(user_pool_dir, "/mydisk", path)
            event_data = {"event_type": event_type}
            if is_directory:
                new_path = new_path[:-1]
                event_data["path"] = new_path
                if event_type == "delete":
                    folder_dict = {"fullpath": new_path}
                elif dest_path is None:
                    folder_dict = self.folder_dict(new_path, os.path.basename(new_path), user_obj)
                else:
                    new_dest_path = re.sub(user_pool_dir, "/mydisk", dest_path[:-1])
                    event_data["dest_path"] = new_dest_path
                    folder_dict = self.folder_dict(new_dest_path, os.path.basename(new_dest_path), user_obj)
                event_data["folder_dict"] = folder_dict
                socketio.emit('pool-directory-event', event_data, namespace='/main', room=user_obj.get_id())
            else:
                event_data["path"] = new_path
                if event_type == "delete":
                    file_dict = {"fullpath": new_path}
                elif dest_path is None:
                    file_dict = self.file_dict(new_path, os.path.basename(new_path), user_obj)
                else:
                    new_dest_path = re.sub(user_pool_dir, "/mydisk", dest_path)
                    file_dict = self.file_dict(new_dest_path, os.path.basename(new_dest_path), user_obj)
                event_data["file_dict"] = file_dict
                socketio.emit('pool-file-event', event_data, namespace='/main', room=user_obj.get_id())
        except Exception as ex:
            print(self.handle_exception(ex, "Got error in pool_event"))
        return {"success": True}

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
        tile_types = loaded_tile_management.get_user_available_tile_types(the_user.username)
        icon_dict = {}
        for cat_types in tile_types.values():
            for ttype in cat_types:
                icon_dict[ttype] = tile_manager.get_tile_icon(ttype, the_user)
        result = {"tile_types": tile_types,
                  "icon_dict": icon_dict}
        return result

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
        if "room" in data:
            room = data["room"]
        else:
            room = data["main_id"]
            data["room"] = room
        if "namespace" in data:
            namespace = data["namespace"]
        else:
            namespace = "/main"
        socketio.emit(data["message"], data, namespace=namespace, room=room)

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
    def flash_to_user(self, data):
        socketio.emit("doFlashUser", data, namespace='/main', room=data["user_id"])
        return {"success": True}

    @task_worthy
    def print_text_area_to_console(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        data["message"] = {"unique_id": unique_id,
                           "type": "text",
                           "am_shrunk": False,
                           "search_string": None,
                           "summary_text": None,
                           "console_text": data["console_text"],
                           "show_markdown": False}
        data["console_message"] = "consoleLog"
        self.emit_console_message(data)
        return {"success": True, "unique_id": unique_id}



    @task_worthy
    def print_divider_area_to_console(self, data):
        from tactic_app import socketio
        divider_unique_id = str(uuid.uuid4())
        divider_dict = {"unique_id": divider_unique_id,
                        "type": "divider",
                        "am_shrunk": False,
                        "search_string": None,
                        "header_text": data["header_text"]}
        section_end_unique_id = str(uuid.uuid4())
        section_end_dict = {"unique_id": section_end_unique_id,
                            "type": "section-end"}
        data["message"] = [divider_dict, section_end_dict]
        data["console_message"] = "consoleLogMultiple"
        self.emit_console_message(data)
        return {"success": True}

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
        unique_id = str(uuid.uuid4())
        data["message"] = {"unique_id": unique_id,
                           "type": "code",
                           "am_shrunk": False,
                           "show_spinner": False,
                           "running": False,
                           "summary_text": None,
                           "search_string": None,
                           "console_text": data["console_text"],
                           "output_dict": {},
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
        tactic_app.health_tracker.register_container(data["container_id"])

    @task_worthy
    def deregister_container(self, data):
        tactic_app.health_tracker.deregister_container(data["container_id"])

    @task_worthy
    def StartLogStreaming(self, data):
        container_id = data["container_id"]
        room = data["room"]
        user_id = data["user_id"]
        username = load_user(user_id).username
        if container_id is not None:
            streamer_id = create_log_streamer_container(room, container_id, user_id, username)
        return {"streamer_id": streamer_id}

    @task_worthy
    def StopLogStreaming(self, data):
        streamer_id = data["streamer_id"]
        print("stopping log streamer " + str(streamer_id))
        cont = get_container(streamer_id)
        if cont is not None:
            cont.kill(signal="SIGTERM")
            return None
        else:
            print("no streamer to kill")
        return None

    @task_worthy
    def StartAssistant(self, data):
        parent_id = data["main_id"]
        user_id = data["user_id"]
        user = load_user(user_id)
        username = user.username
        openai_api_key = user.get_openai_api_key()
        assistant_id = create_assistant_container(openai_api_key, parent_id, user_id, username)
        return {"assistant_id": assistant_id}

    @task_worthy
    def SaveAssistantThread(self, data):
        def got_past_messages(resp_data):
            try:
                print("got past messages")
                console_items = []
                for msg in resp_data["messages"]:
                    unique_id = str(uuid.uuid4())
                    header = "ChatBot" if msg["kind"] == "assistant" else "You"
                    citem = {
                        "unique_id": unique_id,
                        "type": "text",
                        "am_shrunk": False,
                        "search_string": None,
                        "summary_text": None,
                        "console_text": f"<h6>{header}</h6>\n{msg['text']}",
                        "show_markdown": True
                    }
                    console_items.append(citem)
                interface_state = {
                    "console_items": console_items,
                    "show_exports_pane": False,
                    "console_width_fraction": .5
                }
                project_dict = {"doc_type": "notebook", "project_name": new_name}
                mdata = {"datetime": datetime.datetime.utcnow(),
                        "updated": datetime.datetime.utcnow(),
                        "tags": "",
                        "notes": ""}
                mdata["type"] = "notebook"
                mdata["collection_name"] = ""
                mdata["loaded_tiles"] = []
                mdata["save_style"] = "b64save_react"
                project_dict["interface_state"] = interface_state

                save_dict = {"metadata": mdata,
                             "project_name": new_name}
                pdict = make_jsonizable_and_compress(project_dict)
                save_dict["file_id"] = fs.put(pdict)
                db[user_obj.project_collection_name].insert_one(save_dict)
                return {"success": True}
            except Exception as ex2:
                print(self.handle_exception(ex2, "Error saving thread to notebook"))
                return {"success": False}

        try:
            assistant_id = data["assistant_id"]
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            new_name = data["new_name"]
            self.post_task(assistant_id, "get_past_messages", {}, got_past_messages)
        except Exception as ex:
            print(self.handle_exception(ex, "Error posting get_past_message"))
            return {"success": False}

    @task_worthy
    def GetAssistant(self, data):
        user_id = data["user_id"]
        cont_id = get_user_assistant(user_id)
        return {"assistant_id": cont_id}


    @task_worthy
    def StopAssistant(self, data):
        assistant_id = data["assistant_id"]
        print("stopping assistant " + str(assistant_id))
        cont = get_container(assistant_id)
        if cont is not None:
            cont.kill(signal="SIGTERM")
            return None
        else:
            print("no streamer to kill")
        return None

    def folder_dict(self, path, basename, user_obj, child_nodes=[]):
        base_dict = {
            "id": path,
            "icon": "folder-close",
            "isDirectory": True,
            "isExpanded": False,
            "basename": basename,
            "label": basename,
            "fullpath": path,
            "childNodes": child_nodes,
            "isSelected": False
        }
        base_dict.update(self.get_file_stats(path, user_obj, is_directory=True))
        return base_dict

    def file_dict(self, path, basename, user_obj):
        base_dict = {
            "id": path,
            "icon": "document",
            "isDirectory": False,
            "fullpath": path,
            "basename": basename,
            "label": basename,
            "isSelected": False
        }
        base_dict.update(self.get_file_stats(path, user_obj), is_directory=False)
        return base_dict

    def get_node(self, root, user_pool_dir, user_obj, show_hidden=False):
        ammended_root = re.sub(user_pool_dir, "/mydisk", root)
        new_base_node = self.folder_dict(ammended_root, os.path.basename(root), user_obj)
        child_list = []
        for entry in os.listdir(root):
            fpath = os.path.join(root, entry)
            if not show_hidden and entry.startswith("."):
                continue
            if os.path.isdir(fpath):
                child_list.append(self.get_node(fpath, user_pool_dir, user_obj, show_hidden))
            else:
                ammended_path = re.sub(user_pool_dir, "/mydisk", fpath)
                child_list.append(self.file_dict(ammended_path, entry, user_obj))
        new_base_node["childNodes"] = child_list
        return new_base_node

    @task_worthy
    def GetPoolTree(self, data):
        try:
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            show_hidden = data["show_hidden"]
            user_pool_dir = f"/pool/{user_obj.username}"
            if not os.path.exists(user_pool_dir):
                return {"dtree": None}
            self.pool_visited = []
            dtree = [self.get_node(user_pool_dir, user_pool_dir, user_obj, show_hidden)]
            dtree[0].update({
                "path": "/mydisk",
                "basename": "mydisk",
                "label": "mydisk"
            })
        except Exception as ex:
            print(self.handle_exception(ex, "Error getting pooltree"))
        return {"dtree": dtree}

    def get_folder_size(self, folder_path):
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(folder_path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                # Skip if it is a symbolic link
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)
        return total_size

    @task_worthy
    def get_file_stats(self, filepath, user_obj, is_directory=False):
        user_pool_dir = f"/pool/{user_obj.username}"
        if not os.path.exists(user_pool_dir):
            return {"stats": None}
        truepath = re.sub("/mydisk", user_pool_dir, filepath)
        fstat = os.stat(truepath)
        if is_directory:
            raw_size = self.get_folder_size(truepath)
        else:
            raw_size = fstat.st_size
        if raw_size > 10**9:
            size_str = f"{round(raw_size / 10**9, 1)} GB"
        elif raw_size > 10 ** 6:
            size_str = f"{round(raw_size / 10**6, 1)} MB"
        elif raw_size > 10 ** 3:
            size_str = f"{round(raw_size / 10**3, 1)} KB"
        else:
            size_str = f"{raw_size} bytes"
        updated, updated_for_sort = user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_mtime))
        stats = {
            "created": user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_ctime))[0],
            "updated": updated,
            "accessed": user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_atime))[0],
            "size": size_str,
            "updated_for_sort": updated_for_sort,
            "size_for_sort": raw_size
        }
        return stats

    @task_worthy
    def GetFileStats(self, data):
        user_id = data["user_id"]
        filepath = data["file_path"]
        user_obj = load_user(user_id)
        self.get_file_stats(filepath, user_obj)
        return {"stats": stats}


    def forward_client_post(self, task_packet):
        dest_id = task_packet["dest"]
        task_packet["status"] = "presend"
        task_packet["reply_to"] = "host"
        task_packet["client_post"] = "Yes"
        task_data = task_packet["task_data"]
        force_post = task_data["force_forward"] if "force_forward" in task_data else False
        if not force_post and (dest_id == "host" or dest_id == self.my_id):
            super(HostWorker, self).handle_event(task_packet)
        else:
            self.post_packet(dest_id, task_packet, reply_to="host", callback_id=task_packet["callback_id"])
        tactic_app.health_tracker.check_health()
        return

    def handle_event(self, task_packet):
        super(HostWorker, self).handle_event(task_packet)
        tactic_app.health_tracker.check_health()
        return

    def handle_client_event(self, task_packet):
        # I think I should never get here.
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
        ctime = current_timestamp()
        starting_data = {
            "created": ctime,
            "last_contact": ctime,
            "am_health_data": "True"
        }
        redis_ht.hmset(container_id, starting_data)

    def register_container_heartbeat(self, container_id):
        if not redis_ht.exists(container_id):
            self.register_container(container_id)
        else:
            redis_ht.hset(container_id, "last_contact", current_timestamp())

    def check_health(self):
        current_time = current_timestamp()
        if (current_time - self.last_health_check) > health_check_time:
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
                    print("found an old container")
                    cont_list.append(k)
        for cont_id in cont_list:
            destroy_container(cont_id)


tactic_app.health_tracker = HealthTracker()
tactic_app.host_worker = HostWorker()
tactic_app.host_worker.start()
