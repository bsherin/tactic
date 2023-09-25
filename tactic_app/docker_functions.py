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
import json
forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print(os.environ)

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
mongo_uri = os.environ.get("MONGO_URI")
_develop = ("DEVELOP" in os.environ) and (os.environ.get("DEVELOP") == "True")
RETRIES = os.environ.get("RETRIES")
tactic_image_names = ["bsherin/tactic:tile", "bsherin/tactic:main",
                      "bsherin/tactic:module_viewer", "bsherin/tactic:host"
                      ]

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

print("in docker_functions with use_arm64 " + str(os.environ.get("USE_ARM64")))
if "USE_ARM64" in os.environ:
    USE_ARM64 = os.environ.get("USE_ARM64") == "True" or os.environ.get("USE_ARM64") is True
else:
    USE_ARM64 = False

print("got use_arm64 is " + str(USE_ARM64))

cli = docker.DockerClient(base_url='unix://var/run/docker.sock')


# Note that get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    new_network_name = "tactic-net"
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][new_network_name]["IPAddress"]


from rabbit_manage import get_queues


# noinspection PyTypeChecker
def get_my_address():
    res = subprocess.check_output(["hostname", "-i"]).decode()
    res = re.sub(r"\s", r"", res)
    return res

def env_or_none(var):
    return os.environ.get(var) if var in os.environ else None

true_host_persist_dir = env_or_none("TRUE_HOST_PERSIST_DIR")
true_host_resources_dir = env_or_none("TRUE_HOST_RESOURCES_DIR")
true_host_pool_dir = env_or_none("TRUE_HOST_POOL_DIR")
true_user_host_pool_dir = env_or_none("TRUE_USER_HOST_POOL_DIR")


def get_user_pool_dir(username):
    if true_host_pool_dir is None or username not in os.listdir("/pool"):
        return None
    else:
        return f"{true_host_pool_dir}/{username}"

streaming_workers = {}

class MainContainerTracker(object):

    def create_main_container(self, other_name, user_id, username):
        main_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        user_host_persist_dir = true_host_persist_dir + "/tile_manager/" + username
        main_volume_dict[user_host_persist_dir] = {"bind": "/code/persist", "mode": "ro"}
        main_volume_dict[true_host_pool_dir] = {"bind": "/pool", "mode": "rw"}
        rb_id = str(uuid.uuid4())
        environ = {
            "USE_WAIT_TASKS": "True",
            "RB_ID": rb_id,
            "TRUE_HOST_PERSIST_DIR": true_host_persist_dir,
            "TRUE_HOST_RESOURCES_DIR": true_host_resources_dir,
            "TRUE_HOST_POOL_DIR": true_host_pool_dir,
            "TRUE_USER_HOST_POOL_DIR": get_user_pool_dir(username)
        }

        if "USE_REMOTE_DATABASE" in os.environ:
            environ["USE_REMOTE_DATABASE"] = os.environ.get("USE_REMOTE_DATABASE")
            environ["REMOTE_KEY_FILE"] = os.environ.get("REMOTE_KEY_FILE")
            environ["REMOTE_USERNAME"] = os.environ.get("REMOTE_USERNAME")
            main_volume_dict[environ["REMOTE_KEY_FILE"]] = {"bind": environ["REMOTE_KEY_FILE"], "mode": "ro"}
        main_id, _container_id = create_container("bsherin/tactic:main", network_mode="bridge",
                                                  env_vars=environ,
                                                  owner=user_id, other_name=other_name, username=username,
                                                  volume_dict=main_volume_dict,
                                                  publish_all_ports=True
                                                  )

        return main_id, rb_id

    def extract_port(self, container_identifier):
        return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Ports"]["5000/tcp"]


main_container_info = MainContainerTracker()


class ContainerCreateError(Exception):
    pass


