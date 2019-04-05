from __future__ import print_function
import docker
import time
import os
import sys
import uuid
import datetime
from communication_utils import send_request_to_megaplex, post_task_noqworker
from communication_utils import USE_FORWARDER
import communication_utils
import subprocess
import re
from volume_manager import host_persist_dir
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print(os.environ)
MAX_QUEUE_LENGTH = 5000
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))


if "DEBUG_MAIN_CONTAINER" in os.environ:
    DEBUG_MAIN_CONTAINER = os.environ.get("DEBUG_MAIN_CONTAINER")
else:
    DEBUG_MAIN_CONTAINER = False

if "DEBUG_TILE_CONTAINER" in os.environ:
    DEBUG_TILE_CONTAINER = os.environ.get("DEBUG_TILE_CONTAINER")
else:
    DEBUG_TILE_CONTAINER = False


if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"


if "MONGO_URI" in os.environ:
    mongo_uri = os.environ.get("MONGO_URI")
else:
    # ip_info is only used as a step to getting the host_ip
    if USE_FORWARDER:  # This means we're working on the mac
        # I used to have en0 here. Now it seems to need to be en3
        ip_info = subprocess.check_output(['/usr/local/bin/ip', '-4', 'addr', 'show', 'en0'])
    else:
        ip_info = subprocess.check_output(['ip', '-4', 'addr', 'show', 'scope', 'global', 'dev', 'docker0'])

    host_ip = re.search("inet (.*?)/", ip_info).group(1)
    mongo_uri = "mongodb://{}:27017/{}".format(host_ip, db_name)


megaplex_address = None  # This is set in __init__.py
RETRIES = 60


cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

def get_my_address():
    res = subprocess.check_output(["hostname", "-i"]).decode()
    res = re.sub("\s", "", res)
    return res

# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][network_name]["IPAddress"]

class MainContainerTracker(object):
    def __init__(self):
        self.mc_dict = {}

    def create_main_container(self, other_name, user_id, username):
        main_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        user_host_persist_dir = host_persist_dir + "/tile_manager/" + username
        main_volume_dict[user_host_persist_dir] = {"bind": "/persist", "mode": "ro"}
        main_id, _container_id = create_container("tactic_main_image", network_mode="bridge",
                                                  owner=user_id, other_name=other_name, username=username,
                                                  volume_dict=main_volume_dict,
                                                  publish_all_ports=True, true_host_persist_dir=host_persist_dir)
        self.mc_dict[main_id] = {
            "address": get_address(_container_id, "bridge"),
            "container_id": _container_id,
            "port": self.extract_port(_container_id)
        }
        return main_id

    def delete_main(self, unique_id):
        if unique_id in self.mc_dict:
            del self.mc_dict[unique_id]
        return

    def port(self, unique_id):
        return self.mc_dict[unique_id]["port"]

    def extract_port(self, container_identifier):
        return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Ports"]["5000/tcp"]

    def address(self, unique_id):
        return self.mc_dict[unique_id]["address"]

    def get_container_id(self, unique_id):
        return self.mc_dict[unique_id]["container_id"]

    def is_main(self, unique_id):
        return unique_id in self.mc_dict

main_container_info = MainContainerTracker()

class ContainerCreateError(Exception):
    pass


cont_type_dict = {"megaplex_main:app": "megaplex",
                  "main_main:app": "main",
                  "tile_main:app": "tile",
                  "tile_main.py": "tile",
                  "main_main.py": "main",
                  "module_viewer_main.py": "module_viewer",
                  "module_viewer_main:app": "module_viewer"}


def get_container_type(cont):
    for arg in cont.attrs["Args"]:
        if arg in cont_type_dict:
            return cont_type_dict[arg]
    return


