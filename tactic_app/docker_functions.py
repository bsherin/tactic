
import docker
import time
import requests
import os
import sys
import uuid
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print os.environ
SHORT_SLEEP_PERIOD = float(os.environ.get("SHORT_SLEEP_PERIOD"))
LONG_SLEEP_PERIOD = float(os.environ.get("LONG_SLEEP_PERIOD"))
MAX_QUEUE_LENGTH = int(os.environ.get("MAX_QUEUE_LENGTH"))
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))

megaplex_address = None

if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60

# multiple_worker_issue global variables here


cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][network_name]["IPAddress"]


def create_container(image_name, container_name=None, network_mode="bridge",
                     wait_until_running=True, owner="host", parent="host",
                     env_vars={}, port_bindings=None, wait_retries=50,
                     detach=True):
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

    # if port_bindings is None:
    #     host_config = cli.create_host_config(network_mode=network_mode)
    # else:
    #     host_config = cli.create_host_config(network_mode=network_mode, port_bindings=port_bindings)
    if container_name is None:
        container = cli.containers.run(image=image_name,
                                         network_mode="bridge",
                                         environment=environ,
                                         ports=port_bindings,
                                         detach=detach,
                                         )
    else:
        container = cli.containers.run(image=image_name,
                                    name=container_name,
                                    network_mode="bridge",
                                    environment=environ,
                                    ports=port_bindings,
                                    detach=detach,
                                )
    container_id = container.id
    # container.start()
    container = cli.containers.get(container_id)
    print "status " + str(container.status)

    # tactic_change create_container can now return -1
    retries = 0
    if wait_until_running:
        while not container.status == "running":
            retries += 1
            if retries > wait_retries:
                print "container failed to start"
                return -1
            print "sleeping while waiting for container {} to run".format(str(container_id))
            time.sleep(0.1)
    return unique_id, container_id

def container_owner(container):
    if "OWNER" in container.attrs["Config"]["Env"]:
        return container.attrs["Config"]["Env"]["OWNER"]
    else:
        return "system"

def create_network(network_name):
    return cli.create_network(network_name, "bridge")


def remove_network(network_name):
    return cli.remove_network(network_name)


def destroy_container(cname):
    try:
        result = cli.containers.get(cname).remove(force=True)
    except:
        return -1


def destroy_user_containers(owner_id):
    for cont in cli.containers.list():
        if container_owner(cont) == owner_id:
            destroy_container(cont.id)

def connect_to_network(container, network):
    return cli.connect_container_to_network(container, network)
