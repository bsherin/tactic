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

if ("USE_FORWARDER" in os.environ) and (os.environ.get("USE_FORWARDER") == "True"):
    USE_FORWARDER = True
else:
    USE_FORWARDER = False

RETRIES = 60

# set am_host to True when this is initially loaded.
# in this case where this isn't the host, this will get changed when qworker is imported.

am_host = True
megaplex_address = None


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


def send_request_to_megaplex(msg_type, data_dict=None, wait_for_success=True, timeout=3, tries=RETRIES, wait_time=.1,
                             alt_address=None):
    if alt_address is not None:
        taddress = alt_address
        port = "5000"
    elif am_host is True:
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
            except Exception as ex:
                last_fail = generic_exception_handler.get_traceback_message(ex)
                time.sleep(wait_time)
                continue
        error_string = "Send request to megaplex timed out with msg_type {} and last fail {}".format(msg_type,
                                                                                                     last_fail)
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
            except Exception as ex:
                last_fail = generic_exception_handler.get_traceback_message(ex)
                time.sleep(wait_time)
                continue
        error_string = "Send container request timed out with msg_type {} " \
                       "and address {}. Last error message was {}".format(msg_type, taddress, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)


def post_task_noqworker(source_id, dest_id, task_type, task_data=None):
    new_packet = {"source": source_id,
                  "callback_type": "no_callback",
                  "status": "presend",
                  "dest": dest_id,
                  "task_type": task_type,
                  "task_data": task_data,
                  "response_data": None,
                  "callback_id": None,
                  "reply_to": None,
                  "expiration": None}
    # result = send_request_to_megaplex("post_task", new_packet).json()
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
    channel.basic_publish(exchange='',
                          routing_key=dest_id,
                          properties=pika.BasicProperties(
                              reply_to=None,
                              correlation_id=None,
                              delivery_mode=1
                          ),
                          body=json.dumps(new_packet))
    connection.close()
    return result
