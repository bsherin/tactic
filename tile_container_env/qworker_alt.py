import threading

import pika
import uuid
import time
import datetime
import json
import os
import sys
import copy
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


if "USE_WAIT_TASKS" in os.environ:
    use_wait_tasks = os.environ.get("USE_WAIT_TASKS") == "True"
else:
    use_wait_tasks = False

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

def get_pika_connection(retries=10):
    try:
        global pika_channels
        global pika_connections
        current_thread = my_thread()
        params = pika.ConnectionParameters(
            heartbeat=600,
            blocked_connection_timeout=300,
            host="megaplex",
            port=5672,
            virtual_host='/'
        )
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        pika_connections[current_thread] = connection
        pika_channels[current_thread] = channel
        return channel
    except Exception as ex:
        print("Couldn't connect to pika")
        if retries == 0:
            print("giving up on getting pika connection")
            print(self.handle_exception(ex, "Here's the error"))
            return None
        else:
            debug_log("sleeping ...")
            time.sleep(3)
            new_retries = retries - 1
            get_pika_connection(retries=new_retries)

def my_thread():
    return threading.current_thread().name

def my_channel():
    if my_thread() in pika_channels:
        return pika_channels[my_thread()]
    else:
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

# noinspection PyTypeChecker,PyUnusedLocal,PyMissingConstructor
class QWorker(ExceptionMixin):
    def __init__(self):
        self.my_id = os.environ.get("MY_ID")
        self.handler_instances = {"this_worker": self}
        self.generate_heartbeats = False
        self.last_heartbeat = current_timestamp()

    def start_background_thread(self, retries=10):
        try:
            channel = get_pika_connection()
            # if use_wait_tasks:
            #     wait_queue = self.my_id + "_wait"
            #     wait_worker = BlockingWaitWorker(wait_queue)
            #     wait_workers[my_thread()] = wait_worker
            if channel is None:
                return
            channel.queue_declare(queue=self.my_id, durable=False, exclusive=False)
            channel.basic_consume(queue=self.my_id, auto_ack=True, on_message_callback=self.handle_delivery)
            debug_log(' [*] Waiting for messages:')
            self.ready()
            channel.start_consuming()
        except Exception as ex:
            debug_log("problem starting background thread")
            if retries == 0:
                debug_log("giving up. No more processing of tasks by this qworker")
                debug_log(self.handle_exception(ex, "Here's the error"))
            else:
                debug_log("sleeping ...")
                time.sleep(3)
                new_retries = retries - 1
                self.start_background_thread(retries=new_retries)

    def interrupt_and_restart(self):
        global thread
        global thread_lock
        my_channel().queue_delete(queue=self.my_id)
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

    def do_heartbeat(self):
        if self.generate_heartbeats:
            current_time = current_timestamp()
            if (current_time - self.last_heartbeat) > heartbeat_time:
                self.post_task("host", "container_heartbeat", {"container_id": self.my_id})
                self.last_heartbeat = current_time
        return

    def handle_delivery(self, channel, method, props, body):
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
        channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
        channel.basic_publish(exchange='',
                              routing_key=dest_id,
                              properties=pika.BasicProperties(
                                  reply_to=reply_to,
                                  correlation_id=callback_id,
                                  delivery_mode=1
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
        wait_worker = my_wait_worker()
        if wait_worker is None:
            wait_queue = my_thread() + "_wait"
            wait_worker = BlockingWaitWorker(wait_queue)
            wait_workers[my_thread()] = wait_worker
        callback_id = str(uuid.uuid4())

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
        if resp == "__ERROR__":
            error_string = "Got post_blocking_wait error with msg_type {}, destination {}, and source {}".format(task_type,
                                                                                                                 dest_id,
                                                                                                                 self.my_id)
            debug_log(error_string)
            raise MessagePostException(error_string)
        else:
            return resp

    def on_wait_esponse(self, ch, method, props, body):
        the_body = json.loads(body)
        # It's possible there's an old response if the user killed a thread earlier
        # If so, we'll ignore it
        if the_body["callback_id"] == self.current_callback_id:
            self.wait_response = the_body["response_data"]
        else:
            self.wait_response = None


    def post_blocking_wait(self, dest_id, task_packet, retries=10):
        max_retries = 3

        try:
            print("in post_blocking wait with mythread " + my_thread())
            channel = my_channel()
            self.wait_response = None
            self.current_callback_id = task_packet["callback_id"]
            self.corr_id = str(uuid.uuid4())
            channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
            channel.basic_publish(
                exchange='',
                routing_key=dest_id,
                properties=pika.BasicProperties(
                    reply_to=self.callback_queue,
                    correlation_id=self.corr_id,
                    delivery_mode=1
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

    def initialize_me(self, retries=10):
        try:
            params = pika.ConnectionParameters(
                heartbeat=600,
                blocked_connection_timeout=300,
                host="megaplex",
                port=5672,
                virtual_host='/'
            )
            self.connection = pika.BlockingConnection(params)
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue=self.queue_name, durable=False, exclusive=False)
            self.callback_queue = self.queue_name
            self.channel.basic_consume(
                queue=self.callback_queue,
                on_message_callback=self.on_response,
                auto_ack=True)
        except Exception as ex:
            debug_log("Couldn't start blocking worker")
            if retries == 0:
                print("giving up. No more processing of tasks by this qworker")
                print(self.handle_exception(ex, "Here's the error"))
            else:
                print(self.handle_exception(ex, "Here's the error"))
                time.sleep(3)
                new_retries = retries - 1
                self.initialize_me(retries=new_retries)

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
            channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
            channel.basic_publish(
                exchange='',
                routing_key=dest_id,
                properties=pika.BasicProperties(
                    reply_to=self.callback_queue,
                    correlation_id=self.corr_id,
                    delivery_mode=1
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
