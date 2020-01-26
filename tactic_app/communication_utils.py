import requests
import sys
import time
import os
import json
import types
from bson import Binary
import base64
import pickle
import cloudpickle
import zlib
import uuid
import pika
from exception_mixin import generic_exception_handler


from flask_socketio import SocketIO

print("in communication utils")

if ("USE_FORWARDER" in os.environ) and (os.environ.get("USE_FORWARDER") == "True"):
    USE_FORWARDER = True
else:
    USE_FORWARDER = False

RETRIES = 60

socketio = None
megaplex = None

if "MEGAPLEX_ADDRESS" in os.environ:  # This will be True in a tile or module_viewer
    megaplex_address = os.environ.get("MEGAPLEX_ADDRESS")
else:
    from docker_functions import get_address
    megaplex_address = get_address("megaplex", "bridge")


if "AM_TACTIC_HOST" not in os.environ and "AM_LAUNCHER" not in os.environ:
    print("making a new socketio")
    message_queue = 'amqp://{}:5672//'.format(megaplex_address)
    socketio = SocketIO(message_queue=message_queue)
else:
    print("not making a new socketio")


def emit_direct(event_name, data, namespace, room):
    socketio.emit(event_name, data, namespace=namespace, room=room)


def is_jsonizable(dat):
    try:
        _ = json.dumps(dat)
        return True
    except:
        return False


def make_jsonizable_and_compress(dat):
    return zlib.compress(make_python_object_jsonizable(dat, output_string=False))


def make_python_object_jsonizable(dat, output_string=True):
    if isinstance(dat, types.FunctionType):  # handle functions specially
        dat.__module__ = "__main__"  # without this, cloudpickle only generates a reference to the function
        jdat = base64.b64encode(cloudpickle.dumps(dat))
    else:
        try:
            jdat = base64.b64encode(pickle.dumps(dat, protocol=2))
        except:
            jdat = base64.b64encode(cloudpickle.dumps(dat))
    if output_string and not isinstance(jdat, str):
        jdat = jdat.decode("utf-8")
    return jdat


def debinarize_python_object(bdat):
    if isinstance(bdat, Binary):
        dat = bdat.decode()
    else:
        dat = base64.b64decode(bdat)
    return pickle.loads(dat)


def store_temp_data(db, data_dict):
    unique_id = str(uuid.uuid4())
    data_dict["unique_id"] = unique_id
    db["temp_data"].insert_one(data_dict)
    return unique_id


def read_temp_data(db, unique_id):
    return db["temp_data"].find_one({"unique_id": unique_id})


def delete_temp_data(db, unique_id, fs=None):
    save_dict = read_temp_data(db, unique_id)
    db["temp_data"].delete_one({"unique_id": unique_id})
    if fs is not None and "file_id" in save_dict:
        fs.delete(save_dict["file_id"])
    return


def read_project_dict(fs, mdata, file_id):
    project_dict = None
    if "save_style" in mdata:
        if mdata["save_style"] == "b64save" or mdata["save_style"] == "b64save_react":
            binarized_python_object = zlib.decompress(fs.get(file_id).read())
            project_dict = debinarize_python_object(binarized_python_object)
    else:  # legacy
        project_dict = pickle.loads(zlib.decompress(fs.get(file_id).read()).decode("utf-8", "ignore").encode("ascii"))
    return project_dict


def send_request_to_container(taddress, msg_type, data_dict=None, wait_for_success=True,
                              timeout=3, tries=RETRIES, wait_time=.1):
    last_fail = ""
    port = "5000"

    if wait_for_success:
        for attempt in range(tries):
            try:
                res = requests.post("http://{0}:{1}/{2}".format(taddress, port, msg_type),
                                    timeout=timeout, json=data_dict)
                return res
            except Exception as ex:
                last_fail = generic_exception_handler.get_traceback_message(ex)
                time.sleep(wait_time)
                continue
        error_string = "Send container request timed out with msg_type {} " \
                       "and address {}. Last error message was {}".format(msg_type, taddress, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)

