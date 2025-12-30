from flask import render_template
from flask_login import login_required, current_user
from tactic_app import app
from mongo_db_fs import database_type
from users import User
from utils import utcnow

tstring = utcnow().strftime("%Y-%H-%M-%S")

admin_user = User.get_user_by_username("admin")

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


