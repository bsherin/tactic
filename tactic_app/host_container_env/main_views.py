import io
import datetime
import sys
import copy
import requests

from flask import request, jsonify, render_template, send_file, url_for
from flask_login import current_user, login_required
from flask_socketio import join_room
from tactic_app import app, db, fs, socketio
from library_views import collection_manager
from docker_functions import destroy_container, destroy_child_containers
from users import load_user
from communication_utils import debinarize_python_object
from communication_utils import read_temp_data, delete_temp_data
from exception_mixin import generic_exception_handler
import tactic_app

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

from js_source_management import _develop


# The main window should join a room associated with the user
@socketio.on('connect', namespace='/main')
def connected_msg():
    print("client connected")


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')


@socketio.on('join', namespace='/main')
def on_join(data):
    room = data["room"]
    join_room(room)

    print("user joined room " + room)


@socketio.on('join-main', namespace='/main')
def on_join_main(data):
    room = data["room"]
    join_room(room)

    print("user joined room " + room)
    socketio.emit("joined-mainid", room=room)
    tile_types = tactic_app.host_worker.get_tile_types({"user_id": data["user_id"]})
    return tile_types


@app.route("/register_heartbeat", methods=["GET", "POST"])
@login_required
def register_heartbeat():
    data = request.json
    try:
        tactic_app.health_tracker.update_heartbeat_table(data["main_id"])
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_for_ajax(ex)
    return jsonify({"success": True})


@app.route('/post_from_client', methods=["GET", "POST"])
@login_required
def post_from_client():
    task_packet = request.json
    print("in post_from_client with task_type {}".format(task_packet["task_type"]))
    tactic_app.host_worker.forward_client_post(task_packet)
    return jsonify({"success": True})


def set_mainwindow_property(main_id, prop_name, prop_value):
    tactic_app.host_worker.post_task(main_id, "set_property", {"property": prop_name, "val": prop_value})
    return


def get_mainwindow_property(main_id, prop_name, callback):
    tactic_app.host_worker.post_task(main_id, "get_property", {"property": prop_name}, callback)
    return


@socketio.on('ready-to-begin', namespace='/main')
def on_ready_to_begin(data):
    socketio.emit("begin-post-load", data, namespace='/main', room=data["room"])


@app.route('/load_temp_page/<the_id>', methods=['get', 'post'])
@login_required
def load_temp_page(the_id):
    template_data = read_temp_data(db, the_id)
    delete_temp_data(db, the_id)
    return render_template(template_data["template_name"], **template_data)


@app.route('/export_data', methods=['POST'])
@login_required
def export_data():
    def export_success(result):
        if result["success"]:
            socketio.emit("doFlash", {"alert_type": "alert-success", "message": "Data successfully exported"},
                          namespace='/main', room=data_dict["main_id"])
        user_obj = load_user(data_dict["user_id"])
        # collection_manager.update_selector_list(user_obj=user_obj)
        return
    data_dict = request.json
    export_name = data_dict['export_name']
    tactic_app.host_worker.post_task(data_dict["main_id"], "export_data",
                                     {"export_name": export_name},
                                     export_success)
    return jsonify({"success": True})


@app.route('/figure_source/<tile_id>/<figure_name>', methods=['GET', 'POST'])
@login_required
def figure_source(tile_id, figure_name):
    encoded_img = tactic_app.host_worker.post_and_wait(tile_id, "get_image", {"figure_name": figure_name})["img"]
    img = debinarize_python_object(encoded_img)
    # img = cPickle.loads(encoded_img.decode("utf-8", "ignore").encode("ascii"))
    img_file = io.StringIO()
    img_file.write(img)
    img_file.seek(0)
    return send_file(img_file, mimetype='image/png')


# tactic_todo deal with data_source, part of base_data_url, create_data_source
# @app.route('/data_source/<main_id>/<tile_id>/<data_name>', methods=['GET'])
# @login_required
# def data_source(main_id, tile_id, data_name):
#     try:
#         the_data = shared_dicts.mainwindow_instances[main_id].tile_instances[tile_id].data_dict[data_name]
#         return jsonify({"success": True, "data": the_data})
#     except:
#         error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
#         mainwindow_instances[main_id].handle_exception("Error getting data " + error_string)
#         return jsonify({"success": False})
