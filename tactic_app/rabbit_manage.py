
from rabbitmq_admin import AdminAPI
import pika
import time

api = AdminAPI(url='http://0.0.0.0:15672', auth=('guest', 'guest'))


def get_queues():
    ignore = ["aliveness-test"]
    bindings = api.list_bindings()
    result = []
    for binding in bindings:
        rkey = binding["routing_key"]
        if rkey not in ignore:
            result.append(rkey)
    return result


def delete_all_queues():
    queues = get_queues()
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    for queue_name in queues:
        channel.queue_delete(queue=queue_name)
    connection.close()
    return


def delete_one_queue(tactic_id):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_delete(queue=tactic_id)
    connection.close()


def sleep_until_rabbit_alive(max_tries=20):
    for n in range(max_tries):
        if rabbit_alive():
            return True
        time.sleep(2)
    return False


def rabbit_alive():
    try:
        return api.is_vhost_alive("/")["status"] == "ok"
    except:
        return False



