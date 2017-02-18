from flask import Flask, jsonify, request
import sys
import os
import logging
import Queue
import datetime
sys.stdout = sys.stderr

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

timeout_on_queue_full = .01

# stalled_container_time is the max time a tile can go without making any contact at all with the megaplex.
# A tile should be actively executing get_next task constantly. So this shouldn't happen unless the tile
# is in the middle of a very long computation.
stalled_container_time = 2 * 3600

# inactive_container_time is the max time a tile can
# go without making active contact with the megaplex. It can still be executiving get_next_task
# this is longer than stalled_container_time because it's plausible that the user could be working
# actively on a project for several hours and not doing much with one of the tiles.
inactive_container_time = 10 * 3600

# old_container_time is the max time a tile can exist after being created.
old_container_time = 3 * 24 * 3600

queue_dict = {}

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

container_registry = {}

app = Flask(__name__)

MAX_QUEUE_LENGTH = int(os.environ.get("MAX_QUEUE_LENGTH"))
print "max_queue_length is " + str(MAX_QUEUE_LENGTH)

@app.route('/')
def hello():
    return 'This is the megaplex communicating'


def dmsg(msg):
    timestring = datetime.datetime.today().strftime("%b %d, %Y, %H:%M")
    print timestring + ": " + msg
    # app.logger.debug(msg)
    return


@app.route('/register_container', methods=["get", "post"])
def register_container():
    data = request.json
    container_registry[data["container_id"]] = {
        "created": datetime.datetime.today(),
        "last_passive_contact": datetime.datetime.today(),
        "last_active_contact": datetime.datetime.today()
    }
    print "registered container_id {}".format(data["container_id"])
    return jsonify({"success": True})


@app.route('/deregister_container', methods=["get", "post"])
def deregister_container():
    data = request.json
    del container_registry[data["container_id"]]
    return jsonify({"success": True})


def get_stalled():
    current_time = datetime.datetime.today()
    stalled_containers = []
    for cont_id, info in container_registry.items():
        tdelta = current_time - info["last_passive_contact"]
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        if delta_seconds > stalled_container_time:
            stalled_containers.append(cont_id)
            del container_registry[cont_id]
    return stalled_containers

@app.route('/get_stalled_containers', methods=["get", "post"])
def get_stalled_containers():
    return jsonify({"stalled_containers": get_stalled()})

def get_inactive():
    current_time = datetime.datetime.today()
    inactive_containers = []
    for cont_id, info in container_registry.items():
        tdelta = current_time - info["last_active_contact"]
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        # dmsg("delta_seconds is {}".format(str(delta_seconds)))
        if delta_seconds > inactive_container_time:
            inactive_containers.append(cont_id)
            del container_registry[cont_id]
    return inactive_containers


@app.route('/get_inactive_containers', methods=["get", "post"])
def get_inactive_containers():
    return jsonify({"inactive_containers": get_inactive()})

def get_old():
    current_time = datetime.datetime.today()
    old_containers = []
    for cont_id, info in container_registry.items():
        tdelta = current_time - info["created"]
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        if delta_seconds > old_container_time:
            old_containers.append(cont_id)
            del container_registry[cont_id]
    return old_containers

@app.route('/get_old_containers', methods=["get", "post"])
def get_old_containers():
    return jsonify({"inactive_containers": get_old()})


@app.route('/get_old_inactive_stalled_containers', methods=["get", "post"])
def get_old_inactive_stalled_containers():
    res = get_inactive() + get_stalled() + get_old()
    return jsonify({"old_inactive_stalled_containers": res})


def update_last_passive_contact(container_id):
    if container_id in container_registry:
        container_registry[container_id]["last_passive_contact"] = datetime.datetime.today()


def update_last_active_contact(container_id):
    if container_id in container_registry:
        update_last_passive_contact(container_id)
        container_registry[container_id]["last_active_contact"] = datetime.datetime.today()


@app.route('/post_task', methods=["get", "post"])
def post_task():
    task_packet = request.json
    update_last_active_contact(task_packet["source"])
    # dmsg("post_task {0} to {1}".format(task_packet["task_type"], task_packet["dest"]))
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
    # dmsg("post_wait_task {0} to {1}".format(task_packet["task_type"], task_packet["dest"]))
    dest = task_packet["dest"]
    source = task_packet["source"]
    update_last_active_contact(source)
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
    update_last_passive_contact(source)
    result = queue_dict[source]["wait_dict"][cbid]
    if result is None:
        return jsonify({"success": False})
    else:
        del queue_dict[source]["wait_dict"][cbid]
        return jsonify({"success": True, "result": result})


@app.route('/get_next_task/<requester_id>', methods=["get", "post"])
def get_next_task(requester_id):
    # dmsg("got get_next_task request from " + str(requester_id))
    update_last_passive_contact(requester_id)
    if requester_id not in queue_dict:
        queue_dict[requester_id] = {"tasks": Queue.Queue(),
                                    "responses": Queue.Queue(),
                                    "wait_dict": {}}
        return jsonify({"empty": True})
    if not queue_dict[requester_id]["responses"].empty():
        task_packet = queue_dict[requester_id]["responses"].get()
        # dmsg("got response {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    if not queue_dict[requester_id]["tasks"].empty():
        task_packet = queue_dict[requester_id]["tasks"].get()
        # dmsg("got task {0} for {1}".format(task_packet["task_type"], requester_id))
        return jsonify(task_packet)
    return jsonify({"empty": True})


@app.route('/submit_response', methods=["get", "post"])
def submit_response():
    task_packet = request.json
    source = task_packet["source"]
    update_last_active_contact(source)
    if source not in queue_dict: # This shouldn't happen
        queue_dict[source] = {"tasks": Queue.Queue(),
                              "responses": Queue.Queue(),
                              "wait_dict": {}}
    # dmsg("submitting response {0} for {1}".format(task_packet["task_type"], source))
    cbid = task_packet["callback_id"]
    if cbid is not None and cbid in queue_dict[source]["wait_dict"]:
        queue_dict[source]["wait_dict"][cbid] = task_packet["response_data"]
    else:
        queue_dict[source]["responses"].put(task_packet)
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True)
