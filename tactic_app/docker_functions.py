
import docker
import time
import requests
import uuid
import os

SHORT_SLEEP_PERIOD = float(os.environ.get("SHORT_SLEEP_PERIOD"))
LONG_SLEEP_PERIOD = float(os.environ.get("LONG_SLEEP_PERIOD"))
MAX_QUEUE_LENGTH = int(os.environ.get("MAX_QUEUE_LENGTH"))

callbacks = {}

cli = docker.Client(base_url='unix://var/run/docker.sock')


# Note taht get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.inspect_container(container_identifier)["NetworkSettings"]["Networks"][network_name]["IPAddress"]


def create_container(image_name, container_name=None, network_mode="bridge", wait_until_running=True):
    if container_name is None:
        container_id = cli.create_container(image=image_name,
                                            host_config=cli.create_host_config(network_mode=network_mode),
                                            environment={"SHORT_SLEEP_PERIOD": SHORT_SLEEP_PERIOD,
                                                         "LONG_SLEEP_PERIOD": LONG_SLEEP_PERIOD,
                                                         "MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH}
                                            )
    else:
        container_id = cli.create_container(image=image_name,
                                            name=container_name,
                                            host_config=cli.create_host_config(network_mode=network_mode),
                                            environment={"SHORT_SLEEP_PERIOD": SHORT_SLEEP_PERIOD,
                                                         "LONG_SLEEP_PERIOD": LONG_SLEEP_PERIOD,
                                                         "MAX_QUEUE_LENGTH": MAX_QUEUE_LENGTH}
                                            )
    cli.start(container_id)
    print "status " + str(cli.inspect_container(container_id)["State"]["Status"])
    if wait_until_running:
        while not cli.inspect_container(container_id)["State"]["Status"] == "running":
            time.sleep(0.1)
    return container_id


def create_network(network_name):
    return cli.create_network(network_name, "bridge")


def remove_network(network_name):
    return cli.remove_network(network_name)


def destroy_container(cname):
    try:
        return cli.remove_container(cname, force=True)
    except:
        return -1


def create_callback(func):
    unique_id = str(uuid.uuid4())
    callbacks[unique_id] = func
    return unique_id


def send_direct_request_to_container(container_id, msg_type, data_dict, wait_for_success=True,
                                     timeout=3, tries=30, wait_time=.1):
    maddress = get_address(container_id, "bridge")
    if wait_for_success:
        for attempt in range(tries):
            try:
                res = requests.post("http://{0}:5000/{1}".format(maddress, msg_type), timeout=timeout, json=data_dict)
                return res
            except:
                time.sleep(wait_time)
                continue
        error_string = "Send direct container request timed out with msg_type {} and container {} ".format(msg_type, container_id)
        raise Exception(error_string)
    else:
        return requests.post("http://{0}:5000/{1}".format(maddress, msg_type), timeout=timeout, json=data_dict)


def connect_to_network(container, network):
    return cli.connect_container_to_network(container, network)
