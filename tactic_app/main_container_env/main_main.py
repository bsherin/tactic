from flask import Flask, request, jsonify
from main import mainWindow
from bson.binary import Binary
import datetime
import cPickle
import pymongo
import sys
import copy

app = Flask(__name__)

mwindow = None


@app.route('/')
def hello():
    return 'This is mainwindow communicating'


@app.route('/initialize_mainwindow', methods=['POST'])
def initialize_mainwindow():
    app.logger.debug("entering intialize mainwindow")
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict)
    mwindow.start()
    return jsonify({"success": True})


@app.route('/initialize_project_mainwindow', methods=['POST'])
def initialize_project_mainwindow():
    app.logger.debug("entering intialize project mainwindow")
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict)
    mwindow.start()
    mwindow.post_task(data_dict["main_id"], "do_full_recreation", data_dict)
    return jsonify({"success": True})


def get_tile_property(tile_id, prop_name):
    res = mwindow.ask_tile(tile_id, "get_property/" + prop_name).json()
    return res["val"]


# todo work on reload. get_tile_poperty stuff get_property is just for this
@app.route('/reload_tile/<tile_id>', methods=["get", "post"])
def reload_tile(tile_id):
    def do_reload_tile(data_dict):
        try:
            mwindow.debug_log("entering do_reload_tile")
            module_code = data_dict["tile_code"]
            reload_dict = copy.copy(get_tile_property(tile_id, "current_reload_attrs"))
            saved_options = copy.copy(get_tile_property(tile_id, "current_options"))
            reload_dict.update(saved_options)
            mwindow.ask_tile(tile_id, "load_source", {"tile_code": module_code,
                                                      "megaplex_address": mwindow.megaplex_addres})
            result = mwindow.ask_tile(tile_id, "reinstantiate_tile", reload_dict).json()
            mwindow.generate_callback({"success": True, "html": result["form_html"], "jcallback_id": data_dict["jcallback_id"]})
        except Exception as ex:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
            error_string = template.format(type(ex).__name__, ex.args)
            mwindow.debug_lot("Error reloading tile " + error_string)
            mwindow.handle_exception("Error reloading tile " + error_string)
    ddict = request.json
    mwindow.post_with_function(do_reload_tile, ddict)
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)