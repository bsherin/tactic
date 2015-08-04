__author__ = 'bls910'

from flask import render_template, request, jsonify, make_response
from tactic_app import app, socketio
from tactic_app.main import mainwindow_instances

@app.route('/create_tile/<tile_type>', methods=['GET','POST'])
def create_tile(tile_type):
    main_id = request.json["main_id"]
    new_tile = mainwindow_instances[main_id].create_tile(tile_type)
    tile_id = new_tile.tile_id
    tile_body = new_tile.render_content()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_type,
                           tile_data=tile_body,
                           field_list = new_tile.options)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/submit_options/<tile_id>', methods=['GET', 'POST'])
def submit_options(tile_id):
    data_dict = request.json
    main_id = request.json["main_id"]
    mainwindow_instances[main_id].tile_instances[tile_id].update_options(data_dict)
    return jsonify({
        "html": mainwindow_instances[main_id].tile_instances[tile_id].render_content(),
        "tile_id": tile_id
    })

@app.route('/get_tile_content/<tile_id>', methods=['GET', 'POST'])
def get_tile_content(tile_id):
    main_id = request.json["main_id"]
    return jsonify({
        "html":mainwindow_instances[main_id ].tile_instances[tile_id].render_content(),
        "tile_id": tile_id
    })

@app.route('/tile_relevant_event/<event_name>', methods=['get', 'post'])
def tile_relevant_event(event_name):
    data_dict = request.json
    main_id = request.json["main_id"]
    for tile_id, tile_instance in mainwindow_instances[main_id].tile_instances.items():
        if event_name in tile_instance.update_events:
            tile_instance.handle_event(event_name, data_dict)
    return jsonify({"success": True})