
import os, re, shutil
from flask_login import login_required, current_user
from resource_manager import LibraryResourceManager
from flask import jsonify, request

from tactic_app import app, socketio

class PoolManager(LibraryResourceManager):

    def add_rules(self):
        app.add_url_rule('/import_pool/<library_id>', "import_pool",
                         login_required(self.import_pool), methods=['get', "post"])
        app.add_url_rule('/rename_pool_resource', "rename_pool_resource",
                         login_required(self.rename_pool_resource), methods=['get', "post"])
        app.add_url_rule('/delete_pool_resource', "delete_pool_resource",
                         login_required(self.delete_pool_resource), methods=['get', "post"])
        app.add_url_rule('/create_pool_directory', "create_pool_directory",
                         login_required(self.create_pool_directory), methods=['get', "post"])
        app.add_url_rule('/move_pool_resource', "move_pool_resource",
                         login_required(self.move_pool_resource), methods=['get', "post"])
        app.add_url_rule('/duplicate_pool_file', "duplicate_pool_file",
                         login_required(self.duplicate_pool_file), methods=['get', "post"])


    def user_to_true(self, user_path):
        return re.sub("/mydisk", current_user.pool_dir, user_path)

    def true_to_user(self, true_path):
        return re.sub(current_user.pool_dir, "/mydisk", true_path)

    def rename_pool_resource(self):
        try:
            data = request.json
            new_name = data["new_name"]
            old_path = data["old_path"]
            true_old_path = self.user_to_true(old_path)
            folder_path, fname = os.path.split(true_old_path)
            true_new_path = f"{folder_path}/{new_name}"
            if os.path.exists(true_new_path):
                raise FileExistsError
            os.rename(true_old_path, true_new_path)
            new_path = self.true_to_user(true_new_path)
            user_id = current_user.get_id()
            socketio.emit("pool-name-change", {"old_path": old_path, "new_path": new_path},
                          namespace='/main', room=user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in rename_pool_resource")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})

    def delete_pool_resource(self):
        try:
            data = request.json
            full_path = data["full_path"]
            is_directory = data["is_directory"]
            true_full_path = self.user_to_true(full_path)
            if not os.path.exists(true_full_path):
                raise FileExistsError
            if is_directory:
                os.rmdir(true_full_path)
            else:
                os.remove(true_full_path)
            user_id = current_user.get_id()
            socketio.emit("pool-remove-node", {"full_path": full_path},
                          namespace='/main', room=user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})

    def create_pool_directory(self):
        try:
            data = request.json
            full_path = data["full_path"]
            true_full_path = self.user_to_true(full_path)
            os.mkdir(true_full_path)
            user_id = current_user.get_id()
            socketio.emit("pool-add-directory", {"full_path": full_path},
                          namespace='/main', room=user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error deleting resource")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})

    def move_pool_resource(self):
        try:
            data = request.json
            dst = data["dst"]
            src = data["src"]
            true_dst= self.user_to_true(dst)
            true_src = self.user_to_true(src)
            shutil.move(true_src, true_dst)
            user_id = current_user.get_id()
            socketio.emit("pool-move", {"src": src, "dst": dst},
                          namespace='/main', room=user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error moving resource")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})

    def duplicate_pool_file(self):
        try:
            data = request.json
            dst = data["dst"]
            src = data["src"]
            true_dst = self.user_to_true(dst)
            true_src = self.user_to_true(src)
            if os.path.exists(true_dst):
                raise FileExistsError
            shutil.copy2(true_src, true_dst)
            user_id = current_user.get_id()
            socketio.emit("pool-add-file", {"full_path": dst},
                          namespace='/main', room=user_id)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error duplicating file")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})



    def import_pool(self, library_id):
        try:
            fullpath = request.form.get("extra_value")
            error_dict = {}
            success_list = []
            if not current_user.has_pool:
                data = {"success": "false", "title": "Error", "content": "No pool directory for this account."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            if len(list(request.files.keys())) == 0:
                data = {"success": "false", "title": "Error", "content": "No files received."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            truepath = re.sub("/mydisk", current_user.pool_dir, fullpath)
            user_id = current_user.get_id()
            for the_file in request.files.values():
                try:
                    the_file.save(f"{truepath}/{the_file.filename}")
                    success_list.append(the_file.filename)
                    socketio.emit("pool-add-file", {"full_path": f"{fullpath}/{the_file.filename}"},
                          namespace='/main', room=user_id)
                except Exception as ex:
                    emsg = self.extract_short_error_message(ex, f"Error uploading file {the_file.filename}")
                    error_dict[the_file.filename] = emsg
            if len(error_dict.keys()) == 0:
                final_success = "true"
                title = ""
            elif len(success_list) == 0:
                final_success = "false"
                title = "No files read"
            else:
                final_success = "partial"
                title = "Some errors reading files"
            result = {
                "success": final_success,
                "title": title,
                "file_decoding_errors": {},
                "failed_reads": error_dict,
                "successful_reads": success_list
            }
            self.send_import_report(result, library_id)

        except Exception as ex:
            emsg = self.extract_short_error_message(ex, "error in import pool")
            print(emsg)
            return jsonify({"success": False, "message": emsg})
        return jsonify({"success": True})