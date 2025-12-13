# This module creates many of the objects that
# need to be imported by other modules.
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
import pymongo
import sys
import os


from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import CollectionInvalid
import gridfs
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect
from rabbit_manage import sleep_until_rabbit_alive, SOCKETIO_OPTIONS
import docker_functions as docker_functions
from mongo_db_fs import get_dbs
import communication_utils
from integrated_docs import handler_methods
from aws_helpers import get_ssm_parameter

import exception_mixin as exception_mixin
from redis_tools import MESSAGE_QUEUE

csrf = CSRFProtect()

# global_stuff
# these variables are imported by other modules

app = None
db = None
reposistory_db = None
fs = None
repository_fs = None
socketio = None
host_worker = None


def create_collection(self, collection_name):
    self.command("create", collection_name)
    return

Database.create_collection = create_collection

# noinspection PyUnresolvedReferences
try:
    CLIENT_ACTIVITY_INTERVAL_SECS = int(get_ssm_parameter("CLIENT_ACTIVITY_INTERVAL_SECS"))

    db, fs, repository_db, repository_fs = get_dbs()

    ANYONE_CAN_REGISTER = get_ssm_parameter("ANYONE_CAN_REGISTER", "False").lower() == "true"

    print("creating, cleaning temp_data")
    collection_names = db.list_collection_names()
    if "temp_data" in collection_names:
        for rec in db["temp_data"].find():
            if "file_id" in rec:
                fs.delete(rec["file_id"])
        db["temp_data"].drop()

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
    socketio = SocketIO(app,
                        async_mode="gevent",
                        message_queue=MESSAGE_QUEUE,
                        channel="socketio",
                        logger=False,
                        engineio_logger=False)

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
