import docker
import os
import sys
import uuid
import subprocess
import re
import pika
import json
import traceback
from rabbit_manage import get_pika_connection_with_retries, declare_queue
from aws_detection import on_aws

forwarder_address = None
forwarder_id = None
sys.stdout = sys.stderr

print(os.environ)

from aws_helpers import get_ssm_parameter

from aws_detection import am_fargate

db_name = get_ssm_parameter("DB_NAME", "tacticdb")

if am_fargate() and os.getenv("MONGO_URI_FARGATE"):
    mongo_uri = get_ssm_parameter("MONGO_URI_FARGATE")
else:
    mongo_uri = get_ssm_parameter("MONGO_URI", "tactic-mongo")

if on_aws:
    ECS_SUBNETS = get_ssm_parameter("ECS_SUBNETS")
    ECS_SECURITY_GROUPS= get_ssm_parameter("TILE_SECURITY_GROUPS")
    ECS_TILE_TASKDEF= get_ssm_parameter("ECS_TILE_TASKDEF")
    AWS_REGION = get_ssm_parameter("MY_AWS_REGION")
    ECS_REGION = get_ssm_parameter("ECS_REGION")
    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
else:
    ECS_SUBNETS = None
    ECS_SECURITY_GROUPS = None
    ECS_TILE_TASKDEF = None
    AWS_REGION = ""
    ECS_REGION = ""
    RABBIT_HOST = "megaplex"

tactic_image_names = ["bsherin/tactic-tile", "bsherin/tactic-main",
                      "bsherin/tactic-module-viewer", "bsherin/tactic-host",
                      "bsherin/tactic-log-streamer", "bsherin/tactic-assistant",
                      ]

USE_ARM64 = get_ssm_parameter("USE_ARM64", default="False").lower() == "true"

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
    return None


# noinspection PyUnusedLocal
def create_container(image_name, container_name=None, network_mode="bridge", host_name="none",
                     lwait_until_running=True, owner="host", parent="host",
                     env_vars=None, port_bindings=None, wait_retries=50,
                     other_name="none", volume_dict=None, username=None,
                     detach=True, publish_all_ports=False,
                     restart_policy=None, special_unique_id=None, remove=False):

    if special_unique_id is not None:
        unique_id = special_unique_id
    else:
        unique_id = str(uuid.uuid4())

    environ = {"MY_ID": unique_id,
               "OWNER": owner,
               "PARENT": parent,
               "IMAGE_NAME": image_name,
               "PYTHONUNBUFFERED": "Yes",
           }

    if username is not None:
        environ["USERNAME"] = username

    if env_vars is not None:
        for key, val in env_vars.items():
            environ[key] = val

    labels = {"my_id": unique_id, "owner": owner, "parent": parent, "other_name": other_name, "project": "tactic"}

    if USE_ARM64 and image_name in tactic_image_names:
        image_name += ":arm64"
    else:
        image_name += ":x86"

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

    if container_name is not None:
        run_args["name"] = container_name
    if host_name is not None:
        run_args["hostname"] = host_name

    if restart_policy is not None:
        run_args["restart_policy"] = restart_policy

    container = cli.containers.run(**run_args)

    cont_id = container.id
    container = cli.containers.get(cont_id)
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

def container_id(container):
    if "my_id" in container.attrs["Config"]["Labels"]:
        return container.attrs["Config"]["Labels"]["my_id"]
    else:
        return "system"

def get_tile_container_ids():
    all_containers = cli.containers.list()
    container_ids = []
    for container in all_containers:
        image_name = container_image(container)
        if "tactic-tile" in image_name:
            if not container.name == "tile_test_container":
                container_ids.append(container_id(container))
    return container_ids

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
    container = get_container(tactic_id)
    retries = 0
    while container.status == "running":
        container = get_container(tactic_id)
        retries += 1
        if retries > wait_retries:
            print("container failed to stop")
            return
        time.sleep(0.1)
    return


def wait_until_running(tactic_id, wait_retries=30):
    print("in wait_until_running")
    container = get_container(tactic_id)
    retries = 0
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
            return 1
        else:
            print(f"container ${tactic_id} found")
            cont_type = get_container_type(cont)

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
