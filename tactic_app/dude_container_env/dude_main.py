import os
from gevent import monkey; monkey.patch_all()
from flask import jsonify, request
from flask_cors import CORS
from flask_login import login_user, login_required
from flask_wtf.csrf import CSRFError
import common_data
from common_data import db, app, csrf, socketio
from dude_users import User
import dude_tile_management
import library_views, main_views, module_viewer_views
# import history_viewer_views, tile_differ_views, main_views
import tile_manager, project_manager, collection_manager, list_manager
import dude_workers
from docker_functions import destroy_user_containers
from communication_utils import replace_port

CORS(app)


@app.errorhandler(CSRFError)
def csrf_error(reason):
    print(reason)


socketio.run(app, host="0.0.0.0", port=5000)