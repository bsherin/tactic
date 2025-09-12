import re
import os
import copy
from flask import jsonify, request
from flask_login import login_required, current_user
from tactic_app import app, db, fs
import loaded_tile_management
from users import get_all_users, remove_user, load_user, User, create_new_alt_id, get_username_true_id, ID_FIELD
from communication_utils import make_python_object_jsonizable
from library_views import collection_manager
from resource_manager import ResourceManager
from pymongo import MongoClient
from bson.objectid import ObjectId
from mongo_accesser import bytes_to_string, res_types
import gridfs
from tactic_app import Database
import tactic_app


admin_user = User.get_user_by_username("admin")

LIBRARY_CHUNK_SIZE = int(int(os.environ.get("LIBRARY_CHUNK_SIZE")) / 2)

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

seed_db_name = "tactic_seed"

# noinspection PyMethodOverriding
class UserManager(ResourceManager):
    def add_rules(self):
        app.add_url_rule('/delete_user/<trueid>', "delete_user",
                         login_required(self.delete_user), methods=['get', "post"])
        app.add_url_rule('/bump_one_alt_id/<userid>', "bump_one_alt_id",
                         login_required(self.bump_one_alt_id), methods=['get', "post"])
        app.add_url_rule('/toggle_status/<trueid>', "toggle_status",
                         login_required(self.toggle_status), methods=['get', "post"])
        app.add_url_rule('/bump_all_alt_ids', "bump_all_alt_ids",
                         login_required(self.bump_all_alt_ids), methods=['get', "post"])
        app.add_url_rule('/update_user_starter_tiles/<userid>', "update_user_starter_tiles",
                         login_required(self.update_user_starter_tiles), methods=['get', "post"])
        app.add_url_rule('/grab_user_list_chunk', "grab_user_list_chunk",
                         login_required(self.grab_user_list_chunk), methods=['get', 'post'])
        app.add_url_rule('/upgrade_all_users', "upgrade_all_users",
                         login_required(self.upgrade_all_users), methods=['get', "post"])
        app.add_url_rule('/remove_all_duplicate_collections', "remove_all_duplicate_collections",
                         login_required(self.remove_all_duplicate_collections), methods=['get', "post"])
        app.add_url_rule('/create_seed_database', "create_seed_database",
                         login_required(self.create_seed_database), methods=['get', 'post'])
        app.add_url_rule('/create_user_database/<userid>', "create_user_database",
                         login_required(self.create_user_database), methods=['get', "post"])

    def create_seed_database(self):

        from mongo_db_fs import get_dump_dbs
        from tactic_app import db, fs
        from library_views import copy_between_accounts
        if current_user.get_id() == admin_user.get_id():
            print("got the admin user")
            seed_db, seed_fs = get_dump_dbs(seed_db_name)
            result_dict = User.create_new({"username": "repository", "password": "abcd"}, seed_db)
            if result_dict["success"]:
                print("created seed user in seed db")
                # seed_user_result = seed_db.user_collection.find_one({"username": "seed"})
                print("got result_dict", str(result_dict))
                seed_user = User(result_dict)
                seed_user.db = seed_db
                seed_user.fs = seed_fs
                repository_user = User.get_user_by_username("repository")
                for res_type in res_types:
                    starters = repository_user.get_resource_names(res_type, tag_filter="starter")
                    for rname in starters:
                        copy_between_accounts(repository_user, seed_user, res_type,
                                              rname, rname,
                                              source_db=db, dest_db=seed_db, source_fs=fs, dest_fs=seed_fs)
                admin_result = User.create_new({"username": "admin", "password": "abcd"}, seed_db)
                if not admin_result["success"]:
                    print("failed to create admin user in seed db")
                    return jsonify({"success": False, "message": "Failed to create admin user."})

                return jsonify({"success": True, "message": "Created seed database."})
            else:
                print("failed to create seed user in seed db")
                return jsonify({"success": False, "message": "Failed to create seed user."})
        else:
            return jsonify({"success": False, "message": "Not authorized."})

    def create_user_database(self, userid):
        print("in create_user_database")
        from mongo_db_fs import get_dump_dbs
        from tactic_app import db, fs
        from library_views import copy_between_accounts
        username = get_username_true_id(userid)
        if username is None:
            return jsonify({"success": False, "message": "user not found."})
        if current_user.get_id() == admin_user.get_id():
            print("got the admin user")
            dump_db, dump_fs = get_dump_dbs(f"{username}_db")
            print("got dump db and fs")
            result_dict = User.create_new({"username": username, "password": "abcd"}, dump_db)
            print("creating user in dump db", str(result_dict))
            if result_dict["success"]:
                print("created user in dump db")
                dump_user = User(result_dict)
                dump_user.db = dump_db
                dump_user.fs = dump_fs
                source_user = User.get_user_by_username(username)
                print("got source user")
                for res_type in res_types:
                    print("in create_user_database, res_type", res_type)
                    resources = source_user.get_all_resource_names(res_type)
                    print(f"found {len(resources)} resources of type {res_type} for user {username}")
                    for n, rname in enumerate(resources):
                        copy_between_accounts(source_user, dump_user, res_type,
                                              rname, rname,
                                              source_db=db, dest_db=dump_db, source_fs=fs, dest_fs=dump_fs)
                        if n % 50 == 0:
                            print(f"copied {n} resources of type {res_type} for user {username}")
                print("copied resources to dump db")
                dump_db.drop_collection("user_collection")
                return jsonify({"success": True, "message": "created user database successfully."})
            else:
                print("failed to create seed user in seed db")
                return jsonify({"success": False, "message": "Failed to create seed user."})
        else:
            return jsonify({"success": False, "message": "Not authorized."})

    def bump_user_alt_id(self, userid):
        username = get_username_true_id(userid)
        if username is not None:
            user_instance = User.get_user_by_username(username)
            loaded_tile_management.remove_user(username)
            tactic_app.host_worker.post_task("host", "destroy_a_users_containers",
                                             {"user_id": user_instance.get_id(), "notify": True})
            tactic_app.host_worker.post_task("host", "flash_to_user", {
                "user_id": user_instance.get_id(),
                "alert_type": "alert-warning",
                "timeout": -1,
                "message": "You have been logged out"
            })
            create_new_alt_id(username)
            return {"success": True, "message": "bumped the id"}
        else:
            return {"success": False, "message": "didn't bump the id"}

    def dump_user_db(self, user_id):
        username = get_username_true_id(userid)
        result = self.create_user_database(username)
        return result

    def bump_one_alt_id(self, userid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        result = self.bump_user_alt_id(userid)
        return jsonify(result)


    def remove_all_duplicate_collections(self):
        def get_traceback_message(e, special_string=None):
            if special_string is None:
                template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
            else:
                template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
            error_string = template.format(type(e).__name__, e.args)
            error_string += traceback.format_exc() + "</pre>"
            return error_string
        print("entering remove_all_duplicate_collections")
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})

        res = db["user_collection"].find({})
        for doc in res:
            username = get_username_true_id(doc["_id"])
            user_obj = User.get_user_by_username(username)
            print(f"*** removing duplicates for user {username} ***")
            try:
                collection_manager.remove_duplicate_collections(user_obj)
            except Exception as ex:
                print(get_traceback_message(ex), "Uncaught error removing dupes for user " + username)
        print("done removing ducpliates")
        return jsonify({"success": True})

    def upgrade_all_users(self):
        def get_traceback_message(e, special_string=None):
            if special_string is None:
                template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
            else:
                template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
            error_string = template.format(type(e).__name__, e.args)
            error_string += traceback.format_exc() + "</pre>"
            return error_string
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        res = db["user_collection"].find({})
        for doc in res:
            username = get_username_true_id(doc["_id"])
            user_obj = User.get_user_by_username(username)
            print(f"*** upgrading user {username} ***")
            try:
                collection_manager.upgrade_user_collections(user_obj)
            except Exception as ex:
                print(get_traceback_message(ex), "Uncaught error upgrading user " + username)
        print("done upgrading")
        return jsonify({"success": True})

    def bump_all_alt_ids(self):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        res = db["user_collection"].find({})
        failed_bumps = []
        for doc in res:
            if doc["username"] == "admin":
                continue
            res = self.bump_user_alt_id(doc["_id"])
            if not res["success"]:
                failed_bumps.append(res["username"])
        if len(failed_bumps) == 0:
            message = "all succeeded"
        else:
            message = "{} failed:".format(len(failed_bumps))
            for fail in failed_bumps:
                message += " " + fail
        return jsonify({"success": True, "message": message})

    def delete_user(self, trueid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        if trueid == current_user.get_true_id():
            return jsonify({"success": False, "message": "Don't delete the admin user!", "alert_type": "alert-warning"})
        result = remove_user(trueid)
        self.refresh_selector_list()
        return jsonify(result)

    def toggle_status(self, trueid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        if trueid == current_user.get_true_id():
            return jsonify({"success": False, "message": "Don't toggle the admin user status!",
                            "alert_type": "alert-warning"})

        username = get_username_true_id(trueid)
        if username is None:
            return jsonify({"success": True, "message": "failed"})
        result = db.user_collection.find_one({"username": username})
        if "status" not in result or result["status"] == "active":
            new_status = "inactive"
        else:
            new_status = "active"
        update_dict = {"status": new_status}
        db["user_collection"].update_one({"username": username},
                                         {'$set': update_dict})
        return jsonify({"success": True, "message": "made user {} {}".format(username, new_status)})

    def update_user_starter_tiles(self, trueid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        repository_user = User.get_user_by_username("repository")
        selected_user = User.get_user_by_username(get_username_true_id(trueid))
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

    def build_res_dict(self, user):
        larray = ["_id", "username", "full_name", "last_login", "email", "alt_id", "status"]
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

        # db.user_collection.find()
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

        chunk_start = int(row_number / LIBRARY_CHUNK_SIZE) * LIBRARY_CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: LIBRARY_CHUNK_SIZE + LIBRARY_CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r
        return jsonify(
            {"success": True, "chunk_dict": chunk_dict, "num_rows": len(sorted_results)})
