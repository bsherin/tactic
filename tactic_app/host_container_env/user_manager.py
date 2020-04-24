import re
import os
import copy
from flask import jsonify, request
from flask_login import login_required, current_user
from tactic_app import app, db, fs
from users import get_all_users, remove_user, load_user, User
from communication_utils import make_python_object_jsonizable
from resource_manager import ResourceManager
from pymongo import MongoClient
from mongo_accesser import bytes_to_string
import gridfs
from tactic_app import Database

admin_user = User.get_user_by_username("admin")

CHUNK_SIZE = int(int(os.environ.get("CHUNK_SIZE")) / 2)

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"


class UserManager(ResourceManager):
    def add_rules(self):
        app.add_url_rule('/delete_user/<userid>', "delete_user",
                         login_required(self.delete_user), methods=['get', "post"])
        app.add_url_rule('/update_user_starter_tiles/<userid>', "update_user_starter_tiles",
                         login_required(self.update_user_starter_tiles), methods=['get', "post"])
        app.add_url_rule('/update_all_collections', "update_all_collections",
                         login_required(self.update_all_collections), methods=['get'])
        app.add_url_rule('/grab_user_list_chunk', "grab_user_list_chunk",
                         login_required(self.grab_user_list_chunk), methods=['get', 'post'])

    def update_all_collections(self):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        user_list = get_all_users()
        for user in user_list:
            user_obj = load_user(user["_id"])
            print("username " + user_obj.username)
            self.update_user_collections(user_obj)
        return jsonify({"success": True})

    def update_user_collections(self, user_obj):
        couldnt_process = []
        for colname in user_obj.data_collections:
            # print "processing " + colname
            collection_to_copy = user_obj.full_collection_name(colname)

            regex = re.compile("__metadata__")
            doc = db[collection_to_copy].find_one({"name": {"$not": regex}})
            if doc is None:
                print(colname + " only has metadata")
                couldnt_process.append(colname)
                continue

            if "file_id" in doc:
                # print "file_id exists"
                continue
            new_collection_name = user_obj.full_collection_name(colname + "XXXX")

            for doc in db[collection_to_copy].find():

                if not bytes_to_string(doc["name"]) == "__metadata__":
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
        print("couldn't process " + str(couldnt_process))
        return

    def migrate_user_collections(self, user_obj, target_db, target_fs):
        for colname in user_obj.data_collections:
            collection_to_copy = user_obj.full_collection_name(colname)

            for doc in db[collection_to_copy].find():
                if not bytes_to_string(doc["name"]) == "__metadata__":
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
        if userid == current_user.get_id():
            return jsonify({"success": False, "message": "Don't delete the admin user!", "alert_type": "alert-warning"})
        result = remove_user(userid)
        self.refresh_selector_list()
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
        print("entering migrate user")
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        if "TARGET_URI" in os.environ:
            target_uri = os.environ.get("TARGET_URI")
            print("got target_uri " + str(target_uri))
        else:
            print("target_uri not in environ")
            return jsonify({"success": False})
        target_client = MongoClient(target_uri, serverSelectionTimeoutMS=30000)
        target_db = target_client["tacticdb"]
        target_fs = gridfs.GridFS(target_db)
        user_obj = load_user(userid)
        print("got target db, fs, etc")
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

    def build_res_dict(self, user):
        larray = ["_id", "username", "full_name", "last_login", "email"]
        urow = {}
        for field in larray:
            if field in user:
                urow[field] = str(user[field])
            else:
                urow[field] = ""
        return urow

    def grab_user_list_chunk(self):
        if not current_user.get_id() == admin_user.get_id():
            return

        def sort_regular_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        search_spec = request.json["search_spec"]
        row_number = request.json["row_number"]
        search_text = search_spec['search_string']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        or_list = [{"full_name": reg}, {"username": reg}]

        db.user_collection.find()
        res = db["user_collection"].find({"$or": or_list})
        filtered_res = []
        for doc in res:
            filtered_res.append(self.build_res_dict(doc))

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        sort_field = search_spec["sort_field"]
        sort_key_func = sort_regular_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / CHUNK_SIZE) * CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: chunk_start + CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r
        return jsonify(
            {"success": True, "chunk_dict": chunk_dict, "num_rows": len(sorted_results)})


