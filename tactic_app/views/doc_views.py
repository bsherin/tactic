
from flask import render_template, request, jsonify
from tactic_app import app, db, socketio, use_ssl
from flask_login import login_required
from flask_socketio import join_room

@app.route("/doc_manager")
def doc_manager():
    return render_template("doc_editor.html", use_ssl=str(use_ssl))

def render_doc_list():
    doc_names = []
    for doc in db["documentation"].find():
        doc_names.append(doc["name"])
    return render_template("user_manage/doc_list.html", doc_names=doc_names)

@app.route('/request_update_doc_list', methods=['GET'])
def request_update_doc_list():
    return render_doc_list()


@app.route('/get_doc_markdown/<doc_name>', methods=['get'])
def get_doc_markdown(doc_name):
    mdown = db["documentation"].find({"name": doc_name}).next()["text"]
    return jsonify({"success": True, "doc_text": mdown})

@app.route('/save_doc', methods=['get', 'post'])
def save_doc():
    doc_name = request.json['res_name']
    doc_markdown = request.json['doc_markdown']
    db["documentation"].update_one({"name": doc_name}, {'$set': {"text": doc_markdown}})
    return jsonify({"success": True, "message": "Documentation updated."})

@app.route('/new_doc', methods=['get', 'post'])
def new_doc():
    doc_name = request.json['new_res_name']
    db["documentation"].insert_one({"name": doc_name, "text": ""})
    socketio.emit('update-doc-list', {"html": render_doc_list()}, namespace='/doc_manage')
    return jsonify({"success": True, "message": "Documentation created."})

@app.route('/delete_doc/<doc_name>', methods=['post'])
def delete_doc(doc_name):
    db["documentation"].delete_one({"name": doc_name})
    socketio.emit('update-doc-list', {"html": render_doc_list()}, namespace='/doc_manage')
    return jsonify({"success": True})


@socketio.on('connect', namespace='/doc_manage')
@login_required
def doc_connected_msg():
    print"client connected to doc manage"

@socketio.on('join', namespace='/doc_manage')
@login_required
def on_join(data):
    room=data["user_id"]
    join_room(room)
    print "user joined room " + room