from flask import request, jsonify, send_file, url_for
from flask_login import login_required, current_user

import tactic_app
from tactic_app import app, db
from tactic_app.integrated_docs import api_dict_by_category, api_dict_by_name, ordered_api_categories
from tactic_app.docker_functions import create_container, ContainerCreateError
import re

global_tile_manager = tactic_app.global_tile_manager


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



