import os, sys, datetime
from flask import render_template, request, jsonify, send_file
from flask_login import login_required, current_user
from flask_socketio import join_room
from tactic_app import app, db, socketio, use_ssl
from tactic_app.file_handling import read_csv_file_to_dict, read_txt_file_to_dict, load_a_list
from tactic_app.main import create_new_mainwindow, create_new_mainwindow_from_project, mainwindow_instances
from tactic_app.users import User
from tactic_app.user_tile_env import create_user_tiles
from tactic_app.shared_dicts import user_tiles, loaded_user_modules, create_initial_metadata

AUTOSPLIT = True
AUTOSPLIT_SIZE = 10000


def start_spinner():
    socketio.emit('start-spinner', {}, namespace='/user_manage', room=current_user.get_id())


def stop_spinner():
    socketio.emit('stop-spinner', {}, namespace='/user_manage', room=current_user.get_id())


class ResourceManager(object):
    is_repository = False
    rep_string = ""
    collection_list = ""
    collection_list_with_metadata = ""
    collection_name = ""
    name_field = ""

    def __init__(self, res_type):
        self.res_type = res_type
        self.add_rules()

    def add_rules(self):
        print "not implemented"

    def update_selector_list(self, select=None):
        if select is None:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(), "res_type": self.res_type},
                          namespace='/user_manage', room=current_user.get_id())
        else:
            socketio.emit('update-selector-list',
                          {"html": self.request_update_selector_list(), "select": select, "res_type": self.res_type},
                          namespace='/user_manage', room=current_user.get_id())

    def get_resource_list(self):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        return getattr(user_obj, self.collection_list)

    def get_resource_list_with_metadata(self):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        return getattr(user_obj, self.collection_list_with_metadata)

    def request_update_selector_list(self):
        res_list_with_metadata = self.get_resource_list_with_metadata()
        res_array = self.build_resource_array(res_list_with_metadata)
        result = self.build_html_table_from_data_list(res_array)
        return result

    def build_html_table_from_data_list(self, data_list, title=None):
        the_html = "<table class='tile-table table sortable table-striped table-bordered table-condensed'>"
        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            the_html += "<tr class='selector-button {0}-selector-button' id='{0}-selector-{1}'>".format(self.res_type,
                                                                                                        r[0])
            for c in r:
                the_html += "<td>{0}</td>".format(c)
            the_html += "</tr>"

        the_html += "</tbody></table>"
        return the_html

    def build_resource_array(self, res_list):
        larray = [["Name", "Created", "Updated", "Tags"]]
        for res_item in res_list:
            mdata = res_item[1]
            if mdata is None:
                datestring = ""
                tagstring = ""
                updatestring = ""
            else:
                if "datetime" in mdata:
                    datestring = mdata["datetime"].strftime("%b %d, %Y, %H:%M")
                else:
                    datestring = ""
                if "updated" in mdata:
                    updatestring = mdata["updated"].strftime("%b %d, %Y, %H:%M")
                else:
                    updatestring = ""
                tagstring = str(mdata["tags"])
            larray.append([res_item[0], datestring, updatestring, tagstring])
        return larray


def get_manager_for_type(res_type, is_repository=False):
    if is_repository:
        if res_type == "list":
            manager = repository_list_manager
        elif res_type == "collection":
            manager = repository_collection_manager
        elif res_type == "project":
            manager = repository_project_manager
        elif res_type == "tile":
            manager = repository_tile_manager
    else:
        if res_type == "list":
            manager = list_manager
        elif res_type == "collection":
            manager = collection_manager
        elif res_type == "project":
            manager = project_manager
        elif res_type == "tile":
            manager = tile_manager
    return manager


