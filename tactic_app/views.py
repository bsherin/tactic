__author__ = 'bls910'
from tactic_app import app, db
from flask import render_template, request, jsonify
from file_handling import convert_multi_doc_file_to_dict_list
from flask_login import current_user
import json


@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/user_manage')
def user_manage():
    return render_template('user_manage.html')

def build_data_collection_name(collection_name):
    return '{}.data_collection.{}'.format(current_user.username, collection_name)

def put_docs_in_collection(collection_name, dict_list):
    return db[collection_name].insert_many(dict_list)

@app.route('/add_file_as_collection', methods=['POST', 'GET'])
def add_file_as_collection():
    file = request.files['file']
    (collection_name, dict_list) = convert_multi_doc_file_to_dict_list(file)
    put_docs_in_collection(build_data_collection_name(collection_name), dict_list)
    # current_user.add_collection(collection_name)
    return render_template('user_manage.html')

@app.route('/save_new_project', methods=['POST'])
def save_new_project():
    # data_dict = json.loads(request.args["the_data"])
    data_dict = request.json
    db[current_user.project_collection_name].insert_one(data_dict)
    return jsonify({"success": True, "message": "Project Successfully Saved"})

@app.route('/update_project', methods=['POST'])
def update_project():
    # data_dict = json.loads(request.args["the_data"])
    data_dict = request.json
    db[current_user.project_collection_name].update_one({"project_name": data_dict["project_name"]},
                                                        {'$set': data_dict})
    return jsonify({"success": True, "message": "Project Successfully Saved"})

@app.route('/delete_project/<project_name>')
def delete_project(project_name):
    db[current_user.project_collection_name].delete_one({"project_name": project_name})
    return render_template("project_list.html")

@app.route('/delete_collection/<collection_name>')
def delete_collection(collection_name):
    db.drop_collection(current_user.full_collection_name(collection_name))
    return render_template("collection_list.html")

@app.route('/main/<collection_name>', methods=['get'])
def main(collection_name):
    cname=build_data_collection_name(collection_name)
    return render_template("main.html", collection_name=cname, project_name='');

@app.route('/main_project/<project_name>', methods=['get'])
def main_project(project_name):
    project_dict = db[current_user.project_collection_name].find_one({"project_name": project_name})
    cname = project_dict["data_collection_name"]
    return render_template("main.html", collection_name=cname, project_name=project_name);

@app.route('/grab_data/<collection_name>', methods=['get'])
def grab_data(collection_name):
    return jsonify(build_data_dict(collection_name))

def build_data_dict(collection_name):
    row_list = []
    result = {}
    the_collection = db[collection_name]
    for r in the_collection.find():
        del r["_id"]
        row_list.append(r)
    result["the_rows"] = row_list
    result["collection_name"] = collection_name
    return result

@app.route('/grab_project_data/<project_name>', methods=['get'])
def grab_project_data(project_name):
    project_dict = db[current_user.project_collection_name].find_one({"project_name": project_name})
    data_collection_name = project_dict["data_collection_name"]
    result = build_data_dict(data_collection_name)
    result["header_struct"] = project_dict["header_struct"]
    result["hidden_list"] = project_dict["hidden_list"]
    return jsonify(result)

@app.route('/save_as_modal', methods=['get'])
def save_as_modal():
    return render_template("modals/save_as_modal.html")