import sys
import datetime
from flask import request, jsonify
from flask_login import login_required, current_user
from tactic_app import app, db
from library_views import tile_manager
from module_viewer_views import create_recent_checkpoint
from tactic_app.exception_mixin import generic_exception_handler


def get_checkpoint_history(module_name, include_code=False):
    tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
    checkpoints = []
    history_list = []
    if "history" in tile_dict:
        history = tile_dict["history"]
        for cp in history:
            history_list.append(cp["updated"])
            if include_code:
                checkpoints.append({"updatestring": current_user.localize_time(cp["updated"]).strftime("%b %d, %Y, %H:%M:%S"),
                                    "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S"),
                                    "tile_module": cp["tile_module"]})
            else:
                checkpoints.append({"updatestring": current_user.localize_time(cp["updated"]).strftime("%b %d, %Y, %H:%M:%S"),
                                    "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S")})
    if "recent_history" in tile_dict:
        recent_history = tile_dict["recent_history"]
        for cp in recent_history:
            if cp["updated"] not in history_list:
                if include_code:
                    checkpoints.append({"updatestring": current_user.localize_time(cp["updated"]).strftime("%b %d, %Y, %H:%M:%S"),
                                        "updatestring_for_sort": cp["updated"].strftime("%Y%m%d%H%M%S"),
                                        "tile_module": cp["tile_module"]})
                else:
                    checkpoints.append({"updatestring": current_user.localize_time(cp["updated"]).strftime("%b %d, %Y, %H:%M:%S"),
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
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting checkpoint dates")


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
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting checkpoint code")


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
        mdata["updated"] = datetime.datetime.utcnow()
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata}})
        tile_manager.update_selector_list()
        create_recent_checkpoint(module_name)
        return jsonify({"success": True, "message": "Module Successfully Saved<br>Refresh any open viewers",
                        "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error saving module")
