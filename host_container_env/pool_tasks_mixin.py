
import os
import shutil
from qworker import task_worthy
from users import load_user

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

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
            username = re.findall("/pool/(.*?)/", path)[0]
            user_obj = User.get_user_by_username(username)
            user_pool_dir = f"/pool/{user_obj.username}"
            new_path = re.sub(user_pool_dir, "/mydisk", path)
            event_data = {"event_type": event_type}
            if is_directory:
                new_path = new_path[:-1]
                event_data["path"] = new_path
                if event_type == "delete":
                    folder_dict = {"fullpath": new_path}
                elif dest_path is None:
                    folder_dict = self.folder_dict(new_path, os.path.basename(new_path), user_obj)
                else:
                    new_dest_path = re.sub(user_pool_dir, "/mydisk", dest_path[:-1])
                    event_data["dest_path"] = new_dest_path
                    folder_dict = self.folder_dict(new_dest_path, os.path.basename(new_dest_path), user_obj)
                event_data["folder_dict"] = folder_dict
                socketio.emit('pool-directory-event', event_data, namespace='/main', room=user_obj.get_id())
            else:
                event_data["path"] = new_path
                if event_type == "delete":
                    file_dict = {"fullpath": new_path}
                elif dest_path is None:
                    file_dict = self.file_dict(new_path, os.path.basename(new_path), user_obj)
                else:
                    new_dest_path = re.sub(user_pool_dir, "/mydisk", dest_path)
                    file_dict = self.file_dict(new_dest_path, os.path.basename(new_dest_path), user_obj)
                event_data["file_dict"] = file_dict
                socketio.emit('pool-file-event', event_data, namespace='/main', room=user_obj.get_id())
        except Exception as ex:
            print(self.handle_exception(ex, "Got error in pool_event"))
        return {"success": True}

    @task_worthy
    def rename_pool_resource_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            new_name = data["new_name"]
            old_path = data["old_path"]
            true_old_path = self.user_to_true(old_path, the_user)
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
            the_user = self.get_user_from_data(data)
            full_path = data["full_path"]
            is_directory = data["is_directory"]
            true_full_path = self.user_to_true(full_path, the_user)
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
            true_full_path = self.user_to_true(full_path, the_user)
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
            the_user = self.get_user_from_data(data)
            dst = data["dst"]
            src = data["src"]
            true_dst = self.user_to_true(dst, the_user)
            if os.path.exists(dst):
                raise FileExistsError
            true_src = self.user_to_true(src, the_user)
            shutil.move(true_src, true_dst)
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
            true_dst = self.user_to_true(dst, the_user)
            true_src = self.user_to_true(src, the_user)
            if os.path.exists(true_dst):
                raise FileExistsError
            shutil.copy2(true_src, true_dst)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error duplicating file")
            print(emsg)
            return {"success": False, "message": emsg}

        return {"success": True}
