import requests
import sys
import time
import os
import json
import types
from bson import Binary
import base64
import cPickle
import cloudpickle
import zlib

if ("USE_FORWARDER" in os.environ) and (os.environ.get("USE_FORWARDER") == "True"):
    USE_FORWARDER = True
else:
    USE_FORWARDER = False


if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60

am_host = False
megaplex_address = None


def is_jsonizable(dat, ensure_ascii=True):
    try:
        _ = json.dumps(dat, ensure_ascii)
        return True
    except:
        return False

def make_jsonizable_and_compress(dat):
    return zlib.compress(make_python_object_jsonizable(dat))

def make_python_object_jsonizable(dat):
    if (isinstance(dat, types.FunctionType)):  # handle functions specially
        dat.__module__ = "__main__"  # without this, cloudpickle only generates a reference to the function
        return base64.b64encode(cloudpickle.dumps(dat))
    return base64.b64encode(cPickle.dumps(dat))

def debinarize_python_object(bdat):
    if isinstance(bdat, Binary):
        dat = bdat.decode()
    else:
        dat = base64.b64decode(bdat)
    return cPickle.loads(dat)

def read_project_dict(fs, mdata, file_id):
    project_dict = None
    if "save_style" in mdata:
        if mdata["save_style"] == "b64save":
            binarized_python_object = zlib.decompress(fs.get(file_id).read())
            project_dict = debinarize_python_object(binarized_python_object)
    else:  # legacy
        project_dict = cPickle.loads(zlib.decompress(fs.get(file_id).read()).decode("utf-8", "ignore").encode("ascii"))
    return project_dict

def send_request_to_megaplex(msg_type, data_dict=None, wait_for_success=True, timeout=3, tries=RETRIES, wait_time=.1):
    if am_host is True:
        taddress = "0.0.0.0"
        port = "8085"
    else:
        taddress = megaplex_address
        port = "5000"
    last_fail = ""
    if wait_for_success:
        for attempt in range(tries):
            try:
                res = requests.post("http://{0}:{1}/{2}".format(taddress, port, msg_type),
                                    timeout=timeout, json=data_dict)
                return res
            except:
                last_fail = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                time.sleep(wait_time)
                continue
        error_string = "Send request to megaplex timed out with msg_type {} and last fail {}".format(msg_type, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:{1}/{2}".format(taddress, port, msg_type), timeout=timeout, json=data_dict)


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
            except:
                last_fail = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                time.sleep(wait_time)
                continue
        error_string = "Send container request timed out with msg_type {} " \
                       "and address {}. Last error message was {}".format(msg_type, taddress, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)

def post_task_noqworker(source_id, dest_id, task_type, task_data=None):
    new_packet = {"source": source_id,
                  "dest": dest_id,
                  "task_type": task_type,
                  "task_data": task_data,
                  "response_data": None,
                  "callback_id": None}
    result = send_request_to_megaplex("post_task", new_packet).json()
    if not result["success"]:
        error_string = "Error posting task with msg_type {} dest {} source {}. Error: {}".format(task_type,
                                                                                                 dest_id,
                                                                                                 source_id,
                                                                                                 result["message"])
        raise Exception(error_string)
    return result