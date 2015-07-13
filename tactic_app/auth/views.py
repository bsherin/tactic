__author__ = 'bls910'
from flask import render_template, redirect, request, url_for, flash
from flask.ext.login import login_user, login_required, logout_user

from users import User
from forms import LoginForm, RegistrationForm
from tactic_app import app

@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.get_user_by_username(form.username.data)
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            return redirect(request.args.get('next') or url_for('user_manage'))
        flash('Invalid username or password.')
    return render_template('auth/login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        new_user = User.create_new({"username": form.username.data,
                    "password": form.password.data})
        flash('You can now login.')
        return redirect(url_for('login'))
    return render_template('auth/register.html', form=form)