import gevent
import uuid
import time
import datetime
import os
import copy
from communication_utils import send_request_to_megaplex
import communication_utils

callback_dict = {}
callback_data_dict = {}

response_statuses = ["submitted_response", "submitted_response_with_error", "unclaimed", "unanswered"]
error_response_statuses = ["submitted_response_with_error", "unclaimed", "unanswered"]

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

SHORT_SLEEP_PERIOD = .01
HIBERNATE_TIME = .1
GAP_TIME_FOR_HIBERATE = 100

if "MEGAPLEX_ADDRESS" in os.environ:
    communication_utils.megaplex_address = os.environ.get("MEGAPLEX_ADDRESS")
    communication_utils.am_host = False
else:
    communication_utils.am_host = True

print "got megaplex " + str(communication_utils.megaplex_address)

if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60


task_worthy_methods = {}
task_worthy_manual_submit_methods = {}


def task_worthy(m):
    task_worthy_methods[m.__name__] = "this_worker"
    return m


def task_worthy_manual_submit(m):
    task_worthy_manual_submit_methods[m.__name__] = "this_worker"
    return m


# noinspection PyTypeChecker
class QWorker(gevent.Greenlet):
    def __init__(self):
        self.short_sleep_period = SHORT_SLEEP_PERIOD
        self.hibernate_time = HIBERNATE_TIME
        self.gap_time_for_hiberate = GAP_TIME_FOR_HIBERATE
        gevent.Greenlet.__init__(self)
        self.last_contact = datetime.datetime.utcnow()
        if "MY_ID" in os.environ:
            self.my_id = os.environ.get("MY_ID")
        else:
            self.my_id = "host"
        print "my_id is " + self.my_id
        self.hibernating = False
        self.handler_instances = {"this_worker": self}

    def debug_log(self, msg):
        timestring = datetime.datetime.utcnow().strftime("%b %d, %Y, %H:%M:%S")
        print timestring + ": " + msg
        # with self.app.test_request_context():
        #     self.app.logger.debug(msg)

    def get_next_task(self):
        raw_result = send_request_to_megaplex("get_next_task/" + str(self.my_id))
        task_packet = raw_result.json()
        return task_packet

    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1, timeout=10, tries=RETRIES):
        callback_id = str(uuid.uuid4())
        new_packet = {"source": self.my_id,
                      "callback_type": "wait",
                      "callback_id": callback_id,
                      "status": "presend",
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "expiration": None}
        # self.debug_log("in post and wait with new_packet " + str(new_packet))
        send_request_to_megaplex("post_wait_task", new_packet)
        for i in range(tries):
            res = send_request_to_megaplex("check_wait_task", new_packet).json()
            if res["success"]:
                return res["result"]
            else:
                time.sleep(sleep_time)
        error_string = "post_and_wait timed out with msg_type {}, destination {}, and source".format(task_type,
                                                                                                     dest_id,
                                                                                                     self.my_id)
        self.debug_log(error_string)
        raise Exception(error_string)

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None, callback_data=None, expiration=None):
        if callback_func is not None:
            callback_id = str(uuid.uuid4())
            callback_dict[callback_id] = callback_func
            if callback_data is not None:
                cdata = copy.copy(callback_data)
                callback_data_dict[callback_id] = cdata
                callback_type = "callback_with_context"
            else:
                callback_type = "callback_no_context"
        else:
            callback_id = None
            callback_type = "no_callback"

        new_packet = {"source": self.my_id,
                      "status": "presend",
                      "callback_type": callback_type,
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "callback_id": callback_id,
                      "expiration": expiration}
        result = send_request_to_megaplex("post_task", new_packet).json()
        if not result["success"]:
            error_string = "Error posting task with msg_type {} dest {} source {}. Error: {}".format(task_type,
                                                                                                     dest_id,
                                                                                                     self.my_id,
                                                                                                     result["message"])
            raise Exception(error_string)
        return result

    def submit_response(self, task_packet, response_data=None):
        if response_data is not None:
            task_packet["response_data"] = response_data
        send_request_to_megaplex("submit_response", task_packet)
        return

    def special_long_sleep_function(self):
        pass

    def _run(self):
        self.debug_log("Entering _run")
        self.running = True
        while self.running:
            try:
                task_packet = self.get_next_task()
            except Exception as ex:
                special_string = "Error in get_next_task for my_id {}".format(self.my_id)
                self.handle_exception(ex, special_string)
            else:
                if "empty" not in task_packet:
                    if task_packet["status"] in response_statuses:
                        try:
                            func = callback_dict[task_packet["callback_id"]]
                            del callback_dict[task_packet["callback_id"]]
                            callback_type = task_packet["callback_type"]
                            if callback_type == "callback_with_context":
                                cdata = callback_data_dict[task_packet["callback_id"]]
                                del callback_data_dict[task_packet["callback_id"]]
                                func(task_packet["response_data"], cdata)
                            else:
                                func(task_packet["response_data"])
                        except Exception as ex:
                            special_string = "Error handling callback for task type {} for my_id {}".format(task_packet["task_type"],
                                                                                                            self.my_id)
                            self.handle_exception(ex, special_string)
                    else:
                        self.handle_event(task_packet)
                    if self.hibernating:
                        print "left hibernation"
                        self.hibernating = False
                    self.last_contact = datetime.datetime.utcnow()
                    gevent.sleep(self.short_sleep_period)
                else:
                    self.special_long_sleep_function()
                    current_time = datetime.datetime.utcnow()
                    tdelta = current_time - self.last_contact
                    delta_seconds = tdelta.days * 24 * 60 + tdelta.seconds
                    if delta_seconds > self.gap_time_for_hiberate:
                        if not self.hibernating:
                            print "hibernating"
                            self.hibernating = True
                        gevent.sleep(self.hibernate_time)
                    else:
                        gevent.sleep(self.short_sleep_period)

    def handle_event(self, task_packet):
        task_type = task_packet["task_type"]
        if task_type in task_worthy_methods:
            try:
                response_data = getattr(self.handler_instances[task_worthy_methods[task_type]], task_type)(task_packet["task_data"])
            except Exception as ex:
                special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                      self.my_id)
                response_data = "__ERROR__"
                self.handle_exception(ex, special_string)
            if task_packet["callback_id"] is not None:
                try:
                    task_packet["response_data"] = response_data
                    self.submit_response(task_packet)
                except Exception as ex:
                    special_string = "Error submitting response for task type {} for my_id {}".format(task_type,
                                                                                                      self.my_id)
                    self.handle_exception(ex, special_string)

        elif task_type in task_worthy_manual_submit_methods:
            try:
                getattr(self.handler_instances[task_worthy_manual_submit_methods[task_type]], task_type)(task_packet["task_data"], task_packet)
            except Exception as ex:
                special_string = "Error handling task of type {} for my_id {}".format(task_type,
                                                                                      self.my_id)
                self.handle_exception(ex, special_string)
        else:
            self.debug_log("Ignoring task type {} for my_id {}".format(task_type, self.my_id))
        return

    def handle_exception(self, ex, special_string=None):
        print "handle exception not implemented in qworker subclass"
