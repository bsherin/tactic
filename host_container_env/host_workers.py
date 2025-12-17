from qworker import QWorker, task_worthy, task_worthy_manual_submit, current_timestamp, debug_log
from flask import render_template, url_for
from flask_login import current_user

from users import load_user, user_data_fields, User
import gevent
from bson import ObjectId
from communication_utils import make_python_object_jsonizable
from communication_utils import make_jsonizable_and_compress
import docker_functions
from docker_functions import destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, restart_container, container_exists
from docker_functions import get_matching_user_containers, get_container, get_user_assistant
from tactic_app import app, socketio
from redis_tools import redis_client
import datetime
from mongo_accesser import bytes_to_string, MongoAccessException
import tactic_app
import uuid
import sys
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
from rabbit_admin import delete_wait_queues
from ecs_tile_backend import ECSTileBackend
from docker_tile_backend import DockerTileBackend
from registries import TileContainerRegistry, MainContainerRegistry, ModuleViewerRegistry, publish_queue_metrics
from client_session import ClientSessionRegistry
from tile_container_management_mixin import TileContainerManagementMixin
from redis_tools import RedisManager, redis_client
from loaded_tile_management import loaded_tile_manager
from aws_helpers import get_ssm_parameter
from aws_detection import on_aws

loaded_tile_manager.delete_all()

use_s3 = get_ssm_parameter("USE_S3", "true").lower() == "true"

utility_interval = int(get_ssm_parameter("HOST_UTILITY_INTERVAL_SECS", 60))
publishing_interval = int(get_ssm_parameter("METRIC_PUBLISH_INTERVAL_SECS", 180))

if use_s3:
    from pool_backend_ecs import PoolBackendECS
else:
    from pool_backend import PoolBackend

myport = os.environ.get("MYPORT")

class HostUtilityWorker:
    def __init__(self, worker):
        self.worker = worker
        self.connection, self.channel = get_pika_connection_with_retries()
        self.utility_interval = int(get_ssm_parameter("HOST_UTILITY_INTERVAL_SECS", 60))
        self.initial_utility_interval = 5
        self.last_publish = time.time()
        self.last_global_ids = []

    def utility_loop(self):
        while True:
            self.do_utilities()
            if self.worker.tile_registry.reconciled_tiles:
                interval = self.utility_interval
            else:
                interval = self.initial_utility_interval
            time.sleep(interval)

    def do_utilities(self):
        if self.worker.channel is None:
            print("pika channel not ready yet in do_utilities")
            return
        self.worker.client_session_registry.registry_heartbeat()
        self.worker.main_registry.registry_heartbeat()
        self.worker.module_viewer_registry.registry_heartbeat()

        self.worker.publish_metrics()
        current_gobal_ids = self.worker.client_session_registry.get_open_sessions()
        if not current_gobal_ids == self.last_global_ids:
            self.last_global_ids = current_gobal_ids
            self.worker.post_task("main_service", "updated_global_ids", {"global_ids": self.last_global_ids})
            self.worker.post_task("module_viewer", "updated_global_ids", {"global_ids": self.last_global_ids})
            self.worker.post_task("assistant", "updated_global_ids", {"global_ids": self.last_global_ids})
        self.worker.tile_registry.registry_heartbeat()

    def start(self):
        socketio.start_background_task(target=self.utility_loop)


