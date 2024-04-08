
import sys, copy, re, datetime, os

from flask import render_template, request, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
import markdown

import tactic_app
from tactic_app import app, socketio, db, fs, repository_db, repository_fs, use_remote_repository
from mongo_accesser import name_keys, make_name_unique, res_types
from communication_utils import make_jsonizable_and_compress, read_project_dict
from exception_mixin import generic_exception_handler
from docker_functions import ContainerCreateError
from mongo_db_fs import repository_type, database_type

from resource_manager import ResourceManager, repository_user
from list_manager import ListManager, RepositoryListManager
from pool_manager import PoolManager
from collection_manager import CollectionManager, RepositoryCollectionManager
from project_manager import ProjectManager, RepositoryProjectManager
from tile_manager import TileManager, RepositoryTileManager
from code_manager import CodeManager, RepositoryCodeManager
from users import User

from js_source_management import js_source_dict, _develop, css_source


import loaded_tile_management
admin_user = User.get_user_by_username("admin")

code_manager = CodeManager("code")
repository_code_manager = RepositoryCodeManager("code")
tile_manager = TileManager("tile")
repository_tile_manager = RepositoryTileManager("tile")
project_manager = ProjectManager("project")
repository_project_manager = RepositoryProjectManager("project")
collection_manager = CollectionManager("collection")
repository_collection_manager = RepositoryCollectionManager("collection")
list_manager = ListManager("list")
pool_manager = PoolManager("pool")
repository_list_manager = RepositoryListManager("list")


managers = {
    "list": [list_manager, repository_list_manager],
    "collection": [collection_manager, repository_collection_manager],
    "project": [project_manager, repository_project_manager],
    "tile": [tile_manager, repository_tile_manager],
    "code": [code_manager, repository_code_manager],
    "pool": [pool_manager, None]
}


tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


def copy_between_accounts(source_user, dest_user, res_type, new_res_name, res_name,
                          source_db=None, dest_db=None, source_fs=None, dest_fs=None):
    try:
        if res_type == "collection":
            coll_dict, dm_dict, hl_dict, coll_mdata = source_user.get_all_collection_info(res_name)
            if "size" in coll_mdata and coll_mdata["size"] == 0:
                del coll_mdata["size"]
            if "type" in coll_mdata:
                ctype = coll_mdata["type"]
            else:
                ctype = "table"  # For old collections
            result = dest_user.create_complete_collection(new_res_name,
                                                          coll_dict,
                                                          ctype,
                                                          dm_dict,
                                                          hl_dict,
                                                          coll_mdata)
            overall_res = [coll_mdata, jsonify({"success": result["success"],
                                                "message": "Resource Successfully Copied",
                                                "alert_type": "alert-success"})]
            return overall_res

        sdb = db if source_db is None else source_db
        ddb = db if dest_db is None else dest_db
        sfs = fs if source_fs is None else source_fs
        dfs = fs if dest_fs is None else dest_fs
        name_field = name_keys[res_type]
        collection_name = source_user.resource_collection_name(res_type)
        old_dict = sdb[collection_name].find_one({name_field: res_name})
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
        if res_type == "project":
            project_dict = read_project_dict(sfs, new_res_dict["metadata"], old_dict["file_id"])
            pdict = make_jsonizable_and_compress(project_dict)
            new_res_dict["file_id"] = dfs.put(pdict)


        elif "file_id" in new_res_dict:
            doc_text = sfs.get(new_res_dict["file_id"]).read()
            new_res_dict["file_id"] = dfs.put(doc_text)
        new_collection_name = dest_user.resource_collection_name(res_type)
        ddb[new_collection_name].insert_one(new_res_dict)
        metadata = new_res_dict["metadata"]
        overall_res = [metadata, jsonify({"success": True, "message": "Resource Successfully Copied", "alert_type": "alert-success"})]
        return overall_res
    except Exception as ex:
        overall_res = [None, generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error copying resource")]
        return overall_res


def get_manager_for_type(res_type, is_repository=False):
    if is_repository:
        return managers[res_type][1]
    else:
        return managers[res_type][0]


@app.route('/library')
@login_required
def library():
    print("*** in library ***")
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html",
                               is_remote="no",
                               database_type=database_type,
                               repository_type="",
                               version_string=tstring,
                               develop=str(_develop),
                               page_title="tactic admin",
                               theme=current_user.get_theme(),
                               css_source=css_source("admin_home_react"),
                               module_source=js_source_dict["admin_home_react"])
    else:
        return render_template('library/library_home_react.html',
                               develop=str(_develop),
                               is_remote="no",
                               repository_type="",
                               database_type=database_type,
                               version_string=tstring,
                               theme=current_user.get_theme(),
                               page_title="tactic resources",
                               css_source=css_source("library_home_react"),
                               module_source=js_source_dict["library_home_react"])


