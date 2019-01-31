
from gevent import monkey; monkey.patch_all()
import copy
import datetime
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy
# noinspection PyUnresolvedReferences
import pymongo
import qworker
from flask import render_template, Flask
from tile_code_parser import TileParser, remove_indents, insert_indents

import sys, os
sys.stdout = sys.stderr
import time

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

mongo_uri = os.environ.get("MONGO_URI")


# noinspection PyUnusedLocal
class ModuleViewerWorker(QWorker):
    def __init__(self):
        print("about to initialize QWorker")
        QWorker.__init__(self)
        print("QWorker initialized")
        self.tp = None
        self.tstring = None
        self.module_name = None
        self.user_id = None
        self.db = None
        self.tile_collection_name = None
        self.tile_instance = None
        return

    @task_worthy
    def initialize_parser(self, data_dict):
        self.tstring = data_dict["version_string"]
        self.module_name = data_dict["module_name"]
        self.user_id = data_dict["user_id"]
        try:
            client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
            client.server_info()
            # noinspection PyUnresolvedReferences
            self.db = client[db_name]
        except:
            error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            print(error_string)
            self.mworker.debug_log("error getting pymongo client: " + error_string)
            sys.exit()
        self.tile_collection_name = data_dict["tile_collection_name"]
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": self.module_name})
        module_code = tile_dict["tile_module"]
        self.user_id = os.environ.get("OWNER")
        self.tp = TileParser(module_code)
        self.tp.reparse(self.tp.rebuild_in_canonical_form())
        return {"success": True, "the_content": self.assemble_parse_information()}

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is a tile communicating'}

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string = "<pre>" + error_string + "</pre>"
        print(error_string)
        return {"success": False, "message_string": error_string}

    @task_worthy
    def reintiailize_parser(self, data_dict):
        module_code = data_dict["new_module_code"]
        self.tp.reparse(module_code)
        return {"success": True, "the_content": self.assemble_parse_information()}

    def build_code(self, data_dict):
        export_list = data_dict["exports"]
        export_list_of_dicts = [{"name": exp["name"], "tags": exp["tags"]} for exp in
                                export_list]  # tactic_todo what does this accomplish?
        extra_methods = insert_indents(data_dict["extra_methods"], 1)
        render_content_body = insert_indents(data_dict["render_content_body"], 2)
        if data_dict["is_mpl"]:
            draw_plot_body = insert_indents(data_dict["draw_plot_body"], 2)
        else:
            draw_plot_body = ""
        options = data_dict["options"]
        for opt_dict in options:
            if "default" not in opt_dict:
                opt_dict["default"] = "None"
            elif isinstance(opt_dict["default"], str):
                opt_dict["default"] = '"' + opt_dict["default"] + '"'
            opt_dict["default"] = str(opt_dict["default"])
            if "special_list" in opt_dict:
                opt_dict["special_list"] = str(opt_dict["special_list"])
        with app.test_request_context():
            full_code = render_template("tile_creator_template.html",
                                        class_name=data_dict["module_name"],
                                        category=data_dict["category"],
                                        exports=export_list_of_dicts,
                                        options=data_dict["options"],
                                        is_mpl=data_dict["is_mpl"],
                                        is_d3=data_dict["is_d3"],
                                        jscript_code=data_dict["jscript_body"],
                                        extra_methods=extra_methods,
                                        render_content_body=render_content_body,
                                        draw_plot_body=draw_plot_body,
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

    @task_worthy
    def update_module(self, data_dict):
        try:
            module_name = data_dict["module_name"]
            module_code = self.build_code(data_dict)
            self.tp.reparse(module_code)
            render_content_line_number = self.tp.get_starting_line("render_content")
            draw_plot_line_number = self.tp.get_starting_line("draw_plot")
            if len(self.tp.extra_methods.keys()) == 0:
                if draw_plot_line_number is None:
                    extra_methods_line_number = render_content_line_number - 1
                else:
                    extra_methods_line_number = draw_plot_line_number - 1
            else:
                extra_methods_line_number = self.tp.get_starting_line(list(self.tp.extra_methods)[0])
            doc = self.db[self.tile_collection_name].find_one({"tile_module_name": module_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = data_dict["tags"]
            mdata["notes"] = data_dict["notes"]
            mdata["updated"] = datetime.datetime.utcnow()
            mdata["last_viewer"] = data_dict["last_saved"]
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
            self.post_task("host", "update_tile_selector_list", {'user_id': self.user_id})
            self.post_task("host", "send_tile_source_changed_message", {'user_id': self.user_id,
                                                                        'tile_type': self.module_name})
            return {"success": True, "message": "Module Successfully Saved",
                    "alert_type": "alert-success", "render_content_line_number": render_content_line_number,
                    "draw_plot_line_number": draw_plot_line_number,
                    "extra_methods_line_number": extra_methods_line_number}
        except:
            error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return {"success": False, "message": error_string, "alert_type": "alert-warning"}

    def assemble_parse_information(self):
        for option in self.tp.options:
            if option["name"] in self.tp.defaults:
                option["default"] = self.tp.defaults[option["name"]]

        func_dict = self.tp.methods
        if "render_content" in func_dict:
            render_content_code = func_dict["render_content"]["method_body"]
            render_content_code = remove_indents(render_content_code, 2)
        else:
            render_content_code = ""

        is_mpl = self.tp.is_mpl
        is_d3 = self.tp.is_d3

        if is_mpl and "draw_plot" in func_dict:
            draw_plot_code = func_dict["draw_plot"]["method_body"]
            draw_plot_code = remove_indents(draw_plot_code, 2)
        else:
            draw_plot_code = ""
        if is_d3 and "jscript" in self.tp.defaults:
            jscript_code = self.tp.defaults["jscript"]
        else:
            jscript_code = ""

        extra_functions = remove_indents(self.tp.get_extra_methods_string(), 1)

        render_content_line_number = self.tp.get_starting_line("render_content")
        draw_plot_line_number = self.tp.get_starting_line("draw_plot")
        if len(self.tp.extra_methods.keys()) == 0:
            if draw_plot_line_number is None:
                extra_methods_line_number = render_content_line_number - 1
            else:
                extra_methods_line_number = draw_plot_line_number - 1
        else:
            extra_methods_line_number = self.tp.get_starting_line(list(self.tp.extra_methods)[0])

        parsed_data = {"option_dict": self.tp.options, "export_list": self.tp.exports,
                       "render_content_code": render_content_code,
                       "extra_functions": extra_functions,
                       "category": self.tp.category,
                       "is_mpl": is_mpl,
                       "is_d3": is_d3,
                       "draw_plot_code": draw_plot_code,
                       "jscript_code": jscript_code,
                       "render_content_line_number": render_content_line_number,
                       "draw_plot_line_number": draw_plot_line_number,
                       "extra_methods_line_number": extra_methods_line_number}
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
    def stop_me(self, data):
        print("killing me")
        self.kill()
        print("I'm killed")
        return {"success": True}

    def build_html_table_from_data_list(self, data_list, res_type, title=None):
        the_html = "<table class='tile-table table sortable table-striped table-bordered table-sm'>"
        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            the_html += "<tr class='selector-button' value='{1}' >".format(res_type, r[0])
            for c in r:
                if isinstance(c, list):
                    the_html += "<td sorttable_customkey='{0}'>{1}</td>".format(c[1], c[0])
                else:
                    the_html += "<td>{0}</td>".format(c)
            the_html += "</tr>"

        the_html += "</tbody></table>"
        return the_html

    @task_worthy
    def get_option_table(self, data_dict):
        option_dict = data_dict["option_dict"]
        if len(option_dict) == 0:
            result = "No options defined."
        else:
            res_array = self.build_option_resource_array(option_dict)
            res_array[0] = res_array[0] + [""]
            for i in range(len(res_array))[1:]:
                res_array[i] = res_array[i] + ['<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>']
            result = self.build_html_table_from_data_list(res_array, "option")
        return {"success": True, "html": result}

    def build_option_resource_array(self, option_dict):
        fields = ["name", "type", "default", "special_list", "tags"]
        larray = [["Name", "Type", "Default", "Special List", "Tags"]]
        for opt in option_dict:
            for f in fields:
                if f not in opt:
                    opt[f] = ""
            larray.append([str(opt[f]) for f in fields])
        return larray

    @task_worthy
    def get_export_table(self, data_dict):
        export_list = data_dict["export_list"]
        if len(export_list) == 0:
            result = "No exports defined."
        else:
            res_array = self.build_export_resource_array(export_list)
            res_array[0] = res_array[0] + [""]
            for i in range(len(res_array))[1:]:
                res_array[i] = res_array[i] + ['<span class="ui-icon ui-icon-arrowthick-2-n-s"></span>']
            result = self.build_html_table_from_data_list(res_array, "export")
        return {"success": True, "html": result}

    def build_export_resource_array(self, export_list):
        larray = [["Name", "Tags"]]
        for exp in export_list:
            larray.append([exp["name"], exp["tags"]])
        return larray


if __name__ == "__main__":
    print("entering main")
    mworker = ModuleViewerWorker()
    print("mworker is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    app = Flask(__name__)
    while True:
        time.sleep(1000)
