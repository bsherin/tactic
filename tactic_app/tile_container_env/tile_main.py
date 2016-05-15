from flask import Flask, jsonify, request
import sys
import copy
import tile_env
from tile_env import class_info
from tile_env import exec_tile_code
import cPickle
from bson.binary import Binary
import inspect
import gevent

app = Flask(__name__)

tile_instance = None

megaplex_address = None


@app.route('/')
def hello():
    return 'This is the provider communicating'

def handle_exception(ex, special_string=None):
    if special_string is None:
        template = "An exception of type {0} occured. Arguments:\n{1!r}"
    else:
        template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
    error_string = template.format(type(ex).__name__, ex.args)
    error_string = "<pre>" + error_string + "</pre>"
    return jsonify({"success": False, "message_string": error_string})


@app.route('/load_source', methods=["get", "post"])
def load_source():
    try:
        global megaplex_address
        app.logger.debug("entering load_source")
        data_dict = request.json
        megaplex_address = data_dict["megaplex_address"]
        tile_code = data_dict["tile_code"]
        result = exec_tile_code(tile_code)
    except Exception as ex:
        return handle_exception(ex, "Error loading source")
    return jsonify(result)


@app.route("/recreate_from_save", methods=["get", "post"])
def recreate_from_save():
    try:
        app.logger.debug("entering recreate_from_save. class_name is " + class_info["class_name"])
        global tile_instance
        data = copy.copy(request.json)
        tile_instance = class_info["tile_class"](data["main_id"], data["tile_id"],
                                                 data["tile_name"])
        tile_instance.init_qworker(app, megaplex_address)
        tile_instance.recreate_from_save(data)
        tile_instance.current_html = tile_instance.current_html.replace(data["base_figure_url"],
                                                                        data["new_base_figure_url"])
        tile_instance.base_figure_url = data["new_base_figure_url"]
        tile_instance.start()
        app.logger.debug("tile instance started")
    except Exception as ex:
        return handle_exception(ex, "Error loading source")
    return jsonify({"success": True,
                    "is_shrunk": tile_instance.is_shrunk,
                    "saved_size": tile_instance.full_tile_height,
                    "exports": tile_instance.exports,
                    "tile_name": tile_instance.tile_name})


@app.route('/get_image/<figure_name>', methods=["get", "post"])
def get_image(figure_name):
    try:
        encoded_img = Binary(cPickle.dumps(tile_instance.img_dict[figure_name]))
        return jsonify({"success": True, "img": encoded_img})
    except Exception as ex:
        return handle_exception(ex, "Error loading source")

@app.route('/kill_me', methods=["get", "post"])
def kill_me():
    gevent.kill(tile_instance)
    return


@app.route('/reinstantiate_tile', methods=["get", "post"])
def reinstantiate_tile():
    try:
        app.logger.debug("entering reinstantiate_tile_class")
        global tile_instance
        gevent.kill(tile_instance)
        reload_dict = copy.copy(request.json)
        tile_instance = class_info["tile_class"](reload_dict["main_id"], reload_dict["my_id"],
                                                 reload_dict["tile_name"])
        tile_instance.init_qworker(app, megaplex_address)
        for (attr, val) in reload_dict.items():
            setattr(tile_instance, attr, val)
        tile_instance.start()
        form_html = tile_instance.create_form_html(reload_dict["form_info"])["form_html"]
        app.logger.debug("leaving reinstantiate_tile_class")
        return jsonify({"success": True, "form_html": form_html})
    except Exception as ex:
        return handle_exception(ex, "Error reinstantiating tile")


@app.route('/instantiate_tile_class', methods=["get", "post"])
def instantiate_tile_class():
    try:
        app.logger.debug("entering instantiate_tile_class")
        global tile_instance
        data = copy.copy(request.json)
        tile_instance = class_info["tile_class"](data["main_id"], data["tile_id"],
                                   data["tile_name"])
        tile_instance.init_qworker(app, megaplex_address)
        tile_instance.user_id = data["user_id"]
        tile_instance.base_figure_url = data["base_figure_url"]
        data["exports"] = tile_instance.exports
        tile_instance.start()
        app.logger.debug("leaving instantiate_tile_class")
        data["success"] = True
        return jsonify(data)
    except Exception as ex:
        return handle_exception(ex, "Error instantiating tile class")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True)