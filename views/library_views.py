
import sys, copy, re, datetime

from flask import render_template, request, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
import markdown

import tactic_app
from tactic_app import app, socketio, use_ssl, db, fs
from tactic_app.mongo_accesser import name_keys
from tactic_app.communication_utils import make_jsonizable_and_compress, read_project_dict
from tactic_app.exception_mixin import generic_exception_handler
from tactic_app.docker_functions import ContainerCreateError

from tactic_app.resource_manager import ResourceManager
from list_manager import ListManager, RepositoryListManager
from collection_manager import CollectionManager, RepositoryCollectionManager
from project_manager import ProjectManager, RepositoryProjectManager
from tile_manager import TileManager, RepositoryTileManager
from code_manager import CodeManager, RepositoryCodeManager
from all_manager import AllManager, RepositoryAllManager
from tactic_app.users import User


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


def copy_between_accounts(source_user, dest_user, res_type, new_res_name, res_name):
    try:
        if res_type == "collection":
            collection_to_copy = source_user.full_collection_name(res_name)
            new_collection_name = dest_user.full_collection_name(new_res_name)
            for doc in db[collection_to_copy].find():
                del doc["_id"]
                if "file_id" in doc:
                    doc_text = fs.get(doc["file_id"]).read()
                    doc["file_id"] = fs.put(doc_text)
                db[new_collection_name].insert_one(doc)
            db[new_collection_name].update_one({"name": "__metadata__"},
                                               {'$set': {"datetime": datetime.datetime.utcnow()}})
            metadata = db[new_collection_name].find_one({"name": "__metadata__"})
        else:
            name_field = name_keys[res_type]
            collection_name = source_user.resource_collection_name(res_type)
            old_dict = db[collection_name].find_one({name_field: res_name})
            new_res_dict = {name_field: new_res_name}
            for (key, val) in old_dict.items():
                if (key == "_id") or (key == name_field):
                    continue
                new_res_dict[key] = val
            if "metadata" not in new_res_dict:
                mdata = {"datetime": datetime.datetime.utcnow(),
                         "updated": datetime.datetime.utcnow(),
                         "tags": "",
                         "notes": ""}
                new_res_dict["metadata"] = mdata
            else:
                new_res_dict["metadata"]["datetime"] = datetime.datetime.utcnow()
            if res_type == "project":
                project_dict = read_project_dict(fs, new_res_dict["metadata"], old_dict["file_id"])
                project_dict["user_id"] = dest_user.get_id()
                pdict = make_jsonizable_and_compress(project_dict)
                new_res_dict["file_id"] = fs.put(pdict)
            elif "file_id" in new_res_dict:
                doc_text = fs.get(new_res_dict["file_id"]).read()
                new_res_dict["file_id"] = fs.put(doc_text)
            new_collection_name = dest_user.resource_collection_name(res_type)
            db[new_collection_name].insert_one(new_res_dict)
            metadata = new_res_dict["metadata"]
        overall_res = [metadata, jsonify({"success": True, "message": "Resource Successfully Copied", "alert_type": "alert-success"})]
        return overall_res
    except Exception as ex:
        overall_res = [None, generic_exception_handler.get_exception_for_ajax(ex, "Error copying resource")]
        return overall_res


def get_manager_for_type(res_type, is_repository=False):
    if is_repository:
        return managers[res_type][1]
    else:
        return managers[res_type][0]


