# noinspection PyPackageRequirements
from flask import render_template, jsonify, request
from flask_login import current_user
import re, os

import tactic_app
from tactic_app import socketio, db
from users import User
from exception_mixin import ExceptionMixin

repository_user = User.get_user_by_username("repository")

CHUNK_SIZE = int(int(os.environ.get("CHUNK_SIZE")) / 2)


def doflash(message, alert_type='alert-info', user_id=None):
    if user_id is None:
        user_id = current_user.get_id()
    data = {"message": message, "alert_type": alert_type}
    socketio.emit('stop-spinner', data, namespace='/library', room=user_id)


# noinspection PyMethodMayBeStatic
class ResourceManager(ExceptionMixin):
    is_repository = False
    rep_string = ""
    collection_list = ""
    collection_list_with_metadata = ""
    collection_name = ""
    name_field = ""

    def __init__(self, res_type):
        self.res_type = res_type
        if self.is_repository:
            self.module_id = "repository_" + self.res_type + "_module"
        else:
            self.module_id = self.res_type + "_module"
        self.add_rules()
        self.tag_list = []

    def add_rules(self):
        print("not implemented")

    def update_selector_row(self, res_dict):
        user_obj = current_user
        socketio.emit("update-{}-selector-row".format(self.res_type), res_dict,
                      namespace='/library', room=user_obj.get_id())

    def refresh_selector_list(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit("refresh-{}-selector".format(self.res_type), {},
                      namespace='/library', room=user_obj.get_id())

    def get_resource_list(self):
        if self.is_repository:
            user_obj = repository_user
        else:
            user_obj = current_user
        return getattr(user_obj, self.collection_list)

    def get_resource_list_with_metadata(self, user_obj=None):
        if user_obj is None:
            if self.is_repository:
                user_obj = repository_user
            else:
                user_obj = current_user
        return getattr(user_obj, self.collection_list_with_metadata)

    def get_tag_list(self, user_obj=None):
        res_list = self.get_resource_list_with_metadata(user_obj)
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        return sorted(list(set(result)))

    def get_resource_data_list(self, user_obj=None):
        res_list_with_metadata = self.get_resource_list_with_metadata(user_obj)
        result = self.build_data_list(res_list_with_metadata)
        return result

    def get_all_subtags(self, tag_string):
        full_tags = tag_string.split()
        complete_list = []
        for full_tag in full_tags:
            full_tag = "/" + full_tag
            parts = re.findall("/[^/]*", full_tag)
            current = ""
            for k in parts:
                current = current + k
                complete_list.append(current)
        return complete_list

    @staticmethod
    def build_res_dict(name, mdata, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        if mdata is None:
            datestring = ""
            tagstring = ""
            updatestring = ""
            datestring_for_sort = ""
            updatestring_for_sort = ""
            notes = ""
        else:
            if "datetime" in mdata:
                datestring, datestring_for_sort = user_obj.get_timestrings(mdata["datetime"])
            else:
                datestring = ""
                datestring_for_sort = ""
            if "updated" in mdata:
                updatestring, updatestring_for_sort = user_obj.get_timestrings(mdata["updated"])
            else:
                updatestring = datestring
                updatestring_for_sort = datestring_for_sort
            tagstring = str(mdata["tags"])
            notes = mdata["notes"]

        return_data = {"name": name,
                       "created": datestring,
                       "created_for_sort": datestring_for_sort,
                       "updated": updatestring,
                       "updated_for_sort": updatestring_for_sort,
                       "tags": tagstring,
                       "notes": notes}
        skip_fields = ["name", "notes", "datetime", "tags", "updated", "_id"]
        if mdata is not None:
            for field, val in mdata.items():
                if field not in skip_fields:
                    return_data[field] = val

        return return_data

    def build_data_list(self, res_list, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        larray = []
        for res_item in res_list:
            mdata = res_item[1]
            larray.append(self.build_res_dict(res_item[0], mdata, user_obj))
        return larray

    def show_um_message(self, message, library_id, timeout=3):
        data = {"message": message, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/library', room=library_id)

    def clear_um_message(self, library_id):
        socketio.emit('clear-status-msg', {}, namespace='/library', room=library_id)

    def start_library_spinner(self, library_id):
        print("starting the library spinner")
        socketio.emit('start-spinner', {}, namespace='/library', room=library_id)

    def stop_library_spinner(self, library_id):
        print("stopping the library spinner")
        socketio.emit('stop-spinner', {}, namespace='/library', room=library_id)


class LibraryResourceManager(ResourceManager):

    def __init__(self, res_type):
        ResourceManager.__init__(self, res_type)

    def grab_resource_list_chunk(self, collection_name, name_field, content_field, additional_mdata_fields=None):
        #  search_spec has active_tag, search_string, search_inside, search_metadata, sort_field, sort_direction
        def sort_mdata_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        def sort_created_key(item):
            return item["created_for_sort"]

        def sort_updated_key(item):
            return item["updated_for_sort"]

        search_spec = request.json["search_spec"]
        row_number = request.json["row_number"]
        search_text = search_spec['search_string']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        or_list = [{name_field: reg}]
        if search_spec["search_metadata"]:
            or_list += [{"metadata.notes": reg}, {"metadata.tags": reg}, {"metadata.type": reg}]
            if additional_mdata_fields:
                for fld in additional_mdata_fields:
                    or_list.append({"metadata." + fld: reg})
        if content_field and search_spec["search_inside"]:
            or_list += [{content_field: reg}]
        res = db[collection_name].find({"$or": or_list}, projection=[name_field, "metadata"])
        filtered_res = []
        all_tags = []
        if search_spec["active_tag"]:
            for doc in res:
                if "metadata" in doc:
                    mdata = doc["metadata"]
                    all_tags += mdata["tags"].split()
                    if search_spec["active_tag"] in self.get_all_subtags(mdata["tags"]):
                        filtered_res.append(self.build_res_dict(doc[name_field], mdata))
        else:
            for doc in res:
                if "metadata" in doc:
                    mdata = doc["metadata"]
                    all_tags += mdata["tags"].split()
                else:
                    mdata = None
                filtered_res.append(self.build_res_dict(doc[name_field], mdata))

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        all_tags = list(sorted(all_tags))
        sort_field = search_spec["sort_field"]
        if sort_field == "created":
            sort_key_func = sort_created_key
        elif sort_field == "updated":
            sort_key_func = sort_updated_key
        else:
            sort_key_func = sort_mdata_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / CHUNK_SIZE) * CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: chunk_start + CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r
        return jsonify({"success": True, "chunk_dict": chunk_dict, "all_tags": all_tags, "num_rows": len(sorted_results)})
