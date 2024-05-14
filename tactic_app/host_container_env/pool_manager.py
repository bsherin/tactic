
import os, re, shutil
from flask_login import login_required, current_user
from resource_manager import LibraryResourceManager
from flask import jsonify, request, send_file

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
        app.add_url_rule('/download_pool_file', "download_pool_file",
                         login_required(self.download_pool_file), methods=['get', "post"])

    def user_to_true(self, user_path):
        return re.sub("/mydisk", current_user.pool_dir, user_path)

    def true_to_user(self, true_path):
        return re.sub(current_user.pool_dir, "/mydisk", true_path)

    def download_pool_file(self):
        try:
            path = request.args.get("src")
            true_path = self.user_to_true(path)
            if not os.path.exists(true_path):
                raise FileNotFoundError
            return send_file(true_path, as_attachment=True)
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in download_pool_file")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

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
                raise FileNotFoundError
            if is_directory:
                shutil.rmtree(true_full_path)
            else:
                os.remove(true_full_path)
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
            if os.path.exists(true_full_path):
                raise FileExistsError
            os.mkdir(true_full_path)
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
            true_dst = self.user_to_true(dst)
            if os.path.exists(dst):
                raise FileExistsError
            true_src = self.user_to_true(src)
            shutil.move(true_src, true_dst)
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
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error duplicating file")
            print(emsg)
            return jsonify({"success": False, "message": emsg})

        return jsonify({"success": True})

    def import_pool(self, library_id):
        try:
            print("entering import_pool")
            if not current_user.has_pool:
                data = {"success": "false", "title": "Error", "content": "No pool directory for this account."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
                return jsonify({"success": False})
            number_of_files = len(list(request.files.keys()))
            print(f"got {number_of_files} files")
            if number_of_files == 0:
                data = {"success": "false", "title": "Error", "content": "No files received."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
                return jsonify({"success": False})
            chunk_number = int(request.form.get('dzchunkindex'))
            total_chunks = request.form.get('dztotalchunkcount')
            print(f"got chunk_number {chunk_number} of {total_chunks}")
            unique_name = request.form.get('dzuuid')
            upload_dir = os.path.join('uploads', unique_name)
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            chunk_file = os.path.join(upload_dir, f'{chunk_number:04d}')
            with open(chunk_file, 'wb') as f:
                f.write(request.files['file'].read())
            if len(os.listdir(upload_dir)) == int(total_chunks):
                print("got last chunk")
                fullpath = request.form.get("extra_value")
                truepath = self.user_to_true(fullpath)
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
                    emsg = self.get_traceback_message(ex, "error in saving final file")
                    print(emsg)
                    result = {
                        "success": False,
                        "title": "Error saving final file",
                        "file_decoding_errors": {truepath: emsg},
                        "failed_reads": {truepath: emsg},
                        "successful_reads": []
                    }
                    self.send_import_report(result, library_id)
                    return jsonify({"success": False})
                result ={
                    "success": True,
                    "title": "File successful save",
                    "file_decoding_errors": {},
                    "failed_reads": {},
                    "successful_reads": [truepath]
                }
                self.send_import_report(result, library_id)
                return jsonify({"success": True})
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "error in import_pool")
            print(emsg)
            return jsonify({"success": False, "message": emsg})
        return jsonify({"success": True})

    def import_pool_old(self, library_id):
        try:
            print("entering import_pool")
            fullpath = request.form.get("extra_value")
            print("got fullpath " + str(fullpath))
            error_dict = {}
            success_list = []
            if not current_user.has_pool:
                data = {"success": "false", "title": "Error", "content": "No pool directory for this account."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            if len(list(request.files.keys())) == 0:
                data = {"success": "false", "title": "Error", "content": "No files received."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            truepath = self.user_to_true(fullpath)
            print("got truepath " + str(truepath))
            for the_file in request.files.values():
                print("got filename " + str(the_file.filename))
                try:
                    true_new_path = f"{truepath}/{the_file.filename}"
                    if os.path.exists(true_new_path):
                        raise FileExistsError
                    the_file.save(true_new_path)
                    success_list.append(the_file.filename)
                except Exception as ex:
                    emsg = self.extract_short_error_message(ex, f"Error uploading file {the_file.filename}")
                    error_dict[the_file.filename] = emsg
            print("done with files")
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
            print("sending report")
            self.send_import_report(result, library_id)

        except Exception as ex:
            emsg = self.extract_short_error_message(ex, "error in import pool")
            print(emsg)
            return jsonify({"success": False, "message": emsg})
        print("returning")
        return jsonify({"success": True})
