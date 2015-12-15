__author__ = 'bls910'

AUTOSPLIT = True
AUTOSPLIT_SIZE = 10000

import os, sys, datetime
import pymongo
from flask import render_template, request, make_response, redirect, url_for, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
from tactic_app import app, db, socketio, use_ssl
from tactic_app.file_handling import read_csv_file_to_dict, read_txt_file_to_dict, read_xml_file_to_dict, load_a_list;
from tactic_app.main import create_new_mainwindow, create_new_mainwindow_from_project, mainwindow_instances
from tactic_app.users import put_docs_in_collection, User
from tactic_app.user_tile_env import create_user_tiles
from tactic_app.shared_dicts import user_tiles, loaded_user_modules, create_initial_metadata

def start_spinner():
    socketio.emit('start-spinner', {}, namespace='/user_manage', room=current_user.get_id())

def stop_spinner():
    socketio.emit('start-spinner', {}, namespace='/user_manage', room=current_user.get_id())

class ResourceManager(object):
    resource_name_dict = {"collection": {"collection_name": "",
                                  "collection_list": "data_collections",
                                  "name_field": ""},
                      "project": {"collection_name": "project_collection_name",
                                  "collection_list": "project_names",
                                  "name_field": "project_name"},
                      "list": {"collection_name": "list_collection_name",
                               "collection_list": "list_names",
                               "name_field": "list_name"},
                      "tile": {"collection_name": "tile_collection_name",
                               "collection_list": "tile_module_names",
                               "name_field": "tile_module_name"}}
    def __init__(self, res_type, user_obj):
        self.res_type = res_type
        self.user_obj = user_obj
        self.add_rules()

    def add_rules(self):
        print "not implemented"

    def render_resource_list(self):
        return render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type())

    def update_selector_list(self, select=None):
        if select is None:
            socketio.emit('update-selector-list', {"html": self.render_resource_list(), "res_type": self.res_type}, namespace='/user_manage', room=current_user.get_id())
        else:
            socketio.emit('update-selector-list', {"html": self.render_resource_list(), "select": select, "res_type": self.res_type}, namespace='/user_manage', room=current_user.get_id())

    def get_resource_list_from_type(self):
        return getattr(self.user_obj, self.resource_name_dict[self.res_type]["collection_list"])


    def resource_field_name(self):
        return self.resource_name_dict[self.res_type]["name_field"]

    def request_update_selector_list(self):
        result = render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type(), rep_string="")
        return result

def get_resource_list_name_from_type(user_obj, res_type):
    return getattr(user_obj, ResourceManager.resource_name_dict[res_type]["collection_name"])

@app.route('/copy_from_repository', methods=['GET', 'POST'])
@login_required
def copy_from_repository():
    res_type = request.json['res_type']
    if res_type == "list":
        manager = list_manager
    elif res_type == "collection":
        manager = collection_manager
    elif res_type == "project":
        manager = project_manager
    elif res_type == "tile":
        manager = tile_manager
    new_res_name = request.json['new_res_name']
    res_name = request.json['res_name']

    if res_type == "collection":
        collection_to_copy = repository_user.full_collection_name(request.json['res_name'])
        new_collection_name = current_user.full_collection_name(request.json['new_res_name'])
        for doc in db[collection_to_copy].find():
            db[new_collection_name].insert_one(doc)
        db[new_collection_name].update_one({"name": "__metadata__"},
                                           {'$set': {"datatime": datetime.datetime.today()}})
    else:
        old_dict = db[get_resource_list_name_from_type(repository_user, res_type)].find_one({manager.resource_field_name(): res_name})
        keys_to_skip = ["_id", ""]
        new_res_dict = {manager.resource_field_name(): new_res_name}
        for (key, val) in old_dict.items():
            if (key == "_id") or (key == manager.resource_field_name()):
                continue
            new_res_dict[key] = val
        if not "metadata" in new_res_dict:
            new_res_dict["metadata"] = create_initial_metadata()
        else:
            new_res_dict["metadata"]["datetime"] = datetime.datetime.today()
        db[get_resource_list_name_from_type(current_user, res_type)].insert_one(new_res_dict)
    manager.update_selector_list(select=new_res_name)
    return jsonify({"success": True})

