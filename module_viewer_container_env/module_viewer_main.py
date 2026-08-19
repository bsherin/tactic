import hashlib
import re
from tactic_logging import log, setup_logging

setup_logging("module_viewer")
log.debug("starting", extra_flag=True)

try:
    from tactic_copilot_mixin import CopilotMixin
    from qworker import QWorker, task_worthy
    from flask import render_template, Flask

    from tile_code_parser import (
        TileParser,
        remove_indents,
        insert_indents,
        prepare_user_methods_for_render,
        prepare_user_methods_for_tile_maker,
    )
    from tile_ai_context import prepare_tile_context
    from mongo_accesser import MongoAccess
    from tile_accesser import TileAccess
    from mongo_db_fs import get_dbs
    from module_viewer_session import ModuleViewerSessionStore, ModuleViewerSessionAccessor
    from aws_helpers import resolve_task_identity, get_ssm_parameter

    import sys

    sys.stdout = sys.stderr
    import time
except Exception:
    log.exception("*** fatal error during imports in module_viewer ***")
    log.critical("*** exiting mongo_watcher due to fatal error ***")
    raise

class ModuleViewerWorker(QWorker, CopilotMixin, MongoAccess, TileAccess):
    copilot_api_scope = "tile"

    def __init__(self):
        id_prefix = get_ssm_parameter("MODULE_VIEWER_PREFIX", "module_viewer_")
        self.my_arn, self.my_id = resolve_task_identity(id_prefix)
        QWorker.__init__(self, service_name="module_viewer", special_id=self.my_id)
        db, fs, repository_db, repository_fs = get_dbs()
        self.db = db
        self.fs = fs
        self.handler_methods = None
        self.ss = ModuleViewerSessionStore()
        self.api_spec = None
        self.api_catalog = None
        self._api_metadata_loaded = False
        return

    def retrieve_handler_methods(self):
        def got_methods(handler_result):
            self.handler_methods = []
            try:
                self.handler_methods = handler_result["handler_methods"]
            except Exception:
                log.exception("error getting handler methods")
        self.ask_host("get_handler_methods", {}, got_methods)
        return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["local_id"] = self.my_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def get_session(self, sid):
        return ModuleViewerSessionAccessor.create(self.ss, sid)

    @task_worthy
    def start_session(self, data_dict):
        session_data = {
            "user_id": data_dict["user_id"],
            "module_name": data_dict["module_name"],
            "username": data_dict["username"],
            "global_id": data_dict["global_id"],
            "openai_api_key": data_dict.get("openai_api_key", None),
        }
        self.ss.initialize_session(data_dict["local_id"], session_data)
        return {"success": True}

    @task_worthy
    def end_module_viewer_session_task(self, data_dict):
        local_id = data_dict["local_id"]
        self.ss.end_session(local_id)
        return {"success": True}

    @task_worthy
    def client_session_ended(self, data):
        global_id = data["global_id"]
        sids = self.ss.get_unique_sids()
        for sid in sids:
            gid = self.ss.get_val(sid, "global_id")
            if gid == global_id:
                self.ss.end_session(sid)

    @task_worthy
    def updated_global_ids(self, data):
        global_ids = data["global_ids"]
        open_sessions = self.ss.get_unique_sids()
        for sid in open_sessions:
            gid = self.ss.get_val(sid, "global_id")
            if gid not in global_ids:
                self.ss.end_session(sid)

    @task_worthy
    def initialize_parser(self, data_dict):
        sid = data_dict["local_id"]
        sess = self.get_session(sid)
        tile_dict = self.get_tile_doc(sess.module_name, username=sess.username)
        module_code = tile_dict["tile_module"]
        tp = TileParser(module_code, self.handler_methods)
        result = {"success": True, "the_content": self.assemble_parse_information(tp),
                  "all_handler_methods": self.handler_methods}
        return result

    @staticmethod
    def build_code(data_dict):
        def split_list(s):
            return re.split(r'[, \n]+', s)

        export_list = data_dict["exports"]
        additional_save_attrs = [sattr["name"] for sattr in data_dict["additional_save_attrs"]]
        couple_save_attrs_and_exports = data_dict["mdata"]["couple_save_attrs_and_exports"]
        export_list_of_dicts = [{"name": exp["name"], "tags": exp["tags"]} for exp in
                                export_list]  # tactic_todo what does this accomplish?
        user_methods_list_of_dicts = prepare_user_methods_for_render(data_dict["user_methods"])
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
            elif opt_dict["type"] == "multi_select":
                opt_dict["default"] = split_list(opt_dict["default"])
            elif isinstance(opt_dict["default"], str):
                opt_dict["default"] = '"' + opt_dict["default"] + '"'
            opt_dict["default"] = str(opt_dict["default"])
            if "special_list" in opt_dict:
                opt_dict["special_list"] = str(opt_dict["special_list"])
        widgets = data_dict["widgets"]

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
                                        widgets=widgets,
                                        jscript_functions=javascript_functions_list_of_dicts,
                                        globals_code=globals_code,
                                        user_methods=user_methods_list_of_dicts,
                                        used_handler_methods=used_handler_methods_list_of_dicts,
                                        standard_methods=standard_methods_list_of_dicts)
        return full_code

    def get_ai_background_context(self, data_dict):
        tile_data = prepare_tile_context(data_dict.get("ai_context"))
        if tile_data is None:
            return ""

        try:
            return self.build_code(tile_data)
        except Exception:
            log.exception("Could not assemble tile context for autocomplete")
            return ""

    def get_username(self, local_id):
        sess = self.get_session(local_id)
        return sess.username

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
                "lastLineNumber": func["last_line"]} for func in user_methods_list
                if func.get("kind") != "divider" or func.get("preserve_as_method", False)}
            used_handler_methods_list = tp.get_used_handler_methods_list()
            used_handler_methods_line_numbers = {func["name"]: {
                "firstLineNumber": func["body_start"],
                "lastLineNumber": func["last_line"]} for func in used_handler_methods_list}
            username = self.get_username(data_dict["local_id"])
            self.update_tile(module_name, module_code, "creator", metadata=data_dict["mdata"], username=username)
            self.create_recent_checkpoint(module_name, username=self.get_username(data_dict["local_id"]))
            return {"success": True, "message": "Module Successfully Saved",
                    "alert_type": "alert-success", "render_content_line_numbers": render_content_line_numbers,
                    "standard_methods_line_numbers": standard_methods_line_numbers,
                    "used_handler_methods_line_numbers": used_handler_methods_line_numbers,
                    "user_methods_line_numbers": user_methods_line_numbers,
                    "source_info": self.source_info(module_code)}
        except Exception as ex:
            log.exception("error updating module")
            return self.get_traceback_exception_dict(ex, "Error updating module: ")

    @staticmethod
    def assemble_parse_information(tp):
        for option in tp.options:
            if option["name"] in tp.defaults:
                the_default = tp.defaults[option["name"]]
                if type(the_default) == list:
                    the_default = " ".join(the_default)
                option["default"] = the_default
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
        user_methods_list = prepare_user_methods_for_tile_maker(user_methods_list)

        used_handler_methods_list = tp.get_used_handler_methods_list()
        used_handler_methods_list = [{"name": func["name"],
                                      "codeText": remove_indents(func["method_body"], 2),
                                      "argString": func["arg_string"],
                                      "mode": "python",
                                      "firstLineNumber": func["body_start"],
                                      "lastLineNumber": func["last_line"]
                                      } for func in used_handler_methods_list]
        parsed_data = {"option_dict": tp.options, "export_list": tp.exports, "widget_list": tp.widgets,
                       "additional_save_attrs": tp.additional_save_attrs,
                       "render_content_info": render_content_info,
                       "javascript_functions_list": javascript_functions_list,
                       "globals_info": globals_info,
                       "is_mpl": tp.is_mpl,
                       "user_methods_list": user_methods_list,
                       "used_handler_methods_list": used_handler_methods_list,
                       "category": tp.category,
                       "tile_type": tp.class_name,
                       "source_info": ModuleViewerWorker.source_info(tp.module_code)}
        return parsed_data

    @staticmethod
    def source_info(module_code):
        """Describe generated code using the same identity as the tile runtime."""
        source_hash = hashlib.sha256(module_code.encode("utf-8")).hexdigest()
        return {
            "filename": f"/tactic/user-code/{source_hash[:16]}.py",
            "source_hash": source_hash,
            "line_count": len(module_code.splitlines()),
        }

    @task_worthy
    def stop_me(self, _data):
        log.warning("killing me")
        self.kill()
        log.warning("I'm killed")
        return {"success": True}

    def ready(self):
        self.retrieve_handler_methods()
        return

from markupsafe import Markup


def pyrepr(value):
    return Markup(repr(value))

if __name__ == "__main__":
    try:
        app = Flask(__name__)
        app.jinja_env.filters["pyrepr"] = pyrepr
        from service_controls import set_to_redis_log_level
        set_to_redis_log_level()
        log.debug("entering module_viewer_main")
        mworker = ModuleViewerWorker()
        log.debug("mworker is created, about to start", my_id=mworker.my_id)
        mworker.start()
        log.debug("mworker started", my_id=mworker.my_id)
    except Exception:
        log.exception("*** fatal error starting module_viewe ***")
        log.critical("*** exiting due to fatal error ***")
        raise
    while True:
        time.sleep(1000)
