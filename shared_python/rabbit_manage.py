
import pika
import time
import os
from tactic_logging import log

from aws_helpers import get_ssm_parameter, load_secret_json
from aws_detection import on_aws


service_names = ["host", "main_service", "log_streamer", "module_viewer"]

use_gevent = os.environ.get("USE_GEVENT", "False").lower() == "true"

if on_aws:
    log.debug("on aws is true")

    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
    SECRET_ARN = get_ssm_parameter("MQ_SECRET_ARN")
    REGION = get_ssm_parameter("MY_AWS_REGION")

    creds = load_secret_json(SECRET_ARN)

    RABBIT_USER = creds["username"]
    RABBIT_PASS = creds["password"]
    RABBIT_PORT = 5672
    log.debug("using mq with host", rabbit_host=RABBIT_HOST)
else:
    log.debug("on_aws is false, using local rabbitmq")
    RABBIT_HOST = "megaplex"
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

def get_pika_connection():
    if on_aws:
        credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
        params = pika.ConnectionParameters(
            host=RABBIT_HOST,
            port=RABBIT_PORT,
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

def get_pika_connection_with_retries(max_retries=None):
    if use_gevent:
        import gevent

    attempt = 0
    while True:
        try:
            connection, channel = get_pika_connection()
            return connection, channel
        except Exception:
            attempt += 1
            log.warning("Failed attempt to connect to pika")

            if max_retries is not None and attempt > max_retries:
                log.exception("giving up on connecting to pika")
                return None, None

            log.debug("trying to connect to pika, sleeping ...")
            if not use_gevent:
                time.sleep(3)
            else:
                gevent.sleep(3)


def sleep_until_rabbit_alive(max_tries=100):
    if on_aws:
        return True
    from rabbitmq_admin import AdminAPI
    api = AdminAPI(url="http://megaplex:15672", auth=('guest', 'guest'))
    log.debug('got admin api')
    for n in range(max_tries):
        if rabbit_alive(api):
            return True
        time.sleep(2)
    log.error("** rabbit was never alive **")
    return False


def rabbit_alive(api):
    try:
        return api.is_vhost_alive("/")["status"] == "ok"
    except:
        return False

