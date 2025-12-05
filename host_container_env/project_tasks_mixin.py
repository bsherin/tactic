import uuid
import re
from flask import url_for
from qworker import task_worthy

from docker_functions import main_container_info

class ProjectTasksMixin:

    @task_worthy
    def get_project_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"project_names": the_user.project_names()}

    @task_worthy
    def create_duplicate_project_task(self, data):
        the_user = self.get_user_from_data(data)
        project_to_copy = data['res_to_copy']
        new_project_name = data['new_res_name']
        the_user.create_duplicate_project(new_project_name, project_to_copy)
        return {"success": True}

    @task_worthy
    def rename_project_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_project(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_project_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        project_name = data["res_name"]
        result = the_user.get_processed_project_metadata(
            project_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_all_project_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_project_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_project_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        project_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_project_metadata(project_name, metadata)
        return {"success": True, "message": "project metadata saved successfully."}

    @task_worthy
    def delete_tag_in_projects_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_projects(tag)
        return {"success": True, "message": "Tag deleted from projects successfully."}

    @task_worthy
    def rename_tag_in_projects_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_projects(tag_changes)
        return {"success": True, "message": "Tag deleted from projects successfully."}

    @task_worthy
    def SaveAssistantThread(self, data):
        def got_past_messages(resp_data):
            try:
                print("got past messages")
                console_items = []
                for msg in resp_data["messages"]:
                    unique_id = str(uuid.uuid4())
                    header = "ChatBot" if msg["kind"] == "assistant" else "You"
                    citem = {
                        "unique_id": unique_id,
                        "type": "text",
                        "am_shrunk": False,
                        "search_string": None,
                        "summary_text": None,
                        "console_text": f"<h6>{header}</h6>\n{msg['text']}",
                        "show_markdown": True
                    }
                    console_items.append(citem)
                interface_state = {
                    "console_items": console_items,
                    "show_exports_pane": False,
                    "console_width_fraction": .5
                }
                self.create_assistant_save(new_name, interface_state)
                return {"success": True}
            except Exception as ex2:
                print(self.handle_exception(ex2, "Error saving thread to notebook"))
                return {"success": False}

        try:
            assistant_id = data["assistant_id"]
            new_name = data["new_name"]
            self.post_task(assistant_id, "get_past_messages", {}, got_past_messages)
        except Exception as ex:
            print(self.handle_exception(ex, "Error posting get_past_message"))
            return {"success": False}