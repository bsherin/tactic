__author__ = 'bls910'

import os, sys, datetime
import pymongo
from flask import render_template, request, make_response, redirect, url_for, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
from tactic_app import app, db, socketio, use_ssl
from tactic_app.file_handling import read_csv_file_to_dict, read_txt_file_to_dict, load_a_list;
from tactic_app.main import create_new_mainwindow, create_new_mainwindow_from_project, mainwindow_instances
from tactic_app.users import put_docs_in_collection, build_data_collection_name
from tactic_app.user_tile_env import create_user_tiles
from tactic_app.shared_dicts import user_tiles, loaded_user_modules, create_initial_metadata


@app.route('/user_manage')
@login_required
def user_manage():
    if current_user.username in user_tiles:
        user_tile_name_list = user_tiles[current_user.username].keys()
    else:
        user_tile_name_list = []
    return render_template('user_manage/user_manage.html', user_tile_name_list=user_tile_name_list, use_ssl=str(use_ssl))


@app.route('/main/<collection_name>', methods=['get'])
@login_required
def main(collection_name):
    cname=build_data_collection_name(collection_name)
    main_id = create_new_mainwindow(current_user.get_id(), collection_name=cname)
    doc_names = mainwindow_instances[main_id].doc_names
    short_collection_name = mainwindow_instances[main_id].short_collection_name
    if current_user.username not in loaded_user_modules:
        loaded_user_modules[current_user.username] = set([])

    # the loaded_modules must be a list to be easily saved to pymongo
    mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[current_user.username])
    return render_template("main.html",
                           collection_name=cname,
                           window_title=short_collection_name,
                           project_name='',
                           main_id=main_id,
                           doc_names=doc_names,
                           use_ssl = str(use_ssl),
                           short_collection_name=short_collection_name)

@app.route('/main_project/<project_name>', methods=['get'])
@login_required
def main_project(project_name):
    project_dict = db[current_user.project_collection_name].find_one({"project_name": project_name})
    if current_user.username not in loaded_user_modules:
        loaded_user_modules[current_user.username] = set([])
    for module in project_dict["loaded_modules"]:
        if module not in loaded_user_modules[current_user.username]:
            load_tile_module(module)
    main_id = create_new_mainwindow_from_project(project_dict)
    doc_names = mainwindow_instances[main_id].doc_names
    short_collection_name = mainwindow_instances[main_id].short_collection_name

    # We want to do this in case there were some additional modules loaded


    # the loaded_modules must be a list to be easily saved to pymongo
    mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[current_user.username])
    return render_template("main.html",
                           collection_name=project_dict["collection_name"],
                           project_name=project_name,
                           window_title=project_name,
                           main_id=main_id,
                           doc_names=doc_names,
                           use_ssl = str(use_ssl),
                           short_collection_name=short_collection_name)

