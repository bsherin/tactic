
# This module creates many of the objects that
# need to be imported by other modules.

from flask import Flask
import pymongo
import sys
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap
from flask.ext.socketio import SocketIO

client = MongoClient()
db = client.tacticdb

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'

app = Flask(__name__)
app.config.from_object('config')

login_manager.init_app(app)
bootstrap = Bootstrap(app)
socketio=SocketIO(app)
