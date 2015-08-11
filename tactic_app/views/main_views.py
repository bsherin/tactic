__author__ = 'bls910'
from tactic_app import app, db, socketio
from flask import render_template, request, jsonify
from flask_login import current_user
from flask_socketio import join_room
import json
from tactic_app.shared_dicts import tile_classes
from tactic_app.shared_dicts import mainwindow_instances

# The main window should join a room associated with the user
@socketio.on('connect', namespace='/main')
def connected_msg():
    print"client connected"

@socketio.on('join', namespace='/main')
def on_join(data):
    room=data["room"]
    join_room(room)
    print "user joined room " + room

# Views for creating and saving a new project
# As well as for updating an existing project.
@app.route('/save_as_modal', methods=['get'])
def save_as_modal():
    return render_template("modals/save_as_modal.html")

@app.route('/save_new_project', methods=['POST'])
def save_new_project():
    data_dict = request.json
    db[current_user.project_collection_name].insert_one(data_dict)
    socketio.emit('update-project-list', namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True, "message": "Project Successfully Saved"})

@app.route('/update_project', methods=['POST'])
def update_project():
    data_dict = request.json
    db[current_user.project_collection_name].update_one({"project_name": data_dict["project_name"]},
                                                        {'$set': data_dict})
    return jsonify({"success": True, "message": "Project Successfully Saved"})

# Views for reading data from the database and
# passing back to the client.

@app.route('/grab_data/<main_id>', methods=['get'])
def grab_data(main_id):
    return jsonify(mainwindow_instances[main_id].data_dict)

@app.route('/grab_project_data/<main_id>', methods=['get'])
def grab_project_data(main_id):
    result = mainwindow_instances[main_id].data_dict
    result["header_struct"] = mainwindow_instances[main_id].project_dict["header_struct"]
    result["hidden_list"] = mainwindow_instances[main_id].project_dict["hidden_list"]
    return jsonify(result)

@app.route('/get_additional_params', methods=['GET'])
def get_additional_params():
    result = {"tile_types": tile_classes.keys()};
    return jsonify(result)


