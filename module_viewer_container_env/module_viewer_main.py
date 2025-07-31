import ast

from gevent import monkey

from tactic_copilot_mixin import CopilotMixin

monkey.patch_all()
import datetime
import re
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy, task_worthy_manual_submit
from flask import render_template, Flask
from tile_code_parser import TileParser, remove_indents, insert_indents
import exception_mixin
from exception_mixin import ExceptionMixin
from mongo_db_fs import get_dbs

import sys, os

sys.stdout = sys.stderr
import time

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

mongo_uri = os.environ.get("MONGO_URI")

rb_id = os.environ.get("RB_ID")


# noinspection PyUnusedLocal
class ModuleViewerWorker(QWorker, ExceptionMixin, CopilotMixin):
    def __init__(self):
        QWorker.__init__(self)
        self.tp = None
        self.tstring = None
        self.module_name = None
        self.user_id = None
        self.db = None
        self.tile_collection_name = None
        self.tile_instance = None
        self.generate_heartbeats = True
        return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_to_client(self, message, data):
        data["main_id"] = self.my_id
        data["message"] = message
        self.ask_host("emit_to_client", data)

    @task_worthy_manual_submit
    def initialize_parser(self, data_dict, task_packet):
        local_task_packet = task_packet
        self.tstring = data_dict["version_string"]
        self.module_name = data_dict["module_name"]
        self.user_id = data_dict["user_id"]
        try:
            db, fs, repository_db, repository_fs, use_remote_repository, use_remote_database = get_dbs(get_repo=False)
            self.db = db
        except Exception as ex:
            error_string = self.extract_short_error_message(ex, "error getting pymongo client")
            print(error_string)
            self.mworker.debug_log(error_string)
            sys.exit()
        self.tile_collection_name = data_dict["tile_collection_name"]
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": self.module_name})
        module_code = tile_dict["tile_module"]
        self.user_id = os.environ.get("OWNER")

        def do_the_parse(handler_result):
            self.handler_methods = []
            try:
                self.handler_methods = handler_result["handler_methods"]
            except Exception as nex:
                print(self.extract_short_error_message(nex, "error getting handler methods"))
            self.tp = TileParser(module_code, self.handler_methods)
            result = {"success": True, "the_content": self.assemble_parse_information(),
                      "all_handler_methods": self.handler_methods}
            self.submit_response(local_task_packet, result)

        self.ask_host("get_handler_methods", {"user_id": self.user_id, "main_id": self.my_id}, do_the_parse),
        return

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is a tile communicating'}

    @task_worthy
    def reintiailize_parser(self, data_dict):
        module_code = data_dict["new_module_code"]
        self.tp.reparse(module_code)
        return {"success": True, "the_content": self.assemble_parse_information()}

    def build_code(self, data_dict):
        export_list = data_dict["exports"]
        additional_save_attrs = [sattr["name"] for sattr in data_dict["additional_save_attrs"]]
        couple_save_attrs_and_exports = data_dict["mdata"]["couple_save_attrs_and_exports"]
        export_list_of_dicts = [{"name": exp["name"], "tags": exp["tags"]} for exp in
                                export_list]  # tactic_todo what does this accomplish?
        user_methods_list_of_dicts = []
        for m in data_dict["user_methods"]:
            arg_string = m["argString"]
            if len(arg_string) > 0:
                arg_string = ", " + arg_string
            user_methods_list_of_dicts.append({"name": m["name"],
                                               "arg_string": arg_string,
                                               "method_body": insert_indents(m["codeText"], 2)})
        used_handler_methods_list_of_dicts = []
        for m in data_dict["used_handler_methods"]:
            arg_string = m["argString"]
            if len(arg_string) > 0:
                arg_string = ", " + arg_string
            used_handler_methods_list_of_dicts.append({"name": m["name"],
                                               "arg_string": arg_string,
                                               "method_body": insert_indents(m["codeText"], 2)})

        jscript_body = ""
        globals_code = ""
        standard_methods_list_of_dicts = []
        for m in data_dict["standard_methods"]:
            if m["name"] == "javascript":
                jscript_body = m["codeText"]
            elif m["name"] == "globals":
                globals_code = m["codeText"]
            else:
                arg_string = m["argString"]
                if len(arg_string) > 0:
                    arg_string = ", " + arg_string
                standard_methods_list_of_dicts.append(
                    {"name": m["name"],
                     "arg_string": arg_string,
                     "method_body": insert_indents(m["codeText"], 2)})

        options = data_dict["options"]
        for opt_dict in options:
            if "default" not in opt_dict:
                opt_dict["default"] = "None"
            elif isinstance(opt_dict["default"], str):
                opt_dict["default"] = '"' + opt_dict["default"] + '"'
            opt_dict["default"] = str(opt_dict["default"])
            if "special_list" in opt_dict:
                opt_dict["special_list"] = str(opt_dict["special_list"])
        if len(globals_code) > 0 and globals_code[-1] == "\n":
            globals_code = globals_code[:-1]
        with app.test_request_context():
            full_code = render_template("tile_creator_template.html",
                                        class_name=data_dict["module_name"],
                                        category="none",
                                        exports=export_list_of_dicts,
                                        couple_save_attrs_and_exports=couple_save_attrs_and_exports,
                                        additional_save_attrs=additional_save_attrs,
                                        options=data_dict["options"],
                                        is_mpl=data_dict["is_mpl"],
                                        is_d3=data_dict["is_d3"],
                                        jscript_code=jscript_body,
                                        globals_code=globals_code,
                                        user_methods=user_methods_list_of_dicts,
                                        used_handler_methods=used_handler_methods_list_of_dicts,
                                        standard_methods=standard_methods_list_of_dicts,
                                        version_string=self.tstring)
        return full_code

    def create_recent_checkpoint(self, module_name):
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": module_name})
        if "recent_history" in tile_dict:
            recent_history = tile_dict["recent_history"]
        else:
            recent_history = []
        recent_history.append({"updated": tile_dict["metadata"]["updated"],
                               "tile_module": tile_dict["tile_module"]})
        self.db[self.tile_collection_name].update_one({"tile_module_name": module_name},
                                                      {'$set': {"recent_history": recent_history}})
        return

    optional_mdata_fields = ["tags", "notes", "icon", "category"]

    @task_worthy
    def update_module(self, data_dict):
        try:
            module_name = data_dict["module_name"]
            module_code = self.build_code(data_dict)
            self.tp.reparse(module_code)
            standard_methods_line_numbers = {}
            render_content_line_numbers = {
                "firstLineNumber": self.tp.get_starting_line("render_content"),
                "lastLineNumber": self.tp.get_last_line("render_content")
            }
            draw_plot_line_numbers = {
                "firstLineNumber": self.tp.get_starting_line("draw_plot"),
                "lastLineNumber": self.tp.get_last_line("draw_plot")
            }

            standard_methods_line_numbers["render_content"] = render_content_line_numbers
            if draw_plot_line_numbers["firstLineNumber"] is not None:
                standard_methods_line_numbers["draw_plot"] = draw_plot_line_numbers
            user_methods_list = self.tp.get_user_methods_list()
            user_methods_line_numbers = {func["name"]: {
                "firstLineNumber": func["body_start"],
                "lastLineNumber": func["last_line"]} for func in user_methods_list}
            used_handler_methods_list = self.tp.get_used_handler_methods_list()
            used_handler_methods_line_numbers = {func["name"]: {
                "firstLineNumber": func["body_start"],
                "lastLineNumber": func["last_line"]} for func in used_handler_methods_list}
            doc = self.db[self.tile_collection_name].find_one({"tile_module_name": module_name})
            if doc and "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}

            mdata.update(data_dict["mdata"])

            mdata["updated"] = datetime.datetime.utcnow()
            if data_dict["is_mpl"]:
                mdata["type"] = "matplotlib"
            elif data_dict["is_d3"]:
                mdata["type"] = "d3"
            else:
                mdata["type"] = "standard"

            self.db[self.tile_collection_name].update_one({"tile_module_name": module_name},
                                                          {'$set': {"tile_module": module_code, "metadata": mdata,
                                                                    "last_saved": "creator"}})
            self.create_recent_checkpoint(module_name)
            return {"success": True, "message": "Module Successfully Saved",
                    "alert_type": "alert-success", "render_content_line_numbers": render_content_line_numbers,
                    "standard_methods_line_numbers": standard_methods_line_numbers,
                    "used_handler_methods_line_numbers": used_handler_methods_line_numbers,
                    "user_methods_line_numbers": user_methods_line_numbers}
        except Exception as ex:
            return self.get_traceback_exception_dict(ex, "Error saving module")

    def assemble_parse_information(self):
        for option in self.tp.options:
            if option["name"] in self.tp.defaults:
                option["default"] = self.tp.defaults[option["name"]]
        standard_methods_list = []
        func_dict = self.tp.methods
        if "render_content" in func_dict:
            render_content_code = func_dict["render_content"]["method_body"]
            render_content_code = remove_indents(render_content_code, 2)
        else:
            render_content_code = ""
        standard_methods_list.append({"name": "render_content",
                                      "codeText": render_content_code,
                                      "argString": "",
                                      "mode": "python",
                                      "firstLineNumber": func_dict["render_content"]["body_start"],
                                      "lastLineNumber": func_dict["render_content"]["last_line"]
                                      })
        is_mpl = self.tp.is_mpl
        is_d3 = self.tp.is_d3

        if is_mpl and "draw_plot" in func_dict:
            draw_plot_code = func_dict["draw_plot"]["method_body"]
            draw_plot_code = remove_indents(draw_plot_code, 2)
            standard_methods_list.append({"name": "draw_plot",
                                          "codeText": draw_plot_code,
                                          "argString": "",
                                          "mode": "python",
                                          "firstLineNumber": func_dict["draw_plot"]["body_start"],
                                          "lastLineNumber": func_dict["draw_plot"]["last_line"]
                                          })
        if is_d3 and "jscript" in self.tp.defaults:
            jscript_code = self.tp.defaults["jscript"]
            standard_methods_list.append({"name": "javascript",
                                          "codeText": jscript_code,
                                          "argString": "",
                                          "mode": "javascript",
                                          "firstLineNumber": 1,
                                            "lastLineNumber": len(jscript_code.splitlines())
                                          })

        globals_code = self.tp.globals_code
        standard_methods_list.append({"name": "globals",
                                      "codeText": globals_code,
                                      "argString": "",
                                      "mode": "python",
                                      "firstLineNumber": 1,
                                        "lastLineNumber": len(globals_code.splitlines())
                                      })
        user_methods_list = self.tp.get_user_methods_list()

        try:
            user_methods_list = [{"name": func["name"],
                                  "codeText": remove_indents(func["method_body"], 2),
                                  "argString": func["arg_string"],
                                  "mode": "python",
                                  "firstLineNumber": func["body_start"],
                                  "lastLineNumber": func["last_line"]
                                  } for func in user_methods_list]

        except Exception as ex:
            print(self.extract_short_error_message(ex, "*** Error assembling user methods list  ***"))
            user_methods_list = []
        used_handler_methods_list = self.tp.get_used_handler_methods_list()
        used_handler_methods_list = [{"name": func["name"],
                                      "codeText": remove_indents(func["method_body"], 2),
                                      "argString": func["arg_string"],
                                      "mode": "python",
                                      "firstLineNumber": func["body_start"],
                                        "lastLineNumber": func["last_line"]
                                      } for func in used_handler_methods_list]
        parsed_data = {"option_dict": self.tp.options, "export_list": self.tp.exports,
                       "additional_save_attrs": self.tp.additional_save_attrs,
                       "render_content_code": render_content_code,
                       "user_methods_list": user_methods_list,
                       "used_handler_methods_list": used_handler_methods_list,
                       "standard_methods_list": standard_methods_list,
                       "category": self.tp.category,
                       "is_mpl": is_mpl,
                       "is_d3": is_d3,
                       "globals_code": globals_code}
        return parsed_data

    @task_worthy
    def get_options(self, data_dict):
        try:
            the_class = class_info["tile_class"]
            self.tile_instance = the_class(0, 0)
            opt_dict = self.tile_instance.options
            export_list = self.tile_instance.exports
            if len(export_list) > 0:
                if not isinstance(export_list[0], dict):  # legacy old exports specified as list of strings
                    export_list = [{"name": exp, "tags": ""} for exp in export_list]
        except Exception as ex:
            return self.get_traceback_exception_dict(ex, "Error extracting options from source")
        return {"success": True, "opt_dict": opt_dict, "export_list": export_list}

    @task_worthy
    def stop_me(self, data):
        print("killing me")
        self.kill()
        print("I'm killed")
        return {"success": True}

    def ready(self):
        self.ask_host("participant_ready", {"rb_id": rb_id, "user_id": os.environ.get("OWNER"),
                                            "participant": self.my_id, "main_id": self.my_id})
        return


if __name__ == "__main__":
    app = Flask(__name__)
    exception_mixin.app = app
    print("entering main")
    mworker = ModuleViewerWorker()
    print("mworker is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    while True:
        time.sleep(1000)
