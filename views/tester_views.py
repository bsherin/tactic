from flask import render_template, redirect, request, url_for, flash, jsonify
from flask.ext.login import login_user, login_required, logout_user
from flask_login import current_user
from tactic_app import host_worker

from tactic_app.users import User
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length, Regexp, EqualTo
from tactic_app import app # global_stuff
import tactic_app

@app.route('/direct_user_manage/<username>/<password>', methods=['GET', 'POST'])
def direct_user_manage(username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("user_manage"))

@app.route('/direct_creator/<module_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_creator(module_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("view_in_creator", module_name=module_name))

@app.route('/direct_module_viewer/<module_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_module_viewer(module_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("view_module", module_name=module_name))

@app.route('/direct_history_viewer/<module_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_history_viewer(module_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("show_history_viewer", module_name=module_name))

@app.route('/direct_tile_differ/<module_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_tile_differ(module_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("show_tile_differ", module_name=module_name))


@app.route('/direct_list_viewer/<list_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_list_viewer(list_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("view_list", list_name=list_name))

@app.route('/direct_repository_list_viewer/<list_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_repository_list_viewer(list_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("repository_view_list", list_name=list_name))

@app.route('/direct_administer/<password>', methods=['GET', 'POST'])
def direct_administer(password):
    user = User.get_user_by_username("admin")
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("admin_interface"))


# this isn't even close to working
@app.route('/direct_project/<project_name>', methods=['GET', 'POST'])
def direct_project(project_name):
    user_obj = current_user
    data = {"project_name": project_name, "user_id": user_obj.get_id()}
    # tactic_app.host_worker.main_project(data) # This needs to not be here.
    return render_template("stub_loader.html", data_dict=data, post_task="main_project")


@app.route('/direct_collection/<collection_name>/<username>/<password>', methods=['GET', 'POST'])
def direct_collection(collection_name, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    return redirect(url_for("main", collection_name=collection_name))

@app.route('/container_create_test/<collection_name>/<n>/<username>/<password>', methods=['GET', 'POST'])
def container_create_test(collection_name,n, username, password):
    user = User.get_user_by_username(username)
    if user is not None and user.verify_password(password):
        login_user(user, remember=False)
    data = {"user_id": user.get_id(), "parent": "host"}
    for i in range(int(n)):
        res = host_worker.create_tile_container(data)
        tile_id = res["tile_id"]
        host_worker.post_task(tile_id, "stop_me")
        print str(i) + ", " + str(res["success"])
    return redirect(url_for("main", collection_name=collection_name))