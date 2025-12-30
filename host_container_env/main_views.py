import io
import json
import functools
import uuid
import base64

from flask import request, jsonify, render_template, send_file, url_for, redirect, g
from flask_login import current_user, login_required
from flask_socketio import join_room, disconnect
from tactic_app import app, socketio, csrf
from communication_utils import debinarize_python_object
from utils import utcnow
import tactic_app
from tactic_logging import log, bind_request, new_task_id

def socket_event(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        task_id = new_task_id()
        task_stage = "handling_socket_event"
        task_type = fn.__name__

        with bind_request(task_id, task_stage, task_type):
            log.info(
                "socket_event",
            )
            return fn(*args, **kwargs)
    return wrapper

tstring = utcnow().strftime("%Y-%H-%M-%S")

def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            disconnect()
            return None
        else:
            return f(*args, **kwargs)
    return wrapped

# The main window should join a room associated with the user
@socketio.on('connect', namespace='/main')
@authenticated_only
@socket_event
def connected_msg():
    log.info("client connected", username=current_user.username)


@socketio.on('disconnect', namespace='/main')
@authenticated_only
@socket_event
def disconnect_msg():
    log.info("client disconnected", username=current_user.username)


@socketio.on('disconnect', namespace='/test')
@authenticated_only
@socket_event
def test_disconnect():
    log.info('client disconnected')


# noinspection PyUnusedLocal
@socketio.on('join-repository', namespace='/main')
@authenticated_only
@socket_event
def on_join_repository(data):
    join_room("repository-events")
    log.info("user joined", room="repository-events")
    return

@socketio.on('join', namespace='/main')
@authenticated_only
@socket_event
def on_join(data):
    room = data["room"]
    join_room(room)
    socketio.emit("room-joined", data, namespace='/main', room=room)
    log.info("user joined", room=room)
    if "user_id" in data:
        room = data["user_id"]
        join_room(room)
        socketio.emit("room-joined", data, namespace='/main', room=room)
        log.info("user joined", room=room)
    return True


@app.route('/delete_container_on_unload', methods=["POST"])
@login_required
@csrf.exempt
def delete_container_on_unload():
    data = request.json
    tactic_app.host_worker.delete_container(data)
    return jsonify({"success": True})


@app.route('/remove_mainwindow', methods=["POST"])
@login_required
@csrf.exempt
def remove_mainwindow():
    try:
        data = json.loads(request.data)
        data["sid"] = data["local_id"]
        tactic_app.host_worker.post_task("main_service", "end_main_session_task", data)
    except Exception:
        log.exception("Error in remove_mainwindow")
    return


@app.route('/post_from_client', methods=["GET", "POST"])
@login_required
def post_from_client():
    task_packet = request.json
    with bind_request(g.task_id, "preforward", task_packet["task_type"]):
        log.info("post_from_client", task_type=task_packet["task_type"], username=current_user.username)
        tactic_app.host_worker.forward_client_post(task_packet)
    return jsonify({"success": True})


@socketio.on('ready-to-begin', namespace='/main')
@authenticated_only
def on_ready_to_begin(data):
    socketio.emit("begin-post-load", data, namespace='/main', room=data["room"])


@app.route('/load_temp_page/<the_id>', methods=['get', 'post'])
@login_required
def load_temp_page(the_id):
    template_data = current_user.read_temp_data(the_id)

    if "type" in template_data:
        match template_data["type"]:
            case "collection_download":
                current_user.delete_temp_data(the_id)
                return redirect(url_for('download_collection',
                                        collection_name=template_data["collection_name"],
                                        new_name=template_data["file_name"]))
            case "data_download":
                mem = io.BytesIO()
                mem.write(template_data["the_data"].encode())
                mem.seek(0)
                current_user.delete_temp_data(the_id)
                return send_file(mem,
                                 download_name=template_data["file_name"],
                                 as_attachment=True)

            case "temp_collection_download":
                return redirect(url_for('download_temp_collection',
                                download_name=template_data["file_name"],
                                temp_id=the_id))

    if "the_html" in template_data:
        return template_data["the_html"]
    else:
        return render_template(template_data["template_name"], **template_data)


# This isn't done with a task because of some slight trickiness
# because we're dealing with a blob.
@app.route("/print_blob_area_to_console", methods=['get', 'post'])
@login_required
def print_blob_area_to_console():
    from tactic_app import socketio
    bytes_object = request.files['image'].read()
    base_64_str = base64.b64encode(bytes_object).decode('utf-8')
    local_id = request.form["local_id"]
    unique_id = str(uuid.uuid4())
    data = {"message": {"unique_id": unique_id,
                        "type": "figure",
                        "am_shrunk": False,
                        "search_string": None,
                        "summary_text": "pasted image",
                        "image_data_str": "data:image/png;base64, " + base_64_str}, "console_message": "consoleLog",
            "local_id": local_id}
    socketio.emit("console-message", data, namespace='/main', room=local_id)
    return jsonify({"success": True})


@app.route('/export_data', methods=['POST'])
@login_required
def export_data():
    def export_success(result):
        if result["success"]:
            socketio.emit('show-status-msg', result, namespace='/main', room=result["user_id"])
        else:
            tactic_app.host_worker.add_error_drawer_entry_task(result)
        return
    data_dict = request.json
    export_name = data_dict['export_name']
    tactic_app.host_worker.post_task(data_dict["local_id"], "export_data",
                                     {"export_name": export_name},
                                     export_success)
    return jsonify({"success": True})


## *** Warning: the post_and_wait here is very problematic ***
@app.route('/figure_source/<tile_id>/<figure_name>', methods=['GET', 'POST'])
@login_required
def figure_source(tile_id, figure_name):
    figure_response = tactic_app.host_worker.post_and_wait(tile_id, "get_image", {"figure_name": figure_name})
    img = debinarize_python_object(figure_response["img"])
    # img = cPickle.loads(encoded_img.decode("utf-8", "ignore").encode("ascii"))
    img_file = io.BytesIO()
    img_file.write(img)
    img_file.seek(0)
    return send_file(img_file, mimetype='image/png')
