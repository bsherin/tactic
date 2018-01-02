from flask import render_template, jsonify
from flask_login import login_required, current_user
from tactic_app import app, use_ssl
from tactic_app.users import User
import tactic_app

from container_manager import ContainerManager
from user_manager import UserManager

import datetime
tstring = datetime.datetime.now().strftime("%Y-%H-%M-%S")

admin_user = User.get_user_by_username("admin")
global_tile_manager = tactic_app.global_tile_manager

container_manager = ContainerManager("container")
user_manager = UserManager("user")


@app.route('/request_update_admin_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_admin_selector_list(res_type):
    the_html = ""
    if res_type == "container":
        the_html = container_manager.request_update_selector_list()
    elif res_type == "user":
        the_html = user_manager.request_update_selector_list()
    return jsonify({"html": the_html})


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == admin_user.get_id():
        return render_template("admin_interface.html", use_ssl=str(use_ssl), version_string=tstring)
    else:
        return "not authorized"
