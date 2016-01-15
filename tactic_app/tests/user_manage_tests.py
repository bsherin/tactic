
import unittest
from tactic_app import app
import json
import StringIO

# noinspection PyUnresolvedReferences
from tactic_app.views import auth_views, user_manage_views
# noinspection PyUnresolvedReferences
from werkzeug import FileStorage

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
            remember_me=False
        )
        the_data = json.dumps(data_dict)
        return self.app.post('/attempt_login', content_type='application/json', data=the_data, follow_redirects=True)

    def test_user_manage_general(self):
        rv = self.app.get("/user_manage")
        self.assertIn("<title>test_user library</title>", rv.data)

    def test_list_funcs(self):

        # test grab_metadata with invalid name for resource that isn't present
        data_dict = {"res_type": "list", "res_name": "blag"}
        the_data = json.dumps(data_dict)
        rv = self.app.post("/grab_metadata", content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertFalse(result["success"])

        # test save_metadata
        data_dict = {"res_type": "list", "res_name": "bruce_only.txt", "tags": "test tag2", "notes": ""}
        the_data = json.dumps(data_dict)
        rv = self.app.post("/save_metadata", content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

        # test add_list
        str_io = StringIO.StringIO()
        str_io.write("one\ntwo\nthree")
        str_io.seek(0)
        the_data = {'file': (str_io, "test.txt")}
        rv = self.app.post("/add_list", data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

        # test delete_list and get rid of the new list
        rv = self.app.post('/delete_list/test.txt')
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

        # test grab_metadata
        data_dict = {"res_type": "list", "res_name": "bruce_only.txt"}
        the_data = json.dumps(data_dict)
        rv = self.app.post("/grab_metadata", content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])
        self.assertEqual(result["tags"], "test tag2")

        # restore the metadata so we are set up for future tests.
        data_dict = {"res_type": "list", "res_name": "bruce_only.txt", "tags": "test", "notes": ""}
        the_data = json.dumps(data_dict)
        _ = self.app.post("/save_metadata", content_type='application/json', data=the_data)

        # test view_list
        rv = self.app.get('/view_list/bruce_only.txt')
        self.assertTrue("<td>bruce</td>" in rv.data)

        # test create_duplicate_list
        data_dict = {"res_to_copy": "bruce_only.txt", "new_res_name": "bruce_only_test_copy"}
        the_data = json.dumps(data_dict)
        rv = self.app.post('/create_duplicate_list', content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

        # test delete_list again
        rv = self.app.post('/delete_list/bruce_only_test_copy')
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

    def test_collection_funcs(self):
        rv = self.app.get('/main/genesis')
        self.assertIn("<option>genesis</option>", rv.data)
        data_dict = {"res_to_copy": "genesis", "new_res_name": "genesis_test_copy"}
        the_data = json.dumps(data_dict)
        rv = self.app.post('/duplicate_collection', content_type='application/json', data=the_data)
        result = json.loads(rv.data)
        self.assertTrue(result["success"])
        rv = self.app.post('/delete_collection/genesis_test_copy')
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

    def test_tile_funcs(self):
        rv = self.app.get('/view_module/Collocations')
        self.assertIn("class Collocations(TileBase)", rv.data)
        rv = self.app.get('/load_tile_module/Collocations')
        result = json.loads(rv.data)
        self.assertEqual(result["alert_type"], "alert-success")
        rv = self.app.get('/load_tile_module/CollocationsWithError')
        result = json.loads(rv.data)
        self.assertEqual(result["alert_type"], "alert-warning")
        rv = self.app.get("/request_update_loaded_tile_list")
        self.assertIn("Collocations", rv.data)
        rv = self.app.get("/unload_all_tiles")
        result = json.loads(rv.data)
        self.assertEqual(result["alert_type"], "alert-success")
        data_dict = {"new_res_name": "test_create_module"}
        the_data = json.dumps(data_dict)
        rv = self.app.post('/create_tile_module', content_type='application/json', data=the_data, follow_redirects=True)
        self.assertIn("class TileTemplate(TileBase", rv.data)
        rv = self.app.post("/delete_tile_module/test_create_module")
        result = json.loads(rv.data)
        self.assertTrue(result["success"])

if __name__ == '__main__':
    unittest.main()
