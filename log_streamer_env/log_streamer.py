from gevent import monkey
monkey.patch_all()

import docker
import os
import flask_socketio
from flask_socketio import SocketIO
from rabbit_manage import MESSAGE_QUEUE_ADDRESS
socketio = SocketIO(message_queue=MESSAGE_QUEUE_ADDRESS)

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

def container_id(container):
    if "my_id" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["my_id"]
    else:
        return "system"

# def get_container(tactic_id):
#     conts = cli.containers.list(all=True)
#     for lcont in conts:
#         if container_id(lcont) == tactic_id:
#             return lcont
#     return None


def get_container(tactic_id):
    try:
        summaries = cli.api.containers(
            all=True,
            filters={"label": f"my_id={tactic_id}"}
        )
    except APIError:
        # If the Engine hiccups, treat as not found for callers that do cleanup
        return None

    if not summaries:
        return None

    # If you guarantee uniqueness of my_id, just grab the first match
    cid = summaries[0].get("Id")
    if not cid:
        return None

    # 2) Convert to a high-level Container with a guarded inspect
    try:
        return cli.containers.get(cid)   # this does a single inspect
    except NotFound:
        # It disappeared between list and get; that's fine—treat as not found
        return None

room = os.environ.get("ROOM")
cont_id = os.environ.get("CONT_ID")
my_id = os.environ.get("MY_ID")
cont = get_container(cont_id)

base_data = {"message": "updateLog", "container_id": cont_id}
if cont is not None:
    for line in cont.logs(stream=True, tail=0):
        # Shouldn't do anything here that will cause something to be entered in the log of a
        # container being streamed. That will give an infinite loop.
        base_data["new_line"] = line.decode()
        socketio.emit("searchable-console-message", base_data, namespace="/main", room=room)
else:
    print("cont was None")

socketio.emit("searchable-console-message", {"message": "streamerExited","container_id": cont_id},  namespace="/main", room=room)
print("exiting")