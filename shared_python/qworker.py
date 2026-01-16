
import os

use_gevent = os.environ.get("USE_GEVENT", "False").lower() == "true"

if use_gevent:
    import gevent
    from communication_utils import emit_direct, socketio
else:
    import threading
import pika
import uuid
import time
import datetime
import json

import sys
import copy

from exception_mixin import ExceptionMixin, MessagePostException
from threading import Lock
from rabbit_manage import get_pika_connection_with_retries, declare_queue
from tactic_logging import bind_request, new_task_id, log

from service_controls import CONTROL_EXCHANGE, process_control_message

MAX_PIKA_RETRIES = None

PAUSE_TIME = .01

thread = None
thread_lock = Lock()

callback_dict = {}
callback_data_dict = {}
error_handler_dict = {}

response_statuses = ["submitted_response", "submitted_response_with_error", "unclaimed", "unanswered"]
error_response_statuses = ["submitted_response_with_error", "unclaimed", "unanswered"]


if "USE_WAIT_TASKS" in os.environ:
    use_wait_tasks = os.environ.get("USE_WAIT_TASKS") == "True"
else:
    use_wait_tasks = True


task_worthy_methods = {}
task_worthy_manual_submit_methods = {}


def task_worthy(m):
    task_worthy_methods[m.__name__] = "this_worker"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "this_worker"
    return m

heartbeat_time = 30


def current_timestamp():
    return datetime.datetime.now()


base_stdout = sys.stdout


def sleep_func(t):
    if use_gevent:
        gevent.sleep(t)
    else:
        time.sleep(t)
    return

def do_yield():
    if use_gevent:
        gevent.sleep(0)
    return

