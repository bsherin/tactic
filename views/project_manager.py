
import sys
from flask import jsonify, request, url_for, render_template
from flask_login import login_required, current_user
import tactic_app
from tactic_app import app, db, use_ssl, mongo_uri
from tactic_app.docker_functions import create_container, ContainerCreateError
from resource_manager import ResourceManager
from tactic_app.users import User
global_tile_manager = tactic_app.global_tile_manager
repository_user = User.get_user_by_username("repository")


class ProjectManager(ResourceManager):
    collection_list = "project_names"
    collection_list_with_metadata = "project_names_with_metadata"
    collection_name = "project_collection_name"
    name_field = "project_name"

    def add_rules(self):
        app.add_url_rule('/main_project/<project_name>', "main_project", login_required(self.main_project), methods=['get'])
        app.add_url_rule('/delete_project', "delete_project", login_required(self.delete_project),
                         methods=['post'])

    def main_project(self, project_name):
        user_obj = current_user
        user_id  =  user_obj.get_id()

        # noinspection PyTypeChecker
        main_id, container_id = create_container("tactic_main_image", network_mode="bridge", owner=user_id)
        global_tile_manager.add_user(user_obj.username)

        save_dict = db[user_obj.project_collection_name].find_one({"project_name": project_name})
        mdata = save_dict["metadata"]
        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"

        data_dict = {"project_name": project_name,
                     "window_title": project_name,
                     "user_id": user_id,
                     "use_ssl": str(use_ssl),
                     "main_id": main_id,
                     "use_codemirror": True,
                     "collection_name": "",
                     "doc_names": [],
                     "new_tile_info": "",
                     "console_html": "",
                     "short_collection_name": "",
                     "project_collection_name": user_obj.project_collection_name,
                     "mongo_uri": mongo_uri,
                     "is_table": (doc_type == "table"),
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                     "uses_codemirror": "True"
                     }

        return render_template("main.html", **data_dict)

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            db[current_user.project_collection_name].update_one({"project_name": old_name},
                                                                {'$set': {"project_name": new_name}})
            self.update_selector_list()
            return jsonify({"success": True, "message": "project name changed", "alert_type": "alert-success"})
        except:
            error_string = "Error renaming project " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

    def delete_project(self):
        project_name = request.json["resource_name"]
        current_user.remove_project(project_name)

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
