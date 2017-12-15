# The unused imports here are required so that the
# various handlers are registered via decorators

# Much of the setup is done in tactic_app/__init__.py
# This avoids circular imports since the view functions make use
# of things such as app, socketio, and db that are created in __init__.py

from gevent import monkey; monkey.patch_all()
print "entering tactic_run"
import docker_cleanup
docker_cleanup.do_docker_cleanup()

from tactic_app import app, socketio # global_stuff ?

from tactic_app import users, global_tile_management
from views import auth_views, main_views, user_manage_views, admin_views
from views import module_viewer_views, history_viewer_views, tile_differ_views
from tactic_app import host_workers

print "imported app"

import tactic_app
tactic_app.global_tile_manager.get_all_default_tiles()

from views import tester_views

socketio.run(app, host="0.0.0.0", port=5000)