@app.route('/request_update_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_selector_list(res_type):
    if res_type == "list":
        return list_manager.request_update_selector_list()
    if res_type == "collection":
        return collection_manager.request_update_selector_list()
    if res_type == "project":
        return project_manager.request_update_selector_list()
    if res_type == "tile":
        return tile_manager.request_update_selector_list()
    return ""

@app.route('/request_update_repository_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_repository_selector_list(res_type):
    if res_type == "list":
        return repository_list_manager.request_update_selector_list()
    if res_type == "collection":
        return repository_collection_manager.request_update_selector_list()
    if res_type == "project":
        return repository_project_manager.request_update_selector_list()
    if res_type == "tile":
        return repository_tile_manager.request_update_selector_list()
    return ""

class ListManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/view_list/<list_name>', "view_list", login_required(self.view_list), methods=['get'])
        app.add_url_rule('/add_list', "add_list", login_required(self.add_list), methods=['get', "post"])
        app.add_url_rule('/delete_list/<list_name>', "delete_list", login_required(self.delete_list), methods=['post'])
        app.add_url_rule('/create_duplicate_list', "create_duplicate_list", login_required(self.create_duplicate_list), methods=['get', 'post'])

    def view_list(self, list_name):
        the_list = self.user_obj.get_list(list_name)
        return render_template("user_manage/list_viewer.html",
                               list_name=list_name,
                               the_list=the_list)

    def add_list(self):
        file = request.files['file']
        the_list = load_a_list(file)
        data_dict = {"list_name": file.filename, "the_list": the_list}
        db[self.user_obj.list_collection_name].insert_one(data_dict)
        self.update_selector_list(select=file.filename)
        return make_response("", 204)

    def delete_list(self,list_name):
        db[self.user_obj.list_collection_name].delete_one({"list_name": list_name})
        self.update_selector_list()
        return jsonify({"success": True})

    def create_duplicate_list(self):
        list_to_copy = request.json['res_to_copy']
        new_list_name = request.json['new_res_name']
        old_list_dict = db[self.user_obj.list_collection_name].find_one({"list_name": list_to_copy})
        metadata = create_initial_metadata()
        new_list_dict = {"list_name": new_list_name, "the_list": old_list_dict["the_list"], "metadata": metadata}
        db[self.user_obj.list_collection_name].insert_one(new_list_dict)
        self.update_selector_list(select=new_list_name)
        return jsonify({"success": True})

class RepositoryListManager(ListManager):
    def add_rules(self):
        x = 3

    def request_update_selector_list(self):
        return render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type(), rep_string="repository-")

class CollectionManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/main/<collection_name>', "main", login_required(self.main), methods=['get'])
        app.add_url_rule('/load_files/<collection_name>', "load_files", login_required(self.load_files), methods=['get', "post"])
        app.add_url_rule('/delete_collection/<collection_name>', "delete_collection", login_required(self.delete_collection), methods=['post'])
        app.add_url_rule('/duplicate_collection', "duplicate_collection", login_required(self.duplicate_collection), methods=['post', 'get'])

    def main(self, collection_name):
        cname=self.user_obj.build_data_collection_name(collection_name)
        main_id = create_new_mainwindow(self.user_obj.get_id(), collection_name=cname)
        doc_names = mainwindow_instances[main_id].doc_names
        short_collection_name = mainwindow_instances[main_id].short_collection_name
        if self.user_obj.username not in loaded_user_modules:
            loaded_user_modules[self.user_obj.username] = set([])

        # the loaded_modules must be a list to be easily saved to pymongo
        mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[self.user_obj.username])
        return render_template("main.html",
                               collection_name=cname,
                               window_title=short_collection_name,
                               project_name='',
                               main_id=main_id,
                               doc_names=doc_names,
                               use_ssl = str(use_ssl),
                               short_collection_name=short_collection_name)

    def autosplit_doc(self, filename, full_dict):
        sorted_int_keys = sorted([int(key) for key in full_dict.keys()])
        counter = 0
        doc_list = []
        doc_rows = {}
        doc_counter = 1
        for r in sorted_int_keys:
            doc_rows[str(counter)] = full_dict[str(r)]
            counter += 1
            if counter == AUTOSPLIT_SIZE:
                doc_list.append({
                    "name": filename + "__" + str(doc_counter),
                    "data_rows": doc_rows
                })
                counter = 0
                doc_rows = {}
                doc_counter += 1
        if counter > 0:
            doc_list.append({
                "name": filename + "__" + str(doc_counter),
                "data_rows": doc_rows
            })
        return doc_list

    def load_files(self, collection_name):
        file_list = request.files.getlist("file")
        full_collection_name = self.user_obj.build_data_collection_name(collection_name)
        mdata = create_initial_metadata()
        try:
            db[full_collection_name].insert_one({"name": "__metadata__", "datetime": mdata["datetime"], "tags": "", "notes": ""})
        except:
            error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        for file in file_list:
            filename, file_extension = os.path.splitext(file.filename)
            if file_extension == ".csv":
                (success, result_dict, header_list) = read_csv_file_to_dict(file)
            elif file_extension ==".txt":
                (success, result_dict, header_list) = read_txt_file_to_dict(file)
            # elif file_extension == ".xml":
            #     (success, result_dict, header_list) = read_xml_file_to_dict(file)
            else:
                return jsonify({"message": "Not a valid file extension " + file_extension, "alert_type": "alert-danger"})
            if not success: # then dict_list contains an error object
                e = dict_list # For clarity
                return jsonify({"message": e.message, "alert_type": "alert-danger"})

            try:
                if AUTOSPLIT and len(result_dict.keys()) > AUTOSPLIT_SIZE:
                    docs = self.autosplit_doc(filename, result_dict)
                    for doc in docs:
                        db[full_collection_name].insert_one({"name": doc["name"], "data_rows": doc["data_rows"], "header_list": header_list})
                else:
                    db[full_collection_name].insert_one({"name": filename, "data_rows": result_dict, "header_list": header_list})
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
                stop_spinner()
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_selector_list(collection_name)
        return jsonify({"message":"Collection successfully loaded", "alert_type": "alert-success"})

    def delete_collection(self, collection_name):
        db.drop_collection(self.user_obj.full_collection_name(collection_name))
        self.update_selector_list()
        return jsonify({"success": True})

    def duplicate_collection(self):
        collection_to_copy = self.user_obj.full_collection_name(request.json['res_to_copy'])
        new_collection_name = self.user_obj.full_collection_name(request.json['new_res_name'])
        for doc in db[collection_to_copy].find():
            db[new_collection_name].insert_one(doc)
        self.update_selector_list(request.json['new_res_name'])
        return jsonify({"success": True})

