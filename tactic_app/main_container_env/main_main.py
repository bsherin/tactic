from flask import Flask, request, jsonify
from main import mainWindow
from bson.binary import Binary
import datetime
import cPickle
import pymongo
import sys
import copy

app = Flask(__name__)

mwindow = None


@app.route('/')
def hello():
    return 'This is mainwindow communicating'


@app.route('/initialize_mainwindow', methods=['POST'])
def initialize_mainwindow():
    app.logger.debug("entering intialize mainwindow")
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict)
    mwindow.start()
    return jsonify({"success": True})


@app.route('/initialize_project_mainwindow', methods=['POST'])
def initialize_project_mainwindow():
    app.logger.debug("entering intialize project mainwindow")
    global mwindow
    data_dict = request.json
    mwindow = mainWindow(app, data_dict)
    mwindow.start()
    mwindow.post_task(data_dict["main_id"], "do_full_recreation", data_dict)
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)