@app.route('/context')
@login_required
def context():
    return render_template('context_react.html',
                           database_type=database_type,
                           develop=str(_develop),
                           version_string=tstring,
                           theme=current_user.get_theme(),
                           has_pool=current_user.has_pool,
                           has_openapi_key=current_user.has_openapi_key,
                           page_title="context",
                           css_source=css_source("context_react"),
                           module_source=js_source_dict["context_react"])


@app.route('/repository')
@login_required
def repository():
    is_remote = "yes" if use_remote_repository else "no"
    print("*** in /repository with is_remote " + is_remote)
    return render_template('library/library_home_react.html',
                           version_string=tstring,
                           is_remote=is_remote,
                           repository_type=repository_type,
                           develop=str(_develop),
                           library_style="tabbed",
                           theme=current_user.get_theme(),
                           page_title="tactic repository",
                           css_source=css_source("repository_home_react"),
                           module_source=js_source_dict["repository_home_react"]
                           )


@app.route('/get_resource_names/<res_type>', methods=['get', 'post'])
@login_required
def get_resource_names(res_type):
    if res_type == "pool":
        resource_names = []
    else:
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
    if "res_name" in request.json:
        new_res_name = request.json['new_res_name']
        res_type = request.json["res_type"]
        res_name = request.json['res_name']
        metadata, result = copy_between_accounts(repository_user, current_user,
                                                 res_type, new_res_name, res_name,
                                                 source_db=repository_db, source_fs=repository_fs)
        return result
    else:
        selected_rows = request.json["selected_rows"]
        successful_copies = 0
        for row in selected_rows:
            res_type = row["res_type"]
            res_name = row["name"]
            manager = get_manager_for_type(res_type)
            resource_names = manager.get_resource_list()
            new_res_name = make_name_unique(res_name, resource_names)
            metadata, result = copy_between_accounts(repository_user, current_user,
                                                     res_type, new_res_name, res_name,
                                                     source_db=repository_db, source_fs=repository_fs)
            if result.json["success"]:
                successful_copies +=1
        return jsonify({"success": True, "message": f"{str(successful_copies)} resources copied"})