class RepositoryCollectionManager(CollectionManager):
    def add_rules(self):
        x = 3

    def request_update_selector_list(self):
        return render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type(), rep_string="repository-")

class ProjectManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/main_project/<project_name>', "main_project", login_required(self.main_project), methods=['get'])
        app.add_url_rule('/delete_project/<project_name>', "delete_project", login_required(self.delete_project), methods=['post'])

    def main_project(self, project_name):
        project_dict = db[self.user_obj.project_collection_name].find_one({"project_name": project_name})
        if self.user_obj.username not in loaded_user_modules:
            loaded_user_modules[self.user_obj.username] = set([])
        for module in project_dict["loaded_modules"]:
            if module not in loaded_user_modules[current_user.username]:
                tile_manager.load_tile_module(module)
        main_id = create_new_mainwindow_from_project(project_dict)
        doc_names = mainwindow_instances[main_id].doc_names
        short_collection_name = mainwindow_instances[main_id].short_collection_name

        # We want to do this in case there were some additional modules loaded
        # the loaded_modules must be a list to be easily saved to pymongo
        mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[self.user_obj.username])
        return render_template("main.html",
                               collection_name=project_dict["collection_name"],
                               project_name=project_name,
                               window_title=project_name,
                               main_id=main_id,
                               doc_names=doc_names,
                               use_ssl = str(use_ssl),
                               short_collection_name=short_collection_name)

    def delete_project(self, project_name):
        db[self.user_obj.project_collection_name].delete_one({"project_name": project_name})
        self.update_selector_list()
        return

