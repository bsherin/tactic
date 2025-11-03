
import datetime
import sys
import copy
import re
import os
import uuid
import pymongo
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app
from docker_functions import create_container

from js_source_management import js_source_dict, _develop, css_source

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

@app.route('/view_module/<module_name>', methods=['get'])
@login_required
def view_module(module_name):
    # self.clear_old_recent_history(module_name)
    javascript_source = url_for('static', filename=js_source_dict["module_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=module_name,
                           is_repository=False,
                           read_only=False,
                           develop=str(_develop),
                           has_openapi_key=current_user.has_openapi_key,
                           css_source=css_source("module_viewer_react"),
                           javascript_source=javascript_source,
                           version_string=tstring)

@app.route('/last_saved_view/<module_name>', methods=['get'])
@login_required
def last_saved_view(module_name):
    tile_dict = current_user.get_tile_doc(module_name)
    if "last_saved" in tile_dict and tile_dict["last_saved"] == "creator":
        result = view_in_creator(module_name)
    else:
        result = view_module(module_name)
    return result

@app.route("/get_api_html", methods=['get', 'post'])
def get_api_html():
    return jsonify({"success": True, "api_html": api_html})


@app.route('/view_in_creator/<module_name>', methods=['get'])
@login_required
def view_in_creator(module_name):
    return render_template("library/tile_creator_react.html",
                           module_name=module_name,
                           is_repository=False,
                           read_only=False,
                           line_number=0,
                           css_source=css_source("tile_creator_react"),
                           module_source=js_source_dict["tile_creator_react"],
                           develop=str(_develop),
                           has_openapi_key=current_user.has_openapi_key,
                           version_string=tstring, )

@app.route('/view_location_in_creator/<module_name>/<line_number>', methods=['get'])
@login_required
def view_location_in_creator(module_name, line_number):
    return render_template("library/tile_creator_react.html",
                           module_name=module_name,
                           line_number=line_number,
                           css_source=css_source("tile_creator_react"),
                           module_source=js_source_dict["tile_creator_react"],
                           develop=str(_develop),
                           has_openapi_key=current_user.has_openapi_key,
                           version_string=tstring, )

@app.route('/add_tile_module', methods=['get', 'post'])
@login_required
def add_tile_module():
    user_obj = current_user
    f = request.files['file']
    if user_obj.tile_module_name_exists(f.filename):
        return jsonify({"success": False, "alert_type": "alert-warning",
                        "message": "A module with that name already exists"})
    the_module = f.read()
    metadata = user_obj.create_initial_metadata()
    tp = TileParser(the_module)
    metadata["type"] = tp.type
    the_user.create_tile_from_data(f.filename, the_module, metadata=metadata)
    return jsonify({"success": True})

@app.route('/repository_view_module/<module_name>', methods=['get', 'post'])
def repository_view_module(module_name):
    javascript_source = url_for('static', filename=js_source_dict["module_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=module_name,
                           include_metadata=True,
                           include_right=True,
                           include_above_main_area=False,
                           read_only=True,
                           is_repository=True,
                           develop=str(_develop),
                           css_source=css_source("module_viewer_react"),
                           javascript_source=javascript_source,
                           version_string=tstring)
