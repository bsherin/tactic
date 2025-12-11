
import pika
import ssl
import time
import os
import traceback
import json

from aws_helpers import get_ssm_parameter, load_secret_json


service_names = ["host", "main_service", "log_streamer", "module_viewer"]

print("entering rabbit_manage updated")

use_gevent = os.environ.get("USE_GEVENT", "False").lower() == "true"

if os.environ.get("USE_AMAZON_MQ") == "True" or os.environ.get("USE_AMAZON_MQ") is True:
    print("using amazon mq")
    import boto3

    USE_AMAZON_MQ = True
    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
    SECRET_ARN = get_ssm_parameter("MQ_SECRET_ARN")
    REGION = get_ssm_parameter("MY_AWS_REGION")

    print("using amazon mq with host:", RABBIT_HOST)

    creds = load_secret_json(SECRET_ARN)

    RABBIT_USER = creds["username"]
    RABBIT_PASS = creds["password"]
    RABBIT_PORT = 5672
    print("using amazon mq with user:", RABBIT_USER)
else:
    print("not using amazon mq")
    RABBIT_HOST = "megaplex"
    USE_AMAZON_MQ = False
    RABBIT_PORT = 5672
    RABBIT_USER = ""
    RABBIT_PASS = ""

SOCKETIO_OPTIONS = {
        # Enable TLS
        "ssl": True,  # or dict for advanced TLS options
        # AMQP heartbeat (supported by py-amqp via Kombu)
        "heartbeat": 600,
        # Transport (TCP) options for py-amqp
        "transport_options": {
            "socket_timeout": 30,  # read/write timeout
            # Optional retry policy used by ensure_* helpers internally
            "retry_policy": {
                "interval_start": 0,
                "interval_step": 2,
                "interval_max": 5,
                "max_retries": 20,  # “-1” would mean infiniteg
            },
        },
        # Optional overall connect timeout (top-level)
        "connect_timeout": 30,
}
HEARBEAT = 600
BLOCKED_CONNECTION_TIMEOUT = 300

print("got USE_AMAZON_MQ is " + str(USE_AMAZON_MQ))

def get_pika_connection():
    if USE_AMAZON_MQ:
        credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
        params = pika.ConnectionParameters(
            host=RABBIT_HOST,  # was "megaplex"
            port=RABBIT_PORT,  # TLS AMQP for Amazon MQ
            virtual_host="/",
            credentials=credentials,
            ssl_options=None,
            heartbeat=HEARBEAT,
            blocked_connection_timeout=BLOCKED_CONNECTION_TIMEOUT
        )

    else:
        params = pika.ConnectionParameters(
            host=RABBIT_HOST,
            port=RABBIT_PORT,
            virtual_host='/',
            heartbeat=HEARBEAT,
            blocked_connection_timeout=BLOCKED_CONNECTION_TIMEOUT
        )

    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    return connection, channel

def declare_queue(channel, qname):
    if qname in service_names or qname.startswith("tile_"):
        declare_durable_queue(channel, qname)
    else:
        declare_regular_queue(channel, qname)

def declare_durable_queue(channel, qname):
    channel.queue_declare(
        queue=qname,
        durable=True,
        auto_delete=False,
        exclusive=False
    )

def declare_regular_queue(channel, qname):
    channel.queue_declare(
        queue=qname,
        durable=False,
        auto_delete=False,
        exclusive=False
    )

# def get_pika_connection_with_retries(retries=0, max_retries=MAX_PIKA_RETRIES):
#     if use_gevent:
#         import gevent
#     try:
#         connection, channel = get_pika_connection()
#     except Exception as exc:
#         print("Failed attempt to connect to pika")
#         if retries > max_retries:
#             print("giving up. No more processing of tasks by this qworker")
#             print(get_traceback_message(exc, "Here's the error"))
#             return None, None
#         else:
#             print("trying to connect to pika, sleeping ...")
#             if not use_gevent:
#                 time.sleep(3)
#             else:
#                 gevent.sleep(3)
#             new_retries = retries + 1
#             return get_pika_connection_with_retries(new_retries, max_retries)
#     return connection, channel

def get_pika_connection_with_retries(max_retries=None):
    if use_gevent:
        import gevent

    attempt = 0
    while True:
        try:
            connection, channel = get_pika_connection()
            return connection, channel
        except Exception as exc:
            attempt += 1
            print("Failed attempt to connect to pika")

            if max_retries is not None and attempt > max_retries:
                print("giving up. No more processing of tasks by this qworker")
                print(get_traceback_message(exc, "Here's the error"))
                return None, None

            print("trying to connect to pika, sleeping ...")
            if not use_gevent:
                time.sleep(3)
            else:
                gevent.sleep(3)


def sleep_until_rabbit_alive(max_tries=20):
    if USE_AMAZON_MQ:
        return True
    from rabbitmq_admin import AdminAPI
    api = AdminAPI(url="http://megaplex:15672", auth=('guest', 'guest'))
    print('got admin api')
    ignore = ["aliveness-test", ""]
    for n in range(max_tries):
        if rabbit_alive(api):
            return True
        time.sleep(2)
    print("** rabbit was never alive **")
    return False

def get_traceback_message(e, special_string=None):
    if special_string is None:
        template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
    else:
        template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    error_string = template.format(type(e).__name__, e.args)
    error_string += traceback.format_exc()
    return error_string

def rabbit_alive(api):
    try:
        return api.is_vhost_alive("/")["status"] == "ok"
    except:
        return False