class RepositoryProjectManager(ProjectManager):
    def add_rules(self):
        x = 3

    def request_update_selector_list(self):
        return render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type(), rep_string="repository-")

class TileManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/view_module/<module_name>', "view_module", login_required(self.view_module), methods=['get'])
        app.add_url_rule('/load_tile_module/<tile_module_name>', "load_tile_module", login_required(self.load_tile_module), methods=['get', 'post'])
        app.add_url_rule('/unload_all_tiles', "unload_all_tiles", login_required(self.unload_all_tiles), methods=['get', 'post'])
        app.add_url_rule('/add_tile_module', "add_tile_module", login_required(self.add_tile_module), methods=['get', "post"])
        app.add_url_rule('/delete_tile_module/<tile_module_name>', "delete_tile_module", login_required(self.delete_tile_module), methods=['post'])
        app.add_url_rule('/create_tile_module', "create_tile_module", login_required(self.create_tile_module), methods=['get', 'post'])
        app.add_url_rule('/request_update_loaded_tile_list', "request_update_loaded_tile_list", login_required(self.request_update_loaded_tile_list), methods=['get', 'post'])


    def view_module(self, module_name):
        module_code = self.user_obj.get_tile_module(module_name)
        return render_template("user_manage/module_viewer.html",
                               module_name=module_name,
                               module_code=module_code)

    def load_tile_module(self, tile_module_name):
        try:
            tile_module = self.user_obj.get_tile_module(tile_module_name)
            result = create_user_tiles(tile_module)
            if not result == "success":
                return jsonify({"message": result, "alert_type": "alert-warning"})
            if self.user_obj.username not in loaded_user_modules:
                loaded_user_modules[current_user.username] = set([])
            loaded_user_modules[current_user.username].add(tile_module_name)
            socketio.emit('update-loaded-tile-list', {"html": self.render_loaded_tile_list()},
                                                 namespace='/user_manage', room=current_user.get_id())
            socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
            return jsonify({"message": "Tile module successfully loaded", "alert_type": "alert-success"})
        except:
            error_string = "Error loading tile: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def unload_all_tiles(self):
        try:
            loaded_user_modules[current_user.username] = set([])
            user_tiles[current_user.username] = {}
            socketio.emit('update-loaded-tile-list', {"html": self.render_loaded_tile_list()},
                                                 namespace='/user_manage', room=current_user.get_id())
            socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
            return jsonify({"message": "Tiles successfully unloaded", "alert_type": "alert-success"})
        except:
            error_string = "Error unloading tiles: " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def add_tile_module(self):
        f = request.files['file']
        the_module = f.read()
        metadata = create_initial_metadata()
        data_dict = {"tile_module_name": f.filename, "tile_module": the_module, "metadata": metadata}
        db[self.user_obj.tile_collection_name].insert_one(data_dict)
        self.update_selector_list(file.filename)
        return make_response("", 204)

    def create_tile_module(self):
        new_tile_name = request.json['new_res_name']
        mongo_dict = db["shared_tiles"].find_one({"tile_module_name": "tile_template.py"})
        template = mongo_dict["tile_module"]

        metadata = create_initial_metadata()
        data_dict = {"tile_module_name": new_tile_name, "tile_module": template, "metadata": metadata}
        db[self.user_obj.tile_collection_name].insert_one(data_dict)
        self.update_selector_list(new_tile_name)
        return redirect(url_for('view_module', module_name=new_tile_name))

    def delete_tile_module(self, tile_module_name):
        db[self.user_obj.tile_collection_name].delete_one({"tile_module_name": tile_module_name})
        self.update_selector_list()
        return jsonify({"success": True})

    def render_loaded_tile_list(self):
        loaded_tiles = []
        for (category, dict) in user_tiles[self.user_obj.username].items():
            loaded_tiles += dict.keys()
        return render_template("user_manage/loaded_tile_list.html", user_tile_name_list=loaded_tiles)

    def request_update_loaded_tile_list(self):
        return self.render_loaded_tile_list()

