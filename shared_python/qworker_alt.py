import threading

import pika
import uuid
import time
import datetime
import json
import os
import sys
import copy

from rabbit_manage import get_pika_connection_with_retries, declare_queue
import communication_utils
from exception_mixin import ExceptionMixin, MessagePostException
from threading import Lock
import threading
import ctypes
import inspect


thread = None
thread_lock = Lock()

callback_dict = {}
callback_data_dict = {}
error_handler_dict = {}

response_statuses = ["submitted_response", "submitted_response_with_error", "unclaimed", "unanswered"]
error_response_statuses = ["submitted_response_with_error", "unclaimed", "unanswered"]

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}


use_wait_tasks = True

RETRIES = os.environ.get("RETRIES")


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


heartbeat_time = 60


def current_timestamp():
    return datetime.datetime.timestamp(datetime.datetime.utcnow())


max_pika_retries = 10
base_stdout = sys.stdout


def debug_log(msg):
    timestring = datetime.datetime.utcnow().strftime("%b %d, %Y, %H:%M:%S")
    save_stdout = sys.stdout
    sys.stdout = base_stdout
    print(timestring + ": " + str(msg))
    sys.stdout = save_stdout
    return


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
        # "if it returns a number greater than one, you're in trouble,
        # and you should call it again with exc=NULL to revert the effect"
        ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, 0)
        raise SystemError("PyThreadState_SetAsyncExc failed")

pika_channels = {}
pika_connections = {}
wait_workers = {}

def add_qw_pika_connection():
    try:
        global pika_channels
        global pika_connections
        current_thread = my_thread()
        connection, channel = get_pika_connection_with_retries(0)
        if connection is None:
            print("problem getting pika connection for thread " + current_thread)
            return None
        print("successfully added pika connection for thread " + current_thread)
        pika_connections[current_thread] = connection
        pika_channels[current_thread] = channel
        return connection, channel
    except Exception as ex:
        print("problem adding pika connection")
        return None, None

def my_thread():
    return threading.current_thread().name

def my_channel():
    if my_thread() in pika_channels:
        return pika_channels[my_thread()]
    else:
        print("my_channel called but no channel for thread " + my_thread())
        return None

def my_wait_worker():
    if my_thread() in wait_workers:
        return wait_workers[my_thread()]
    return None

def my_connection():
    return pika_connections[my_thread()]

def close_connection():
    try:
        my_connection().close()
    except:
        print("error closing pika connection")
    del pika_channels[my_thread()]
    del pika_connections[my_thread()]
    return

