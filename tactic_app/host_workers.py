from qworker import QWorker, SHORT_SLEEP_PERIOD, LONG_SLEEP_PERIOD
from flask import jsonify, render_template
from flask_login import current_user
from users import load_user
import gevent
from communication_utils import send_request_to_container
from docker_functions import create_container, get_address
from shared_dicts import get_tile_code


class HostWorker(QWorker):
    def __init__(self, app, megaplex_address):
        QWorker.__init__(self, app, megaplex_address, "host")

    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_names}

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
                if task_packet["response_data"] is not None:
                    self.socketio.emit("handle-callback", task_packet, namespace='/main', room=task_packet["main_id"])
                else:
                    task_packet["table_message"] = task_packet["task_type"]
                    self.socketio.emit("table-message", task_packet, namespace='/main', room=task_packet["main_id"])
                gevent.sleep(SHORT_SLEEP_PERIOD)
            else:
                gevent.sleep(LONG_SLEEP_PERIOD)
