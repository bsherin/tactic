from main import mainWindow

# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy

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

    # tactic_change print_to_console is tricky
    def print_to_console(self, message_string, force_open=False):
        # with self.app.test_request_context():
        #     # noinspection PyUnresolvedReferences
        #     pmessage = render_template("log_item.html", log_item=message_string)
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
            for tile_id in self.tile_instances.keys():
                self.ask_tile(tile_id, event_name, data_dict)
        if event_name in self.update_events:
            self.post_task(self.my_id, event_name, data_dict)
        return True

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
        else:
            template = "<pre>" + special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}</pre>"
        error_string = template.format(type(ex).__name__, ex.args)
        return {"success": False, "message": error_string}

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is mainwindow communicating'}

    @task_worthy
    def initialize_mainwindow(self, data_dict):
        try:
            print("entering intialize mainwindow")
            print("data_dict is " + str(data_dict))
            self.mwindow = mainWindow(self, data_dict)
            return {"success": True}
        except Exception as Ex:
            return self.handle_exception(Ex, "Error initializing mainwindow")

    @task_worthy
    def initialize_project_mainwindow(self, data_dict):
        try:
            print("entering intialize project mainwindow")
            self.my_id = self.data_dict["main_id"]
            self.mwindow = mainWindow(data_dict)
            self.post_task(data_dict["main_id"], "do_full_recreation", data_dict)
            print("leaving initialize_project_mainwindow")
            return {"success": True}
        except Exception as ex:
            return self.handle_exception(ex, "Error initializing project mainwindow")

    @task_worthy
    def do_full_recreation(self, data_dict):
        return self.mwindow.do_full_recreation(data_dict)

    @task_worthy
    def get_saved_console_code(self, data_dict):
        print "entering saved console code with console_cm_code " + str(self.mwindow.console_cm_code)
        return {"saved_console_code": self.console_cm_code}

    @task_worthy
    def save_new_project(self, data_dict):
        return self.mwindow.save_new_project(data_dict)

    @task_worthy
    def update_project(self, data_dict):
        return self.mwindow.update_project(data_dict)

    @task_worthy
    def create_tile(self, data_dict):
        return self.mwindow.create_tile(data_dict)

    @task_worthy
    def get_column_data(self, data):
        return self.mwindow.get_column_data(data)

    @task_worthy
    def get_user_collection(self, data):
        return self.mwindow.get_user_collection(data)

    @task_worthy
    def get_document_data(self, data):
        return self.mwindow.get_document_data(data)

    @task_worthy
    def get_document_metadata(self, data):
        return self.mwindow.get_document_metadata(data)

    @task_worthy
    def set_document_metadata(self, data):
        return self.mwindow.set_document_metadata(data)

    @task_worthy
    def get_document_data_as_list(self, data):
        return self.mwindow.get_document_data_as_list(data)

    @task_worthy
    def get_column_names(self, data):
        return self.mwindow.get_column_names(data)

    @task_worthy
    def get_number_rows(self, data):
        return self.mwindow.get_number_rows(data)

    @task_worthy
    def get_row(self, data):
        return self.mwindow.get_row(data)

    @task_worthy
    def get_line(self, data):
        return self.mwindow.get_line(data)

    @task_worthy
    def get_cell(self, data):
        return self.mwindow.get_cell(data)

    @task_worthy
    def get_column_data_for_doc(self, data):
        return self.mwindow.get_column_data_for_doc(data)

    @task_worthy
    def CellChange(self, data):
        return self.mwindow.CellChange(data)

    @task_worthy
    def FreeformTextChange(self, data):
        return self.mwindow.FreeformTextChange(data)

    @task_worthy
    def set_visible_doc(self, data):
        return self.mwindow.set_visible_doc(data)

    @task_worthy
    def print_to_console_event(self, data):
        return self.mwindow.print_to_console_event(data)

    @task_worthy
    def create_console_code_area(self, data):
        return self.mwindow.create_console_code_area(data)

    @task_worthy
    def got_console_result(self, data_dict):
        return self.mwindow.got_console_result(data_dict)

    @task_worthy
    def exec_console_code(self, data):
        return self.mwindow.exec_console_code(data)

    @task_worthy
    def get_exports_list_html(self, data_dict):
        return self.mwindow.get_exports_list_html(data_dict)

    @task_worthy
    def evaluate_export(self, data_dict):
        return self.mwindow.evaluate_export(data_dict)

    @task_worthy
    def get_export_info(self, data_dict):
        return self.mwindow.get_export_info(data_dict)

    @task_worthy
    def get_property(self, data_dict):
        return self.mwindow.get_property(data_dict)

    @task_worthy
    def export_data(self, data_dict):
        return self.mwindow.export_data(data_dict)

    @task_worthy
    def create_collection(self, data_dict):
        return self.mwindow.create_collection(data_dict)

    @task_worthy
    def get_tile_ids(self, data_dict):
        return self.mwindow.get_tile_ids(data_dict)

    @task_worthy
    def set_property(self, data_dict):
        return self.mwindow.set_property(data_dict)

    @task_worthy
    def open_log_window(self, data_dict):
        return self.mwindow.open_log_window(data_dict)

    @task_worthy
    def grab_data(self, data_dict):
        return self.mwindow.grab_data(data_dict)

    @task_worthy
    def grab_project_data(self, data_dict):
        return self.mwindow.grab_project_data(data_dict)

    @task_worthy
    def reload_tile(self, data_dict):
        return self.mwindow.reload_tile(data_dict)

    @task_worthy
    def grab_chunk_with_row(self, data_dict):
        return self.mwindow.grab_chunk_with_row(data_dict)

    @task_worthy
    def distribute_events_stub(self, data_dict):
        return self.mwindow.distribute_events_stub(data_dict)

    @task_worthy
    def grab_next_chunk(self, data_dict):
        return self.mwindow.grab_next_chunk(data_dict)

    @task_worthy
    def grab_previous_chunk(self, data_dict):
        return self.mwindow.grab_previous_chunk(data_dict)

    @task_worthy
    def RemoveTile(self, data_dict):
        return self.mwindow.RemoveTile(data_dict)

    @task_worthy
    def CreateColumn(self, data_dict):
        return self.mwindow.CreateColumn(data_dict)

    @task_worthy
    def SearchTable(self, data_dict):
        return self.mwindow.SearchTable(data_dict)

    @task_worthy
    def FilterTable(self, data_dict):
        return self.mwindow.FilterTable(data_dict)

    @task_worthy
    def DehighlightTable(self, data_dict):
        return self.mwindow.DehighlightTable(data_dict)

    @task_worthy
    def UnfilterTable(self, data_dict):
        return self.mwindow.UnfilterTable(data_dict)

    @task_worthy
    def ColorTextInCell(self, data_dict):
        return self.mwindow.ColorTextInCell(data_dict)

    @task_worthy
    def SetCellContent(self, data_dict):
        return self.mwindow.SetCellContent(data_dict)

    @task_worthy
    def SetDocument(self, data_dict):
        return self.mwindow.SetDocument(data_dict)

    @task_worthy
    def SetColumnData(self, data_dict):
        return self.mwindow.SetColumnData(data_dict)

    @task_worthy
    def TextSelect(self, data_dict):
        return self.mwindow.TextSelect(data_dict)

    @task_worthy
    def SaveTableSpec(self, data_dict):
        return self.mwindow.SaveTableSpec(data_dict)

    @task_worthy
    def UpdateSortList(self, data_dict):
        return self.mwindow.UpdateSortList(data_dict)

    @task_worthy
    def UpdateLeftFraction(self, data_dict):
        return self.mwindow.UpdateLeftFraction(data_dict)

    @task_worthy
    def UpdateTableShrinkState(self, data_dict):
        return self.mwindow.UpdateTableShrinkState(data_dict)

    @task_worthy
    def PrintToConsole(self, data_dict):
        return self.mwindow.PrintToConsole(data_dict)

    @task_worthy
    def DisplayCreateErrors(self, data_dict):
        return self.mwindow.DisplayCreateErrors(data_dict)

    @task_worthy
    def display_matching_rows(self, data_dict):
        return self.mwindow.display_matching_rows(data_dict)

    @task_worthy
    def update_document(self, data_dict):
        return self.mwindow.update_document(data_dict)

    @task_worthy
    def SetCellBackground(self, data):
        return self.mwindow.SetCellBackground(data)


if __name__ == "__main__":
    mworker = MainWorker()
    mworker.start()
    while True:
        time.sleep(1000)
