
import os

from pool_backend import PoolBackend
from s3thread import s3

BUCKET = os.environ.get("BUCKET")
TREE_DEPTH = 1

class PoolBackendECS(PoolBackend):

    def get_tree(self, user_obj, show_hidden=False, base_path=None):
        try:
            user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}/"
            if "base_path" is not None:
                base_path = base_path
            else:
                base_path = user_pool_dir
            if not s3.lexists(user_pool_dir):
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
            for entry in s3.ls(root):
                fpath = entry
                entry_basename = os.path.basename(entry)
                if not show_hidden and entry_basename.startswith("."):
                    continue
                if s3.isdir(fpath):
                    print(f"*** found directory {fpath} **&")
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
        user_pool_dir = f"s3://{BUCKET}/users/{user_obj.username}/"
        if not s3.lexists(user_pool_dir):
            return {"stats": None}
        # truepath = re.sub("/mydisk", user_pool_dir, filepath)
        truepath = filepath
        if is_directory:
            raw_size = self.get_folder_size_ecs(truepath)
        else:
            raw_size = s3.info(truepath)["size"]
        if raw_size > 10 ** 9:
            size_str = f"{round(raw_size / 10 ** 9, 1)} GB"
        elif raw_size > 10 ** 6:
            size_str = f"{round(raw_size / 10 ** 6, 1)} MB"
        elif raw_size > 10 ** 3:
            size_str = f"{round(raw_size / 10 ** 3, 1)} KB"
        else:
            size_str = f"{raw_size} bytes"
        updated, updated_for_sort = user_obj.get_timestrings(s3.info(truepath)["last_modified"])
        stats = {
            "updated": updated,
            "size": size_str,
            "updated_for_sort": updated_for_sort,
            "size_for_sort": raw_size
        }
        return stats
