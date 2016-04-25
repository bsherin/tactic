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


def create_initial_metadata():
    mdata = {"datetime": datetime.datetime.today(),
             "updated": datetime.datetime.today(),
             "tags": "",
             "notes": ""}
    return mdata


@app.route('/update_project', methods=['POST'])
def update_project():
    def do_update_project(data_dict):
        app.logger.debug("entering update_project")
        # noinspection PyBroadException
        try:
            mwindow.hidden_columns_list = data_dict["hidden_columns_list"]
            mwindow.console_html = data_dict["console_html"]
            tspec_dict = data_dict["tablespec_dict"]
            for (dname, spec) in tspec_dict.items():
                mwindow.doc_dict[dname].table_spec = spec
            mwindow.loaded_modules = data_dict["users_loaded_modules"]
            project_dict = mwindow.compile_save_dict()
            pname = project_dict["project_name"]
            mwindow.mdata["updated"] = datetime.datetime.today()
            new_file_id = mwindow.fs.put(Binary(cPickle.dumps(project_dict)))
            save_dict = mwindow.db[data_dict["project_collection_name"]].find_one({"project_name": pname})
            mwindow.fs.delete(save_dict["file_id"])
            save_dict["project_name"] = pname
            save_dict["metadata"] = mwindow.mdata
            save_dict["file_id"] = new_file_id
            mwindow.db[data_dict["project_collection_name"]].update_one({"project_name": pname},
                                                                {'$set': save_dict})
            mwindow.mdata = save_dict["metadata"]
            return_data = {"project_name": pname,
                           "success": True,
                           "message": "Project Successfully Saved",
                           "jcallback_id": data_dict["jcallback_id"]}

        except:
            error_string = mwindow.handle_exception("Error saving project", print_to_console=False)
            return_data = {"success": False, "message": error_string, "jcallback_id": data_dict["jcallback_id"]}
        mwindow.generate_callback(return_data)
        return
    data = request.json
    mwindow.post_with_function(do_update_project, data)
    return jsonify({"success": True})


@app.route('/save_new_project', methods=['POST'])
def save_new_project():
    def do_save_new_project(data_dict):
        app.logger.debug("entering do_save_new_project")
        # noinspection PyBroadException
        try:
            mwindow.project_name = data_dict["project_name"]
            mwindow.hidden_columns_list = data_dict["hidden_columns_list"]
            mwindow.console_html = data_dict["console_html"]
            tspec_dict = data_dict["tablespec_dict"]
            for (dname, spec) in tspec_dict.items():
                mwindow.doc_dict[dname].table_spec = spec

            mwindow.loaded_modules = data_dict["users_loaded_modules"]
            project_dict = mwindow.compile_save_dict()
            app.logger.debug("got compiled project dict")
            app.logger.debug("length of tile_instances is: " + str(len(project_dict["tile_instances"])))
            save_dict = {}
            save_dict["metadata"] = create_initial_metadata()
            save_dict["project_name"] = project_dict["project_name"]
            save_dict["file_id"] = mwindow.fs.put(Binary(cPickle.dumps(project_dict)))
            mwindow.mdata = save_dict["metadata"]

            mwindow.db[data_dict["project_collection_name"]].insert_one(save_dict)
            return_data = {"project_name": data_dict["project_name"],
                           "success": True,
                           "message_string": "Project Successfully Saved",
                           "jcallback_id": data_dict["jcallback_id"]}

        except:
            error_string = mwindow.handle_exception("Error saving new project", print_to_console=False)
            return_data = {"success": False, "message_string": error_string, "jcallback_id": data_dict["jcallback_id"]}
        mwindow.generate_callback(return_data)
        return
    data = request.json
    mwindow.post_with_function(do_save_new_project, data)
    return jsonify({"success": True})


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
    tile_info_dict, loaded_modules = mwindow.recreate_from_save(data_dict["project_collection_name"], data_dict["project_name"])
    return jsonify({"success": True,
                    "tile_info_dict": tile_info_dict,
                    "loaded_modules": loaded_modules,
                    "doc_names": mwindow.doc_names,
                    "collection_name": mwindow.collection_name,
                    "short_collection_name": mwindow.short_collection_name,
                    "console_html": mwindow.console_html})


def get_tile_property(tile_id, prop_name):
    res = mwindow.ask_tile(tile_id, "get_property/" + prop_name).json()
    return res["val"]


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