@app.route('/grab_metadata', methods=['POST'])
@login_required
def grab_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        if res_type == "collection":
            cname=build_data_collection_name(res_name)
            mdata = db[cname].find_one({"name": "__metadata__"})
        else:
            if res_type == "tile":
                doc = db[current_user.tile_collection_name].find_one({"tile_module_name": res_name})
            elif res_type == "list":
                doc = db[current_user.list_collection_name].find_one({"list_name": res_name})
            elif res_type == "project":
                doc = db[current_user.project_collection_name].find_one({"project_name": res_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = None
        if mdata is None:
            return jsonify({"success": False, "message": "No metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                datestring = mdata["datetime"].strftime("%b %d, %Y, %H:%M:%S")
            else:
                datestring = ""
            return jsonify({"success": True, "datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"]})
    except:
        error_string = "Error getting metadata: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/save_metadata', methods=['POST'])
@login_required
def save_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        tags = request.json["tags"]
        notes = request.json["notes"]
        if res_type == "collection":
            cname=build_data_collection_name(res_name)
            mdata = db[cname].find_one({"name": "__metadata__"})
            if mdata is None:
                db[cname].insert_one({"name": "__metadata__", "tags": tags, "notes": notes})
            else:
                db[cname].update_one({"name": "__metadata__"},
                                            {'$set': {"tags": tags, "notes": notes}})
        elif res_type == "tile":
            doc = db[current_user.tile_collection_name].find_one({"tile_module_name": res_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = tags
            mdata["notes"] = notes
            db[current_user.tile_collection_name].update_one({"tile_module_name": res_name}, {'$set': {"metadata": mdata}})
        elif res_type == "list":
            doc = db[current_user.list_collection_name].find_one({"list_name": res_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = tags
            mdata["notes"] = notes
            db[current_user.list_collection_name].update_one({"list_name": res_name}, {'$set': {"metadata": mdata}})
        elif res_type == "project":
            doc = db[current_user.project_collection_name].find_one({"project_name": res_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = tags
            mdata["notes"] = notes
            db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})
        return jsonify({"success": True, "message": "Saved metadata", "alert_type": "alert-success"})
    except:
        error_string = "Error saving metadata: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/view_list/<list_name>', methods=['get'])
@login_required
def view_list(list_name):
    the_list = current_user.get_list(list_name)
    return render_template("user_manage/list_viewer.html",
                           list_name=list_name,
                           the_list=the_list)

@app.route('/view_module/<module_name>', methods=['get'])
@login_required
def view_module(module_name):
    # the_list = current_user.get_list(list_name)
    module_code = current_user.get_tile_module(module_name)
    return render_template("user_manage/module_viewer.html",
                           module_name=module_name,
                           module_code=module_code)

@app.route('/load_tile_module/<tile_module_name>', methods=['get', 'post'])
@login_required
def load_tile_module(tile_module_name):
    try:
        tile_module = current_user.get_tile_module(tile_module_name)
        result = create_user_tiles(tile_module)
        if not result == "success":
            return jsonify({"message": result, "alert_type": "alert-warning"})
        if current_user.username not in loaded_user_modules:
            loaded_user_modules[current_user.username] = set([])
        loaded_user_modules[current_user.username].add(tile_module_name)
        socketio.emit('update-loaded-tile-list', {"html": render_loaded_tile_list()},
                                             namespace='/user_manage', room=current_user.get_id())
        socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
        return jsonify({"message": "Tile module successfully loaded", "alert_type": "alert-success"})
    except:
        error_string = "Error loading tile: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


def render_loaded_tile_list():
    loaded_tiles = []
    for (category, dict) in user_tiles[current_user.username].items():
        loaded_tiles += dict.keys()
    return render_template("user_manage/loaded_tile_list.html", user_tile_name_list=loaded_tiles)

def render_project_list():
    return render_template("user_manage/resource_list.html", res_type="project", resource_names=current_user.project_names)

def render_collection_list():
    return render_template("user_manage/resource_list.html", res_type="collection", resource_names=current_user.data_collections)

def render_list_list():
    return render_template("user_manage/resource_list.html", res_type="list", resource_names=current_user.list_names)

def render_tile_module_list():
    return render_template("user_manage/resource_list.html", res_type="tile", resource_names=current_user.tile_module_names)


@app.route('/create_duplicate_list', methods=['post'])
@login_required
def create_duplicate_list():
    list_to_copy = request.json['res_to_copy']
    new_list_name = request.json['new_res_name']
    old_list_dict = db[current_user.list_collection_name].find_one({"list_name": list_to_copy})
    metadata = create_initial_metadata()
    new_list_dict = {"list_name": new_list_name, "the_list": old_list_dict["the_list"], "metadata": metadata}
    db[current_user.list_collection_name].insert_one(new_list_dict)
    socketio.emit('update-list-list', {"html": render_list_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True})

@app.route('/request_update_list_list', methods=['GET'])
@login_required
def request_update_list_list():
    return render_list_list()

@app.route('/request_update_collection_list', methods=['GET'])
@login_required
def request_update_collection_list():
    return render_collection_list()

@app.route('/request_update_project_list', methods=['GET'])
@login_required
def request_update_project_list():
    return render_project_list()

@app.route('/request_update_tile_list', methods=['GET'])
@login_required
def request_update_tile_list():
    return render_tile_module_list()

@app.route('/search_resource', methods=['POST'])
@login_required
def search_resource():
    txt = request.json["text"]
    res_type = request.json["res_type"]
    search_type = request.json["search_type"]
    if search_type == "search":
        the_list = current_user.get_resource_names(res_type, search_filter=txt)
    else:
        the_list = current_user.get_resource_names(res_type, tag_filter=txt)
    the_html = render_template("user_manage/resource_list.html", res_type=res_type, resource_names=the_list)
    return jsonify({"html": the_html})

@app.route('/request_update_loaded_tile_list', methods=['GET'])
@login_required
def request_update_loaded_tile_list():
    return render_loaded_tile_list()

@app.route('/add_list', methods=['POST', 'GET'])
@login_required
def add_list():
    file = request.files['file']
    the_list = load_a_list(file)
    data_dict = {"list_name": file.filename, "the_list": the_list}
    db[current_user.list_collection_name].insert_one(data_dict)
    socketio.emit('update-list-list', {"html": render_list_list()}, namespace='/user_manage', room=current_user.get_id())
    return make_response("", 204)


@app.route('/add_tile_module', methods=['POST', 'GET'])
@login_required
def add_tile_module():
    f = request.files['file']
    the_module = f.read()
    metadata = create_initial_metadata()
    data_dict = {"tile_module_name": f.filename, "tile_module": the_module, "metadata": metadata}
    db[current_user.tile_collection_name].insert_one(data_dict)
    socketio.emit('update-tile-module-list', {"html": render_tile_module_list()}, namespace='/user_manage', room=current_user.get_id())
    return make_response("", 204)

@app.route('/create_tile_module', methods=['POST', 'GET'])
@login_required
def create_tile_module():
    new_tile_name = request.json['new_res_name']
    mongo_dict = db["shared_tiles"].find_one({"tile_module_name": "tile_template.py"})
    template = mongo_dict["tile_module"]

    metadata = create_initial_metadata()
    data_dict = {"tile_module_name": new_tile_name, "tile_module": template, "metadata": metadata}
    db[current_user.tile_collection_name].insert_one(data_dict)
    socketio.emit('update-tile-module-list', {"html": render_tile_module_list()}, namespace='/user_manage', room=current_user.get_id())
    return redirect(url_for('view_module', module_name=new_tile_name))

@app.route('/load_files/<collection_name>', methods=['POST', 'GET'])
@login_required
def load_files(collection_name):
    file_list = request.files.getlist("file")
    full_collection_name = build_data_collection_name(collection_name)
    mdata = create_initial_metadata()
    try:
        db[full_collection_name].insert_one({"name": "__metadata__", "datetime": mdata})
    except:
        error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    for file in file_list:
        filename, file_extension = os.path.splitext(file.filename)
        # if file_extension == ".xml":
        #     (success, dict_list) = read_xml_file_to_dict_list(file)
        #     header_list = []
        if file_extension == ".csv":
            (success, result_dict, header_list) = read_csv_file_to_dict(file)
        elif file_extension ==".txt":
            (success, result_dict, header_list) = read_txt_file_to_dict(file)
        else:
            return jsonify({"message": "Not a valid file extension " + file_extension, "alert_type": "alert-danger"})
        if not success: # then dict_list contains an error object
            e = dict_list # For clarity
            return jsonify({"message": e.message, "alert_type": "alert-danger"})

        try:
            db[full_collection_name].insert_one({"name": filename, "data_rows": result_dict, "header_list": header_list})
        except:
            error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    socketio.emit('update-collection-list', {"html": render_collection_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"message":"Collection successfully loaded", "alert_type": "alert-success"})

@app.route('/delete_project/<project_name>', methods=['post'])
@login_required
def delete_project(project_name):
    db[current_user.project_collection_name].delete_one({"project_name": project_name})
    socketio.emit('update-project-list', {"html": render_project_list()}, namespace='/user_manage', room=current_user.get_id())
    return
    # return render_template("project_list.html")

@app.route('/delete_list/<list_name>', methods=['post'])
@login_required
def delete_list(list_name):
    db[current_user.list_collection_name].delete_one({"list_name": list_name})
    socketio.emit('update-list-list', {"html": render_list_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True})

@app.route('/delete_tile_module/<tile_module_name>', methods=['post'])
@login_required
def delete_tile_module(tile_module_name):
    db[current_user.tile_collection_name].delete_one({"tile_module_name": tile_module_name})
    socketio.emit('update-tile-module-list', {"html": render_tile_module_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True})

@app.route('/delete_collection/<collection_name>', methods=['post'])
@login_required
def delete_collection(collection_name):
    db.drop_collection(current_user.full_collection_name(collection_name))
    socketio.emit('update-collection-list', {"html": render_collection_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True})

@app.route('/duplicate_collection', methods=['post'])
@login_required
def duplicate_collection():
    collection_to_copy = current_user.full_collection_name(request.json['res_to_copy'])
    new_collection_name = current_user.full_collection_name(request.json['new_res_name'])
    for doc in db[collection_to_copy].find():
        db[new_collection_name].insert_one(doc)
    socketio.emit('update-collection-list', {"html": render_collection_list()}, namespace='/user_manage', room=current_user.get_id())
    return jsonify({"success": True})

@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    data_dict = request.json
    module_name = data_dict["module_name"]
    module_code = data_dict["new_code"]
    db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                        {'$set': {"tile_module": module_code}})
    return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})

@app.route('/get_modal_template', methods=['get'])
@login_required
def get_modal_template():
    return send_file("templates/modal_text_request_template.html")

@app.route('/get_resource_module_template', methods=['get'])
@login_required
def get_resource_module_template():
    return send_file("templates/resource_module_template.html")

@socketio.on('connect', namespace='/user_manage')
@login_required
def connected_msg():
    print"client connected"


@socketio.on('join', namespace='/user_manage')
@login_required
def on_join(data):
    room=data["user_id"]
    join_room(room)
    print "user joined room " + room