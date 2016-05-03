from qworker import QWorker, SHORT_SLEEP_PERIOD, LONG_SLEEP_PERIOD, task_worthy
from flask import jsonify, render_template
from flask_login import current_user, url_for
from users import load_user
import gevent
from communication_utils import send_request_to_container
from docker_functions import create_container, get_address, destroy_container
import shared_dicts
from tactic_app import app, socketio, mongo_uri, megaplex_address, use_ssl
from views.user_manage_views import tile_manager, project_manager
import uuid
import copy


class HostWorker(QWorker):
    def __init__(self, app, megaplex_address):
        QWorker.__init__(self, app, megaplex_address, "host")
        self.temp_dict = {}

    @task_worthy
    def main_project(self, data):
        user_id = data["user_id"]
        project_name = data["project_name"]
        user_manage_id = data["user_manage_id"]
        user_obj = load_user(user_id)
        main_id = create_container("tactic_main_image", network_mode="bridge")["Id"]
        caddress = get_address(main_id, "bridge")
        send_request_to_container(self.megaplex_address, "add_address", {"container_id": "main", "address": caddress})

        if user_obj.username not in shared_dicts.loaded_user_modules:
            shared_dicts.loaded_user_modules[user_obj.username] = []

        list_names = self.get_list_names({"user_id": user_obj.get_id()})["list_names"]

        with self.app.test_request_context():
            bf_url = url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]
        data_dict = {"project_name": project_name,
                     "project_collection_name": user_obj.project_collection_name,
                     "main_id": main_id,
                     "user_id": user_obj.get_id(),
                     "megaplex_address": self.megaplex_address,
                     "main_address": caddress,
                     "loaded_user_modules": shared_dicts.loaded_user_modules,
                     "mongo_uri": mongo_uri,
                     "list_names": list_names,
                     "user_manage_id": user_manage_id,
                     "base_figure_url": bf_url,
                     "use_ssl": use_ssl}

        result = send_request_to_container(caddress, "initialize_project_mainwindow", data_dict).json()
        socketio.emit('stop-spinner', {}, namespace='/user_manage', room=user_obj.get_id())
        if not result["success"]:
            raise Exception(result["message_string"])
        return None

    @task_worthy
    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_names}

    @task_worthy
    def get_loaded_user_modules(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)

        return {"loaded_modules": shared_dicts.loaded_user_modules[user_obj.username]}

    @task_worthy
    def load_modules(self, data):
        loaded_modules = data["loaded_modules"]
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        for module in loaded_modules:
            if module not in shared_dicts.loaded_user_modules[user_obj.username]:
                tile_manager.load_tile_module(module, return_json=False, user_obj=user_obj)
        return {"success": True}

    @task_worthy
    def update_project_selector_list(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        project_manager.update_selector_list(user_obj=user_obj)
        return {"success": True}

    @task_worthy
    def get_empty_tile_containers(self, data):
        cdict = {}
        for i in range(data["number"]):
            tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
            tile_container_address = get_address(tile_container_id, "bridge")
            cdict[tile_container_id] = tile_container_address
        return cdict

    @task_worthy
    def get_tile_code(self, tile_info_dict):
        result = {}
        for old_tile_id, tile_type in tile_info_dict.items():
            result[old_tile_id] = shared_dicts.get_tile_code(tile_type)
        return result

    @task_worthy
    def delete_container(self, data):
        container_id = data["container_id"]
        destroy_container(container_id)
        return {"success": True}

    @task_worthy
    def get_list(self, data):
        user_id = data["user_id"]
        list_name = data["list_name"]
        the_user = load_user(user_id)
        return {"the_list": the_user.get_list(list_name)}

    @task_worthy
    def get_tile_types(self, data):
        from tactic_app.shared_dicts import tile_classes, user_tiles
        tile_types = {}
        user_id = data["user_id"]
        the_user = load_user(user_id)
        for (category, the_dict) in tile_classes.items():
            tile_types[category] = the_dict.keys()

        if the_user.username in user_tiles:
            for (category, the_dict) in user_tiles[the_user.username].items():
                if category not in tile_types:
                    tile_types[category] = []
                tile_types[category] += the_dict.keys()
        result = {"tile_types": tile_types}
        return result

    @task_worthy
    def open_project_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = data["template_data"]
        template_data["template_name"] = "main.html"
        doc_names = template_data["doc_names"]
        # why is this fix needed here when I did it upstream?
        fixed_doc_names = [str(doc_name) for doc_name in doc_names]
        template_data["doc_names"] = fixed_doc_names
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/user_manage', room=data["user_manage_id"])
        return {"success": True}

    @task_worthy
    def open_error_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = copy.copy(data)
        template_data["template_name"] = "error_window_template.html"
        template_data["error_string"] = str(template_data["error_string"])
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/user_manage', room=data["user_manage_id"])
        return {"success": True}

    @task_worthy
    def open_log_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = copy.copy(data)
        template_data["template_name"] = "log_window_template.html"
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_table_message(self, data):
        from tactic_app import socketio
        socketio.emit("table-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_tile_message(self, data):
        from tactic_app import socketio
        socketio.emit("tile-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def create_tile_container(self, data):
        tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
        tile_address = get_address(tile_container_id, "bridge")
        return {"tile_id": tile_container_id, "tile_address": tile_address}

    @task_worthy
    def get_module_code(self, data):
        module_code = shared_dicts.get_tile_code(data["tile_type"])
        return {"module_code": module_code, "megaplex_address": self.megaplex_address}

    @task_worthy
    def render_tile(self, data):
        tile_id = data["tile_id"]
        form_html = data["form_html"]
        tname = data["tile_name"]
        with self.app.test_request_context():
            the_html = render_template("tile.html", tile_id=tile_id,
                                       tile_name=tname,
                                       form_text=form_html)
        ddict = data
        ddict["success"] = True
        ddict["html"] = the_html
        return ddict


    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        print error_string
        return

class ClientWorker(QWorker):
    def __init__(self, app, megaplex_address, socketio):
        QWorker.__init__(self, app, megaplex_address, "client")
        self.socketio = socketio

    def forward_client_post(self, task_packet):
        send_request_to_container(self.megaplex_address, "post_task", task_packet)
        return

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        print error_string
        return

    def _run(self):
        self.running = True
        while self.running:
            task_packet = self.get_next_task()
            if "empty" not in task_packet:
                if task_packet["callback_id"] is not None:
                    self.socketio.emit("handle-callback", task_packet, namespace='/main', room=task_packet["main_id"])
                else:
                    task_packet["table_message"] = task_packet["task_type"]
                    self.socketio.emit("table-message", task_packet, namespace='/main', room=task_packet["main_id"])
                gevent.sleep(SHORT_SLEEP_PERIOD)
            else:
                gevent.sleep(LONG_SLEEP_PERIOD)

host_worker = HostWorker(app, megaplex_address)
client_worker = ClientWorker(app, megaplex_address, socketio)
host_worker.start()
client_worker.start()