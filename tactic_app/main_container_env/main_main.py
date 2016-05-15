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


def handle_exception(ex, special_string=None):
    if special_string is None:
        template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
    else:
        template = "<pre>" + special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}</pre>"
    error_string = template.format(type(ex).__name__, ex.args)
    return jsonify({"success": False, "message_string": error_string})


@app.route('/initialize_mainwindow', methods=['POST'])
def initialize_mainwindow():
    try:
        app.logger.debug("entering intialize mainwindow")
        global mwindow
        data_dict = request.json
        app.logger.debug("data_dict is " + str(data_dict))
        mwindow = mainWindow(app, data_dict)
        mwindow.start()
        return jsonify({"success": True})
    except Exception as Ex:
        return handle_exception(Ex, "Error initializing mainwindow")


@app.route('/initialize_project_mainwindow', methods=['POST'])
def initialize_project_mainwindow():
    try:
        app.logger.debug("entering intialize project mainwindow")
        global mwindow
        data_dict = request.json
        mwindow = mainWindow(app, data_dict)
        mwindow.start()
        mwindow.post_task(data_dict["main_id"], "do_full_recreation", data_dict)
        app.logger.debug("leaving initialize_project_mainwindow")
        return jsonify({"success": True})
    except Exception as Ex:
        return handle_exception(ex, "Error initializing project mainwindow")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True)