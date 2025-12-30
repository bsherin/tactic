
from exception_mixin import generic_exception_handler
from tactic_logging import log

class UserAccess(object):

    def get_true_user_id(self, username):
        user_doc = self.db.user_collection.find_one({"username": username}, {"_id": 1})
        if user_doc:
            return str(user_doc["_id"])
        return None

    def get_user_id(self, username, id_field):
        return str(self.get_user_doc(username)[id_field])

    def username_exists(self, username, alt_db=None):
        db = alt_db if alt_db else self.db
        return db[self.list_collection_name()].find_one(
            {"username": username}, {"_id": 1}
        ) is not None

    def create_user(self, username, password_hash, email, alt_db=None):
        db = alt_db if alt_db else self.db
        if self.username_exists(username, alt_db=alt_db):
            return {"success": False, "message": "Username already exists."}
        user_doc = {"username": username,
                     "password_hash": password_hash,
                     "email": email}

        try:
            db.user_collection.insert_one(user_doc)
            return {"success": True, "message": "User created successfully."}
        except Exception as ex:
            log.exception("Error creating user")
            return generic_exception_handler.get_traceback_exception_dict(ex)

    def get_user_doc(self, username):
        doc = self.db.user_collection.find_one(
            {"username": username}
        )
        return doc if doc else None

    def delete_user(self, target_user):
        try:
            self.db.drop_collection(target_user.list_collection_name)
            self.db.drop_collection(target_user.tile_collection_name)
            self.db.drop_collection(target_user.code_collection_name())
            target_user.delete_all_data_collections()  # have to do this because of gridfs pointers
            self.db.drop_collection(target_user.collection_collection_name())
            target_user.delete_all_projects()  # have to do this because of gridfs pointers
            self.db.drop_collection(target_user.project_collection_name())
            self.db.user_collection.delete_one({"_id": ObjectId(target_user.get_true_id())})
            return {"success": True, "message": "User successfully removed."}
        except Exception as ex:
            log.exception("Error deleting user")
            return generic_exception_handler.get_traceback_exception_dict(ex)

    def create_new_alt_id(self, username):
        update_dict = {"alt_id": str(ObjectId())}
        self.db["user_collection"].update_one({"username": username}, {'$set': update_dict})
        return update_dict

    def get_all_user_docs(self):
        try:
            return self.db["user_collection"].find({})
        except Exception as ex:
            return generic_exception_handler.get_traceback_exception_dict(ex)

    def update_user_doc(self, username, update_dict):
        self.db["user_collection"].update_one({"username": username}, {'$set': update_dict})