# noinspection PyUnusedLocal
def create_container(image_name, container_name=None, network_mode="bridge",
                     wait_until_running=True, owner="host", parent="host",
                     env_vars={}, port_bindings=None, wait_retries=50,
                     other_name="none", volume_dict=None, username=None,
                     detach=True, register_container=True, publish_all_ports=False,
                     main_address=None, true_host_persist_dir=None):
    unique_id = str(uuid.uuid4())
    environ = {"MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH,
               "RETRIES": RETRIES,
               "CHUNK_SIZE": CHUNK_SIZE,
               "STEP_SIZE": STEP_SIZE,
               "MEGAPLEX_ADDRESS": megaplex_address,
               "MY_ID": unique_id,
               "OWNER": owner,
               "PARENT": parent,
               "DB_NAME": db_name,
               "IMAGE_NAME": image_name,
               "MONGO_URI": mongo_uri,
               "DEBUG_MAIN_CONTAINER": DEBUG_MAIN_CONTAINER,
               "DEBUG_TILE_CONTAINER": DEBUG_TILE_CONTAINER,
               "PYTHONUNBUFFERED": "Yes",
               "TRUE_HOST_PERSIST_DIR": true_host_persist_dir}

    if username is not None:
        environ["USERNAME"] = username

    if not communication_utils.am_host:
        environ["MAIN_ADDRESS"] = get_my_address()
        print("got my address {}".format(environ["MAIN_ADDRESS"]))
    elif main_container_info.is_main(parent):
        environ["MAIN_ADDRESS"] = main_container_info.address(parent)

    if DEBUG_MAIN_CONTAINER or DEBUG_TILE_CONTAINER:
        environ["PYCHARM_DEBUG"] = True
        environ["GEVENT_SUPPORT"] = True

    for key, val in env_vars.items():
        environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name}

    if image_name == "tactic_tile_image":  # We don't want people to be able to see the mongo_uri
        del environ["MONGO_URI"]


    if container_name is None:
        container = cli.containers.run(image=image_name,
                                       network_mode="bridge",
                                       environment=environ,
                                       ports=port_bindings,
                                       detach=detach,
                                       labels=labels,
                                       volumes = volume_dict,
                                       publish_all_ports=publish_all_ports)
    else:
        container = cli.containers.run(image=image_name,
                                       name=container_name,
                                       network_mode="bridge",
                                       environment=environ,
                                       ports=port_bindings,
                                       detach=detach,
                                       labels=labels,
                                       volumes=volume_dict,
                                       publish_all_ports=publish_all_ports)
    cont_id = container.id
    container = cli.containers.get(cont_id)
    print("status " + str(container.status))

    retries = 0
    if wait_until_running:
        while not container.status == "running":
            retries += 1
            if retries > wait_retries:
                print("container failed to start")
                container.remove(force=True)
                raise ContainerCreateError("Error creating container with image name " + str(image_name))
            print("sleeping while waiting for container {} to run".format(str(cont_id)))
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


def container_memory_usage(container, convert_to_mib=True):
    try:
        musage = container.stats(stream=False)["memory_stats"]["usage"]
        if convert_to_mib:
            return 1.0 * musage / 1048576
        else:
            return musage
    except:
        return None


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


def container_exec(tactic_id, cmd):
    cont = get_container(tactic_id)
    cont.exec_run(cmd)
    return None


def restart_container(tactic_id):
    cont = get_container(tactic_id)
    cont.restart()
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


def destroy_container(tactic_id, notify=True):
    try:
        cont = get_container(tactic_id)
        message = None
        dest_id = None
        if cont is None:
            return -1
        else:
            cont_type = get_container_type(cont)
            send_request_to_megaplex("deregister_container", {"container_id": tactic_id})

            if notify:
                if cont_type == "main" or cont_type == "module_viewer":
                    message = "Underlying container has been destroyed. This window won't function now."
                    dest_id = tactic_id
                elif cont_type == "tile":
                    tile_name = container_other_name(cont)
                    dest_id = container_parent(cont)
                    message = "Container for tile {} has been destroyed".format(tile_name)
            cont.remove(force=True)
            if cont_type == "main":
                main_container_info.delete_main(tactic_id)
            if notify and message is not None:
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
