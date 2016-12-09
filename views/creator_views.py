from flask import render_template, request, jsonify, send_file, url_for
from flask_login import login_required, current_user
from user_manage_views import ResourceManager

import tactic_app
from tactic_app import app, socketio
from tactic_app.global_tile_management import global_tile_manager
from tactic_app.docker_functions import send_direct_request_to_container
from tactic_app.function_recognizer import get_functions_full_code
import re, sys


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

def remove_indents(the_str, number_indents):
    indent_unit = "    "
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n" + total_indent, "\n", the_str)
    result = re.sub(r"^" + total_indent, "", result)
    return result


@app.route('/parse_code', methods=['GET', 'POST'])
@login_required
def parse_code():
    module_name = request.json["module_name"]
    res_dict = load_tile_module(module_name)
    if not res_dict["success"]:
        return jsonify({"success": False, "message": "Error loading source"})
    res_dict = retrieve_options()
    if not res_dict["success"]:
        return jsonify({"success": False, "message": "Error retrieving options"})
    option_dict = res_dict["opt_dict"]
    export_list = res_dict["export_list"]

    module_code = current_user.get_tile_module(module_name)
    render_template_code = re.findall(r"def render_content.*\n([\s\S]*?)(def|$)", module_code)[0][0]
    # render_template_code = re.sub(r"\n        ", "\n", render_template_code)
    # render_template_code = re.sub(r"^        ", "", render_template_code)
    render_template_code = remove_indents(render_template_code, 2)

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
                    "extra_functions": extra_functions})

class OptionManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/get_option_table', "get_option_table",
                         login_required(self.get_option_table), methods=['get', 'post'])

    # noinspection PyMethodOverriding
    def build_resource_array(self, option_dict):
        fields = ["name", "type", "default", "special_list", "tags"]
        larray = [["Name", "Type", "Default", "Special List", "Tags"]]
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
