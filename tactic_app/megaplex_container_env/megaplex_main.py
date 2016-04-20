from flask import Flask, jsonify, request
import sys
import copy
import cPickle
from bson.binary import Binary
import Queue

queue_dict = {}
address_dict = {}

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

app = Flask(__name__)


@app.route('/')
def hello():
    return 'This is the megaplex communicating'


def dmsg(msg):
    app.logger.debug(msg)
    return


@app.route('/add_address', methods=["get", "post"])
def add_address():
    data = request.json
    dmsg("Adding address for " + data["container_id"])
    address_dict[data["container_id"]] = data["address"]
    return jsonify({"success": True})


@app.route('/post_task', methods=["get", "post"])
def post_task():
    task_packet = request.json
    dmsg("post_task {0} to {1}".format(task_packet["task_type"], task_packet["dest"]))
    dest = task_packet["dest"]
    if dest not in queue_dict:
        queue_dict[dest] = {"tasks": Queue.Queue(),
                            "responses": Queue.Queue()}

    queue_dict[dest]["tasks"].put(task_packet)
    return jsonify({"success": True})


@app.route('/get_next_task/<requester_id>', methods=["get", "post"])
def get_next_task(requester_id):
    if requester_id not in queue_dict:
        queue_dict[requester_id] = {"tasks": Queue.Queue(),
                                    "responses": Queue.Queue()}
        return jsonify({"empty": True})
    if not queue_dict[requester_id]["responses"].empty():
        task_packet = queue_dict[requester_id]["responses"].get()
        dmsg("got task {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    if not queue_dict[requester_id]["tasks"].empty():
        task_packet = queue_dict[requester_id]["tasks"].get()
        dmsg("got response {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    return jsonify({"empty": True})


@app.route('/submit_response', methods=["get", "post"])
def submit_respone():
    task_packet = request.json
    source = task_packet["source"]
    if source not in queue_dict: # This shouldn't happen
        queue_dict[source] = {"tasks": Queue.Queue(),
                              "responses": Queue.Queue()}
    dmsg("submitting response {0} for {1}".format(task_packet["task_type"], source))
    queue_dict[source]["responses"].put(task_packet)
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)