class RepositoryTileManager(TileManager):
    def add_rules(self):
        x = 3

    def request_update_selector_list(self):
        return render_template("user_manage/resource_list.html", res_type=self.res_type, resource_names=self.get_resource_list_from_type(), rep_string="repository-")

repository_user = User.get_user_by_username("repository")

list_manager = ListManager("list", current_user)
repository_list_manager = RepositoryListManager("list", repository_user)

collection_manager = CollectionManager("collection", current_user)
repository_collection_manager = RepositoryCollectionManager("collection", repository_user)

project_manager = ProjectManager("project", current_user)
repository_project_manager = RepositoryProjectManager("project", repository_user)

tile_manager = TileManager("tile", current_user)
repository_tile_manager = RepositoryTileManager("tile", repository_user)

@app.route('/user_manage')
@login_required
def user_manage():
    if current_user.username in user_tiles:
        user_tile_name_list = user_tiles[current_user.username].keys()
    else:
        user_tile_name_list = []
    return render_template('user_manage/user_manage.html', user_tile_name_list=user_tile_name_list, use_ssl=str(use_ssl))

# Metadata views

@app.route('/grab_metadata', methods=['POST'])
@login_required
def grab_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        if res_type == "collection":
            cname = current_user.build_data_collection_name(res_name)
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

@app.route('/grab_repository_metadata', methods=['POST'])
@login_required
def grab_repository_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        if res_type == "collection":
            cname = repository_user.build_data_collection_name(res_name)
            mdata = db[cname].find_one({"name": "__metadata__"})
        else:
            if res_type == "tile":
                doc = db[repository_user.tile_collection_name].find_one({"tile_module_name": res_name})
            elif res_type == "list":
                doc = db[repository_user.list_collection_name].find_one({"list_name": res_name})
            elif res_type == "project":
                doc = db[repository_user.project_collection_name].find_one({"project_name": res_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = None
        if mdata is None:
            return jsonify({"success": False, "message": "No repository metadata found", "alert_type": "alert-warning"})
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
            cname = current_user.build_data_collection_name(res_name)
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

@app.route('/search_resource', methods=['POST'])
@login_required
def search_resource():
    txt = request.json["text"]
    res_type = request.json["res_type"]
    search_type = request.json["search_type"]
    search_location = request.json["location"]
    if search_location == "repository":
        user_obj = repository_user
        rep_string = "repository-"
    else:
        user_obj = current_user
        rep_string = ""
    if search_type == "search":
        the_list = user_obj.get_resource_names(res_type, search_filter=txt)
    else:
        the_list = user_obj.get_resource_names(res_type, tag_filter=txt)
    the_html = render_template("user_manage/resource_list.html", res_type=res_type, resource_names=the_list, rep_string=rep_string)
    return jsonify({"html": the_html})

@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        module_code = data_dict["new_code"]
        tags = data_dict["tags"]
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = data_dict["tags"]
        mdata["notes"] = data_dict["notes"]

        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata}})
        return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " "  + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

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