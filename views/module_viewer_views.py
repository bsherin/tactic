
import re
import sys
import datetime
from flask import render_template, request, jsonify
from flask_login import login_required, current_user
from tactic_app import app, db
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
    export_list_of_dicts = [{"name": exp_name} for exp_name in export_list]
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
                                extra_methods=extra_methods,
                                render_content_body=render_content_body,
                                draw_plot_body=draw_plot_body)
    return full_code

@app.route('/update_module', methods=['post'])
@login_required
def update_module():
    try:
        data_dict = request.json
        module_name = data_dict["module_name"]
        last_saved = data_dict["last_saved"]
        if last_saved == "viewer":
            module_code = data_dict["new_code"]
        else:
            module_code = build_code(data_dict)
        start_stuff = re.findall(r"([\s\S]*?)def render_content", module_code)
        if len(start_stuff) > 0:
            render_content_line_number = start_stuff[0].count("\n") + 1
        else:
            render_content_line_number = 0
        start_dp_stuff = re.findall(r"([\s\S]*?)def draw_plot", module_code)
        if len(start_dp_stuff) > 0:
            draw_plot_line_number = start_dp_stuff[0].count("\n") + 1
        else:
            draw_plot_line_number = 0
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
        tile_manager.update_selector_list()
        return jsonify({"success": True, "message": "Module Successfully Saved",
                        "alert_type": "alert-success", "render_content_line_number": render_content_line_number,
                        "draw_plot_line_number": draw_plot_line_number})
    except:
        error_string = "Error saving module " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

