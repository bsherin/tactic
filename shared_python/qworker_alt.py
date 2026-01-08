
import pika
import uuid
import time
import datetime
import json
import os
import sys
import copy

from rabbit_manage import get_pika_connection_with_retries, declare_queue
MAX_PIKA_RETRIES = None

from exception_mixin import ExceptionMixin, MessagePostException
from threading import Lock
import threading
import ctypes
import inspect
from tactic_logging import bind_request, new_task_id, log

from service_controls import CONTROL_EXCHANGE, process_control_message

thread = None
thread_lock = Lock()

callback_dict = {}
callback_data_dict = {}
error_handler_dict = {}

response_statuses = ["submitted_response", "submitted_response_with_error", "unclaimed", "unanswered"]
error_response_statuses = ["submitted_response_with_error", "unclaimed", "unanswered"]

use_wait_tasks = True


task_worthy_methods = {}
task_worthy_manual_submit_methods = {}

def simple_uid():
    import string, random
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(random.choices(alphabet, k=8))

def task_worthy(m):
    task_worthy_methods[m.__name__] = "this_worker"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "this_worker"
    return m


def current_timestamp():
    return datetime.datetime.now()

def sleep_func(t):
    time.sleep(t)


base_stdout = sys.stdout

def stop_thread(the_thread):
    """Raises an exception in the threads with id tid"""
    if not the_thread or not the_thread.is_alive():
        return
    tid = the_thread.ident
    exctype = SystemExit
    if not inspect.isclass(exctype):
        raise TypeError("Only types can be raised (not instances)")
    res = ctypes.pythonapi.PyThreadState_SetAsyncExc(
        ctypes.c_long(tid), ctypes.py_object(exctype)
    )
    if res == 0:
        raise ValueError("invalid thread id")
    elif res != 1:
        # "if it returns a number greater than one, we're in trouble,
        # and you should call it again with exc=NULL to revert the effect"
        ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, 0)
        raise SystemError("PyThreadState_SetAsyncExc failed")

pika_channels = {}
pika_connections = {}
wait_workers = {}

def add_qw_pika_connection(max_retries=MAX_PIKA_RETRIES):
    try:
        global pika_channels
        global pika_connections
        current_thread = my_thread()
        connection, channel = get_pika_connection_with_retries(max_retries)
        if connection is None:
            log.error("problem getting pika connection for thread", thread=current_thread)
            return None
        log.debug("successfully added pika connection", thread=current_thread)
        pika_connections[current_thread] = connection
        pika_channels[current_thread] = channel
        return connection, channel
    except Exception:
        log.exception("problem adding pika connection")
        return None, None

def my_thread():
    return threading.current_thread().name

def my_channel():
    if my_thread() in pika_channels:
        return pika_channels[my_thread()]
    else:
        log.warning("my_channel called but no channel for thread", thread=my_thread())
        return None

def my_wait_worker():
    if my_thread() in wait_workers:
        return wait_workers[my_thread()]
    return None

def my_connection():
    if my_thread() not in pika_connections:
        log.warning("my_connection called but no connection for thread", thread=my_thread())
        return None
    return pika_connections[my_thread()]

