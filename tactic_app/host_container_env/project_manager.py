
import sys
import re
import os
import io
from collections import OrderedDict
from flask import jsonify, request, url_for, render_template, send_file
from flask_login import login_required, current_user
import tactic_app
from tactic_app import app, db, fs
from docker_functions import create_container, main_container_info
from resource_manager import ResourceManager, LibraryResourceManager, repository_user
from users import User
from communication_utils import make_jsonizable_and_compress, read_project_dict
import loaded_tile_management
from mongo_accesser import make_name_unique
from file_handling import read_freeform_file
from redis_tools import create_ready_block

from js_source_management import js_source_dict, _develop, css_source

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


class ProjectManager(LibraryResourceManager):
    collection_list = "project_names"
    collection_list_with_metadata = "project_names_with_metadata"
    collection_name = "project_collection_name"
    name_field = "project_name"

    def add_rules(self):
        app.add_url_rule('/main_project/<project_name>',
                         "main_project",
                         login_required(self.main_project),
                         methods=['get'])
        app.add_url_rule('/main_project_in_context',
                         "main_project_in_context",
                         login_required(self.main_project_in_context),
                         methods=['get', 'post'])
        app.add_url_rule('/duplicate_project', "duplicate_project",
                         login_required(self.duplicate_project), methods=['get', 'post'])
        app.add_url_rule('/import_jupyter/<library_id>', "import_jupyter",
                         login_required(self.import_jupyter), methods=['get', "post"])
        app.add_url_rule('/download_jupyter/<project_name>/<new_name>', "download_jupyter",
                         login_required(self.download_jupyter), methods=['get', "post"])

    def download_jupyter(self, project_name, new_name):
        user_obj = current_user
        save_dict = self.db[user_obj.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]

        print("in download_jupyter with mdata " + str(mdata))
        if not mdata["type"] == "jupyter":
            return NotImplementedError

        project_dict = read_project_dict(self.fs, mdata, save_dict["file_id"])
        mem = io.BytesIO()
        mem.write(project_dict["jupyter_text"].encode())
        mem.seek(0)
        print("mem is ready supposedly")
        return send_file(mem,
                         download_name=new_name,
                         as_attachment=True)

    def import_jupyter(self, library_id):
        file_list = []
        for the_file in request.files.values():
            file_list.append(the_file)
        if len(file_list) == 0:
            result = {"success": "false", "title": "Error creating notebooks", "content": "No files received"}
            self.send_import_report(result, library_id)
            return {"success": True}
        result = self.import_as_jupyter_full(file_list)
        if result["success"] in ["false", "partial"]:
            self.send_import_report(result, library_id)
        return {"success": True}

    def import_as_jupyter_full(self, file_list):
        user_obj = current_user
        file_decoding_errors = OrderedDict()
        failed_reads = OrderedDict()
        successful_reads = []
        for the_file in file_list:
            filename, file_extension = os.path.splitext(the_file.filename)
            jupyter_name = make_name_unique(filename, user_obj.project_names)
            print("got file " + filename)
            filename = filename.encode("ascii", "ignore").decode()
            (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
            if not success:  # then result_dict contains an error object
                e = result_txt
                failed_reads[the_file.filename] = e.message
                continue
            if len(decoding_problems) > 0:
                file_decoding_errors[the_file.filename] = decoding_problems

            mdata = loaded_tile_management.create_initial_metadata()
            mdata["type"] = "jupyter"
            mdata["save_style"] = "b64save_react"

            save_dict = {"metadata": mdata,
                         "project_name": jupyter_name}

            project_dict = {"jupyter_text": result_txt}

            pdict = make_jsonizable_and_compress(project_dict)
            save_dict["file_id"] = self.fs.put(pdict)
            self.db[current_user.project_collection_name].insert_one(save_dict)
            if len(decoding_problems) > 0:
                file_decoding_errors[filename] = decoding_problems
            successful_reads.append(filename)
        if len(successful_reads) == 0:
            return {"success": "false",
                    "title": "No notebooks successfully read",
                    "file_decoding_errors": file_decoding_errors,
                    "successful_reads": successful_reads,
                    "failed_reads": failed_reads}

        if len(failed_reads.keys()) > 0 or len(file_decoding_errors.keys()) > 0:
            final_success = "partial"
            title = "Some errors reading notebooks"
        else:
            title = ""
            final_success = "true"

        return {"success": final_success,
                "title": title,
                "file_decoding_errors": file_decoding_errors,
                "successful_reads": successful_reads,
                "failed_reads": failed_reads}

    def main_project_in_context(self):
        user_obj = current_user
        user_id = user_obj.get_id()
        project_name = request.json["resource_name"]

        # noinspection PyTypeChecker
        main_id, rb_id = main_container_info.create_main_container(project_name, user_id, user_obj.username,
                                                                   openai_api_key = user_obj.get_openai_api_key())

        save_dict = self.db[user_obj.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]
        if "type" in mdata:
            doc_type = mdata["type"]
        else:
            doc_type = "table"

        create_ready_block(rb_id, user_obj.username, [main_id, "client"], main_id)
        is_notebook = doc_type == 'notebook' or doc_type == 'jupyter'
        if is_notebook:
            viewer = "notebook-viewer"
            short_collection_name = ""
        else:
            viewer = "main-viewer"
            if "collection_name" in mdata:
                full_collection_name = mdata["collection_name"]
                short_collection_name = re.sub(r"^.*?\.data_collection\.", "", full_collection_name)
            else:
                short_collection_name = "no name"
        data_dict = {"success": True,
                     "kind": viewer,
                     "res_type": "project",
                     "project_name": project_name,
                     "resource_name": project_name,
                     "ready_block_id": rb_id,
                     "main_id": main_id,
                     "temp_data_id": "",
                     "collection_name": "",
                     "doc_names": [],
                     "short_collection_name": short_collection_name,
                     "doc_type": doc_type,
                     "is_table": (doc_type == "table"),
                     "is_notebook": is_notebook,
                     "is_freeform": (doc_type == 'freeform'),
                     "is_jupyter":  (doc_type == 'jupyter'),
                     "is_project": True,
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]}

        return jsonify(data_dict)

    def main_project(self, project_name):

        data_dict = {"project_name": project_name,
                     "is_new_notebook": "False",
                     "develop": str(_develop),
                     "has_openapi_key": current_user.has_openapi_key,
                     "collection_name": "",
                     "theme": current_user.get_theme(),
                     "version_string": tstring}

        save_dict = self.db[current_user.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]
        if "type" in mdata:
            doc_type = mdata["type"]
        else:
            doc_type = "table"

        if doc_type in ['notebook', 'jupyter']:
            data_dict["module_source"] = js_source_dict["notebook_app"]
            data_dict["css_source"] = css_source("notebook_app")
        else:
            data_dict["module_source"] = js_source_dict["main_app"]
            data_dict["css_source"] = css_source("main_app")

        return render_template("main_react.html", **data_dict)

    def duplicate_project(self):
        user_obj = current_user
        project_to_copy = request.json['res_to_copy']
        new_project_name = request.json['new_res_name']
        save_dict = self.db[user_obj.project_collection_name].find_one({"project_name": project_to_copy})
        mdata = save_dict["metadata"]
        mdata["updated"] = datetime.datetime.utcnow()
        mdata["datetime"] = mdata["updated"]
        new_save_dict = {"metadata": mdata,
                         "project_name": new_project_name}

        # uncompressing and compressing below is necessary because we need to change the project_name inside
        # the project dict. so, essentially, the project_name is stored in two places which is non-optimal
        # tactic_todo fix project_name being stored in two places in project saves
        project_dict = read_project_dict(self.fs, mdata, save_dict["file_id"])
        project_dict["project_name"] = new_project_name
        pdict = make_jsonizable_and_compress(project_dict)
        new_save_dict["file_id"] = self.fs.put(pdict)
        self.db[user_obj.project_collection_name].insert_one(new_save_dict)
        return jsonify({"success": True})

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            self.db[current_user.project_collection_name].update_one({"project_name": old_name},
                                                                {'$set': {"project_name": new_name}})
            return jsonify({"success": True, "message": "project name changed", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming project")

    def grab_metadata(self, res_name):
        user_obj = current_user
        doc = self.db[user_obj.project_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes, uid=""):
        doc = self.db[current_user.project_collection_name].find_one({"project_name": res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        mdata["mdata_uid"] = uid
        self.db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})

    def delete_tag(self, tag):
        doclist = self.db[current_user.project_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["project_name"]
                self.db[current_user.project_collection_name].update_one({"project_name": res_name},
                                                                    {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = self.db[current_user.project_collection_name].find()
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
                    res_name = doc["project_name"]
                    self.db[current_user.project_collection_name].update_one({"project_name": res_name},
                                                                        {'$set': {"metadata": mdata}})
        return


class RepositoryProjectManager(ProjectManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass

    def grab_metadata(self, res_name):
        user_obj = repository_user
        doc = self.repository_db[user_obj.project_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata
