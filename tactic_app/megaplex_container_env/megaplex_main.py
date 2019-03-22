from flask import Flask, jsonify, request
import sys
import logging
import datetime

sys.stdout = sys.stderr
from megaplex_task_manager import TaskManager

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

container_registry = {}

app = Flask(__name__)


@app.route('/hello', methods=["get", "post"])
def hello():
    return 'This is the megaplex communicating'


@app.route('/register_container', methods=["get", "post"])
def register_container():
    data = request.json
    container_registry[data["container_id"]] = {
        "created": datetime.datetime.utcnow(),
        "last_passive_contact": datetime.datetime.utcnow(),
        "last_active_contact": datetime.datetime.utcnow()
    }
    print("registered container_id {}".format(data["container_id"]))
    return jsonify({"success": True})


@app.route('/deregister_container', methods=["get", "post"])
def deregister_container():
    data = request.json
    del container_registry[data["container_id"]]
    if data["container_id"] in queue_dict:
        del queue_dict[data["container_id"]]
    return jsonify({"success": True})


def get_stalled():
    current_time = datetime.datetime.utcnow()
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
    current_time = datetime.datetime.utcnow()
    inactive_containers = []
    for cont_id, info in container_registry.items():
        tdelta = current_time - info["last_active_contact"]
        delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
        if delta_seconds > inactive_container_time:
            inactive_containers.append(cont_id)
            del container_registry[cont_id]
    return inactive_containers


@app.route('/get_inactive_containers', methods=["get", "post"])
def get_inactive_containers():
    return jsonify({"inactive_containers": get_inactive()})


def get_old():
    current_time = datetime.datetime.utcnow()
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
    for tmanager in queue_dict.values():
        print(tmanager.get_data_string())
    print("checking for old and stalled containers")
    res = get_inactive() + get_stalled() + get_old()
    return jsonify({"old_inactive_stalled_containers": res})


def update_last_passive_contact(container_id):
    if container_id in container_registry:
        container_registry[container_id]["last_passive_contact"] = datetime.datetime.utcnow()


def update_last_active_contact(container_id):
    if container_id in container_registry:
        update_last_passive_contact(container_id)
        container_registry[container_id]["last_active_contact"] = datetime.datetime.utcnow()


@app.route('/post_task', methods=["get", "post"])
def post_task():
    task_packet = request.json
    return post_the_task(task_packet)


def post_task_local(task_packet):
    with app.app_context():
        return post_the_task(task_packet)


def post_the_task(task_packet):
    dest = task_packet["dest"]
    source = task_packet["source"]
    update_last_active_contact(source)

    if dest not in queue_dict:
        queue_dict[dest] = TaskManager(dest, queue_dict)
    if source not in queue_dict:
        queue_dict[source] = TaskManager(source, queue_dict)

    result = queue_dict[dest].post_task(task_packet)
    if result["success"]:
        if task_packet["expiration"] is not None:
            queue_dict[source].record_expiration_task(task_packet)
    return jsonify(result)


@app.route('/post_wait_task', methods=["get", "post"])
def post_wait_task():
    task_packet = request.json
    return post_the_wait_task(task_packet)


def post_wait_task_local(task_packet):
    with app.app_context():
        return post_the_wait_task(task_packet)


def post_the_wait_task(task_packet):
    dest = task_packet["dest"]
    source = task_packet["source"]
    update_last_active_contact(source)

    if dest not in queue_dict:
        queue_dict[dest] = TaskManager(dest, queue_dict)

    if source not in queue_dict:
        queue_dict[source] = TaskManager(source, queue_dict)

    queue_dict[source].add_wait_task(task_packet["callback_id"])
    return jsonify(queue_dict[dest].post_task(task_packet))


@app.route("/check_wait_task", methods=["get", "post"])
def check_wait_task():
    task_packet = request.json
    return do_the_check_wait_task(task_packet)


def check_wait_task_local(task_packet):
    with app.app_context():
        return do_the_check_wait_task(task_packet)


def do_the_check_wait_task(task_packet):
    cbid = task_packet["callback_id"]
    source = task_packet["source"]
    update_last_passive_contact(source)
    return queue_dict[source].check_wait_task_result(cbid)


@app.route('/get_next_task/<requester_id>', methods=["get", "post"])
def get_next_task(requester_id):
    update_last_passive_contact(requester_id)

    if requester_id not in queue_dict:
        queue_dict[requester_id] = TaskManager(requester_id, queue_dict)
        return jsonify({"empty": True})
    else:
        return queue_dict[requester_id].get_next_task()


def get_next_task_local(requester_id):
    with app.app_context():
        return get_next_task(requester_id)

# possible response statuses are:
# submitted_response: response was submtitted with no error
# response_submitted_with_error: Response was submitted but with success: False
# unanswered: The task was claimed by the destbut no answer submitted
# unclaimed: The task was never claimed by the dest


@app.route('/submit_response', methods=["get", "post"])
def submit_response():
    task_packet = request.json
    return submit_response_local(task_packet)


def submit_response_local(task_packet):
    source = task_packet["source"]
    update_last_active_contact(task_packet["dest"])
    if source not in queue_dict:  # This shouldn't happen
        queue_dict[source] = TaskManager(source, queue_dict)
    rdata = task_packet["response_data"]
    if rdata and isinstance(rdata, dict) and "success" in rdata and not rdata["success"]:
        task_packet["status"] = "submitted_response_with_error"
    else:
        task_packet["status"] = "submitted_response"
    return queue_dict[source].got_response(task_packet)
