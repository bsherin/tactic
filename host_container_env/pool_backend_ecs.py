
import os
import re
from tactic_app import socketio
from pool_backend import PoolBackend
from s3thread import boto_s3, _split_s3_url
from aws_helpers import get_ssm_parameter
from tactic_logging import log

import posixpath

from users import User

BUCKET = get_ssm_parameter("BUCKET")
TREE_DEPTH = 1

class PoolBackendECS(PoolBackend):

    def get_tree(self, user_obj, show_hidden=False, base_path=None):
        dtree = None
        try:
            user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}"
            if base_path is not None:
                base_path = base_path
            else:
                base_path = user_pool_dir
            if not boto_s3.lexists(user_pool_dir):
                log.error("user pool dir does not exist")
                return {"dtree": None}
            self.pool_visited = []
            dtree = [self.get_node(base_path,
                                   user_pool_dir,
                                   user_obj,
                                   TREE_DEPTH,
                                   show_hidden)]
        except Exception:
            log.exception("Error getting pooltree")
        return {"dtree": dtree}

    def get_subtree(self, user_obj, target_path, show_hidden=False, base_path=None):
        log.debug("getting subtree", target_path=target_path)
        user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}"
        if base_path is not None:
            base_path = base_path
        else:
            base_path = user_pool_dir
        if not boto_s3.lexists(user_pool_dir):
            log.error("user pool dir does not exist")
            return {"dtree": None}
        self.pool_visited = []
        dtree = [self.get_node_on_path(base_path,
                               user_pool_dir,
                               user_obj,
                               target_path,
                               show_hidden)]
        return {"success": True, "dtree": dtree}

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

    def get_node_on_path(self, root, user_pool_dir, user_obj, target_path, show_hidden=False):
        log.debug("getting node on path", root=root, target_path=target_path)
        ammended_root = root
        new_base_node = self.folder_dict(ammended_root, os.path.basename(root), user_obj)
        new_base_node["expanded"] = True
        child_list = []
        for entry in boto_s3.ls(root):
            fpath = entry
            entry_basename = os.path.basename(entry)
            if not show_hidden and entry_basename.startswith("."):
                continue
            if target_path.startswith(fpath):
                if boto_s3.isdir(fpath):
                    child_list.append(self.get_node_on_path(fpath,
                                                    user_pool_dir,
                                                    user_obj,
                                                    target_path,
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
            # raw_size = self.get_folder_size(truepath)
            raw_size = 0
            size_str = ""
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
            return {"success": True}
        if boto_s3.isdir(src):
            return boto_s3.rmdir(src)
        else:
            result = boto_s3.rm(src)
            path, _ = os.path.split(src)
            if not boto_s3.lexists(path + "/"):
                self.worker.pool_event({
                    "event_type": "delete",
                    "path": path,
                    "dest_path": None,
                    "is_directory": True
                })
            return result

    def download_resource(self, src, hw, user_obj):
        if not boto_s3.lexists(src):
            raise FileNotFoundError(f"Resource {src} does not exist.")
        try:
            return boto_s3.download(src)
        except Exception as ex:
            raise IOError(f"Error downloading resource {src}: {str(ex)}")

    @staticmethod
    def _sanitize_relpath(p: str) -> str:
        # normalize separators
        p = (p or "").replace("\\", "/").lstrip("/")
        # remove empty / "." segments
        parts = [seg for seg in p.split("/") if seg not in ("", ".")]
        # forbid traversal
        if any(seg == ".." for seg in parts):
            raise ValueError("Invalid filename/path")
        return "/".join(parts)

    def get_s3_upload_info(self, dest_path, filename, content_type, _the_user):
        rel = self._sanitize_relpath(filename)

        # Ensure we don't lose the s3://bucket part if dest_path is a full s3 URL
        if dest_path.startswith("s3://"):
            b, k = _split_s3_url(dest_path)
            key = posixpath.join(k, rel) if k else rel
            full_dest_path = f"s3://{b}/{key}"
        else:
            full_dest_path = posixpath.join(dest_path.rstrip("/"), rel)

        return boto_s3.upload_info(full_dest_path, content_type)

    def process_pool_event(self, event_type, path, dest_path, is_directory):
        username = re.findall("/users/(.*?)/", path)[0]
        user_obj = User.get_user_by_username(username)
        new_path = path
        event_data = {"event_type": event_type}
        if is_directory:
            if new_path.endswith("/"):
                new_path = new_path[:-1]
            event_data["path"] = new_path
            if event_type == "delete":
                folder_dict = {"fullpath": new_path}
            elif dest_path is None:
                folder_dict = self.folder_dict(new_path, os.path.basename(new_path), user_obj)
            else:
                new_dest_path = dest_path
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
                # new_dest_path = re.sub(user_pool_dir, "/mydisk", dest_path)
                new_dest_path = dest_path
                file_dict = self.file_dict(new_dest_path, os.path.basename(new_dest_path), user_obj)
            event_data["file_dict"] = file_dict
            socketio.emit('pool-file-event', event_data, namespace='/main', room=user_obj.get_id())