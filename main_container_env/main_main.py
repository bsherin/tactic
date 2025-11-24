
import os

if os.environ.get("DEBUG", "False").lower() == "true":
    print("got debug mode")
    import pydevd_pycharm
    pydevd_pycharm.settrace('host.docker.internal', port=21000)

print("entering main_main")

import uuid
import datetime
import flask
from flask import Flask
import exception_mixin
from exception_mixin import ExceptionMixin
from tactic_copilot_mixin import CopilotMixin
from aws_helpers import resolve_task_identity, get_ssm_parameter

import json
import copy
from communication_utils import emit_direct

from main import mainWindow
print("back in main_main")

from qworker import QWorker, task_worthy, callback_dict, callback_data_dict, error_handler_dict
import qworker

import sys
import time

queue_check_time = 60  # How often, in seconds, to inspect the queues

import os

print("about to define mainworker class")
class MainWorker(QWorker, ExceptionMixin, CopilotMixin):
    def __init__(self, ):
        id_prefix = get_ssm_parameter("MAIN_ID_PREFIX", "main_service_")
        self.my_arn, self.my_id = resolve_task_identity(id_prefix)
        QWorker.__init__(self, service_name="main_service", special_id=self.my_id)
        self.mwindow = mainWindow(self)
        self.handler_instances["mainwindow"] = self.mwindow
        self.get_megaplex_task_now = False

    def ask_host(self, sid, msg_type, task_data=None, callback_func=None):
        if task_data is None:
            task_data = {}
        task_data["local_id"] = sid
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def get_session(self, sid):
        return self.mwindow.get_session(sid)

    @staticmethod
    def is_container_local(the_id):
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

    def emit_table_message(self, sid, message, data=None):
        if data is None:
            data = {}
        data["table_message"] = message
        self.emit_to_main_client(sid, "table-message", data)
        return

    def emit_to_client(self, message, task_packet):
        task_packet["message"] = message
        self.post_task("host", "emit_to_client", task_packet)

    def emit_to_user(self, sid, message, data=None):
        sess = self.mwindow.get_session(sid)
        user_id = sess.user_id
        data["message"] = message
        data["room"] = user_id
        self.ask_host(sid, "emit_to_client", data)

    def emit_to_main_client(self, sid, message, data):
        data["message"] = message
        self.ask_host(sid, "emit_to_client", data)

    def emit_console_message(self, sid, console_message, task_data=None, force_open=True):
        if task_data is None:
            task_data = {}
        ldata = copy.copy(task_data)
        ldata["console_message"] = console_message
        ldata["force_open"] = force_open
        self.emit_to_main_client(sid, "console-message", ldata)
        return

    def emit_export_viewer_message(self, sid, message, data=None):
        if data is None:
            data = {}
        data["export_viewer_message"] = message
        data["local_id"] = sid
        self.emit_to_main_client(sid, "export-viewer-message", data)
        return

    def send_error_entry(self, sid, title, content, line_number=None):
        self.emit_to_user(sid, "add-error-drawer-entry",
                          {"message": "add-error-drawer-entry",
                           "title": title, "content": content, "line_number": line_number})
        return {"success": True}

    def print_to_console(self, sid, message, force_open=False, is_error=False, summary=None):

        self.ask_host(sid, "print_to_console", {"message": message,
                       "force_open": force_open,
                       "is_error": is_error,
                       "user_id": self.mwindow.user_id,
                       "summary": summary})
        return {"success": True}

    def distribute_event(self, sid, event_name, data_dict=None, tile_id=None):
        if data_dict is None:
            data_dict = {}
        data_dict["local_id"] = sid
        if tile_id is not None:
            self.ask_tile(tile_id, event_name, data_dict)
        else:
            sess = self.mwindow.get_session(sid)
            tile_info = sess.tile_info
            for tile_id in tile_info.tile_ids:
                self.ask_tile(tile_id, event_name, data_dict)
        if event_name in self.mwindow.update_events:
            self.post_task("main_service", event_name, data_dict)
        return True


if __name__ == "__main__":
    print("in __main__")
    app = Flask(__name__)
    exception_mixin.app = app
    print("entering main")
    mworker = MainWorker()
    print("mworker is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    while True:
        time.sleep(1000)
