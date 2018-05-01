# This module creates many of the objects that
# need to be imported by other modules.
from flask import Flask
import pymongo
import sys
import subprocess
import re
import os
from pymongo import MongoClient
import gridfs
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect
from docker_functions import create_container, get_address, ContainerCreateError
import docker_functions
from communication_utils import send_request_to_container, USE_FORWARDER
from integrated_docs import api_array
from docker_functions import db_name

csrf = CSRFProtect()

# global_stuff
# these variables are imported by other modules
use_ssl = os.environ.get("USE_SSL")
app = None
db = None
fs = None
socketio = None
global_tile_manager = None
client_worker = None
host_worker = None

def print_message():
    print "got to the message"


def create_megaplex():
    global megaplex_id
    try:
        unique_id, megaplex_id = create_container("tactic_megaplex_image",
                                                  port_bindings={5000: 8085},
                                                  register_container=False)
        docker_functions.megaplex_address = get_address(megaplex_id, "bridge")
    except ContainerCreateError:
        print "Error creating the Megaplex."
        exit()

# noinspection PyUnresolvedReferences
try:
    print "getting client"
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))

    # Now the local server branch is what executes on the remote server
    client = MongoClient("localhost", serverSelectionTimeoutMS=10)
    # force connection on a request as the
    # connect=True parameter of MongoClient seems
    # to be useless here
    client.server_info()
    # noinspection PyUnresolvedReferences
    db = client[db_name] # tactic_working

    if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
        ANYONE_CAN_REGISTER = True
    else:
        ANYONE_CAN_REGISTER = False

    fs = gridfs.GridFS(db)
    "print creating login stuff"
    login_manager = LoginManager()
    login_manager.session_protection = 'strong'
    login_manager.login_view = 'login'

    "print creating app and confiruting"
    app = Flask(__name__)
    app.config.from_object('config')

    if ("TESTING" in os.environ) and (os.environ.get("TESTING") == "True"):
        app.config["WTF_CSRF_ENABLED"] = False

    if use_ssl == "True":
        print "enabling sslify"
        from flask.ext.sslify import SSLify
        sslify = SSLify(app)

    "print starting login_manager, bootstratp, socketio"
    login_manager.init_app(app)
    bootstrap = Bootstrap(app)
    socketio = SocketIO(app)
    csrf.init_app(app)

    print "creating the megaplex"
    create_megaplex()

    if not "temp_data" in db.collection_names():
        db.create_collection("temp_data")
    else:
        for rec in db["temp_data"].find():
            if "file_id" in rec:
                fs.delete(rec["file_id"])
        db["temp_data"].remove()

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()
