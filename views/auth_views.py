from flask import render_template, request, jsonify
from flask.ext.login import login_user, login_required, logout_user
from flask_login import current_user

from tactic_app.users import User
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length, Regexp, EqualTo
from tactic_app import app, socketio, csrf
from wtforms.validators import ValidationError
from tactic_app import ANYONE_CAN_REGISTER
from tactic_app.global_tile_management import global_tile_manager
from tactic_app.docker_functions import destroy_user_containers

# @app.before_request
# def mark_sess_modified():
#   session.modified = True

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    print "entering login view"
    return render_template('auth/login.html', after_register="no", message="", alert_type="")


@app.route('/login_after_register', methods=['GET', 'POST'])
def login_after_register():
    print "entering login view"
    return render_template('auth/login.html', show_message="yes",
                           message="You can now log in.", alert_type="alert-success")


@app.route('/attempt_login', methods=['GET', 'POST'])
def attempt_login():
    data = request.json
    result_dict = {}
    user = User.get_user_by_username(data["username"])
    if user is not None and user.verify_password(data["password"]):
        login_user(user, remember=data["remember_me"])
        result_dict["logged_in"] = True
    else:
        result_dict["logged_in"] = False
    return jsonify(result_dict)


@app.route('/check_if_admin', methods=["GET"])
def check_if_admin():
    result_dict = {}
    try:
        if ANYONE_CAN_REGISTER or (current_user.username == "repository"):
            result_dict["is_admin"] = True
        else:
            result_dict["is_admin"] = False
    except AttributeError:
        result_dict["is_admin"] = False
    return jsonify(result_dict)


@app.route('/logout')
@login_required
def logout():
    user_id = current_user.get_id()
    socketio.emit('close-user-windows', {}, namespace='/user_manage', room=user_id)
    socketio.emit('close-user-windows', {}, namespace='/main', room=user_id)
    global_tile_manager.remove_user(current_user.username)
    destroy_user_containers(user_id) # They should be gone by this point. But make sure.
    logout_user()
    return render_template('auth/login.html', show_message="yes",
                           message="You have been logged out.", alert_type="alert-info")


@app.route('/register', methods=['GET', 'POST'])
def register():
    if ANYONE_CAN_REGISTER or (current_user.username == "repository"):
        return render_template('auth/register.html')
    else:
        return render_template


@app.route('/account_info', methods=['GET', 'POST'])
@login_required
def account_info():
    user_data = current_user.user_data_dict
    field_list = []
    for key, val in user_data.items():
        if not key == "username":
            field_list.append({"name": key, "val": val})
    return render_template('auth/account.html', fields=field_list)


@app.route('/attempt_register', methods=['GET', 'POST'])
def attempt_register():
    data = request.json
    result_dict = User.create_new({"username": data["username"], "password": data["password"]})
    return jsonify(result_dict)


@app.route('/update_account_info', methods=['GET', 'POST'])
@login_required
def update_account_info():
    data = request.json
    result_dict = current_user.update_account(data)
    return jsonify(result_dict)


@csrf.error_handler
def csrf_error(reason):
    return login('auth/login.html', show_message="yes", message=reason), 400


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
