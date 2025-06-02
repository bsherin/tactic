from gevent import monkey
monkey.patch_all()

import docker
import os
import flask_socketio
from flask_socketio import SocketIO
socketio = SocketIO(message_queue="megaplex")

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

def container_id(container):
    if "my_id" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["my_id"]
    else:
        return "system"

def get_container(tactic_id):
    conts = cli.containers.list(all=True)
    for lcont in conts:
        if container_id(lcont) == tactic_id:
            return lcont
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

print("exiting")