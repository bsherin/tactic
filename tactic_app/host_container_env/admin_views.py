from flask import render_template, jsonify
from flask_login import login_required, current_user
from tactic_app import app
from users import User
import tactic_app
from mongo_db_fs import repository_type, database_type

from container_manager import ContainerManager
from user_manager import UserManager

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

admin_user = User.get_user_by_username("admin")
import loaded_tile_management

container_manager = ContainerManager("container")
user_manager = UserManager("user")

from js_source_management import js_source_dict, _develop, css_source


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html",
                               database_type=database_type,
                               repository_type="",
                               develop=str(_develop),
                               is_remote="no",
                               version_string=tstring,
                               page_title="tactic admin",
                               css_source=css_source("admin_home_react"),
                               module_source=js_source_dict["admin_home_react"])
    else:
        return "not authorized"
