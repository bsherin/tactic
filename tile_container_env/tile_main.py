
import os

import json
import base64
from flask import Flask
import exception_mixin
from exception_mixin import ExceptionMixin
from threading import Lock
import threading
import copy
from qworker_alt import QWorker, task_worthy, debug_log, add_qw_pika_connection, close_connection
from qworker_alt import simple_uid
import tile_env
from tile_env import class_info
from tile_env import exec_tile_code
import tile_base
import document_object
import remote_tile_object
from tile_base import clear_and_exec_user_code, TileBase
import library_object
import settings_object
from communication_utils import make_python_object_jsonizable
import uuid
from rabbit_manage import sleep_until_rabbit_alive
import sys, os
import time
import widgets
import requests

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

sys.stdout = sys.stderr
print("Waiting for rabbit")
success = sleep_until_rabbit_alive()
print("Done waiting for rabbit with success " + str(success))

kill_thread = None
kill_thread_lock = Lock()

from pseudo_tile_base import PseudoTileClass
import pseudo_tile_base

def resolve_task_identity():
    # Try env first (some setups inject it)
    arn = os.getenv("ECS_TASK_ARN")

    # Fallback to the ECS task metadata endpoint
    if not arn:
        uri = os.getenv("ECS_CONTAINER_METADATA_URI_V4") or os.getenv("ECS_CONTAINER_METADATA_URI")
        if uri:
            try:
                data = requests.get(f"{uri}/task", timeout=2).json()
                arn = data.get("TaskARN")
            except Exception:
                arn = None

    if arn:
        return arn, f'tile_{arn.split("/")[-1]}'
    # Local/dev fallback
    fallback_id = os.getenv("MY_ID") or f"tile_local-{os.getpid()}"
    return None, fallback_id

# noinspection PyUnusedLocal,PyProtectedMember,PyMissingConstructor
class KillWorker(QWorker):
    def __init__(self):
        self.my_id = "kill_" + tile_base._tworker.my_id
        return

    def handle_delivery(self, channel, method, props, body):
        channel.basic_ack(delivery_tag=method.delivery_tag)
        try:
            task_packet = json.loads(body)
            if task_packet["task_type"] == "StopMe":
                tile_base._tworker.emit_tile_message("stopSpinner")
                tile_base._tworker.interrupt_and_restart()
            if task_packet["task_type"] == "restart":
                os.execv(sys.executable, [sys.executable, "-u", "tile_main.py"])

        except Exception as ex:
            special_string = "Got error in kill handle delivery"
            debug_log(special_string)
            debug_log(self.handle_exception(ex, special_string))
        return

    def start(self):
        print("starting kill_thread")
        global kill_thread
        with kill_thread_lock:
            if kill_thread is None:
                kill_thread = threading.Thread(target=self.start_background_thread, name=simple_uid())
                kill_thread.start()
                debug_log('Background kill_thread started')

