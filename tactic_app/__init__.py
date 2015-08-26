
# This module creates many of the objects that
# need to be imported by other modules.

from flask import Flask
import pymongo
import sys, os
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO

print "entering new init"


try:
    print "getting client"
    # client = MongoClient("localhost", serverSelectionTimeoutMS=10)
    client = MongoClient(host=os.environ.get("MONGOLAB_URI"))
    print "getting server_info"
    client.server_info() # force connection on a request as the
                         # connect=True parameter of MongoClient seems
                         # to be useless here
    # db = client.tacticdb
    print "getting db"
    db = client.heroku_4ncbq1zd

    "print creating login stuff"
    login_manager = LoginManager()
    login_manager.session_protection = 'strong'
    login_manager.login_view = 'auth.login'

    "print creating app and confiruting"
    app = Flask(__name__)
    app.config.from_object('config')

    "print starting login_manager, bootstratp, socketio"
    login_manager.init_app(app)
    bootstrap = Bootstrap(app)
    socketio=SocketIO(app)

except pymongo.errors.ServerSelectionTimeoutError as err:
    print("There's a problem with the mongo server. Probably it's not running. ", err)
    sys.exit()
