import os

from qworker import task_worthy

from mongo_accesser import res_types
from aws_helpers import get_ssm_parameter

LIBRARY_CHUNK_SIZE = int(get_ssm_parameter("LIBRARY_CHUNK_SIZE", "25"))

class HigherMongoTasksMixin:

    @task_worthy
    def get_resource_names_task(self, data):
        the_user = self.get_user_from_data(data)
        res_names = getattr(the_user, f"{data['res_type']}_names")()
        return {"res_names": res_names}

    @task_worthy
    def rename_resource_task(self, data):
        return getattr(self, f"rename_{data['res_type']}_task")(data)

    @task_worthy
    def grab_processed_metadata_task(self, data):
        return getattr(self, f"grab_processed_{data['res_type']}_metadata_task")(data)

    @task_worthy
    def get_all_tags_task(self, data):
        return getattr(self, f"get_all_{data['res_type']}_tags_task")(data)

    @task_worthy
    def save_metadata_task(self, data):
        return getattr(self, f"save_{data['res_type']}_metadata_task")(data)

    @task_worthy
    def delete_tag_in_resources_task(self, data):
        return getattr(self, f"delete_tag_in_{data['res_type']}s_task")(data)

    @task_worthy
    def rename_tag_in_resources_task(self, data):
        return getattr(self, f"rename_tag_in_{data['res_type']}s_task")(data)

    @task_worthy
    def create_duplicate_resource_task(self, data):
        return getattr(self, f"create_duplicate_{data['res_type']}_task")(data)

    @task_worthy
    def delete_resource_list_task(self, data):
        print("in delete_resource_list")
        try:
            the_user = self.get_user_from_data(data)
            res_list = data["resource_list"]
            for row in res_list:
                match row["res_type"]:
                    case "collection":
                        the_user.remove_collection(row["name"])
                    case "project":
                        the_user.remove_project(row["name"])
                    case "tile":
                        the_user.remove_tile(row["name"])
                    case "list":
                        the_user.remove_list(row["name"])
                    case "code":
                        the_user.remove_code(row["name"])
                    case "metabook":
                        the_user.remove_metabook(row["name"])
            return {"success": True, "message": "Resource(s) successfully deleted",
                            "alert_type": "alert-success"}

        except Exception as ex:
            msg = self.get_traceback_message(ex, "Error deleting resources")
            return {"success": False, "message": msg, "alert_type": "alert-warning"}

    @task_worthy
    def grab_all_list_chunk_task(self, data):
        the_user = self.get_user_from_data(data)
        is_repo = data["is_repository"]

        types_to_grab = data["res_types"]
        if len(types_to_grab) == 0:
            types_to_grab = res_types

        if "number_to_get" in data:
            number_to_get = data["number_to_get"]
        else:
            number_to_get = LIBRARY_CHUNK_SIZE


        search_spec = data["search_spec"]
        row_number = data["row_number"]
        search_text = search_spec['search_string']
        if "columns" in data:
            columns = data["columns"]
        else:
            columns = []

        filtered_res = []
        all_tags = []
        for rtype in types_to_grab:
            new_res, new_tags = getattr(the_user, f"grab_filtered_{rtype}s")(
                search_text, search_spec, columns, is_repo=is_repo
            )
            filtered_res += new_res
            all_tags += new_tags

        reverse =  search_spec["sort_direction"] == "descending"

        def sort_key_func(item):
            return item["sort_field"]

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)
        chunk_start = int(row_number / number_to_get) * number_to_get
        chunk_list = sorted_results[chunk_start: chunk_start + number_to_get]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            del r["sort_field"]
            chunk_dict[n + chunk_start] = r
        all_tags = sorted(list(set(all_tags)))
        result = {"success": True, "chunk_dict": chunk_dict, "all_tags": all_tags, "num_rows": len(sorted_results)}
        return result