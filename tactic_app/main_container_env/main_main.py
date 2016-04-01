from flask import Flask, request, jsonify
from main import mainWindow

app = Flask(__name__)

mwindow = None


@app.route('/')
def hello():
    return 'This is the provider communicating'


@app.route('/initialize_mainwindow', methods=['POST'])
def initialize_mainwindow():
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict["collection_name"], data_dict["main_container_id"],
                         data_dict["host_address"], data_dict["loaded_user_modules"])
    mwindow.start()
    return mwindow.doc_names


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