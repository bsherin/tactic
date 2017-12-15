
from flask import jsonify
from flask_login import login_required, current_user
from tactic_app import app
from tactic_app.users import get_all_users, remove_user
from tactic_app.resource_manager import ResourceManager

class UserManager(ResourceManager):
    def add_rules(self):
        app.add_url_rule('/refresh_user_table', "refresh_user_table",
                         login_required(self.refresh_user_table), methods=['get'])
        app.add_url_rule('/delete_user/<userid>', "delete_user",
                         login_required(self.delete_user), methods=['get', "post"])

    def refresh_user_table(self):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        self.update_selector_list()
        return jsonify({"success": True})

    def delete_user(self, userid):
        if not (current_user.username == "admin"):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        result = remove_user(userid)
        self.update_selector_list()
        return jsonify(result)

    def build_resource_array(self):
        user_list = get_all_users()
        larray = [["_id", "username", "full_name", "email"]]
        for user in user_list:
            urow = []
            for field in larray[0]:
                if field in user:
                    urow.append(str(user[field]))
                else:
                    urow.append("")
            larray.append(urow)
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

