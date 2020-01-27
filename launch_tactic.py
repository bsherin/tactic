# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

import os, sys

use_ssl = os.environ.get("USE_SSL")
if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True

print "entering launch_tactic"
import docker_cleanup
print "entering tactic_run"
import docker_functions
from docker_functions import create_container, get_address, ContainerCreateError
from docker_functions import db_name, mongo_uri, delete_all_queues
from tactic_app.rabbit_manage import sleep_until_rabbit_alive
docker_cleanup.do_docker_cleanup()


def get_tactic_networks():
    networks = docker_functions.cli.networks.list()
    nets = []
    for network in networks:
        if network.name == "tactic-net":
            nets.append(network)
    return nets


tnets = get_tactic_networks()
if restart_rabbit:
    for tnet in tnets:
        tnet.remove()
    docker_functions.cli.networks.create("tactic-net", driver="bridge")

host_persist_dir = os.getcwd() + "/persist"
host_nltk_data_dir = os.getcwd() + "/tactic_app/nltk_data"
host_static_dir = os.getcwd() + "/tactic_app/static"


def create_megaplex():
    try:
        if restart_rabbit:
            _unique_id, _megaplex_id = create_container("rabbitmq:3-management",
                                                        container_name="megaplex",
                                                        host_name="megaplex",
                                                        port_bindings={5672: 5672, 15672: 15672},
                                                        register_container=False)
    except ContainerCreateError:
        print "Error creating the Megaplex."
        exit()


def create_redis():
    try:
        if restart_rabbit:
            _unique_id, _redis_id = create_container("redis:alpine",
                                                     container_name="tactic-redis",
                                                     host_name="tactic-redis",
                                                     port_bindings={6379: 6379},
                                                     register_container=False)
    except ContainerCreateError:
        print "Error creating the redis container."
        exit()


def create_host():
    try:
        host_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        host_volume_dict[host_persist_dir] = {"bind": "/code/persist", "mode": "rw"}
        host_volume_dict[host_static_dir] = {"bind": "/code/static", "mode": "ro"}
        env_vars = {"USE_SSL": use_ssl, "AM_TACTIC_HOST": True}
        _unique_id, _tactic_host_id = create_container("tactic_host_image",
                                                       container_name="tactic_host",
                                                       volume_dict=host_volume_dict,
                                                       port_bindings={5000: 80},
                                                       env_vars=env_vars,
                                                       local_true_host_persist_dir=host_persist_dir,
                                                       local_true_host_nltk_data_dir=host_nltk_data_dir,
                                                       register_container=False)
    except ContainerCreateError:
        print "Error creating the host."
        exit()


def create_tile_test_container():
    print("about to create the test_tile_container")
    env_vars = {"PPI": 0}
    try:
        test_tile_container_id, container_id = create_container("tactic_tile_image",
                                                                network_mode="bridge",
                                                                container_name="tile_test_container",
                                                                special_unique_id="tile_test_container",
                                                                register_container=False,
                                                                other_name="test_container",
                                                                env_vars=env_vars)
        print('created the test_tile_container')
    except ContainerCreateError:
        print("failed to create the test tile_container. That's very bad.")
        exit()


CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
STEP_SIZE = int(os.environ.get("STEP_SIZE"))

if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
    ANYONE_CAN_REGISTER = True
else:
    ANYONE_CAN_REGISTER = False

create_megaplex()
create_redis()
create_tile_test_container()

success = sleep_until_rabbit_alive()
if not success:
    print("seems like the rabbitmq server isn't answering")
delete_all_queues(use_localhost=True)

print("creating the host")
create_host()
