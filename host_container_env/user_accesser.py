

from exception_mixin import generic_exception_handler

class UserAccess(object):

    def get_user_doc(self, username):
        doc = self.db.user_collection.find_one(
            {"username": username}
        )
        return doc if doc else None

    def delete_user(self, target_user):
        try:
            self.db.drop_collection(target_user.list_collection_name)
            self.db.drop_collection(target_user.tile_collection_name)
            self.db.drop_collection(target_user.code_collection_name)
            target_user.delete_all_data_collections()  # have to do this because of gridfs pointers
            self.db.drop_collection(target_user.collection_collection_name)
            target_user.delete_all_projects()  # have to do this because of gridfs pointers
            self.db.drop_collection(target_user.project_collection_name)
            self.db.user_collection.delete_one({"_id": ObjectId(target_user.get_true_id())})
            return {"success": True, "message": "User successfully removed."}
        except Exception as ex:
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