@app.route('/copy_from_repository', methods=['GET', 'POST'])
@login_required
def copy_from_repository():
    res_type = request.json['res_type']

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
        manager = get_manager_for_type(res_type)
        repo_manager = get_manager_for_type(res_type, is_repository=True)
        old_dict = db[getattr(repository_user, repo_manager.collection_name)].find_one({manager.name_field: res_name})
        new_res_dict = {manager.name_field: new_res_name}
        for (key, val) in old_dict.items():
            if (key == "_id") or (key == manager.name_field):
                continue
            new_res_dict[key] = val
        if "metadata" not in new_res_dict:
            new_res_dict["metadata"] = create_initial_metadata()
        else:
            new_res_dict["metadata"]["datetime"] = datetime.datetime.today()
        db[getattr(current_user, repo_manager.collection_name)].insert_one(new_res_dict)
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
    collection_list = "list_names"
    collection_list_with_metadata = "list_names_with_metadata"
    collection_name = "list_collection_name"
    name_field = "list_name"

    def add_rules(self):
        app.add_url_rule('/view_list/<list_name>', "view_list", login_required(self.view_list), methods=['get'])
        app.add_url_rule('/add_list', "add_list", login_required(self.add_list), methods=['get', "post"])
        app.add_url_rule('/delete_list/<list_name>', "delete_list", login_required(self.delete_list), methods=['post'])
        app.add_url_rule('/create_duplicate_list', "create_duplicate_list",
                         login_required(self.create_duplicate_list), methods=['get', 'post'])

    def view_list(self, list_name):
        the_list = current_user.get_list(list_name)
        return render_template("user_manage/list_viewer.html",
                               list_name=list_name,
                               the_list=the_list)

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        doc = db[user_obj.list_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes):
        doc = db[current_user.list_collection_name].find_one({"list_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        db[current_user.list_collection_name].update_one({"list_name": res_name}, {'$set': {"metadata": mdata}})

    def add_list(self):
        user_obj = current_user
        the_file = request.files['file']
        if db[user_obj.list_collection_name].find_one({"list_name": the_file.filename}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A list with that name already exists"})
        the_list = load_a_list(the_file)
        metadata = create_initial_metadata()
        data_dict = {"list_name": the_file.filename, "the_list": the_list, "metadata": metadata}
        db[user_obj.list_collection_name].insert_one(data_dict)
        self.update_selector_list(select=the_file.filename)
        return jsonify({"success": True})

    def delete_list(self, list_name):
        user_obj = current_user
        db[user_obj.list_collection_name].delete_one({"list_name": list_name})
        self.update_selector_list()
        return jsonify({"success": True})

    def create_duplicate_list(self):
        user_obj = current_user
        list_to_copy = request.json['res_to_copy']
        new_list_name = request.json['new_res_name']
        if db[user_obj.list_collection_name].find_one({"list_name": new_list_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A list with that name already exists"})
        old_list_dict = db[user_obj.list_collection_name].find_one({"list_name": list_to_copy})
        metadata = create_initial_metadata()
        new_list_dict = {"list_name": new_list_name, "the_list": old_list_dict["the_list"], "metadata": metadata}
        db[user_obj.list_collection_name].insert_one(new_list_dict)
        self.update_selector_list(select=new_list_name)
        return jsonify({"success": True})


class RepositoryListManager(ListManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass


class CollectionManager(ResourceManager):
    collection_list = "data_collections"
    collection_list_with_metadata = "data_collection_names_with_metadata"
    collection_name = ""
    name_field = ""

    def add_rules(self):
        app.add_url_rule('/main/<collection_name>', "main", login_required(self.main), methods=['get'])
        app.add_url_rule('/load_files/<collection_name>', "load_files",
                         login_required(self.load_files), methods=['get', "post"])
        app.add_url_rule('/delete_collection/<collection_name>', "delete_collection",
                         login_required(self.delete_collection), methods=['post'])
        app.add_url_rule('/duplicate_collection', "duplicate_collection",
                         login_required(self.duplicate_collection), methods=['post', 'get'])

    def main(self, collection_name):
        user_obj = current_user
        cname = user_obj.build_data_collection_name(collection_name)
        main_id = create_new_mainwindow(user_obj.get_id(), collection_name=cname)
        doc_names = mainwindow_instances[main_id].doc_names
        short_collection_name = mainwindow_instances[main_id].short_collection_name
        if user_obj.username not in loaded_user_modules:
            loaded_user_modules[user_obj.username] = set([])

        # the loaded_modules must be a list to be easily saved to pymongo
        mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[user_obj.username])
        return render_template("main.html",
                               collection_name=cname,
                               window_title=short_collection_name,
                               project_name='',
                               main_id=main_id,
                               doc_names=doc_names,
                               use_ssl=str(use_ssl),
                               short_collection_name=short_collection_name)

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        cname = user_obj.build_data_collection_name(res_name)
        mdata = db[cname].find_one({"name": "__metadata__"})
        return mdata

    def save_metadata(self, res_name, tags, notes):
        cname = current_user.build_data_collection_name(res_name)
        mdata = db[cname].find_one({"name": "__metadata__"})
        if mdata is None:
            db[cname].insert_one({"name": "__metadata__", "tags": tags, "notes": notes})
        else:
            db[cname].update_one({"name": "__metadata__"},
                                 {'$set': {"tags": tags, "notes": notes}})

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
        user_obj = current_user
        file_list = request.files.getlist("file")
        full_collection_name = user_obj.build_data_collection_name(collection_name)
        if full_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})
        mdata = create_initial_metadata()
        try:
            db[full_collection_name].insert_one({"name": "__metadata__", "datetime": mdata["datetime"],
                                                 "tags": "", "notes": ""})
        except:
            error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            if file_extension == ".csv":
                (success, result_dict, header_list) = read_csv_file_to_dict(the_file)
            elif file_extension == ".txt":
                (success, result_dict, header_list) = read_txt_file_to_dict(the_file)
            # elif file_extension == ".xml":
            #     (success, result_dict, header_list) = read_xml_file_to_dict(file)
            else:
                return jsonify({"message": "Not a valid file extension " + file_extension,
                                "alert_type": "alert-danger"})
            if not success:  # then result_dict contains an error object
                e = result_dict
                return jsonify({"message": e.message, "alert_type": "alert-danger"})

            try:
                if AUTOSPLIT and len(result_dict.keys()) > AUTOSPLIT_SIZE:
                    docs = self.autosplit_doc(filename, result_dict)
                    for doc in docs:
                        db[full_collection_name].insert_one({"name": doc["name"], "data_rows": doc["data_rows"],
                                                             "header_list": header_list})
                else:
                    db[full_collection_name].insert_one({"name": filename, "data_rows": result_dict,
                                                         "header_list": header_list})
            except:
                error_string = "Error creating collection: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                stop_spinner()
                return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_selector_list(collection_name)
        return jsonify({"message": "Collection successfully loaded", "alert_type": "alert-success"})

    def delete_collection(self, collection_name):
        user_obj = current_user
        db.drop_collection(user_obj.full_collection_name(collection_name))
        self.update_selector_list()
        return jsonify({"success": True})

    def duplicate_collection(self):
        user_obj = current_user
        collection_to_copy = user_obj.full_collection_name(request.json['res_to_copy'])
        new_collection_name = user_obj.full_collection_name(request.json['new_res_name'])
        if new_collection_name in db.collection_names():
            return jsonify({"success": False, "message": "There is already a collection with that name.",
                            "alert_type": "alert-warning"})
        for doc in db[collection_to_copy].find():
            db[new_collection_name].insert_one(doc)
        self.update_selector_list(request.json['new_res_name'])
        return jsonify({"success": True})


class RepositoryCollectionManager(CollectionManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass


class ProjectManager(ResourceManager):
    collection_list = "project_names"
    collection_list_with_metadata = "project_names_with_metadata"
    collection_name = "project_collection_name"
    name_field = "project_name"

    def add_rules(self):
        app.add_url_rule('/main_project/<project_name>', "main_project", login_required(self.main_project),
                         methods=['get'])
        app.add_url_rule('/delete_project/<project_name>', "delete_project", login_required(self.delete_project),
                         methods=['post'])

    def main_project(self, project_name):
        user_obj = current_user
        project_dict = db[user_obj.project_collection_name].find_one({"project_name": project_name})
        if user_obj.username not in loaded_user_modules:
            loaded_user_modules[user_obj.username] = set([])
        for module in project_dict["loaded_modules"]:
            if module not in loaded_user_modules[current_user.username]:
                tile_manager.load_tile_module(module)
        main_id = create_new_mainwindow_from_project(project_dict)
        doc_names = mainwindow_instances[main_id].doc_names
        short_collection_name = mainwindow_instances[main_id].short_collection_name
        mainwindow_instances[main_id].mdata = project_dict["metadata"]

        # We want to do this in case there were some additional modules loaded
        # the loaded_modules must be a list to be easily saved to pymongo
        mainwindow_instances[main_id].loaded_modules = list(loaded_user_modules[user_obj.username])
        return render_template("main.html",
                               collection_name=project_dict["collection_name"],
                               project_name=project_name,
                               window_title=project_name,
                               main_id=main_id,
                               doc_names=doc_names,
                               use_ssl=str(use_ssl),
                               short_collection_name=short_collection_name)

    def delete_project(self, project_name):
        user_obj = current_user
        db[user_obj.project_collection_name].delete_one({"project_name": project_name})
        self.update_selector_list()
        return jsonify({"success": True})

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        doc = db[user_obj.project_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes):
        doc = db[current_user.project_collection_name].find_one({"project_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})


class RepositoryProjectManager(ProjectManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass


class TileManager(ResourceManager):
    collection_list = "tile_module_names"
    collection_list_with_metadata = "tile_module_names_with_metadata"
    collection_name = "tile_collection_name"
    name_field = "tile_module_name"

    def add_rules(self):
        app.add_url_rule('/view_module/<module_name>', "view_module",
                         login_required(self.view_module), methods=['get'])
        app.add_url_rule('/load_tile_module/<tile_module_name>', "load_tile_module",
                         login_required(self.load_tile_module), methods=['get', 'post'])
        app.add_url_rule('/unload_all_tiles', "unload_all_tiles",
                         login_required(self.unload_all_tiles), methods=['get', 'post'])
        app.add_url_rule('/add_tile_module', "add_tile_module",
                         login_required(self.add_tile_module), methods=['get', "post"])
        app.add_url_rule('/delete_tile_module/<tile_module_name>', "delete_tile_module",
                         login_required(self.delete_tile_module), methods=['post'])
        app.add_url_rule('/create_tile_module', "create_tile_module",
                         login_required(self.create_tile_module), methods=['get', 'post'])
        app.add_url_rule('/request_update_loaded_tile_list', "request_update_loaded_tile_list",
                         login_required(self.request_update_loaded_tile_list), methods=['get', 'post'])

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        doc = db[user_obj.tile_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes):
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        db[current_user.tile_collection_name].update_one({"tile_module_name": res_name}, {'$set': {"metadata": mdata}})

    def view_module(self, module_name):
        user_obj = current_user
        module_code = user_obj.get_tile_module(module_name)
        return render_template("user_manage/module_viewer.html",
                               module_name=module_name,
                               module_code=module_code)

    def load_tile_module(self, tile_module_name):
        try:
            user_obj = current_user
            tile_module = user_obj.get_tile_module(tile_module_name)
            result = create_user_tiles(tile_module)
            if not result == "success":
                return jsonify({"success": False, "message": result, "alert_type": "alert-warning"})
            if user_obj.username not in loaded_user_modules:
                loaded_user_modules[current_user.username] = set([])
            loaded_user_modules[current_user.username].add(tile_module_name)
            socketio.emit('update-loaded-tile-list', {"html": self.render_loaded_tile_list()},
                          namespace='/user_manage', room=current_user.get_id())
            socketio.emit('update-menus', {}, namespace='/main', room=current_user.get_id())
            return jsonify({"message": "Tile module successfully loaded", "alert_type": "alert-success"})
        except:
            error_string = "Error loading tile: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
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
            error_string = "Error unloading tiles: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def add_tile_module(self):
        user_obj = current_user
        f = request.files['file']
        if db[user_obj.tile_collection_name].find_one({"tile_module_name": f.filename}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        the_module = f.read()
        metadata = create_initial_metadata()
        data_dict = {"tile_module_name": f.filename, "tile_module": the_module, "metadata": metadata}
        db[user_obj.tile_collection_name].insert_one(data_dict)
        self.update_selector_list(f.filename)
        return jsonify({"success": True})

    def create_tile_module(self):
        user_obj = current_user
        new_tile_name = request.json['new_res_name']
        if db[user_obj.tile_collection_name].find_one({"tile_module_name": new_tile_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        mongo_dict = db["shared_tiles"].find_one({"tile_module_name": "tile_template.py"})
        template = mongo_dict["tile_module"]

        metadata = create_initial_metadata()
        data_dict = {"tile_module_name": new_tile_name, "tile_module": template, "metadata": metadata}
        db[current_user.tile_collection_name].insert_one(data_dict)
        self.update_selector_list(new_tile_name)
        return jsonify({"success": True})

    def delete_tile_module(self, tile_module_name):
        user_obj = current_user
        db[user_obj.tile_collection_name].delete_one({"tile_module_name": tile_module_name})
        self.update_selector_list()
        return jsonify({"success": True})

    def render_loaded_tile_list(self):
        loaded_tiles = []
        if current_user.username in user_tiles:
            for (category, the_dict) in user_tiles[current_user.username].items():
                loaded_tiles += the_dict.keys()
        return render_template("user_manage/loaded_tile_list.html", user_tile_name_list=loaded_tiles)

    def request_update_loaded_tile_list(self):
        return self.render_loaded_tile_list()


class RepositoryTileManager(TileManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass

repository_user = User.get_user_by_username("repository")

list_manager = ListManager("list")
repository_list_manager = RepositoryListManager("list")

collection_manager = CollectionManager("collection")
repository_collection_manager = RepositoryCollectionManager("collection")

project_manager = ProjectManager("project")
repository_project_manager = RepositoryProjectManager("project")

tile_manager = TileManager("tile")
repository_tile_manager = RepositoryTileManager("tile")


@app.route('/user_manage')
@login_required
def user_manage():
    if current_user.username in user_tiles:
        user_tile_name_list = user_tiles[current_user.username].keys()
    else:
        user_tile_name_list = []
    return render_template('user_manage/user_manage.html', user_tile_name_list=user_tile_name_list,
                           use_ssl=str(use_ssl))

# Metadata views


@app.route('/grab_metadata', methods=['POST'])
@login_required
def grab_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        manager = get_manager_for_type(res_type)
        mdata = manager.grab_metadata(res_name)
        if mdata is None:
            return jsonify({"success": False, "message": "No metadata found", "alert_type": "alert-warning"})
        else:
            if "datetime" in mdata:
                datestring = mdata["datetime"].strftime("%b %d, %Y, %H:%M")
            else:
                datestring = ""
            return jsonify({"success": True, "datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"]})
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
                datestring = mdata["datetime"].strftime("%b %d, %Y, %H:%M")
            else:
                datestring = ""
            return jsonify({"success": True, "datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"]})
    except:
        error_string = "Error getting metadata: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/save_metadata', methods=['POST'])
@login_required
def save_metadata():
    try:
        res_type = request.json["res_type"]
        res_name = request.json["res_name"]
        tags = request.json["tags"]
        notes = request.json["notes"]
        manager = get_manager_for_type(res_type)
        manager.save_metadata(res_name, tags, notes)
        return jsonify({"success": True, "message": "Saved metadata", "alert_type": "alert-success"})
    except:
        error_string = "Error saving metadata: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
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
        manager = get_manager_for_type(res_type, is_repository=False)
    if search_type == "search":
        the_list = user_obj.get_resource_names(res_type, search_filter=txt)
    else:
        the_list = user_obj.get_resource_names(res_type, tag_filter=txt)

    res_array = manager.build_resource_array(the_list)
    result = manager.build_html_table_from_data_list(res_array)
    return jsonify({"html": result})


@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        module_code = data_dict["new_code"]
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = data_dict["tags"]
        mdata["notes"] = data_dict["notes"]
        mdata["updated"] = datetime.datetime.today()

        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata}})
        tile_manager.update_selector_list()
        return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/get_modal_template', methods=['get'])
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
    room = data["user_id"]
    join_room(room)
    print "user joined room " + room
