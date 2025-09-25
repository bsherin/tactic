from qworker import task_worthy

class ListTasksMixin:


    @task_worthy
    def get_list_content_with_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        list_name = data["list_name"]

        result = the_user.get_list_content_with_metadata(list_name, process_metadata=True)
        lstring = ""
        for w in result["the_list"]:
            lstring += w + "\n"
        result["the_list"] = lstring
        result["success"] = True
        return result

    @task_worthy
    def update_list_task(self, data):  # This is called from the list viewer
        try:
            the_user = self.get_user_from_data(data)
            list_name = data["list_name"]
            new_list_as_string = data["new_list_as_string"]
            new_list = new_list_as_string.split("\n")
            the_user.update_list(list_name, new_list)

            return {"success": True, "message": "List Successfully Saved", "alert_type": "alert-success"}
        except Exception as ex:
            msg = self.get_traceback_message(ex, "Unable to Update List.")
            print(msg)
            return {"success": False, "message": msg}

    @task_worthy
    def get_list_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"list_names": the_user.list_names}

    @task_worthy
    def create_duplicate_list_task(self, data):
        the_user = self.get_user_from_data(data)
        list_to_copy = data['res_to_copy']
        new_list_name = data['new_res_name']
        the_user.create_list(new_list_name, list_to_copy)
        return {"success": True}

    @task_worthy
    def create_list_from_repository_template(self, data):
        the_user = self.get_user_from_data(data)
        template_name = data["template_name"]
        template_doc = self.repository_user.get_list_doc(template_name)
        new_list_name = data["new_list_name"]
        the_user.create_list_from_doc(new_list_name, template_doc)
        return {"success": True}

    @task_worthy
    def rename_list_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_list(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_list_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        list_name = data["res_name"]
        result = the_user.get_processed_list_metadata(
            list_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_all_list_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_list_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_list_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        list_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_list_metadata(list_name, metadata)
        return {"success": True, "message": "List metadata saved successfully."}

    @task_worthy
    def delete_tag_in_lists_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_lists(tag)
        return {"success": True, "message": "Tag deleted from lists successfully."}

    @task_worthy
    def rename_tag_in_lists_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_lists(tag_changes)
        return {"success": True, "message": "Tag deleted from lists successfully."}

    @task_worthy
    def intitiate_text_viewer_in_context(self, data):
        the_user = self.get_user_from_data(data)
        file_path = data["file_path"]

        def user_to_true(upath):
            return re.sub("/mydisk", the_user.pool_dir, upath)

        def can_read_as_text(fpath):
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    f.read(1024)  # Attempt to read the first 1024 bytes
                return True
            except (UnicodeDecodeError, IOError):
                return False
        try:
            true_path = user_to_true(file_path)
            if not can_read_as_text(true_path):
                return {"success": False, "message": "Not a text file."}
            with open(true_path, "r") as f:
                the_text = f.read()
            mdata = {}
            _, fname = os.path.split(true_path)
            fstat = os.stat(true_path)
            data = {
                "success": True,
                "kind": "text-viewer",
                "res_type": "text",
                "the_content": the_text,
                "mdata": mdata,
                "resource_name": fname,
                "read_only": False,
                "is_repository": False,
                "file_path": file_path,
                "created": current_user.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_ctime))[0],
                "updated": current_user.get_timestrings(datetime.datetime.utcfromtimestamp(fstat.st_mtime))[0],
                "size": fstat.st_size
            }
            return data
        except Exception as ex:
            emsg = self.get_traceback_message(ex, "Error in view_text_in_context")
            return jsonify({"success": False, "message": emsg})