
import re
import sys
import datetime
from flask import render_template, request, jsonify, url_for
from flask_login import login_required, current_user
from tactic_app import app, db, use_ssl
from tactic_app.tile_code_parser import get_functions_full_code, get_starting_lines
from user_manage_views import tile_manager


indent_unit = "    "


def remove_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n" + total_indent, "\n", the_str)
    result = re.sub(r"^" + total_indent, "", result)
    return result


def insert_indents(the_str, number_indents):
    total_indent = indent_unit * number_indents
    result = re.sub(r"\n", r"\n" + total_indent, the_str)
    result = total_indent + result
    return result


def build_code(data_dict):
    export_list = data_dict["exports"]
    export_list_of_dicts = [{"name": exp["name"], "tags": exp["tags"]} for exp in export_list]
    extra_methods = insert_indents(data_dict["extra_methods"], 1)
    render_content_body = insert_indents(data_dict["render_content_body"], 2)
    if data_dict["is_mpl"]:
        draw_plot_body = insert_indents(data_dict["draw_plot_body"], 2)
    else:
        draw_plot_body = ""
    options = data_dict["options"]
    for opt_dict in options:
        if "default" not in opt_dict:
            opt_dict["default"] = "None"
        elif isinstance(opt_dict["default"], basestring):
            opt_dict["default"] = '"' + opt_dict["default"] + '"'
        opt_dict["default"] = str(opt_dict["default"])
        if "special_list" in opt_dict:
            opt_dict["special_list"] = str(opt_dict["special_list"])
    full_code = render_template("user_manage/tile_creator_template.html",
                                class_name=data_dict["module_name"],
                                category=data_dict["category"],
                                exports=export_list_of_dicts,
                                options=data_dict["options"],
                                is_mpl=data_dict["is_mpl"],
                                is_d3=data_dict["is_d3"],
                                jscript_code=data_dict["jscript_body"],
                                extra_methods=extra_methods,
                                render_content_body=render_content_body,
                                draw_plot_body=draw_plot_body)
    return full_code


@app.route('/checkpoint_module', methods=['post'])
@login_required
def checkpoint_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "history" in tile_dict:
            history = tile_dict["history"]
        else:
            history = []
        history.append({"updated": tile_dict["metadata"]["updated"],
                        "tile_module": tile_dict["tile_module"]})
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"history": history}})
        return jsonify({"success": True, "message": "Module successfully saved and checkpointed",
                        "alert_type": "alert-success"})

    except:
        error_string = "Error checkpointing module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


def create_recent_checkpoint(module_name):
    try:
        tile_dict = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "recent_history" in tile_dict:
            recent_history = tile_dict["recent_history"]
        else:
            recent_history = []
        recent_history.append({"updated": tile_dict["metadata"]["updated"],
                               "tile_module": tile_dict["tile_module"]})
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"recent_history": recent_history}})
        return jsonify({"success": True})

    except:
        error_string = "Error checkpointing module to recent" + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


@app.route('/checkpoint_to_recent', methods=['post'])
@login_required
def checkpoint_to_recent():
    data_dict = request.json
    module_name = data_dict["module_name"]
    return create_recent_checkpoint(module_name)


@app.route('/show_history_viewer/<module_name>', methods=['get', 'post'])
@login_required
def show_history_viewer(module_name):
    button_groups = [[{"name": "save_button", "button_class": "btn-default", "name_text": "Save"}]]
    javascript_source = url_for('static', filename='tactic_js/history_viewer.js')
    return render_template("user_manage/resource_viewer.html",
                           resource_name=module_name,
                           include_metadata=False,
                           include_above_main_area=True,
                           include_right=False,
                           readonly=False,
                           is_repository=False,
                           use_ssl=use_ssl,
                           javascript_source=javascript_source,
                           uses_codemirror="True",
                           button_groups=button_groups)


@app.route('/show_tile_differ/<module_name>', methods=['get', 'post'])
@login_required
def show_tile_differ(module_name):
    button_groups = [[{"name": "save_button", "button_class": "btn-default", "name_text": "Save"}]]
    javascript_source = url_for('static', filename='tactic_js/tile_differ.js')
    return render_template("user_manage/resource_viewer.html",
                           resource_name=module_name,
                           include_metadata=False,
                           include_above_main_area=True,
                           include_right=False,
                           readonly=False,
                           is_repository=False,
                           use_ssl=use_ssl,
                           javascript_source=javascript_source,
                           uses_codemirror="True",
                           button_groups=button_groups)



@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        last_saved = data_dict["last_saved"]
        if last_saved == "viewer":
            module_code = data_dict["new_code"]
            extra_methods_line_number = None
            render_content_line_number = None
            draw_plot_line_number = None
        else:
            module_code = build_code(data_dict)
            func_dict = get_functions_full_code(module_code)
            (render_content_line_number,
             draw_plot_line_number,
             extra_methods_line_number) = get_starting_lines(module_code, func_dict)
        doc = db[current_user.tile_collection_name].find_one({"tile_module_name": module_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = data_dict["tags"]
        mdata["notes"] = data_dict["notes"]
        mdata["updated"] = datetime.datetime.today()
        db[current_user.tile_collection_name].update_one({"tile_module_name": module_name},
                                                         {'$set': {"tile_module": module_code, "metadata": mdata,
                                                                   "last_saved": last_saved}})
        create_recent_checkpoint(module_name)
        tile_manager.update_selector_list()
        return jsonify({"success": True, "message": "Module Successfully Saved",
                        "alert_type": "alert-success", "render_content_line_number": render_content_line_number,
                        "draw_plot_line_number": draw_plot_line_number,
                        "extra_methods_line_number": extra_methods_line_number})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
