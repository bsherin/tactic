import sys
import datetime
from flask import request, jsonify
from flask_login import login_required, current_user
from tactic_app import app, db
from module_viewer_views import create_recent_checkpoint
from exception_mixin import generic_exception_handler


def get_checkpoint_history(module_name, include_code=False):
    tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
    checkpoints = []
    history_list = []
    if "history" in tile_dict:
        history = tile_dict["history"]
        for cp in history:
            history_list.append(cp["updated"])
            updatestring, updatestring_for_sort = current_user.get_timestrings(cp["updated"])
            if include_code:
                checkpoints.append({"updatestring": updatestring,
                                    "updatestring_for_sort": updatestring_for_sort,
                                    "tile_module": cp["tile_module"]})
            else:
                checkpoints.append({"updatestring": updatestring,
                                    "updatestring_for_sort": updatestring_for_sort})
    if "recent_history" in tile_dict:
        recent_history = tile_dict["recent_history"]
        for cp in recent_history:
            if cp["updated"] not in history_list:
                updatestring, updatestring_for_sort = current_user.get_timestrings(cp["updated"])
                if include_code:
                    checkpoints.append({"updatestring": updatestring,
                                        "updatestring_for_sort": updatestring_for_sort,
                                        "tile_module": cp["tile_module"]})
                else:
                    checkpoints.append({"updatestring": updatestring,
                                        "updatestring_for_sort": updatestring_for_sort})

    checkpoints.sort(key=lambda x: x["updatestring_for_sort"])
    checkpoints.reverse()
    return checkpoints

