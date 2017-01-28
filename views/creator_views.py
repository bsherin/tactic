from flask import request, jsonify, send_file, url_for
from flask_login import login_required, current_user
from user_manage_views import ResourceManager
from module_viewer_views import remove_indents

import tactic_app
from tactic_app import app, db, socketio
from tactic_app.global_tile_management import global_tile_manager
from tactic_app.docker_functions import send_direct_request_to_container
from tactic_app.tile_code_parser import get_functions_full_code, get_assignments_from_init, get_base_classes
from tactic_app.integrated_docs import api_array, api_dict_by_category, api_dict_by_name, ordered_api_categories
import re, sys, datetime


def creator_load_source(module_name):
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


def grab_metadata(module_name):
    user_obj = current_user
    doc = db[user_obj.tile_collection_name].find_one({"tile_module_name": module_name})
    if "metadata" in doc:
        mdata = doc["metadata"]
    else:
        mdata = {"datestring": "", "tags": "", "notes": ""}
    return mdata

@app.route('/get_api_dict', methods=['GET', 'POST'])
@login_required
def get_api_dict():
    return jsonify({"success": True, "api_dict_by_name": api_dict_by_name,
                    "api_dict_by_category": api_dict_by_category,
                    "ordered_api_categories": ordered_api_categories})

@app.route('/parse_code/<module_name>', methods=['GET', 'POST'])
@login_required
def parse_code(module_name):
    res_dict = creator_load_source(module_name)
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
    default_dict = get_assignments_from_init(module_code)
    for option in option_dict:
        if option["name"] in default_dict:
            option["default"] = default_dict[option["name"]]

    func_dict = get_functions_full_code(module_code)
    if "render_content" in func_dict:
        render_content_code = func_dict["render_content"]
        render_content_code = re.sub("([\s\S]*?\n    def [\S\s]*?\: *?\n)", "", render_content_code)
        render_content_code = remove_indents(render_content_code, 2)
    else:
        render_content_code = ""

    base_classes = get_base_classes(module_code)
    is_mpl = "MplFigure" in base_classes

    if is_mpl and "draw_plot" in func_dict:
            draw_plot_code = func_dict["draw_plot"]
            draw_plot_code = re.sub("([\s\S]*?\n    def [\S\s]*?\: *?\n)", "", draw_plot_code)
            draw_plot_code = remove_indents(draw_plot_code, 2)
    else:
        draw_plot_code = ""

    extra_functions = ""
    for func_name, func_code in func_dict.items():
        if func_name not in ["__init__", "render_content", "options"]:
            if is_mpl and func_name == "draw_plot":
                continue
            if len(extra_functions) != 0 and extra_functions[-1] != "\n":
                extra_functions += "\n"
            extra_functions += func_code

    extra_functions = remove_indents(extra_functions, 1)
    start_stuff = re.findall(r"([\s\S]*?)def render_content", module_code)
    if len(start_stuff) > 0:
        render_content_line_number = start_stuff[0].count("\n") + 1
    else:
        render_content_line_number = 0

    start_dp_stuff = re.findall(r"([\s\S]*?)def draw_plot", module_code)
    if len(start_dp_stuff) > 0:
        draw_plot_line_number = start_dp_stuff[0].count("\n") + 1
    else:
        draw_plot_line_number = 0

    parsed_data = {"option_dict": option_dict, "export_list": export_list,
                    "render_content_code": render_content_code,
                    "extra_functions": extra_functions,
                    "category": category,
                    "metadata": mdata,
                    "is_mpl": is_mpl,
                    "draw_plot_code": draw_plot_code,
                    "render_content_line_number": render_content_line_number,
                    "draw_plot_line_number": draw_plot_line_number}

    return jsonify({"success": True, "the_content": parsed_data})

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
        if len(option_dict) == 0:
            result = "No options defined."
        else:
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
        if len(export_list) == 0:
            result = "No exports defined."
        else:
            res_array = self.build_resource_array(export_list)
            result = self.build_html_table_from_data_list(res_array)
        return jsonify({"success": True, "html": result})


export_manager = ExportManager("export")

class MethodManager(ResourceManager):

    def add_rules(self):
        pass


method_manager = MethodManager("method")
