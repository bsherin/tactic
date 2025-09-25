
import os
import shutil
from qworker import task_worthy

class PoolTasksMixin:

    @task_worthy
    def rename_pool_resource_task(self, data):
        try:
            new_name = data["new_name"]
            old_path = data["old_path"]
            true_old_path = self.user_to_true(old_path)
            folder_path, fname = os.path.split(true_old_path)
            true_new_path = f"{folder_path}/{new_name}"
            if os.path.exists(true_new_path):
                raise FileExistsError
            os.rename(true_old_path, true_new_path)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in rename_pool_resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def delete_pool_resource_task(self, data):
        try:
            full_path = data["full_path"]
            is_directory = data["is_directory"]
            true_full_path = self.user_to_true(full_path)
            if not os.path.exists(true_full_path):
                raise FileNotFoundError
            if is_directory:
                shutil.rmtree(true_full_path)
            else:
                os.remove(true_full_path)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def save_text_file_task(self, data):
        try:
            file_path = data["file_path"]
            true_path = self.user_to_true(file_path)
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
            full_path = data["full_path"]
            true_full_path = self.user_to_true(full_path)
            if os.path.exists(true_full_path):
                raise FileExistsError
            os.mkdir(true_full_path)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def move_pool_resource_task(self, data):
        try:
            dst = data["dst"]
            src = data["src"]
            true_dst = self.user_to_true(dst)
            if os.path.exists(dst):
                raise FileExistsError
            true_src = self.user_to_true(src)
            shutil.move(true_src, true_dst)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error moving resource")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}

    @task_worthy
    def duplicate_pool_file_task(self, data):
        try:
            dst = data["dst"]
            src = data["src"]
            true_dst = self.user_to_true(dst)
            true_src = self.user_to_true(src)
            if os.path.exists(true_dst):
                raise FileExistsError
            shutil.copy2(true_src, true_dst)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error duplicating file")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}
