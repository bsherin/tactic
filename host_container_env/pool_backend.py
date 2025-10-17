import os
import re
import datetime

class PoolBackend:

    def get_tree(self, user_obj, show_hidden=False, base_path=None):
        try:
            user_pool_dir = f"/pool/{user_obj.username}"
            if not os.path.exists(user_pool_dir):
                return {"dtree": None}
            self.pool_visited = []
            dtree = [self.get_node(user_pool_dir, user_pool_dir, user_obj, show_hidden)]
            dtree[0].update({
                "path": "/mydisk",
                "basename": "mydisk",
                "label": "mydisk"
            })
        except Exception as ex:
            print(self.handle_exception(ex, "Error getting pooltree"))
        print("returning from pooltree")
        return {"dtree": dtree}

    def get_node(self, root, user_pool_dir, user_obj, show_hidden=False):
        ammended_root = re.sub(user_pool_dir, "/mydisk", root)
        new_base_node = self.folder_dict(ammended_root, os.path.basename(root), user_obj)
        child_list = []
        for entry in os.listdir(root):
            fpath = os.path.join(root, entry)
            if not show_hidden and entry.startswith("."):
                continue
            if os.path.isdir(fpath):
                child_list.append(self.get_node(fpath, user_pool_dir, user_obj, show_hidden))
            else:
                ammended_path = re.sub(user_pool_dir, "/mydisk", fpath)
                child_list.append(self.file_dict(ammended_path, entry, user_obj))
        new_base_node["childNodes"] = child_list
        new_base_node["explored"] = True
        return new_base_node

    def folder_dict(self, path, basename, user_obj, child_nodes=[]):
        base_dict = {
            "id": path,
            "icon": "folder-close",
            "isDirectory": True,
            "isExpanded": False,
            "basename": basename,
            "label": basename,
            "fullpath": path,
            "childNodes": child_nodes,
            "isSelected": False
        }
        fstats = self.get_file_stats(path, user_obj, is_directory=True)
        base_dict.update(fstats)
        return base_dict

    def file_dict(self, path, basename, user_obj):
        base_dict = {
            "id": path,
            "icon": "document",
            "isDirectory": False,
            "fullpath": path,
            "basename": basename,
            "label": basename,
            "isSelected": False
        }
        fstats = self.get_file_stats(path, user_obj, is_directory=False)
        base_dict.update(fstats)
        return base_dict

    def get_folder_size(self, folder_path):
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(folder_path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                # Skip if it is a symbolic link
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)
        return total_size

    def get_file_stats(self, filepath, user_obj, is_directory=False):
        user_pool_dir = f"/pool/{user_obj.username}"
        if not os.path.exists(user_pool_dir):
            return {"stats": None}
        truepath = re.sub("/mydisk", user_pool_dir, filepath)
        fstat = os.stat(truepath)
        if is_directory:
            raw_size = self.get_folder_size(truepath)
        else:
            raw_size = fstat.st_size
        if raw_size > 10 ** 9:
            size_str = f"{round(raw_size / 10 ** 9, 1)} GB"
        elif raw_size > 10 ** 6:
            size_str = f"{round(raw_size / 10 ** 6, 1)} MB"
        elif raw_size > 10 ** 3:
            size_str = f"{round(raw_size / 10 ** 3, 1)} KB"
        else:
            size_str = f"{raw_size} bytes"
        updated, updated_for_sort = user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_mtime))
        stats = {
            "created": user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_ctime))[0],
            "updated": updated,
            "accessed": user_obj.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_atime))[0],
            "size": size_str,
            "updated_for_sort": updated_for_sort,
            "size_for_sort": raw_size
        }
        return stats