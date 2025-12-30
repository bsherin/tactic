
import os
import io
from collections import OrderedDict
from flask import request, render_template, send_file
from flask_login import login_required, current_user
from tactic_app import app
from file_handling import read_freeform_file

from js_source_management import js_source_dict, _develop, css_source

from utils import utcnow
tstring = utcnow().strftime("%Y-%H-%M-%S")


@app.route('/download_jupyter/<project_name>/<new_name>', methods=['get', 'post'])
@login_required
def download_jupyter(project_name, new_name):
    user_obj = current_user
    save_dict = user_obj.get_project_doc(project_name)
    mdata = save_dict["metadata"]

    if not mdata["type"] == "jupyter":
        return NotImplementedError

    project_dict = user_obj.read_project_dict_from_doc(save_dict, False)
    mem = io.BytesIO()
    mem.write(project_dict["jupyter_text"].encode())
    mem.seek(0)
    return send_file(mem,
                     download_name=new_name,
                     as_attachment=True)


@app.route('/import_jupyter/<library_id>', methods=['get', 'post'])
@login_required
def import_jupyter(library_id):
    user_obj = current_user
    file_list = []
    for the_file in request.files.values():
        file_list.append(the_file)
    if len(file_list) == 0:
        result = {"success": "false", "title": "Error creating notebooks", "content": "No files received"}
        user_obj.send_import_report(result, library_id)
        return {"success": True}
    result = import_as_jupyter_full(file_list)
    if result["success"] in ["false", "partial"]:
        user_obj.send_import_report(result, library_id)
    return {"success": True}


def import_as_jupyter_full(file_list):
    user_obj = current_user
    file_decoding_errors = OrderedDict()
    failed_reads = OrderedDict()
    successful_reads = []
    for the_file in file_list:
        filename, file_extension = os.path.splitext(the_file.filename)
        jupyter_name = user_obj.make_name_unique(filename, user_obj.project_names())
        filename = filename.encode("ascii", "ignore").decode()
        (success, result_txt, encoding, decoding_problems) = read_freeform_file(the_file)
        if not success:  # then result_dict contains an error object
            e = result_txt
            failed_reads[the_file.filename] = e.message
            continue
        if len(decoding_problems) > 0:
            file_decoding_errors[the_file.filename] = decoding_problems

        user_obj.create_new_jupyter_project(jupyter_name, result_txt)
        if len(decoding_problems) > 0:
            file_decoding_errors[filename] = decoding_problems
        successful_reads.append(filename)
    if len(successful_reads) == 0:
        return {"success": "false",
                "title": "No notebooks successfully read",
                "file_decoding_errors": file_decoding_errors,
                "successful_reads": successful_reads,
                "failed_reads": failed_reads}

    if len(failed_reads.keys()) > 0 or len(file_decoding_errors.keys()) > 0:
        final_success = "partial"
        title = "Some errors reading notebooks"
    else:
        title = ""
        final_success = "true"

    return {"success": final_success,
            "title": title,
            "file_decoding_errors": file_decoding_errors,
            "successful_reads": successful_reads,
            "failed_reads": failed_reads}


@app.route('/main_project/<project_name>', methods=['get'])
def main_project(project_name):
    data_dict = {"project_name": project_name,
                 "is_new_notebook": "False",
                 "read_only": "False",
                 "is_repository": "False",
                 "develop": str(_develop),
                 "has_openapi_key": current_user.has_openapi_key,
                 "collection_name": "",
                 "theme": current_user.get_theme(),
                 "version_string": tstring}

    save_dict = current_user.get_project_doc(project_name)
    mdata = save_dict["metadata"]
    if "type" in mdata:
        doc_type = mdata["type"]
    else:
        doc_type = "table"

    if doc_type in ['notebook', 'jupyter']:
        data_dict["module_source"] = js_source_dict["notebook_app"]
        data_dict["css_source"] = css_source("notebook_app")
    else:
        data_dict["module_source"] = js_source_dict["main_app"]
        data_dict["css_source"] = css_source("main_app")

    return render_template("main_react.html", **data_dict)