# noinspection PyProtectedMember,PyUnusedLocal
class TileWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.tile_instance = None
        tile_env.Tile = None
        widgets.Tile = None
        widgets.in_pseudo_tile = False
        self.get_megaplex_task_now = False
        self.use_svg = True
        self.generate_heartbeats = True
        self.my_arn, self.my_id = resolve_task_identity()

    @task_worthy
    def restart(self, data):
        os.execv(sys.executable, [sys.executable, "-u", "tile_main.py"])

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["local_id"] = self.tile_instance.sid
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def post_and_wait_to_main(self, msg_type, task_data):
        task_data["sid"] = self.tile_instance.sid
        return self.post_and_wait("main_service", msg_type, task_data)

    def post_to_main(self, task_type, task_data=None, callback_func=None,
                     callback_data=None, expiration=None, error_handler=None, special_reply_to=None):
        task_data["sid"] = self.tile_instance.sid
        self.post_task("main_service", task_type, task_data, callback_func,
                       callback_data, expiration, error_handler, special_reply_to)

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["tile_message"] = message
        data["tile_id"] = self.my_id
        self.ask_host("emit_tile_message", data)
        return

    def emit_to_client(self, message, data):
        data["message"] = message
        data["local_id"] = self.tile_instance.sid
        self.ask_host("emit_to_client", data)

    def send_error_entry(self, title, content, line_number):
        data = {"message": "add-error-drawer-entry",
                "title": title,
                "content": content,
                "line_number": line_number,
                "tile_type": self.tile_instance.tile_type,
                "room": self.tile_instance.user_id}
        self.emit_to_client("add-error-drawer-entry", data)
        return {"success": True}

    def handle_exception(self, ex, special_string=None):
        error_string = self.get_traceback_message(ex)
        summary = "Exception of type {}".format(type(ex).__name__)
        print(error_string)
        return {"success": False, "message": error_string, "summary": summary}

    @task_worthy
    def load_source(self, data_dict):
        tile_code = data_dict["tile_code"]
        result = exec_tile_code(tile_code)
        return result

    @task_worthy
    def get_options(self, data_dict):
        try:
            the_class = class_info["tile_class"]
            self.tile_instance = the_class(0, 0)
            tile_env.Tile = self.tile_instance
            opt_dict = self.tile_instance.options
            export_list = self.tile_instance.exports
            if len(export_list) > 0:
                if not isinstance(export_list[0], dict):  # legacy old exports specified as list of strings
                    export_list = [{"name": exp, "tags": ""} for exp in export_list]
        except Exception as ex:
            return self.handle_exception(ex, "Error extracting options from source")
        return {"success": True, "opt_dict": opt_dict, "export_list": export_list}

    # This should only be used in the tester tile.
    @task_worthy
    def clear_and_load_code(self, data_dict):
        try:
            the_code = data_dict["the_code"]
            result = clear_and_exec_user_code(the_code)
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return result

    @task_worthy
    def load_source_and_recreate(self, data):
        print("in load_source_and_recreate")
        result = self.load_source(data)
        self.set_environ_from_creds(data["creds"])
        if not result["success"]:
            print("didn't load successfully")
            print("message " + result["message"])
            return {"success": False, "tile_save_dict": data["tile_save_dict"]}
        return self.recreate_from_save(data["tile_save_dict"])

    @task_worthy
    def load_source_and_reinstantiate(self, data):
        self.set_environ_from_creds(data["creds"])
        result = self.load_source(data)
        if not result["success"]:
            print("didn't load successfully")
            print("message " + result["message"])
            return {"success": False, "message": result["message"],}
        return self.reinstantiate_tile(data["reload_dict"])

    @task_worthy
    def recreate_from_save(self, data):
        try:
            print("in recreate_from_save in tile_main")
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            tile_env.Tile = self.tile_instance
            widgets.Tile = self.tile_instance
            widgets.in_pseudo_tile = self.tile_instance.in_pseudo_tile
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.recreate_from_save(data)
            self.tile_instance.base_figure_url = data["new_base_figure_url"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            if self.tile_instance.doc_type in ["table", "freeform"]:
                document_object.Collection.__fully_initialize__()
        except Exception as ex:
            result = self.handle_exception(ex, "Error loading source in tile_main recreate from save")
        return {"success": True,
                "is_shrunk": self.tile_instance.is_shrunk,
                "saved_size": self.tile_instance.full_tile_height,
                "exports": self.tile_instance.get_export_type_info(),
                "tile_name": self.tile_instance.tile_name,
                "reload_dict": self.get_reload_dict(),
                "is_d3": self.tile_instance.is_d3}

    @task_worthy
    def get_image(self, data_dict):
        try:
            encoded_img = make_python_object_jsonizable(self.tile_instance.img_dict[data_dict["figure_name"]])
            return {"success": True, "img": encoded_img}
        except Exception as ex:
            return self.handle_exception(ex, "Error getting image")

    @task_worthy
    def get_image_data_string(self, data_dict):
        byte_array = self.tile_instance.img_dict[data_dict["figure_name"]]
        base_64_str = base64.b64encode(byte_array).decode('utf-8')
        return {"success": True, "image_str": "data:image/png;base64, " + base_64_str}

    def extract_option_names(self, opt_dict):
        opt_names = []
        for opt in opt_dict:
            opt_names.append(opt["name"])
        return opt_names

    @task_worthy
    def kill_me(self, data):
        try:
            self.connection.close()
            kill_worker.connection.close()
        except:
            print("got error in kill me closing connections. exiting anyway")
        sys.exit()

    @task_worthy
    def get_reload_info(self, data):
        return {"success": True,
                "reload_dict": self.get_reload_dict()}

    def get_reload_dict(self):
        tile_type = self.tile_instance.tile_type
        reload_attrs = self.tile_instance._current_reload_attrs
        current_options = self.tile_instance._current_options
        reload_attrs.update(current_options)
        reload_attrs["old_option_names"] = list(current_options.keys())
        reload_attrs["original_option_names"] = [opt["name"] for opt in self.tile_instance.options]
        return reload_attrs

    def send_updated_reload_dict(self):
        self.post_task("main_service", "update_reload_dict",
                       {"tile_id": self.my_id,
                        "sid": self.tile_instance.sid,
                        "reload_dict": self.get_reload_dict()})
        return

    @task_worthy
    def reinstantiate_tile(self, reload_dict):
        try:
            self.tile_instance = class_info["tile_class"](None, None, tile_name=reload_dict["tile_name"])
            tile_env.Tile = self.tile_instance
            widgets.Tile = self.tile_instance
            widgets.in_pseudo_tile = self.tile_instance.in_pseudo_tile
            self.handler_instances["tilebase"] = self.tile_instance
            old_option_names = reload_dict["old_option_names"]
            del reload_dict["old_option_names"]
            new_option_names = self.extract_option_names(self.tile_instance.options)
            options_changed = not set(new_option_names) == set(old_option_names)
            if options_changed:  # Have to deal with case where an option no longer exists and shouldn't be copied
                attr_list = list(reload_dict.keys())
                for attr in attr_list:
                    if attr in reload_dict["original_option_names"] and attr not in new_option_names:
                        del reload_dict[attr]
            for (attr, val) in reload_dict.items():
                setattr(self.tile_instance, attr, val)
            form_data = self.tile_instance._create_form_data(reload_dict["form_info"])["form_data"]
            document_object.Collection.__fully_initialize__()

            if not self.tile_instance.exports:
                self.tile_instance.exports = []
            return {"success": True, "form_data": form_data,
                    "exports": self.tile_instance.get_export_type_info(),
                    "options_changed": options_changed,
                    "reload_dict": self.get_reload_dict()
                    }
        except Exception as ex:
            return self.handle_exception(ex, "Error reinstantiating tile")

    @task_worthy
    def instantiate_as_pseudo_tile(self, data):
        print("instantiate_as_pseudo_tile")
        try:
            self.tile_instance = PseudoTileClass()
            self.set_environ_from_creds(data["creds"])
            pseudo_tile_base.Tile = self.tile_instance
            widgets.Tile = self.tile_instance
            widgets.in_pseudo_tile = self.tile_instance.in_pseudo_tile
            self.handler_instances["tilebase"] = self.tile_instance
            for k, val in data["instance_params"].items():
                setattr(self.tile_instance, k, val)

            # The if statement below is because older notebooks saves won't have the globals dict
            # There won't be many of these old notebooks
            if (data["globals_dict"] is not None) and (isinstance(data["globals_dict"], dict)):  # legacy
                self.tile_instance.recreate_from_save(data["globals_dict"])
            result = {"success": True, "current_globals": self.tile_instance._last_globals}
            return result
        except Exception as ex:
            return self.handle_exception(ex, "Error initializing pseudo tile")

    @task_worthy
    def create_pseudo_tile_collection_object(self, data):
        am_notebook = data["am_notebook"]
        if not am_notebook and not self.tile_instance.doc_type == "none":
            document_object.Collection.__fully_initialize__()
            pseudo_tile_base.Collection = document_object.Collection
        if not am_notebook:
            pseudo_tile_base.Tiles = remote_tile_object.Tiles
            pseudo_tile_base.Pipes = remote_tile_object.Pipes
        pseudo_tile_base.Library = library_object.Library
        pseudo_tile_base.Settings = settings_object.Settings
        return data

    def set_environ_from_creds(self, creds):
        if not use_ecs:
            return
        os.environ["AWS_ACCESS_KEY_ID"] = creds["AccessKeyId"]
        os.environ["AWS_SECRET_ACCESS_KEY"] = creds["SecretAccessKey"]
        os.environ["AWS_SESSION_TOKEN"] = creds["SessionToken"]
        os.environ["AWS_DEFAULT_REGION"] = "us-east-2"
        return

    @task_worthy
    def load_source_and_instantiate(self, data):
        print("in load_source_and_instantiate")
        self.set_environ_from_creds(data["creds"])
        result = self.load_source(data)
        if not result["success"]:
            return result
        instantiate_result = self.instantiate_tile_class(data)
        form_data = self.tile_instance._create_form_data(data["form_info"])["form_data"]
        instantiate_result["form_data"] = form_data
        instantiate_result["reload_dict"] = self.get_reload_dict()
        return instantiate_result

    @task_worthy
    def instantiate_tile_class(self, data):
        try:
            print("entering instantiate_tile_class")
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            tile_env.Tile = self.tile_instance
            widgets.Tile = self.tile_instance
            widgets.in_pseudo_tile = self.tile_instance.in_pseudo_tile
            self.handler_instances["tilebase"] = self.tile_instance

            for k, val in data["instance_params"].items():
                setattr(self.tile_instance, k, val)

            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            if not self.tile_instance.exports:
                self.tile_instance.exports = []
            if not self.tile_instance.doc_type == "none":
                document_object.Collection.__fully_initialize__()
            data["exports"] = copy.deepcopy(self.tile_instance.exports)
            for exp in data["exports"]:
                exp["type"] = "unknown"

            data["success"] = True
            return data
        except Exception as ex:
            return self.handle_exception(ex, "Error instantiating tile class")

    @task_worthy
    def stop_me(self, data):
        print("killing me")
        self.kill()
        print("I'm killed")
        return {"success": True}

    @task_worthy
    def render_tile(self, data):
        return self.tile_instance._render_me(data)


if __name__ == "__main__":
    print("entering tile_main")
    app = Flask(__name__)
    exception_mixin.app = app
    tile_base._tworker = TileWorker()
    document_object._tworker = tile_base._tworker
    library_object._tworker = tile_base._tworker
    settings_object._tworker = tile_base._tworker
    remote_tile_object._tworker = tile_base._tworker

    print("tworker is created, about to start my_id is " + str(tile_base._tworker.my_id))
    tile_base._tworker.start()
    kill_worker = KillWorker()
    kill_worker.start()
    print("tworker started, my_id is " + str(tile_base._tworker.my_id))
    while True:
        time.sleep(1000)
