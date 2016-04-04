from __init__ import test_dict, app
from celery import Celery

cel = Celery(app.name, broker="redis://172.17.0.9:6379")

@cel.task
def say_hello():
    with app.app_context():
        app.logger.debug("adding to the log")
    test_dict["value"] += 33
    return 'hello world ' + str(test_dict["value"])
