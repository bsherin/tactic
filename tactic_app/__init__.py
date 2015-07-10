from flask import Flask
from pymongo import MongoClient
from flask.ext.login import LoginManager
from flask.ext.bootstrap import Bootstrap

client = MongoClient()
db = client.tacticdb

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'

app = Flask(__name__)
app.config.from_object('config')

login_manager.init_app(app)
bootstrap = Bootstrap(app)