# noinspection PyBroadException
@app.route('/send_to_repository', methods=['GET', 'POST'])
@login_required
def send_to_repository():
    if "res_name" in request.json:
        res_type = request.json['res_type']
        new_res_name = request.json['new_res_name']
        res_name = request.json['res_name']
        metadata, result = copy_between_accounts(current_user, repository_user, res_type, new_res_name, res_name,
                                                 dest_db=repository_db, dest_fs=repository_fs)
        return result
    else:
        successful_copies = 0
        selected_rows = request.json["selected_rows"]
        for row in selected_rows:
            res_type = row["res_type"]
            res_name = row["name"]
            manager = get_manager_for_type(res_type, is_repository=True)
            resource_names = manager.get_resource_list()
            new_res_name = make_name_unique(res_name, resource_names)
            metadata, result = copy_between_accounts(current_user, repository_user, res_type, new_res_name, res_name,
                                                     dest_db=repository_db, dest_fs=repository_fs)
            if result.json["success"]:
                successful_copies +=1
        return jsonify({"success": True, "message": f"{str(successful_copies)} resources copied"})


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
            result = current_user.process_metadata(mdata)
            result.update({"success": True, "res_name": res_name})
            return jsonify(result)
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

        return jsonify({"success": True, "res_tags": res_tags, "updated_tags": updated_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error adding tags")


@app.route('/overwrite_common_tags', methods=['POST'])
@login_required
def overwrite_common_tags():
    try:
        selected_rows = request.json["selected_rows"]
        tags = request.json["tags"].split()
        common_tags = grab_m_mdata(selected_rows)["common_tags"].split()
        updated_tags = []
        for row in selected_rows:
            res_type = row["res_type"]
            res_name = row["name"]
            manager = get_manager_for_type(res_type)
            mdata = manager.grab_metadata(res_name)
            old_tags = mdata["tags"].split()
            new_tags = []
            for tag in old_tags:
                if tag not in common_tags and tag not in tags:
                    new_tags.append(tag)
            new_tags += tags
            new_tags_string = " ".join(new_tags)
            updated_tags.append({"name": res_name, "res_type": res_type, "tags": new_tags_string})
            manager.save_metadata(res_name, new_tags_string, mdata["notes"])

        return jsonify({"success": True, "updated_tags": updated_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error saving metadata")


def grab_m_mdata(rows, is_repository=False):
    mdata_list = []
    for row in rows:
        res_type = row["res_type"]
        res_name = row["name"]
        manager = get_manager_for_type(row["res_type"], is_repository=is_repository)
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
            one_result = {"res_name": res_name, "res_type": res_type,
                          "datestring": datestring, "tags": mdata["tags"],
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
        return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error getting repository metadata")


@app.route('/get_tag_list', methods=['POST'])
@login_required
def get_tag_list():
    try:
        pane_type = request.json["pane_type"]
        is_repository = request.json["is_repository"]
        show_hidden = request.json["show_hidden"]
        if pane_type == "all":
            tag_list = []
            for rtype in res_types:
                manager = get_manager_for_type(rtype, is_repository=is_repository)
                tag_list += manager.get_tag_list(show_hidden)
            tag_list = list(set(tag_list))
        else:
            manager = get_manager_for_type(pane_type, is_repository=is_repository)
            tag_list = manager.get_tag_list(show_hidden)
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
        manager = get_manager_for_type(res_type)
        if res_type == "tile" and "icon" in request.json:
            manager.save_metadata(res_name, tags, notes, request.json["icon"])
        else:
            manager.save_metadata(res_name, tags, notes)
        res_tags = manager.get_tag_list()

        return jsonify({"success": True, "res_tags": res_tags,
                        "message": "Saved metadata", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error saving metadata")


@app.route('/delete_tag', methods=['POST'])
@login_required
def delete_tag():
    try:
        pane_type = request.json["pane_type"]
        tag = request.json["tag"]
        if pane_type == "all":
            rtypes = res_types
        else:
            rtypes = [pane_type]
        for rtype in rtypes:
            manager = get_manager_for_type(rtype)
            manager.delete_tag(tag)
        return jsonify({"success": True,
                        "message": "Deleted tag", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error deleting a tag")


@app.route('/rename_tag', methods=['POST'])
@login_required
def rename_tag():
    try:
        pane_type = request.json["pane_type"]
        tag_changes = request.json["tag_changes"]
        if pane_type == "all":
            rtypes = res_types
        else:
            rtypes = [pane_type]
        for rtype in rtypes:
            manager = get_manager_for_type(rtype)
            manager.rename_tag(tag_changes)
        return jsonify({"success": True,
                        "message": "renamed tag tag", "alert_type": "alert-success"})
    except Exception as ex:
        return generic_exception_handler.get_exception_for_ajax(ex, "Error renaming a tag")


@app.route('/rename_resource/<res_type>/<old_name>', methods=['post'])
@login_required
def rename_resource(res_type, old_name):
    manager = get_manager_for_type(res_type)
    return manager.rename_me(old_name)


@app.errorhandler(ContainerCreateError)
def handle_container_create_error(e):
    return render_template("error_window_template.html",
                           base_string="Error creating container",
                           error_string=e.args[0],
                           version_string=tstring)
