import requests
import sys
import time

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