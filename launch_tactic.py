# WORKERS determines how many instances of the tactic_host container are created
# Note that this requires a simultaneous change to the nginx config

from __future__ import print_function
WORKERS = 2

import os
print("cwd is " + os.getcwd())

import redis

if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True

print("entering launch_tactic")
import docker_cleanup
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
host_static_dir = os.getcwd() + "/tactic_app/static"
host_docs_dir = os.getcwd() + "/docs"
host_resources_dir = os.getcwd() + "/tactic_app/resources"

restart_policy = {"Name": "on-failure", "MaximumRetryCount": 5}


def create_megaplex():
    try:
        megaplex_exists = tactic_app.docker_functions.container_exists("megaplex")
        if not restart_rabbit and not megaplex_exists:
            print("megaplex doesn't yet exist so I'm making it")
        if restart_rabbit or not megaplex_exists:
            print("creating the megaplex")
            _unique_id, _megaplex_id = create_container("rabbitmq:3-management",
                                                        container_name="megaplex",
                                                        host_name="megaplex",
                                                        restart_policy=restart_policy,
                                                        port_bindings={5672: 5672, 15672: 15672},
                                                        register_container=False)
        else:
            print("no need to create the megaplex")
    except ContainerCreateError:
        print("Error creating the Megaplex.")
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


def clear_ready_db():
    redis_rb = redis.StrictRedis(db=3)
    all_keys = redis_rb.keys()
    if len(all_keys) > 0:
        redis_rb.delete(*all_keys)


def create_mongo():
    try:
        mongo_exists = tactic_app.docker_functions.container_exists("tactic-mongo")
        if not restart_rabbit and not mongo_exists:
            print("mongo doesn't yet exist so I'm making it")
        if restart_rabbit or not mongo_exists:
            print("creating tactic-mongo")
            mongo_volume_dict = {"/Users/bls910/mongo/data": {"bind": "/data/db", "mode": "rw"}}
            _unique_id, _mongo_id = create_container("mongo:4.2",
                                                     container_name="tactic-mongo",
                                                     host_name="tactic-mongo",
                                                     volume_dict=mongo_volume_dict,
                                                     port_bindings={27017: 27017},
                                                     register_container=False)
        else:
            print("no need to recreate tactic-mongo")

    except ContainerCreateError:
        print("Error creating the mongo container.")
        exit()


def create_redis():
    try:
        redis_exists = tactic_app.docker_functions.container_exists("tactic-redis")
        if not restart_rabbit and not redis_exists:
            print("redis doesn't yet exist so I'm making it")
        if restart_rabbit or not redis_exists:
            print("creating tactic-redis")
            _unique_id, _redis_id = create_container("redis:alpine",
                                                     container_name="tactic-redis",
                                                     host_name="tactic-redis",
                                                     port_bindings={6379: 6379},
                                                     restart_policy=restart_policy,
                                                     register_container=False)
        else:
            print("no need to recreate tactic-redis")
            clear_health_db()
            clear_tile_db()
            clear_ready_db()
    except ContainerCreateError:
        print("Error creating the redis container.")
        exit()


def create_host(port=5000, debug=False):
    try:
        host_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        host_volume_dict[host_persist_dir] = {"bind": "/code/persist", "mode": "rw"}
        host_volume_dict[host_static_dir] = {"bind": "/code/static", "mode": "ro"}
        host_volume_dict[host_docs_dir] = {"bind": "/code/docs", "mode": "ro"}
        env_vars = {"AM_TACTIC_HOST": True, "MYPORT": port, "USE_WAIT_TASKS": True}
        if debug:
            env_vars["DEBUG_CONTAINER"] = True
        _unique_id, _tactic_host_id = create_container("bsherin/tactic:host",
                                                       container_name="tactic_host" + str(port),
                                                       volume_dict=host_volume_dict,
                                                       port_bindings={5000: port},
                                                       env_vars=env_vars,
                                                       special_unique_id="host" + str(port),
                                                       restart_policy=restart_policy,
                                                       local_true_host_persist_dir=host_persist_dir,
                                                       local_true_host_resources_dir=host_resources_dir,
                                                       register_container=False)
    except ContainerCreateError:
        print("Error creating the host.")
        exit()


def create_tile_test_container():
    print("Creating the test_tile_container")
    env_vars = {"PPI": 0}
    try:
        _test_tile_container_id, _container_id = create_container("bsherin/tactic:tile",
                                                                  network_mode="bridge",
                                                                  container_name="tile_test_container",
                                                                  special_unique_id="tile_test_container",
                                                                  register_container=False,
                                                                  restart_policy=restart_policy,
                                                                  other_name="test_container",
                                                                  env_vars=env_vars)
    except ContainerCreateError:
        print("failed to create the test tile_container. That's very bad.")
        exit()


if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
    ANYONE_CAN_REGISTER = True
else:
    ANYONE_CAN_REGISTER = False

# create_mongo()
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
    if "DEBUG_CONTAINER" in os.environ and wn == 0:
        debug = True
    else:
        debug = False
    create_host(base_port + wn, debug)
