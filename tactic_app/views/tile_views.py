__author__ = 'bls910'

from flask.ext.wtf import Form
from flask import render_template, request, jsonify, make_response
from tactic_app import app
from tactic_app.tiles import tile_classes, tile_instances
from auth_views import LoginForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField

@app.route('/create_tile/<tile_type>', methods=['GET','POST'])
def create_tile(tile_type):
    new_tile = tile_classes[tile_type]()
    tile_id = new_tile.tile_id
    tile_instances[tile_id] = new_tile
    tile_body = new_tile.render_content()
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_type,
                           tile_data=tile_body,
                           field_list = new_tile.options)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/submit_options/<tile_id>', methods=['GET', 'POST'])
def submit_options(tile_id):
    data_dict = request.json
    tile_instances[tile_id].update_options(data_dict)
    return jsonify({
        "html": tile_instances[tile_id].render_content(),
        "tile_id": tile_id
    })

