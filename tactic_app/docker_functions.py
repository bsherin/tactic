from __future__ import print_function
import docker
import time
import os
import sys
import uuid
import datetime
import subprocess
import re
import pika
from rabbit_manage import get_queues
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print(os.environ)
MAX_QUEUE_LENGTH = 5000
# CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
# STEP_SIZE = int(os.environ.get("STEP_SIZE"))

CHUNK_SIZE = 100
STEP_SIZE = 50

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

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')


# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    new_network_name = "tactic-net"
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][new_network_name]["IPAddress"]


if "MONGO_URI" in os.environ:  # This should be true except in launch_tactic
    mongo_uri = os.environ.get("MONGO_URI")
else:
    # ip_info is only used as a step to getting the host_ip
    if ("USE_FORWARDER" in os.environ) and (os.environ.get("USE_FORWARDER") == "True"):  # This means we're working on the mac
        # I used to have en0 here. Now it seems to need to be en3
        ip_info = subprocess.check_output(['/usr/local/bin/ip', '-4', 'addr', 'show', 'en0'])
    else:
        ip_info = subprocess.check_output(['ip', '-4', 'addr', 'show', 'scope', 'global', 'dev', 'docker0'])

    host_ip = re.search("inet (.*?)/", ip_info).group(1)
    mongo_uri = "mongodb://{}:27017/{}".format(host_ip, db_name)

_develop = ("DEVELOP" in os.environ) and (os.environ.get("DEVELOP") == "True")

RETRIES = 60


# noinspection PyTypeChecker
def get_my_address():
    res = subprocess.check_output(["hostname", "-i"]).decode()
    res = re.sub(r"\s", r"", res)
    return res


if "TRUE_HOST_PERSIST_DIR" in os.environ:
    true_host_persist_dir = os.environ.get("TRUE_HOST_PERSIST_DIR")
else:
    true_host_persist_dir = None

if "TRUE_HOST_NLTK_DATA_DIR" in os.environ:
    true_host_nltk_data_dir = os.environ.get("TRUE_HOST_NLTK_DATA_DIR")
else:
    true_host_nltk_data_dir = None


class MainContainerTracker(object):
    def __init__(self):
        self.mc_dict = {}

    def create_main_container(self, other_name, user_id, username):
        main_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        user_host_persist_dir = true_host_persist_dir + "/tile_manager/" + username
        main_volume_dict[user_host_persist_dir] = {"bind": "/code/persist", "mode": "ro"}
        environ = {"USE_WAIT_TASKS": "True"}
        main_id, _container_id = create_container("tactic_main_image", network_mode="bridge",
                                                  env_vars=environ,
                                                  owner=user_id, other_name=other_name, username=username,
                                                  volume_dict=main_volume_dict,
                                                  publish_all_ports=True,
                                                  local_true_host_persist_dir=true_host_persist_dir,
                                                  local_true_host_nltk_data_dir=true_host_nltk_data_dir)
        self.mc_dict[main_id] = {
            "address": get_address(_container_id, "bridge"),
            "container_id": _container_id
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
def create_container(image_name, container_name=None, network_mode="bridge", host_name="none",
                     wait_until_running=True, owner="host", parent="host",
                     env_vars=None, port_bindings=None, wait_retries=50,
                     other_name="none", volume_dict=None, username=None,
                     detach=True, register_container=True, publish_all_ports=False,
                     local_true_host_persist_dir=None,
                     local_true_host_nltk_data_dir=None, special_unique_id=None):
    print("in create_container")
    if env_vars is None:
        env_vars = {}
    if special_unique_id is not None:
        unique_id = special_unique_id
    else:
        unique_id = str(uuid.uuid4())
    environ = {"MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH,
               "RETRIES": RETRIES,
               "CHUNK_SIZE": CHUNK_SIZE,
               "STEP_SIZE": STEP_SIZE,
               "MY_ID": unique_id,
               "OWNER": owner,
               "PARENT": parent,
               "DB_NAME": db_name,
               "IMAGE_NAME": image_name,
               "MONGO_URI": mongo_uri,
               "DEVELOP": _develop,
               "DEBUG_MAIN_CONTAINER": DEBUG_MAIN_CONTAINER,
               "DEBUG_TILE_CONTAINER": DEBUG_TILE_CONTAINER,
               "PYTHONUNBUFFERED": "Yes",
               "TRUE_HOST_PERSIST_DIR": local_true_host_persist_dir,
               "TRUE_HOST_NLTK_DATA_DIR": local_true_host_nltk_data_dir}

    if username is not None:
        environ["USERNAME"] = username

    if DEBUG_MAIN_CONTAINER or DEBUG_TILE_CONTAINER:
        environ["PYCHARM_DEBUG"] = True
        environ["GEVENT_SUPPORT"] = True

    for key, val in env_vars.items():
        environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name}

    if image_name == "tactic_tile_image":  # We don't want people to be able to see the mongo_uri
        del environ["MONGO_URI"]

    run_args = {
        "image": image_name,
        "environment": environ,
        "ports": port_bindings,
        "detach": detach,
        "labels": labels,
        "volumes": volume_dict,
        "network": "tactic-net",
        "publish_all_ports": publish_all_ports
    }

    if container_name is not None:
        run_args["name"] = container_name
    if host_name is not None:
        run_args["hostname"] = host_name

    print("about to run the container")
    container = cli.containers.run(**run_args)
    print("ran the container")

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
    # if register_container:
    #     send_request_to_megaplex("register_container", {"container_id": unique_id})
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
    conts = cli.containers.list(all=True)
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


