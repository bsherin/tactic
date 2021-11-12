
# import pydevd_pycharm
from gevent import monkey
monkey.patch_all()
# pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True,
#                         suspend=True)
import os
import pika
import json
print("entering tile__main")
from flask import Flask
import exception_mixin
from exception_mixin import ExceptionMixin

import copy
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy, RETRIES
# noinspection PyUnresolvedReferences

import qworker
import tile_env
from tile_env import class_info
from tile_env import exec_tile_code
import tile_base
import document_object
import remote_tile_object
from tile_base import clear_and_exec_user_code, TileBase
from pseudo_tile_base import PseudoTileClass
import pseudo_tile_base
import library_object
import settings_object
import gevent
from communication_utils import make_python_object_jsonizable, emit_direct
import uuid

import sys, os
sys.stdout = sys.stderr
import time


# noinspection PyUnusedLocal,PyProtectedMember


class TileWorker(QWorker):
    def __init__(self):
        QWorker.__init__(self)
        self.tile_instance = None
        tile_env.Tile = None
        self.get_megaplex_task_now = False
        self.use_svg = True
        self.generate_heartbeats = True

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is a tile communicating'}

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.tile_instance._main_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["tile_message"] = message
        data["tile_id"] = self.my_id
        emit_direct("tile-message", data, namespace="/main", room=self.tile_instance.user_id)
        return

    def emit_to_client(self, message, data):
        emit_direct(message, data, namespace="/main", room=self.tile_instance._main_id)

    def send_error_entry(self, title, content, line_number):
        data = {"message": "add-error-drawer-entry",
                "title": title,
                "content": content,
                "line_number": line_number,
                "tile_type": self.tile_instance.tile_type,
                "main_id": self.tile_instance._main_id
                }
        print("about to emit add-error-drawer entry with line_number " + str(line_number))
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
        result = self.load_source(data)
        if not result["success"]:
            print("didn't load successfully")
            print("message " + result["message"])
            return result
        return self.recreate_from_save(data["tile_save_dict"])

    @task_worthy
    def load_source_and_reinstantiate(self, data):
        result = self.load_source(data)
        if not result["success"]:
            return result
        return self.reinstantiate_tile(data["reload_dict"])

    @task_worthy
    def recreate_from_save(self, data):
        try:
            print("entering recreate_from_save. class_name is " + class_info["class_name"])
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            tile_env.Tile = self.tile_instance
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.recreate_from_save(data)
            if self.tile_instance.current_html is not None:
                self.tile_instance.current_html = self.tile_instance.current_html.replace(data["base_figure_url"],
                                                                                          data["new_base_figure_url"])
            self.tile_instance.base_figure_url = data["new_base_figure_url"]
            self.tile_instance.my_address = data["my_address"]
            self.tile_instance.user_id = os.environ["OWNER"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            document_object.Collection.__fully_initialize__()

        except Exception as ex:
            result = self.handle_exception(ex, "Error loading source in tile_main recreate from save")
        return {"success": True,
                "is_shrunk": self.tile_instance.is_shrunk,
                "saved_size": self.tile_instance.full_tile_height,
                "exports": self.tile_instance.get_export_type_info(),
                "tile_name": self.tile_instance.tile_name,
                "is_d3": self.tile_instance.is_d3}

    @task_worthy
    def get_image(self, data_dict):
        try:
            encoded_img = make_python_object_jsonizable(self.tile_instance.img_dict[data_dict["figure_name"]])
            return {"success": True, "img": encoded_img}
        except Exception as ex:
            return self.handle_exception(ex, "Error getting image")

    def extract_option_names(self, opt_dict):
        opt_names = []
        for opt in opt_dict:
            opt_names.append(opt["name"])
        return opt_names

    @task_worthy
    def kill_me(self, data):
        self.connection.close()

        sys.exit()

    @task_worthy
    def reinstantiate_tile(self, reload_dict):
        try:
            self.tile_instance = class_info["tile_class"](None, None, tile_name=reload_dict["tile_name"])
            tile_env.Tile = self.tile_instance
            self.handler_instances["tilebase"] = self.tile_instance
            old_option_names = reload_dict["old_option_names"]
            del reload_dict["old_option_names"]
            new_option_names = self.extract_option_names(self.tile_instance.options)
            options_changed = not set(new_option_names) == set(old_option_names)
            if options_changed:  # Have to deal with case where an option no longer exists and shouldn't be copied
                attr_list = list(reload_dict.keys())
                for attr in attr_list:
                    if attr in old_option_names and attr not in new_option_names:

                        del reload_dict[attr]
            for (attr, val) in reload_dict.items():
                setattr(self.tile_instance, attr, val)
            form_data = self.tile_instance._create_form_data(reload_dict["form_info"])["form_data"]
            self.tile_instance.my_address = reload_dict["tile_address"]
            self.tile_instance.user_id = os.environ["OWNER"]
            document_object.Collection.__fully_initialize__()

            if not self.tile_instance.exports:
                self.tile_instance.exports = []
            return {"success": True, "form_data": form_data,
                    "exports": self.tile_instance.get_export_type_info(),
                    "options_changed": options_changed}
        except Exception as ex:
            return self.handle_exception(ex, "Error reinstantiating tile")

    @task_worthy
    def instantiate_as_pseudo_tile(self, data):
        try:
            self.tile_instance = PseudoTileClass()
            pseudo_tile_base.Tile = self.tile_instance
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.user_id = os.environ["OWNER"]
            self.tile_instance.base_figure_url = data["base_figure_url"]
            self.tile_instance.my_address = data["tile_address"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
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
        if not am_notebook:
            document_object.Collection.__fully_initialize__()
            pseudo_tile_base.Collection = document_object.Collection
            pseudo_tile_base.Tiles = remote_tile_object.Tiles
            pseudo_tile_base.Pipes = remote_tile_object.Pipes
        pseudo_tile_base.Library = library_object.Library
        pseudo_tile_base.Settings = settings_object.Settings
        return data

    @task_worthy
    def load_source_and_instantiate(self, data):
        print("in load_source_and_instantiate")
        result = self.load_source(data)
        if not result["success"]:
            return result
        instantiate_result = self.instantiate_tile_class(data)
        form_data = self.tile_instance._create_form_data(data["form_info"])["form_data"]
        instantiate_result["form_data"] = form_data
        return instantiate_result

    @task_worthy
    def instantiate_tile_class(self, data):
        try:
            print("entering instantiate_tile_class")
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            tile_env.Tile = self.tile_instance
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.user_id = os.environ["OWNER"]
            self.tile_instance.base_figure_url = data["base_figure_url"]
            self.tile_instance.my_address = data["tile_address"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            if not self.tile_instance.exports:
                self.tile_instance.exports = []
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
    print("tworker started, my_id is " + str(tile_base._tworker.my_id))
    while True:
        time.sleep(1000)
