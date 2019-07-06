import os
if "DEBUG_TILE_CONTAINER" in os.environ:
    if os.environ.get("DEBUG_TILE_CONTAINER") == "True":
        import pydevd
        # pydevd.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True,
        # stderrToServer=True, suspend=False)
        print("settrace done")

from gevent import monkey; monkey.patch_all()
print("entering tile__main")

from communication_utils import send_request_to_megaplex

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
import gevent
from communication_utils import make_python_object_jsonizable
import uuid

from tile_o_plex import app
import tile_o_plex

import sys, os
sys.stdout = sys.stderr
import time

if "MAIN_ADDRESS" in os.environ:
    main_address = os.environ["MAIN_ADDRESS"]
else:
    main_address = None  # this should only happen in the tile test container

print("got main_address {}".format(main_address))


# noinspection PyUnusedLocal
class TileWorker(QWorker):
    def __init__(self):
        print("about to initialize QWorker")
        QWorker.__init__(self)
        print("QWorker initialized")
        self.tile_instance = None
        tile_env.Tile = None
        self.get_megaplex_task_now = False
        self.use_svg = True

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is a tile communicating'}

    def get_next_task(self):
        if self.get_megaplex_task_now:
            alt_address = None
        else:
            alt_address = main_address
        result = QWorker.get_next_task(self, alt_address)
        self.get_megaplex_task_now = not self.get_megaplex_task_now
        return result

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.tile_instance._main_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["tile_message"] = message
        data["tile_id"] = self.my_id
        self.ask_host("emit_tile_message", data)
        return

    def handle_exception(self, ex, special_string=None):
        error_string = self.get_traceback_message(ex)
        summary = "Exception of type {}".format(type(ex).__name__)
        print(error_string)
        return {"success": False, "message": error_string, "summary": summary}

    @task_worthy
    def load_source(self, data_dict):
        try:
            print("entering load_source")
            tile_code = data_dict["tile_code"]
            result = exec_tile_code(tile_code)
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return result

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, error_handler=None):
        if dest_id in ["host", "client"]:
            alt_address = None
        else:
            alt_address = main_address
        return QWorker.post_task(self, dest_id, task_type, task_data, callback_func,
                                 callback_data, expiration, error_handler, alt_address)

    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1,
                      timeout=10, tries=RETRIES):
        if dest_id in ["host", "client"]:
            alt_address = None
        else:
            alt_address = main_address

        return QWorker.post_and_wait(self, dest_id, task_type, task_data, sleep_time,
                                     timeout, tries, alt_address=alt_address)

    def post_and_wait_for_pipe(self, dest_id, task_type, task_data=None, sleep_time=.1,
                               timeout=10, tries=RETRIES, alt_address=None):
        callback_id = str(uuid.uuid4())
        new_packet = {"source": self.my_id,
                      "callback_type": "wait",
                      "callback_id": callback_id,
                      "status": "presend",
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "expiration": None}
        # self.debug_log("in post and wait with new_packet " + str(new_packet))
        tile_o_plex.transmitted_pipe_value = None
        tile_o_plex.awaiting_pipe = True
        send_request_to_megaplex("post_task", new_packet, alt_address=main_address)
        for i in range(tries):
            if not tile_o_plex.awaiting_pipe:
                return tile_o_plex.transmitted_pipe_value
            else:
                time.sleep(sleep_time)
        error_string = "post_and_wait_for_pipe timed out with msg_type {}, dest {}, source".format(task_type,
                                                                                                   dest_id,
                                                                                                   self.my_id)
        self.debug_log(error_string)
        raise Exception(error_string)

    def submit_response(self, task_packet, response_data=None):
        if response_data is not None:
            task_packet["response_data"] = response_data
        if task_packet["task_type"] == "_transfer_pipe_value":
            alt_address = task_packet["task_data"]["requester_address"]
        elif task_packet["source"] in ["host", "client"]:
            alt_address = None
        else:
            alt_address = main_address
        send_request_to_megaplex("submit_response", task_packet, alt_address=alt_address)
        return

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
            print("created class instance")
            self.handler_instances["tilebase"] = self.tile_instance
            if "tile_log_width" not in data:
                data["tile_log_width"] = data["back_width"]
                data["tile_log_height"] = data["back_height"]
            self.tile_instance.recreate_from_save(data)
            print("returning from tile_instance.recreate_from_save")
            if self.tile_instance.current_html is not None:
                self.tile_instance.current_html = self.tile_instance.current_html.replace(data["base_figure_url"],
                                                                                          data["new_base_figure_url"])
            self.tile_instance.base_figure_url = data["new_base_figure_url"]
            self.tile_instance.my_address = data["my_address"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            document_object.Collection.__fully_initialize__()
            print("tile instance started")
        except Exception as ex:
            result = self.handle_exception(ex, "Error loading source in tile_main recreate from save")
        return {"success": True,
                "is_shrunk": self.tile_instance.is_shrunk,
                "saved_size": self.tile_instance.full_tile_height,
                "exports": self.tile_instance.exports,
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
        print("about to exit")
        sys.exit()

    @task_worthy
    def reinstantiate_tile(self, reload_dict):
        try:
            print("entering reinstantiate_tile_class")
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
                        print("removing options " + attr)
                        del reload_dict[attr]
            for (attr, val) in reload_dict.items():
                setattr(self.tile_instance, attr, val)
            form_html = self.tile_instance._create_form_html(reload_dict["form_info"])["form_html"]
            self.tile_instance.my_address = reload_dict["tile_address"]
            document_object.Collection.__fully_initialize__()
            print("leaving reinstantiate_tile_class")
            if not self.tile_instance.exports:
                self.tile_instance.exports = []
            return {"success": True, "form_html": form_html,
                    "exports": self.tile_instance.exports,
                    "options_changed": options_changed}
        except Exception as ex:
            return self.handle_exception(ex, "Error reinstantiating tile")

    @task_worthy
    def instantiate_as_pseudo_tile(self, data):
        try:
            print("entering load_source")
            self.tile_instance = PseudoTileClass()
            pseudo_tile_base.Tile = self.tile_instance
            print("getting collection object")
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
            print("leaving instantiate_tile_class")
            result = {"success": True}
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
        return data

    @task_worthy
    def load_source_and_instantiate(self, data):
        result = self.load_source(data)
        if not result["success"]:
            return result
        return self.instantiate_tile_class(data)

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
            data["exports"] = self.tile_instance.exports
            print("leaving instantiate_tile_class")
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


# if __name__ == "__main__":
print("entering main")
tile_base._tworker = TileWorker()
document_object._tworker = tile_base._tworker
library_object._tworker = tile_base._tworker
remote_tile_object._tworker = tile_base._tworker

print("tworker is created, about to start my_id is " + str(tile_base._tworker.my_id))
tile_base._tworker.start()
print("tworker started, my_id is " + str(tile_base._tworker.my_id))
# while True:
#     time.sleep(1000)
