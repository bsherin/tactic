
# This module creates many of the objects that
# need to be imported by other modules.

from flask import Flask
import pymongo
import sys
import os
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO
from flask_wtf.csrf import CsrfProtect

csrf = CsrfProtect()


def print_message():
    print "got to the message"

try:
    print "getting client"
    use_ssl = os.environ.get("USE_SSL")
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))
    if ("USE_LOCAL_SERVER" in os.environ) and (os.environ.get("USE_LOCAL_SERVER") == "True"):
        client = MongoClient("localhost", serverSelectionTimeoutMS=10)
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        db = client.tacticdb

    else:
        client = MongoClient(host=os.environ.get("MONGOLAB_URI"))
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        db = client.heroku_4ncbq1zd

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

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()
