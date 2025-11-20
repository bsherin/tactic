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
import traceback
from rabbit_manage import get_pika_connection_with_retries, USE_AMAZON_MQ, RABBIT_USER, RABBIT_PASS, declare_queue

forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print(os.environ)

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
mongo_uri = os.environ.get("MONGO_URI")

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    from aws_helpers import get_ssm_parameter
    ECS_SUBNETS = get_ssm_parameter("ECS_SUBNETS")
    ECS_SECURITY_GROUPS= get_ssm_parameter("TILE_SECURITY_GROUPS")
    ECS_ASSIGN_PUBLIC_IP= get_ssm_parameter("ECS_ASSIGN_PUBLIC_IP")
    ECS_TILE_TASKDEF= get_ssm_parameter("ECS_TILE_TASKDEF")
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION")
    ECS_REGION = get_ssm_parameter("ECS_REGION")
    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
else:
    ECS_SUBNETS = None
    ECS_SECURITY_GROUPS = None
    ECS_ASSIGN_PUBLIC_IP = None
    ECS_TILE_TASKDEF = None
    AWS_REGION = ""
    ECS_REGION = ""
    RABBIT_HOST = "megaplex"

_develop = ("DEVELOP" in os.environ) and (os.environ.get("DEVELOP") == "True")
RETRIES = os.environ.get("RETRIES")
tactic_image_names = ["bsherin/tactic-tile", "bsherin/tactic-main",
                      "bsherin/tactic-module-viewer", "bsherin/tactic-host",
                      "bsherin/tactic-log-streamer", "bsherin/tactic-assistant",
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


# Note that get_address assumes that the network is named tactic-net
def get_address(container_identifier):
    new_network_name = "tactic-net"
    return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Networks"][new_network_name]["IPAddress"]

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

def create_log_streamer_container(room, cont_id, user_id, username):
    streamer_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
    environ = {
        "ROOM": room,
        "CONT_ID": cont_id,
    }
    streamer_id, _container_id = create_container("bsherin/tactic-log-streamer", network_mode="bridge",
                                                  env_vars=environ,
                                                  owner=user_id, other_name=None, username=username,
                                                  volume_dict=streamer_volume_dict,
                                                  publish_all_ports=True, remove=True)
    return streamer_id

def create_assistant_container(openai_api_key, parent, user_id, username):
    assistant_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
    environ = {
        "OPENAI_API_KEY": openai_api_key,
        "USE_GEVENT": "False"
    }
    assistant_id, _container_id = create_container("bsherin/tactic-assistant", network_mode="bridge",
                                                    env_vars=environ,
                                                    parent=parent,
                                                    owner=user_id, other_name=None, username=username,
                                                    volume_dict=assistant_volume_dict,
                                                    publish_all_ports=True, remove=True)
    return assistant_id

class MainContainerTracker(object):

    def extract_port(self, container_identifier):
        return cli.containers.get(container_identifier).attrs["NetworkSettings"]["Ports"]["5000/tcp"]


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
                     lwait_until_running=True, owner="host", parent="host",
                     env_vars=None, port_bindings=None, wait_retries=50,
                     other_name="none", volume_dict=None, username=None,
                     detach=True, register_container=True, publish_all_ports=False,
                     restart_policy=None, special_unique_id=None, remove=False):

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
               "USE_AMAZON_MQ": USE_AMAZON_MQ,
               "RABBIT_HOST": RABBIT_HOST,
               "RABBIT_USER": RABBIT_USER,
               "RABBIT_PASS": RABBIT_PASS,
               "USE_ECS_TILES": use_ecs,
               "ECS_SUBNETS": ECS_SUBNETS,
               "ECS_SECURITY_GROUPS": ECS_SECURITY_GROUPS,
               "ECS_ASSIGN_PUBLIC_IP": ECS_ASSIGN_PUBLIC_IP,
               "ECS_TILE_TASKDEF": ECS_TILE_TASKDEF,
               "AWS_REGION": AWS_REGION,
               "ECS_REGION": ECS_REGION
           }

    if username is not None:
        environ["USERNAME"] = username

    if DEBUG_MAIN_CONTAINER or DEBUG_TILE_CONTAINER:
        environ["PYCHARM_DEBUG"] = True
        environ["GEVENT_SUPPORT"] = True

    if env_vars is not None:
        for key, val in env_vars.items():
            environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name, "project": "tactic"}

    if image_name == "bsherin/tactic-tile":  # We don't want people to be able to see the mongo_uri
        del environ["MONGO_URI"]

    print("in create container with image_name " + image_name)
    print("USE_ARM64 is " + str(USE_ARM64))
    if USE_ARM64 and image_name in tactic_image_names:
        image_name += ":arm64"
        print("changed image name to " + image_name)
    else:
        image_name += ":x86"
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
        "publish_all_ports": publish_all_ports,
        "remove": remove
    }

    print("got run args")

    if container_name is not None:
        run_args["name"] = container_name
    if host_name is not None:
        run_args["hostname"] = host_name

    if restart_policy is not None:
        run_args["restart_policy"] = restart_policy


    print("***Got image name " + image_name)
    container = cli.containers.run(**run_args)
    print("did the run")

    cont_id = container.id
    container = cli.containers.get(cont_id)
    print("got container")
    retries = 0
    if lwait_until_running:
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