# noinspection PyTypeChecker,PyUnusedLocal,PyMissingConstructor
class QWorker(ExceptionMixin):
    def __init__(self, service_name=None, special_id=None):
        self.service_name = service_name
        if special_id:
            self.my_id = special_id
        else:
            if service_name is None:
                self.my_id = os.environ.get("MY_ID", str(uuid.uuid4())[:4])
            else:
                self.my_id = service_name + str(uuid.uuid4())[:4]

        self.handler_instances = {"this_worker": self}
        self.channel = None
        self.connection = None
        self.use_emit_direct = use_gevent
        if use_wait_tasks:
            self.wait_queue_id = "wait_" + self.my_id

    def start_background_thread(self):
        with bind_request(new_task_id(), "main_consume_loop", "main_consume_loop"):
            while True:
                try:
                    self.connection, self.channel = get_pika_connection_with_retries(MAX_PIKA_RETRIES)
                    if self.connection is None or self.channel is None:
                        log.warning("Couldn't create pika connection in background thread for QWorker")
                        sleep_func(5)
                        continue
                    declare_queue(self.channel, self.my_id)
                    self.consume_without_ack(self.my_id, on_message_callback=self.handle_delivery)
                    if self.service_name is not None:
                        declare_queue(self.channel, self.service_name)
                        self.consume_without_ack(self.service_name, self.handle_delivery)
                    q = self.channel.queue_declare(queue="", exclusive=True, auto_delete=True)
                    control_queue_name = q.method.queue
                    self.channel.exchange_declare(exchange=CONTROL_EXCHANGE, exchange_type="fanout", durable=True)
                    self.channel.queue_bind(queue=control_queue_name, exchange=CONTROL_EXCHANGE)
                    self.consume_without_ack(control_queue_name, on_message_callback=self.handle_control_message)
                    log.info(' [*] Waiting for messages:')
                    self.ready()
                    self.channel.start_consuming()
                except (pika.exceptions.AMQPError, OSError):
                    log.warning(f"Lost connection to RabbitMQ. Will attempt to reconnect.")
                    try:
                        if self.connection and not self.connection.is_closed:
                            self.connection.close()
                    except Exception:
                        pass
                    sleep_func(5)
                    continue
                except Exception:
                    log.exception("Unexpected error in background thread for QWorker")
                    sleep_func(5)
                    continue

    def consume_without_ack(self, qname, on_message_callback):
        self.channel.basic_consume(
            queue=qname,
            auto_ack=False,
            on_message_callback=on_message_callback,
        )

    def interrupt_and_restart(self):
        global thread, thread_lock
        try:
            self.connection.close()
        except Exception:
            log.exception("Error closing connection in interrupt_and_restart")
            pass
        thread.kill()
        thread = None
        self.start()
        return

    def start(self):
        global thread
        with thread_lock:
            if thread is None:
                if use_gevent:
                    thread = socketio.start_background_task(target=self.start_background_thread)
                else:
                    thread = threading.Thread(target=self.start_background_thread)
                    thread.start()
                log.debug('Background thread started')

    def ready(self):
        return

    def do_heartbeat(self):
        return

    def handle_control_message(self, channel, method, props, body):
        try:
            channel.basic_ack(delivery_tag=method.delivery_tag)
            message = json.loads(body)
            process_control_message(message)
        except Exception:
            log.exception("Got uncaught error in handle control message",
                          my_id=self.my_id)
        return

    def handle_delivery(self, channel, method, props, body):
        task_packet = {}
        try:
            channel.basic_ack(delivery_tag=method.delivery_tag)
            task_packet = json.loads(body)
            if task_packet["status"] in response_statuses:
                self.handle_response(task_packet)
            else:
                self.handle_event(task_packet)
            do_yield()
        except Exception:
            log.exception("Got uncaught error in handle delivery",
                          my_id=self.my_id,
                          task_type=task_packet.get("task_type", "unknown"))
        return

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        self._ensure_channel()
        declare_queue(self.channel, dest_id)
        self.channel.basic_publish(exchange='',
                                   routing_key=dest_id,
                                   properties=pika.BasicProperties(
                                       reply_to=reply_to,
                                       correlation_id=callback_id,
                                       delivery_mode=2
                                   ),
                                   body=json.dumps(task_packet))
        return

    def _ensure_channel(self):
        if self.connection is None or self.channel is None:
            self.connection, self.channel = get_pika_connection_with_retries(MAX_PIKA_RETRIES)
            return

        if self.connection.is_closed or self.channel.is_closed:
            try:
                self.connection.close()
            except Exception:
                log.exception("Error closing connection in _ensure_channel")
                pass
            self.connection, self.channel = get_pika_connection_with_retries(MAX_PIKA_RETRIES)

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, special_reply_to=None):
        new_id = new_task_id()
        with bind_request(new_id, "presend", task_type):
            try:
                log.debug("post_task", task_type=task_type, dest_id=dest_id, my_id=self.my_id)
                if callback_func is not None:
                    callback_id = str(uuid.uuid4())
                    if special_reply_to is None:
                        reply_to = self.my_id
                    else:
                        reply_to = special_reply_to
                    callback_dict[callback_id] = callback_func
                    if callback_data is not None:
                        cdata = copy.copy(callback_data)
                        callback_data_dict[callback_id] = cdata
                        callback_type = "callback_with_context"
                    else:
                        callback_type = "callback_no_context"
                else:
                    callback_id = None
                    reply_to = None
                    callback_type = "no_callback"

                new_packet = {"source": self.my_id,
                              "task_id": new_id,
                              "status": "presend",
                              "callback_type": callback_type,
                              "dest": dest_id,
                              "task_type": task_type,
                              "task_data": task_data,
                              "callback_id": callback_id,
                              "response_data": None,
                              "reply_to": reply_to,
                              "expiration": expiration}

                declare_queue(self.channel, dest_id)
                log.debug("Posting task", task_type=task_type, dest_id=dest_id, source_id=self.my_id)
                self.post_packet(dest_id, new_packet, reply_to, callback_id)
                do_yield()

            except Exception:
                log.exception("Error in post_task", task_type=task_type, my_id=self.my_id)
                special_string = "Error handling post_task for task type {} for my_id {}".format(task_type, self.my_id)
            return

    # noinspection PyUnusedLocal
    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1,
                      timeout=10, alt_address=None):

        task_id = new_task_id()
        with bind_request(task_id, "presend", task_type):
            try:
                log.debug("post_and_wait", task_type=task_type, dest_id=dest_id, my_id=self.my_id)
                callback_id = str(uuid.uuid4())
                wait_worker = BlockingWaitWorker(self.wait_queue_id)
                new_packet = {"source": self.my_id,
                              "task_id": task_id,
                              "callback_type": "wait",
                              "callback_id": callback_id,
                              "status": "presend",
                              "dest": dest_id,
                              "task_type": task_type,
                              "task_data": task_data,
                              "response_data": None,
                              "reply_to": wait_worker.my_id,
                              "expiration": None}

                # noinspection PyNoneFunctionAssignment@

                resp = wait_worker.post_blocking_wait(dest_id, new_packet)
                do_yield()
                self.channel.queue_delete(self.wait_queue_id)
                if resp == "__ERROR__":
                    raise MessagePostException("Blocking wait post failed")
                else:
                    return resp
            except Exception:
                log.exception("post and wait error")
                special_string = "Got post_blocking_wait error with msg_type {}, destination {}, and source {}".format(
                    task_type,
                    dest_id,
                    self.my_id)
                return {"success": False, "message": special_string, "alert_type": "alert-warning"}

    def emit_to_client(self, message, data):
        data["local_id"] = self.my_id
        data["message"] = message
        self.ask_host("emit_to_client", data)

    def submit_response(self, task_packet, response_data=None):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "submitting_response", task_type):  # shouldn't be necessary but just in case
            log.debug("entering submit_response",
                      my_id=self.my_id)
            if response_data is not None:
                task_packet["response_data"] = response_data
            task_packet["status"] = "submitted_response"
            if "client_post" in task_packet:
                if self.use_emit_direct:
                    if "room" in task_packet:
                        room = task_packet["room"]
                    else:
                        room = task_packet["global_id"]
                        task_packet["room"] = room
                    if "namespace" in task_packet:
                        namespace = task_packet["namespace"]
                    else:
                        namespace = "/main"
                    emit_direct("handle-callback", task_packet, namespace=namespace, room=room)
                else:
                    self.emit_to_client("handle-callback", task_packet)
            else:
                reply_to = task_packet["reply_to"]
                self.post_packet(reply_to, task_packet, callback_id=task_packet["callback_id"])
            return

    def handle_response(self, task_packet):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "handling_response", task_type):
            try:
                log.debug("handle_response",
                          my_id=self.my_id)
                cbid = task_packet["callback_id"]
                if cbid in error_handler_dict:
                    error_handler = error_handler_dict[cbid]
                    del error_handler_dict[cbid]
                else:
                    error_handler = None
                func = callback_dict[task_packet["callback_id"]]
                del callback_dict[task_packet["callback_id"]]
                callback_type = task_packet["callback_type"]
                if callback_type == "callback_with_context":
                    cdata = callback_data_dict[task_packet["callback_id"]]
                    del callback_data_dict[task_packet["callback_id"]]
                    func(task_packet["response_data"], cdata)
                else:
                    func(task_packet["response_data"])
            except Exception:
                log.exception("Error in handle_response")
            return

    def handle_event(self, task_packet):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "handling_event", task_type):
            task_type = task_packet["task_type"]
            log.debug("entering handle_event", task_type=task_type, my_id=self.my_id)
            if task_type in task_worthy_methods:
                response_data = None
                try:
                    handler = self.handler_instances[task_worthy_methods[task_type]]
                    response_data = getattr(handler, task_type)(task_packet.get("task_data"))
                except Exception:
                    log.exception("Error handling task", task_type=task_type, my_id=self.my_id)

                    special_string = f"Error handling task {task_type} for my_id {self.my_id}"
                    response_data = {"success": False, "message": special_string}

                if task_packet.get("callback_id") is not None:
                    try:
                        task_packet["response_data"] = response_data
                        self.submit_response(task_packet)
                    except Exception:
                        log.exception("error submitting response", task_type=task_type, my_id=self.my_id)
                        special_string = f"Error submitting response for task {task_type} for my_id {self.my_id}"
                        task_packet["response_data"] = {"success": False, "message": special_string}
                        self.submit_response(task_packet)
                return

            if task_type in task_worthy_manual_submit_methods:
                try:
                    handler = self.handler_instances[task_worthy_manual_submit_methods[task_type]]
                    handler.__getattribute__(task_type)(task_packet.get("task_data"), task_packet)
                except Exception:
                    log.exception("error in manual submit method", task_type=task_type, my_id=self.my_id)
                    special_string = f"Error handling task {task_type} for my_id {self.my_id}"
                    task_packet["response_data"] = {"success": False, "message": special_string}
                    self.submit_response(task_packet)
                return

            log.warning("Ignoring task type", task_type=task_type, my_id=self.my_id)

    def handle_exception(self, ex, special_string=None):
        res = self.get_traceback_message(ex, special_string)
        return res


