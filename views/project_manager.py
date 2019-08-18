
import sys
import re
import os
import cStringIO
from collections import OrderedDict
from flask import jsonify, request, url_for, render_template, send_file
from flask_login import login_required, current_user
import tactic_app
from tactic_app import app, db, fs, use_ssl
from tactic_app.docker_functions import create_container, main_container_info
from tactic_app.resource_manager import ResourceManager, LibraryResourceManager
from tactic_app.users import User
from tactic_app.communication_utils import make_jsonizable_and_compress, read_project_dict
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")
from tactic_app.file_handling import read_freeform_file

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
        app.add_url_rule('/delete_project', "delete_project", login_required(self.delete_project),
                         methods=['post'])
        app.add_url_rule('/duplicate_project', "duplicate_project",
                         login_required(self.duplicate_project), methods=['get', 'post'])
        app.add_url_rule('/search_project_metadata', "search_project_metadata",
                         login_required(self.search_project_metadata), methods=['get', 'post'])
        app.add_url_rule('/import_as_jupyter/<jupyter_name>/<library_id>', "import_as_jupyter",
                         login_required(self.import_as_jupyter), methods=['get', "post"])
        app.add_url_rule('/download_jupyter/<project_name>/<new_name>', "download_jupyter",
                         login_required(self.download_jupyter), methods=['get', "post"])

    def download_jupyter(self, project_name, new_name):
        user_obj = current_user
        save_dict = db[user_obj.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]

        if not mdata["type"] == "jupyter":
            return NotImplementedError

        project_dict = read_project_dict(fs, mdata, save_dict["file_id"])
        str_io = cStringIO.StringIO()
        str_io.write(project_dict["jupyter_text"])
        str_io.seek(0)
        return send_file(str_io,
                         attachment_filename=new_name,
                         as_attachment=True)

    def import_as_jupyter(self, jupyter_name, library_id):
        file_list = request.files.getlist("file")
        the_file = file_list[0]
        filename, file_extension = os.path.splitext(the_file.filename)
        filename = filename.encode("ascii", "ignore")
        self.show_um_message("Reading file {} and checking encoding".format(filename), library_id, timeout=10)
        file_decoding_errors = OrderedDict()
        (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
        self.show_um_message("Got encoding {} for {}".format(encoding, filename), library_id, timeout=10)
        if not success:  # then result_dict contains an error object
            e = result_txt
            return jsonify({"message": e.message, "alert_type": "alert-danger"})
        if len(decoding_problems) > 0:
            file_decoding_errors[filename] = decoding_problems
        mdata = global_tile_manager.create_initial_metadata()
        mdata["type"] = "jupyter"
        mdata["save_style"] = "b64save"

        save_dict = {"metadata": mdata,
                     "project_name": jupyter_name}

        project_dict = {"jupyter_text": result_txt}

        pdict = make_jsonizable_and_compress(project_dict)
        save_dict["file_id"] = fs.put(pdict)
        db[current_user.project_collection_name].insert_one(save_dict)

        new_row = self.build_res_dict(jupyter_name, mdata, user_obj)
        if len(file_decoding_errors.keys()) == 0:
            file_decoding_errors = None
        return jsonify({"success": True, "new_row": new_row,
                        "alert_type": "alert-success",
                        "file_decoding_errors": file_decoding_errors})

    def main_project(self, project_name):
        user_obj = current_user
        user_id = user_obj.get_id()

        # noinspection PyTypeChecker
        main_id = main_container_info.create_main_container(project_name, user_id, user_obj.username)
        global_tile_manager.add_user(user_obj.username)

        save_dict = db[user_obj.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]
        if "type" in mdata:
            doc_type = mdata["type"]
        else:
            doc_type = "table"

        data_dict = {"project_name": project_name,
                     "window_title": project_name,
                     "user_id": user_id,
                     "use_ssl": str(use_ssl),
                     "main_id": main_id,
                     "main_port": main_container_info.port(main_id),
                     "temp_data_id": "",
                     "use_codemirror": True,
                     "collection_name": "",
                     "doc_names": [],
                     "console_html": "",
                     "short_collection_name": "",
                     "project_collection_name": user_obj.project_collection_name,
                     "list_collection_name": user_obj.list_collection_name,
                     "code_collection_name": user_obj.code_collection_name,
                     "tile_collection_name": user_obj.tile_collection_name,
                     "is_table": (doc_type == "table"),
                     "is_notebook": (doc_type == 'notebook' or doc_type == 'jupyter'),
                     "is_freeform": (doc_type == 'freeform'),
                     "is_jupyter":  (doc_type == 'jupyter'),
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                     "uses_codemirror": "True",
                     "version_string": tstring
                     }
        if doc_type in ['notebook', 'jupyter']:
            template_name = "main_notebook.html"
        else:
            template_name = "main.html"

        return render_template(template_name, **data_dict)

    def search_project_metadata(self):
        user_obj = current_user
        search_text = request.json['search_text']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        res = db[user_obj.project_collection_name].find({"$or": [{"project_name": reg}, {"metadata.notes": reg},
                                                        {"metadata.tags": reg}, {"metadata.loaded_tiles": reg},
                                                        {"metadata.collection_name": reg}]})
        res_list = []
        for t in res:
            res_list.append(t["project_name"])
        return jsonify({"success": True, "match_list": res_list})

    def duplicate_project(self):
        user_obj = current_user
        project_to_copy = request.json['res_to_copy']
        new_project_name = request.json['new_res_name']
        save_dict = db[user_obj.project_collection_name].find_one({"project_name": project_to_copy})
        mdata = save_dict["metadata"]
        new_save_dict = {"metadata": mdata,
                         "project_name": new_project_name}

        # uncompressing and compressing below is necessary because we need to change the project_name inside
        # the project dict. so, essentially, the project_name is stored in two places which is non-optimal
        # tactic_todo fix project_name being stored in two places in project saves
        project_dict = read_project_dict(fs, mdata, save_dict["file_id"])
        project_dict["project_name"] = new_project_name
        pdict = make_jsonizable_and_compress(project_dict)
        new_save_dict["file_id"] = fs.put(pdict)
        db[user_obj.project_collection_name].insert_one(new_save_dict)

        new_row = self.build_res_dict(new_project_name, mdata, user_obj)
        return jsonify({"success": True, "new_row": new_row})

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            db[current_user.project_collection_name].update_one({"project_name": old_name},
                                                                {'$set': {"project_name": new_name}})
            # self.update_selector_list()
            return jsonify({"success": True, "message": "project name changed", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming project")

    def delete_project(self):
        try:
            project_names = request.json["resource_names"]
            for project_name in project_names:
                current_user.remove_project(project_name)
            return jsonify({"success": True})

        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error deleting collections")

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

    def delete_tag(self, tag):
        doclist = db[current_user.project_collection_name].find()
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
                db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = db[current_user.project_collection_name].find()
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
                    db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})
        return


class RepositoryProjectManager(ProjectManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass
