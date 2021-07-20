# This module creates many of the objects that
# need to be imported by other modules.
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
import pymongo
import sys
import subprocess
import re
import os


from pymongo import MongoClient
from pymongo.database import Database
import gridfs
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect
from docker_functions import create_container, get_address, ContainerCreateError
import docker_functions as docker_functions
import communication_utils
from communication_utils import send_request_to_container
from integrated_docs import api_array
from docker_functions import db_name, mongo_uri
from rabbit_manage import sleep_until_rabbit_alive
import exception_mixin as exception_mixin

csrf = CSRFProtect()

# global_stuff
# these variables are imported by other modules

if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True


app = None
db = None
fs = None
socketio = None
host_worker = None
health_tracker = None

# The purpose of this function is that db.collection_names doesn't work in on Azure
def list_collections(self):
    dictlist = self.command("listCollections")["cursor"]["firstBatch"]
    return [d["name"] for d in dictlist]


Database.collection_names = list_collections


def create_collection(self, collection_name):
    self.command("create", collection_name)
    return


Database.create_collection = create_collection

# noinspection PyUnresolvedReferences
try:
    print("getting client")
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))

    # Now the local server branch is what executes on the remote server
    print("getting mongo client")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
    print("got the client")
    # force connection on a request as the
    # connect=True parameter of MongoClient seems
    # to be useless here
    client.server_info()
    print("did server info")
    # noinspection PyUnresolvedReferences
    db = client[db_name]
    print("got db")

    if ("ANYONE_CAN_REGISTER" in os.environ) and (os.environ.get("ANYONE_CAN_REGISTER") == "True"):
        ANYONE_CAN_REGISTER = True
    else:
        ANYONE_CAN_REGISTER = False

    fs = gridfs.GridFS(db)
    print("got fs")

    print("creating, clearning temp_data")
    if "temp_data" not in db.collection_names():
        db.create_collection("temp_data")
    else:
        for rec in db["temp_data"].find():
            if "file_id" in rec:
                fs.delete(rec["file_id"])
        db["temp_data"].remove()

    login_manager = LoginManager()
    login_manager.session_protection = 'basic'
    login_manager.login_view = 'login'

    print("creating app and confiruting")
    app = Flask(__name__)
    app.config.from_object('config')

    exception_mixin.app = app

    if ("TESTING" in os.environ) and (os.environ.get("TESTING") == "True"):
        app.config["WTF_CSRF_ENABLED"] = False

    print("starting login_manager")
    login_manager.init_app(app)
    print("starting socketio. connecting by name")
    socketio = SocketIO(app, message_queue="megaplex", engineio_logger=True)

    # This stuff with ProxyFix seems to be critical.
    # Without it, I get major errors when accessing via ssl on the server
    # See: https://github.com/miguelgrinberg/Flask-SocketIO/issues/1047
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)
    communication_utils.socketio = socketio
    print("starting csrf.init_app")
    csrf.init_app(app)
    print("started it all")


except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()
d