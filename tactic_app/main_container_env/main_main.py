from main import mainWindow
import main

# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy
# noinspection PyUnresolvedReferences
import qworker

import sys
import time
sys.stdout = sys.stderr


class MainWorker(QWorker):
    def __init__(self, ):
        QWorker.__init__(self)
        self.mwindow = None

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def ask_tile(self, tile_id, msg_type, task_data=None, callback_func=None):
        self.post_task(tile_id, msg_type, task_data, callback_func)
        return

    def emit_table_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["table_message"] = message
        self.ask_host("emit_table_message", data, callback_func)
        return

    def emit_export_viewer_message(self, message, data=None, callback_func=None):
        if data is None:
            data = {}
        data["export_viewer_message"] = message
        self.ask_host("emit_export_viewer_message", data, callback_func)
        return

    def print_to_console(self, message_string, force_open=False):
        self.ask_host("print_to_console", {"message_string": message_string, "force_open": force_open})
        return {"success": True}

    def print_code_area_to_console(self, uid, force_open=False):
        self.ask_host("print_code_area_to_console", {"unique_id": uid, "force_open": force_open})
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
        print error_string
        return {"success": False, "message": error_string}

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is mainwindow communicating'}

    @task_worthy
    def initialize_mainwindow(self, data_dict):
        try:
            print("entering intialize mainwindow")
            print("data_dict is " + str(data_dict))

            # missing: project_collection_name, mongo_uri, base_figure_url

            self.mwindow = mainWindow(self, data_dict)
            self.handler_instances["mainwindow"] = self.mwindow
            print "ready to emit to client"
            self.ask_host("emit_to_client", {"message": "finish-post-load",
                                             "collection_name": self.mwindow.collection_name,
                                             "doc_names": self.mwindow.doc_names})
            return {"success": True}
        except Exception as Ex:
            return self.handle_exception(Ex, "Error initializing mainwindow")

    @task_worthy
    def initialize_project_mainwindow(self, data_dict):
        try:
            print("entering intialize project mainwindow")
            the_lists = self.post_and_wait("host", "get_lists_classes_functions", {"user_id": data_dict["user_id"]})
            data_dict.update({"list_names": the_lists["list_names"],
                              "class_names": the_lists["class_names"],
                              "function_names": the_lists["function_names"],
                              "collection_names": the_lists["collection_names"]})
            self.mwindow = mainWindow(self, data_dict)
            self.handler_instances["mainwindow"] = self.mwindow
            self.post_task(self.my_id, "do_full_recreation", data_dict)
            print("leaving initialize_project_mainwindow")
            return {"success": True}
        except Exception as ex:
            return self.handle_exception(ex, "Error initializing project mainwindow")

    @task_worthy
    def get_saved_console_code(self, data_dict):
        print "entering saved console code with console_cm_code " + str(self.mwindow.console_cm_code)
        return {"saved_console_code": self.mwindow.console_cm_code}


if __name__ == "__main__":
    mworker = MainWorker()
    mworker.start()
    while True:
        time.sleep(1000)
