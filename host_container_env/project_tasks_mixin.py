import uuid
import re
from flask import url_for
from qworker import task_worthy

from redis_tools import create_ready_block

from docker_functions import main_container_info

class ProjectTasksMixin:

    @task_worthy
    def initiate_project_in_context(self, data):
        the_user = self.get_user_from_data(data)
        user_id = data["user_id"]
        project_name = data["project_name"]

        # noinspection PyTypeChecker
        main_id, rb_id = main_container_info.create_main_container(project_name, user_id, the_user.username,
                                                                   openai_api_key = the_user.get_openai_api_key())

        save_dict = the_user.get_project_doc(project_name)
        mdata = save_dict["metadata"]
        if "type" in mdata:
            doc_type = mdata["type"]
        else:
            doc_type = "table"

        is_legacy_save = "save_style" in mdata and mdata["save_style"] != "b64save_react"

        create_ready_block(rb_id, the_user.username, [main_id, "client"], main_id)
        is_notebook = doc_type == 'notebook' or doc_type == 'jupyter'
        if is_notebook:
            viewer = "notebook-viewer"
            short_collection_name = ""
            tile_types = []
            icon_dict = {}
        else:
            viewer = "main-viewer"
            tile_types, icon_dict = self.get_tile_types(user_id)
            if "collection_name" in mdata:
                full_collection_name = mdata["collection_name"]
                short_collection_name = re.sub(r"^.*?\.data_collection\.", "", full_collection_name)
            else:
                short_collection_name = "no name"
        data_dict = {"success": True,
                     "kind": viewer,
                     "res_type": "project",
                     "project_name": project_name,
                     "resource_name": project_name,
                     "ready_block_id": rb_id,
                     "main_id": main_id,
                     "is_legacy_save": is_legacy_save,
                     "tile_types": tile_types,
                     "icon_dict": icon_dict,
                     "temp_data_id": "",
                     "collection_name": "",
                     "doc_names": [],
                     "short_collection_name": short_collection_name,
                     "doc_type": doc_type,
                     "is_table": (doc_type == "table"),
                     "is_notebook": is_notebook,
                     "is_freeform": (doc_type == 'freeform'),
                     "is_jupyter":  (doc_type == 'jupyter'),
                     "is_project": True,
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]}

        return data_dict

    @task_worthy
    def initiate_new_notebook_in_context(self, data):
        the_user = self.get_user_from_data(data)
        if "temp_data_id" in data:
            temp_data_id = data["temp_data_id"]
            main_id, rb_id = main_container_info.create_main_container("new_notebook",
                                                                       the_user.get_id(),
                                                                       the_user.username,
                                                                       openai_api_key = the_user.get_openai_api_key())
        else:
            temp_data_id = ""
            main_id, rb_id = main_container_info.create_main_container("new_notebook",
                                                                       the_user.get_id(),
                                                                       the_user.username,
                                                                       openai_api_key = the_user.get_openai_api_key())
        create_ready_block(rb_id, the_user.username, [main_id, "client"], main_id)
        data_dict = {"success": True,
                     "kind": "notebook-viewer",
                     "res_type": "project",
                     "project_name": "",
                     "resource_name": "new notebook",
                     "ready_block_id": rb_id,
                     "main_id": main_id,
                     "temp_data_id": temp_data_id,
                     "collection_name": "",
                     "doc_names": [],
                     "is_legacy_save": False,
                     "short_collection_name": "",
                     "doc_type": "notebook",
                     "is_table": False,
                     "is_notebook": True,
                     "is_freeform": False,
                     "is_jupyter": False,
                     "is_project": False,
                     "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1]}
        return data_dict

    @task_worthy
    def intiate_new_project_in_context(self, data):
        the_user = self.get_user_from_data(data)
        user_id = data["user_id"]
        main_id, rb_id = main_container_info.create_main_container("", the_user.get_id(),
                                                                   the_user.username,
                                                                   openai_api_key = the_user.get_openai_api_key())
        create_ready_block(rb_id, the_user.username, [main_id, "client"], main_id)
        doc_type = "none"
        tile_types, icon_dict = self.get_tile_types(the_user.get_id())
        data = {
            "success": True,
            "kind": "main-viewer",
            "res_type": "collection",
            "short_collection_name": "",
            "resource_name": "new project",
            "collection_name": "",
            "tile_types": tile_types,
            "icon_dict": icon_dict,
            "main_id": main_id,
            "ready_block_id": rb_id,
            "is_legacy_save": False,
            "is_project": False,
            "project_name": "",
            "doc_names": [],
            "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
            "temp_data_id": "",
            "console_html": "",
            "doc_type": doc_type,
            "is_table": False,
            "is_freeform": False
        }
        return data

    @task_worthy
    def get_project_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"project_names": the_user.project_names}

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