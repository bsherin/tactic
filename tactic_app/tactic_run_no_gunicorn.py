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
from tactic_app.views import auth_views, main_views, user_manage_views, doc_views
from tactic_app import tiles, tokenizers
from tactic_app import socketio

# app.run(debug=True)

socketio.run(app)
# socketio.run(app, host='0.0.0.0') # Get iP address for this machine and add :5000

