# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py
import logging

# 1. Configure logging BEFORE anything else
logging.basicConfig(level=logging.WARNING)
for name in [
    'socketio',
    'flask_socketio',
    'engineio',
    'socketio.pubsub_manager',
    'kombu',
    'amqp',
    'gevent',
]:
    lg = logging.getLogger(name)
    lg.setLevel(logging.CRITICAL)
    lg.propagate = False
    if not lg.handlers:
        lg.addHandler(logging.NullHandler())

import os
from gevent import monkey; monkey.patch_all()

print("entering host main with suppressed logging")
print("monkey patching done")
import time
from rabbit_manage import sleep_until_rabbit_alive
print("Waiting for rabbit")
success = sleep_until_rabbit_alive()
print("Done waiting")

from tactic_app import app, socketio
print("back in host_main")
import users
print("imported user")
import auth_views, main_views, library_views, admin_views, pool_views
import list_views, code_views, tile_views, project_views, collection_views
import module_viewer_views
print("imported views")
import host_workers
print("imported host_workers")

print("trying redis stuff")
import redis_tools

import tactic_app

# print("about to do socketio.run")
# socketio.run(app, host="0.0.0.0", port=5000)
# print("did it")


