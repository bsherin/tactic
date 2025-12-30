
from flask import render_template, url_for
from flask_login import login_required, current_user
from flask_socketio import join_room

from tactic_app import app
from docker_functions import ContainerCreateError
from mongo_db_fs import repository_type, database_type
from aws_helpers import get_ssm_parameter
from aws_detection import on_aws
from utils import utcnow

from users import User

from js_source_management import js_source_dict, _develop, css_source


admin_user = User.get_user_by_username("admin")

tstring = utcnow().strftime("%Y-%H-%M-%S")

use_s3 = get_ssm_parameter("USE_S3","true").lower() == "true"

from tactic_app import CLIENT_ACTIVITY_INTERVAL_SECS

@app.route('/library')
@login_required
def library():
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html",
                               is_remote="no",
                               database_type=database_type,
                               repository_type="",
                               version_string=tstring,
                               develop=str(_develop),
                               page_title="tactic admin",
                               css_source=css_source("admin_home_react"),
                               module_source=js_source_dict["admin_home_react"])
    else:
        return render_template('library/library_home_react.html',
                               develop=str(_develop),
                               is_remote="no",
                               repository_type="",
                               has_openapi_key=current_user.has_openapi_key,
                               database_type=database_type,
                               version_string=tstring,
                               page_title="tactic resources",
                               css_source=css_source("library_home_react"),
                               module_source=js_source_dict["library_home_react"])


@app.route('/context')
@login_required
def context():
    return render_template('context_react.html',
                           on_aws=on_aws,
                           use_s3=use_s3,
                           database_type=database_type,
                           develop=str(_develop),
                           version_string=tstring,
                           has_pool=current_user.has_pool,
                           has_openapi_key=current_user.has_openapi_key,
                           page_title="context",
                           css_source=css_source("context_react"),
                           client_activity_interval_secs=CLIENT_ACTIVITY_INTERVAL_SECS,
                           base_figure_url=url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
                           module_source=js_source_dict["context_react"])


@app.route('/repository')
@login_required
def repository():
    return render_template('library/library_home_react.html',
                           version_string=tstring,
                           is_remote=False,
                           repository_type=repository_type,
                           develop=str(_develop),
                           library_style="tabbed",
                           page_title="tactic repository",
                           css_source=css_source("repository_home_react"),
                           module_source=js_source_dict["repository_home_react"]
                           )

# @app.route('/delete_tag', methods=['POST'])
# @login_required
# def delete_tag():
#     try:
#         pane_type = request.json["pane_type"]
#         tag = request.json["tag"]
#         if pane_type == "all":
#             rtypes = res_types
#         else:
#             rtypes = [pane_type]
#         for rtype in rtypes:
#             manager = get_manager_for_type(rtype)
#             manager.delete_tag(tag)
#         return jsonify({"success": True,
#                         "message": "Deleted tag", "alert_type": "alert-success"})
#     except Exception as ex:
#         return generic_exception_handler.get_exception_for_ajax(ex, "Error deleting a tag")
#
#
# @app.route('/rename_tag', methods=['POST'])
# @login_required
# def rename_tag():
#     try:
#         pane_type = request.json["pane_type"]
#         tag_changes = request.json["tag_changes"]
#         if pane_type == "all":
#             rtypes = res_types
#         else:
#             rtypes = [pane_type]
#         for rtype in rtypes:
#             manager = get_manager_for_type(rtype)
#             manager.rename_tag(tag_changes)
#         return jsonify({"success": True,
#                         "message": "renamed tag tag", "alert_type": "alert-success"})
#     except Exception as ex:
#         return generic_exception_handler.get_exception_for_ajax(ex, "Error renaming a tag")


@app.errorhandler(ContainerCreateError)
def handle_container_create_error(e):
    return render_template("error_window_template.html",
                           base_string="Error creating container",
                           error_string=e.args[0],
                           version_string=tstring)
