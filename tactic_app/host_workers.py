from qworker import QWorker, task_worthy
from flask import render_template
from flask_login import url_for
from users import load_user
import gevent
from communication_utils import send_request_to_megaplex
from docker_functions import create_container, destroy_container, destroy_child_containers, destroy_user_containers
from docker_functions import get_log, ContainerCreateError
from tactic_app import app, socketio, mongo_uri, use_ssl
from views.user_manage_views import tile_manager, project_manager, collection_manager
import tactic_app
import uuid
import copy
import traceback
import datetime

check_for_dead_time = 300
global_tile_manager = tactic_app.global_tile_manager

class HostWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.temp_dict = {}
        self.last_check_for_dead_containers = datetime.datetime.today()
        self.short_sleep_period = .01
        self.hibernate_time = .1
        self.gap_time_for_hiberate = 60

    @task_worthy
    def stop_user_manage_spinner(self, data):
        socketio.emit('stop-spinner', {}, namespace='/user_manage', room=data["user_manage_id"])

    def show_um_status_message(self, msg, user_manage_id, timeout=3):
        if timeout is None:
            data = {"message": msg}
        else:
            data = {"message": msg, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/user_manage', room=user_manage_id)

    def clear_um_status_message(self, user_manage_id):
        socketio.emit('clear-status-msg', {}, namespace='/user_manage', room=user_manage_id)

    @task_worthy
    def show_main_status_message(self, data):
        socketio.emit('show-status-msg', data, namespace='/main', room=data["main_id"])

    @task_worthy
    def clear_main_status_message(self, data):
        socketio.emit('clear-status-msg', {}, namespace='/main', room=data["main_id"])

    @task_worthy
    def show_um_status_message_task(self, data):
        socketio.emit('show-status-msg', data, namespace='/user_manage', room=data["user_manage_id"])

    @task_worthy
    def clear_um_status_message_task(self, data):
        socketio.emit('clear-status-msg', {}, namespace='/user_manage', room=data["user_manage_id"])

    @task_worthy
    def update_collection_selector_list(self, data):
        collection_manager.update_selector_list(user_obj=load_user(data["user_id"]))

    @task_worthy
    def main_project(self, data):
        user_id = data["user_id"]
        project_name = data["project_name"]
        user_manage_id = data["user_manage_id"]
        user_obj = load_user(user_id)
        # noinspection PyTypeChecker
        self.show_um_status_message("creating main container", user_manage_id, None)
        main_id, container_id = create_container("tactic_main_image", network_mode="bridge", owner=user_id)
        global_tile_manager.add_user(user_obj.username)

        list_names = self.get_list_names({"user_id": user_obj.get_id()})["list_names"]
        class_names = self.get_class_names({"user_id": user_obj.get_id()})["class_names"]
        function_names = self.get_function_tags_dict({"user_id": user_obj.get_id()})["function_names"]
        collection_names = self.get_collection_names({"user_id": user_obj.get_id()})["collection_names"]

        with app.test_request_context():
            bf_url = url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]

        data_dict = {"project_name": project_name,
                     "project_collection_name": user_obj.project_collection_name,
                     "loaded_user_modules": global_tile_manager.loaded_user_modules,
                     "mongo_uri": mongo_uri,
                     "list_names": list_names,
                     "class_names": class_names,
                     "function_names": function_names,
                     "collection_names": collection_names,
                     "user_manage_id": user_manage_id,
                     "base_figure_url": bf_url,
                     "use_ssl": use_ssl}

        # noinspection PyTypeChecker
        self.show_um_status_message("start initialize project", user_manage_id, None)
        result = self.post_and_wait(main_id, "initialize_project_mainwindow", data_dict)
        if not result["success"]:
            destroy_container(main_id)
            raise Exception(result["message"])

        return None

    @task_worthy
    def destroy_a_users_containers(self, data):
        destroy_user_containers(data["user_id"])
        return {"success": True}

    @task_worthy
    def remove_mainwindow_task(self, data):
        main_id = data["main_id"]
        destroy_child_containers(main_id)
        destroy_container(main_id)
        return {"success": True}

    @task_worthy
    def get_container_log(self, data):
        container_id = data["container_id"]
        return {"success": True, "log_text": get_log(container_id)}


    @task_worthy
    def get_full_collection_name(self, data):
        user_id = data["user_id"]
        collection_name = data["collection_name"]
        the_user = load_user(user_id)
        return {"full_collection_name": the_user.build_data_collection_name(collection_name)}

    @task_worthy
    def get_lists_classes_functions(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_tags_dict,
                "class_names": the_user.class_tags_dict,
                "function_names": the_user.function_tags_dict,
                "collection_names": the_user.data_collection_tags_dict}

    @task_worthy
    def get_list_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"list_names": the_user.list_names}

    @task_worthy
    def get_collection_names(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"collection_names": the_user.data_collections}

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

    @task_worthy
    def get_loaded_user_modules(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return {"loaded_modules": global_tile_manager.loaded_user_modules[user_obj.username]}

    @task_worthy
    def load_modules(self, data):
        loaded_modules = data["loaded_modules"]
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        for module in loaded_modules:
            if module not in global_tile_manager.loaded_user_modules[user_obj.username]:
                result = tile_manager.load_tile_module(module, return_json=False, user_obj=user_obj)
                if not result["success"]:
                    template = "Error loading module {}\n" + result["message"]
                    raise Exception(template.format(module))
        return {"success": True}

    @task_worthy
    def update_project_selector_list(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        project_manager.update_selector_list(user_obj=user_obj)
        return {"success": True}

    @task_worthy
    def get_tile_code(self, data_dict):
        result = {}
        tile_info_dict = data_dict["tile_info_dict"]
        user_id = data_dict["user_id"]
        for old_tile_id, tile_type in tile_info_dict.items():
            result[old_tile_id] = global_tile_manager.get_tile_code(tile_type, user_id)
        return result

    @task_worthy
    def get_project_names(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        return {"project_names": user_obj.project_names}

    @task_worthy
    def delete_container(self, data):
        container_id = data["container_id"]
        destroy_container(container_id)
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
        tile_types = {}
        user_id = data["user_id"]
        the_user = load_user(user_id)
        result = {"tile_types": global_tile_manager.get_user_available_tile_types(the_user.username)}
        return result

    # tactic_todo should clear temp_dict entry after use?
    @task_worthy
    def open_project_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = data["template_data"]
        template_data["template_name"] = "main.html"
        template_data["uses_codemirror"] = "True"
        if data["doc_type"] == "table":
            template_data["is_table"] = True
        else:
            template_data["is_freeform"] = True
        doc_names = template_data["doc_names"]
        # why is this fix needed here when I did it upstream?
        fixed_doc_names = [str(doc_name) for doc_name in doc_names]
        fixed_doc_names.sort()
        template_data["doc_names"] = fixed_doc_names
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/user_manage', room=data["user_manage_id"])
        socketio.emit('stop-spinner', {}, namespace='/user_manage', room=data["user_manage_id"])
        return {"success": True}

    # tactic_todo I'm in the middle of figuring out how to do this send_file_to_client
    # currently I'm thinking I'll do it with something like the temp page loading
    # @task_worthy
    # def send_file_to_client(self, data):
        # from tactic_app import socketio
        # str_io = cPickle.loads(data["encoded_str_io"]).decode("utf-8", "ignore").encode("ascii")

    @task_worthy
    def open_error_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = copy.copy(data)
        template_data["template_name"] = "error_window_template.html"
        template_data["error_string"] = str(template_data["error_string"])
        template_data["uses_codemirror"] = "True"
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/user_manage', room=data["user_manage_id"])
        socketio.emit('stop-spinner', {}, namespace='/user_manage', room=data["user_manage_id"])
        return {"success": True}

    @task_worthy
    def open_log_window(self, data):
        from tactic_app import socketio
        unique_id = str(uuid.uuid4())
        template_data = copy.copy(data)
        template_data["template_name"] = "log_window_template.html"
        template_data["uses_codemirror"] = "True"
        self.temp_dict[unique_id] = template_data
        socketio.emit("window-open", {"the_id": unique_id}, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_table_message(self, data):
        from tactic_app import socketio

        socketio.emit("table-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def emit_export_viewer_message(self, data):
        from tactic_app import socketio

        socketio.emit("export-viewer-message", data, namespace='/main', room=data["main_id"])
        return {"success": True}

    @task_worthy
    def print_to_console(self, data):
        from tactic_app import app, socketio
        with app.test_request_context():
            data["message_string"] = render_template("log_item.html", log_item=data["message_string"])

        data["table_message"] = "consoleLog"
        self.emit_table_message(data)
        return {"success": True}

    @task_worthy
    def request_render(self, data):
        with app.test_request_context():
            render_result = render_template(data["template"], **data["render_fields"])
        return {"success": True, "render_result": render_result}

    @task_worthy
    def print_code_area_to_console(self, data):
        from tactic_app import socketio
        with app.test_request_context():
            data["message_string"] = render_template("code_log_item.html", unique_id=data["unique_id"])

        data["table_message"] = "consoleLog"
        self.emit_table_message(data)
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
    def create_tile_container(self, data):
        try:
            tile_container_id, container_id = create_container("tactic_tile_image", network_mode="bridge",
                                                               owner=data["user_id"],
                                                               parent=data["parent"])
        except ContainerCreateError:
            print "Error creating tile container"
            return {"success": False, "message": "Error creating empty tile container."}
        return {"success": True, "tile_id": tile_container_id}

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
        module_code = global_tile_manager.get_tile_code(data["tile_type"], data["user_id"])
        return {"module_code": module_code}

    @task_worthy
    def get_module_from_tile_type(self, data):
        user_obj = load_user(data["user_id"])
        module_name = global_tile_manager.get_module_from_type(user_obj.username, data["tile_type"])
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

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        print error_string
        return

    def clear_stale_containers(self):
        res = send_request_to_megaplex("get_old_inactive_stalled_containers").json()
        cont_list = res["old_inactive_stalled_containers"]
        for cont_id in cont_list:
            destroy_container(cont_id)

    def special_long_sleep_function(self):
        current_time = datetime.datetime.today()
        tdelta = current_time - self.last_check_for_dead_containers
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        if delta_seconds > check_for_dead_time:
            self.last_check_for_dead_containers = current_time
            self.clear_stale_containers()


class ClientWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.my_id = "client"
        self.short_sleep_period = .01
        self.hibernate_time = .1
        self.gap_time_for_hiberate = 60

    def forward_client_post(self, task_packet):
        send_request_to_megaplex("post_task", task_packet)
        return

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string += traceback.format_exc()
        print error_string
        return

    def _run(self):
        self.running = True
        while self.running:
            try:
                task_packet = self.get_next_task()
            except Exception as ex:
                special_string = "Error in get_next_task for my_id {}".format(self.my_id)
                self.handle_exception(ex, special_string)
            if "empty" not in task_packet:
                if task_packet["callback_id"] is not None:
                    socketio.emit("handle-callback", task_packet, namespace='/main', room=task_packet["main_id"])
                else:
                    task_packet["table_message"] = task_packet["task_type"]
                    socketio.emit("table-message", task_packet, namespace='/main', room=task_packet["main_id"])
                self.last_contact = datetime.datetime.now()
                gevent.sleep(self.short_sleep_period)
            else:
                self.special_long_sleep_function()
                current_time = datetime.datetime.today()
                tdelta = current_time - self.last_contact
                delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
                if delta_seconds > self.gap_time_for_hiberate:
                    gevent.sleep(self.hibernate_time)
                else:
                    gevent.sleep(self.short_sleep_period)

tactic_app.host_worker = HostWorker()
tactic_app.client_worker = ClientWorker()
tactic_app.host_worker.start()
tactic_app.client_worker.start()