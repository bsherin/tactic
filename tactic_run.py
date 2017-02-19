# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

import docker_cleanup
print "entering tactic_run"

docker_cleanup.do_docker_cleanup()


from tactic_app import app, socketio
from tactic_app import users, global_tile_management
from views import auth_views, main_views, user_manage_views, admin_views, creator_views, module_viewer_views, history_viewer_views

import tactic_app
tactic_app.global_tile_manager.get_all_default_tiles()
