from qworker import QWorker
from flask import jsonify
from flask_login import current_user


class HostWorker(QWorker):
    def __init__(self, app, megaplex_address):
        QWorker.__init__(self, app, megaplex_address, "host")

    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return jsonify({"list_names": the_user.list_names})

    def delete_container(self, data):
        container_id = data["container_id"]
        destroy_container(container_id)
        return jsonify({"success": True})

    def get_list(self, data):
        user_id = data["user_id"]
        list_name = data["list_name"]
        the_user = load_user(user_id)
        return jsonify({"the_list": the_user.get_list(list_name)})

    def get_tile_types(self):
        tile_types = {}
        for (category, the_dict) in tile_classes.items():
            tile_types[category] = the_dict.keys()

        if current_user.username in user_tiles:
            for (category, the_dict) in user_tiles[current_user.username].items():
                if category not in tile_types:
                    tile_types[category] = []
                tile_types[category] += the_dict.keys()
        result = {"tile_types": tile_types}
        return jsonify(result)


class ClientWorker(QWorker):
    def __init__(self, app, megaplex_address, socketio):
        QWorker.__init__(self, app, megaplex_address, "client")
        self.socketio = socketio

    def forward_client_post(self, task_packet):
        send_request_to_container(self.megaplex_address, "post_task", task_packet)
        return

    def _run(self):
        self.running = True
        while self.running:
            task_packet = self.get_next_task()
            if not task_packet == "empty":
                if task_packet["response_data"] is not None:
                    self.socketio.emit("handle-callback", task_packet, namespace='/main', room=data["main_id"])
                else:
                    self.handle_event(task_packet)
            gevent.sleep(_sleepperiod)
