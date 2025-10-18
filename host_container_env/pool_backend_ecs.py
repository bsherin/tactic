
import os
import mimetypes
from flask import jsonify

from pool_backend import PoolBackend
from s3thread import boto_s3

BUCKET = os.environ.get("BUCKET")
TREE_DEPTH = 1

class PoolBackendECS(PoolBackend):

    def get_tree(self, user_obj, show_hidden=False, base_path=None):
        try:
            user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}"
            if base_path is not None:
                base_path = base_path
            else:
                base_path = user_pool_dir
            if not boto_s3.lexists(user_pool_dir):
                print("user pool dir does not exist")
                return {"dtree": None}
            self.pool_visited = []
            dtree = [self.get_node(base_path,
                                   user_pool_dir,
                                   user_obj,
                                   TREE_DEPTH,
                                   show_hidden)]
        except Exception as ex:
            print(self.handle_exception(ex, "Error getting pooltree"))
        print("returning from pooltree")
        return {"dtree": dtree}

    def get_node(self, root, user_pool_dir, user_obj, tree_depth=1, show_hidden=False):
        ammended_root = root
        new_base_node = self.folder_dict(ammended_root, os.path.basename(root), user_obj)
        child_list = []
        if tree_depth > 0:
            for entry in boto_s3.ls(root):
                fpath = entry
                entry_basename = os.path.basename(entry)
                if not show_hidden and entry_basename.startswith("."):
                    continue
                if boto_s3.isdir(fpath):
                    child_list.append(self.get_node(fpath,
                                                    user_pool_dir,
                                                    user_obj,
                                                    tree_depth - 1,
                                                    show_hidden))
                else:
                    ammended_path = fpath
                    basename = os.path.basename(entry)
                    child_list.append(self.file_dict(ammended_path, basename, user_obj))
            new_base_node["explored"] = True
        else:
            new_base_node["explored"] = False
        new_base_node["childNodes"] = child_list
        return new_base_node

    def get_folder_size(self, folder_path):
        return 0

    def get_file_stats(self, filepath, user_obj, is_directory=False):
        user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}"
        if not boto_s3.lexists(user_pool_dir):
            return {"stats": None}
        # truepath = re.sub("/mydisk", user_pool_dir, filepath)
        truepath = filepath
        if is_directory:
            raw_size = self.get_folder_size(truepath)
        else:
            raw_size = boto_s3.info(truepath)["size"]
        if raw_size > 10 ** 9:
            size_str = f"{round(raw_size / 10 ** 9, 1)} GB"
        elif raw_size > 10 ** 6:
            size_str = f"{round(raw_size / 10 ** 6, 1)} MB"
        elif raw_size > 10 ** 3:
            size_str = f"{round(raw_size / 10 ** 3, 1)} KB"
        else:
            size_str = f"{raw_size} bytes"
        updated, updated_for_sort = user_obj.get_timestrings(boto_s3.info(truepath)["last_modified"])
        stats = {
            "updated": updated,
            "size": size_str,
            "updated_for_sort": updated_for_sort,
            "size_for_sort": raw_size
        }
        return stats

    def duplicate_file(self, src, dst, hw, user_obj):
        boto_s3.copy(src, dst)

    def create_directory(self, full_path, hw, user_obj):
        if not boto_s3.lexists(full_path):
            boto_s3.mkdir(full_path)
        else:
            raise FileExistsError

    def read_text(self, file_path, hw, user_obj):
        if not boto_s3.lexists(file_path):
            raise FileNotFoundError(f"File {file_path} does not exist.")
        try:
            the_text = boto_s3.read_text(file_path)
            finfo = boto_s3.info(file_path)
            mdata = {}
            data = {
                "success": True,
                "the_content": the_text,
                "mdata": mdata,
                "created": '',
                "updated": user_obj.get_timestrings(finfo["last_modified"])[0],
                "size": finfo["size"]
            }
            return data
        except Exception as ex:
            raise IOError(f"Error reading file {file_path}: {str(ex)}")

    def rename_resource(self, old_path, new_name, hw, user_obj):
        folder_path, fname = os.path.split(old_path)
        new_path = f"{folder_path}/{new_name}"
        if boto_s3.lexists(new_path):
            raise FileExistsError(f"Resource {new_name} already exists at {folder_path}.")
        boto_s3.rename(old_path, new_path)
        return

    def move_resource(self, src, dst, hw, user_obj):
        if not boto_s3.lexists(src):
            raise FileNotFoundError(f"Source {src} does not exist.")
        dst_path = os.path.join(dst, os.path.basename(src))
        if boto_s3.lexists(dst_path):
            raise FileExistsError(f"Destination {dst_path} already exists.")
        boto_s3.rename(src, dst_path)
        return

    def delete_resource(self, src, hw, user_obj):
        if not boto_s3.lexists(src):
            raise FileNotFoundError(f"Resource {src} does not exist.")
        if boto_s3.isdir(src):
            boto_s3.rmdir(src)
        else:
            boto_s3.rm(src)
        return

    def download_resource(self, src, hw, user_obj):
        if not boto_s3.lexists(src):
            raise FileNotFoundError(f"Resource {src} does not exist.")
        try:
            return boto_s3.download(src)
        except Exception as ex:
            raise IOError(f"Error downloading resource {src}: {str(ex)}")

    def upload_resource(self, request, hw, current_user):
        # path the user chose in your UI (what you previously called extra_value)
        # e.g. "/users/<userId>/some/folder"
        dest_path = request.form.get("extra_value", "").strip("/")
        if not dest_path:
            return jsonify({"success": False, "message": "Missing destination"}), 400
        the_file = list(request.files.values())[0]
        filename = the_file.filename
        full_dest_path = os.path.join(dest_path, filename)
        content_type = request.form.get("content_type") or mimetypes.guess_type(filename)[
            0] or "application/octet-stream"

        return boto_s3.upload(full_dest_path, content_type, current_user.username)

