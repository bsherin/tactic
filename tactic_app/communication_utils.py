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

megaplex_address = None


def send_request_to_megaplex(msg_type, data_dict=None, wait_for_success=True, timeout=3, tries=RETRIES, wait_time=.1):
    if megaplex_address is None:  # assume this is the host
        taddress = "0.0.0.0"
        port = "8080"
    else:
        taddress = megaplex_address
        port = "5000"
    last_fail = ""
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
        error_string = "Send request to megaplex timed out with msg_type {} and last fail {}".format(msg_type, last_fail)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:{1}/{2}".format(taddress, port, msg_type), timeout=timeout, json=data_dict)



# tactic_change send_request to container took out forwarder
def send_request_to_container(taddress, msg_type, data_dict=None, wait_for_success=True,
                              timeout=3, tries=RETRIES, wait_time=.1):
    last_fail = ""
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