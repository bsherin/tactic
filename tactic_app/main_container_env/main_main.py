
from gevent import monkey
# import pydevd_pycharm
monkey.patch_all()
# pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True,
#                         suspend=True)
import pika
print("entering main_main")
import os
import uuid
import datetime
import flask
from flask import Flask
import exception_mixin
from exception_mixin import ExceptionMixin

import json
import copy
from communication_utils import emit_direct

from main import mainWindow
import main

# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy, RETRIES, callback_dict, callback_data_dict, error_handler_dict
# noinspection PyUnresolvedReferences
import qworker

import sys
import time

queue_check_time = 60  # How often, in seconds, to inspect the queues

import os
rb_id = os.environ.get("RB_ID")


class MainWorker(QWorker, ExceptionMixin):
    def __init__(self, ):
        QWorker.__init__(self)
        self.mwindow = None
        self.get_megaplex_task_now = False
        self.generate_heartbeats = True

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def is_container_local(self, the_id):
        return the_id not in ["host", "client"]

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

    def emit_table_message(self, message, data=None):
        if data is None:
            data = {}
        data["table_message"] = message
        self.emit_to_main_client("table-message", data)
        return

    def emit_to_main_client(self, message, data):
        data["main_id"] = self.my_id
        emit_direct(message, data, namespace='/main', room=self.my_id)

    def emit_console_message(self, console_message, task_data=None, force_open=True):
        if task_data is None:
            task_data = {}
        ldata = copy.copy(task_data)
        ldata["console_message"] = console_message
        ldata["force_open"] = force_open
        ldata["main_id"] = self.my_id
        self.emit_to_main_client("console-message", ldata)
        return

    def emit_export_viewer_message(self, message, data=None):
        if data is None:
            data = {}
        data["export_viewer_message"] = message
        data["main_id"] = self.my_id
        self.emit_to_main_client("export-viewer-message", data)
        return

    def send_error_entry(self, title, content):
        self.emit_to_main_client("add-error-drawer-entry", {"message": "add-error-drawer-entry",
                                                            "title": title,
                                                            "main_id": self.my_id,
                                                            "content": content})
        return {"success": True}

    def print_to_console(self, message, force_open=False, is_error=False, summary=None):

        self.ask_host("print_to_console", {"message": message,
                                           "force_open": force_open,
                                           "is_error": is_error,
                                           "user_id": self.mwindow.user_id,
                                           "summary": summary})
        return {"success": True}

    def print_text_area_to_console(self, uid, the_text, force_open=False):
        self.ask_host("print_text_area_to_console", {"unique_id": uid, "force_open": force_open,
                                                     "search_string": null,
                                                     "console_text": the_text,
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
            task_data = {"success": True,
                         "message": "finish-post-load",
                         "collection_name": self.mwindow.collection_name,
                         "doc_names": self.mwindow.doc_names,
                         "console_html": ""}
            if data_dict["doc_type"] == "table":
                task_data.update(self.mwindow.grab_chunk_by_row_index({"doc_name": self.mwindow.doc_names[0], "row_index": 0, "set_visible_doc": True}))
            else:
                task_data.update(self.mwindow.grab_freeform_data({"doc_name": self.mwindow.doc_names[0], "set_visible_doc": True}))
            # self.ask_host("emit_to_client", task_data)
            return task_data
        except Exception as Ex:
            return self.handle_exception(Ex, "Error initializing mainwindow")

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

    # noinspection PyUnusedLocal
    @task_worthy
    def get_jupyter_cell_data(self, data_dict):
        print("entering get_jupyter_cell_data")
        return {"cell_data": self.mwindow.jupyter_cells}

    def ready(self):
        self.ask_host("participant_ready", {"rb_id": rb_id, "user_id": os.environ.get("OWNER"),
                                            "participant": self.my_id, "main_id": self.my_id
                                            })
        return


if __name__ == "__main__":
    app = Flask(__name__)
    exception_mixin.app = app
    print("entering main")
    mworker = MainWorker()
    print("mworker is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    while True:
        time.sleep(1000)