def get_user_assistant(user_id):
    image_name = "bsherin/tactic-assistant"
    if USE_ARM64:
        image_name += "-arm64"
    conts = cli.containers.list(
        all=True,
        filters={
            "label": f"owner={user_id}",
            "ancestor": image_name
        }
    )

    if len(conts) > 0:
        cont = conts[0]
        if cont.status != 'running':
            cont.remove()
            return None
        return container_id(cont)
    return None


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


def container_id(container):
    if "my_id" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["my_id"]
    else:
        return "system"

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
    if cont is None:
        return ""
    if since is not None:
        return cont.logs(since=since)
    else:
        return cont.logs()

def get_traceback_message(e, special_string=None):
    if special_string is None:
        template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
    else:
        template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    error_string = template.format(type(e).__name__, e.args)
    error_string += traceback.format_exc()
    return error_string

import time
import docker
from docker.errors import APIError, NotFound

client = docker.from_env()

def safe_remove(c, stop_timeout=10, retries=5, backoff=0.5):
    try:
        c.update(restart_policy={"Name": "no"})
    except APIError:
        pass

    # 2) Unpause if paused
    try:
        c.reload()
        if c.attrs.get("State", {}).get("Paused"):
            try: c.unpause()
            except APIError: pass
    except APIError:
        pass

    # 3) Stop/kill and wait to exit
    try:
        if c.status in ("running", "restarting"):
            try:
                c.stop(timeout=stop_timeout)
            except APIError:
                try: c.kill()
                except APIError:
                    pass
            # wait until it is fully exited
            try: c.wait()
            except APIError: pass
    except APIError:
        pass

    # brief settle loop: Docker needs a tick to mark it Stopped
    for _ in range(10):
        try:
            c.reload()
            st = c.attrs.get("State", {})
            if not (st.get("Running") or st.get("Paused") or st.get("Restarting")):
                break
        except APIError:
            break
        time.sleep(0.1)

    # 4) Remove with retries
    last_err = None
    for i in range(retries):
        try:
            c.remove(force=True)
            return None
        except NotFound:
            return "Container not found, it may have already been removed."
        except APIError as e:
            last_err = e
            msg = (getattr(e, "explanation", "") or "").lower()
            if any(s in msg for s in [
                "removal of container", "is already in progress",
                "is restarting", "you cannot remove a paused container",
                "conflict"
            ]):
                time.sleep(backoff * (2 ** i))
                continue
            raise
    # If we get here, we kept conflicting
    return last_err

def destroy_container(tactic_id, notify=True):
    try:
        print(f"destroying container ${tactic_id}")
        cont = get_container(tactic_id)
        message = None
        if cont is None:
            print(f"container ${tactic_id} not found, but still need to deregister")
            post_task_noqworker("host", "host", "deregister_container", {"container_id": tactic_id})
            return 1
        else:
            print(f"container ${tactic_id} found")
            cont_type = get_container_type(cont)
            post_task_noqworker("host", "host", "deregister_container", {"container_id": tactic_id})

            if notify:
                if cont_type == "main" or cont_type == "module_viewer":
                    other_name = container_other_name(cont)
                    message = "Underlying container for {} has been destroyed".format(other_name)
                elif cont_type == "tile":
                    tile_name = container_other_name(cont)
                    message = "Container for tile {} has been destroyed".format(tile_name)
            err = safe_remove(cont)
            if err is not None:
                print(f"Error removing container {tactic_id}: {err}")
            ## cont.remove(force=True)
            cont_list = [tactic_id, tactic_id + "_wait"]
            if cont_type == "tile":
                cont_list.append("kill_" + tactic_id)
            delete_list_of_queues(cont_list)
            if notify and message is not None and err is None:
                print("about to send kill message")
                data = {"content": message,
                        "title": "Killed Container",
                        "user_id": container_owner(cont)}
                post_task_noqworker("host", "host", "add_error_drawer_entry_task", data)
            return 1
    except Exception as ex:
        print(get_traceback_message(ex, "got an exception in destroy_container"))
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


def delete_list_of_queues(qlist,):
    connection, channel = get_pika_connection_with_retries()
    if connection is None:
        print("couldn't connect to pika in delete_list_of_queues")
        return
    for q in qlist:
        try:
            channel.queue_delete(queue=q)
        except:
            print("problem deleting a queue")
    connection.close()

service_names = ["host", "main_service", "log_streamer"]

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
    try:
        connection, channel = get_pika_connection_with_retries()
        if connection is None:
            print("could not connect to pika in post_task_noqworker")
            return
        declare_queue(channel, dest_id)
        # noinspection PyTypeChecker
        channel.basic_publish(exchange='',
                              routing_key=dest_id,
                              properties=pika.BasicProperties(
                                  reply_to=None,
                                  correlation_id=None,
                                  delivery_mode=2
                              ),
                              body=json.dumps(new_packet))
        connection.close()
    except:
        print("got an exception in post_task_noqworker trying to publish")

    return
