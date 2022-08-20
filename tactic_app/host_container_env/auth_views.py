import datetime
import re
import copy
from flask import render_template, request, jsonify, redirect, url_for
from flask_login import login_user, login_required, logout_user, fresh_login_required
from flask_login import current_user
from tactic_app import login_manager

from users import User, user_data_fields
from mongo_accesser import res_types
from library_views import copy_between_accounts
from flask_wtf import Form
# noinspection PyProtectedMember
from flask_wtf.csrf import CSRFError
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Length, Regexp, EqualTo
from tactic_app import app, socketio, csrf, db, fs
from wtforms.validators import ValidationError
from tactic_app import ANYONE_CAN_REGISTER
import tactic_app
import loaded_tile_management

from js_source_management import js_source_dict, _develop, css_source

admin_user = User.get_user_by_username("admin")

# @app.before_request
# def mark_sess_modified():
#   session.modified = True

tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")


@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    print("entering login view")
    next_view = request.args.get('next')

    if next_view is None:
        if current_user.is_authenticated:
            return redirect(url_for("successful_login"))
        next_view = "successful_login"
    javascript_source = url_for('static', filename=js_source_dict["auth_react"])
    return render_template('auth/login_react.html', develop=str(_develop),
                           javascript_source=javascript_source,
                           css_source=css_source("auth_react"),
                           after_register="no", message="", alert_type="",
                           next_view=next_view, version_string=tstring)


@app.route("/successful_login", methods=['GET', 'POST'])
def successful_login():
    if current_user.get_preferred_interface() == "single-window":
        view_text = "context"
    else:
        view_text = "library"
    return redirect(url_for(view_text))


@app.route('/relogin', methods=['GET', 'POST'])
def relogin():
    print("entering relogin view")
    next_view = request.args.get('next')
    if next_view is None:
        next_view = "successful_login"
    javascript_source = url_for('static', filename=js_source_dict["auth_react"])
    return render_template('auth/login_react.html', after_register="no", message="",
                           javascript_source=javascript_source,
                           css_source=css_source("auth_react"),
                           alert_type="", next_view=next_view, version_string=tstring)


login_manager.refresh_view = "relogin"


@app.route('/login_after_register', methods=['GET', 'POST'])
def login_after_register():
    print("entering login view")
    javascript_source = url_for('static', filename=js_source_dict["auth_react"])
    return render_template('auth/login_react.html', show_message="yes", javascript_source=javascript_source,
                           css_source=css_source("auth_react"),
                           message="You can now log in.", alert_type="alert-success", version_string=tstring)


@app.route('/attempt_login', methods=['GET', 'POST'])
def attempt_login():
    print("entering attempt login")
    data = request.json
    result_dict = {}
    user = User.get_user_by_username(data["username"])
    if user is not None and user.verify_password(data["password"]):
        login_user(user, remember=data["remember_me"])
        if current_user.is_anonymous:
            result_dict["logged_in"] = False
        else:
            user.set_user_timezone_offset(data["tzOffset"])
            user.set_last_login()
            print("about to call load_user_default_tiles")
            error_list = loaded_tile_management.load_user_default_tiles(current_user.username)
            result_dict["logged_in"] = True
            result_dict["tile_loading_errors"] = error_list
    else:
        result_dict["logged_in"] = False
    return jsonify(result_dict)


@app.route('/check_if_admin', methods=["GET"])
def check_if_admin():
    result_dict = {}
    try:
        if ANYONE_CAN_REGISTER or (current_user.username == "admin"):
            result_dict["is_admin"] = True
        else:
            result_dict["is_admin"] = False
    except AttributeError:
        result_dict["is_admin"] = False
    return jsonify(result_dict)


@app.route('/logout/<page_id>')
@login_required
def logout(page_id):
    print("in logout")
    user_id = current_user.get_id()
    # socketio.emit('close-user-windows', {"originator": page_id}, namespace='/library', room=user_id)
    socketio.emit('close-user-windows', {"originator": page_id}, namespace='/main', room=user_id)
    loaded_tile_management.remove_user(current_user.username)
    # The containers should be gone by this point. But make sure.
    tactic_app.host_worker.post_task("host", "destroy_a_users_containers", {"user_id": user_id, "notify": False})
    logout_user()
    return redirect(url_for("login"))


