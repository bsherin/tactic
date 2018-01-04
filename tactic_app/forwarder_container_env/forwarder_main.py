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
    timestring = datetime.datetime.utcnow().strftime("%b %d, %Y, %H:%M")
    print timestring + ": " + msg
    # app.logger.debug(msg)
    return

def handle_exception(ex, special_string=None):
    if special_string is None:
        template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
    else:
        template = "<pre>" + special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}</pre>"
    error_string = template.format(type(ex).__name__, ex.args)
    print error_string
    return jsonify({"success": False, "message_string": error_string})

@app.route('/forward_message', methods=["get", "post"])
def forward_message():
    data = request.json
    forwarding_address = data["forwarding_address"]
    msg_type = data["msg_type"]
    if "wait_for_success" in data:
        wait_for_success = data["wait_for_success"]
    else:
        wait_for_success = True
    try:
        res = send_request_to_container(forwarding_address, msg_type, data, wait_for_success=wait_for_success)
    except Exception as ex:
        return handle_exception(ex)
    return jsonify(res.json())


if __name__ == "__main__":
    print "about to start"
    app.run(host="0.0.0.0", debug=True, threaded=True)
