
import docker
import time
import os
import sys
import uuid
import datetime
from communication_utils import send_request_to_megaplex, post_task_noqworker
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr


print os.environ
MAX_QUEUE_LENGTH = 5000
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))


megaplex_address = None  # This is set in __init__.py

if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60


cli = docker.DockerClient(base_url='unix://var/run/docker.sock')


# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][network_name]["IPAddress"]


class ContainerCreateError(Exception):
    pass

cont_type_dict = {"megaplex_main:app":"megaplex",
                  "tile_main.py": "tile",
                  "main_main.py": "main",
                  "module_viewer_main.py": "module_viewer"}

def get_container_type(cont):
    for arg in cont.attrs["Args"]:
        if arg in cont_type_dict:
            return cont_type_dict[arg]
    return

def create_container(image_name, container_name=None, network_mode="bridge",
                     wait_until_running=True, owner="host", parent="host",
                     env_vars={}, port_bindings=None, wait_retries=50,
                     other_name="none",
                     detach=True, register_container=True):
    unique_id = str(uuid.uuid4())
    environ = {"MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH,
               "RETRIES": RETRIES,
               "CHUNK_SIZE": CHUNK_SIZE,
               "STEP_SIZE": STEP_SIZE,
               "MEGAPLEX_ADDRESS": megaplex_address,
               "MY_ID": unique_id,
               "OWNER": owner,
               "PARENT": parent}
    for key, val in env_vars.items():
        environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name}

    if container_name is None:
        container = cli.containers.run(image=image_name,
                                       network_mode="bridge",
                                       environment=environ,
                                       ports=port_bindings,
                                       detach=detach,
                                       labels=labels)
    else:
        container = cli.containers.run(image=image_name,
                                       name=container_name,
                                       network_mode="bridge",
                                       environment=environ,
                                       ports=port_bindings,
                                       detach=detach,
                                       labels=labels)
    cont_id = container.id
    container = cli.containers.get(cont_id)
    print "status " + str(container.status)

    retries = 0
    if wait_until_running:
        while not container.status == "running":
            retries += 1
            if retries > wait_retries:
                print "container failed to start"
                container.remove(force=True)
                raise ContainerCreateError("Error creating container with image name " + str(image_name))
            print "sleeping while waiting for container {} to run".format(str(cont_id))
            time.sleep(0.1)
    if register_container:
        send_request_to_megaplex("register_container", {"container_id": unique_id})
    return unique_id, cont_id


def container_owner(container):
    if "owner" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["owner"]
    else:
        return "system"


def container_parent(container):
    if "parent" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["parent"]
    else:
        return "system"


def container_other_name(container):
    if "other_name" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["other_name"]
    else:
        return "name"


def container_id(container):
    if "my_id" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["my_id"]
    else:
        return "system"


def create_network(network_name):
    return cli.create_network(network_name, "bridge")


def remove_network(network_name):
    return cli.remove_network(network_name)


def get_container(tactic_id):
    conts = cli.containers.list()
    for cont in conts:
        if container_id(cont) == tactic_id:
            return cont
    return None


def get_id_from_name_and_parent(cont_name, parent_id):
    conts = cli.containers.list()
    for cont in conts:
        if (container_parent(cont) == parent_id) and (container_other_name(cont) == cont_name):
            return container_id(cont)
    return None


def get_log(tactic_id):
    cont = get_container(tactic_id)
    return cont.logs()


def destroy_container(tactic_id):
    try:
        cont = get_container(tactic_id)
        message = None
        dest_id = None
        if cont is None:
            return -1
        else:
            cont_type = get_container_type(cont)
            send_request_to_megaplex("deregister_container", {"container_id": tactic_id})
            if cont_type == "main" or cont_type == "module_viewer":
                message = "Underlying container has been destroyed. This window won't function now."
                dest_id = tactic_id
            elif cont_type == "tile":
                tile_name = container_other_name(cont)
                dest_id = container_parent(cont)
                message = "Container for tile {} has been destroyed".format(tile_name)
            cont.remove(force=True)
            if message is not None:
                data = {"message": message, "alert_type": "alert-warning", "main_id": dest_id}
                post_task_noqworker("host", "host", "flash_to_main", data)
            return
    except:
        return -1


def destroy_user_containers(owner_id):
    for cont in cli.containers.list():
        if container_owner(cont) == owner_id:
            uid = container_id(cont)
            destroy_container(uid)


def destroy_child_containers(parent_id):
    for cont in cli.containers.list():
        if container_parent(cont) == parent_id:
            uid = container_id(cont)
            destroy_container(uid)


def connect_to_network(container, network):
    return cli.connect_container_to_network(container, network)
