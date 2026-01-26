
import os
from qworker import task_worthy
from users import load_user

class PoolTasksMixin:

    @task_worthy
    def GetPoolTree(self, data):
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        show_hidden = data["show_hidden"]
        if "base_path" in data:
            base_path = data["base_path"]
        else:
            base_path = None
        if "target_path" in data:
            target_path = data["target_path"]
            return self.pool_backend.get_subtree(user_obj, target_path, show_hidden, base_path)
        else:
            return self.pool_backend.get_tree(user_obj, show_hidden, base_path)

    @task_worthy
    def compress_pool_resource(self, data):
        full_path = data["full_path"]
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        true_path = self.user_to_true(full_path, user_obj)
        if os.path.isfile(true_path):
            self.compress_file_in_place(true_path, user_id)
        else:
            self.compress_directory_in_place(true_path, user_id)
        return {"success": True}

    @task_worthy
    def decompress_archive(self, data):
        full_path = data["full_path"]
        user_id = data["user_id"]
        user_obj = load_user(user_id)
        true_path = self.user_to_true(full_path, user_obj)
        self.decompress_archive_in_places(true_path, user_id)
        return {"success": True}

    @task_worthy
    def pool_event(self, data):
        event_type = data["event_type"]
        path = data["path"]
        dest_path = data["dest_path"]
        is_directory = data["is_directory"]
        self.pool_backend.process_pool_event(
            event_type, path, dest_path, is_directory)
        return {"success": True}

    @task_worthy
    def rename_pool_resource_task(self, data):
        the_user = self.get_user_from_data(data)
        new_name = data["new_name"]
        old_path = data["old_path"]
        self.pool_backend.rename_resource(
            old_path, new_name, self, the_user
        )
        return {"success": True}

    @task_worthy
    def delete_pool_resource_task(self, data):
        the_user = self.get_user_from_data(data)
        full_path = data["full_path"]
        self.pool_backend.delete_resource(full_path, self, the_user)
        return {"success": True}

    @task_worthy
    def save_text_file_task(self, data):
        the_user = self.get_user_from_data(data)
        file_path = data["file_path"]
        true_path = self.user_to_true(file_path, the_user)
        the_content = data["the_content"]
        with open(true_path, "w") as f:
            f.write(the_content)
        return {"success": True}

    @task_worthy
    def create_pool_directory_task(self, data):
        the_user = self.get_user_from_data(data)
        full_path = data["full_path"]
        self.pool_backend.create_directory(full_path, self, the_user)
        return {"success": True}

    @task_worthy
    def move_pool_resource_task(self, data):
        the_user = self.get_user_from_data(data)
        dst = data["dst"]
        src = data["src"]
        self.pool_backend.move_resource(src, dst, self, the_user)
        return {"success": True}

    @task_worthy
    def duplicate_pool_file_task(self, data):
        the_user = self.get_user_from_data(data)
        dst = data["dst"]
        src = data["src"]
        self.pool_backend.duplicate_file(src, dst, self, the_user)
        return {"success": True}

    @task_worthy
    def get_text_from_pool_task(self, data):
        the_user = self.get_user_from_data(data)
        file_path = data["file_path"]
        data = self.pool_backend.read_text(file_path, self, the_user)
        return data

    @task_worthy
    def get_s3_upload_info_task(self, data):
        the_user = self.get_user_from_data(data)
        dest_path = data["dest_path"]
        filename = data["filename"]
        content_type = data["content_type"]
        up_info = self.pool_backend.get_s3_upload_info(dest_path, filename, content_type, the_user)
        return {"success": True, "upload_info": up_info}