@app.route('/register', methods=['GET', 'POST'])
@login_required
def register():
    if ANYONE_CAN_REGISTER or (current_user.username == "admin"):
        return render_template('auth/register_react.html',
                               css_source=css_source("register_react"),
                               module_source=js_source_dict["register_react"],
                               version_string=tstring)
    else:
        return render_template


@app.route('/user_duplicate/<old_username>', methods=['GET', 'POST'])
@login_required
def user_duplicate(old_username):
    if ANYONE_CAN_REGISTER or (current_user.username == "admin"):
        return render_template('auth/duplicate_user_react.html',
                               css_source=css_source("duplicate_user_react"),
                               module_source=js_source_dict["duplicate_user_react"],
                               old_username=old_username, version_string=tstring)
    else:
        return render_template


@app.route('/attempt_register', methods=['GET', 'POST'])
@login_required
def attempt_register():
    data = request.json
    result_dict = User.create_new({"username": data["username"], "password": data["password"]})
    if result_dict["success"]:
        # Copy over all of the starter resources for the new user
        repository_user = User.get_user_by_username("repository")
        new_user = User.get_user_by_username(data["username"])
        for res_type in res_types:
            starters = repository_user.get_resource_names(res_type, tag_filter="starter")
            for rname in starters:
                copy_between_accounts(repository_user, new_user, res_type, rname, rname)
    return jsonify(result_dict)


@app.route('/attempt_duplicate', methods=['GET', 'POST'])
def attempt_duplicate():
    if not (current_user.get_id() == admin_user.get_id()):
        return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
    data = request.json
    result_dict = User.create_new({"username": data["username"], "password": data["password"]})
    if result_dict["success"]:
        # Copy over all of the starter resources for the new user
        repository_user = User.get_user_by_username("repository")
        new_user = User.get_user_by_username(data["username"])
        for res_type in res_types:
            starters = repository_user.get_resource_names(res_type, tag_filter="starter")
            for rname in starters:
                copy_between_accounts(repository_user, new_user, res_type, rname, rname)
        old_user = User.get_user_by_username(data["old_username"])
        for res_type in res_types:
            starters = old_user.get_resource_names(res_type)
            for rname in starters:
                copy_between_accounts(old_user, new_user, res_type, rname, rname)
        result_dict["message"] = "user duplicated apparently"
    else:
        result_dict["message"] = "something went wrong"
    return jsonify(result_dict)


@app.route('/account_info', methods=['GET', 'POST'])
@fresh_login_required
def account_info():
    user_obj = current_user
    return render_template('account_react.html',
                           css_source=css_source("account_react"),
                           theme=user_obj.get_theme(),
                           module_source=js_source_dict["account_react"], version_string=tstring)


@app.route('/get_account_info', methods=['GET', 'POST'])
@fresh_login_required
def get_account_info():
    user_data = current_user.user_data_dict
    field_list = []
    for fdict in user_data_fields:
        if not fdict["editable"]:
            continue
        new_fdict = copy.copy(fdict)
        new_fdict["val"] = user_data[new_fdict["name"]]
        field_list.append(new_fdict)
    return jsonify({"field_list": field_list})


@app.route('/get_preferred_codemirror_themes', methods=['GET', 'POST'])
@fresh_login_required
def get_preferred_codemirror_themes():
    user_data = current_user.user_data_dict
    return jsonify({
        "success": True,
        "preferred_dark_theme": user_data["preferred_dark_theme"],
        "preferred_light_theme": user_data["preferred_light_theme"]
    })


@app.route('/update_account_info', methods=['GET', 'POST'])
@fresh_login_required
def update_account_info():
    data = request.json
    result_dict = current_user.update_account(data)
    return jsonify(result_dict)


@app.errorhandler(CSRFError)
def csrf_error(reason):
    javascript_source = url_for('static', filename=js_source_dict["auth_react"])
    return render_template('auth/login_react.html', develop=str(_develop),
                           javascript_source=javascript_source,
                           show_message="yes",
                           css_source=css_source("auth_react"),
                           after_register="no", message=reason, alert_type="",
                           next_view="successful_login", version_string=tstring), 400