def close_connection():
    try:
        my_connection().close()
    except:
        log.exception("error closing pika connection")
    del pika_channels[my_thread()]
    del pika_connections[my_thread()]
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
        self.last_heartbeat = current_timestamp()
        self.wait_queue_id = "wait_" + self.my_id

    def start_background_thread(self, retries=10):
        connection = None
        channel = None
        with bind_request(new_task_id(), "main_consume_loop", "main_consume_loop"):
            while True:
                try:
                    connection, channel = add_qw_pika_connection()
                    if connection is None or channel is None:
                        log.warning("problem starting background thread: unable to create connection")
                        sleep_func(5)
                        continue
                    declare_queue(channel, self.my_id)
                    self.consume_without_ack(channel, self.my_id, self.handle_delivery)
                    if self.service_name is not None:
                        declare_queue(channel, self.service_name)
                        self.consume_without_ack(channel, self.service_name, self.handle_delivery)
                    q = channel.queue_declare(queue="", exclusive=True, auto_delete=True)
                    control_queue_name = q.method.queue
                    channel.exchange_declare(exchange=CONTROL_EXCHANGE, exchange_type="fanout", durable=True)
                    channel.queue_bind(queue=control_queue_name, exchange=CONTROL_EXCHANGE)
                    self.consume_without_ack(channel, control_queue_name, on_message_callback=self.handle_control_message)
                    log.info(' [*] Waiting for messages:', my_id=self.my_id)
                    self.ready()
                    channel.start_consuming()
                except (pika.exceptions.AMQPError, OSError) as ex:
                    log.warning("Lost connection to RabbitMQ, Will attempt to reconnect.")
                    try:
                        if connection and not connection.is_closed:
                            connection.close()
                    except Exception as ex:
                        log.exception(f"Error closing connection")
                        pass
                    sleep_func(5)
                    continue
                except Exception as ex:
                    log.exception("Unexpected error in background thread")
                    sleep_func(5)
                    continue

    @staticmethod
    def consume_without_ack(channel, qname, on_message_callback):
        channel.basic_consume(
            queue=qname,
            auto_ack=False,
            on_message_callback=on_message_callback,
        )

    def interrupt_and_restart(self):
        global thread
        global thread_lock
        my_connection().close()
        stop_thread(thread)
        log.debug("stopped thread")
        thread = None
        if thread_lock.locked():
            thread_lock.release()
        self.start()
        log.debug("restarted thread")
        return

    def start(self):
        global thread
        with thread_lock:
            if thread is None:
                thread = threading.Thread(target=self.start_background_thread, name=simple_uid())
                thread.start()
                log.debug('Background thread started')

    def ready(self):
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
        # Need to ack immediately because some events restart the tile and prevent acking
        channel.basic_ack(delivery_tag=method.delivery_tag)
        try:
            task_packet = json.loads(body)
            if task_packet["status"] in response_statuses:
                self.handle_response(task_packet)
            else:
                self.handle_event(task_packet)
        except Exception as ex:
            special_string = "Uncaught error in handle delivery"
            log.exception(special_string)
        return

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        connection, channel = self._ensure_channel()
        declare_queue(channel, dest_id)
        channel.basic_publish(exchange='',
                              routing_key=dest_id,
                              properties=pika.BasicProperties(
                                  reply_to=reply_to,
                                  correlation_id=callback_id,
                                  delivery_mode=2
                              ),
                              body=json.dumps(task_packet))
        return

    @staticmethod
    def _ensure_channel():
        channel = my_channel()
        connection = my_connection()
        if connection is None or channel is None:
            connection, channel = add_qw_pika_connection(MAX_PIKA_RETRIES)
            return connection, channel

        if connection.is_closed or channel.is_closed:
            try:
                connection.close()
            except Exception as ex:
                log.exception("Error closing connection")
                pass
            connection, channel = add_qw_pika_connection(MAX_PIKA_RETRIES)
        return connection, channel

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, special_reply_to=None):
        new_id = new_task_id()
        with bind_request(new_id, "presend", task_type):
            try:
                log.debug("entering post_task", task_type=task_type, dest_id=dest_id, my_id=self.my_id)
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
                self.post_packet(dest_id, new_packet, reply_to, callback_id)

            except Exception as ex:
                log.exception("error in post_task", task_type=task_type, my_id=self.my_id)
        return

    # noinspection PyUnusedLocal
    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1,
                      timeout=10, alt_address=None):
        task_id = new_task_id()
        with bind_request(task_id, "presend", task_type):
            try:
                log.debug("entering post_and_wait", task_type=task_type, dest_id=dest_id, my_id=self.my_id)
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
                channel = my_channel()
                channel.queue_delete(self.wait_queue_id)
                if resp == "__ERROR__":
                    raise MessagePostException("Blocking wait post failed")
                else:
                    return resp
            except Exception as ex:
                log.exception("post and wait error")
                special_string = "Got post_blocking_wait error with msg_type {}, destination {}, and source {}".format(
                    task_type,
                    dest_id,
                    self.my_id)
                return {"success": False, "message": special_string, "alert_type": "alert-warning"}

    def post_blocking_wait(self, dest_id, task_packet, retries=10):
        max_retries = 3

        try:
            log.debug("entering post_blocking_wait", thread=my_thread())
            channel = my_channel()
            self.wait_response = None
            self.current_callback_id = task_packet["callback_id"]
            self.corr_id = str(uuid.uuid4())
            declare_queue(channel, dest_id)
            channel.basic_publish(
                exchange='',
                routing_key=dest_id,
                properties=pika.BasicProperties(
                    reply_to=self.callback_queue,
                    correlation_id=self.corr_id,
                    delivery_mode=2
                ),
                body=json.dumps(task_packet))
            while self.wait_response is None:
                my_connection().process_data_events()
            self.current_callback_id = None
            return self.wait_response
        except Exception as ex:
            log.exception("Error post_blocking wait")
            if retries == 0:
                return "__ERROR__"
            else:
                self.initialize_me()
                time.sleep(1)
                self.post_blocking_wait(dest_id, task_packet, retries - 1)

    def submit_response(self, task_packet, response_data=None):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "submitting_response", task_type):
            log.debug("entering submit_response",
                      task_type=task_packet.get("task_type", "unknown"),
                      my_id=self.my_id)
            if response_data is not None:
                task_packet["response_data"] = response_data
            task_packet["status"] = "submitted_response"

            if "client_post" in task_packet:
                self.emit_to_client("handle-callback", task_packet)
            else:
                reply_to = task_packet["reply_to"]
                self.post_packet(reply_to, task_packet, callback_id=task_packet["callback_id"])
        return

    def handle_response(self, task_packet):
        def noop(_arg1, _arg2=None):
            pass
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "handling_response", task_type):
            try:
                log.debug("entering handle_response",
                          task_type=task_packet.get("task_type", "unknown"),
                          callback_id=task_packet["callback_id"],
                          my_id=self.my_id)
                cbid = task_packet["callback_id"]
                if cbid in error_handler_dict:
                    error_handler = error_handler_dict[cbid]
                    del error_handler_dict[cbid]
                else:
                    error_handler = noop
                func = callback_dict[task_packet["callback_id"]]
                del callback_dict[task_packet["callback_id"]]
                callback_type = task_packet["callback_type"]
                if task_packet["status"] in error_response_statuses and error_handler is not None:
                    if callback_type == "callback_with_context":
                        cdata = callback_data_dict[task_packet["callback_id"]]
                        del callback_data_dict[task_packet["callback_id"]]
                        if error_handler is not None:
                            error_handler(task_packet, cdata)
                    else:
                        if error_handler is not None:
                            error_handler(task_packet)
                elif callback_type == "callback_with_context":
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
                if task_worthy_methods[task_type] == "tilebase" and "tilebase" not in self.handler_instances:
                    log.warning("it seems like tilebase is not ready yet. skipping event", task_type=task_type, my_id=self.my_id)
                    response_data = None
                else:
                    try:
                        handler = self.handler_instances[task_worthy_methods[task_type]]
                        response_data = getattr(handler, task_type)(task_packet.get("task_data"))
                    except Exception as ex:
                        log.exception("error handling event", task_type=task_type, my_id=self.my_id)
                        special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                              self.my_id)
                        response_data = self.get_traceback_exception_dict(ex, special_string)

                if task_packet["callback_id"] is not None:
                    try:
                        task_packet["response_data"] = response_data
                        self.submit_response(task_packet)
                    except Exception as ex:
                        log.exception("Error submitting response", task_type=task_type, my_id=self.my_id)
                        special_string = f"Error submitting response for task {task_type} for my_id {self.my_id}"
                        task_packet["response_data"] = self.get_traceback_exception_dict(ex, special_string)
                        try:
                            self.submit_response(task_packet)
                        except Exception:
                            log.exception("Second error submitting response", task_type=task_type, my_id=self.my_id)

            elif task_type in task_worthy_manual_submit_methods:
                try:
                    getattr(self.handler_instances[task_worthy_manual_submit_methods[task_type]], task_type)(task_packet["task_data"], task_packet)
                except Exception as ex:
                    log.exception("error handling event", task_type=task_type, my_id=self.my_id)
                    special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                          self.my_id)
                    response_data = self.get_traceback_exception_dict(ex, special_string)
                    task_packet["response_data"] = response_data
                    self.submit_response(task_packet)
            else:
                log.warning("Ignoring task type", task_type=task_type, my_id=self.my_id)
            return

    def handle_exception(self, ex, special_string=None):
        return self.get_traceback_message(ex, special_string)


# noinspection PyUnusedLocal,PyMissingConstructor
class BlockingWaitWorker(ExceptionMixin):
    def __init__(self, queue_name):
        self.queue_name = queue_name
        self.my_id = self.queue_name
        self.current_callback_id = None
        self.initialize_me()

    def initialize_me(self):
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
            log.exception("Couldn't start blocking worker")

    def reset_me(self):
        self.connection.close()
        self.initialize_me()

    def post_blocking_wait(self, dest_id, task_packet, retries=0):
        task_id = task_packet.get("task_id") or new_task_id()
        task_type = task_packet.get("task_type", "unknown")
        with bind_request(task_id, "presend", task_type):
            max_retries = 3
            try:
                if self.channel is None or self.channel.is_closed:  # If closed, take one crack at fixing
                    self.initialize_me()
                    time.sleep(1)
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
                    self.connection.process_data_events()
                self.current_callback_id = None
                return self.response
            except Exception as ex:
                log.exception("Error in post_blocking_wait")
                if retries > max_retries:
                    log.error("Max retries exceeded in post_blocking_wait")
                    return "__ERROR__"
                self.initialize_me()
                time.sleep(1)
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
