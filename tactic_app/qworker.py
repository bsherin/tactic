
from __future__ import print_function
import gevent
import pika
import uuid
import time
import datetime
import json
import os
import sys
import copy
from communication_utils import emit_direct, socketio
import communication_utils
from exception_mixin import ExceptionMixin, MessagePostException
from threading import Lock

PAUSE_TIME = .01

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


# noinspection PyTypeChecker,PyUnusedLocal
class QWorker(ExceptionMixin):
    def __init__(self):
        # gevent.Greenlet.__init__(self)
        self.my_id = os.environ.get("MY_ID")
        self.handler_instances = {"this_worker": self}
        self.channel = None
        self.connection = None
        self.generate_heartbeats = False
        self.last_heartbeat = current_timestamp()
        if use_wait_tasks:
            wait_queue = self.my_id + "_wait"
            self.wait_worker = BlockingWaitWorker(wait_queue)

    def start_background_thread(self, retries=0):
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
            self.channel.queue_declare(queue=self.my_id, durable=False, exclusive=False)
            self.channel.basic_consume(queue=self.my_id, auto_ack=True, on_message_callback=self.handle_delivery)
            debug_log(' [*] Waiting for messages:')
            self.ready()
            self.channel.start_consuming()
        except Exception as ex:
            debug_log("Couldn't connect to pika")
            if retries > max_pika_retries:
                debug_log("giving up. No more processing of tasks by this qworker")
                debug_log(self.handle_exception(ex, "Here's the error"))
            else:
                debug_log("sleeping ...")
                gevent.sleep(3)
                new_retries = retries + 1
                self.start_background_thread(retries=new_retries)

    def interrupt_and_restart(self):
        global thread
        global thread_lock
        self.channel.queue_delete(queue=self.my_id)
        self.connection.close()
        thread.kill()
        thread = None
        # thread_lock.release()
        self.start()
        return

    def start(self):
        global thread
        with thread_lock:
            if thread is None:
                thread = socketio.start_background_task(target=self.start_background_thread)
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
            # debug_log("in handle_delivery with task_type {}".format(task_packet["task_type"]))
            if task_packet["status"] in response_statuses:
                self.handle_response(task_packet)
            else:
                self.handle_event(task_packet)
            gevent.sleep(PAUSE_TIME)
        except Exception as ex:
            special_string = "Got error in handle delivery"
            debug_log(special_string)
            debug_log(self.handle_exception(ex, special_string))
        return

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        self.channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
        self.channel.basic_publish(exchange='',
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
            # self.channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
            self.post_packet(dest_id, new_packet, reply_to, callback_id)
            gevent.sleep(PAUSE_TIME)
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

        new_packet = {"source": self.my_id,
                      "callback_type": "wait",
                      "callback_id": callback_id,
                      "status": "presend",
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "reply_to": self.wait_worker.my_id,
                      "expiration": None}

        # noinspection PyNoneFunctionAssignment@
        resp = self.wait_worker.post_blocking_wait(dest_id, new_packet)
        gevent.sleep(PAUSE_TIME)
        if resp == "__ERROR__":
            error_string = "Got post_blocking_wait error with msg_type {}, destination {}, and source {}".format(task_type,
                                                                                                                 dest_id,
                                                                                                                 self.my_id)
            debug_log(error_string)
            raise MessagePostException(error_string)
        else:
            return resp

    def submit_response(self, task_packet, response_data=None):
        if response_data is not None:
            task_packet["response_data"] = response_data
        task_packet["status"] = "submitted_response"

        if "client_post" in task_packet:

            if "room" in task_packet:
                room = task_packet["room"]
            else:
                room = task_packet["main_id"]
                task_packet["room"] = room
            if "namespace" in task_packet:
                namespace = task_packet["namespace"]
            else:
                namespace = "/main"
            emit_direct("handle-callback", task_packet, namespace=namespace, room=room)
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


# noinspection PyUnusedLocal
class BlockingWaitWorker(ExceptionMixin):
    def __init__(self, queue_name):
        self.queue_name = queue_name
        self.current_callback_id = None
        self.initialize_me()

    def initialize_me(self, retries=0):
        try:
            params = pika.ConnectionParameters(
                heartbeat=600,
                blocked_connection_timeout=300,
                host="megaplex",
                port=5672,
                virtual_host='/'
            )
            self.my_id = self.queue_name
            self.connection = pika.BlockingConnection(params)

            self.channel = self.connection.channel()

            self.channel.queue_declare(queue=self.queue_name, durable=False, exclusive=False)
            self.callback_queue = self.queue_name

            self.channel.basic_consume(
                queue=self.callback_queue,
                on_message_callback=self.on_response,
                auto_ack=True)
        except Exception as ex:
            debug_log("Couldn't connect to pika in Blocking worker")
            if retries > max_pika_retries:
                debug_log("giving up. No more processing of tasks by this qworker")
                debug_log(self.handle_exception(ex, "Here's the error"))
            else:
                debug_log("sleeping ...")
                gevent.sleep(3)
                new_retries = retries + 1
                self.initialize_me(retries=new_retries)

    def reset_me(self):
        self.connection.close()
        self.initialize_me()

    def post_blocking_wait(self, dest_id, task_packet, retries=0):
        max_retries = 3
        try:
            if self.channel.is_closed:  # If closed, take one crack at fixing
                self.connection.close()
                self.initialize_me()
                time.sleep(1)
            self.response = None
            self.current_callback_id = task_packet["callback_id"]
            self.corr_id = str(uuid.uuid4())
            self.channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
            self.channel.basic_publish(
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
            if retries > max_retries:
                return "__ERROR__"
            else:
                self.initialize_me()
                time.sleep(1)
                self.post_blocking_wait(dest_id, task_packet, retries + 1)

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
