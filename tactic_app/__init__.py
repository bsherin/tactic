
# This module creates many of the objects that
# need to be imported by other modules.

from flask import Flask, request, redirect
import pymongo
import sys, os
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO


print "entering new init"
from flask_wtf.csrf import CsrfProtect

csrf = CsrfProtect()


def print_message():
    print "got to the message"

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

    # print ("establishing redirect function")
    # app.before_request(redirect_to_ssl)

    if not app.config['SSL_DISABLE']:
        print "enabling sslify"
        from flask.ext.sslify import SSLify
        sslify = SSLify(app)

    "print starting login_manager, bootstratp, socketio"
    login_manager.init_app(app)
    bootstrap = Bootstrap(app)
    socketio=SocketIO(app)
    csrf.init_app(app)

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()


