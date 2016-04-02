from flask import Flask, request, jsonify
from main import mainWindow
from bson.binary import Binary
import datetime
import cPickle

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


@app.route('/save_new_project', methods=['POST'])
def save_new_project():
    data_dict = request.json
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
        save_dict = {}
        save_dict["metadata"] = create_initial_metadata()
        save_dict["project_name"] = project_dict["project_name"]
        save_dict["file_id"] = mwindow.fs.put(Binary(cPickle.dumps(project_dict)))
        mwindow.mdata = save_dict["metadata"]

        mwindow.db[data_dict["project_collection_name"]].insert_one(save_dict)

        return jsonify({"project_name": data_dict["project_name"],
                        "success": True,
                        "message": "Project Successfully Saved"})
    except:
        mwindow.handle_exception("Error saving new project")
        return jsonify({"success": False})


@app.route("/grab_data", methods=["GET", "POST"])
def grab_data():
    data_dict = request.json
    doc_name = data_dict["doc_name"]
    return jsonify({"doc_name": doc_name,
                    "is_shrunk": mwindow.is_shrunk,
                    "left_fraction": mwindow.left_fraction,
                    "data_rows": mwindow.doc_dict[doc_name].displayed_data_rows,
                    "background_colors":mwindow.doc_dict[doc_name].displayed_background_colors,
                    "header_list": mwindow.doc_dict[doc_name].header_list,
                    "is_last_chunk": mwindow.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": mwindow.doc_dict[doc_name].is_first_chunk,
                    "max_table_size": mwindow.doc_dict[doc_name].max_table_size})


@app.route('/grab_chunk_with_row', methods=['get', 'post'])
def grab_chunk_with_row():
    app.logger.debug("Entering grab chunk with row")
    data_dict = request.json
    doc_name = data_dict["doc_name"]
    row_id = data_dict["row_id"]
    mwindow.doc_dict[doc_name].move_to_row(row_id)
    return jsonify({"doc_name": doc_name,
                    "left_fraction": mwindow.left_fraction,
                    "is_shrunk": mwindow.is_shrunk,
                    "data_rows": mwindow.doc_dict[doc_name].displayed_data_rows,
                    "background_colors": mwindow.doc_dict[doc_name].displayed_background_colors,
                    "header_list": mwindow.doc_dict[doc_name].header_list,
                    "is_last_chunk": mwindow.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": mwindow.doc_dict[doc_name].is_first_chunk,
                    "max_table_size": mwindow.doc_dict[doc_name].max_table_size,
                    "actual_row": mwindow.doc_dict[doc_name].get_actual_row(row_id)})


@app.route('/grab_next_chunk', methods=['get', "post"])
def grab_next_chunk():
    app.logger.debug("entering grab next chunk")
    data_dict = request.json
    doc_name = data_dict["doc_name"]
    step_amount = mwindow.doc_dict[doc_name].advance_to_next_chunk()
    return jsonify({"doc_name": doc_name,
                    "data_rows": mwindow.doc_dict[doc_name].displayed_data_rows,
                    "background_colors": mwindow.doc_dict[doc_name].displayed_background_colors,
                    "header_list": mwindow.doc_dict[doc_name].header_list,
                    "is_last_chunk": mwindow.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": mwindow.doc_dict[doc_name].is_first_chunk,
                    "step_size": step_amount})


@app.route('/grab_previous_chunk', methods=['get', 'post'])
def grab_previous_chunk():
    app.logger.debug("entering grab previous chunk")
    data_dict = request.json
    doc_name = data_dict["doc_name"]
    app.logger.debug("doc_name is " + doc_name)
    step_amount = mwindow.doc_dict[doc_name].go_to_previous_chunk()
    return jsonify({"doc_name": doc_name,
                    "data_rows": mwindow.doc_dict[doc_name].displayed_data_rows,
                    "background_colors": mwindow.doc_dict[doc_name].displayed_background_colors,
                    "header_list": mwindow.doc_dict[doc_name].header_list,
                    "is_last_chunk": mwindow.doc_dict[doc_name].is_last_chunk,
                    "is_first_chunk": mwindow.doc_dict[doc_name].is_first_chunk,
                    "step_size": step_amount})


@app.route('/initialize_mainwindow', methods=['POST'])
def initialize_mainwindow():
    app.logger.debug("entering intialize mainwindow")
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict["collection_name"], data_dict["main_container_id"],
                         data_dict["host_address"], data_dict["loaded_user_modules"], data_dict["mongo_uri"])
    mwindow.start()
    return jsonify({"success": True})


@app.route('/distribute_events/<event_name>', methods=['get', 'post'])
def distribute_events_stub(event_name):
    data_dict = request.json

    # If necessary, have to convert the row_index on the client side to the row_id
    if (data_dict is not None) and ("active_row_index" in data_dict) and ("doc_name" in data_dict):
        if data_dict["active_row_index"] is not None:
            data_dict["active_row_index"] = mwindow.doc_dict[data_dict["doc_name"]].get_id_from_actual_row(data_dict["active_row_index"])
    if "tile_id" in request.json:
        tile_id = request.json["tile_id"]
    else:
        tile_id = None
    success = mwindow.distribute_event(event_name,  data_dict, tile_id)
    return jsonify({"success": success})


@app.route('/create_tile_instance', methods=["POST"])
def create_tile_instance():
    data_dict = request.json
    mwindow.create_tile_instance_in_mainwindow(data_dict["tile_container_address"], data_dict["main_container_id"],
                                               data_dict["host_address"],
                                               data_dict["tile_container_address"])

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)