from flask import Flask, jsonify, request
import sys
import copy
import cPickle
from bson.binary import Binary
import Queue
import os
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

timeout_on_queue_full = .01

queue_dict = {}
address_dict = {}

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

app = Flask(__name__)

MAX_QUEUE_LENGTH = int(os.environ.get("MAX_QUEUE_LENGTH"))

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
        queue_dict[dest] = {"tasks": Queue.Queue(maxsize=MAX_QUEUE_LENGTH),
                            "responses": Queue.Queue(),
                            "wait_dict": {}}

    try:
        queue_dict[dest]["tasks"].put(task_packet, block=True, timeout=timeout_on_queue_full)
    except Queue.Full:
        dmsg("Queue was full. Couldn't post task")
        return jsonify({"success": False, "message": "Megaplex task queue is full"})
    return jsonify({"success": True})


@app.route('/post_wait_task', methods=["get", "post"])
def post_wait_task():
    task_packet = request.json
    dmsg("post_wait_task {0} to {1}".format(task_packet["task_type"], task_packet["dest"]))
    dest = task_packet["dest"]
    source = task_packet["source"]
    if dest not in queue_dict:
        queue_dict[dest] = {"tasks": Queue.Queue(maxsize=MAX_QUEUE_LENGTH),
                            "responses": Queue.Queue(),
                            "wait_dict": {}}
    if source not in queue_dict:
        queue_dict[source] = {"tasks": Queue.Queue(maxsize=MAX_QUEUE_LENGTH),
                              "responses": Queue.Queue(),
                              "wait_dict": {}}
    queue_dict[source]["wait_dict"][task_packet["callback_id"]] = None
    try:
        queue_dict[dest]["tasks"].put(task_packet, block=True, timeout=timeout_on_queue_full)
    except Queue.Full:
        dmsg("Queue was full. Couldn't post task")
        return jsonify({"success": False, "message": "Megaplex task queue is full"})
    return jsonify({"success": True})


@app.route("/check_wait_task", methods=["get", "post"])
def check_wait_task():
    task_packet = request.json
    cbid = task_packet["callback_id"]
    source = task_packet["source"]
    result = queue_dict[source]["wait_dict"][cbid]
    if result is None:
        return jsonify({"success": False})
    else:
        del queue_dict[source]["wait_dict"][cbid]
        return jsonify({"success": True, "result": result})


@app.route('/get_next_task/<requester_id>', methods=["get", "post"])
def get_next_task(requester_id):
    if requester_id not in queue_dict:
        queue_dict[requester_id] = {"tasks": Queue.Queue(),
                                    "responses": Queue.Queue(),
                                    "wait_dict": {}}
        return jsonify({"empty": True})
    if not queue_dict[requester_id]["responses"].empty():
        task_packet = queue_dict[requester_id]["responses"].get()
        dmsg("got response {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    if not queue_dict[requester_id]["tasks"].empty():
        task_packet = queue_dict[requester_id]["tasks"].get()
        dmsg("got task {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    return jsonify({"empty": True})


@app.route('/submit_response', methods=["get", "post"])
def submit_response():
    task_packet = request.json
    source = task_packet["source"]
    if source not in queue_dict: # This shouldn't happen
        queue_dict[source] = {"tasks": Queue.Queue(),
                              "responses": Queue.Queue(),
                              "wait_dict": {}}
    dmsg("submitting response {0} for {1}".format(task_packet["task_type"], source))
    cbid = task_packet["callback_id"]
    if cbid is not None and cbid in queue_dict[source]["wait_dict"]:
        queue_dict[source]["wait_dict"][cbid] = task_packet["response_data"]
    else:
        queue_dict[source]["responses"].put(task_packet)
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