def start_spinner(user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    socketio.emit('start-spinner', {}, namespace='/library', room=user_id)


def stop_spinner(user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    socketio.emit('stop-spinner', {}, namespace='/library', room=user_id)


@app.route('/library')
@login_required
def library():
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html", use_ssl=str(use_ssl), version_string=tstring,
                               module_source="tactic_js/admin_home_react.js")
    else:

        return render_template('library/library_home_react.html', use_ssl=str(use_ssl), version_string=tstring,
                               module_source='tactic_js/library_home_react.js')


@app.route('/repository')
@login_required
def repository():
    return render_template('library/library_home_react.html', use_ssl=str(use_ssl), version_string=tstring,
                           module_source='tactic_js/repository_home_react.js'
                           )


@socketio.on('connect', namespace='/library')
@login_required
def connected_msg():
    print"client connected"


@socketio.on('join', namespace='/library')
@login_required
def on_join(data):
    room = data["user_id"]
    join_room(room)
    print "user joined room " + room
    room = data["library_id"]
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
    metadata, result = copy_between_accounts(repository_user, current_user, res_type, new_res_name, res_name)
    if metadata is not None:
        manager = get_manager_for_type(res_type)
        new_row = manager.build_res_dict(new_res_name, metadata)
        manager.update_selector_row(new_row)
    return result


# noinspection PyBroadException
@app.route('/send_to_repository', methods=['GET', 'POST'])
@login_required
def send_to_repository():
    res_type = request.json['res_type']
    new_res_name = request.json['new_res_name']
    res_name = request.json['res_name']
    metadata, result = copy_between_accounts(current_user, repository_user, res_type, new_res_name, res_name)
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


@app.route('/resource_list_with_metadata/<res_type>', methods=['GET', 'POST'])
@login_required
def get_resource_data_list(res_type):
    return jsonify({"data_list": managers[res_type][0].get_resource_data_list()})


@app.route('/repository_resource_list_with_metadata/<res_type>', methods=['GET', 'POST'])
@login_required
def get_repository_resource_data_list(res_type):
    return jsonify({"data_list": managers[res_type][1].get_resource_data_list()})

# Metadata views
@app.route('/grab_metadata', methods=['POST'])
@login_required
def grab_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        is_repository = request.json["is_repository"]
        manager = get_manager_for_type(res_type, is_repository=is_repository)
        mdata = manager.grab_metadata(res_name)
        if mdata is None:
            return jsonify({"success": False, "message": "No metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                datestring = current_user.get_timestrings(mdata["datetime"])[0]
            else:
                datestring = ""
            additional_mdata = copy.copy(mdata)
            standard_mdata = ["datetime", "tags", "notes", "_id", "name"]
            for field in standard_mdata:
                if field in additional_mdata:
                    del additional_mdata[field]
            if "updated" in additional_mdata:
                additional_mdata["updated"] = current_user.get_timestrings(additional_mdata["updated"])[0]
            if "collection_name" in additional_mdata:
                additional_mdata["collection_name"] = current_user.short_collection_name(additional_mdata["collection_name"])
            return jsonify({"success": True, "res_name": res_name, "datestring": datestring, "tags": mdata["tags"],
                            "notes": mdata["notes"], "additional_mdata": additional_mdata})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting metadata")


@app.route('/add_tags', methods=['POST'])
@login_required
def add_tags():
    try:
        res_type = request.json["res_type"]
        res_names = request.json["res_names"]
        tags = request.json["tags"]
        manager = get_manager_for_type(res_type)
        updated_tags = {}
        for res_name in res_names:
            mdata = manager.grab_metadata(res_name)
            old_tags = mdata["tags"].split()
            new_tags = list(set(old_tags + tags))
            new_tags_string = " ".join(new_tags)
            updated_tags[res_name] = new_tags_string
            manager.save_metadata(res_name, new_tags_string, mdata["notes"])
        res_tags = manager.get_tag_list()
        _all_manager = get_manager_for_type("all")
        all_tags = _all_manager.get_tag_list()

        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags, "updated_tags": updated_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error adding tags")


@app.route('/overwrite_common_tags', methods=['POST'])
@login_required
def overwrite_common_tags():
    try:
        res_type = request.json["res_type"]
        res_names = request.json["res_names"]
        tags = request.json["tags"].split()
        manager = get_manager_for_type(res_type)
        common_tags = grab_m_mdata(res_type, res_names)["common_tags"].split()
        updated_tags = {}
        for res_name in res_names:
            mdata = manager.grab_metadata(res_name)
            old_tags = mdata["tags"].split()
            new_tags = []
            for tag in old_tags:
                if tag not in common_tags and tag not in tags:
                    new_tags.append(tag)
            new_tags += tags
            new_tags_string = " ".join(new_tags)
            updated_tags[res_name] = new_tags_string
            manager.save_metadata(res_name, new_tags_string, mdata["notes"])
        res_tags = manager.get_tag_list()
        _all_manager = get_manager_for_type("all")
        all_tags = _all_manager.get_tag_list()

        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags, "updated_tags": updated_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error saving metadata")


def grab_m_mdata(res_type, res_name_list, is_repository=False):
    manager = get_manager_for_type(res_type, is_repository=is_repository)
    mdata_list = []
    for res_name in res_name_list:
        mdata = manager.grab_metadata(res_name)
        if mdata is None:
            return jsonify({"success": False, "message": "No metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                datestring = current_user.get_timestrings(mdata["datetime"])[0]
            else:
                datestring = ""
            additional_mdata = copy.copy(mdata)
            standard_mdata = ["datetime", "tags", "notes", "_id", "name"]
            for field in standard_mdata:
                if field in additional_mdata:
                    del additional_mdata[field]
            if "updated" in additional_mdata:
                additional_mdata["updated"] = current_user.get_timestrings(additional_mdata["updated"])[0]
            if "collection_name" in additional_mdata:
                additional_mdata["collection_name"] = current_user.short_collection_name(additional_mdata["collection_name"])
            one_result = {"res_name": res_name, "datestring": datestring, "tags": mdata["tags"],
                          "notes": mdata["notes"], "additional_mdata": additional_mdata}
            mdata_list.append(one_result)
    common_tags = mdata_list[0]["tags"].split()
    for mdata in mdata_list[1:]:
        new_common_tags = []
        next_tags = mdata["tags"].split()
        for tag in common_tags:
            if tag in next_tags:
                new_common_tags.append(tag)
        common_tags = new_common_tags
    common_tags = " ".join(common_tags)
    return {"success": True, "metadata_list": mdata_list, "common_tags": common_tags}


@app.route('/grab_multi_metadata', methods=['POST'])
@login_required
def grab_multi_metadata():
    try:
        res_type = request.json["res_type"]
        res_name_list = request.json["res_name_list"]
        is_repository = request.json["is_repository"]
        result_dict = grab_m_mdata(res_type, res_name_list, is_repository)
        return jsonify(result_dict)
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting metadata")


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
                datestring = current_user.get_timestrings(mdata["datetime"])[0]
            else:
                datestring = ""
            return jsonify({"success": True, "res_name": res_name, "datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"]})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting repository metadata")


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
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error converting markdown")


@app.route('/get_tag_list', methods=['POST'])
@login_required
def get_tag_list():
    try:
        res_type = request.json["res_type"]
        is_repository = request.json["is_repository"]
        manager = get_manager_for_type(res_type, is_repository=is_repository)
        tag_list = manager.get_tag_list()
        return jsonify({"success": True, "tag_list": tag_list})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error getting tag list")


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
        _all_manager = get_manager_for_type("all")
        all_tags = _all_manager.get_tag_list()

        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error saving metadata")


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
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error deleting a tag")


@app.route('/rename_tag', methods=['POST'])
def rename_tag():
    try:
        res_type = request.json["res_type"]
        tag_changes = request.json["tag_changes"]
        manager = get_manager_for_type(res_type)
        manager.rename_tag(tag_changes)
        res_tags = manager.get_tag_list()
        all_tags = all_manager.get_tag_list()
        return jsonify({"success": True, "res_tags": res_tags, "all_tags": all_tags,
                        "message": "Deleted tag", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error renaming a tag")


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


@app.errorhandler(ContainerCreateError)
def handle_container_create_error(e):
    return render_template("error_window_template.html",
                           base_string="Error creating container",
                           error_string=e.args[0],
                           version_string=tstring)
