

import pytest
import docker_cleanup
docker_cleanup.do_docker_cleanup()

from tactic_app import app, socketio # global_stuff ?

from tactic_app import users, global_tile_management
from views import auth_views, main_views, library_views, admin_views
from views import module_viewer_views, history_viewer_views, tile_differ_views
from tactic_app import host_workers
import json


# @pytest.fixture
# def client():
#     return app.test_client()


def attempt_login(username, password):
    data_dict = dict(
        username=username,
        password=password,
        remember_me=False,
        tzOffset=10
    )
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    app.testing = True
    with app.test_client() as c:
        rv = c.post('/attempt_login', json=data_dict)
        json_data = rv.get_json()
    return json_data


def test_login():
    """Make sure login and logout works."""

    jdata = attempt_login("test_user", "abcd")
    assert jdata["logged_in"] is True
