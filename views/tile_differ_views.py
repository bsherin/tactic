import sys
import datetime
from flask import request, jsonify
from flask_login import login_required, current_user
from tactic_app import app, db
from user_manage_views import tile_manager
from module_viewer_views import create_recent_checkpoint


@app.route('/get_tile_names', methods=['get', 'post'])
@login_required
def get_tile_names():
    tile_names = current_user.tile_module_names
    return jsonify({"success": True, "tile_names": tile_names})