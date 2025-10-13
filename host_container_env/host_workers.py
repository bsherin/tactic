from qworker import QWorker, task_worthy, task_worthy_manual_submit, current_timestamp, debug_log
from flask import render_template, url_for
from flask_login import current_user
import json

from users import load_user, user_data_fields, User
import gevent
from bson import ObjectId
from communication_utils import make_python_object_jsonizable
from communication_utils import make_jsonizable_and_compress
import docker_functions
from docker_functions import create_container, destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, restart_container, create_log_streamer_container
from docker_functions import get_matching_user_containers, get_container, create_assistant_container, get_user_assistant
from tactic_app import app, socketio
from redis_tools import redis_ht, delete_ready_block_participant
import datetime
from mongo_accesser import bytes_to_string, MongoAccessException
import tactic_app
import uuid
import sys
import copy
import time
import os
import re
from gevent import subprocess
from list_tasks_mixin import ListTasksMixin
from code_tasks_mixin import CodeTasksMixin
from tile_tasks_mixin import TileTasksMixin
from project_tasks_mixin import ProjectTasksMixin
from collection_tasks_mixin import CollectionTasksMixin
from metabook_tasks_mixin import MetabookTasksMixin
from higher_mongo_tasks_mixin import HigherMongoTasksMixin
from user_tasks_mixin import UserTasksMixin
from container_tasks_mixin import ContainerTasksMixin
from across_accounts_mixin import AcrossAccountsTasksMixin
from pool_tasks_mixin import PoolTasksMixin
from account_tasks_mixin import AccountTasksMixin
from rabbit_manage import get_pika_connection_with_retries
from ecs_tile_backend import ECSTileBackend
from docker_tile_backend import DockerTileBackend
from tile_registry import TileContainerRegistry
from tile_container_management_mixin import TileContainerManagementMixin

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

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

myport = os.environ.get("MYPORT")

from qworker import max_pika_retries

