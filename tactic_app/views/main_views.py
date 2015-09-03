__author__ = 'bls910'
from tactic_app import app, db, socketio
from flask import request, jsonify, render_template
from flask_login import current_user
from flask_socketio import join_room
from tactic_app.shared_dicts import tile_classes
from tactic_app.shared_dicts import mainwindow_instances
from user_manage_views import render_project_list

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

@app.route('/save_new_project', methods=['POST'])
def save_new_project():
    data_dict = request.json
    mainwindow_dict = mainwindow_instances[data_dict['main_id']].compile_save_dict()
    combined_dict = mainwindow_dict.copy()

    # It's important that data_dict is added on top of mainwindow dict
    # because it has the updated version of project_name
    combined_dict.update(data_dict)
    mainwindow_instances[data_dict['main_id']].project_name = data_dict["project_name"]
    db[current_user.project_collection_name].insert_one(combined_dict)
    socketio.emit('update-project-list', {"html": render_project_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"project_name": data_dict["project_name"], "success": True, "message": "Project Successfully Saved"})

@app.route('/update_project', methods=['POST'])
def update_project():
    data_dict = request.json

    # Here's it's important that we do mainwindow before data_dict
    # bcause the new information is coming from data_dict (notably new header_struct and hidden_list)
    combined_dict = mainwindow_instances[data_dict['main_id']].compile_save_dict().copy()
    combined_dict.update(data_dict)
    db[current_user.project_collection_name].update_one({"project_name": combined_dict["project_name"]},
                                                        {'$set': combined_dict})
    return jsonify({"success": True, "message": "Project Successfully Saved"})

# Views for reading data from the database and
# passing back to the client.

@app.route('/grab_data/<main_id>', methods=['get'])
def grab_data(main_id):
    return jsonify(mainwindow_instances[main_id].data_dict)

@app.route('/grab_project_data/<main_id>', methods=['get'])
def grab_project_data(main_id):
    result = mainwindow_instances[main_id].data_dict
    result["header_struct"] = mainwindow_instances[main_id].header_struct
    result["hidden_list"] = mainwindow_instances[main_id].hidden_list
    result["tile_ids"] = mainwindow_instances[main_id].tile_instances.keys()
    result["next_header_id"] = mainwindow_instances[main_id].next_header_id
    result["column_widths"] = mainwindow_instances[main_id].column_widths
    result["table_width"] = mainwindow_instances[main_id].table_width
    return jsonify(result)

@app.route('/get_additional_params', methods=['GET'])
def get_additional_params():
    result = {"tile_types": tile_classes.keys()};
    return jsonify(result)

@app.route('/distribute_events/<event_name>', methods=['get', 'post'])
def distribute_events_stub(event_name):
    data_dict = request.json
    main_id = request.json["main_id"]
    if "tile_id" in request.json:
        tile_id = request.json["tile_id"]
    else:
        tile_id = None
    distribute_event(event_name, main_id, data_dict, tile_id)
    return jsonify({"success": True})

def distribute_event(event_name, main_id, data_dict=None, tile_id=None):
    mwindow = mainwindow_instances[main_id]
    if tile_id is not None:
        tile_instance = mwindow.tile_instances[tile_id]
        if event_name in tile_instance.update_events:
            tile_instance.post_event(event_name, data_dict)
    else:
        for tile_id, tile_instance in mwindow.tile_instances.items():
            if event_name in tile_instance.update_events:
                tile_instance.post_event(event_name, data_dict)
    if event_name in mwindow.update_events:
        mwindow.post_event(event_name, data_dict)

@app.route('/create_tile_request/<tile_type>', methods=['GET','POST'])
def create_tile_request(tile_type):
    main_id = request.json["main_id"]
    tile_name = request.json["tile_name"]
    new_tile = mainwindow_instances[main_id].create_tile_instance_in_mainwindow(tile_type, tile_name)
    tile_id = new_tile.tile_id
    form_html = new_tile.create_form_html()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=new_tile.tile_name,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/create_tile_from_save_request/<tile_id>', methods=['GET','POST'])
def create_tile_from_save_request(tile_id):
    main_id = request.json["main_id"]
    tile_instance = mainwindow_instances[main_id].tile_instances[tile_id]
    form_html = tile_instance.create_form_html()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_instance.tile_name,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})
