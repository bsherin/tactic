from flask import render_template, jsonify
from flask_login import login_required, current_user
from tactic_app import app, use_ssl
from tactic_app.users import User
import tactic_app

from container_manager import ContainerManager
from user_manager import UserManager

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

admin_user = User.get_user_by_username("admin")
global_tile_manager = tactic_app.global_tile_manager

container_manager = ContainerManager("container")
user_manager = UserManager("user")

from tactic_app.js_source_management import js_source_dict, _develop, css_source


@app.route('/admin_list_with_metadata/<res_type>', methods=['GET', 'POST'])
@login_required
def admin_list_with_metadata(res_type):
    if res_type == "container":
        manager = container_manager
    else:
        manager = user_manager
    return jsonify({"data_list": manager.get_resource_data_list()})


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html",
                               use_ssl=str(use_ssl),
                               develop=str(_develop),
                               version_string=tstring,
                               page_title="tactic admin",
                               css_source=css_source("admin_home_react"),
                               module_source=js_source_dict["admin_home_react"])
    else:
        return "not authorized"
