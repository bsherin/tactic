
import sys, datetime, copy
import re
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request

from tactic_app import app, db, use_ssl
import tactic_app

from tactic_app.file_handling import load_a_list
from tactic_app.resource_manager import ResourceManager, LibraryResourceManager
from tactic_app.users import User
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


# noinspection PyMethodMayBeStatic
class ListManager(LibraryResourceManager):
    collection_list = "list_names"
    collection_list_with_metadata = "list_names_with_metadata"
    collection_name = "list_collection_name"

    name_field = "list_name"

    def add_rules(self):
        app.add_url_rule('/view_list/<list_name>', "view_list", login_required(self.view_list), methods=['get'])

        app.add_url_rule('/get_list/<list_name>', "get_list", login_required(self.get_list), methods=['get', 'post'])
        app.add_url_rule('/add_list', "add_list", login_required(self.add_list), methods=['get', "post"])
        app.add_url_rule('/delete_list', "delete_list", login_required(self.delete_list), methods=['post'])
        app.add_url_rule('/create_duplicate_list', "create_duplicate_list",
                         login_required(self.create_duplicate_list), methods=['get', 'post'])
        app.add_url_rule('/update_list', "update_list",
                         login_required(self.update_list), methods=['get', 'post'])
        app.add_url_rule('/search_inside_lists', "search_inside_lists",
                         login_required(self.search_inside_lists), methods=['get', 'post'])
        app.add_url_rule('/search_list_metadata', "search_list_metadata",
                         login_required(self.search_list_metadata), methods=['get', 'post'])

    def view_list(self, list_name):
        javascript_source = url_for('static', filename='tactic_js/list_viewer_react.js')
        return render_template("library/resource_viewer_react.html",
                               resource_name=list_name,
                               include_metadata=True,
                               include_above_main_area=False,
                               include_right=True,
                               read_only=False,
                               use_ssl=use_ssl,
                               is_repository=False,
                               javascript_source=javascript_source,
                               version_string=tstring)

    def update_list(self):  # This is called from the list viewer
        try:
            data_dict = request.json
            list_name = data_dict["list_name"]
            new_list_as_string = data_dict["new_list_as_string"]
            new_list = new_list_as_string.split("\n")
            doc = db[current_user.list_collection_name].find_one({"list_name": list_name})
            if "metadata" in doc:
                mdata = doc["metadata"]
            else:
                mdata = {}
            mdata["tags"] = data_dict["tags"]
            mdata["notes"] = data_dict["notes"]
            mdata["updated"] = datetime.datetime.utcnow()

            db[current_user.list_collection_name].update_one({"list_name": list_name},
                                                             {'$set': {"the_list": new_list, "metadata": mdata}})

            self.update_selector_row(self.build_res_dict(list_name, mdata))
            return jsonify({"success": True, "message": "List Successfully Saved", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error saving list")

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            db[current_user.list_collection_name].update_one({"list_name": old_name},
                                                             {'$set': {"list_name": new_name}})
            # self.update_selector_list()
            return jsonify({"success": True, "message": "List name changed", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming list")

    def get_list(self, list_name):
        the_list = current_user.get_list(list_name)
        lstring = ""
        for w in the_list:
            lstring += w + "\n"
        return jsonify({"success": True, "the_content": lstring})

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

    def delete_tag(self, tag):
        doclist = db[current_user.list_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["list_name"]
                db[current_user.list_collection_name].update_one({"list_name": res_name}, {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = db[current_user.list_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            for old_tag, new_tag in tag_changes:
                if old_tag in taglist:
                    taglist.remove(old_tag)
                    if new_tag not in taglist:
                        taglist.append(new_tag)
                    mdata["tags"] = " ".join(taglist)
                    res_name = doc["list_name"]
                    db[current_user.list_collection_name].update_one({"list_name": res_name}, {'$set': {"metadata": mdata}})
        return

    def add_list(self):
        user_obj = current_user
        the_file = request.files['file']
        if db[user_obj.list_collection_name].find_one({"list_name": the_file.filename}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A list with that name already exists"})
        the_list = load_a_list(the_file)
        metadata = global_tile_manager.create_initial_metadata()
        data_dict = {"list_name": the_file.filename, "the_list": the_list, "metadata": metadata}
        db[user_obj.list_collection_name].insert_one(data_dict)
        new_row = self.build_res_dict(the_file.filename, metadata, user_obj)
        return jsonify({"success": True, "new_row": new_row})

    def delete_list(self):
        try:
            user_obj = current_user
            list_names = request.json["resource_names"]
            for list_name in list_names:
                db[user_obj.list_collection_name].delete_one({"list_name": list_name})
            return jsonify({"success": True, "message": "Lists(s) successfully deleted",
                            "alert_type": "alert-success"})

        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error deleting lists")

    def create_duplicate_list(self):
        user_obj = current_user
        list_to_copy = request.json['res_to_copy']
        new_list_name = request.json['new_res_name']
        if db[user_obj.list_collection_name].find_one({"list_name": new_list_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A list with that name already exists"})
        old_list_dict = db[user_obj.list_collection_name].find_one({"list_name": list_to_copy})
        metadata = copy.copy(old_list_dict["metadata"])
        new_list_dict = {"list_name": new_list_name, "the_list": old_list_dict["the_list"], "metadata": metadata}
        db[user_obj.list_collection_name].insert_one(new_list_dict)
        new_row = self.build_res_dict(new_list_name, metadata, user_obj)
        return jsonify({"success": True, "new_row": new_row})

    def search_inside_lists(self):
        user_obj = current_user
        search_text = request.json['search_text']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        res = db[user_obj.list_collection_name].find({"the_list": reg})
        res_list = []
        for t in res:
            res_list.append(t["list_name"])
        return jsonify({"success": True, "match_list": res_list})

    def search_list_metadata(self):
        user_obj = current_user
        search_text = request.json['search_text']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        res = db[user_obj.list_collection_name].find({"$or": [{"list_name": reg}, {"metadata.notes": reg},
                                                     {"metadata.tags": reg}]})
        res_list = []
        for t in res:
            res_list.append(t["list_name"])
        return jsonify({"success": True, "match_list": res_list})


class RepositoryListManager(ListManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        app.add_url_rule('/repository_view_list/<list_name>', "repository_view_list",
                         login_required(self.repository_view_list), methods=['get'])
        app.add_url_rule('/repository_get_list/<list_name>', "repository_get_list",
                         login_required(self.repository_get_list), methods=['get', 'post'])

    def repository_view_list(self, list_name):
        javascript_source = url_for('static', filename='tactic_js/list_viewer_react.js')
        return render_template("library/resource_viewer_react.html",
                               resource_name=list_name,
                               include_metadata=True,
                               include_above_main_area=False,
                               include_right=True,
                               read_only=True,
                               use_ssl=use_ssl,
                               is_repository=True,
                               javascript_source=javascript_source,
                               version_string=tstring)

    def repository_get_list(self, list_name):
        the_list = repository_user.get_list(list_name)
        lstring = ""
        for w in the_list:
            lstring += w + "\n"
        return jsonify({"success": True, "the_content": lstring})
