import re
import sys
import datetime
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app, db
from tactic_app.tile_code_parser import get_functions_full_code, get_starting_lines
from user_manage_views import tile_manager
from module_viewer_views import create_recent_checkpoint


def get_checkpoint_history(module_name, include_code=False):
    tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
    checkpoints = []
    history_list = []
    if "history" in tile_dict:
        history = tile_dict["history"]
        for cp in history:
            history_list.append(cp["updated"])
            if include_code:
                checkpoints.append({"updatestring": cp["updated"].strftime("%b %d, %Y, %H:%M:%S"),
                                    "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S"),
                                    "tile_module": cp["tile_module"]})
            else:
                checkpoints.append({"updatestring": cp["updated"].strftime("%b %d, %Y, %H:%M:%S"),
                                    "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S")})
    if "recent_history" in tile_dict:
        recent_history = tile_dict["recent_history"]
        for cp in recent_history:
            if cp["updated"] not in history_list:
                if include_code:
                    checkpoints.append({"updatestring": cp["updated"].strftime("%b %d, %Y, %H:%M:%S"),
                                        "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S"),
                                        "tile_module": cp["tile_module"]})
                else:
                    checkpoints.append({"updatestring": cp["updated"].strftime("%b %d, %Y, %H:%M:%S"),
                                        "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S")})

    checkpoints.sort(key=lambda x: x["updatestring_for_sort"])
    checkpoints.reverse()
    return checkpoints

@app.route('/get_checkpoint_dates', methods=['post'])
@login_required
def get_checkpoint_dates():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        checkpoints = get_checkpoint_history(module_name, False)
        if len(checkpoints) == 0:
            return jsonify({"success": False, "message": "no history found", "alert_type": "alert-warning"})
        return jsonify({"success": True, "checkpoints": checkpoints})
    except:
        error_string = "Error getting checktpoint dates " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/get_checkpoint_code', methods=['post'])
@login_required
def get_checkpoint_code():
    try:
        data_dict = request.json
        updatestring_for_sort = data_dict["updatestring_for_sort"]
        module_name = data_dict["module_name"]
        checkpoints = get_checkpoint_history(module_name, True)
        for cp in checkpoints:
            if cp["updatestring_for_sort"] == updatestring_for_sort:
                return jsonify({"success": True, "module_code": cp["tile_module"]})
        return jsonify({"success": False, "message": "Checkpoint not found", "alert_type": "alert-warning"})

    except:
        error_string = "Error getting checktpoint code " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/update_from_left', methods=['post'])
@login_required
def update_from_left():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        module_code = data_dict["module_code"]
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["updated"] = datetime.datetime.today()
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata}})
        tile_manager.update_selector_list()
        create_recent_checkpoint(module_name)
        return jsonify({"success": True, "message": "Module Successfully Saved<br>Refresh any open viewers",
                        "alert_type": "alert-success"})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
