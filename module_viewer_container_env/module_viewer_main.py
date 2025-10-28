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
from mongo_accesser import MongoAccess
from tile_accesser import TileAccess
from mongo_db_fs import get_dbs

import sys, os

sys.stdout = sys.stderr
import time


# noinspection PyUnusedLocal
class ModuleViewerWorker(QWorker, ExceptionMixin, CopilotMixin, MongoAccess, TileAccess):
    def __init__(self):
        QWorker.__init__(self)
        self.generate_heartbeats = True
        db, fs, repository_db, repository_fs = get_dbs()
        self.db = db
        self.fs = fs
        self.handler_methods = None
        self.sessions = {}
        return

    def retrieve_handler_methods(self):
        def got_methods(handler_result):
            self.handler_methods = []
            try:
                self.handler_methods = handler_result["handler_methods"]
            except Exception as nex:
                print(self.extract_short_error_message(nex, "error getting handler methods"))
        self.ask_host("get_handler_methods", {}, got_methods)
        return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["local_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_to_client(self, message, data):
        data["local_id"] = self.my_id
        data["message"] = message
        self.ask_host("emit_to_client", data)

    @task_worthy
    def start_session(self, data_dict):
        self.sessions[data_dict["local_id"]] = {
            "user_id": data_dict["user_id"],
            "module_name": data_dict["module_name"],
            "username": data_dict["username"],
            "openai_api_key": data_dict.get("openai_api_key", None),
        }

    @task_worthy
    def initialize_parser(self, data_dict):
        module_name = data_dict["module_name"]
        local_id = data_dict["local_id"]
        user_id = data_dict["user_id"]
        tile_dict = self.get_tile_doc(module_name, username=self.sessions[local_id]["username"])
        module_code = tile_dict["tile_module"]
        tp = TileParser(module_code, self.handler_methods)
        result = {"success": True, "the_content": self.assemble_parse_information(tp),
                  "all_handler_methods": self.handler_methods}
        return result

    # @task_worthy
    # def reintiailize_parser(self, data_dict):
    #     module_code = data_dict["new_module_code"]
    #     tp.reparse(module_code)
    #     return {"success": True, "the_content": self.assemble_parse_information()}

    @staticmethod
    def build_code(data_dict):
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

        javascript_functions_list_of_dicts = []
        if "javascript_functions" in data_dict:
            for f in data_dict["javascript_functions"]:
                javascript_functions_list_of_dicts.append({"name": f["name"],
                                                           "code": f["codeText"]})
        globals_code = data_dict["globals_info"]["codeText"]
        standard_methods_list_of_dicts = []
        m = data_dict["render_content_info"]
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
                                        jscript_functions=javascript_functions_list_of_dicts,
                                        globals_code=globals_code,
                                        user_methods=user_methods_list_of_dicts,
                                        used_handler_methods=used_handler_methods_list_of_dicts,
                                        standard_methods=standard_methods_list_of_dicts)
        return full_code

    def get_username(self, local_id):
        return self.sessions[local_id]["username"]

    @task_worthy
    def update_module(self, data_dict):
        try:
            module_name = data_dict["module_name"]
            module_code = self.build_code(data_dict)
            tp = TileParser(module_code, self.handler_methods)
            standard_methods_line_numbers = {}
            render_content_line_numbers = {
                "firstLineNumber": tp.get_starting_line("render_content"),
                "lastLineNumber": tp.get_last_line("render_content")
            }
            draw_plot_line_numbers = {
                "firstLineNumber": tp.get_starting_line("draw_plot"),
                "lastLineNumber": tp.get_last_line("draw_plot")
            }

            standard_methods_line_numbers["render_content"] = render_content_line_numbers
            if draw_plot_line_numbers["firstLineNumber"] is not None:
                standard_methods_line_numbers["draw_plot"] = draw_plot_line_numbers
            user_methods_list = tp.get_user_methods_list()
            user_methods_line_numbers = {func["name"]: {
                "firstLineNumber": func["body_start"],
                "lastLineNumber": func["last_line"]} for func in user_methods_list}
            used_handler_methods_list = tp.get_used_handler_methods_list()
            used_handler_methods_line_numbers = {func["name"]: {
                "firstLineNumber": func["body_start"],
                "lastLineNumber": func["last_line"]} for func in used_handler_methods_list}
            self.update_tile(module_name, module_code, "creator", username=self.get_username(data_dict["local_id"]))
            self.create_recent_checkpoint(module_name, username=self.get_username(data_dict["local_id"]))
            return {"success": True, "message": "Module Successfully Saved",
                    "alert_type": "alert-success", "render_content_line_numbers": render_content_line_numbers,
                    "standard_methods_line_numbers": standard_methods_line_numbers,
                    "used_handler_methods_line_numbers": used_handler_methods_line_numbers,
                    "user_methods_line_numbers": user_methods_line_numbers}
        except Exception as ex:
            return self.get_traceback_exception_dict(ex, "Error saving module")

    def assemble_parse_information(self, tp):
        print("*** assemble_parse_information called in module_viewer_main")
        try:
            for option in tp.options:
                if option["name"] in tp.defaults:
                    option["default"] = tp.defaults[option["name"]]
            func_dict = tp.methods
            if "render_content" in func_dict:
                render_content_code = func_dict["render_content"]["method_body"]
                render_content_code = remove_indents(render_content_code, 2)
            else:
                render_content_code = ""
            render_content_info = {"name": "render_content",
                                  "codeText": render_content_code,
                                  "argString": "",
                                  "mode": "python",
                                   "identifier": "render_content",
                                  "firstLineNumber": func_dict["render_content"]["body_start"],
                                  "lastLineNumber": func_dict["render_content"]["last_line"]
                                  }

            javascript_functions_list = []
            if "jscript" in tp.defaults:
                print("got jscript")
                jscript = tp.defaults["jscript"]
                if type(jscript) == str:
                    javascript_functions_list.append(
                        {"name": "__raw_code__",
                         "codeText": jscript,
                         "argString": "",
                         "mode": "javascript",
                         "firstLineNumber": 1,
                         "lastLineNumber": len(jscript.splitlines())
                         }
                    )
                else:
                    print("about to loop for jscript")
                    for func_info in jscript:
                        javascript_functions_list.append(
                            {"name": func_info["name"],
                             "codeText": func_info["code"],
                             "argString": "",
                             "mode": "javascript",
                             "firstLineNumber": 1,
                             "lastLineNumber": len(func_info["code"].splitlines())
                             }
                        )
            globals_code = tp.globals_code
            globals_info = {"name": "globals",
                            "codeText": globals_code,
                            "argString": "",
                            "mode": "python",
                            "identifier": "globals",
                            "firstLineNumber": 1,
                            "lastLineNumber": len(globals_code.splitlines())
                            }
            user_methods_list = tp.get_user_methods_list()
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
        used_handler_methods_list = tp.get_used_handler_methods_list()
        used_handler_methods_list = [{"name": func["name"],
                                      "codeText": remove_indents(func["method_body"], 2),
                                      "argString": func["arg_string"],
                                      "mode": "python",
                                      "firstLineNumber": func["body_start"],
                                      "lastLineNumber": func["last_line"]
                                      } for func in used_handler_methods_list]
        parsed_data = {"option_dict": tp.options, "export_list": tp.exports,
                       "additional_save_attrs": tp.additional_save_attrs,
                       "render_content_info": render_content_info,
                       "javascript_functions_list": javascript_functions_list,
                       "globals_info": globals_info,
                       "is_mpl": tp.is_mpl,
                       "user_methods_list": user_methods_list,
                       "used_handler_methods_list": used_handler_methods_list,
                       "category": tp.category}
        return parsed_data

    # @task_worthy
    # def get_options(self, data_dict):
    #     try:
    #         the_class = class_info["tile_class"]
    #         tile_instance = the_class(0, 0)
    #         opt_dict = tile_instance.options
    #         export_list = tile_instance.exports
    #         if len(export_list) > 0:
    #             if not isinstance(export_list[0], dict):  # legacy old exports specified as list of strings
    #                 export_list = [{"name": exp, "tags": ""} for exp in export_list]
    #     except Exception as ex:
    #         return self.get_traceback_exception_dict(ex, "Error extracting options from source")
    #     return {"success": True, "opt_dict": opt_dict, "export_list": export_list}

    @task_worthy
    def stop_me(self, data):
        print("killing me")
        self.kill()
        print("I'm killed")
        return {"success": True}

    def ready(self):
        self.retrieve_handler_methods()
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
