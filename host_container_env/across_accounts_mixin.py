from qworker import task_worthy

class AcrossAccountsTasksMixin:

    @task_worthy
    def copy_from_repository_task(self, data):
        the_user = self.get_user_from_data(data)
        if "res_name" in data:
            new_res_name = data['new_res_name']
            res_type = data["res_type"]
            res_name = data['res_name']
            metadata, result = the_user.copy_between_accounts(self.repository_user, the_user,
                                                              res_type, new_res_name, res_name)
            return result
        else:
            selected_rows = data["selected_rows"]
            successful_copies = 0
            for row in selected_rows:
                res_type = row["res_type"]
                res_name = row["name"]
                resource_names = self.get_resource_names_task({"res_type": res_type})["res_names"]
                new_res_name = self.make_name_unique(res_name, resource_names)
                metadata, result = the_user.copy_between_accounts(self.repository_user, the_user,
                                                                  res_type, new_res_name, res_name)
                if result.json["success"]:
                    successful_copies += 1
            return {"success": True, "message": f"{str(successful_copies)} resources copied"}

    @task_worthy
    def send_to_repository_task(self, data):
        the_user = self.get_user_from_data(data)
        if "res_name" in data:
            new_res_name = data['new_res_name']
            res_type = data["res_type"]
            res_name = data['res_name']
            metadata, result = the_user.copy_between_accounts(the_user, self.repository_user,
                                                              res_type, new_res_name, res_name)
            return result
        else:
            selected_rows = data["selected_rows"]
            successful_sends = 0
            for row in selected_rows:
                res_type = row["res_type"]
                res_name = row["name"]
                resource_names = self.get_resource_names_task({"res_type": res_type})["res_names"]
                new_res_name = self.make_name_unique(res_name, resource_names)
                metadata, result = the_user.copy_between_accounts(the_user, self.repository_user,
                                                                  res_type, new_res_name, res_name)
                if result.json["success"]:
                    successful_sends += 1
            return {"success": True, "message": f"{str(successful_sends)} resources sent to repository"}
