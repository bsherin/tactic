
import os, re, shutil, datetime
from flask_login import login_required, current_user
from flask import jsonify, request, send_file
from exception_mixin import generic_exception_handler

from tactic_app import app, socketio
import tactic_app


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
        return tactic_app.host_worker.pool_backend.upload_resource(request, tactic_app.host_worker, current_user)
    except Exception as ex:
        emsg = generic_exception_handler.get_traceback_message(ex, "error in import_pool")
        print(emsg)
        return jsonify({"success": False, "message": emsg})

@app.route('/download_pool_file', methods=['get', 'post'])
@login_required
def download_pool_file():
    print("entering download_pool_file")
    try:
        path = request.args.get("src")
        return tactic_app.host_worker.pool_backend.download_resource(path, tactic_app.host_worker, current_user)
    except Exception as ex:
        emsg = generic_exception_handler.get_traceback_message(ex, "error in download_pool_file")
        print(emsg)
        return jsonify({"success": False, "message": emsg})

