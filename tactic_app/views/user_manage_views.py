__author__ = 'bls910'

from flask import render_template, request, make_response, redirect, url_for
from tactic_app import app, db, socketio
from tactic_app.file_handling import convert_multi_doc_file_to_dict_list, load_a_list;
from tactic_app.main import create_new_mainwindow
from flask_login import current_user
from flask_socketio import join_room

@app.route('/user_manage')
def user_manage():
    return render_template('user_manage/user_manage.html')

def build_data_collection_name(collection_name):
    return '{}.data_collection.{}'.format(current_user.username, collection_name)

def put_docs_in_collection(collection_name, dict_list):
    return db[collection_name].insert_many(dict_list)

@app.route('/add_file_as_collection', methods=['POST', 'GET'])
def add_file_as_collection():
    file = request.files['file']
    (collection_name, dict_list) = convert_multi_doc_file_to_dict_list(file)
    put_docs_in_collection(build_data_collection_name(collection_name), dict_list)
    socketio.emit('update-collection-list', namespace='/user_manage', room=current_user.get_id())
    # current_user.add_collection(collection_name)
    return redirect(url_for(user_manage))

@app.route('/add_list', methods=['POST', 'GET'])
def add_list():
    file = request.files['file']
    the_list = load_a_list(file)
    data_dict = {"list_name": file.filename, "the_list": the_list}
    db[current_user.list_collection_name].insert_one(data_dict)
    socketio.emit('update-list-list', namespace='/user_manage', room=current_user.get_id())
    return make_response("", 204)

@app.route('/delete_project/<project_name>', methods=['post'])
def delete_project(project_name):
    db[current_user.project_collection_name].delete_one({"project_name": project_name})
    socketio.emit('update-project-list', namespace='/user_manage', room=current_user.get_id())
    return
    # return render_template("project_list.html")

@app.route('/delete_list/<list_name>', methods=['post'])
def delete_list(list_name):
    db[current_user.list_collection_name].delete_one({"list_name": list_name})
    socketio.emit('update-list-list', namespace='/user_manage', room=current_user.get_id())
    return

@app.route('/update_projects')
def update_projects():
    return render_template("user_manage/project_list.html")

@app.route('/update_lists')
def update_lists():
    return render_template("user_manage/list_list.html")

@app.route('/update_collections')
def update_collections():
    return render_template("user_manage/collection_list.html")

@app.route('/delete_collection/<collection_name>', methods=['post'])
def delete_collection(collection_name):
    db.drop_collection(current_user.full_collection_name(collection_name))
    socketio.emit('update-collection-list', namespace='/user_manage', room=current_user.get_id())
    # return render_template("collection_list.html")

@app.route('/main/<collection_name>', methods=['get'])
def main(collection_name):
    cname=build_data_collection_name(collection_name)
    main_id = create_new_mainwindow(current_user.get_id(), cname)
    return render_template("main.html",
                           collection_name=cname,
                           project_name='',
                           main_id=main_id)

@app.route('/main_project/<project_name>', methods=['get'])
def main_project(project_name):
    project_dict = db[current_user.project_collection_name].find_one({"project_name": project_name})
    cname = project_dict["data_collection_name"]
    main_id = create_new_mainwindow(current_user.get_id(), cname, project_name)
    return render_template("main.html",
                           collection_name=cname,
                           project_name=project_name,
                           main_id=main_id)

@socketio.on('connect', namespace='/user_manage')
def connected_msg():
    print"client connected"

@socketio.on('join', namespace='/user_manage')
def on_join(data):
    room=data["user_id"]
    join_room(room)
    print "user joined room " + room