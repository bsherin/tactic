
import pika
import ssl
import time
import os
import traceback

print("entering rabbit_manage")

if os.environ.get("USE_AMAZON_MQ") == "True" or os.environ.get("USE_AMAZON_MQ") is True:
    USE_AMAZON_MQ = True
    RABBIT_HOST = "b-d4163cd4-38d5-45f0-9bc1-87c04c48d2a4.mq.us-east-2.on.aws"  # broker hostname only
    RABBIT_USER = os.environ.get("RABBIT_USER")
    RABBIT_PASS = os.environ.get("RABBIT_PASS")
    RABBIT_PORT = 5671
    MESSAGE_QUEUE_ADDRESS = f"amqps://{RABBIT_USER}:{RABBIT_PASS}@{RABBIT_HOST}:5671//"
else:
    USE_AMAZON_MQ = False
    RABBIT_HOST = "megaplex"
    RABBIT_PORT = 5672
    MESSAGE_QUEUE_ADDRESS = "megaplex"
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
                "max_retries": 20,  # “-1” would mean infinite
            },
        },
        # Optional overall connect timeout (top-level)
        "connect_timeout": 30,
}
HEARBEAT = 600
BLOCKED_CONNECTION_TIMEOUT = 300

MAX_PIKA_RETRIES = 20

print("got USE_AMAZON_MQ is " + str(USE_AMAZON_MQ))

def get_pika_connection():
    if USE_AMAZON_MQ:
        credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
        params = pika.ConnectionParameters(
            host=RABBIT_HOST,  # was "megaplex"
            port=RABBIT_PORT,  # TLS AMQP for Amazon MQ
            virtual_host="/",
            credentials=credentials,
            ssl_options=pika.SSLOptions(ssl.create_default_context()),
            heartbeat=HEARBEAT,
            blocked_connection_timeout=BLOCKED_CONNECTION_TIMEOUT
        )

    else:
        print(f"getting pika connection with host {RABBIT_HOST} and port {RABBIT_PORT}")
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


def get_pika_connection_with_retries(retries=0, use_time=False, max_retries=MAX_PIKA_RETRIES):
    print("in get_pika_connection_with_retries, retries")
    if not use_time:
        import gevent
    try:
        connection, channel = get_pika_connection()
    except Exception as exc:
        print("Failed attempt to connect to pika")
        if retries > max_retries:
            print("giving up. No more processing of tasks by this qworker")
            print(get_traceback_message(exc, "Here's the error"))
            return None, None
        else:
            print("trying to connect to pika, sleeping ...")
            if use_time:
                time.sleep(3)
            else:
                gevent.sleep(3)
            new_retries = retries + 1
            return get_pika_connection_with_retries(new_retries, use_time, max_retries)
    print("succesful connection")
    return connection, channel

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

