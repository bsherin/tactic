
import unittest
from tactic_app import app
import json
from tactic_app.views import auth_views

class TestAuth(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def attempt_login(self, username, password):
        data_dict = dict(
            username=username,
            password=password,
            remember_me = False
        )
        the_data = json.dumps(data_dict)
        return self.app.post('/attempt_login', content_type='application/json', data=the_data, follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

    def test_login_logout(self):
        rv = self.attempt_login('test_user', 'abcd')
        self.assertEqual(rv.data, '{\n  "logged_in": true\n}')
        rv = self.app.get('/logout')
        self.assertEqual(rv._status_code, 200)
        rv = self.attempt_login('test_userx', 'blah')
        self.assertEqual(rv.data, '{\n  "logged_in": false\n}')
        rv = self.attempt_login('test_user', 'defaultx')
        self.assertEqual(rv.data, '{\n  "logged_in": false\n}')

if __name__ == '__main__':
    unittest.main()