import os
if "DEBUG_MAIN_CONTAINER" in os.environ:
    if os.environ.get("DEBUG_MAIN_CONTAINER") == "True":
        import pydevd
        # pydevd.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True, suspend=False)
        print("settrace done")

from gevent import monkey; monkey.patch_all()
print("entering main_main")

import uuid
import datetime
import flask
import copy
from communication_utils import send_request_to_megaplex

from main import mainWindow
import main

# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy, RETRIES, callback_dict, callback_data_dict, error_handler_dict
# noinspection PyUnresolvedReferences
import qworker

import sys
import time
# sys.stdout = sys.stderr
from megaplex_main import app
import megaplex_main
print("imported megaplex_main")

queue_check_time = 60  # How often, in seconds, to inspect the queues


@app.route('/main_hello', methods=["get", "post"])
def main_hello():
    return 'This is the main communicating'


class MainWorker(QWorker):
    def __init__(self, ):
        QWorker.__init__(self)
        self.mwindow = None
        self.get_megaplex_task_now = False
        self.last_queue_check = datetime.datetime.utcnow()
        print("starting mainworker")

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def is_container_local(self, the_id):
        return the_id not in ["host", "client"]

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, error_handler=None, alt_address=None):
        if callback_func is not None:
            callback_id = str(uuid.uuid4())
            callback_dict[callback_id] = callback_func
            if error_handler is not None:
                error_handler_dict[callback_id] = error_handler
            if callback_data is not None:
                cdata = copy.copy(callback_data)
                callback_data_dict[callback_id] = cdata
                callback_type = "callback_with_context"
            else:
                callback_type = "callback_no_context"
        else:
            callback_id = None
            callback_type = "no_callback"

        new_packet = {"source": self.my_id,
                      "status": "presend",
                      "callback_type": callback_type,
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "callback_id": callback_id,
                      "expiration": expiration}
        if self.is_container_local(dest_id):
            result = megaplex_main.post_task_local(new_packet).json
        else:
            result = send_request_to_megaplex("post_task", new_packet, alt_address=alt_address).json()
        if not result["success"]:
            error_string = "Error posting task with msg_type {} dest {} source {}. Error: {}".format(task_type,
                                                                                                     dest_id,
                                                                                                     self.my_id,
                                                                                                     result["message"])
            raise Exception(error_string)
        return result

    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1,
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
        post_local = self.is_container_local(dest_id)
        if post_local:
            megaplex_main.post_wait_task_local(new_packet)
        else:
            send_request_to_megaplex("post_wait_task", new_packet, alt_address=alt_address)
        for i in range(tries):
            if post_local:
                res = megaplex_main.check_wait_task_local(new_packet).json
            else:
                res = send_request_to_megaplex("check_wait_task", new_packet, alt_address=alt_address).json()
            if res["success"]:
                return res["result"]
            else:
                time.sleep(sleep_time)
        error_string = "post_and_wait timed out with msg_type {}, destination {}, and source".format(task_type,
                                                                                                     dest_id,
                                                                                                     self.my_id)
        self.debug_log(error_string)
        raise Exception(error_string)

    def submit_response(self, task_packet, response_data=None):
        if response_data is not None:
            task_packet["response_data"] = response_data
        if self.is_container_local(task_packet["source"]):
            megaplex_main.submit_response_local(task_packet)
        else:
            send_request_to_megaplex("submit_response", task_packet)
        return

    def get_next_task(self):
        if self.get_megaplex_task_now:
            result = QWorker.get_next_task(self)
        else:
            result = megaplex_main.get_next_task_local(self.my_id).json
        self.get_megaplex_task_now = not self.get_megaplex_task_now
        return result

    def handle_response(self, task_packet):
        if flask.has_app_context():
            QWorker.handle_response(self, task_packet)
        else:
            with app.app_context():
                QWorker.handle_response(self, task_packet)

    def handle_event(self, task_packet):
        if flask.has_app_context():
            QWorker.handle_event(self, task_packet)
        else:
            with app.app_context():
                QWorker.handle_event(self, task_packet)

    def ask_tile(self, tile_id, msg_type, task_data=None, callback_func=None):
        self.post_task(tile_id, msg_type, task_data, callback_func)
        return

    def emit_table_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["table_message"] = message
        self.ask_host("emit_table_message", data, callback_func)
        return

    def emit_console_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["console_message"] = message
        self.ask_host("emit_console_message", data, callback_func)
        return

    def emit_export_viewer_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["export_viewer_message"] = message
        self.ask_host("emit_export_viewer_message", data, callback_func)
        return

    def print_to_console(self, message, force_open=False, is_error=False, summary=None):

        self.ask_host("print_to_console", {"message": message,
                                           "force_open": force_open,
                                           "is_error": is_error,
                                           "user_id": self.mwindow.user_id,
                                           "summary": summary})
        return {"success": True}

    def print_text_area_to_console(self, uid, force_open=False):
        self.ask_host("print_text_area_to_console", {"unique_id": uid, "force_open": force_open,
                                                     "user_id": self.mwindow.user_id})
        return {"success": True, "unique_id": uid}

    def print_code_area_to_console(self, uid, force_open=False):
        self.ask_host("print_code_area_to_console", {"unique_id": uid, "force_open": force_open,
                                                     "user_id": self.mwindow.user_id})
        return {"success": True, "unique_id": uid}

    def distribute_event(self, event_name, data_dict=None, tile_id=None):
        if data_dict is None:
            data_dict = {}
        if tile_id is not None:
            self.ask_tile(tile_id, event_name, data_dict)
        else:
            for tile_id in self.mwindow.tile_instances:
                self.ask_tile(tile_id, event_name, data_dict)
        if event_name in self.mwindow.update_events:
            self.post_task(self.my_id, event_name, data_dict)
        return True

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
        else:
            template = "<pre>" + special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}</pre>"
        error_string = template.format(type(ex).__name__, ex.args)
        print(error_string)
        return {"success": False, "message": error_string}

    @task_worthy
    def hello(self):
        return {"success": True, "message": 'This is mainwindow communicating'}

    @task_worthy
    def initialize_mainwindow(self, data_dict):
        try:
            print("entering intialize mainwindow")
            print("data_dict is " + str(data_dict))

            # missing: project_collection_name, mongo_uri, base_figure_url

            self.mwindow = mainWindow(self, data_dict)
            self.handler_instances["mainwindow"] = self.mwindow
            print("ready to emit to client")
            self.ask_host("emit_to_client", {"message": "finish-post-load",
                                             "collection_name": self.mwindow.collection_name,
                                             "doc_names": self.mwindow.doc_names,
                                             "console_html": ""})
            return {"success": True}
        except Exception as Ex:
            return self.handle_exception(Ex, "Error initializing mainwindow")

    def special_long_sleep_function(self):
        current_time = datetime.datetime.utcnow()
        tdelta = current_time - self.last_queue_check
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        if delta_seconds > queue_check_time:
            print("Checking queue status")
            for tmanager in megaplex_main.queue_dict.values():
                print(tmanager.get_data_string())
            self.last_queue_check = current_time

    @task_worthy
    def initialize_project_mainwindow(self, data_dict):
        try:
            print("entering intialize project mainwindow")
            self.mwindow = mainWindow(self, data_dict)
            self.handler_instances["mainwindow"] = self.mwindow
            if data_dict["doc_type"] == "jupyter":
                self.post_task(self.my_id, "do_full_jupyter_recreation", data_dict)
            elif data_dict["doc_type"] == "notebook":
                self.post_task(self.my_id, "do_full_notebook_recreation", data_dict)
            else:
                self.post_task(self.my_id, "do_full_recreation", data_dict)
            print("leaving initialize_project_mainwindow")
            return {"success": True}
        except Exception as ex:
            return self.handle_exception(ex, "Error initializing project mainwindow")

    # noinspection PyUnusedLocal
    @task_worthy
    def get_saved_console_code(self, data_dict):
        print("entering saved console code")
        return {"saved_console_code": self.mwindow.console_cm_code}

    @task_worthy
    def get_jupyter_cell_data(self, data_dict):
        print("entering get_jupyter_cell_data")
        return {"cell_data": self.mwindow.jupyter_cells}


# if __name__ == "__main__":
mworker = MainWorker()
mworker.start()
# while True:
#     time.sleep(1000)
