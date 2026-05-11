from qworker import task_worthy, task_worthy_manual_submit

class CodeTasksMixin:

    @task_worthy
    def get_code_content_with_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        code_name = data["code_name"]

        result = the_user.get_code_content_with_metadata(code_name, process_metadata=True)
        if result is None:
            return {"success": False, "message": "Code not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_code_code_task(self, data):
        the_user = self.get_user_from_data(data)
        code_name = data["code_name"]

        the_code = the_user.get_code_content(code_name, process_metadata=False)
        if the_code is None:
            return {"success": False, "message": "Code not found."}
        result = {"success": True, "the_code": the_code}
        return result

    @task_worthy_manual_submit
    def update_code_task(self, data, task_packet):  # This is called from the code viewer
        local_task_packet = task_packet
        the_user = self.get_user_from_data(data)
        code_name = data["code_name"]
        the_code = data["new_code"]

        def get_result(load_result):
            if not load_result["success"]:
                self.submit_response(task_packet, load_result)
                return
            the_user.update_code(code_name, the_code, load_result["classes"], load_result["functions"])
            result = {"success": True, "message": "Code Successfully Saved", "alert_type": "alert-success"}
            self.submit_response(local_task_packet, result)
            return

        self.post_task("tile_test_container", "clear_and_load_code",
                       {"the_code": the_code}, get_result)
        return

    @task_worthy
    def get_code_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"code_names": the_user.code_names()}

    @task_worthy
    def create_duplicate_code_task(self, data):
        the_user = self.get_user_from_data(data)
        code_to_copy = data['res_to_copy']
        new_code_name = data['new_res_name']
        the_user.create_code(new_code_name, code_to_copy)
        return {"success": True}

    @task_worthy
    def create_code_from_repository_template(self, data):
        the_user = self.get_user_from_data(data)
        template_name = data["template_name"]
        template_doc = self.repository_user.get_code_doc(template_name)
        new_code_name = data["new_code_name"]
        the_user.create_code_from_doc(new_code_name, template_doc)
        return {"success": True}

    @task_worthy
    def get_code_with_function_task(self, data):
        the_user = self.get_user_from_data(data)
        function_name = data["function_name"]
        return {"the_code": the_user.get_code_with_function(function_name)}

    @task_worthy
    def get_code_with_class_task(self, data):
        the_user = self.get_user_from_data(data)
        class_name = data["class_name"]
        return {"the_code": the_user.get_code_with_class(class_name)}

    @task_worthy
    def rename_code_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_code(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_code_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        code_name = data["res_name"]
        result = the_user.get_processed_code_metadata(
            code_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_class_tags_dict_task(self, data):
        user_id = data["user_id"]
        the_user = load_user(user_id)
        return {"class_names": the_user.class_tags_dict()}

    @task_worthy
    def get_all_code_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_code_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_code_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        code_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_code_metadata(code_name, metadata)
        return {"success": True, "message": "code metadata saved successfully."}

    @task_worthy
    def delete_tag_in_codes_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_codes(tag)
        return {"success": True, "message": "Tag deleted from codes successfully."}

    @task_worthy
    def rename_tag_in_codes_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_codes(tag_changes)
        return {"success": True, "message": "Tag deleted from codes successfully."}

