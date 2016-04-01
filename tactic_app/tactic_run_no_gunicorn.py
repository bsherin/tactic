# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py
import os

print "entering tactic_run"

from tactic_app import app
print "imported app"
from tactic_app import users
from tactic_app.views import auth_views, main_views, user_manage_views
from tactic_app import weight_functions

from tactic_app import tokenizers
from tactic_app import socketio

from default_tile_env import get_all_default_tiles
get_all_default_tiles()

from tactic_app.views import tester_views

socketio.run(app, host="0.0.0.0")

