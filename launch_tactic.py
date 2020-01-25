# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

import os, sys
import pymongo
from pymongo import MongoClient
from pymongo.database import Database
import gridfs

use_ssl = os.environ.get("USE_SSL")
if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True

print "entering launch_tactic"
import docker_cleanup
print "entering tactic_run"
from tactic_app.rabbit_manage import sleep_until_rabbit_alive, delete_all_queues
import docker_functions
from docker_functions import create_container, get_address, ContainerCreateError
from docker_functions import db_name, mongo_uri
docker_cleanup.do_docker_cleanup()

host_persist_dir = os.getcwd() + "/persist"
host_nltk_data_dir = os.getcwd() + "/tactic_app/nltk_data"
host_static_dir = os.getcwd() + "/tactic_app/static"


def create_megaplex():
    try:
        if restart_rabbit:
            _unique_id, _megaplex_id = create_container("rabbitmq:3-management",
                                                        container_name="megaplex",
                                                        host_name="my-rabbit",
                                                        port_bindings={5672: 5672, 15672: 15672},
                                                        register_container=False)
        docker_functions.megaplex_address = get_address("megaplex", "bridge")
    except ContainerCreateError:
        print "Error creating the Megaplex."
        exit()


def create_host():
    try:
        host_volume_dict = {"/var/run/docker.sock": {"bind": "/var/run/docker.sock", "mode": "rw"}}
        host_volume_dict[host_persist_dir] = {"bind": "/code/persist", "mode": "rw"}
        host_volume_dict[host_static_dir] = {"bind": "/code/static", "mode": "ro"}
        env_vars = {"USE_SSL": use_ssl}
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


def list_collections(self):
    dictlist = self.command("listCollections")["cursor"]["firstBatch"]
    return [d["name"] for d in dictlist]


Database.collection_names = list_collections


def create_collection(self, collection_name):
    self.command("create", collection_name)
    return


Database.create_collection = create_collection

try:
    print "getting client"
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))

    # Now the local server branch is what executes on the remote server
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
    # force connection on a request as the
    # connect=True parameter of MongoClient seems
    # to be useless here
    client.server_info()
    # noinspection PyUnresolvedReferences
    db = client[db_name]
    fs = gridfs.GridFS(db)

    if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
        ANYONE_CAN_REGISTER = True
    else:
        ANYONE_CAN_REGISTER = False

    create_megaplex()
    success = sleep_until_rabbit_alive()
    if not success:
        print("seems like the rabbitmq server isn't answering")
    delete_all_queues(use_localhost=True)

    print("creating the host")
    create_host()
    if "temp_data" not in db.collection_names():
        db.create_collection("temp_data")
    else:
        for rec in db["temp_data"].find():
            if "file_id" in rec:
                fs.delete(rec["file_id"])
        db["temp_data"].remove()

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()

# tactic_app.global_tile_manager.get_all_default_tiles()
