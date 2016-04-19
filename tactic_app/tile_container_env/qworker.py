import gevent
from gevent import monkey; monkey.patch_all()
import copy
import uuid

callback_dict = {}

blank_packet = {"source": None,
                "dest": None,
                "task_type": None,
                "task_data": None,
                "response_data": None,
                "callback_id": None}

_sleepperiod = .0001


def send_request_to_container(taddress, msg_type, data_dict=None, wait_for_success=True,
                              timeout=3, tries=30, wait_time=.1):
    if wait_for_success:
        for attempt in range(tries):
            try:
                res = requests.post("http://{0}:5000/{1}".format(taddress, msg_type),
                                    timeout=timeout, json=data_dict)
                return res
            except:
                error_string = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                time.sleep(wait_time)
                continue
    else:
        return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)


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
        task_packet = send_request_to_container(self.megaplex_address, "get_next_task/" + my_id).json()
        return task_packet

    def post_task(self, dest_id, task_type, task_data=None, callback_func=None):
        if callback_func is not None:
            callback_id = str(uuid.uuid4())
            callback_dict[callback_id] = callback_func
        new_packet = {"source": self.my_id,
                      "dest": dest_id,
                      "task_type": task_type,
                      "task_data": task_data,
                      "response_data": None,
                      "callback_id": callback_id}
        send_request_to_container(self.megaplex_address, "post_task", new_packet)
        return

    def post_response(self, task_packet):
        send_request_to_container(self.megaplex_address, "post_response", task_packet)
        return

    def _run(self):
        self.running = True
        while self.running:
            task_packet = self.get_next_task()
            if not task_packet == "empty":
                if task_packet["response_data"] is not None:
                    func = callback_dict[task_packet["callback_id"]]
                    del callback_dict[task_packet["callback_id"]]
                    func(task_packet["response_data"])
                else:
                    self.handle_event(task_packet)
            gevent.sleep(_sleepperiod)

    def handle_event(self, task_packet):
        response_data = getattr(self, task_packet["task_type"])(task_packet[task_data])
        if task_packet["callback_id"] is not None:
            task_packet["response_data"] = response_data
            self.submit_response(task_packet)
        return