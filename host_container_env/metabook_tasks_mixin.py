from qworker import task_worthy

class MetabookTasksMixin:

    @task_worthy
    def read_metabook_task(self, meta_id):
        the_user = self.get_user_from_data(data)
        metabook = the_user.get_metabook_unpacked(meta_id)
        if not metabook:
            return jsonify({"success": False, "error": "Metabook not found."}), 404
        return jsonify({"success": True, "metabook": metabook})

    @task_worthy
    def new_metabook_task(self, data):
        the_user = self.get_user_from_data(data)
        metabook_name = data['metabook_name']
        if the_user.metabook_name_exists(metabook_name):
            return {"success": False, "error": "Metabook name already exists."}
        if not metabook_name:
            return {"success": False, "error": "Metabook name cannot be empty."}

        _id = the_user.create_empty_metabook(metabook_name)
        return jsonify({"success": True, "_id": str(_id)})

    ###

    @task_worthy
    def get_metabook_content_with_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        metabook_name = data["metabook_name"]

        result = the_user.get_metabook_content_with_metadata(metabook_name, process_metadata=True)
        lstring = ""
        for w in result["the_metabook"]:
            lstring += w + "\n"
        result["searchable_text"] = lstring
        result["success"] = True
        return result

    @task_worthy
    def update_metabook_task(self, data):  # This is called from the metabook viewer
        try:
            the_user = self.get_user_from_data(data)
            metabook_name = data["metabook_name"]
            new_metabook = data["new_metabook"]
            the_user.update_metabook(metabook_name, new_metabook)

            return {"success": True, "message": "metabook Successfully Saved", "alert_type": "alert-success"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Unable to Update metabook.")
            print(msg)
            return {"success": False, "message": msg}

    @task_worthy
    def get_metabook_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"metabook_names": the_user.metabook_names}

    @task_worthy
    def create_duplicate_metabook_task(self, data):
        the_user = self.get_user_from_data(data)
        metabook_to_copy = data['res_to_copy']
        new_metabook_name = data['new_res_name']
        the_user.create_metabook(new_metabook_name, metabook_to_copy)
        return {"success": True}

    @task_worthy
    def rename_metabook_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_metabook(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_metabook_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        metabook_name = data["res_name"]
        result = the_user.get_processed_metabook_metadata(
            metabook_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_all_metabook_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_metabook_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_metabook_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        metabook_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_metabook_metadata(metabook_name, metadata)
        return {"success": True, "message": "metabook metadata saved successfully."}

    @task_worthy
    def delete_tag_in_metabooks_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_metabooks(tag)
        return {"success": True, "message": "Tag deleted from metabooks successfully."}

    @task_worthy
    def rename_tag_in_metabooks_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_metabooks(tag_changes)
        return {"success": True, "message": "Tag deleted from metabooks successfully."}

    
    @task_worthy
    def create_node_task(self, data):
        the_user = self.get_user_from_data(data)
        type = data.get("type")
        use = data.get("use")
        title = data.get("title", "")
        searchable_text = data.get("searchable_text", "")
        data_content = data.get("data", {})

        _id = the_user.create_node(type, data_content, use, title, searchable_text)
        return {"success": True, "_id": str(_id)}

    @task_worthy
    def create_empty_node_in_metabook_task(self, data):
        type = data.get("type")
        meta_id = data.get("meta_id")
        index = data.get("index", None)
        print(f"Creating empty node of type {type} in metabook {meta_id} at index {index}")
        new_id = the_user.create_node(type, {}, meta_id)
        if index is not None:
            result = the_user.insert_node_at_index(new_id, meta_id, index, False)
        else:
            result = the_user.append_node(new_id, meta_id, False)
        if not result["success"]:
            return {"success": False, "error": result.get("message", "Failed to create node in metabook.")}
        return {"success": True, "_id": new_id}

