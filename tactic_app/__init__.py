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
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO
from flask_wtf.csrf import CsrfProtect
from docker_functions import create_container, get_address
from communication_utils import send_request_to_container

csrf = CsrfProtect()

# ip_info is only used as a step to getting the host_ip
ip_info = subprocess.check_output(['ip', '-4', 'addr', 'show', 'scope', 'global', 'dev', 'docker0'])

# global_stuff
# these variables are imported by other modules
host_ip = re.search("inet (.*?)/", ip_info).group(1)
mongo_uri = None
megaplex_address = None
megaplex_id = None
use_ssl = os.environ.get("USE_SSL")
app = None
db = None
fs = None
socketio = None

def print_message():
    print "got to the message"

def create_megaplex():
    global megaplex_address, megaplex_id
    # multiple_worker_issue Create the megaplex in a separate script when multiple workers
    megaplex_id = create_container("tactic_megaplex_image", network_mode="bridge")
    megaplex_address = get_address(megaplex_id, "bridge")
    send_request_to_container(megaplex_address, "add_address", {"container_id": "host", "address": host_ip})

# noinspection PyUnresolvedReferences
try:
    print "getting client"
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))

    # Now the local server branch is what executes on the remote server
    if ("USE_LOCAL_SERVER" in os.environ) and (os.environ.get("USE_LOCAL_SERVER") == "True"):
        client = MongoClient("localhost", serverSelectionTimeoutMS=10)
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        # noinspection PyUnresolvedReferences
        db = client.tacticdb
        # mongo_uri = "localhost"
        mongo_uri ="mongodb://{}:27017/tacticdb".format(host_ip)

    else:
        client = MongoClient(host=os.environ.get("MONGOLAB_URI"))
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        # noinspection PyUnresolvedReferences
        db = client.heroku_4ncbq1zd
        mongo_uri = os.environ.get("MONGOLAB_URI")

    if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
        ANYONE_CAN_REGISTER = True
    else:
        ANYONE_CAN_REGISTER = False

    fs = gridfs.GridFS(db)
    "print creating login stuff"
    login_manager = LoginManager()
    login_manager.session_protection = 'strong'
    login_manager.login_view = 'auth.login'

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

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()
