
import os
from flask_login import login_required, current_user
from resource_manager import LibraryResourceManager
from flask import jsonify, request

from tactic_app import app, socketio

class PoolManager(LibraryResourceManager):

    def add_rules(self):
      app.add_url_rule('/import_pool/<library_id>', "import_pool",
                     login_required(self.import_pool), methods=['get', "post"])

    def import_pool(self, library_id):
        try:
            print("*** entering import_pool ***")
            error_dict = {}
            success_list = []
            user_pool_dir = f"/pool/{current_user.username}"
            if not os.path.exists(user_pool_dir):
                data = {"success": "false", "title": "Error", "content": "No pool directory for this account."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            print("got a valid directory")
            if len(list(request.files.keys())) == 0:
                print("got no files")
                data = {"success": "false", "title": "Error", "content": "No files received."}
                socketio.emit("upload-response", data, namespace='/main', room=library_id)
            print("got some files")
            for the_file in request.files.values():
                try:
                    print("in the loop")
                    print(f"trying to read file {the_file.filename}")
                    the_file.save(f"{user_pool_dir}/{the_file.filename}")
                    print("saved a file")
                    success_list.append(the_file.filename)
                except Exception as ex:
                    print("*** Got an exception reading a file ****")
                    emsg = self.extract_short_error_message(ex, f"Error uploading file {the_file.filename}")
                    error_dict[the_file.filename] = emsg
            print("leaving loop")
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
            print("assembled report info")
            self.send_import_report(result, library_id)
            print("sent report")
        except Exception as ex:
            print("got an exception in import pool")
            emsg = self.extract_short_error_message(ex, "error in import pool")
            print(emsg)
            return jsonify({"success": False, "message": emsg})
        return jsonify({"success": True})
