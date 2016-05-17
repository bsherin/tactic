# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py
import os
import docker_cleanup
print "entering tactic_run"

# from flask import request, redirect

from tactic_app import app, socketio
from tactic_app import host_workers
print "imported app"
from tactic_app import users
from views import auth_views, main_views, user_manage_views


from tactic_app.shared_dicts import get_all_default_tiles
get_all_default_tiles()



