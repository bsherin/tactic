import cPickle
import cStringIO
import datetime
import sys
import copy
import requests

import openpyxl
from bson.binary import Binary
from flask import request, jsonify, render_template, send_file, url_for
from flask_login import current_user, login_required
from flask_socketio import join_room
from tactic_app import app, db, fs, socketio
from tactic_app.shared_dicts import mainwindow_instances, get_tile_code
from tactic_app.shared_dicts import tile_classes, user_tiles, loaded_user_modules
from user_manage_views import project_manager, collection_manager
from tactic_app.docker_functions import create_container
from tactic_app.docker_functions import get_address, callbacks, destroy_container
from tactic_app.communication_utils import send_request_to_container
from tactic_app.users import load_user
from tactic_app import host_worker, client_worker, megaplex_address
from docker_functions import send_direct_request_to_container


# The main window should join a room associated with the user
@socketio.on('connect', namespace='/main')
def connected_msg():
    print"client connected"


@socketio.on('join', namespace='/main')
def on_join(data):
    room = data["room"]
    join_room(room)

    print "user joined room " + room


@socketio.on('ready-to-finish', namespace='/main')
def on_ready_to_finish(data):
    socketio.emit("finish-post-load", data, namespace='/main', room=data["room"])


@app.route('/post_from_client', methods=["GET", "POST"])
@login_required
def post_from_client():
    task_packet = request.json
    client_worker.forward_client_post(task_packet)
    return jsonify({"success": True})


@app.route('/get_menu_template', methods=['get'])
@login_required
def get_menu_template():
    return send_file("templates/menu_template.html")


@app.route('/get_table_templates', methods=['get'])
@login_required
def get_table_templates():
    return send_file("templates/table_templates.html")


def set_mainwindow_property(main_id, prop_name, prop_value):
    host_worker.post_task(main_id, "set_property", {"property": prop_name, "val": prop_value})
    return


def get_mainwindow_property(main_id, prop_name, callback):
    host_worker.post_task(main_id, "get_property", {"property": prop_name}, callback)
    return


@app.route('/remove_mainwindow/<main_id>', methods=['get', 'post'])
@login_required
def remove_mainwindow(main_id):
    def do_the_destroys(result):
        tile_ids = result["tile_ids"]
        for tile_id in tile_ids:
            destroy_container(tile_id)
        destroy_container(main_id)
    host_worker.post_task(main_id, "get_tile_ids", {}, do_the_destroys)
    return jsonify({"success": True})


# todo work on saving
@app.route('/save_new_project', methods=['POST'])
@login_required
def save_new_project():
    data_dict = request.json
    data_dict["users_loaded_modules"] = loaded_user_modules[current_user.username]
    data_dict["project_collection_name"] = current_user.project_collection_name
    result = send_request_to_container(data_dict["main_id"], "save_new_project", data_dict)
    project_manager.update_selector_list()
    return jsonify(result.json())


@app.route('/update_project', methods=['POST'])
@login_required
def update_project():
    data_dict = request.json
    data_dict["users_loaded_modules"] = loaded_user_modules[current_user.username]
    data_dict["project_collection_name"] = current_user.project_collection_name
    result = send_request_to_container(data_dict["main_id"], "update_project", data_dict)
    project_manager.update_selector_list()
    return jsonify(result.json())


# todo various exporting and downloading
@app.route('/export_data', methods=['POST'])
@login_required
def export_data():
    data_dict = request.json
    doc_dict = get_mainwindow_property(data_dict["main_id"], "doc_dict")
    full_collection_name = current_user.build_data_collection_name(data_dict['export_name'])
    for docinfo in doc_dict.values():
        db[full_collection_name].insert_one({"name": docinfo.name,
                                             "data_rows": docinfo.data_rows,
                                             "header_list": docinfo.header_list})
    collection_manager.update_selector_list()
    return jsonify({"success": True, "message": "Data Successfully Exported"})


