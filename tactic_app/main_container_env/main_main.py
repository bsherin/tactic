from flask import Flask, request, jsonify
from main import mainWindow

app = Flask(__name__)

mwindow = None


@app.route('/')
def hello():
    return 'This is mainwindow communicating'


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
def grab_previous_chunk(main_id, doc_name):
    data_dict = request.json
    doc_name = data_dict["doc_name"]
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