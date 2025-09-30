import copy

from qworker import task_worthy

from users import get_full_user_data_fields

class AccountTasksMixin:

    @task_worthy
    def update_account_info(self, data):
        user_obj = self.get_user_from_data(data)
        result_dict = user_obj.update_account(data)
        result_dict["success"] = True
        return result_dict

    @task_worthy
    def update_settings(self, data):
        user_obj = self.get_user_from_data(data)
        result_dict = user_obj.update_settings(data)
        result_dict["success"] = True
        return result_dict