# noinspection PyUnusedLocal,PyMissingConstructor
class BlockingWaitWorker(ExceptionMixin):
    def __init__(self, queue_name):
        self.queue_name = queue_name
        self.my_id = self.queue_name
        self.current_callback_id = None
        self.initialize_me()

    def initialize_me(self, retries=0):
        try:
            self.connection, self.channel = get_pika_connection_with_retries(MAX_PIKA_RETRIES)
            if self.connection is None:
                log.exception("Couldn't create pika connection for blocking worker")
                return
            declare_queue(self.channel, self.queue_name)
            self.callback_queue = self.queue_name
            self.channel.basic_consume(
                queue=self.callback_queue,
                on_message_callback=self.on_response,
                auto_ack=True)
        except Exception:
            log.exception("Couldn't connect to pika in Blocking worker")

    def reset_me(self):
        self.connection.close()
        self.initialize_me()

    def post_blocking_wait(self, dest_id, task_packet, retries=0):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "presend", task_type):
            max_retries = 3
            try:
                if self.channel is None or self.channel.is_closed:
                    self.initialize_me()
                    sleep_func(1)
                self.response = None
                self.current_callback_id = task_packet["callback_id"]
                self.corr_id = str(uuid.uuid4())
                declare_queue(self.channel, dest_id)
                self.channel.basic_publish(
                    exchange='',
                    routing_key=dest_id,
                    properties=pika.BasicProperties(
                        reply_to=self.callback_queue,
                        correlation_id=self.corr_id,
                        delivery_mode=2
                    ),
                    body=json.dumps(task_packet))
                while self.response is None:
                    self.connection.process_data_events(time_limit=1)
                self.current_callback_id = None
                return self.response
            except Exception as ex:
                log.exception("Got an exception in post_blocking wait")
                if retries > max_retries:
                    log.error("max_retries_blocking_wait")
                    return "__ERROR__"
                self.initialize_me()
                sleep_func(1)
                return self.post_blocking_wait(dest_id, task_packet, retries + 1)

    def handle_exception(self, ex, special_string=None):
        return self.extract_short_error_message(ex, special_string)

    def on_response(self, ch, method, props, body):
        the_body = json.loads(body)
        # It's possible there's an old response if the user killed a thread earlier
        # If so, we'll ignore it
        if the_body["callback_id"] == self.current_callback_id:
            self.response = the_body["response_data"]
        else:
            self.response = None