class HostWorker(QWorker, ListTasksMixin, CodeTasksMixin, TileTasksMixin, UserTasksMixin,ContainerTasksMixin,
                 ProjectTasksMixin, CollectionTasksMixin, MetabookTasksMixin, PoolTasksMixin, AccountTasksMixin,
                 AcrossAccountsTasksMixin, HigherMongoTasksMixin, TileContainerManagementMixin):
    def __init__(self):
        QWorker.__init__(self)
        self.my_id = "host" + str(myport)
        self.repository_user = User.get_user_by_username("repository")
        self.tile_registry = TileContainerRegistry()
        self.generate_heartbeats = True
        if use_ecs and self.my_id == "host5000":
            self.tile_backend = ECSTileBackend(self.tile_registry, self)
        else:
            self.tile_backend = DockerTileBackend(self.tile_registry, self)

    def start_background_thread(self, retries=0):
        try:
            print("entering start_background_thread")
            self.connection, self.channel = get_pika_connection_with_retries()
            if self.connection is None or self.channel is None:
                print("couldn't connect to pika, retrying ...")
                print("giving up. No more processing of tasks by this qworker")
                return
            self.channel.queue_declare(queue="host", durable=False, exclusive=False)
            self.channel.queue_declare(queue=self.my_id, durable=False, exclusive=False)
            self.channel.basic_consume(queue="host", auto_ack=True, on_message_callback=self.handle_delivery)
            self.channel.basic_consume(queue=self.my_id, auto_ack=True, on_message_callback=self.handle_delivery)
            print(' [*] Waiting for messages:')
            if self._hb_greenlet is None:
                self._hb_greenlet = gevent.spawn(self._heartbeat_loop)
            self.channel.start_consuming()
        except Exception as ex:
            debug_log("Couldn't start background thread")
            debug_log(self.handle_exception(ex, "Here's the error"))
        finally:
            self._stopping = True
            if self._hb_greenlet is not None:
                try:
                    self._hb_greenlet.kill(block=False)
                except Exception:
                    pass
                self._hb_greenlet = None

    def do_heartbeat(self):
        self.tile_registry.reconcile_tiles()
        self.tile_registry.publish_metrics()

    def user_to_true(self, user_path, user_obj):
        return re.sub("/mydisk", user_obj.pool_dir, user_path)

    def emit_status_message(self, message, user_id, timeout=4):
        data = {"message": message, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/main', room=user_id)

    def emit_clear_status(self, user_id):
        socketio.emit('clear-status-msg', {}, namespace='/main', room=user_id)

    @task_worthy
    def add_error_drawer_entry_task(self, data):
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=data["user_id"])


    def add_error_drawer_entry(self, title, content, user_id):
        data = {"title": title, "content": content}
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=user_id)

    def refresh_selector_list(self, user_id):
        socketio.emit("refresh-selector", {},
                      namespace='/main', room=user_id)

    def compress_file_in_place(self, source_file, user_id):
        source_dir = os.path.dirname(source_file)
        base_name = os.path.basename(source_file)
        output_archive = os.path.join(source_dir, f"{base_name}.tar.gz")
        command = ['tar', '-czf', output_archive, '-C', source_dir, base_name]
        self.emit_status_message(f"Started compression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_message(f"Finished compression", user_id)
        return

    def compress_directory_in_place(self, source_dir, user_id):
        base_name = os.path.basename(source_dir.rstrip('/'))
        parent_dir = os.path.dirname(source_dir.rstrip('/'))
        output_archive = os.path.join(parent_dir, f"{base_name}.tar.gz")
        command = ['tar', '-czf', output_archive, '-C', parent_dir, base_name]
        self.emit_status_message(f"Started compression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_message(f"Finished compression", user_id)
        return

    def decompress_archive_in_places(self, source_archive, user_id):
        source_dir = os.path.dirname(source_archive)
        command = ['tar', '-xzf', source_archive, '-C', source_dir]
        self.emit_status_message(f"Started decompression", user_id)
        process = subprocess.Popen(command)
        process.wait()
        self.emit_status_message(f"Finished decompression", user_id)
        return

    def get_user_from_data(self, data):
        is_repository = data.get("is_repository", False)
        if is_repository:
            return self.repository_user
        user_id = data.get("user_id", None)
        if user_id is None:
            raise MongoAccessException("No user_id provided in data")
        the_user = load_user(user_id)
        if the_user is None:
            raise MongoAccessException(f"User with id {user_id} not found")
        return the_user

    @task_worthy
    def get_handler_methods(self, data):
        from tactic_app import handler_methods
        print(str(handler_methods))
        return {"success": True, "handler_methods": handler_methods}

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
        result, local_id = delete_ready_block_participant(user_obj.username, rb_id, participant)
        if result:
            print("** all participants ready **")
            for pid in result:
                if pid == "local_id":
                    continue
                if pid == "client":
                    print(str(data))
                    socketio.emit("remove-ready-block", {local_id: local_id}, namespace='/main', room=local_id)
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
    def get_settings_object_settings(self, data):
        print("in get_settings_object_settings")
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        user_data = user_obj.user_data_dict
        setting_dict = {}
        for fdict in user_data_fields:
            if not fdict["settings_object"]:
                continue
            setting_dict[fdict["name"]] = user_data[fdict["name"]]
        return {"settings": setting_dict}

    @task_worthy
    def os_command_exec(self, data):
        the_code = data["the_code"]
        print(">> " + the_code)
        if the_code.startswith("cd "):
            path = the_code[3:].strip()
            try:
                os.chdir(os.path.abspath(path))
            except Exception:
                print(f"cd: no such file or directory: {path}")
        else:
            try:
                process = subprocess.Popen(the_code, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                           text=True)
                for line in process.stdout:
                    print(line, end="")
                for line in process.stderr:
                    print(line, end="", file=sys.stderr)
            except Exception as e:
                print(f"Error executing command: {e}")

    @task_worthy
    def destroy_a_users_containers(self, data):
        owned_tiles = self.tile_registry.get_owned_tiles(data["user_id"])
        for tile_id in owned_tiles:
            self.destroy_tile(tile_id)
        destroy_user_containers(data["user_id"], data["notify"])
        return {"success": True}

    @task_worthy
    def go_to_module_viewer_if_exists(self, data):
        user_id = data["user_id"]
        tile_type = data["tile_type"]
        matching_ids = get_matching_user_containers(user_id, "bsherin/tactic-module-viewer", tile_type)
        if len(matching_ids) == 0:
            return {"success": False}
        else:
            socketio.emit("focus-me", {"line_number": data["line_number"]}, namespace='/main', room=matching_ids[0])
            return {"success": True, "window_name": matching_ids[0]}

    @task_worthy
    def remove_mainwindow_task(self, data):
        local_id = data["local_id"]
        self.destroy_child_tiles(local_id)
        destroy_container(local_id, notify=False)
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

    @task_worthy_manual_submit
    def load_module_if_necessary(self, data, task_packet):

        def did_load(result_data):
            result_data["module_name"] = tile_module_name
            self.submit_response(task_packet, result_data)
            return

        user_id = data["user_id"]
        user_obj = load_user(user_id)
        tile_module_name = data["tile_module_name"]
        data["user_id"] = user_id
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
    def get_loaded_tile_code(self, data_dict):
        result = {}
        tile_info_dict = data_dict["tile_info_dict"]
        user_id = data_dict["user_id"]
        user_obj = load_user(user_id)
        for old_tile_id, tile_type in tile_info_dict.items():
            result[old_tile_id] = loaded_tile_management.get_tile_code(tile_type, user_obj.username)
        return result

    def update_selector_row(self, res_dict, the_user):
        socketio.emit("update-selector-row", res_dict,
                      namespace='/main', room=the_user.get_id())

    def update_repository_selector_row(self, res_dict):
        socketio.emit("update-repository-selector-row", res_dict,
                      namespace='/main', room="repository-events")

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

            user_obj = User.get_user_by_username(username)
            if event_type == "delete":
                doc_name = ""
                mdata = {}
                file_id = None
            else:
                doc = user_obj.get_resource_doc_from_id(res_type, _id)
                nfield = getattr(user_obj, f"{res_type}_name_field")
                doc_name = doc[nfield]
                if "metadata" in doc:
                    mdata = doc["metadata"]
                else:
                    mdata = {}
                file_id = doc.get("file_id", None)
            rdict = user_obj.build_res_dict(doc_name, mdata, file_id, res_type=data["res_type"], doc_id=str(_id))
            rdict["event_type"] = event_type
            self.update_selector_row(rdict, user_obj)
            if "mdata_uid" in mdata:
                mdata_uid = mdata["mdata_uid"]
            else:
                mdata_uid = ""
            socketio.emit("resource-updated", {
                "user_id": user_obj.get_id(),
                "res_type": res_type,
                "res_name": doc_name,
                "mdata_uid": mdata_uid
            }, namespace='/main', room=user_obj.get_id())
            if username == "repository":
                self.update_repository_selector_row(rdict)
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
        if self.tile_registry.tile_exists(container_id):
            self.destroy_tile(container_id, nfy)
        else:
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
            if self.tile_registry.tile_exists(container_id):
                self.destroy_tile(container_id, notify=False)
            else:
                destroy_container(container_id)
        return {"success": True}

    def get_tile_types(self, user_id):
        the_user = load_user(user_id)
        tile_types = loaded_tile_management.get_user_available_tile_types(the_user.username)
        icon_dict = {}
        for cat_types in tile_types.values():
            for ttype in cat_types:
                icon_dict[ttype] = the_user.get_tile_icon(ttype)
        return tile_types, icon_dict

    @task_worthy
    def get_tile_types_task(self, data):
        user_id = data["user_id"]
        tile_types, icon_dict = self.get_tile_types(user_id)
        return {"tile_types": tile_types, "icon_dict": icon_dict}

    @task_worthy
    def emit_table_message(self, data):
        from tactic_app import socketio
        socketio.emit("table-message", data, namespace='/main', room=data["local_id"])
        return {"success": True}

    @task_worthy
    def emit_console_message(self, data):
        from tactic_app import socketio
        socketio.emit("console-message", data, namespace='/main', room=data["local_id"])
        return {"success": True}

    @task_worthy
    def emit_to_client(self, data):
        from tactic_app import socketio
        if "room" in data:
            room = data["room"]
        else:
            room = data["local_id"]
            data["room"] = room
        if "namespace" in data:
            namespace = data["namespace"]
        else:
            namespace = "/main"
        print("about to do socketio.emit")
        socketio.emit(data["message"], data, namespace=namespace, room=room)

        return {"success": True}

    @task_worthy
    def emit_export_viewer_message(self, data):
        from tactic_app import socketio

        socketio.emit("export-viewer-message", data, namespace='/main', room=data["local_id"])
        return {"success": True}

    @task_worthy
    def print_to_console(self, data):
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
        the_user = self.get_user_from_data(data)
        uid = "copied_cell_" + data["user_id"]
        the_user.delete_temp_data(uid)
        the_user.store_temp_data({"console_items": data["console_items"]}, uid)
        return {"success": True}

    @task_worthy
    def get_copied_console_cells(self, data):
        uid = "copied_cell_" + data["user_id"]
        res_dict = current_user.read_temp_data(uid)
        if res_dict:
            for citem in res_dict["console_items"]:
                citem["unique_id"] = str(uuid.uuid4())
            return {"success": True, "console_items": res_dict["console_items"]}
        else:
            return {"success": False, "message": "No copied cell found"}

    @task_worthy
    def go_to_row_in_document(self, data):
        from tactic_app import socketio
        socketio.emit("change-doc", data, namespace='/main', room=data["local_id"])

    @task_worthy
    def emit_tile_message(self, data):
        from tactic_app import socketio
        socketio.emit("tile-message", data, namespace='/main', room=data["local_id"])
        return {"success": True}

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
        parent_id = data["parent_id"]
        user_id = data["user_id"]
        user = load_user(user_id)
        username = user.username
        openai_api_key = user.get_openai_api_key()
        assistant_id = create_assistant_container(openai_api_key, parent_id, user_id, username)
        return {"assistant_id": assistant_id}

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
                room = task_packet["global_id"]
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
        if tactic_app.host_worker.my_id == "host5000":  ## Only initiate checks from one host
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
        print(f"deregister_container with container_id {container_id}")
        if redis_ht.exists(container_id):
            print(f"deleting health data for container_id {container_id}")
            redis_ht.delete(container_id)
        else:
            print(f"no health data found for container_id {container_id}")

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
                    print(f"found an inactive container {k}")
                    cont_list.append(k)
                    continue
                if (current_time - self.created(k)) > old_container_time:
                    print("found an old container")
                    cont_list.append(k)
        for cont_id in cont_list:
            if tactic_app.host_worker.tile_registry.tile_exists(cont_id):
                tactic_app.host_worker.destroy_tile(cont_id, notify=True)
            else:
                destroy_container(cont_id)

tactic_app.health_tracker = HealthTracker()
tactic_app.host_worker = HostWorker()
tactic_app.host_worker.start()
