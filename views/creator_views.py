from flask import render_template, request, jsonify, send_file, url_for
from flask_login import login_required, current_user
from user_manage_views import ResourceManager

import tactic_app
from tactic_app import app, socketio
from tactic_app.global_tile_management import global_tile_manager
from tactic_app.docker_functions import send_direct_request_to_container
from tactic_app.function_recognizer import get_functions_full_code
import re


@app.route('/get_creator_resource_module_template', methods=['get'])
@login_required
def get_creator_resource_module_template():
    return send_file("templates/creator_resource_module_template.html")

@app.route('/request_update_creator_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_creator_selector_list(res_type):
    if res_type == "option":
        return option_manager.request_update_selector_list()
    elif res_type == "export":
        return export_manager.request_update_selector_list()
    return ""

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
    option_manager.option_dict = res_dict["opt_dict"]
    export_manager.export_list = res_dict["export_list"]

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

    method_manager.extra_code = extra_functions
    return jsonify({"success": True, "option_dict": option_manager.option_dict,
                    "render_template_code": render_template_code,
                    "extra_functions": extra_functions})

class OptionManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/refresh_option_table', "refresh_option_table",
                         login_required(self.refresh_option_table), methods=['get'])
        app.add_url_rule('/delete_option/<option_name>', "delete_option",
                         login_required(self.delete_option), methods=['get', "post"])
        app.add_url_rule('/create_option', "create_option",
                         login_required(self.create_option), methods=['get', "post"])


    def refresh_option_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

    def create_option(self):
        option_name = request.json["option_name"]
        option_type = request.json["option_type"]
        self.option_dict.append({"name": option_name, "type": option_type})
        self.update_selector_list()
        return jsonify({"success": True, "message": "option created"})

    def delete_option(self, option_name):
        new_opt_dict = [opt for opt in self.option_dict if not opt["name"] == option_name]
        self.option_dict = new_opt_dict
        self.update_selector_list()
        return jsonify({"success": True, "message": "option deleted"})

    # noinspection PyMethodOverriding
    def build_resource_array(self):
        fields = ["name", "type", "default", "spec_list", "tags"]
        larray = [["Name", "Type", "Default", "Special List", "Tags"]]
        for opt in self.option_dict:
            for f in fields:
                if f not in opt:
                    opt[f] = ""
            larray.append([opt[f] for f in fields])
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

option_manager = OptionManager("option")
option_manager.option_dict = {}

class ExportManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/refresh_export_table', "refresh_export_table",
                         login_required(self.refresh_export_table), methods=['get'])
        app.add_url_rule('/delete_export/<export_name>', "delete_export",
                         login_required(self.delete_export), methods=['get', "post"])
        app.add_url_rule('/create_export', "create_export",
                         login_required(self.create_export), methods=['get', "post"])


    def refresh_export_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

    def create_export(self):
        export_name = request.json["export_name"]
        self.export_list.append(export_name)
        self.update_selector_list()
        return jsonify({"success": True, "message": "export created"})

    def delete_export(self, export_name):
        self.export_list.remove(export_name)
        self.update_selector_list()
        return jsonify({"success": True, "message": "option deleted"})

    # noinspection PyMethodOverriding
    def build_resource_array(self):
        larray = [["Name"]]
        for exp in self.export_list:
            larray.append([exp])
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

export_manager = ExportManager("export")
export_manager.export_list = {}

class MethodManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/refresh_methods', "refresh_methods",
                         login_required(self.refresh_methods), methods=['get'])
        app.add_url_rule('/get_extra_code', "get_extra_code",
                         login_required(self.get_extra_code), methods=['get'])


    def refresh_methods(self):
        self.update_selector_list()
        return jsonify({"success": True})


    def get_extra_code(self, user_obj=None):
        return jsonify({"success": True, "extra_code": self.extra_code})

    def update_selector_list(self, select=None, user_obj=None):
        if user_obj is None:
            user_obj = current_user

        socketio.emit('update-extra-methods',
                      {"extra_code": self.get_extra_code(user_obj=user_obj)},
                      namespace='/user_manage', room=user_obj.get_id())

method_manager = MethodManager("method")
method_manager.raw_code = ""