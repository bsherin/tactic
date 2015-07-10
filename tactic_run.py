__author__ = 'bls910'

from tactic_app import app
from tactic_app import views
from tactic_app.auth import users, views

app.run(debug=True)
