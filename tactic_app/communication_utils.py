import requests
import sys
import time
import os

if ("USE_FORWARDER" in os.environ) and (os.environ.get("USE_FORWARDER") == "True"):
    USE_FORWARDER = True
    from docker_functions import forwarder_address
else:
    USE_FORWARDER = False


if "RETRIES" in os.environ:
    RETRIES = int(os.environ.get("RETRIES"))
else:
    RETRIES = 60


def send_request_to_container(taddress, msg_type, data_dict=None, wait_for_success=True,
                              timeout=3, tries=RETRIES, wait_time=.1):
    last_fail = ""
    if USE_FORWARDER:
        if data_dict is None:
            data_dict = {}
        data_dict["msg_type"] = msg_type
        data_dict["forwarding_address"] = taddress
        data_dict["wait_for_success"] = wait_for_success
        msg_type = "forward_message"
        taddress = "0.0.0.0"
        port = "8080"
    else:
        port = "5000"

    if wait_for_success:
        for attempt in range(tries):
            try:
                res = requests.post("http://{0}:{1}/{2}".format(taddress, port, msg_type),
                                    timeout=timeout, json=data_dict)
                return res
            except:
                last_fail = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
                time.sleep(wait_time)
                continue
        error_string = "Send container request timed out with msg_type {} " \
                       "and address {}. Last error message was {}".format(msg_type, taddress, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:5000/{1}".format(taddress, msg_type), timeout=timeout, json=data_dict)