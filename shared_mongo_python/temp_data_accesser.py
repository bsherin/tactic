import copy
import uuid

from communication_utils import make_python_object_jsonizable

class TempDataAccess(object):
    def store_temp_data(self, data_dict, unique_id=None):
        if not unique_id:
            unique_id = str(uuid.uuid4())
        data_dict["unique_id"] = unique_id

        # Note that the dict passed to insert_one has an ObjectId added to it
        # This can end up in the task_data and cause a problem for jsonifying
        ldata = copy.deepcopy(data_dict)
        self.db["temp_data"].insert_one(ldata)
        return unique_id

    def store_temp_data_with_compress(self, data_dict):
        cdict = make_python_object_jsonizable(data_dict)
        save_dict = {"file_id": self.fs.put(cdict), "user_id": self.user_id}
        unique_id = self.store_temp_data(save_dict)
        return unique_id

    def read_temp_data(self, unique_id):
        return self.db["temp_data"].find_one({"unique_id": unique_id})

    def delete_temp_data(self, unique_id):
        save_dict = self.read_temp_data(unique_id)
        self.db["temp_data"].delete_one({"unique_id": unique_id})
        if self.fs is not None and "file_id" in save_dict:
            self.fs.delete(save_dict["file_id"])
        return