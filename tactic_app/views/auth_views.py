__author__ = 'bls910'
from flask import render_template, redirect, request, url_for, flash, jsonify
from flask.ext.login import login_user, login_required, logout_user
from flask_login import current_user

from tactic_app.users import User
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length, Regexp, EqualTo
from tactic_app import app, socketio

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    print "entering login view"
    return render_template('auth/login.html')

@app.before_request
def beforeRequest():
    requestUrl = request.url
    http = 'http://tacticapp' in requestUrl
    if http == True:
        secureUrl = requestUrl.replace('http','https')
        return redirect(secureUrl)

@app.route('/attempt_login', methods=['GET', 'POST'])
def attempt_login():
    data = request.json
    result_dict = {}
    user = User.get_user_by_username(data["username"])
    if user is not None and user.verify_password(data["password"]):
        login_user(user)
        result_dict["logged_in"] = "yes"
    else:
        result_dict["logged_in"] = "no"
    return jsonify(result_dict)

@app.route('/logout')
@login_required
def logout():
    socketio.emit('close-user-windows', {}, namespace='/user_manage', room=current_user.get_id())
    socketio.emit('close-user-windows', {}, namespace='/main', room=current_user.get_id())
    logout_user()
    return render_template('auth/login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        new_user = User.create_new({"username": form.username.data,
                    "password": form.password.data})
        flash('You can now log in.')
        return redirect(url_for('login'))
    return render_template('auth/register.html', form=form)

class LoginForm(Form):
    username = StringField('Username', validators=[Required(), Length(1, 64)])
    password = PasswordField('Password', validators=[Required()])
    remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Log In')

class RegistrationForm(Form):
    username = StringField('Username', validators=[Required(), Length(1, 64), Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                                          'Usernames must have only letters, '
                                          'numbers, dots or underscores')])
    password = PasswordField('Password', validators=[Required(), EqualTo('password2', message='Passwords must match.')])
    password2 = PasswordField('Confirm password', validators=[Required()])
    submit = SubmitField('Register')

    def validate_username(self, field):
        if User.get_user_by_username(field.data):
            raise ValidationError('Username already in use.')