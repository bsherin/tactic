import copy
import uuid

from communication_utils import make_jsonizable_and_compress


class TempDataAccess(object):

    def temp_data_exists(self, unique_id):
        return self.db["temp_data"].find_one(
            {"unique_id": unique_id}, {"_id": 1}
        ) is not None

    def store_temp_data(self, data_dict, unique_id=None):
        if not unique_id:
            unique_id = str(uuid.uuid4())
        data_dict["unique_id"] = unique_id

        # Note that the dict passed to insert_one has an ObjectId added to it
        # This can end up in the task_data and cause a problem for jsonifying
        ldata = copy.deepcopy(data_dict)
        self.db["temp_data"].insert_one(ldata)
        return unique_id

    def store_temp_data_with_compress(self, sid, data_dict):
        cdict = make_jsonizable_and_compress(data_dict)
        fid = self.fs.put(cdict)
        user_id = self.get_session(sid).user_id
        save_dict = {"file_id": fid, "user_id": user_id}
        unique_id = self.store_temp_data(save_dict)
        return unique_id

    def read_temp_data(self, unique_id):
        return self.db["temp_data"].find_one({"unique_id": unique_id})

    def delete_temp_data(self, unique_id):
        if self.temp_data_exists(unique_id):
            save_dict = self.read_temp_data(unique_id)
            self.db["temp_data"].delete_one({"unique_id": unique_id})
            if self.fs is not None and "file_id" in save_dict:
                self.fs.delete(save_dict["file_id"])
        return