class LogStreamer(object):

    def __init__(self, socketio):
        self.socketio = socketio

    def background_log_lines(self, cont_id, room, base_data, event_name):
        cont = get_container(cont_id)
        for line in cont.logs(stream=True, tail=0):
            # Shouldn't do anything here that will cause something to be entered in the log of a
            # container being streamed. That will give an infinite loop.
            base_data["new_line"] = line.decode()
            self.socketio.emit(event_name, base_data, namespace="/main", room=room)
        return


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
                     restart_policy=None, special_unique_id=None):

    if special_unique_id is not None:
        unique_id = special_unique_id
    else:
        unique_id = str(uuid.uuid4())
    environ = {"RETRIES": RETRIES,
               "CHUNK_SIZE": CHUNK_SIZE,
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
               "USE_ARM64": USE_ARM64,
               }

    if username is not None:
        environ["USERNAME"] = username

    if DEBUG_MAIN_CONTAINER or DEBUG_TILE_CONTAINER:
        environ["PYCHARM_DEBUG"] = True
        environ["GEVENT_SUPPORT"] = True

    if env_vars is not None:
        for key, val in env_vars.items():
            environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name}

    if image_name == "bsherin/tactic:tile":  # We don't want people to be able to see the mongo_uri
        del environ["MONGO_URI"]

    print("in create container with image_name " + image_name)
    print("USE_ARM64 is " + str(USE_ARM64))
    if USE_ARM64 and image_name in tactic_image_names:
        image_name += "-arm64"
        print("changed image name to " + image_name)

    run_args = {
        "image": image_name,
        "environment": environ,
        "ports": port_bindings,
        "detach": detach,
        "labels": labels,
        "init": True,
        "volumes": volume_dict,
        "network": "tactic-net",
        "publish_all_ports": publish_all_ports
    }

    print("got run args")

    if container_name is not None:
        run_args["name"] = container_name
    if host_name is not None:
        run_args["hostname"] = host_name

    if restart_policy is not None:
        run_args["restart_policy"] = restart_policy

    print("about to run with run args " + str(run_args))
    container = cli.containers.run(**run_args)
    print("did the run")

    cont_id = container.id
    container = cli.containers.get(cont_id)
    print("got container")
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
        print("posting register_container to the host with id {}".format(unique_id))
        post_task_noqworker("host", "host", "register_container", {"container_id": unique_id})
    print("leaving create_container")
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


def container_image(container):
    return container.attrs["Config"]["Image"]


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


def container_names():
    cs = cli.containers.list()
    cnames = [c.name for c in cs]
    return cnames


def container_exists(name):
    return name in container_names()


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


def get_log(tactic_id, since=None):

    cont = get_container(tactic_id)
    if since is not None:
        return cont.logs(since=since)
    else:
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
            post_task_noqworker("host", "host", "deregister_container", {"container_id": tactic_id})

            if notify:
                if cont_type == "main" or cont_type == "module_viewer":
                    other_name = container_other_name(cont)
                    message = "Underlying container for {} has been destroyed".format(other_name)
                elif cont_type == "tile":
                    tile_name = container_other_name(cont)
                    message = "Container for tile {} has been destroyed".format(tile_name)
            cont.remove(force=True)
            cont_list = [tactic_id, tactic_id + "_wait"]
            if cont_type == "tile":
                cont_list.append("kill_" + tactic_id)
            delete_list_of_queues(cont_list)
            if tactic_id in streaming_workers:
                thread = streaming_workers[container_id]
                thread.kill()
                del streaming_workers[container_id]
            if notify and message is not None:
                data = {"message": message,
                        "alert_type": "alert-warning",
                        "timeout": -1,
                        "user_id": container_owner(cont)}
                post_task_noqworker("host", "host", "flash_to_user", data)
            return
    except:
        return -1


def destroy_user_containers(owner_id, notify=True):
    for cont in cli.containers.list():
        if container_owner(cont) == owner_id:
            uid = container_id(cont)
            destroy_container(uid, notify)


def get_matching_user_containers(owner_id, image_name, other_name):
    matches = []
    for cont in cli.containers.list():
        if container_owner(cont) == owner_id and container_image(cont) == image_name and \
                container_other_name(cont) == other_name:
            matches.append(container_id(cont))
    return matches


def destroy_child_containers(parent_id):
    for cont in cli.containers.list():
        if container_parent(cont) == parent_id:
            uid = container_id(cont)
            destroy_container(uid, notify=False)


def connect_to_network(container, network):
    return cli.connect_container_to_network(container, network)


def delete_all_queues(use_localhost=False):
    delete_list_of_queues(get_queues(use_localhost), use_localhost)
    return


def delete_list_of_queues(qlist, use_localhost=False):
    if use_localhost:
        params = pika.ConnectionParameters('localhost')
    else:
        params = pika.ConnectionParameters(
            heartbeat=600,
            blocked_connection_timeout=300,
            host="megaplex",
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


# noinspection PyArgumentEqualDefault
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
    params = pika.ConnectionParameters(
        heartbeat=600,
        blocked_connection_timeout=300,
        host="megaplex",
        port=5672,
        virtual_host='/'
    )
    try:
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
        # noinspection PyTypeChecker
        channel.basic_publish(exchange='',
                              routing_key=dest_id,
                              properties=pika.BasicProperties(
                                  reply_to=None,
                                  correlation_id=None,
                                  delivery_mode=1
                              ),
                              body=json.dumps(new_packet))
    except:
        print("got an exception in post_task_noqworker trying to publish")
    # noinspection PyUnboundLocalVariable
    connection.close()
    return
