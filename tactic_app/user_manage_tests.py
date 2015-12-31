
import unittest
from tactic_app import app
import json
from tactic_app.views import auth_views, user_manage_views

class UserManageTest(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.testing = True
        self.app = app.test_client()
        self.attempt_login('test_user', 'abcd')

    def tearDown(self):
        return self.app.get('/logout', follow_redirects=True)
        pass

    def attempt_login(self, username, password):
        data_dict = dict(
            username=username,
            password=password,
            remember_me = False
        )
        the_data = json.dumps(data_dict)
        return self.app.post('/attempt_login', content_type='application/json', data=the_data, follow_redirects=True)

    def test_list_funcs(self):
        rv = self.app.get('/view_list/bruce_only.txt')
        self.assertTrue("<td>bruce</td>" in rv.data)
        data_dict = {"res_to_copy": "bruce_only.txt", "new_res_name": "bruce_only_test_copy"}
        the_data = json.dumps(data_dict)
        rv = self.app.post('/create_duplicate_list', content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])
        rv = self.app.post('/delete_list/bruce_only_test_copy')
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

if __name__ == '__main__':
    unittest.main()