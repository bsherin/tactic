
import os, re, shutil, datetime
from flask_login import login_required, current_user
from flask import jsonify, request, send_file
from exception_mixin import generic_exception_handler

from tactic_app import app, socketio


def user_to_true(user_path, user_obj):
    return re.sub("/mydisk", user_obj.pool_dir, user_path)


def true_to_user(true_path, user_obj):
    return re.sub(user_obj.pool_dir, "/mydisk", true_path)

@app.route('/import_pool/<library_id>', methods=['get', 'post'])
@login_required
def import_pool(library_id):
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
            truepath = user_to_true(fullpath, current_user)
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
                emsg = generic_exception_handler.get_traceback_message(ex, "error in saving final file")
                print(emsg)
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
    except Exception as ex:
        emsg = generic_exception_handler.get_traceback_message(ex, "error in import_pool")
        print(emsg)
        return jsonify({"success": False, "message": emsg})
    return jsonify({"success": True})

@app.route('/download_pool_file', methods=['get', 'post'])
@login_required
def download_pool_file():
    print("entering download_pool_file")
    try:
        path = request.args.get("src")
        true_path = user_to_true(path, current_user)
        if not os.path.exists(true_path):
            raise FileNotFoundError
        return send_file(true_path, as_attachment=True)
    except Exception as ex:
        emsg = generic_exception_handler.get_traceback_message(ex, "error in download_pool_file")
        print(emsg)
        return jsonify({"success": False, "message": emsg})

