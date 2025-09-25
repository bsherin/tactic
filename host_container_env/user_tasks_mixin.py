import re
import os

from qworker import task_worthy
from users import User

LIBRARY_CHUNK_SIZE = int(int(os.environ.get("LIBRARY_CHUNK_SIZE")) / 2)

class UserTasksMixin:

    def get_username_true_id(self, userid):
        result = self.db.user_collection.find_one({"_id": ObjectId(userid)})
        if result is not None and "username" in result:
            return result["username"]
        else:
            return None

    @task_worthy
    def delete_user_task(self, data):
        admin_user = self.get_user_from_data(data)
        true_id = data["true_id"]
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        if true_id == admin_user.get_true_id():
            return {"success": False, "message": "Don't delete the admin user!", "alert_type": "alert-warning"}
        username = self.get_username_true_id(true_id)
        target_user = User.get_user_by_username(username)
        result = admin_user.delete_user(target_user)
        admin_user.refresh_selector_list(admin_user.get_id())
        return result

    @task_worthy
    def bump_one_alt_id_task(self, data):
        true_id = data["true_id"]
        admin_user = self.get_user_from_data(data)
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        result = self.bump_user_alt_id(true_id, admin_user)
        return result


    def bump_user_alt_id(self, userid, admin_user):
        username = self.get_username_true_id(userid)
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
            admin_user.create_new_alt_id(username)
            return {"success": True, "message": "bumped the id"}
        else:
            return {"success": False, "message": "didn't bump the id"}

    @task_worthy
    def bump_all_alt_ids(self, data):
        admin_user = self.get_user_from_data(data)
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        docs = db["user_collection"].find({})
        failed_bumps = []
        for doc in docs:
            if doc["username"] == "admin":
                continue
            res = self.bump_user_alt_id(doc["_id"], admin_user)
            if not res["success"]:
                failed_bumps.append(res["username"])
        if len(failed_bumps) == 0:
            message = "all succeeded"
        else:
            message = "{} failed:".format(len(failed_bumps))
            for fail in failed_bumps:
                message += " " + fail
        return {"success": True, "message": message}


    @task_worthy
    def toggle_user_status_task(self, data):
        admin_user = self.get_user_from_data(data)
        true_id = data["true_id"]
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        if true_id == admin_user.get_true_id():
            return {"success": False, "message": "Don't toggle the admin user status!",
                    "alert_type": "alert-warning"}

        username = self.get_username_true_id(true_id)
        if username is None:
            return {"success": True, "message": "failed"}
        result = self.get_user_doc(username)
        if "status" not in result or result["status"] == "active":
            new_status = "inactive"
        else:
            new_status = "active"
        update_dict = {"status": new_status}
        self.update_user_doc(username, update_dict)
        return {"success": True, "message": "made user {} {}".format(username, new_status)}

    @task_worthy
    def update_user_starter_tiles_task(self, data):
        admin_user = self.get_user_from_data(data)
        true_id = data["true_id"]
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        selected_user = User.get_user_by_username(self.get_username_true_id(true_id))
        all_user_tile_names = selected_user.tile_names
        repository_starter_tile_names = self.repository_user.get_filtered_resource_names("tile", tag_filter="starter")
        missing_tiles = list(set(repository_starter_tile_names) - set(all_user_tile_names))
        for tname in missing_tiles:
            selected_user.copy_between_accounts(self.repository_user, selected_user, "tile", tname, tname)
        return {"success": True, "message": "added {} tiles".format(len(missing_tiles))}

    def build_user_res_dict(self, user):
        larray = ["_id", "username", "full_name", "last_login", "email", "alt_id", "status"]
        urow = {}
        for field in larray:
            if field in user:
                urow[field] = str(user[field])
            else:
                urow[field] = ""
        return urow

    @task_worthy
    def grab_user_list_chunk_task(self, data):
        admin_user = self.get_user_from_data(data)
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}

        def sort_regular_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        search_spec = data["search_spec"]
        row_number = data["row_number"]
        search_text = search_spec['search_string']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        or_list = [{"full_name": reg}, {"username": reg}]

        # db.user_collection.find()
        res = admin_user.db["user_collection"].find({"$or": or_list})
        filtered_res = []
        for doc in res:
            filtered_res.append(self.build_user_res_dict(doc))

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

    @task_worthy
    def create_seed_database_task(self, data):
        admin_user = self.get_user_from_data(data)
        if not (admin_user.username == "admin"):
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        from mongo_db_fs import get_dump_dbs
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
                starters = repository_user.get_filtered_resource_names(res_type, tag_filter="starter")
                for rname in starters:
                    repository_user.copy_between_accounts(repository_user, seed_user, res_type, rname, rname)
            admin_result = User.create_new({"username": "admin", "password": "abcd"}, seed_db)
            if not admin_result["success"]:
                print("failed to create admin user in seed db")
                return jsonify({"success": False, "message": "Failed to create admin user."})

            return {"success": True, "message": "Created seed database."}
        else:
            print("failed to create seed user in seed db")
            return {"success": False, "message": "Failed to create seed user."}

    @task_worthy
    def create_user_database(self, data):
        target_user_id = data["userid"]
        admin_user = self.get_user_from_data(data)
        print("in create_user_database")
        from mongo_db_fs import get_dump_dbs
        username = self.get_username_true_id(target_user_id)
        if username is None:
            return {"success": False, "message": "user not found."}
        if admin_user.username == "admin":
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
                        self.copy_between_accounts(source_user, dump_user, res_type,
                                                   rname, rname)
                        if n % 50 == 0:
                            print(f"copied {n} resources of type {res_type} for user {username}")
                print("copied resources to dump db")
                dump_db.drop_collection("user_collection")
                return {"success": True, "message": "created user database successfully."}
            else:
                print("failed to create seed user in seed db")
                return {"success": False, "message": "Failed to create seed user."}
        else:
            return {"success": False, "message": "Not authorized."}


    # def upgrade_all_users(self):
    #     def get_traceback_message(e, special_string=None):
    #         if special_string is None:
    #             template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
    #         else:
    #             template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    #         error_string = template.format(type(e).__name__, e.args)
    #         error_string += traceback.format_exc() + "</pre>"
    #         return error_string
    #     if not (current_user.username == "admin"):
    #         return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
    #     res = db["user_collection"].find({})
    #     for doc in res:
    #         username = get_username_true_id(doc["_id"])
    #         user_obj = User.get_user_by_username(username)
    #         print(f"*** upgrading user {username} ***")
    #         try:
    #             collection_manager.upgrade_user_collections(user_obj)
    #         except Exception as ex:
    #             print(get_traceback_message(ex), "Uncaught error upgrading user " + username)
    #     print("done upgrading")
    #     return jsonify({"success": True})

    # def remove_all_duplicate_collections(self):
    #     def get_traceback_message(e, special_string=None):
    #         if special_string is None:
    #             template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
    #         else:
    #             template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    #         error_string = template.format(type(e).__name__, e.args)
    #         error_string += traceback.format_exc() + "</pre>"
    #         return error_string
    #     print("entering remove_all_duplicate_collections")
    #     if not (current_user.username == "admin"):
    #         return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
    #
    #     res = db["user_collection"].find({})
    #     for doc in res:
    #         username = get_username_true_id(doc["_id"])
    #         user_obj = User.get_user_by_username(username)
    #         print(f"*** removing duplicates for user {username} ***")
    #         try:
    #             collection_manager.remove_duplicate_collections(user_obj)
    #         except Exception as ex:
    #             print(get_traceback_message(ex), "Uncaught error removing dupes for user " + username)
    #     print("done removing ducpliates")
    #     return jsonify({"success": True})