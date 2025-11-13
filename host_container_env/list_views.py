
import sys, datetime, copy
import re
from collections import OrderedDict
import os
from flask_login import login_required, current_user
from flask import jsonify, render_template, url_for, request

from tactic_app import app
from file_handling import load_a_list
from file_handling import read_freeform_file

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

from js_source_management import js_source_dict, _develop, css_source

@app.route('/view_list/<list_name>', methods=['get'])
@login_required
def view_list(list_name):
    javascript_source = url_for('static', filename=js_source_dict["list_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=list_name,
                           is_repository=False,
                           read_only=False,
                           develop=str(_develop),
                           has_openapi_key=current_user.has_openapi_key,
                           javascript_source=javascript_source,
                           css_source=css_source("list_viewer_react"),
                           version_string=tstring)

@app.route('/repository_view_list/<list_name>', methods=['get'])
@login_required
def repository_view_list(list_name):
    javascript_source = url_for('static', filename=js_source_dict["list_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=list_name,
                           is_repository=True,
                           read_only=True,
                           develop=str(_develop),
                           javascript_source=javascript_source,
                           css_source=css_source("list_viewer_react"),
                           version_string=tstring)

@app.route('/import_list/<library_id>', methods=['get', 'post'])
@login_required
def import_list(library_id):
    user_obj = current_user
    file_list = []
    for the_file in request.files.values():
        file_list.append(the_file)
    if len(file_list) == 0:
        result = {"success": "false", "title": "Error creating lists", "content": "No files received"}
        user_obj.send_import_report(result, library_id)
        return {"success": True}
    result = import_as_list_full(file_list)
    if result["success"] in ["false", "partial"]:
        user_obj.send_import_report(result, library_id)
    return {"success": True}

def import_as_list_full(file_list):
    user_obj = current_user
    file_decoding_errors = OrderedDict()
    failed_reads = OrderedDict()
    successful_reads = []

    for the_file in file_list:
        filename, file_extension = os.path.splitext(the_file.filename)
        list_name = user_obj.make_name_unique(filename, user_obj.list_names())
        filename = filename.encode("ascii", "ignore").decode()

        (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
        if not success:  # then result_dict contains an error object
            e = result_txt
            failed_reads[the_file.filename] = e.message
            continue

        the_list = load_a_list(result_txt)
        if len(decoding_problems) > 0:
            file_decoding_errors[the_file.filename] = decoding_problems

        user_obj.create_list_from_data(list_name, the_list)
        if len(decoding_problems) > 0:
            file_decoding_errors[filename] = decoding_problems
        successful_reads.append(filename)

    if len(successful_reads) == 0:
        return {"success": "false",
                "title": "Failed to read list(s)",
                "file_decoding_errors": file_decoding_errors,
                "successful_reads": successful_reads,
                "failed_reads": failed_reads}

    if len(failed_reads.keys()) > 0 or len(file_decoding_errors.keys()) > 0:
        final_success = "partial"
        title = "Some errors reading lists"
    else:
        final_success = "true"
        title = ""

    return {"success": final_success,
            "title": title,
            "file_decoding_errors": file_decoding_errors,
            "successful_reads": successful_reads,
            "failed_reads": failed_reads}

