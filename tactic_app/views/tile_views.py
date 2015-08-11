__author__ = 'bls910'

from flask import render_template, request, jsonify, make_response
from tactic_app import app, socketio
from tactic_app.shared_dicts import mainwindow_instances
from tactic_app.shared_dicts import tokenizer_dict


input_start_template = '<div class="form-group">' \
                 '<label>{0}</label>'
basic_input_template = '<input type="{1}" class="form-control" id="{0}" placeholder="{2}">' \
                 '</div>'
select_base_template = '<select class="form-control" id="{0}">'
select_option_template = '<option value="{0}">{0}</option>'

@app.route('/create_tile/<tile_type>', methods=['GET','POST'])
def create_tile(tile_type):
    main_id = request.json["main_id"]
    new_tile = mainwindow_instances[main_id].create_tile(tile_type)
    tile_id = new_tile.tile_id
    form_html = ""
    for option in new_tile.options:
        if option["type"] == "column_select":
            the_template = input_start_template + select_base_template
            form_html += the_template.format(option["name"])
            for choice in mainwindow_instances[main_id].ordered_sig_dict.keys():
                form_html += select_option_template.format(choice)
            form_html += '</select></div>'
        elif option["type"] == "tokenizer_select":
            the_template = input_start_template + select_base_template
            form_html += the_template.format(option["name"])
            for choice in tokenizer_dict.keys():
                form_html += select_option_template.format(choice)
            form_html += '</select></div>'
        else:
            the_template = input_start_template + basic_input_template
            form_html += the_template.format(option["name"], option["type"], option["placeholder"])
    result = render_template("tile.html", tile_id=tile_id,
                           tile_name=tile_type,
                           form_text=form_html)
    return jsonify({"html":result, "tile_id": tile_id})

@app.route('/submit_options/<tile_id>', methods=['GET', 'POST'])
def submit_options(tile_id):
    data_dict = request.json
    main_id = request.json["main_id"]
    mainwindow_instances[main_id].tile_instances[tile_id].post_event({"event_name": "UpdateOptions", "data": data_dict})
    return jsonify({"success": True})

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
            tile_instance.post_event({"event_name": event_name, "data": data_dict})
    return jsonify({"success": True})