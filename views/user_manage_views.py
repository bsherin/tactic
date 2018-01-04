
import sys, copy, re, datetime

from flask import render_template, request, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
import markdown

import tactic_app
from tactic_app import app, socketio, use_ssl

from list_manager import ListManager, RepositoryListManager
from collection_manager import CollectionManager, RepositoryCollectionManager
from project_manager import ProjectManager, RepositoryProjectManager
from tile_manager import TileManager, RepositoryTileManager
from code_manager import CodeManager, RepositoryCodeManager
from all_manager import AllManager, RepositoryAllManager
from tactic_app.users import User, copy_between_accounts


global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")
admin_user = User.get_user_by_username("admin")


all_manager = AllManager("all")
repository_all_manager = RepositoryAllManager("all")
code_manager = CodeManager("code", all_manager)
repository_code_manager = RepositoryCodeManager("code", repository_all_manager)
tile_manager = TileManager("tile", all_manager)
repository_tile_manager = RepositoryTileManager("tile", repository_all_manager)
project_manager = ProjectManager("project", all_manager)
repository_project_manager = RepositoryProjectManager("project", repository_all_manager)
collection_manager = CollectionManager("collection", all_manager)
repository_collection_manager = RepositoryCollectionManager("collection", repository_all_manager)
list_manager = ListManager("list", all_manager)
repository_list_manager = RepositoryListManager("list", repository_all_manager)


managers = {
    "list": [list_manager, repository_list_manager],
    "collection": [collection_manager, repository_collection_manager],
    "project": [project_manager, repository_project_manager],
    "tile": [tile_manager, repository_tile_manager],
    "code": [code_manager, repository_code_manager],
    "all": [all_manager, repository_all_manager]
}


tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


def get_manager_for_type(res_type, is_repository=False):
    if is_repository:
        return managers[res_type][1]
    else:
        return managers[res_type][0]


