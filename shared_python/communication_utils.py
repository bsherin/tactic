import requests
import sys
import time
import os
import json
import types
from bson import Binary
import base64
import pickle
import copy
import cloudpickle
import zlib
import uuid
import pika
from exception_mixin import generic_exception_handler

socketio = None
emit_direct = None

try:
    import flask_socketio
    from flask_socketio import SocketIO
    from redis_tools import MESSAGE_QUEUE
    print("in communication utils with message queue:", MESSAGE_QUEUE)

    socketio = SocketIO(
        message_queue=MESSAGE_QUEUE,
        channel="socketio",
        logger=False,
        engineio_logger=False,
    )

    def emit_direct(event_name, data, namespace, room):
        socketio.emit(event_name, data, namespace=namespace, room=room)
except ModuleNotFoundError as err:
    print("no flask_socketio")

megaplex = None

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
    return pickle.loads(bytes(dat))

