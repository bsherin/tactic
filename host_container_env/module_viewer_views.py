
import re
import sys
import datetime
import copy
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app
from exception_mixin import generic_exception_handler
import datetime
from js_source_management import _develop, js_source_dict, css_source

tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")
indent_unit = "    "


@app.route('/show_history_viewer/<module_name>', methods=['get', 'post'])
@login_required
def show_history_viewer(module_name):
    user_obj = current_user
    javascript_source = url_for('static', filename=js_source_dict["history_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=module_name,
                           develop=str(_develop),
                           css_source=css_source("history_viewer_react"),
                           javascript_source=javascript_source,
                           uses_codemirror="True",
                           version_string=tstring)


@app.route('/get_api_dict', methods=['GET', 'POST'])
@login_required
def get_api_dict():
    from integrated_docs import api_dict_by_category, api_dict_by_name, ordered_api_categories
    from integrated_docs import object_api_dict_by_category, ordered_object_categories
    return jsonify({"success": True, "api_dict_by_name": api_dict_by_name,
                    "api_dict_by_category": api_dict_by_category,
                    "ordered_api_categories": ordered_api_categories,
                    "object_api_dict_by_category": object_api_dict_by_category,
                    "ordered_object_categories": ordered_object_categories})


@app.route('/show_tile_differ/<module_name>', defaults={'second_module_name': "none"})
@app.route('/show_tile_differ/both_names/<module_name>/<second_module_name>')
@login_required
def show_tile_differ(module_name, second_module_name):
    user_obj = current_user
    javascript_source = url_for('static', filename=js_source_dict["tile_differ_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=module_name,
                           second_resource_name=second_module_name,
                           develop=str(_develop),
                           javascript_source=javascript_source,
                           css_source=css_source("tile_differ_react"),
                           uses_codemirror="True",
                           version_string=tstring)
