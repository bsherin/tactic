
import sys
import datetime
import copy

import tactic_app
from tactic_app import app, db, use_ssl  # global_stuff

from tactic_app.resource_manager import ResourceManager, UserManageResourceManager
from flask import render_template, jsonify, url_for, request
from flask_login import login_required, current_user

from tactic_app.users import User
repository_user = User.get_user_by_username("repository")
global_tile_manager = tactic_app.global_tile_manager

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


class CodeManager(UserManageResourceManager):
    collection_list = "code_names"
    collection_list_with_metadata = "code_names_with_metadata"
    collection_name = "code_collection_name"
    name_field = "code_name"
    button_groups = [[{"name": "save_button", "button_class": "btn-outline-secondary",
                       "name_text": "Save", "icon_name": "save"},
                      {"name": "save_as_button", "button_class": "btn-outline-secondary",
                       "name_text": "Save as...", "icon_name": "save"},
                      {"name": "share_button", "button_class": "btn-outline-secondary",
                       "name_text": "Share", "icon_name": "share"}
                      ]]

    def add_rules(self):
        app.add_url_rule('/view_code/<code_name>', "view_code",
                         login_required(self.view_code), methods=['get', "post"])

        app.add_url_rule('/get_code_code/<code_name>', "get_code_code",
                         login_required(self.get_code_code), methods=['get', "post"])
        app.add_url_rule('/delete_code', "delete_code",
                         login_required(self.delete_code), methods=['post'])
        app.add_url_rule('/create_code', "create_code",
                         login_required(self.create_code), methods=['get', 'post'])
        app.add_url_rule('/create_duplicate_code', "create_duplicate_code",
                         login_required(self.create_duplicate_code), methods=['get', 'post'])

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            db[current_user.code_collection_name].update_one({"code_name": old_name},
                                                             {'$set': {"code_name": new_name}})
            # self.update_selector_list()
            return jsonify({"success": True, "message": "Module Successfully Saved", "alert_type": "alert-success"})
        except:
            error_string = "Error renaming module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def grab_metadata(self, res_name):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        doc = db[user_obj.code_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes):
        doc = db[current_user.code_collection_name].find_one({"code_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        db[current_user.code_collection_name].update_one({"code_name": res_name}, {'$set': {"metadata": mdata}})

    def delete_tag(self, tag):
        doclist = db[current_user.code_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["code_name"]
                db[current_user.code_collection_name].update_one({"code_name": res_name}, {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, old_tag, new_tag):
        doclist = db[current_user.code_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if old_tag in taglist:
                taglist.remove(old_tag)
                if new_tag not in taglist:
                    taglist.append(new_tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["code_name"]
                db[current_user.code_collection_name].update_one({"code_name": res_name}, {'$set': {"metadata": mdata}})
        return

    def view_code(self, code_name):
        javascript_source = url_for('static', filename='tactic_js/code_viewer.js')
        return render_template("user_manage/resource_viewer.html",
                               resource_name=code_name,
                               include_metadata=True,
                               include_right=True,
                               include_above_main_area=False,
                               readonly=False,
                               is_repository=False,
                               use_ssl=use_ssl,
                               javascript_source=javascript_source,
                               uses_codemirror="True",
                               button_groups=self.button_groups,
                               version_string=tstring)

    def get_code_code(self, code_name):
        user_obj = current_user
        the_code = user_obj.get_code(code_name)
        return jsonify({"success": True, "the_content": the_code})

    def create_duplicate_code(self):
        user_obj = current_user
        code_to_copy = request.json['res_to_copy']
        new_code_name = request.json['new_res_name']
        if db[user_obj.code_collection_name].find_one({"code_name": new_code_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A code resource with that name already exists"})
        old_code_dict = db[user_obj.code_collection_name].find_one({"code_name": code_to_copy})
        metadata = copy.copy(old_code_dict["metadata"])
        new_code_dict = {"code_name": new_code_name, "the_code": old_code_dict["the_code"], "metadata": metadata}
        db[user_obj.code_collection_name].insert_one(new_code_dict)
        table_row = self.create_new_row(new_code_name, metadata)
        all_table_row = self.all_manager.create_new_all_row(new_code_name, metadata, "code")
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row})

    def create_code(self):
        user_obj = current_user
        new_code_name = request.json['new_res_name']
        template_name = request.json["template_name"]
        if db[user_obj.code_collection_name].find_one({"code_name": new_code_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        mongo_dict = db[repository_user.code_collection_name].find_one({"code_name": template_name})
        template = mongo_dict["the_code"]

        metadata = global_tile_manager.create_initial_metadata()
        metadata["functions"] = []
        metadata["classes"] = []
        data_dict = {"code_name": new_code_name, "the_code": template, "metadata": metadata}
        db[current_user.code_collection_name].insert_one(data_dict)
        table_row = self.create_new_row(new_code_name, metadata)
        all_table_row = self.all_manager.create_new_all_row(new_code_name, metadata, "code")
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row})

    def delete_code(self):
        user_obj = current_user
        code_name = request.json["resource_name"]
        db[user_obj.code_collection_name].delete_one({"code_name": code_name})
        # self.update_selector_list()
        return jsonify({"success": True})


class RepositoryCodeManager(CodeManager):
    rep_string = "repository-"
    is_repository = True
    button_groups = [[{"name": "copy_button", "button_class": "btn-outline-secondary",
                       "name_text": "Copy", "icon_name": "share"}
                      ]]

    def add_rules(self):
        app.add_url_rule('/repository_view_code/<code_name>', "repository_view_code",
                         login_required(self.repository_view_code), methods=['get', "post"])
        app.add_url_rule('/repository_get_code_code/<code_name>', "repository_get_code_code",
                         login_required(self.repository_get_code_code), methods=['get', 'post'])

    def repository_view_code(self, code_name):
        javascript_source = url_for('static', filename='tactic_js/code_viewer.js')
        return render_template("user_manage/resource_viewer.html",
                               resource_name=code_name,
                               include_metadata=True,
                               include_right=True,
                               include_above_main_area=False,
                               readonly=True,
                               use_ssl=use_ssl,
                               is_repository=True,
                               javascript_source=javascript_source,
                               uses_codemirror="True",
                               button_groups=self.button_groups, version_string=tstring)

    def repository_get_code_code(self, code_name):
        user_obj = repository_user
        the_code = user_obj.get_code(code_name)
        return jsonify({"success": True, "the_content": the_code})
