from flask import render_template, request, jsonify, send_file, url_for
from flask_login import login_required, current_user
from user_manage_views import ResourceManager

from tactic_app import app
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
    # elif res_type == "export":
    #     return export_manager.request_update_selector_list()
    return ""


@app.route('/parse_code', methods=['GET', 'POST'])
@login_required
def parse_code():
    user_obj = current_user
    module_name = request.json["module_name"]
    module_code = user_obj.get_tile_module(module_name)
    option_code = re.findall(r"(def options[\s\S]*?)def", module_code)[0]
    exec(option_code) # tactic_todo this is unsafe as is. also it won't work if non-literals are there
    option_manager.option_dict = options("")
    render_template_code = re.findall(r"def render_content.*\n([\s\S]*?)(def|$)", module_code)[0][0]
    render_template_code = re.sub(r"\n        ", "\n", render_template_code)
    render_template_code = re.sub(r"^        ", "", render_template_code)
    return jsonify({"success": True, "option_dict": option_manager.option_dict, "render_template_code": render_template_code})

class OptionManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/refresh_option_table', "refresh_option_table",
                         login_required(self.refresh_option_table), methods=['get'])


    def refresh_option_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

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