class HostWorker(QWorker, ListTasksMixin, CodeTasksMixin, TileTasksMixin, UserTasksMixin,ContainerTasksMixin,
                 ProjectTasksMixin, CollectionTasksMixin, MetabookTasksMixin, PoolTasksMixin, AccountTasksMixin,
                 AcrossAccountsTasksMixin, HigherMongoTasksMixin, TileContainerManagementMixin):
    def __init__(self):
        my_id = "host" + str(myport)
        QWorker.__init__(self, service_name="host", special_id=my_id)
        self.repository_user = User.get_user_by_username("repository")
        self.tile_registry = TileContainerRegistry(self, delete_all=True)
        self.main_registry = MainContainerRegistry(self)
        self.module_viewer_registry = ModuleViewerRegistry(self)
        self.client_session_registry = ClientSessionRegistry(self)
        self.last_publish = -99

        if on_aws:
            self.tile_backend = ECSTileBackend(self.tile_registry, self)
            self.pool_backend = PoolBackendECS()
        else:
            self.tile_backend = DockerTileBackend(self.tile_registry, self)
            self.pool_backend = PoolBackendECS()


        if self.my_id == "host5000":
            self.clear_session_storage()
            delete_wait_queues()
            self.publish_metrics()

    def publish_metrics(self):
        now = time.time()
        if (now - self.last_publish) > publishing_interval:
            publish_queue_metrics()
            self.last_publish = now

    @staticmethod
    def pull_queue_count():
        v = redis_client.get("metric:queue_count")
        if v:
            return int(v)
        else:
            return 0

    @task_worthy
    def get_queue_count(self, data):
        admin_user = self.get_user_from_data(data)
        if not admin_user.username == "admin":
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        publish_queue_metrics()
        val = self.pull_queue_count()
        return {"success": True, "target_value": val}

    @staticmethod
    def user_to_true(user_path, user_obj):
        return re.sub("/mydisk", user_obj.pool_dir, user_path)

    @staticmethod
    def emit_status_message(message, user_id, timeout=4):
        data = {"status_message": message, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/main', room=user_id)

    @staticmethod
    def emit_clear_status(user_id):
        socketio.emit('clear-status-msg', {}, namespace='/main', room=user_id)

    @staticmethod
    def clear_session_storage():
        from session_store_s3 import SessionStoreS3
        ss = SessionStoreS3()
        ss.end_all_sessions()
        return

    @task_worthy
    def add_error_drawer_entry_task(self, data):
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=data["user_id"])

    @staticmethod
    def add_error_drawer_entry(title, content, user_id):
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
    def get_openai_api_key(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        key = user_obj.get_openai_api_key()
        return {"success": True, "api_key": key}

    @task_worthy
    def get_module_from_type_task(self, data):
        username = data["username"]
        tile_type = data["tile_type"]
        module_name = loaded_tile_manager.get_module_from_type(username, tile_type)
        return {"success": True, "module_name": module_name}

    @task_worthy
    def get_handler_methods(self, data):
        from tactic_app import handler_methods
        print(str(handler_methods))
        return {"success": True, "handler_methods": handler_methods}

    @task_worthy
    def register_tile_heartbeat(self, data):
        tile_id = data["tile_id"]
        self.tile_registry.register_tile_heartbeat(tile_id)

    @task_worthy
    def register_client_interaction(self, data):
        global_id = data["global_id"]
        self.client_session_registry.register_client_interaction(global_id)

    @task_worthy
    def set_user_theme(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return user_obj.update_account({"theme": data["theme"]})

    @task_worthy
    def get_settings_object_settings(self, data):
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
        if data["tile_module_name"] in loaded_tile_manager.get_loaded_user_modules(user_obj.username):
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

        if data["tile_type"] in loaded_tile_manager.get_available_tile_types(username):
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
            result[old_tile_id] = loaded_tile_manager.get_tile_code(tile_type, user_obj.username)
        return result

    def update_selector_row(self, res_dict, the_user):
        socketio.emit("update-selector-row", res_dict,
                      namespace='/main', room=the_user.get_id())

    def update_repository_selector_row(self, res_dict):
        socketio.emit("update-repository-selector-row", res_dict,
                      namespace='/main', room="repository-events")

    @task_worthy
    def mongo_event(self, data):
        try:
            event_type = data["event_type"]
            username = data["username"]
            res_type = data["res_type"]
            if res_type == "user":
                return {"success": True}
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
    def delete_container(self, data):
        container_id = data["container_id"]

        if "notify" in data:
            nfy = data["notify"]
        else:
            nfy = True
        if self.tile_registry.exists(container_id):
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
            if self.tile_registry.exists(container_id):
                self.destroy_tile(container_id, notify=False)
            else:
                destroy_container(container_id)
        return {"success": True}

    def get_tile_types(self, user_id):
        the_user = load_user(user_id)
        tile_types = loaded_tile_manager.get_categorized_available_tile_types(the_user.username)
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
        socketio.emit(data["message"], data, namespace=namespace, room=room)

        return {"success": True}

    @task_worthy
    def emit_export_viewer_message(self, data):
        from tactic_app import socketio

        socketio.emit("export-viewer-message", data, namespace='/main', room=data["local_id"])
        return {"success": True}

    @task_worthy
    def get_api_dict_task(self, data):
        from integrated_docs import api_dict_by_category, api_dict_by_name, ordered_api_categories
        from integrated_docs import object_api_dict_by_category, ordered_object_categories
        return {"success": True, "api_dict_by_name": api_dict_by_name,
                        "api_dict_by_category": api_dict_by_category,
                        "ordered_api_categories": ordered_api_categories,
                        "object_api_dict_by_category": object_api_dict_by_category,
                        "ordered_object_categories": ordered_object_categories}

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
    def get_open_client_sessions_task(self, data):
        open_client_sessions = self.client_session_registry.get_open_client_sessions()
        return {"success": True, "open_sessions": open_client_sessions}

    @task_worthy
    def end_client_session_task(self, data):
        global_id = data["global_id"]
        self.end_client_session(global_id, False)

    def end_client_session(self, global_id, emit=True):
        if emit:
            socketio.emit("endSession", {}, namespace='/main', room=global_id)
        self.client_session_registry.delete(global_id)
        self.post_task("module_viewer", "client_session_ended", {"global_id": global_id})
        self.post_task("main_service", "client_session_ended", {"global_id": global_id})

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
            if not self.channel:
                return
            self.post_packet(dest_id, task_packet, reply_to="host", callback_id=task_packet["callback_id"])
        return

    def handle_event(self, task_packet):
        super(HostWorker, self).handle_event(task_packet)
        return

    def handle_response(self, task_packet):
        if "client_post" in task_packet:
            self.handle_client_response(task_packet)
        else:
            super(HostWorker, self).handle_response(task_packet)

    def handle_client_response(self, task_packet):
        print("Handling client response for task type {}".format(task_packet["task_type"]))
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

print("creating host worker")
tactic_app.host_worker = HostWorker()
tactic_app.utility_worker = HostUtilityWorker(tactic_app.host_worker)
print("starting host worker")
tactic_app.host_worker.start()
tactic_app.utility_worker.start()
