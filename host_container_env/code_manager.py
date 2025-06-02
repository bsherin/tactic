
import sys
import datetime
import copy
import re

import tactic_app
from tactic_app import app, db  # global_stuff

from resource_manager import ResourceManager, LibraryResourceManager, repository_user
from flask import render_template, jsonify, url_for, request
from flask_login import login_required, current_user

from users import User
import loaded_tile_management

from js_source_management import js_source_dict, _develop, css_source

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


class CodeManager(LibraryResourceManager):
    collection_list = "code_names"
    collection_list_with_metadata = "code_names_with_metadata"
    collection_name = "code_collection_name"
    name_field = "code_name"

    def add_rules(self):
        app.add_url_rule('/view_code/<code_name>', "view_code",
                         login_required(self.view_code), methods=['get', "post"])
        app.add_url_rule('/view_code_in_context', "view_code_in_context",
                         login_required(self.view_code_in_context), methods=['get', "post"])

        app.add_url_rule('/get_code_code/<code_name>', "get_code_code",
                         login_required(self.get_code_code), methods=['get', "post"])
        app.add_url_rule('/create_code', "create_code",
                         login_required(self.create_code), methods=['get', 'post'])
        app.add_url_rule('/create_duplicate_code', "create_duplicate_code",
                         login_required(self.create_duplicate_code), methods=['get', 'post'])

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            self.db[current_user.code_collection_name].update_one({"code_name": old_name},
                                                                  {'$set': {"code_name": new_name}})
            return jsonify({"success": True, "message": "Code Successfully Saved", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming module")

    def grab_metadata(self, res_name):
        user_obj = current_user
        doc = self.db[user_obj.code_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes, uid=""):
        doc = self.db[current_user.code_collection_name].find_one({"code_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        mdata["mdata_uid"] = uid
        self.db[current_user.code_collection_name].update_one({"code_name": res_name}, {'$set': {"metadata": mdata}})

    def delete_tag(self, tag):
        doclist = self.db[current_user.code_collection_name].find()
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
                self.db[current_user.code_collection_name].update_one({"code_name": res_name},
                                                                      {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = self.db[current_user.code_collection_name].find()
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
                    res_name = doc["code_name"]
                    self.db[current_user.code_collection_name].update_one({"code_name": res_name},
                                                                          {'$set': {"metadata": mdata}})
        return

    def view_code(self, code_name):
        user_obj = current_user
        javascript_source = url_for('static', filename=js_source_dict["code_viewer_react"])
        return render_template("library/resource_viewer_react.html",
                               resource_name=code_name,
                               develop=str(_develop),
                               has_openapi_key=current_user.has_openapi_key,
                               javascript_source=javascript_source,
                               css_source=css_source("code_viewer_react"),
                               version_string=tstring)

    def view_code_in_context(self):
        user_obj = current_user
        code_name = request.json["resource_name"]
        code_code = user_obj.get_code(code_name)
        mdata = user_obj.process_metadata(self.grab_metadata(code_name))
        data = {
            "success": True,
            "kind": "code-viewer",
            "res_type": "code",
            "the_content": code_code,
            "mdata": mdata,
            "resource_name": code_name,
            "read_only": False,
            "is_repository": False,

        }
        return jsonify(data)

    def get_code_code(self, code_name):
        user_obj = current_user
        the_code = user_obj.get_code(code_name)
        return jsonify({"success": True, "the_content": the_code})

    def create_duplicate_code(self):
        user_obj = current_user
        code_to_copy = request.json['res_to_copy']
        new_code_name = request.json['new_res_name']
        if self.db[user_obj.code_collection_name].find_one({"code_name": new_code_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A code resource with that name already exists"})
        old_code_dict = self.db[user_obj.code_collection_name].find_one({"code_name": code_to_copy})
        metadata = copy.copy(old_code_dict["metadata"])
        metadata["updated"] = datetime.datetime.utcnow()
        metadata["datetime"] = metadata["updated"]
        new_code_dict = {"code_name": new_code_name, "the_code": old_code_dict["the_code"], "metadata": metadata}
        self.db[user_obj.code_collection_name].insert_one(new_code_dict)
        # new_row = self.build_res_dict(new_code_name, metadata, user_obj)
        return jsonify({"success": True})

    def create_code(self):
        user_obj = current_user
        new_code_name = request.json['new_res_name']
        template_name = request.json["template_name"]
        if self.db[user_obj.code_collection_name].find_one({"code_name": new_code_name}) is not None:
            return jsonify({"success": False, "alert_type": "alert-warning",
                            "message": "A module with that name already exists"})
        mongo_dict = self.db[repository_user.code_collection_name].find_one({"code_name": template_name})
        template = mongo_dict["the_code"]

        metadata = loaded_tile_management.create_initial_metadata()
        metadata["functions"] = []
        metadata["classes"] = []
        data_dict = {"code_name": new_code_name, "the_code": template, "metadata": metadata}
        self.db[current_user.code_collection_name].insert_one(data_dict)
        return jsonify({"success": True})


class RepositoryCodeManager(CodeManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        app.add_url_rule('/repository_view_code/<code_name>', "repository_view_code",
                         login_required(self.repository_view_code), methods=['get', "post"])
        app.add_url_rule('/repository_view_code_in_context', "repository_view_code_in_context",
                         login_required(self.repository_view_code_in_context), methods=['get', 'post'])
        app.add_url_rule('/repository_get_code_code/<code_name>', "repository_get_code_code",
                         login_required(self.repository_get_code_code), methods=['get', 'post'])

    def grab_metadata(self, res_name):
        user_obj = repository_user
        doc = self.repository_db[user_obj.code_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def repository_view_code_in_context(self):
        code_name = request.json["resource_name"]
        code_code = repository_user.get_code(code_name)
        mdata = repository_user.process_metadata(self.grab_metadata(code_name))
        data = {
            "success": True,
            "kind": "code-viewer",
            "res_type": "code",
            "the_content": code_code,
            "mdata": mdata,
            "resource_name": code_name,
            "read_only": True,
            "is_repository": True,
        }
        return jsonify(data)

    def repository_view_code(self, code_name):
        user_obj = current_user
        javascript_source = url_for('static', filename=js_source_dict["code_viewer_react"])
        return render_template("library/resource_viewer_react.html",
                               resource_name=code_name,
                               include_metadata=True,
                               include_right=True,
                               include_above_main_area=False,
                               read_only=True,
                               develop=str(_develop),
                               is_repository=True,
                               javascript_source=javascript_source,
                               css_source=css_source("code_viewer_react"),
                               uses_codemirror="True",
                               version_string=tstring)

    def repository_get_code_code(self, code_name):
        user_obj = repository_user
        the_code = user_obj.get_code(code_name)
        return jsonify({"success": True, "the_content": the_code})
