__author__ = 'bls910'

from tactic_app import app
from tactic_app import users
from tactic_app.views import auth_views, main_views, user_manage_views
from tactic_app import socketio

# app.run(debug=True)
socketio.run(app)