import uuid
from flask import url_for
from qworker import task_worthy

from redis_tools import ready_block_manager

from docker_functions import main_container_info

class CollectionTasksMixin:

    @task_worthy
    def initiate_collection_in_context(self, data):
        user_obj = self.get_user_from_data(data)
        user_id = data["user_id"]
        local_id = data.get("local_id", str(uuid.uuid4()))
        short_collection_name = data["collection_name"]
        _, rb_id = main_container_info.create_main_container(short_collection_name, user_obj.get_id(),
                                                                   user_obj.username,
                                                                   openai_api_key = user_obj.get_openai_api_key(),
                                                                   special_unique_id=local_id)
        ready_block_manager.create_ready_block(rb_id, user_obj.username, [local_id, "client"], local_id)
        doc_dict, doc_mddict, hl_dict, mdata = user_obj.get_all_collection_info(short_collection_name)
        if "_id" in mdata:
            del(mdata["_id"])
        if "type" in mdata and mdata["type"] == "freeform":
            doc_type = "freeform"
        else:
            doc_type = "table"
        is_legacy_save = "save_style" in mdata and mdata["save_style"] != "b64save_react"
        doc_names = list(doc_dict.keys())
        tile_types, icon_dict = self.get_tile_types(user_id)
        data = {
            "success": True,
            "kind": "main-viewer",
            "res_type": "collection",
            "short_collection_name": short_collection_name,
            "resource_name": short_collection_name,
            "collection_name": short_collection_name,
            "local_id": local_id,
            "ready_block_id": rb_id,
            "is_project": False,
            "is_legacy_save": is_legacy_save,
            "project_name": "",
            "tile_types": tile_types,
            "icon_dict": icon_dict,
            "doc_names": doc_names,
            "base_figure_url": url_for("figure_source", tile_id="tile_id", figure_name="X")[:-1],
            "temp_data_id": "",
            "console_html": "",
            "doc_type": doc_type,
            "is_table": doc_type == "table",
            "is_freeform": doc_type == "freeform"
        }
        return data

    @task_worthy
    def update_collectio_task(self, data):  # This is called from the list viewer
        pass

    @task_worthy
    def get_collection_names_task(self, data):
        the_user = self.get_user_from_data(data)
        return {"collection_names": the_user.collection_names}

    @task_worthy
    def create_duplicate_collection_task(self, data):
        try:
            print("in create_duplicate_collection_task")
            the_user = self.get_user_from_data(data)
            new_res_name = data["new_res_name"]
            self.emit_status_message("Duplicating collection ...", data["user_id"])
            coll_dict, dm_dict, hl_dict, coll_mdata = the_user.get_all_collection_info(data['res_to_copy'])
            if "size" in coll_mdata and coll_mdata["size"] == 0:
                del coll_mdata["size"]
            if "type" in coll_mdata:
                ctype = coll_mdata["type"]
            else:
                ctype = "table"  # For old collections
            result = the_user.create_complete_collection(new_res_name,
                                                         coll_dict,
                                                         ctype,
                                                         dm_dict,
                                                         hl_dict,
                                                         coll_mdata)
            if not result["success"]:
                result["message"] = result["message"]
                result["alert_type"] = "alert-warning"
                return result
            return {"success": True}
        except Exception as ex:
            msg = self.get_traceback_message(ex)
            self.add_error_drawer_entry("Error duplicating collection", msg, data["user_id"])
            return {"success": False, "message": msg, "alert_type": "alert-warning"}

    @task_worthy
    def create_empty_collection_task(self, data):
        the_user = self.get_user_from_data(data)
        collection_name = data["collection_name"]
        doc_type = data["doc_type"]
        csv_options = data.get("csv_options", None)
        result = the_user.create_empty_collection(collection_name, doc_type, csv_options)
        return result

    @task_worthy
    def rename_collection_task(self, data):
        the_user = self.get_user_from_data(data)
        old_name = data['old_name']
        new_name = data['new_name']
        the_user.rename_collection(old_name, new_name)
        return {"success": True}

    @task_worthy
    def grab_processed_collection_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        search_inside = data.get("search_inside", False)
        search_string = data.get("search_string", None)
        collection_name = data["res_name"]
        result = the_user.get_processed_collection_metadata(
            collection_name, search_inside=search_inside, search_string=search_string
        )
        if result is None:
            return {"success": False, "message": "metadata not found."}
        result["success"] = True
        return result

    @task_worthy
    def get_all_collection_tags_task(self, data):
        the_user = self.get_user_from_data(data)
        show_hidden = data.get("show_hidden", False)
        tag_list = the_user.get_all_collection_tags(show_hidden=show_hidden)
        return {"tag_list": tag_list, "success": True}

    @task_worthy
    def save_collection_metadata_task(self, data):
        the_user = self.get_user_from_data(data)
        collection_name = data["res_name"]
        metadata = data["metadata"]
        the_user.save_collection_metadata(collection_name, metadata)
        return {"success": True, "message": "collection metadata saved successfully."}

    @task_worthy
    def delete_tag_in_collections_task(self, data):
        the_user = self.get_user_from_data(data)
        tag = data["tag"]
        the_user.delete_tag_in_collections(tag)
        return {"success": True, "message": "Tag deleted from collections successfully."}

    @task_worthy
    def rename_tag_in_collections_task(self, data):
        the_user = self.get_user_from_data(data)
        tag_changes = data["tag_changes"]
        the_user.rename_tag_in_collections(tag_changes)
        return {"success": True, "message": "Tag deleted from collections successfully."}

    @task_worthy
    def combine_collections_task(self, data):
        the_user = self.get_user_from_data(data)
        base_collection_name = data["base_collection_name"]
        collection_to_add = data["collection_to_add"]
        try:
            if not the_user.collection_name_exists(base_collection_name):
                error_string = base_collection_name + " doesn't exist"
                return {"success": False, "message": error_string, "alert_type": "alert-warning"}

            if not the_user.collection_name_exists(collection_to_add):
                error_string = collection_to_add + " doesn't exist"
                return {"success": False, "message": error_string, "alert_type": "alert-warning"}
            doc_type = self.get_doc_type(base_collection_name)
            coll_dict, dm_dict, hl_dict, coll_mdata = the_user.get_all_collection_info(collection_to_add)
            if not coll_mdata["type"] == doc_type:
                error_string = "Cannot combine freeform and table collections"
                return {"success": False, "message": error_string, "alert_type": "alert-warning"}
            the_user.append_documents_to_collection(base_collection_name, coll_dict, doc_type, hl_dict, dm_dict)
            return {"success": True,
                    "message": "Collections successfull combined",
                    "alert_type": "alert-success"}
        except Exception as ex:
            return {"success": False, "message": self.get_traceback_exception(ex, "Error combining collection")}

    @task_worthy
    def combine_to_new_collection_task(self, data):
        try:
            the_user = self.get_user_from_data(data)
            original_collections = data["original_collections"]
            new_name = data["new_name"]
            coll_dict, dm_dict, hl_dict, coll_mdata = the_user.get_all_collection_info(original_collections[0])
            doc_type = coll_mdata["type"]
            if "size" in coll_mdata:
                del coll_mdata["size"]
            the_user.create_complete_collection(new_name,
                                                coll_dict,
                                                coll_mdata["type"],
                                                dm_dict,
                                                hl_dict,
                                                coll_mdata)
            for col in original_collections[1:]:
                if not the_user.get_doc_type(col) == doc_type:
                    error_string = "Cannot combine freeform and table collections"
                    return {"success": False, "message": error_string, "alert_type": "alert-warning"}

            for col in original_collections[1:]:
                coll_dict, dm_dict, hl_dict, coll_mdata = the_user.get_all_collection_info(col)
                the_user.append_documents_to_collection(new_name, coll_dict, doc_type, hl_dict, dm_dict)

            return {"success": True}

        except Exception as ex:
            return {"success": False, "message": self.get_traceback_exception(ex, "Error combining collection")}

    @task_worthy
    def open_raw(self, data):
        the_user = self.get_user_from_data(data)
        collection_name = data["collection_name"]
        coll_dict, doc_mdata_dict, header_list_dict, coll_mdata = user_obj.get_all_collection_info(collection_name,
                                                                                                   return_lists=False)
        doc_type = "freeform" if coll_mdata["type"] == "freeform" else "table"
        if doc_type == "table":
            return "Only Freeform docs can be opened raw"
        return list(coll_dict.values())[0]