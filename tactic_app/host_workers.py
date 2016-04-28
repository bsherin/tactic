from qworker import QWorker, SHORT_SLEEP_PERIOD, LONG_SLEEP_PERIOD
from flask import jsonify, render_template
from flask_login import current_user, url_for
from users import load_user
import gevent
from communication_utils import send_request_to_container
from docker_functions import create_container, get_address, destroy_container
from shared_dicts import get_tile_code, loaded_user_modules
from tactic_app import app, socketio, mongo_uri, megaplex_address, use_ssl
from views.user_manage_views import tile_manager, project_manager
import uuid


class HostWorker(QWorker):
    def __init__(self, app, megaplex_address):
        QWorker.__init__(self, app, megaplex_address, "host")
        self.temp_dict = {}

    def main_project(self, data):
        user_id = data["user_id"]
        project_name = data["project_name"]
        user_manage_id = data["user_manage_id"]
        user_obj = load_user(user_id)
        main_id = create_container("tactic_main_image", network_mode="bridge")["Id"]
        caddress = get_address(main_id, "bridge")
        send_request_to_container(self.megaplex_address, "add_address", {"container_id": "main", "address": caddress})

        if user_obj.username not in loaded_user_modules:
            loaded_user_modules[user_obj.username] = []

        list_names = self.get_list_names({"user_id": user_obj.get_id()})["list_names"]

        with self.app.test_request_context():
            bf_url = url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]
        data_dict = {"project_name": project_name,
                     "project_collection_name": user_obj.project_collection_name,
                     "main_id": main_id,
                     "user_id": user_obj.get_id(),
                     "megaplex_address": self.megaplex_address,
                     "main_address": caddress,
                     "loaded_user_modules": loaded_user_modules,
                     "mongo_uri": mongo_uri,
                     "list_names": list_names,
                     "user_manage_id": user_manage_id,
                     "base_figure_url": bf_url,
                     "use_ssl": use_ssl}

        send_request_to_container(caddress, "initialize_project_mainwindow", data_dict)

        return None

    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_names}

    def get_loaded_user_modules(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)

        return {"loaded_modules": loaded_user_modules[user_obj.username]}

    def load_modules(self, data):
        loaded_modules = data["loaded_modules"]
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        for module in loaded_modules:
            if module not in loaded_user_modules[user_obj.username]:
                tile_manager.load_tile_module(module, return_json=False, user_obj=user_obj)
        return {"success": True}

    def update_project_selector_list(self, data):
        # todo xx left off here. user_id is needed downstream it will be evident (or user_obj)
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        project_manager.update_selector_list(user_obj=user_obj)
        return {"success": True}

    def get_empty_tile_containers(self, data):
        cdict = {}
        for i in range(data["number"]):
            tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
            tile_container_address = get_address(tile_container_id, "bridge")
            cdict[tile_container_id] = tile_container_address
        return cdict

    def get_tile_code(self, tile_info_dict):
        result = {}
        for old_tile_id, tile_type in tile_info_dict.items():
            result[old_tile_id] = get_tile_code(tile_type)
        return result

    def delete_container(self, data):
        container_id = data["container_id"]
        destroy_container(container_id)
        return {"success": True}

    def get_list(self, data):
        user_id = data["user_id"]
        list_name = data["list_name"]
        the_user = load_user(user_id)
        return {"the_list": the_user.get_list(list_name)}

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

    def open_project_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = data["template_data"]
        doc_names = template_data["doc_names"]
        # todo why is this fix needed here when I did it upstream?
        fixed_doc_names = [str(doc_name) for doc_name in doc_names]
        template_data["doc_names"] = fixed_doc_names
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/user_manage', room=data["user_manage_id"])
        return {"success": True}

    def emit_table_message(self, data):
        from tactic_app import socketio
        socketio.emit("table-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    def emit_tile_message(self, data):
        from tactic_app import socketio
        socketio.emit("tile-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    def create_tile_container(self, data):
        tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
        tile_address = get_address(tile_container_id, "bridge")
        return {"tile_id": tile_container_id, "tile_address": tile_address}

    def get_module_code(self, data):
        module_code = get_tile_code(data["tile_type"])
        return {"module_code": module_code, "megaplex_address": self.megaplex_address}

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

    def create_tile_request(self, data_dict):
        def load_source_callback(data):
            def create_tile_callback(ldata_dict):
                tile_id = ldata_dict["tile_id"]
                form_html = ldata_dict["form_html"]
                tname = data_dict["tile_name"]
                the_html = render_template("tile.html", tile_id=tile_id,
                                           tile_name=tname,
                                           form_text=form_html)
                ddict = copy.copy(ldata_dict)
                ddict["success"] = True
                ddict["html"] = the_html
                ddict["tile_id"] = tile_id
                return ddict

            data_dict["tile_id"] = tile_container_id
            data_dict["tile_container_address"] = tile_container_address
            send_request_to_container(main_id, "create_tile_instance",
                                      data_dict, callback=create_tile_callback)
            return jsonify({"success": True})

        main_id = data_dict["main_id"]
        tile_type = data_dict["tile_type"]
        try:
            tile_container_id = create_container("tactic_tile_image", network_mode="bridge")["Id"]
            module_code = get_tile_code(tile_type)
            self.post_task(tile_container_id,
                           "load_source",
                           {"tile_code": module_code, "megaplex_address": megaplex_address},
                           load_source_callback)
        except:
            error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return {"success": False}


class ClientWorker(QWorker):
    def __init__(self, app, megaplex_address, socketio):
        QWorker.__init__(self, app, megaplex_address, "client")
        self.socketio = socketio

    def forward_client_post(self, task_packet):
        send_request_to_container(self.megaplex_address, "post_task", task_packet)
        return

    # def emit_table_message(self, data):
    #     from tactic_app import socketio
    #     socketio.emit("table-message", data, namespace='/main', room=data["main_id"])
    #     return {"success": True}

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