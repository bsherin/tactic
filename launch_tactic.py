# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

WORKERS = 2

import os, sys
import redis


if "USE_SSL" in os.environ:
    use_ssl = os.environ.get("USE_SSL")
else:
    use_ssl = "False"
if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True

print "entering launch_tactic"
import docker_cleanup
print "entering tactic_run"
import tactic_app
from tactic_app.docker_functions import create_container, get_address, ContainerCreateError
from tactic_app.docker_functions import db_name, mongo_uri, delete_all_queues
from tactic_app.rabbit_manage import sleep_until_rabbit_alive
docker_cleanup.do_docker_cleanup()


def get_tactic_networks():
    networks = tactic_app.docker_functions.cli.networks.list()
    nets = []
    for network in networks:
        if network.name == "tactic-net":
            nets.append(network)
    return nets


tnets = get_tactic_networks()
if restart_rabbit:
    for tnet in tnets:
        tnet.remove()
    tactic_app.docker_functions.cli.networks.create("tactic-net", driver="bridge")

host_persist_dir = os.getcwd() + "/persist"
host_nltk_data_dir = os.getcwd() + "/tactic_app/nltk_data"
host_static_dir = os.getcwd() + "/tactic_app/static"

restart_policy = {"Name": "on-failure", "MaximumRetryCount": 5}


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


def clear_health_db():
    redis_ht = redis.StrictRedis(db=2)
    all_keys = redis_ht.keys()
    delete_list = []
    for k in all_keys:
        delete_list.append(k)
    if len(delete_list) > 0:
        redis_ht.delete(*delete_list)
    return


def clear_tile_db():
    print("initializing the gtm")
    redis_tm = redis.StrictRedis(db=1)
    all_keys = redis_tm.keys()
    if len(all_keys) > 0:
        redis_tm.delete(*all_keys)


def create_redis():
    try:
        if restart_rabbit:
            _unique_id, _redis_id = create_container("redis:alpine",
                                                     container_name="tactic-redis",
                                                     host_name="tactic-redis",
                                                     port_bindings={6379: 6379},
                                                     restart_policy=restart_policy,
                                                     register_container=False)
        else:
            clear_health_db()
            clear_tile_db()
    except ContainerCreateError:
        print "Error creating the redis container."
        exit()


def create_host(port=5000):
    try:
        host_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        host_volume_dict[host_persist_dir] = {"bind": "/code/persist", "mode": "rw"}
        host_volume_dict[host_static_dir] = {"bind": "/code/static", "mode": "ro"}
        env_vars = {"USE_SSL": use_ssl, "AM_TACTIC_HOST": True, "MYPORT": port}
        _unique_id, _tactic_host_id = create_container("tactic_host_image",
                                                       container_name="tactic_host" + str(port),
                                                       volume_dict=host_volume_dict,
                                                       port_bindings={5000: port},
                                                       env_vars=env_vars,
                                                       special_unique_id="host",
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


if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
    ANYONE_CAN_REGISTER = True
else:
    ANYONE_CAN_REGISTER = False

create_megaplex()
create_redis()
success = sleep_until_rabbit_alive()
create_tile_test_container()
if not success:
    print("seems like the rabbitmq server isn't answering")
delete_all_queues(use_localhost=True)

print("creating the host")
base_port = 5000
for wn in range(WORKERS):
    create_host(base_port + wn)