def start_spinner(user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    socketio.emit('start-spinner', {}, namespace='/user_manage', room=user_id)


def stop_spinner(user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    socketio.emit('stop-spinner', {}, namespace='/user_manage', room=user_id)


@app.route('/user_manage')
@login_required
def user_manage():

    if current_user.get_id() == admin_user.get_id():
        return render_template('admin_interface.html', use_ssl=str(use_ssl), version_string=tstring)
    else:

        return render_template('user_manage/user_manage.html', use_ssl=str(use_ssl), version_string=tstring)

@socketio.on('connect', namespace='/user_manage')
@login_required
def connected_msg():
    print"client connected"


@socketio.on('join', namespace='/user_manage')
@login_required
def on_join(data):
    room = data["user_id"]
    join_room(room)
    print "user joined room " + room
    room = data["user_manage_id"]
    join_room(room)
    print "user joined room " + room


@app.route('/get_resource_names/<res_type>', methods=['get', 'post'])
@login_required
def get_resource_names(res_type):
    manager = managers[res_type][0]
    resource_names = manager.get_resource_list()
    return jsonify({"success": True, "resource_names": resource_names})


@app.route('/get_repository_resource_names/<res_type>', methods=['get', 'post'])
@login_required
def get_repository_resource_names(res_type):
    manager = managers[res_type][1]
    resource_names = manager.get_resource_list()
    return jsonify({"success": True, "resource_names": resource_names})


# noinspection PyBroadException
@app.route('/copy_from_repository', methods=['GET', 'POST'])
@login_required
def copy_from_repository():
    res_type = request.json["res_type"]
    new_res_name = request.json['new_res_name']
    res_name = request.json['res_name']
    result = copy_between_accounts(repository_user, current_user, res_type, new_res_name, res_name)
    manager = get_manager_for_type(res_type)
    manager.update_selector_list(select=new_res_name)
    return result


# noinspection PyBroadException
@app.route('/send_to_repository', methods=['GET', 'POST'])
@login_required
def send_to_repository():
    res_type = request.json['res_type']
    new_res_name = request.json['new_res_name']
    res_name = request.json['res_name']
    result = copy_between_accounts(current_user, repository_user, res_type, new_res_name, res_name)
    manager = get_manager_for_type(res_type, is_repository=True)
    manager.update_selector_list(select=new_res_name)
    return result


@app.route('/request_update_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_selector_list(res_type):
    return jsonify({"html": managers[res_type][0].request_update_selector_list()})


@app.route('/request_update_tag_list/<res_type>', methods=['GET'])
@login_required
def request_update_tag_list(res_type):
    return jsonify({"tag_list": managers[res_type][0].request_update_tag_list()})


@app.route('/request_update_repository_tag_list/<res_type>', methods=['GET'])
@login_required
def request_update_repositorytag_list(res_type):
    return jsonify({"tag_list": managers[res_type][1].request_update_tag_list()})


@app.route('/request_update_repository_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_repository_selector_list(res_type):
    return jsonify({"html": managers[res_type][1].request_update_selector_list()})


# Metadata views

@app.route('/grab_metadata', methods=['POST'])
@login_required
def grab_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        is_repository=request.json["is_repository"]
        manager = get_manager_for_type(res_type, is_repository=is_repository)
        mdata = manager.grab_metadata(res_name)
        if mdata is None:
            return jsonify({"success": False, "message": "No metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                localtime = current_user.localize_time(mdata["datetime"])
                datestring = localtime.strftime("%b %d, %Y, %H:%M")
            else:
                datestring = ""
            additional_mdata = copy.copy(mdata)
            standard_mdata = ["datetime", "tags", "notes", "_id", "name"]
            for field in standard_mdata:
                if field in additional_mdata:
                    del additional_mdata[field]
            if "updated" in additional_mdata:
                localtime = current_user.localize_time(additional_mdata["updated"])
                additional_mdata["updated"] = localtime.strftime("%b %d, %Y, %H:%M")
            if "collection_name" in additional_mdata:
                additional_mdata["collection_name"] = re.sub("^.*?\.data_collection\.", "", additional_mdata["collection_name"])
            return jsonify({"success": True, "datestring": datestring, "tags": mdata["tags"],
                            "notes": mdata["notes"], "additional_mdata": additional_mdata})
    except:
        error_string = "Error getting metadata: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/grab_repository_metadata', methods=['POST'])
@login_required
def grab_repository_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        manager = get_manager_for_type(res_type, is_repository=True)
        mdata = manager.grab_metadata(res_name)
        if mdata is None:
            return jsonify({"success": False, "message": "No repository metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                datestring = current_user.localize_time(mdata["datetime"]).strftime("%b %d, %Y, %H:%M")
            else:
                datestring = ""
            return jsonify({"success": True, "datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"]})
    except:
        error_string = "Error getting metadata: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/convert_markdown', methods=['POST'])
@login_required
def convert_markdown():
    try:
        the_text = request.json["the_text"]
        the_text = re.sub("<br>", "\n", the_text)
        the_text = re.sub("&gt;", ">", the_text)
        the_text = re.sub("&nbsp;", " ", the_text)
        converted_markdown = markdown.markdown(the_text)
        return jsonify({"success": True, "converted_markdown": converted_markdown})
    except:
        error_string = "Error converting markdown: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/get_tag_list', methods=['POST'])
@login_required
def get_tag_list():
    try:
        res_type = request.json["res_type"]
        is_repository = request.json["is_repository"]
        manager = get_manager_for_type(res_type, is_repository=is_repository)
        tag_list = manager.get_tag_list()
        return jsonify({"success": True, "tag_list": tag_list})
    except:
        error_string = "Error getting tag list: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/save_metadata', methods=['POST'])
@login_required
def save_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        tags = request.json["tags"]
        notes = request.json["notes"]
        # module_id = request.json["module_id"]
        manager = get_manager_for_type(res_type)
        manager.save_metadata(res_name, tags, notes)
        res_tags = manager.get_tag_list()
        all_manager = get_manager_for_type("all")
        all_tags = all_manager.get_tag_list()
        # if not tag_list == manager.tag_list:
        #     socketio.emit('update-tag-list',
        #                   {"tag_list": manager.request_update_tag_list(),
        #                    "res_type": res_type,
        #                    "module_id": module_id},
        #                   namespace='/user_manage', room=current_user.get_id())
        #     socketio.emit('update-tag-list',
        #                   {"tag_list": all_manager.request_update_tag_list(),
        #                    "res_type": "all",
        #                    "module_id": "all_module"},
        #                   namespace='/user_manage', room=current_user.get_id())

        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except:
        error_string = "Error saving metadata: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/delete_tag', methods=['POST'])
def delete_tag():
    try:
        res_type = request.json["res_type"]
        tag = request.json["tag"]
        manager = get_manager_for_type(res_type)
        manager.delete_tag(tag)
        res_tags = manager.get_tag_list()
        all_tags = all_manager.get_tag_list()
        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags,
                        "message": "Deleted tag", "alert_type": "alert-success"})
    except:
        error_string = "Error deleting a tag: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/rename_tag', methods=['POST'])
def rename_tag():
    try:
        res_type = request.json["res_type"]
        old_tag = request.json["old_tag"]
        new_tag = request.json["new_tag"]
        manager = get_manager_for_type(res_type)
        manager.rename_tag(old_tag, new_tag)
        res_tags = manager.get_tag_list()
        all_tags = all_manager.get_tag_list()
        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags,
                        "message": "Deleted tag", "alert_type": "alert-success"})
    except:
        error_string = "Error deleting a tag: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

@app.route('/search_resource', methods=['POST'])
@login_required
def search_resource():
    txt = request.json["text"]
    res_type = request.json["res_type"]
    search_type = request.json["search_type"]
    search_location = request.json["location"]
    if search_location == "repository":
        user_obj = repository_user
        manager = get_manager_for_type(res_type, is_repository=True)
    else:
        user_obj = current_user
        manager = get_manager_for_type(res_type)
    if search_type == "search":
        the_list = user_obj.get_resource_names(res_type, search_filter=txt)
    else:
        the_list = user_obj.get_resource_names(res_type, tag_filter=txt)

    res_array = manager.build_resource_array(the_list)
    result = manager.build_html_table_from_data_list(res_array)
    return jsonify({"html": result})


@app.route('/rename_resource/<res_type>/<old_name>', methods=['post'])
@login_required
def rename_resource(res_type, old_name):
    manager = get_manager_for_type(res_type)
    return manager.rename_me(old_name)


@app.route('/get_modal_template', methods=['get'])
def get_modal_template():
    return send_file("templates/modal_text_request_template.html")


@app.route('/get_resource_module_template', methods=['get'])
@login_required
def get_resource_module_template():
    return send_file("templates/resource_module_template.html")


