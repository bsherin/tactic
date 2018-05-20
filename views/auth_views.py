import datetime
from flask import render_template, request, jsonify
from flask_login import login_user, login_required, logout_user
from flask_login import current_user

from tactic_app.users import User, res_types, copy_between_accounts
from flask_wtf import Form
from flask_wtf.csrf import CSRFError
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length, Regexp, EqualTo
from tactic_app import app, socketio, csrf, db
from wtforms.validators import ValidationError
from tactic_app import ANYONE_CAN_REGISTER
import tactic_app

admin_user = User.get_user_by_username("admin")

# @app.before_request
# def mark_sess_modified():
#   session.modified = True

tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    print "entering login view"
    return render_template('auth/login.html', after_register="no", message="", alert_type="", version_string=tstring)


@app.route('/login_after_register', methods=['GET', 'POST'])
def login_after_register():
    print "entering login view"
    return render_template('auth/login.html', show_message="yes",
                           message="You can now log in.", alert_type="alert-success", version_string=tstring)


@app.route('/attempt_login', methods=['GET', 'POST'])
def attempt_login():
    data = request.json
    result_dict = {}
    user = User.get_user_by_username(data["username"])
    if user is not None and user.verify_password(data["password"]):
        login_user(user, remember=data["remember_me"])
        user.set_user_timezone_offset(data["tzOffset"])
        user.set_last_login()
        result_dict["logged_in"] = True
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
    print "in logout"
    user_id = current_user.get_id()
    socketio.emit('close-user-windows', {"originator": page_id}, namespace='/user_manage', room=user_id)
    socketio.emit('close-user-windows', {"originator": page_id}, namespace='/main', room=user_id)
    tactic_app.global_tile_manager.remove_user(current_user.username)
    # The containers should be gone by this point. But make sure.
    tactic_app.host_worker.post_task("host", "destroy_a_users_containers", {"user_id": user_id})
    logout_user()
    return render_template('auth/login.html', show_message="yes",
                           message="You have been logged out.", alert_type="alert-info", version_string=tstring)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if ANYONE_CAN_REGISTER or (current_user.username == "admin"):
        return render_template('auth/register.html', version_string=tstring)
    else:
        return render_template


@app.route('/user_duplicate', methods=['GET', 'POST'])
def user_duplicate():
    if ANYONE_CAN_REGISTER or (current_user.username == "admin"):
        return render_template('auth/duplicate_user.html', version_string=tstring)
    else:
        return render_template


@app.route('/attempt_register', methods=['GET', 'POST'])
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
@login_required
def account_info():
    user_data = current_user.user_data_dict
    field_list = []
    for key, val in user_data.items():
        if not key == "username" and not key == "tzoffset":
            field_list.append({"name": key, "val": val})
    return render_template('auth/account.html', fields=field_list, version_string=tstring)


@app.route('/update_account_info', methods=['GET', 'POST'])
@login_required
def update_account_info():
    data = request.json
    result_dict = current_user.update_account(data)
    return jsonify(result_dict)


@app.errorhandler(CSRFError)
def csrf_error(reason):
    return render_template('auth/login.html', show_message="yes", message=reason), 400


class LoginForm(Form):
    username = StringField('Username', validators=[Required(), Length(1, 64)])
    password = PasswordField('Password', validators=[Required()])
    remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Log In')


class RegistrationForm(Form):
    username = StringField('Username',
                           validators=[Required(), Length(1, 64),
                                       Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                                              'Usernames must have only letters, numbers, dots or underscores')])
    password = PasswordField('Password', validators=[Required(), EqualTo('password2', message='Passwords must match.')])
    password2 = PasswordField('Confirm password', validators=[Required()])
    submit = SubmitField('Register')

    def validate_username(self, field):
        if User.get_user_by_username(field.data):
            raise ValidationError('Username already in use.')
