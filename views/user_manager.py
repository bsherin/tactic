import re
import os
import copy
from flask import jsonify
from flask_login import login_required, current_user
from tactic_app import app, db, fs
from tactic_app.users import get_all_users, remove_user, load_user, User
from tactic_app.communication_utils import make_python_object_jsonizable
from tactic_app.resource_manager import ResourceManager
from pymongo import MongoClient
import gridfs
from tactic_app import Database, global_tile_manager

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

class UserManager(ResourceManager):
    def add_rules(self):
        app.add_url_rule('/refresh_user_table', "refresh_user_table",
                         login_required(self.refresh_user_table), methods=['get'])
        app.add_url_rule('/delete_user/<userid>', "delete_user",
                         login_required(self.delete_user), methods=['get', "post"])
        app.add_url_rule('/update_user_starter_tiles/<userid>', "update_user_starter_tiles",
                         login_required(self.update_user_starter_tiles), methods=['get', "post"])
        app.add_url_rule('/update_all_collections', "update_all_collections",
                         login_required(self.update_all_collections), methods=['get'])

    def refresh_user_table(self):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        self.update_selector_list()
        return jsonify({"success": True})

    def update_all_collections(self):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        user_list = get_all_users()
        for user in user_list:
            user_obj = load_user(user["_id"])
            print "username " + user_obj.username
            self.update_user_collections(user_obj)
        return jsonify({"success": True})

    def update_user_collections(self, user_obj):
        couldnt_process = []
        for colname in user_obj.data_collections:
            # print "processing " + colname
            collection_to_copy = user_obj.full_collection_name(colname)

            regex = re.compile("__metadata__")
            doc = db[collection_to_copy].find_one({"name" : { "$not" : regex}})
            if doc is None:
                print colname + " only has metadata"
                couldnt_process.append(colname)
                continue

            if "file_id" in doc:
                # print "file_id exists"
                continue
            new_collection_name = user_obj.full_collection_name(colname + "XXXX")

            for doc in db[collection_to_copy].find():
                if not doc["name"] == "__metadata__":
                    if "file_id" in doc:
                        doc_text = fs.get(doc["file_id"]).read()
                    else:
                        doc_text = make_python_object_jsonizable(doc["data_rows"])
                        del doc["data_rows"]
                    doc["file_id"] = fs.put(doc_text)
                db[new_collection_name].insert_one(doc)
            db.drop_collection(collection_to_copy)
            db[new_collection_name].rename(collection_to_copy)
            # print "processed " + colname
        print "couldn't process " + str(couldnt_process)
        return

    def migrate_user_collections(self, user_obj, target_db, target_fs):
        for colname in user_obj.data_collections:
            collection_to_copy = user_obj.full_collection_name(colname)

            for doc in db[collection_to_copy].find():
                if not doc["name"] == "__metadata__":
                    if "file_id" in doc:
                        doc_text = fs.get(doc["file_id"]).read()
                    else:
                        doc_text = make_python_object_jsonizable(doc["data_rows"])
                        del doc["data_rows"]
                    doc["file_id"] = target_fs.put(doc_text)
                target_db[collection_to_copy].insert_one(doc)
        return


    def delete_user(self, userid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        result = remove_user(userid)
        self.update_selector_list()
        return jsonify(result)

    def update_user_starter_tiles(self, userid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        repository_user = User.get_user_by_username("repository")
        selected_user = load_user(userid)
        all_user_tile_names = selected_user.get_resource_names("tile")
        repository_starter_tile_names = repository_user.get_resource_names("tile", tag_filter="starter")
        missing_tiles = list(set(repository_starter_tile_names) - set(all_user_tile_names))
        for tname in missing_tiles:
            repository_tile_dict = db[repository_user.tile_collection_name].find_one({"tile_module_name": tname})
            metadata = copy.copy(repository_tile_dict["metadata"])
            new_tile_dict = {"tile_module_name": tname, "tile_module": repository_tile_dict["tile_module"],
                             "metadata": metadata}
            db[selected_user.tile_collection_name].insert_one(new_tile_dict)
        return jsonify({"success": True, "message": "added {} tiles".format(len(missing_tiles))})

    def migrate_user(self, userid):
        print "entering migrate user"
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        if "TARGET_URI" in os.environ:
            target_uri = os.environ.get("TARGET_URI")
            print "got target_uri " + str(target_uri)
        else:
            print "target_uri not in environ"
            return jsonify({"success": False})
        target_client = MongoClient(target_uri, serverSelectionTimeoutMS=30000)
        target_db = target_client["tacticdb"]
        target_fs = gridfs.GridFS(target_db)
        user_obj = load_user(userid)
        print "got target db, fs, etc"
        if user_obj.list_collection_name not in target_db.collection_names():
            target_db.create_collection(user_obj.list_collection_name)
        for doc in db[user_obj.list_collection_name].find():
            target_db[user_obj.list_collection_name].insert_one(doc)

        if user_obj.tile_collection_name not in target_db.collection_names():
            target_db.create_collection(user_obj.tile_collection_name)
        for doc in db[user_obj.tile_collection_name].find():
            target_db[user_obj.tile_collection_name].insert_one(doc)

        if user_obj.code_collection_name not in target_db.collection_names():
            target_db.create_collection(user_obj.code_collection_name)
        for doc in db[user_obj.code_collection_name].find():
            target_db[user_obj.code_collection_name].insert_one(doc)

        self.migrate_user_collections(user_obj, target_db, target_fs)

        if user_obj.project_collection_name not in target_db.collection_names():
            target_db.create_collection(user_obj.project_collection_name)
        for doc in db[user_obj.project_collection_name].find():
            if "file_id" not in doc:
                continue
            project_stuff = fs.get(doc["file_id"]).read()
            doc["file_id"] = target_fs.put(project_stuff)
            target_db[user_obj.project_collection_name].insert_one(doc)

        return jsonify({"success": True})

    def build_resource_array(self, user_obj=None):
        user_list = get_all_users()
        larray = [["_id", "username", "full_name", "last_login", "email"]]
        for user in user_list:
            urow = []
            for field in larray[0]:
                if field in user:
                    urow.append(str(user[field]))
                else:
                    urow.append("")
            larray.append(urow)
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