def container_status(tactic_id):
    cont = get_container(tactic_id)
    return cont.status


def wait_until_stopped(tactic_id, wait_retries=30):
    print("in wait_until_stopped")
    container = get_container(tactic_id)
    retries = 0
    print("container.status is {}".format(container.status))
    while container.status == "running":
        container = get_container(tactic_id)
        retries += 1
        if retries > wait_retries:
            print("container failed to stop")
            return
        time.sleep(0.1)
    print("leaving wait_until_stopped")
    return


def wait_until_running(tactic_id, wait_retries=30):
    print("in wait_until_running")
    container = get_container(tactic_id)
    retries = 0
    print("container.status is {}".format(container.status))
    while not container.status == "running":
        retries += 1
        if retries > wait_retries:
            print("container failed to start")
            return
        print("sleeping while waiting for container to run")
        time.sleep(0.1)
    print("in wait_until_running")
    return


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
            # send_request_to_megaplex("deregister_container", {"container_id": tactic_id})

            if notify:
                if cont_type == "main" or cont_type == "module_viewer":
                    message = "Underlying container has been destroyed. This window won't function now."
                    dest_id = tactic_id
                elif cont_type == "tile":
                    tile_name = container_other_name(cont)
                    dest_id = container_parent(cont)
                    message = "Container for tile {} has been destroyed".format(tile_name)
            cont.remove(force=True)
            delete_list_of_queues([tactic_id, tactic_id + "_wait"])
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


def delete_all_queues(use_localhost=False):
    delete_list_of_queues(get_queues(), use_localhost)
    return


def delete_one_queue(tactic_id):
    taddress = get_address("megaplex", "bridge")
    params = pika.ConnectionParameters(
        host=taddress,
        port=5672,
        virtual_host='/'
    )
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_delete(queue=tactic_id)
    connection.close()


def delete_list_of_queues(qlist, use_localhost=False):
    if use_localhost:
        params = pika.ConnectionParameters('localhost')
    else:
        taddress = get_address("megaplex", "bridge")
        params = pika.ConnectionParameters(
            host=taddress,
            port=5672,
            virtual_host='/'
        )
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    for q in qlist:
        try:
            channel.queue_delete(queue=q)
        except:
            print("problem deleting a queue")
    connection.close()


def post_task_noqworker(source_id, dest_id, task_type, task_data=None):
    new_packet = {"source": source_id,
                  "callback_type": "no_callback",
                  "status": "presend",
                  "dest": dest_id,
                  "task_type": task_type,
                  "task_data": task_data,
                  "response_data": None,
                  "callback_id": None,
                  "reply_to": None,
                  "expiration": None}
    # result = send_request_to_megaplex("post_task", new_packet).json()
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
    channel.basic_publish(exchange='',
                          routing_key=dest_id,
                          properties=pika.BasicProperties(
                              reply_to=None,
                              correlation_id=None,
                              delivery_mode=1
                          ),
                          body=json.dumps(new_packet))
    connection.close()
    return result