class HeartbeatGenerator:
    def __init__(self, worker):
        from aws_helpers import get_ssm_parameter
        self.connection, self.channel = add_qw_pika_connection()
        self.worker = worker
        self.tile_id = self.worker.my_id
        self.task_data = { "tile_id": self.tile_id}
        self.heartbeat_interval = int(get_ssm_parameter("HEARTBEAT_INTERVAL_SECS", 60))

    def heartbeat_loop(self):
        while True:
            self.post_heartbeat()
            time.sleep(self.heartbeat_interval)

    def post_heartbeat(self):
        try:
            new_packet = {"source": self.tile_id,
                          "status": "presend",
                          "callback_type": "no_callback",
                          "dest": "host",
                          "task_type": "register_tile_heartbeat",
                          "task_data": self.task_data,
                          "callback_id": None,
                          "response_data": None,
                          "reply_to": None,
                          "expiration": None}
            self.channel.basic_publish(exchange='',
                                      routing_key="host",
                                      properties=pika.BasicProperties(
                                          reply_to=None,
                                          correlation_id=None,
                                          delivery_mode=2
                                  ),
                                  body=json.dumps(new_packet))
            result = {"success": True}

        except Exception:
            error_string = "Error posting heartbeat data"
            debug_log(error_string)
            result = {"success": False, "message": error_string}
        return result

    def start_heartbeat(self):
        threading.Thread(target=self.heartbeat_loop).start()

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
        try:
            connection, channel = add_qw_pika_connection()
            if connection is None:
                debug_log("problem starting background thread: unable to create connection")
                return
            declare_queue(channel, self.my_id)
            self.consume_without_ack(channel, self.my_id, self.handle_delivery)
            if self.service_name is not None:
                declare_queue(channel, self.service_name)
                self.consume_without_ack(channel, self.service_name, self.handle_delivery)
            debug_log(' [*] Waiting for messages:')
            debug_log(f"consuming from queue {self.my_id}")
            self.ready()
            channel.start_consuming()
        except Exception as ex:
            debug_log(self.handle_exception(ex, "problem starting background thread"))

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
        # my_channel().queue_delete(queue=self.my_id)
        my_connection().close()
        stop_thread(thread)
        print("stopped thread")
        thread = None
        if thread_lock.locked():
            thread_lock.release()
        self.start()
        print("restarted")
        return

    def start(self):
        global thread
        with thread_lock:
            if thread is None:
                thread = threading.Thread(target=self.start_background_thread, name=simple_uid())
                thread.start()
                debug_log('Background thread started')

    def ready(self):
        return

    def handle_delivery(self, channel, method, props, body):
        channel.basic_ack(delivery_tag=method.delivery_tag)
        try:
            task_packet = json.loads(body)
            if task_packet["status"] in response_statuses:
                self.handle_response(task_packet)
            else:
                self.handle_event(task_packet)
        except Exception as ex:
            special_string = "Got error in handle delivery"
            debug_log(special_string)
            debug_log(self.handle_exception(ex, special_string))

        return

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        channel = my_channel()
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

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, error_handler=None, special_reply_to=None):
        try:
            if callback_func is not None:
                callback_id = str(uuid.uuid4())
                if special_reply_to is None:
                    reply_to = self.my_id
                else:
                    reply_to = special_reply_to
                callback_dict[callback_id] = callback_func
                if error_handler is not None:
                    error_handler_dict[callback_id] = error_handler
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
            result = {"success": True}

        except Exception as ex:
            special_string = "Error handling callback for task type {} for my_id {}".format(task_type, self.my_id)
            error_string = self.handle_exception(ex, special_string)
            debug_log(error_string)
            result = {"success": False, "message": error_string}
        return result

    # noinspection PyUnusedLocal
    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1,
                      timeout=10, tries=RETRIES, alt_address=None):
        callback_id = str(uuid.uuid4())
        wait_worker = BlockingWaitWorker(self.wait_queue_id)
        new_packet = {"source": self.my_id,
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
            error_string = "Got post_blocking_wait error with msg_type {}, destination {}, and source {}".format(task_type,
                                                                                                                 dest_id,
                                                                                                                 self.my_id)
            debug_log(error_string)
            raise MessagePostException(error_string)
        else:
            return resp

    def post_blocking_wait(self, dest_id, task_packet, retries=10):
        max_retries = 3

        try:
            print("in post_blocking wait with mythread " + my_thread())
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
            debug_log(self.handle_exception(ex, "Got an exception in post_blocking wait"))
            if retries == 0:
                return "__ERROR__"
            else:
                self.initialize_me()
                time.sleep(1)
                self.post_blocking_wait(dest_id, task_packet, retries - 1)

    def submit_response(self, task_packet, response_data=None):
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
        try:
            cbid = task_packet["callback_id"]
            if cbid in error_handler_dict:
                error_handler = error_handler_dict[cbid]
                del error_handler_dict[cbid]
            else:
                error_handler = None
            func = callback_dict[task_packet["callback_id"]]
            del callback_dict[task_packet["callback_id"]]
            callback_type = task_packet["callback_type"]
            if task_packet["status"] in error_response_statuses and error_handler is not None:
                if callback_type == "callback_with_context":
                    cdata = callback_data_dict[task_packet["callback_id"]]
                    del callback_data_dict[task_packet["callback_id"]]
                    error_handler(task_packet, cdata)
                else:
                    error_handler(task_packet)
            elif callback_type == "callback_with_context":
                cdata = callback_data_dict[task_packet["callback_id"]]
                del callback_data_dict[task_packet["callback_id"]]
                func(task_packet["response_data"], cdata)
            else:
                func(task_packet["response_data"])
        except Exception as ex:
            special_string = "Error handling callback for task type {} for my_id {}".format(task_packet["task_type"],
                                                                                            self.my_id)
            self.handle_exception(ex, special_string)
        return

    def handle_event(self, task_packet):
        task_type = task_packet["task_type"]
        print("Handling task type {}".format(task_type))
        if task_type in task_worthy_methods:
            if task_worthy_methods[task_type] == "tilebase" and "tilebase" not in self.handler_instances:
                debug_log("it seems like tilebase is not ready yet. skipping event {}".format(task_type))
                response_data = None
            else:
                try:
                    response_data = getattr(self.handler_instances[task_worthy_methods[task_type]], task_type)(task_packet["task_data"])
                except Exception as ex:
                    special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                          self.my_id)
                    response_data = self.handle_exception(ex, special_string)

            if task_packet["callback_id"] is not None:
                try:
                    task_packet["response_data"] = response_data
                    self.submit_response(task_packet)
                except Exception as ex:
                    special_string = "Error submitting response for task type {} for my_id {}".format(task_type,
                                                                                                      self.my_id)
                    debug_log(self.extract_short_error_message(ex, special_string))

        elif task_type in task_worthy_manual_submit_methods:
            try:
                getattr(self.handler_instances[task_worthy_manual_submit_methods[task_type]], task_type)(task_packet["task_data"], task_packet)
            except Exception as ex:
                special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                      self.my_id)
                response_data = self.handle_exception(ex, special_string)
                task_packet["response_data"] = response_data
                self.submit_response(task_packet)
        else:
            debug_log("Ignoring task type {} for my_id {}".format(task_type, self.my_id))
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
            self.connection, self.channel = get_pika_connection_with_retries(0)
            if self.connection is None:
                debug_log("Couldn't create pika connection for blocking worker")
                return
            self.channel.queue_declare(queue=self.queue_name, durable=False, exclusive=False)
            self.callback_queue = self.queue_name
            self.channel.basic_consume(
                queue=self.callback_queue,
                on_message_callback=self.on_response,
                auto_ack=True)
        except Exception as ex:
            debug_log("Couldn't start blocking worker")
            print(self.handle_exception(ex, "Here's the error"))

    def reset_me(self):
        self.connection.close()
        self.initialize_me()

    def post_blocking_wait(self, dest_id, task_packet, retries=10):
        max_retries = 3
        try:
            if self.channel.is_closed:  # If closed, take one crack at fixing
                self.connection.close()
                self.initialize_me()
                time.sleep(1)
            self.response = None
            channel = self.channel
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
            while self.response is None:
                self.connection.process_data_events()
            self.current_callback_id = None
            return self.response
        except Exception as ex:
            debug_log(self.handle_exception(ex, "Got an exception in post_blocking wait"))
            if retries == 0:
                return "__ERROR__"
            else:
                self.initialize_me()
                time.sleep(1)
                self.post_blocking_wait(dest_id, task_packet, retries - 1)

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
