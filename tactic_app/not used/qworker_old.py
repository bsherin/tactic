
from __future__ import print_function
import gevent
import pika
import uuid
import time
import datetime
import json
import os
import copy
from communication_utils import emit_direct
import communication_utils
from exception_mixin import ExceptionMixin, MessagePostException

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


# print("got megaplex " + str(communication_utils.megaplex_address))

RETRIES = 60


task_worthy_methods = {}
task_worthy_manual_submit_methods = {}


def task_worthy(m):
    task_worthy_methods[m.__name__] = "this_worker"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "this_worker"
    return m


print("in the new qworker with new submit_response")


# noinspection PyTypeChecker
class QWorker(ExceptionMixin):
    def __init__(self):
        # gevent.Greenlet.__init__(self)
        self.last_contact = datetime.datetime.utcnow()
        self.my_id = os.environ.get("MY_ID")
        self.handler_instances = {"this_worker": self}
        self.channel = None
        self.connection = None
        self.post_channel = None
        if use_wait_tasks:
            wait_queue = self.my_id + "_wait"
            self.wait_worker = BlockingWaitWorker(wait_queue)
            # self.wait_worker.start()

    def on_connected(self, connection):
        """Called when we are fully connected to RabbitMQ"""
        print("in on_connected")
        connection.channel(on_open_callback=self.on_channel_open)
        self.post_channel = connection.channel()

    def on_channel_open(self, new_channel):
        """Called when our channel has opened"""
        print("in on_channel_open")
        self.channel = new_channel
        self.channel.queue_declare(queue=self.my_id, callback=self.on_queue_declared, durable=False, exclusive=False)

    def on_queue_declared(self, frame):
        print("queue declared")
        """Called when RabbitMQ has told us our Queue has been declared, frame is the response from RabbitMQ"""
        self.channel.basic_qos(
            prefetch_count=11, callback=self.on_basic_qos_ok)

    def on_basic_qos_ok(self, frame):
        """Called when RabbitMQ has told us our Queue has been declared, frame is the response from RabbitMQ"""
        try:
            self.channel.basic_consume(queue=self.my_id, auto_ack=True, on_message_callback=self.handle_delivery)
        except Exception as ex:
            print(self.handle_exception(ex, special_string))

    def debug_log(self, msg):
        timestring = datetime.datetime.utcnow().strftime("%b %d, %Y, %H:%M:%S")
        print(timestring + ": " + msg)

    def handle_delivery(self, channel, method, props, body):
        print("in the modified handle_delivery")
        try:
            task_packet = json.loads(body)
            print("in handle_delivery with task_type {}".format(task_packet["task_type"]))
            if task_packet["status"] in response_statuses:
                print("it's a response")
                self.handle_response(task_packet)
            else:
                print("it's an event")
                self.handle_event(task_packet)
        except Exception as ex:
            special_string = "Got error in handle delivery"
            print(self.handle_exception(ex, special_string))
        return

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        self.post_channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
        print("in post_packet with task_type {}".format(task_packet["task_type"]))
        self.post_channel.basic_publish(exchange='',
                                        routing_key=dest_id,
                                        properties=pika.BasicProperties(
                                           reply_to=reply_to,
                                           correlation_id=callback_id,
                                           delivery_mode=1
                                        ),
                                        body=json.dumps(task_packet))
        return

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, error_handler=None):

        try:
            if callback_func is not None:
                callback_id = str(uuid.uuid4())
                reply_to = self.my_id
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

            result = {"success": True}

        except Exception as ex:
            special_string = "Error handling callback for task type {} for my_id {}".format(task_type, self.my_id)
            error_string = self.handle_exception(ex, special_string)
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

        # noinspection PyNoneFunctionAssignment
        resp = self.wait_worker.post_blocking_wait(dest_id, new_packet)

        if resp == "__ERROR__":
            error_string = "post_and_wait timed out with msg_type {}, destination {}, and source".format(task_type,
                                                                                                         dest_id,
                                                                                                         self.my_id)
            self.debug_log(error_string)
            raise MessagePostException(error_string)
        else:
            return resp

    def submit_response(self, task_packet, response_data=None, alt_address=None):
        if response_data is not None:
            task_packet["response_data"] = response_data
        task_packet["status"] = "submitted_response"
        print("in modified submit_response")
        if "client_post" in task_packet:
            print("emitting direct response")
            if "room" in task_packet:
                room = task_packet["room"]
            else:
                room = task_packet["main_id"]
            if "namespace" in task_packet:
                namespace = task_packet["namespace"]
            else:
                namespace = "/main"
            emit_direct("handle-callback", task_packet, namespace=namespace, room=room)
        else:
            self.post_packet(task_packet["reply_to"], task_packet, callback_id=task_packet["callback_id"])
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
                    print(self.extract_short_error_message(ex, special_string))

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
            self.debug_log("Ignoring task type {} for my_id {}".format(task_type, self.my_id))
        return

    def handle_exception(self, ex, special_string=None):
        return self.extract_short_error_message(ex, special_string)

    def on_connection_closed(self, _unused_connection, reason):
        self.channel = None
        print('Connection closed, reconnect necessary: {}'.format(reason))
        self.connect()

    def on_channel_closed(self, channel, reason):
        print('Channel closed, reconnect necessary: {}'.format(reason))
        self.channel = None
        self.connection.ioloop.stop()
        if not (self.connection.is_closing or self.connection.is_closed):
            self.connection.close()
        self.connect()

    def connect(self):
        taddress = communication_utils.megaplex_address
        params = pika.ConnectionParameters(
            host=taddress,
            port=5672,
            virtual_host='/'
        )

        print("connecting")
        try:
            self.connection = pika.SelectConnection(params,
                                                    on_open_callback=self.on_connected,
                                                    on_open_error_callback=self.on_connection_open_error,
                                                    on_close_callback=self.on_connection_closed)
        except Exception as ex:
            print(self.handle_exception(ex, "Error creating connection"))
        print("about to start ioloop")
        self.connection.ioloop.start()

    def on_connection_open_error(self, _unused_connection, err):
        print("error opening connection. I'll try again.")
        self.connect()

    def _run(self):
        print("starting qworker")
        try:
            self.connect()
        except Exception as ex:
            print(self.handle_exception(ex, "Error in _run"))


class BlockingWaitWorker:
    def __init__(self, queue_name):
        taddress = communication_utils.megaplex_address
        params = pika.ConnectionParameters(
            host=taddress,
            port=5672,
            virtual_host='/'
        )
        self.my_id = queue_name
        self.connection = pika.BlockingConnection(params)

        self.channel = self.connection.channel()

        self.channel.queue_declare(queue=queue_name, durable=False, exclusive=False)
        self.callback_queue = queue_name

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

    def post_blocking_wait(self, dest_id, task_packet):
        self.response = None
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
        return self.response

    def on_response(self, ch, method, props, body):
        self.response = json.loads(body)["response_data"]
