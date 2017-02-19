
import docker
import time
import os
import sys
import uuid
from communication_utils import send_request_to_megaplex
from qworker import SHORT_SLEEP_PERIOD, LONG_SLEEP_PERIOD
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr


print os.environ
MAX_QUEUE_LENGTH = 5000
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))


megaplex_address = None


if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60


cli = docker.DockerClient(base_url='unix://var/run/docker.sock')


# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][network_name]["IPAddress"]


def create_container(image_name, container_name=None, network_mode="bridge",
                     wait_until_running=True, owner="host", parent="host",
                     env_vars={}, port_bindings=None, wait_retries=50,
                     detach=True, register_container=True):
    unique_id = str(uuid.uuid4())
    environ = {"SHORT_SLEEP_PERIOD": SHORT_SLEEP_PERIOD,
               "LONG_SLEEP_PERIOD": LONG_SLEEP_PERIOD,
               "MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH,
               "RETRIES": RETRIES,
               "CHUNK_SIZE": CHUNK_SIZE,
               "STEP_SIZE": STEP_SIZE,
               "MEGAPLEX_ADDRESS": megaplex_address,
               "MY_ID": unique_id,
               "OWNER": owner,
               "PARENT": parent}
    for key, val in env_vars.items():
        environ[key] = val


    labels = {"my_id": unique_id, "owner": owner, "parent": parent}

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
                                       detach=detach)
    container_id = container.id
    container = cli.containers.get(container_id)
    print "status " + str(container.status)

    # tactic_change create_container can now return -1
    retries = 0
    if wait_until_running:
        while not container.status == "running":
            retries += 1
            if retries > wait_retries:
                print "container failed to start"
                container.remove(force=True)
                return -1
            print "sleeping while waiting for container {} to run".format(str(container_id))
            time.sleep(0.1)
    if register_container:
        send_request_to_megaplex("register_container", {"container_id": unique_id})
    return unique_id, container_id


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

def get_log(tactic_id):
    cont = get_container(tactic_id)
    return cont.logs()

def destroy_container(tactic_id):
    try:
        cont = get_container(tactic_id)
        if cont is None:
            return -1
        else:
            cont.remove(force=True)
            send_request_to_megaplex("deregister_container", {"container_id": tactic_id})
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
