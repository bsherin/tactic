
from rabbitmq_admin import AdminAPI
import pika
import time

print("entering rabbit_manage")


def get_queues():
    api = AdminAPI(url="http://megaplex:15672", auth=('guest', 'guest'))
    print('got admin api')
    ignore = ["aliveness-test", ""]
    bindings = api.list_bindings()
    print("got bindings " + str("bindings"))
    result = []
    for binding in bindings:
        rkey = binding["routing_key"]
        if rkey not in ignore:
            result.append(rkey)
    return result


def sleep_until_rabbit_alive(max_tries=20, megaplex_address=None):
    api = AdminAPI(url="http://megaplex:15672", auth=('guest', 'guest'))
    print('got admin api')
    ignore = ["aliveness-test", ""]
    for n in range(max_tries):
        if rabbit_alive(api):
            return True
        time.sleep(2)
    return False


def rabbit_alive(api):
    try:
        return api.is_vhost_alive("/")["status"] == "ok"
    except:
        return False

