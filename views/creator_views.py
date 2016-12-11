from flask import render_template, request, jsonify, send_file, url_for
from flask_login import login_required, current_user
from user_manage_views import ResourceManager, tile_manager

import tactic_app
from tactic_app import app, db, socketio
from tactic_app.global_tile_management import global_tile_manager
from tactic_app.docker_functions import send_direct_request_to_container
from tactic_app.function_recognizer import get_functions_full_code, get_assignments_from_init
import re, sys, datetime


@app.route('/get_creator_resource_module_template', methods=['get'])
@login_required
def get_creator_resource_module_template():
    return send_file("templates/creator_resource_module_template.html")


def load_tile_module(module_name):
    user_obj = current_user
    tile_module = user_obj.get_tile_module(module_name)

    result = send_direct_request_to_container(global_tile_manager.test_tile_container_id, "load_source",
                                              {"tile_code": tile_module,
                                               "megaplex_address": tactic_app.megaplex_address})
    res_dict = result.json()

    return res_dict

def retrieve_options():
    result = send_direct_request_to_container(global_tile_manager.test_tile_container_id, "get_options",
                                              {})
    res_dict = result.json()
    return res_dict


indent_unit = "    "
def remove_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n" + total_indent, "\n", the_str)
    result = re.sub(r"^" + total_indent, "", result)
    return result

def insert_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n", r"\n" + total_indent, the_str)
    result = total_indent + result
    return result

def build_code(data_dict):
    export_list = data_dict["exports"]
    export_list_of_dicts = [{"name": exp_name} for exp_name in export_list]
    extra_methods = insert_indents(data_dict["extra_methods"], 1)
    render_content_body = insert_indents(data_dict["render_content_body"], 2)
    options = data_dict["options"]
    for opt_dict in options:
        if "default" not in opt_dict:
            opt_dict["default"] = "None"
        elif isinstance(opt_dict["default"], basestring):
            opt_dict["default"] = '"' + opt_dict["default"] + '"'
        opt_dict["default"] = str(opt_dict["default"])
        if "special_list" in opt_dict:
            opt_dict["special_list"] = "[" + opt_dict["special_list"] + "]"
    full_code = render_template("user_manage/tile_creator_template",
                                class_name=data_dict["module_name"],
                                category=data_dict["category"],
                                exports=export_list_of_dicts,
                                options=data_dict["options"],
                                extra_methods=extra_methods,
                                render_content_body=render_content_body)
    return full_code

@app.route('/creator_update_module', methods=['post'])
@login_required
def creator_update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        module_code = build_code(data_dict)
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = data_dict["tags"]
        mdata["notes"] = data_dict["notes"]
        mdata["updated"] = datetime.datetime.today()

        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata}})
        tile_manager.update_selector_list()
        return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


def grab_metadata(module_name):
    user_obj = current_user
    doc = db[user_obj.tile_collection_name].find_one({"tile_module_name": module_name})
    if "metadata" in doc:
        mdata = doc["metadata"]
    else:
        mdata = {"datestring": "", "tags": "", "notes": ""}
    return mdata

@app.route('/parse_code', methods=['GET', 'POST'])
@login_required
def parse_code():
    module_name = request.json["module_name"]
    res_dict = load_tile_module(module_name)
    if not res_dict["success"]:
        return jsonify({"success": False, "message": "Error loading source"})
    category = res_dict["category"]
    res_dict = retrieve_options()
    if not res_dict["success"]:
        return jsonify({"success": False, "message": "Error retrieving options"})
    option_dict = res_dict["opt_dict"]
    export_list = res_dict["export_list"]

    mdata = grab_metadata(module_name)

    module_code = current_user.get_tile_module(module_name)
    render_template_code = re.findall(r"def render_content.*\n([\s\S]*?)(def|$)", module_code)[0][0]
    render_template_code = remove_indents(render_template_code, 2)

    default_dict = get_assignments_from_init(module_code)
    for option in option_dict:
        if option["name"] in default_dict:
            option["default"] = default_dict[option["name"]]

    func_dict = get_functions_full_code(module_code)
    extra_functions = ""
    for func_name, func_code in func_dict.items():
        if func_name not in ["__init__", "render_content", "options"]:
            if len(extra_functions) != 0 and extra_functions[-1] != "\n":
                extra_functions += "\n"
            extra_functions += func_code

    extra_functions = remove_indents(extra_functions, 1)

    return jsonify({"success": True, "option_dict": option_dict, "export_list": export_list,
                    "render_template_code": render_template_code,
                    "extra_functions": extra_functions,
                    "category": category,
                    "metadata": mdata})

class OptionManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/get_option_table', "get_option_table",
                         login_required(self.get_option_table), methods=['get', 'post'])

    # noinspection PyMethodOverriding
    def build_resource_array(self, option_dict):
        fields = ["name", "type", "default", "special_list", "tag"]
        larray = [["Name", "Type", "Default", "Special List", "Tag"]]
        for opt in option_dict:
            for f in fields:
                if f not in opt:
                    opt[f] = ""
            larray.append([str(opt[f]) for f in fields])
        return larray

    def get_option_table(self):
        option_dict = request.json["option_dict"]
        res_array = self.build_resource_array(option_dict)
        result = self.build_html_table_from_data_list(res_array)
        return jsonify({"success": True, "html": result})


option_manager = OptionManager("option")

class ExportManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/get_export_table', "get_export_table",
                         login_required(self.get_export_table), methods=['get', 'post'])

    # noinspection PyMethodOverriding
    def build_resource_array(self, export_list):
        larray = [["Name"]]
        for exp in export_list:
            larray.append([exp])
        return larray

    def get_export_table(self):
        export_list = request.json["export_list"]
        res_array = self.build_resource_array(export_list)
        result = self.build_html_table_from_data_list(res_array)
        return jsonify({"success": True, "html": result})


export_manager = ExportManager("export")

class MethodManager(ResourceManager):

    def add_rules(self):
        pass


method_manager = MethodManager("method")
