__author__ = 'bls910'

from flask import render_template, request, jsonify
from flask_login import current_user
from tactic_app import app
from tactic_app.shared_dicts import mainwindow_instances
from tactic_app.shared_dicts import tokenizer_dict


@app.route('/create_tile_request/<tile_type>', methods=['GET','POST'])
def create_tile_request(tile_type):
    main_id = request.json["main_id"]
    new_tile = mainwindow_instances[main_id].create_tile_instance_in_mainwindow(tile_type)
    tile_id = new_tile.tile_id
    form_html = new_tile.create_form_html()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_type,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/create_tile_from_save_request/<tile_id>', methods=['GET','POST'])
def create_tile_from_save_request(tile_id):
    main_id = request.json["main_id"]
    tile_instance = mainwindow_instances[main_id].tile_instances[tile_id]
    form_html = tile_instance.create_form_html()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_instance.tile_type,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/submit_options/<tile_id>', methods=['GET', 'POST'])
def submit_options(tile_id):
    data_dict = request.json
    main_id = request.json["main_id"]
    mainwindow_instances[main_id].tile_instances[tile_id].post_event({"event_name": "UpdateOptions", "data": data_dict})
    return jsonify({"success": True})

@app.route('/refreshtile_event_request/<tile_id>', methods=['GET', 'POST'])
def refreshtile_event_request(tile_id):
    main_id = request.json["main_id"]
    mainwindow_instances[main_id ].tile_instances[tile_id].post_event("StartSpinner")
    mainwindow_instances[main_id ].tile_instances[tile_id].post_event("RefreshTile")
    mainwindow_instances[main_id ].tile_instances[tile_id].post_event("StopSpinner")
    return jsonify({"success": True})


@app.route('/refreshtilefromsave_event_request/<tile_id>', methods=['GET', 'POST'])
def refreshtilefromsave_event_request(tile_id):
    main_id = request.json["main_id"]
    mainwindow_instances[main_id ].tile_instances[tile_id].post_event("RefreshTileFromSave")
    return jsonify({"success": True})

@app.route('/remove_tile/<tile_id>', methods=['POST'])
def remove_tile(tile_id):
    main_id = request.json["main_id"]
    mainwindow_instances[main_id].post_event({"event_name": "RemoveTile", "data": tile_id})
    return jsonify({"success": True})
