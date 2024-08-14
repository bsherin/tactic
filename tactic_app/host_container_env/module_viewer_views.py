
import re
import sys
import datetime
import copy
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app, db
from exception_mixin import generic_exception_handler

from library_views import tile_manager
import datetime
from js_source_management import _develop, js_source_dict, css_source

tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")
indent_unit = "    "


@app.route('/checkpoint_module', methods=['post'])
@login_required
def checkpoint_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "history" in tile_dict:
            history = tile_dict["history"]
        else:
            history = []
        history.append({"updated": tile_dict["metadata"]["updated"],
                        "tile_module": tile_dict["tile_module"]})
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"history": history}})
        result = jsonify({"success": True, "message": "Module successfully saved and checkpointed",
                          "alert_type": "alert-success"})
    except Exception as ex:
        result = generic_exception_handler.get_exception_for_ajax(ex, "Error checkpointing module")

    return result


def create_recent_checkpoint(module_name):
    try:
        tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "recent_history" in tile_dict:
            recent_history = tile_dict["recent_history"]
        else:
            recent_history = []
        recent_history.append({"updated": tile_dict["metadata"]["updated"],
                               "tile_module": tile_dict["tile_module"]})
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"recent_history": recent_history}})
        return jsonify({"success": True})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error checkpointing module to recent")


@app.route('/checkpoint_to_recent', methods=['post'])
@login_required
def checkpoint_to_recent():
    data_dict = request.json
    module_name = data_dict["module_name"]
    return create_recent_checkpoint(module_name)


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
                           theme=user_obj.get_theme(),
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
                           theme=user_obj.get_theme(),
                           version_string=tstring)

tile_mdata_fields = ["tags", "notes", "icon", "category", "couple_save_attrs_and_exports"]

@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        last_saved = data_dict["last_saved"]
        module_code = data_dict["new_code"]

        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        print("got mdata " + str(mdata))
        for field in tile_mdata_fields:
            if field in data_dict:
                mdata[field] = data_dict[field]

        mdata["updated"] = datetime.datetime.utcnow()
        mdata["last_viewer"] = last_saved
        mdata["type"] = ""
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata,
                                                                   "last_saved": last_saved}})
        create_recent_checkpoint(module_name)
        return jsonify({"success": True, "message": "Module Successfully Saved",
                        "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error saving module")
