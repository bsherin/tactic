import cPickle
import cStringIO
import datetime
import sys
import copy
import requests

import openpyxl
from bson.binary import Binary
from flask import request, jsonify, render_template, send_file, url_for
from flask_login import current_user, login_required
from flask_socketio import join_room
from tactic_app import app, db, fs, socketio
from user_manage_views import collection_manager
from tactic_app.docker_functions import destroy_container, destroy_child_containers
from tactic_app.users import load_user
from tactic_app.communication_utils import send_request_to_megaplex
import tactic_app


# The main window should join a room associated with the user
@socketio.on('connect', namespace='/main')
def connected_msg():
    print"client connected"

@socketio.on('connect', namespace='/main')
def connected_msg():
    print"client connected"

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

@socketio.on('join', namespace='/main')
def on_join(data):
    room = data["room"]
    join_room(room)

    print "user joined room " + room

@socketio.on('join-main', namespace='/main')
def on_join_main(data):
    room = data["room"]
    join_room(room)

    print "user joined room " + room
    socketio.emit("joined-mainid", room=room)

@socketio.on('ready-to-begin', namespace='/main')
def on_ready_to_begin(data):
    socketio.emit("begin-post-load", data, namespace='/main', room=data["room"])

@app.route("/register_heartbeat", methods=["GET", "POST"])
@login_required
def register_heartbeat():
    data = request.json
    tactic_app.client_worker.update_heartbeat_table(data["main_id"])
    return jsonify({"success": True})

@app.route('/post_from_client', methods=["GET", "POST"])
@login_required
def post_from_client():
    task_packet = request.json
    tactic_app.client_worker.forward_client_post(task_packet)
    return jsonify({"success": True})


@app.route('/get_menu_template', methods=['get'])
@login_required
def get_menu_template():
    return send_file("templates/menu_template.html")


@app.route('/get_table_templates', methods=['get'])
@login_required
def get_table_templates():
    return send_file("templates/table_templates.html")


def set_mainwindow_property(main_id, prop_name, prop_value):
    tactic_app.host_worker.post_task(main_id, "set_property", {"property": prop_name, "val": prop_value})
    return


def get_mainwindow_property(main_id, prop_name, callback):
    tactic_app.host_worker.post_task(main_id, "get_property", {"property": prop_name}, callback)
    return


@app.route('/load_temp_page/<the_id>', methods=['get', 'post'])
@login_required
def load_temp_page(the_id):
    template_data = tactic_app.host_worker.temp_dict[the_id]
    del tactic_app.host_worker.temp_dict[the_id]
    return render_template(template_data["template_name"], **template_data)


@app.route('/export_data', methods=['POST'])
@login_required
def export_data():
    def export_success(result):
        if result["success"]:
            socketio.emit("doFlash", {"alert_type": "alert-success", "message": "Data successfully exported"},
                          namespace='/main', room=data_dict["main_id"])
        user_obj = load_user(data_dict["user_id"])
        collection_manager.update_selector_list(user_obj=user_obj)
        return
    data_dict = request.json
    full_collection_name = current_user.build_data_collection_name(data_dict['export_name'])
    tactic_app.host_worker.post_task(data_dict["main_id"], "export_data", {"full_collection_name": full_collection_name},
                          export_success)
    return jsonify({"success": True})


@app.route('/figure_source/<tile_id>/<figure_name>', methods=['GET', 'POST'])
@login_required
def figure_source(tile_id, figure_name):
    encoded_img = tactic_app.host_worker.post_and_wait(tile_id, "get_image", {"figure_name": figure_name})["img"]
    img = cPickle.loads(encoded_img.decode("utf-8", "ignore").encode("ascii"))
    img_file = cStringIO.StringIO()
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
