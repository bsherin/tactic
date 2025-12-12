
import os
import shutil
import re
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
        return self.pool_backend.get_tree(user_obj, show_hidden, base_path)

    @task_worthy
    def compress_pool_resource(self, data):
        try:
            full_path = data["full_path"]
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            true_path = self.user_to_true(full_path, user_obj)
            if os.path.isfile(true_path):
                self.compress_file_in_place(true_path, user_id)
            else:
                self.compress_directory_in_place(true_path, user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error compressing resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def decompress_archive(self, data):
        try:
            full_path = data["full_path"]
            user_id = data["user_id"]
            user_obj = load_user(user_id)
            true_path = self.user_to_true(full_path, user_obj)
            self.decompress_archive_in_places(true_path, user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error decompressing archive")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}


    @task_worthy
    def pool_event(self, data):
        try:
            event_type = data["event_type"]
            path = data["path"]
            dest_path = data["dest_path"]
            is_directory = data["is_directory"]
            self.pool_backend.process_pool_event(
                event_type, path, dest_path, is_directory)
        except Exception as ex:
            print(self.handle_exception(ex, "Got error in pool_event"))
        return {"success": True}

    @task_worthy
    def rename_pool_resource_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            new_name = data["new_name"]
            old_path = data["old_path"]
            self.pool_backend.rename_resource(
                old_path, new_name, self, the_user
            )
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in rename_pool_resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def delete_pool_resource_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            full_path = data["full_path"]
            # is_directory = data["is_directory"]
            self.pool_backend.delete_resource(full_path, self, the_user)

        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def save_text_file_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            file_path = data["file_path"]
            true_path = self.user_to_true(file_path, the_user)
            the_content = data["the_content"]
            with open(true_path, "w") as f:
                f.write(the_content)
            return {"success": True}
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in save_text_file")
            print(emsg)
            return {"success": False, "message": emsg}

    @task_worthy
    def create_pool_directory_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            full_path = data["full_path"]
            self.pool_backend.create_directory(full_path, self, the_user)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def move_pool_resource_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            dst = data["dst"]
            src = data["src"]
            self.pool_backend.move_resource(src, dst, self, the_user)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error moving resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def duplicate_pool_file_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            dst = data["dst"]
            src = data["src"]
            self.pool_backend.duplicate_file(src, dst, self, the_user)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error duplicating file")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def get_text_from_pool_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            file_path = data["file_path"]
            data = self.pool_backend.read_text(file_path, self, the_user)
            return data
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "Error in view_text_in_context")
            return {"success": False, "message": emsg}

    @task_worthy
    def get_s3_upload_info_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            dest_path = data["dest_path"]
            filename = data["filename"]
            content_type = data["content_type"]
            up_info = self.pool_backend.get_s3_upload_info(dest_path, filename, content_type, the_user)
            return {"success": True, "upload_info": up_info}
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "Error in get_s3_upload_info_task")
            print(emsg)
            return {"success": False, "message": emsg}