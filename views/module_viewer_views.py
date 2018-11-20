
import re
import sys
import datetime
import copy
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app, db, use_ssl
from tactic_app.integrated_docs import api_dict_by_category, api_dict_by_name, ordered_api_categories

from library_views import tile_manager
import datetime
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
        return jsonify({"success": True, "message": "Module successfully saved and checkpointed",
                        "alert_type": "alert-success"})

    except:
        error_string = "Error checkpointing module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


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

    except:
        error_string = "Error checkpointing module to recent" + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/checkpoint_to_recent', methods=['post'])
@login_required
def checkpoint_to_recent():
    data_dict = request.json
    module_name = data_dict["module_name"]
    return create_recent_checkpoint(module_name)


@app.route('/show_history_viewer/<module_name>', methods=['get', 'post'])
@login_required
def show_history_viewer(module_name):
    button_groups = [[{"name": "save_button", "button_class": "btn-outline-secondary", "name_text": "Save", "icon_name": "save"}]]
    javascript_source = url_for('static', filename='tactic_js/history_viewer.js')
    return render_template("library/resource_viewer.html",
                           resource_name=module_name,
                           include_metadata=False,
                           include_above_main_area=True,
                           include_right=False,
                           readonly=False,
                           is_repository=False,
                           use_ssl=use_ssl,
                           javascript_source=javascript_source,
                           uses_codemirror="True",
                           button_groups=button_groups, version_string=tstring)


@app.route('/get_api_dict', methods=['GET', 'POST'])
@login_required
def get_api_dict():
    return jsonify({"success": True, "api_dict_by_name": api_dict_by_name,
                    "api_dict_by_category": api_dict_by_category,
                    "ordered_api_categories": ordered_api_categories})


@app.route('/show_tile_differ/<module_name>', methods=['get', 'post'])
@login_required
def show_tile_differ(module_name):
    button_groups = [[{"name": "save_button", "button_class": "btn-outline-secondary", "name_text": "Save", "icon_name": "save"}]]
    javascript_source = url_for('static', filename='tactic_js/tile_differ.js')
    return render_template("library/resource_viewer.html",
                           resource_name=module_name,
                           include_metadata=False,
                           include_above_main_area=True,
                           include_right=False,
                           readonly=False,
                           is_repository=False,
                           use_ssl=use_ssl,
                           javascript_source=javascript_source,
                           uses_codemirror="True",
                           button_groups=button_groups, version_string=tstring)


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
        mdata["tags"] = data_dict["tags"]
        mdata["notes"] = data_dict["notes"]
        mdata["updated"] = datetime.datetime.utcnow()
        mdata["last_viewer"] = last_saved
        mdata["type"] = ""
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata,
                                                                   "last_saved": last_saved}})
        create_recent_checkpoint(module_name)
        tile_manager.update_selector_list()
        tile_manager.send_tile_source_changed_message({'user_id': current_user.get_id(), 'tile_type': module_name})
        return jsonify({"success": True, "message": "Module Successfully Saved",
                        "alert_type": "alert-success"})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
