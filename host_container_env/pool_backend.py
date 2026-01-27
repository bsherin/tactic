import os
import re
import shutil
from tactic_app import socketio
from flask import jsonify, send_file
from exception_mixin import ExceptionMixin
from utils import utc_fromtimestamp
from tactic_logging import log

from users import User

class PoolBackend(ExceptionMixin):

    def __init__(self, worker):
        super().__init__()
        self.worker = worker
        return

    def get_tree(self, user_obj, show_hidden=False, base_path=None):
        dtree = None
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
        except Exception:
            log.exception("Error getting pooltree")
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

    def folder_dict(self, path, basename, user_obj, child_nodes=None):
        child_nodes = child_nodes if child_nodes is not None else []
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
        updated, updated_for_sort = user_obj.get_timestrings(utc_fromtimestamp(fstat.st_mtime))
        stats = {
            "created": user_obj.get_timestrings(utc_fromtimestamp(fstat.st_ctime))[0],
            "updated": updated,
            "accessed": user_obj.get_timestrings(utc_fromtimestamp(fstat.st_atime))[0],
            "size": size_str,
            "updated_for_sort": updated_for_sort,
            "size_for_sort": raw_size
        }
        return stats

    def duplicate_file(self, src, dst, hw, user_obj):
        true_dst = hw.user_to_true(dst, user_obj)
        true_src = hw.user_to_true(src, user_obj)
        if os.path.exists(true_dst):
            raise FileExistsError
        shutil.copy2(true_src, true_dst)

    def create_directory(self, full_path, hw, user_obj):
        true_full_path = hw.user_to_true(full_path, user_obj)
        if os.path.exists(true_full_path):
            raise FileExistsError
        os.mkdir(true_full_path)

    def read_text(self, file_path, hw, user_obj):
        def can_read_as_text(fpath):
            try:
                with open(fpath, 'r', encoding='utf-8') as the_file:
                    the_file.read(1024)  # Attempt to read the first 1024 bytes
                return True
            except (UnicodeDecodeError, IOError):
                return False

        true_path = hw.user_to_true(file_path, user_obj)
        if not can_read_as_text(true_path):
            return {"success": False, "message": "Not a text file."}
        with open(true_path, "r") as f:
            the_text = f.read()
        mdata = {}
        _, fname = os.path.split(true_path)
        fstat = os.stat(true_path)
        data = {
            "success": True,
            "the_content": the_text,
            "mdata": mdata,
            "created": user_obj.get_timestrings(utc_fromtimestamp(fstat.st_ctime))[0],
            "updated": user_obj.get_timestrings(utc_fromtimestamp(fstat.st_mtime))[0],
            "size": fstat.st_size
        }
        return data

    def rename_resource(self, old_path, new_name, hw, user_obj):
        true_old_path = hw.user_to_true(old_path, user_obj)
        folder_path, fname = os.path.split(true_old_path)
        true_new_path = f"{folder_path}/{new_name}"
        if os.path.exists(true_new_path):
            raise FileExistsError
        os.rename(true_old_path, true_new_path)

    def move_resource(self, src, dst, hw, user_obj):
        true_dst = hw.user_to_true(dst, user_obj)
        true_src = hw.user_to_true(src, user_obj)
        if os.path.exists(os.path.join(true_dst, os.path.basename(true_src))):
            raise FileExistsError
        shutil.move(true_src, true_dst)

    def delete_resource(self, src, hw, user_obj):
        true_path = hw.user_to_true(src, user_obj)
        if not os.path.exists(true_path):
            raise FileNotFoundError
        if os.path.isdir(true_path):
            shutil.rmtree(true_path)
        else:
            os.remove(true_path)

    def download_resource(self, full_path, hw, user_obj):
        true_path = hw.user_to_true(full_path, user_obj)
        if not os.path.exists(true_path):
            raise FileNotFoundError(f"Resource {true_path} does not exist.")
        if not os.path.isfile(true_path):
            raise IsADirectoryError(f"Resource {true_path} is a directory, not a file.")
        return send_file(true_path, as_attachment=True)

    def upload_resource(self, request, hw, current_user):
        chunk_number = int(request.form.get('dzchunkindex'))
        total_chunks = request.form.get('dztotalchunkcount')
        unique_name = request.form.get('dzuuid')
        upload_dir = os.path.join('uploads', unique_name)
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        chunk_file = os.path.join(upload_dir, f'{chunk_number:04d}')
        with open(chunk_file, 'wb') as f:
            f.write(request.files['file'].read())

        if len(os.listdir(upload_dir)) == int(total_chunks):
            fullpath = request.form.get("extra_value")
            truepath = hw.user_to_true(fullpath, current_user)
            try:
                the_file = list(request.files.values())[0]
                true_new_path = f"{truepath}/{the_file.filename}"
                with open(true_new_path, 'wb') as assembled_file:
                    for i in range(int(total_chunks)):
                        chunk_part = os.path.join(upload_dir, f'{i:04d}')
                        with open(chunk_part, 'rb') as chunk:
                            assembled_file.write(chunk.read())
                        os.remove(chunk_part)
                os.rmdir(upload_dir)
            except Exception as ex:
                log.exception("Error saving final file")
                emsg = self.get_traceback_message(ex, "error in saving final file")
                result = {
                    "success": False,
                    "title": "Error saving final file",
                    "file_decoding_errors": {truepath: emsg},
                    "failed_reads": {truepath: emsg},
                    "successful_reads": []
                }
                current_user.send_import_report(result, library_id)
                return jsonify({"success": False})
            result = {
                "success": True,
                "title": "File import successful",
                "file_decoding_errors": {},
                "failed_reads": {},
                "successful_reads": [truepath]
            }
            current_user.send_import_report(result, library_id)
        return jsonify({"success": True})

    def process_pool_event(self, event_type, path, dest_path, is_directory):
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