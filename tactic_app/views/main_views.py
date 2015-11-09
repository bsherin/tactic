__author__ = 'bls910'
import sys
from tactic_app import app, db, socketio
from flask import request, jsonify, render_template, send_file, url_for
from flask_login import current_user, login_required
from flask_socketio import join_room
from tactic_app.shared_dicts import tile_classes, user_tiles
from tactic_app.shared_dicts import mainwindow_instances, distribute_event
from user_manage_views import render_project_list, render_collection_list
from tactic_app.users import build_data_collection_name

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
@login_required
def save_new_project():
    try:
        data_dict = request.json
        mainwindow_instances[data_dict['main_id']].project_name = data_dict["project_name"]
        save_dict = mainwindow_instances[data_dict['main_id']].compile_save_dict()

        db[current_user.project_collection_name].insert_one(save_dict)
        socketio.emit('update-project-list', {"html": render_project_list()}, namespace='/user_manage', room=current_user.get_id())
        return jsonify({"project_name": data_dict["project_name"], "success": True, "message": "Project Successfully Saved"})
    except:
        mainwindow_instances[data_dict['main_id']].handle_exception("Error saving new project")
        return jsonify({"success": False})

@app.route('/update_project', methods=['POST'])
@login_required
def update_project():
    data_dict = request.json
    save_dict = mainwindow_instances[data_dict['main_id']].compile_save_dict()

    db[current_user.project_collection_name].update_one({"project_name": save_dict["project_name"]},
                                                        {'$set': save_dict})
    return jsonify({"success": True, "message": "Project Successfully Saved"})

@app.route('/export_data', methods=['POST'])
@login_required
def export_data():
    data_dict = request.json
    doc_dict = mainwindow_instances[data_dict['main_id']].doc_dict
    full_collection_name = build_data_collection_name(data_dict['export_name'])
    for docinfo in doc_dict.values():
        db[full_collection_name].insert_one({"name": docinfo.name, "data_rows": docinfo.data_rows, "header_list": docinfo.header_list})
    socketio.emit('update-collection-list', {"html": render_collection_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True, "message": "Data Successfully Exported"})

# Views for reading data from the database and
# passing back to the client.

@app.route('/grab_data/<main_id>/<doc_name>', methods=['get'])
@login_required
def grab_data(main_id, doc_name):
    return jsonify({"doc_name": doc_name, "data_rows": mainwindow_instances[main_id].doc_dict[doc_name].sorted_data_rows, "header_list": mainwindow_instances[main_id].doc_dict[doc_name].header_list})

@app.route('/grab_project_data/<main_id>/<doc_name>', methods=['get'])
@login_required
def grab_project_data(main_id, doc_name):
    mw = mainwindow_instances[main_id]
    return jsonify({"doc_name": doc_name, "tile_ids": mw.tile_ids, "data_rows": mw.doc_dict[doc_name].sorted_data_rows, "tablespec_dict": mw.tablespec_dict()})

@app.route('/get_menu_template', methods=['get'])
@login_required
def get_menu_template():
    return send_file("templates/menu_template.html")

@app.route('/get_table_templates', methods=['get'])
@login_required
def get_table_templates():
    return send_file("templates/table_templates.html")

@app.route('/get_additional_params', methods=['GET'])
@login_required
def get_additional_params():
    if current_user.username in user_tiles:
        utiles = user_tiles[current_user.username].keys()
    else:
        utiles = []
    result = {"tile_types": tile_classes.keys(), "user_tile_types": utiles};
    return jsonify(result)

@app.route('/set_visible_doc/<main_id>/<doc_name>', methods=['get'])
@login_required
def set_visible_doc(main_id, doc_name):
    mainwindow_instances[main_id]._visible_doc_name = doc_name
    return jsonify({"success": True})

@app.route('/distribute_events/<event_name>', methods=['get', 'post'])
@login_required
def distribute_events_stub(event_name):
    data_dict = request.json
    main_id = request.json["main_id"]
    if "tile_id" in request.json:
        tile_id = request.json["tile_id"]
    else:
        tile_id = None
    success = distribute_event(event_name, main_id, data_dict, tile_id)
    return jsonify({"success": success})

@app.route('/figure_source/<main_id>/<tile_id>/<figure_name>', methods=['GET','POST'])
@login_required
def figure_source(main_id, tile_id, figure_name):
    img = mainwindow_instances[main_id].tile_instances[tile_id].img_dict[figure_name]
    return send_file(img, mimetype='image/png')

@app.route('/create_tile_request/<tile_type>', methods=['GET','POST'])
@login_required
def create_tile_request(tile_type):
    try:
        main_id = request.json["main_id"]
        tile_name = request.json["tile_name"]
        new_tile = mainwindow_instances[main_id].create_tile_instance_in_mainwindow(tile_type, tile_name)
        tile_id = new_tile.tile_id
        form_html = new_tile.create_form_html()
        result = render_template("tile.html", tile_id=tile_id,
                               tile_name=new_tile.tile_name,
                               form_text=form_html)
        return jsonify({"success": True, "html":result, "tile_id": tile_id})
    except:
        error_string = str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        mainwindow_instances[main_id].handle_exception("Error creating tile")
        return jsonify({"success": False})

@app.route('/create_tile_from_save_request/<tile_id>', methods=['GET','POST'])
@login_required
def create_tile_from_save_request(tile_id):
    main_id = request.json["main_id"]
    tile_instance = mainwindow_instances[main_id].tile_instances[tile_id]
    tile_instance.figure_url = url_for("figure_source", main_id=main_id, tile_id=tile_id, figure_name="X")[:-1]
    form_html = tile_instance.create_form_html()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_instance.tile_name,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})
