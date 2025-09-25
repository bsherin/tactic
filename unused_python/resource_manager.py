# noinspection PyPackageRequirements
from flask import render_template, jsonify, request
from flask_login import current_user
import re, os

import tactic_app
from tactic_app import socketio, db, fs, repository_db
from users import User
from exception_mixin import ExceptionMixin
import loaded_tile_management
from mongo_accesser import res_types

print("in resource_manager with repository_db " + str(repository_db))

repository_user = User.get_user_by_username("repository")

LIBRARY_CHUNK_SIZE = int(int(os.environ.get("LIBRARY_CHUNK_SIZE")) / 2)

default_tile_icons = {
    "standard": "application",
    "matplotlib": "timeline-line-chart",
    "d3": "code",
    "js": "code"
}


# noinspection PyMethodMayBeStatic,PyMissingConstructor
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
        self.db = db
        self.fs = fs
        self.repository_db = repository_db
        self.add_rules()
        self.tag_list = []

    def add_rules(self):
        print("not implemented")

    def grab_field(self, res_name, field, user_obj=None):
        return None

    def refresh_selector_list(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit("refresh-selector", {},
                      namespace='/main', room=user_obj.get_id())

    def add_error_drawer_entry(self, title, content):
        data = {"title": title, "content": content}
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=current_user.get_id())

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

    def get_tag_list(self, show_hidden=True):
        res_list = self.get_resource_list_with_metadata()
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def get_all_subtags(self, tag_string):
        full_tags = tag_string.split()
        complete_list = []
        for full_tag in full_tags:
            if full_tag[0] is not "/":
                full_tag = "/" + full_tag
            parts = re.findall("/[^/]*", full_tag)
            current = ""
            for k in parts:
                current = current + k
                complete_list.append(current)
        return complete_list

    def get_tile_icon_from_mdata(self, mdata):
        tag_match_dict = {
            "cluster": "group-objects",
            "classify": "label",
            "network": "layout",
            "utility": "cog"
        }
        if mdata is not None:
            if "icon" in mdata:
                return mdata["icon"]
            if "tags" in mdata:
                for tagstr, icon in tag_match_dict.items():
                    if tagstr in mdata["tags"]:
                        return icon
            if "type" in mdata and mdata["type"] in ["matplotlib", "d3", "js"]:
                return default_tile_icons[mdata["type"]]
        return default_tile_icons["standard"]

    def build_res_dict(self, name, mdata, user_obj=None, file_id=None, res_type=None, doc_id=None, sort_field=None):

        if user_obj is None:
            user_obj = current_user
        if mdata is None:
            datestring = ""
            tagstring = ""
            updatestring = ""
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
            if "tags" in mdata:
                tagstring = str(mdata["tags"])
            else:
                tagstring = ""
            if "notes" in mdata:
                notes = mdata["notes"]
            else:
                notes = ""

        return_data = {"name": name,
                       "created": datestring,
                       "updated": updatestring,
                       "tags": tagstring,
                       "notes": notes}
        skip_fields = ["name", "notes", "datetime", "tags", "updated", "_id"]
        if res_type is not None:
            return_data["res_type"] = res_type
        if doc_id is not None:
            return_data["_id"] = doc_id
        if mdata is not None:
            for field, val in mdata.items():
                if field not in skip_fields:
                    return_data[field] = val
        if res_type == "tile" and "icon" not in return_data:
            return_data["icon"] = self.get_tile_icon_from_mdata(mdata)
        if file_id is not None:
            size_text, size = self.get_fs_file_siz_info(file_id)
            return_data["size"] = size_text
        if sort_field is not None:
            match sort_field:
                case "created":
                    sf_value = datestring_for_sort
                case "updated":
                    sf_value = updatestring_for_sort
                case "size":
                    sf_value = size
                case "icon:th":
                    sf_value = res_type
                case _:
                    if sort_field in return_data:
                        sf_value = return_data[sort_field]
                    else:
                        sf_value = None

            return_data["sort_field"] = sf_value
        return return_data

    def emit_status_message(self, message, timeout=4):
        data = {"message": message, "timeout": timeout}
        socketio.emit('show-status-msg', data, namespace='/main', room=current_user.get_id())

    def emit_clear_status(self):
        socketio.emit('clear-status-msg', {}, namespace='/main', room=current_user.get_id())

    def send_import_report(self, result, library_id):
        if "content" in result:
            content = result["content"]
        else:
            content = ""
        new_resource_name = None

        title = result["title"]

        if result["success"] == "partial":
            content += "{} files not read successfully. ".format(len(result["failed_reads"].keys()))

        if "file_decoding_errors" in result and len(result["file_decoding_errors"].keys()) > 0:
            content += "<br><b>Decoding errors were enountered</b>"
            for filename, val in result["file_decoding_errors"].items():
                number_of_errors = str(len(val))
                content += "<br>{}: {} errors".format(filename, number_of_errors)
                for error_detail in val:
                    content += "<br>{}".format(error_detail)
        if "failed_reads" in result and len(result["failed_reads"].keys()) > 0:
            content += "<br><b>Reads failed for the following reasons:</b>"
            for filename, val in result["failed_reads"].items():
                content += "<br>File {}:</br>".format(filename)
                content += "{}".format(val)
        data = {"title": title, "content": content, "resource_name": new_resource_name, "success": result["success"]}
        socketio.emit("upload-response", data, namespace='/main', room=library_id)
        return


# noinspection PyUnusedLocal
class LibraryResourceManager(ResourceManager):

    def __init__(self, res_type):
        ResourceManager.__init__(self, res_type)

    def get_fs_file_siz_info(self, file_id):
        db_to_use = self.repository_db if request.json["is_repository"] else self.db
        file = db_to_use["fs.files"].find_one({"_id": file_id})
        if file is None:
            fsize = 0
        else:
            fsize = db_to_use["fs.files"].find_one({"_id": file_id})["length"]
        if fsize < 100000:
            ltext = "{}kb".format(round(fsize / 1000, 1))
        else:
            ltext = "{}mb".format(round(fsize / 1000000, 1))
        return ltext, fsize

    def has_hidden(self, tag_string):
        if re.search("(^|/| )hidden($|/| )", tag_string):
            return True
        return False

    def add_hidden_to_all_subtags(self, tag_string):
        all_subtags = self.get_all_subtags(tag_string)
        edited_tags = []
        for subtag in all_subtags:
            if re.findall("^/[^/]*", subtag)[0] == "/hidden":
                edited_tags.append(subtag)
            else:
                edited_tags.append("/hidden" + subtag)
        return edited_tags

    def add_hidden_to_tags(self, tag_string):
        tag_list = tag_string.split()
        tags = []
        for tag in tag_list:
            if tag.startswith("hidden"):
                tags.append(tag)
            else:
                if not tag[0] == "/":
                    tag = "/" + tag
                tag = "hidden" + tag
                tags.append(tag)
        return tags