@app.route('/download_table/<main_id>/<new_name>', methods=['GET', 'POST'])
@login_required
def download_table(main_id, new_name):
    mw = mainwindow_instances[main_id]
    doc_info = mw.doc_dict[mw.visible_doc_name]
    data_rows = doc_info.all_sorted_data_rows
    header_list = doc_info.header_list
    str_io = cStringIO.StringIO()
    for header in header_list[:-1]:
        str_io.write(str(header) + ',')
    str_io.write(str(header_list[-1]) + '\n')
    for row in data_rows:
        for header in header_list[:-1]:
            str_io.write(str(row[header]) + ",")
        str_io.write(str(row[header_list[-1]]) + '\n')
    str_io.seek(0)
    return send_file(str_io,
                     attachment_filename=new_name,
                     as_attachment=True)


@app.route('/download_collection/<main_id>/<new_name>', methods=['GET', 'POST'])
@login_required
def download_collection(main_id, new_name):
    mw = mainwindow_instances[main_id]
    wb = openpyxl.Workbook()
    first = True
    for (doc_name, doc_info) in mw.doc_dict.items():
        if first:
            ws = wb.active
            ws.title = doc_name
            first = False
        else:
            ws = wb.create_sheet(title=doc_name)
        data_rows = doc_info.all_sorted_data_rows
        header_list = doc_info.header_list
        for c, header in enumerate(header_list, start=1):
            _ = ws.cell(row=1, column=c, value=header)
        for r, row in enumerate(data_rows, start=2):
            for c, header in enumerate(header_list, start=1):
                _ = ws.cell(row=r, column=c, value=row[header])
    # noinspection PyUnresolvedReferences
    virtual_notebook = openpyxl.writer.excel.save_virtual_workbook(wb)
    str_io = cStringIO.StringIO()
    str_io.write(virtual_notebook)
    str_io.seek(0)
    return send_file(str_io,
                     attachment_filename=new_name,
                     as_attachment=True)


@app.route('/figure_source/<tile_id>/<figure_name>', methods=['GET', 'POST'])
@login_required
def figure_source(tile_id, figure_name):
    encoded_img = send_direct_request_to_container(tile_id, "get_image/" + figure_name, {}).json()["img"]
    img = cPickle.loads(encoded_img.decode("utf-8", "ignore").encode("ascii"))
    img_file = cStringIO.StringIO()
    img_file.write(img)
    img_file.seek(0)
    return send_file(img_file, mimetype='image/png')


# todo deal with data_source, part of base_data_url, create_data_source
@app.route('/data_source/<main_id>/<tile_id>/<data_name>', methods=['GET'])
@login_required
def data_source(main_id, tile_id, data_name):
    try:
        the_data = mainwindow_instances[main_id].tile_instances[tile_id].data_dict[data_name]
        return jsonify({"success": True, "data": the_data})
    except:
        error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        mainwindow_instances[main_id].handle_exception("Error getting data " + error_string)
        return jsonify({"success": False})


# todo reload_tiles
@app.route('/reload_tile/<tile_id>', methods=['GET', 'POST'])
@login_required
def reload_tile(tile_id):
    main_id = request.json["main_id"]
    tile_type = send_request_to_container(tile_id, "get_property/tile_type", {}).json()["val"]
    module_code = get_tile_code(tile_type)
    send_request_to_container(main_id, "reload_tile/" + tile_id ,
                              {"tile_code": module_code,
                               "jcallback_id": request.json["jcallback_id"]})
    return jsonify({"success": False})


@app.route('/create_tile_from_save_request/<tile_id>', methods=['GET', 'POST'])
@login_required
def create_tile_from_save_request(tile_id):
    main_id = request.json["main_id"]
    tile_save_result = send_request_to_container(main_id, "get_saved_tile_info/" + tile_id, {}).json()
    tile_save_result["tile_id"] = tile_id # a little silly that I need to do that but requies less changes this way
    return jsonify(tile_save_result)


# todo project loading
@app.route('/grab_project_data/<main_id>/<doc_name>', methods=['get'])
@login_required
def grab_project_data(main_id, doc_name):
    data_dict = {"doc_name": doc_name}
    result = send_request_to_container(main_id, "grab_project_data", data_dict)
    return jsonify(result.json())