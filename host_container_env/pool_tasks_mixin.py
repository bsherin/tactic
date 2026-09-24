
import os
from qworker import task_worthy
from tactic_app import socketio
from tactic_logging import log
from users import load_user, User

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
    def is_directory_empty(self, data):
        path = data["path"]
        is_empty = self.pool_backend.is_prefix_empty(path)
        return {"success": True, "is_empty": is_empty}

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
    def pool_refresh_event(self, data):
        user_obj = User.get_user_by_username(data["username"])
        if user_obj is None:
            log.warning(
                "Ignoring pool refresh for unknown user",
                username=data["username"],
            )
            return {"success": True}
        socketio.emit(
            "pool-refresh-event",
            {"event_count": data.get("event_count", 1)},
            namespace="/main",
            room=user_obj.get_id(),
        )
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
        return self.pool_backend.delete_resource(full_path, self, the_user)

    @task_worthy
    def delete_pool_resources_task(self, data):
        """Delete a selection as one user operation, including non-empty directories."""
        the_user = self.get_user_from_data(data)
        resources = data.get("resources", [])
        if any(self.pool_backend.is_pool_root(item["full_path"], self, the_user) for item in resources):
            return {"success": False, "message": "The pool root cannot be deleted."}

        # If both a directory and one of its descendants were selected, deleting
        # the directory covers both. Collapse overlaps before touching storage.
        unique_resources = {item["full_path"].rstrip("/"): item for item in resources}
        resources = []
        for path, resource in sorted(unique_resources.items(), key=lambda item: item[0].count("/")):
            if any(path.startswith(parent["full_path"].rstrip("/") + "/") for parent in resources):
                continue
            resources.append(resource)
        for resource in resources:
            result = self.pool_backend.delete_resource(resource["full_path"], self, the_user)
            if isinstance(result, dict) and not result.get("success", True):
                return result
        return {"success": True, "deleted": len(resources)}

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
