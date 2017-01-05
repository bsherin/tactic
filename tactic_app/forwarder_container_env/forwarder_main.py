from flask import Flask, jsonify, request
import sys
import os
import logging
import Queue
import datetime
# noinspection PyUnresolvedReferences
from communication_utils import send_request_to_container
sys.stdout = sys.stderr

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)


@app.route('/')
def hello():
    return 'This is the forwarder communicating'


def dmsg(msg):
    timestring = datetime.datetime.today().strftime("%b %d, %Y, %H:%M")
    print timestring + ": " + msg
    # app.logger.debug(msg)
    return


@app.route('/forward_message', methods=["get", "post"])
def forward_message():
    data = request.json
    forwarding_address = data["forwarding_address"]
    msg_type = data["msg_type"]
    return jsonify(send_request_to_container(forwarding_address, msg_type, data).json())



if __name__ == "__main__":
    print "about to start"
    app.run(host="0.0.0.0", debug=True, threaded=True)
