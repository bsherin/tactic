from flask import jsonify
import queue
import datetime
import os
import copy

DEBUG = True

MAX_QUEUE_LENGTH = int(os.environ.get("MAX_QUEUE_LENGTH"))
print("max_queue_length is " + str(MAX_QUEUE_LENGTH))

timeout_on_queue_full = .01


def handle_exception(ex, special_string=None):
    if special_string is None:
        template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
    else:
        template = "<pre>" + special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}</pre>"
    error_string = template.format(type(ex).__name__, ex.args)
    return error_string


class TaskManager(object):
    data_template = "cid: {}\ttasks: {}\tresponses: {}\twait_dict: {}\texpiration_dict: {}\texpired_tasks: {}"
    task_template = "source: {}\tdest: {}\ttask_type: {}"

    def __init__(self, my_id, queue_dict):
        self.my_id = my_id
        self.tasks = queue.Queue(maxsize=MAX_QUEUE_LENGTH)
        self.responses = queue.Queue()
        self.wait_dict = {}
        self.expiration_dict = {}
        self.queue_dict = queue_dict
        self.expired_tasks = []

    def post_task(self, task_packet):
        try:
            task_packet["status"] = "on_megaplex_queue"
            if DEBUG:
                print(self.task_template.format(task_packet["source"], task_packet["dest"], task_packet["task_type"]))
            self.tasks.put(task_packet, block=True, timeout=timeout_on_queue_full)
        except Exception as ex:
            print (handle_exception(ex, special_string="Couldnt post task"))
            return {"success": False, "message": "Error posting task"}
        return {"success": True}

    def get_data_string(self):
        return self.data_template.format(self.my_id, self.tasks.qsize(), self.responses.qsize(),
                                    len(self.wait_dict), len(self.expiration_dict), len(self.expired_tasks))

    def record_expiration_task(self, task_packet):
        task_packet = copy.copy(task_packet)
        task_packet["time_received"] = datetime.datetime.utcnow()
        task_packet["status"] = "unclaimed"
        cbid = task_packet["callback_id"]
        self.expiration_dict[cbid] = task_packet
        return

    def add_wait_task(self, cbid):
        self.wait_dict[cbid] = None
        return

    def check_wait_task_result(self, cbid):
        result = self.wait_dict[cbid]
        if result is None:
            return jsonify({"success": False})
        else:
            del self.wait_dict[cbid]
            return jsonify({"success": True, "result": result})

    def remove_task(self, cbid):
        for tn, tb in enumerate(self.tasks.queue):
            if tb["callback_id"] == cbid:
                del self.tasks.queue[tn]
                break
        return

    def clear_expired_tasks(self):
        if self.expiration_dict.keys():
            current_time = datetime.datetime.utcnow()
            for cbid, tp in self.expiration_dict.items():
                if tp["expiration"] is not None:
                    tdelta = current_time - tp["time_received"]
                    delta_seconds = tdelta.total_seconds()
                    if delta_seconds > tp["expiration"]:
                        del self.expiration_dict[cbid]
                        if tp["status"] == "claimed":
                            tp["status"] = "unanswered"
                        if tp["status"] == "unclaimed":
                            self.queue_dict[tp["dest"]].remove_task(cbid)
                        self.got_response(tp)
                        self.expired_tasks.append(cbid)
        return

    def mark_task_claimed(self, cbid):
        self.expiration_dict[cbid]["status"] = "claimed"
        return

    def get_next_task(self):
        self.clear_expired_tasks()
        if not self.responses.empty():
            task_packet = self.responses.get()
            return jsonify(task_packet)
        if not self.tasks.empty():
            task_packet = self.tasks.get()
            if task_packet["expiration"] is not None:
                self.queue_dict[task_packet["source"]].mark_task_claimed(task_packet["callback_id"])
            return jsonify(task_packet)
        else:
            return jsonify({"empty": True})

    def got_response(self, task_packet):
        cbid = task_packet["callback_id"]
        if cbid is not None and cbid in self.wait_dict:
            self.wait_dict[cbid] = task_packet["response_data"]
        else:
            if cbid not in self.expired_tasks:
                self.responses.put(task_packet)
                if cbid in self.expiration_dict:
                    del self.expiration_dict[cbid]

        return jsonify({"success": True})
