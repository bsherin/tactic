__author__ = 'bls910'
from tactic_app import app, db
from flask import render_template, request, jsonify
from file_handling import convert_multi_doc_file_to_dict_list, put_docs_in_collection
from flask_login import current_user


@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/user_manage')
def user_manage():
    return render_template('user_manage.html')

@app.route('/add_file_as_collection', methods=['POST', 'GET'])
def add_file_as_collection():
    file = request.files['file']
    (collection_name, dict_list) = convert_multi_doc_file_to_dict_list(file)
    put_docs_in_collection(collection_name, dict_list)
    current_user.add_collection(collection_name)
    return render_template('user_manage.html')

@app.route('/main/<collection_name>', methods=['get', 'post'])
def main(collection_name):
    return render_template("main.html", collection_name=collection_name)

@app.route('/grab_data/<collection_name>', methods=['get', 'post'])
def grab_data(collection_name):
    row_list = []
    result = {}
    the_collection = db[collection_name]
    for r in the_collection.find():
        del r["_id"]
        row_list.append(r)
    result["the_rows"] = row_list
    result["collection_name"] = collection_name
    return jsonify(result)