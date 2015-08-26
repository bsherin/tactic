
# This module creates many of the objects that
# need to be imported by other modules.

from flask import Flask
import pymongo
import sys
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO

MONGOLAB_URI = "mongodb://heroku_4ncbq1zd:g5gpcb378o4rqnidof6m3dcp4r@ds035563.mongolab.com:35563/heroku_4ncbq1zd"

try:
    # client = MongoClient("localhost", serverSelectionTimeoutMS=10)
    client = MongoClient(host=MONGOLAB_URI, serverSelectionTimeoutMS=10)
    client.server_info() # force connection on a request as the
                         # connect=True parameter of MongoClient seems
                         # to be useless here
    db = client.tacticdb

    login_manager = LoginManager()
    login_manager.session_protection = 'strong'
    login_manager.login_view = 'auth.login'

    app = Flask(__name__)
    app.config.from_object('config')

    login_manager.init_app(app)
    bootstrap = Bootstrap(app)
    socketio=SocketIO(app)

except pymongo.errors.ServerSelectionTimeoutError as err:
    print("There's a problem with the mongo server. Probably it's not running. ", err)
    sys.exit()
