
import sys
from flask import jsonify, request, url_for, render_template
from flask_login import login_required, current_user
import tactic_app
from tactic_app import app, db, fs, use_ssl
from tactic_app.docker_functions import create_container, ContainerCreateError
from tactic_app.resource_manager import ResourceManager, UserManageResourceManager
from tactic_app.users import User
from tactic_app.communication_utils import make_jsonizable_and_compress, read_project_dict
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


class ProjectManager(UserManageResourceManager):
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

    def main_project(self, project_name):
        user_obj = current_user
        user_id = user_obj.get_id()

        # noinspection PyTypeChecker
        main_id, container_id = create_container("tactic_main_image", network_mode="bridge",
                                                 owner=user_id, other_name=project_name)
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
                     "temp_data_id": "",
                     "use_codemirror": True,
                     "collection_name": "",
                     "doc_names": [],
                     "console_html": "",
                     "short_collection_name": "",
                     "project_collection_name": user_obj.project_collection_name,
                     "is_table": (doc_type == "table"),
                     "is_notebook": (doc_type == 'notebook'),
                     "is_freeform": (doc_type == 'freeform'),
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                     "uses_codemirror": "True",
                     "version_string": tstring
                     }
        if doc_type == 'notebook':
            template_name = "main_notebook.html"
        else:
            template_name = "main.html"

        return render_template(template_name, **data_dict)

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
        table_row = self.create_new_row(new_project_name, mdata)
        all_table_row = self.all_manager.create_new_all_row(new_project_name, mdata, "project")
        return jsonify({"success": True, "new_row": table_row, "new_all_row": all_table_row})

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            db[current_user.project_collection_name].update_one({"project_name": old_name},
                                                                {'$set': {"project_name": new_name}})
            # self.update_selector_list()
            return jsonify({"success": True, "message": "project name changed", "alert_type": "alert-success"})
        except:
            error_string = "Error renaming project " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def delete_project(self):
        project_name = request.json["resource_name"]
        current_user.remove_project(project_name)

        # self.update_selector_list()
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

    def rename_tag(self, old_tag, new_tag):
        doclist = db[current_user.project_collection_name].find()
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
                res_name = doc["project_name"]
                db[current_user.project_collection_name].update_one({"project_name": res_name}, {'$set': {"metadata": mdata}})
        return


class RepositoryProjectManager(ProjectManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        pass
