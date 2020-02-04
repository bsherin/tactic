# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

from gevent import monkey; monkey.patch_all()
import os
import time
print("entering host main")
print("monkey patching")

from tactic_app import app, socketio
print("back in host_main")
import users
print("imported user")
import auth_views, main_views, library_views, admin_views
import module_viewer_views, history_viewer_views, tile_differ_views
print("imported views")
import host_workers
print("imported host_workers")

print("trying redis stuff")
import redis_tools

import tactic_app

print("about to do socketio.run")
# socketio.run(app, host="0.0.0.0", port=5000)
print("did it")

