import gevent
import copy
import uuid
import sys
import time
import requests
import os
from communication_utils import send_request_to_container
import cPickle

callback_dict = {}

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

SHORT_SLEEP_PERIOD = float(os.environ.get("SHORT_SLEEP_PERIOD"))
LONG_SLEEP_PERIOD = float(os.environ.get("LONG_SLEEP_PERIOD"))

task_worthy_methods = []


def task_worthy(m):
    task_worthy_methods.append(m.__name__)
    return m


class QWorker(gevent.Greenlet):
    def __init__(self, app, megaplex_address, my_id):
        gevent.Greenlet.__init__(self)
        self.megaplex_address = megaplex_address
        self.my_id = my_id
        self.app = app

    def debug_log(self, msg):
        with self.app.test_request_context():
            self.app.logger.debug(msg)

    def get_next_task(self):
        raw_result = send_request_to_container(self.megaplex_address, "get_next_task/" + self.my_id)
        task_packet = raw_result.json()
        return task_packet

    def post_and_wait(self, dest_id, task_type, task_data=None, sleep_time=.1, timeout=10, tries=30):
        callback_id = str(uuid.uuid4())
        new_packet = {"source": self.my_id,
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "callback_id": callback_id}
        self.debug_log("in post and wait with new_packet " + str(new_packet))
        result = send_request_to_container(self.megaplex_address, "post_wait_task", new_packet)
        for i in range(tries):
            res = send_request_to_container(self.megaplex_address, "check_wait_task", new_packet).json()
            if res["success"]:
                self.app.logger.debug("Got result to post_and_wait")
                return res["result"]
            else:
                self.app.logger.debug("No result yet for post_and_wait after tries " + str(i))
                time.sleep(sleep_time)
        error_string = "post_and_wait timed out with msg_type {}, destination {}, and source".format(task_type, dest_id, self.my_id)
        self.app.logger.debug(error_string)
        raise Exception(error_string)

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None):
        if callback_func is not None:
            callback_id = str(uuid.uuid4())
            callback_dict[callback_id] = callback_func
        else:
            callback_id = None
        new_packet = {"source": self.my_id,
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "callback_id": callback_id}
        result = send_request_to_container(self.megaplex_address, "post_task", new_packet).json()
        if not result["success"]:
            error_string = "Error posting task with msg_type {} dest {} source {}. Error: {}".format(task_type,
                                                                                                     dest_id,
                                                                                                     self.my_id,
                                                                                                     result["message"])
            raise Exception(error_string)
        return result

    def submit_response(self, task_packet):
        send_request_to_container(self.megaplex_address, "submit_response", task_packet)
        return

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
                    if task_packet["response_data"] is not None:
                        try:
                            func = callback_dict[task_packet["callback_id"]]
                            del callback_dict[task_packet["callback_id"]]
                            if isinstance(task_packet["response_data"], Binary):
                                task_packet["response_data"] = cPickle.loads(encoded_val.decode("utf-8", "ignore").encode("ascii"))
                            func(task_packet["response_data"])
                        except Exception as ex:
                            special_string = "Error handling callback for task type {} for my_id {}".format(task_packet["task_type"],
                                                                                                            self.my_id)
                            self.handle_exception(ex, special_string)
                    else:
                        self.handle_event(task_packet)
                    gevent.sleep(SHORT_SLEEP_PERIOD)
                else:
                    gevent.sleep(LONG_SLEEP_PERIOD)

    def handle_event(self, task_packet):
        if hasattr(self, task_packet["task_type"]):
            if task_packet["task_type"] in task_worthy_methods:
                try:
                    response_data = getattr(self, task_packet["task_type"])(task_packet["task_data"])
                except Exception as ex:
                    special_string = "Error handling task of type {} for my_id {}".format(task_packet["task_type"],
                                                                                          self.my_id)
                    response_data = "__ERROR__"
                    self.handle_exception(ex, special_string)
                if task_packet["callback_id"] is not None:
                    try:
                        task_packet["response_data"] = response_data
                        self.submit_response(task_packet)
                    except Exception as ex:
                        special_string = "Error submitting response for task type {} for my_id {}".format(task_packet["task_type"],
                                                                                                         self.my_id)
                        self.handle_exception(ex, special_string)
            else:
                self.debug_log("Got invalid task type for my_id ".format(self.my_id))
        return
