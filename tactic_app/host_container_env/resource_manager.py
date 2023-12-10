# noinspection PyPackageRequirements
from flask import render_template, jsonify, request
from flask_login import current_user
import re, os

import tactic_app
from tactic_app import socketio, db, fs, repository_db, use_remote_repository, use_remote_database
from users import User
from exception_mixin import ExceptionMixin
import loaded_tile_management
from mongo_accesser import res_types

print("in resource_manager with repository_db " + str(repository_db))
print("in resource_manager with use_remote_database " + str(use_remote_database))

repository_user = User.get_user_by_username("repository", use_remote_repository)

CHUNK_SIZE = int(int(os.environ.get("CHUNK_SIZE")) / 2)

default_tile_icons = {
    "standard": "application",
    "matplotlib": "timeline-line-chart",
    "d3": "code"
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

    def update_selector_row(self, res_dict, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit("update-selector-row", res_dict,
                      namespace='/main', room=user_obj.get_id())

    def update_repository_selector_row(self, res_dict):
        socketio.emit("update-repository-selector-row", res_dict,
                      namespace='/main', room="repository-events")

    def refresh_selector_list(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit("refresh-selector", {},
                      namespace='/main', room=user_obj.get_id())

    def add_error_drawer_entry(self, title, content, library_id):
        data = {"title": title, "content": content, "main_id": library_id}
        socketio.emit("add-error-drawer-entry", data, namespace='/main', room=library_id)

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
            if "type" in mdata and mdata["type"] in ["matplotlib", "d3"]:
                return default_tile_icons[mdata["type"]]
        return default_tile_icons["standard"]

    def build_res_dict(self, name, mdata, user_obj=None, file_id=None, res_type=None, doc_id=None):
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
                       "created_for_sort": datestring_for_sort,
                       "updated": updatestring,
                       "updated_for_sort": updatestring_for_sort,
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
            if use_remote_database:
                return_data["size_for_sort"] = ""
                return_data["size"] = ""
            else:
                size_text, size = self.get_fs_file_siz_info(file_id)
                return_data["size_for_sort"] = size
                return_data["size"] = size_text
        return return_data

    def show_um_message(self, message, library_id, timeout=3):
        data = {"message": message, "timeout": timeout, "main_id": library_id}
        socketio.emit('show-status-msg', data, namespace='/main', room=library_id)

    def clear_um_message(self, library_id):
        socketio.emit('clear-status-msg', {"main_id": library_id}, namespace='/main', room=library_id)

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

    def collection_spec(self, is_repository=False):
        colname = repository_user.collection_collection_name if is_repository else \
            current_user.collection_collection_name
        return {
            "collection_name": colname,
            "name_field": "collection_name",
            "content_field": None,
            "additional_mdata_fields": ["type", "number_of_docs"],
            "do_jsonify": False
        }

    def project_spec(self, is_repository=False):
        colname = repository_user.project_collection_name if is_repository else \
            current_user.project_collection_name
        return {
            "collection_name": colname,
            "name_field": "project_name",
            "content_field": None,
            "additional_mdata_fields": ["collection_name", "loaded_tiles", "type"],
            "do_jsonify": False
        }

    def tile_spec(self, is_repository=False):
        colname = repository_user.tile_collection_name if is_repository else \
            current_user.tile_collection_name
        return {
            "collection_name": colname,
            "name_field": "tile_module_name",
            "content_field": "tile_module",
            "additional_mdata_fields": None,
            "do_jsonify": False
        }

    def list_spec(self, is_repository=False):
        colname = repository_user.list_collection_name if is_repository else \
            current_user.list_collection_name
        return {
            "collection_name": colname,
            "name_field": "list_name",
            "content_field": "the_list",
            "additional_mdata_fields": None,
            "do_jsonify": False
        }

    def code_spec(self, is_repository=False):
        colname = repository_user.code_collection_name if is_repository else \
            current_user.code_collection_name
        return {
            "collection_name": colname,
            "name_field": "code_name",
            "content_field": "the_code",
            "additional_mdata_fields": ["functions", "classes"],
            "do_jsonify": False
        }

    def prep_collection_results(self, filtered_list, is_all=False):
        if is_all:
            icon_dict = {"table": "icon:database", "freeform": "icon:database"}
        else:
            icon_dict = {"table": "icon:th", "freeform": "icon:align-left"}

        for val in filtered_list:
            if val["res_type"] == "collection":
                if "type" in val:
                    val["doc_type"] = icon_dict[val["type"]]
                    val["icon:th"] = icon_dict[val["type"]]
                else:
                    val["doc_type"] = icon_dict["table"]
                    val["icon:th"] = val["doc_type"]
                val["icon:upload"] = ""
        return filtered_list

    def prep_project_results(self, filtered_list, is_all=False):
        if is_all:
            icon_dict = {"table": "icon:projects",
                         "freeform": "icon:projects",
                         "notebook": "icon:projects",
                         "none": "icon:projects",
                         "jupyter": "icon:projects"}
        else:
            icon_dict = {"table": "icon:projects",
                         "freeform": "icon:projects",
                         "notebook": "icon:console",
                         "none": "icon:projects",
                         "jupyter": "icon:globe-network"}
        for val in filtered_list:
            if val["res_type"] == "project":
                if "type" in val:
                    val["icon:th"] = icon_dict[val["type"]]
                else:
                    val["icon:th"] = icon_dict["table"]
                val["icon:upload"] = ""
        return filtered_list

    def prep_list_results(self, filtered_list, is_all=False):
        for val in filtered_list:
            if val["res_type"] == "list":
                val["icon:th"] = "icon:list"
                val["icon:upload"] = ""
                val["size"] = ""
                val["size_for_sort"] = 0
        return filtered_list

    def prep_code_results(self, filtered_list, is_all=False):
        for val in filtered_list:
            if val["res_type"] == "code":
                val["icon:th"] = "icon:code"
                val["icon:upload"] = ""
                val["size"] = ""
                val["size_for_sort"] = 0
        return filtered_list

    def prep_tile_results(self, filtered_list, is_all=False):
        if is_all:
            type_dict = {"standard": "icon:application",
                         "matplotlib": "icon:application",
                         "d3": "icon:application"}
        else:
            type_dict = {"standard": "icon:application",
                         "matplotlib": "icon:timeline-line-chart",
                         "d3": "icon:timeline-area-chart"}

        if not request.json["is_repository"]:
            failed_loads = set(loaded_tile_management.get_failed_loads_list(current_user.username))
            successful_loads = set(loaded_tile_management.get_loaded_user_modules(current_user.username))
        else:
            failed_loads = []
            successful_loads = []
        for val in filtered_list:
            if val["res_type"] == "tile":
                if val["name"] in failed_loads:
                    val["icon:upload"] = "icon:error"
                elif val["name"] in successful_loads:
                    val["icon:upload"] = "icon:upload"
                else:
                    val["icon:upload"] = ""
                if "type" in val and val["type"] in type_dict:
                    val["icon:th"] = type_dict[val["type"]]
                else:
                    val["icon:th"] = type_dict["standard"]
                val["size"] = ""
                val["size_for_sort"] = 0
        return filtered_list

    def grab_all_list_chunk(self):
        data = request.json
        is_repo = data["is_repository"]
        print(f"in grab_all_list_chunk with is_repo {str(is_repo)}")
        specs = {"collection": self.collection_spec(is_repo),
                 "project": self.project_spec(is_repo),
                 "tile": self.tile_spec(is_repo),
                 "list": self.list_spec(is_repo),
                 "code": self.code_spec(is_repo)}
        preppers = {"collection": self.prep_collection_results,
                    "project": self.prep_project_results,
                    "tile": self.prep_tile_results,
                    "list": self.prep_list_results,
                    "code": self.prep_code_results}

        pane_type = data["pane_type"]
        if pane_type == "all":
            types_to_grab = res_types
        else:
            types_to_grab = [pane_type]

        if "number_to_get" in data:
            number_to_get = data["number_to_get"]
        else:
            number_to_get = CHUNK_SIZE
        db_to_use = self.repository_db if is_repo else self.db
        def sort_mdata_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        def sort_created_key(item):
            return item["created_for_sort"]

        def sort_updated_key(item):
            return item["updated_for_sort"]

        def sort_size_key(item):
            return item["size_for_sort"]

        search_spec = data["search_spec"]
        row_number = data["row_number"]
        search_text = search_spec['search_string']

        filtered_res = []
        all_tags = []
        sort_field = search_spec["sort_field"]
        for rtype in types_to_grab:
            spec = specs[rtype]
            collection_name = spec["collection_name"]
            name_field = spec["name_field"]
            content_field = spec["content_field"]
            additional_mdata_fields = spec["additional_mdata_fields"]
            if search_spec["search_inside"] and content_field is None:
                continue
            reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
            or_list = [{name_field: reg}]
            and_list = []
            if search_spec["search_metadata"]:
                or_list += [{"metadata.notes": reg}, {"metadata.tags": reg}, {"metadata.type": reg}]
                if additional_mdata_fields:
                    for fld in additional_mdata_fields:
                        or_list.append({"metadata." + fld: reg})
            if content_field and search_spec["search_inside"]:
                or_list += [{content_field: reg}]
            and_list.append({"$or": or_list})
            if not search_spec["show_hidden"]:
                hidden_reg = "(^|/| )hidden($|/| )"
                and_list.append({"metadata.tags": {"$not": {"$regex": hidden_reg}}})
            if search_spec["active_tag"]:
                atag = search_spec['active_tag']
                if atag[0] == "/":
                    atag = atag[1:]
                tag_reg = f"(^|/| ){atag}($|/| )"
                and_list.append({"metadata.tags": {"$regex": tag_reg}})
            res = db_to_use[collection_name].find({"$and": and_list},
                                                  projection=[name_field, "metadata", "file_id"])
            for doc in res:
                try:
                    if "metadata" in doc and doc["metadata"] is not None:
                        mdata = doc["metadata"]
                        doc_id = str(doc["_id"])
                        all_subtags = self.get_all_subtags(mdata["tags"])
                        all_tags += mdata["tags"].split()
                        if "file_id" in doc:
                            rdict = self.build_res_dict(doc[name_field], mdata, None,
                                                        doc["file_id"], res_type=rtype, doc_id=doc_id)
                        else:
                            rdict = self.build_res_dict(doc[name_field], mdata, res_type=rtype, doc_id=doc_id)
                        if mdata and "tags" in mdata:
                            rdict["hidden"] = self.has_hidden(mdata["tags"])
                        else:
                            rdict["hidden"] = False
                        filtered_res.append(rdict)
                except Exception as ex:
                    msg = self.get_traceback_message(ex, f"Got problem with doc {str(doc[name_field])}")
                    print(msg)

        is_all = pane_type == "all"
        for rtype in types_to_grab:
            prepper = preppers[rtype]
            filtered_res = prepper(filtered_res, is_all)

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        all_tags = sorted(list(set(all_tags)))

        if sort_field == "created":
            sort_key_func = sort_created_key
        elif sort_field == "updated":
            sort_key_func = sort_updated_key
        elif sort_field == "size":
            sort_key_func = sort_size_key
        else:
            sort_key_func = sort_mdata_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / number_to_get) * number_to_get
        chunk_list = sorted_results[chunk_start: chunk_start + number_to_get]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r

        result = {"success": True, "chunk_dict": chunk_dict, "all_tags": all_tags, "num_rows": len(sorted_results)}
        return jsonify(result)

    def grab_all_list_chunkold(self):
        is_repo = request.json["is_repository"]
        print(f"in grab_all_list_chunk with is_repo {str(is_repo)}")
        specs = {"collection": self.collection_spec(is_repo),
                 "project": self.project_spec(is_repo),
                 "tile": self.tile_spec(is_repo),
                 "list": self.list_spec(is_repo),
                 "code": self.code_spec(is_repo)}
        preppers = {"collection": self.prep_collection_results,
                    "project": self.prep_project_results,
                    "tile": self.prep_tile_results,
                    "list": self.prep_list_results,
                    "code": self.prep_code_results}
        pane_type = request.json["pane_type"]
        if pane_type == "all":
            types_to_grab = res_types
        else:
            types_to_grab = [pane_type]
        db_to_use = self.repository_db if is_repo else self.db
        print(f"db_to_use is {str(db_to_use)}")
        print(f"self.db is {str(self.db)}")
        print(f"self.repository_db is {str(self.repository_db)}")
        def sort_mdata_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        def sort_created_key(item):
            return item["created_for_sort"]

        def sort_updated_key(item):
            return item["updated_for_sort"]

        def sort_size_key(item):
            return item["size_for_sort"]

        search_spec = request.json["search_spec"]
        row_number = request.json["row_number"]
        search_text = search_spec['search_string']

        filtered_res = []
        all_tags = []
        for rtype in types_to_grab:
            spec = specs[rtype]
            collection_name = spec["collection_name"]
            name_field = spec["name_field"]
            content_field = spec["content_field"]
            additional_mdata_fields = spec["additional_mdata_fields"]
            if search_spec["search_inside"] and content_field is None:
                continue
            reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
            or_list = [{name_field: reg}]
            if search_spec["search_metadata"]:
                or_list += [{"metadata.notes": reg}, {"metadata.tags": reg}, {"metadata.type": reg}]
                if additional_mdata_fields:
                    for fld in additional_mdata_fields:
                        or_list.append({"metadata." + fld: reg})
            if content_field and search_spec["search_inside"]:
                or_list += [{content_field: reg}]
            res = db_to_use[collection_name].find({"$or": or_list}, projection=[name_field, "metadata", "file_id"])
            if search_spec["active_tag"]:
                for doc in res:
                    try:
                        if "metadata" in doc and doc["metadata"] is not None:
                            mdata = doc["metadata"]
                            doc_id = str(doc["_id"])
                            if self.has_hidden(mdata["tags"]) and not search_spec["show_hidden"]:
                                    continue
                            else:
                                all_subtags = self.get_all_subtags(mdata["tags"])
                                all_tags += mdata["tags"].split()
                            if search_spec["active_tag"] in all_subtags:
                                if "file_id" in doc:
                                    rdict = self.build_res_dict(doc[name_field], mdata, None,
                                                                doc["file_id"], res_type=rtype, doc_id=doc_id)
                                else:
                                    rdict = self.build_res_dict(doc[name_field], mdata, res_type=rtype, doc_id=doc_id)
                                rdict["hidden"] = self.has_hidden(mdata["tags"])
                                filtered_res.append(rdict)
                    except Exception as ex:
                        msg = self.get_traceback_message(ex, f"Got problem with doc {str(doc[name_field])}")
                        print(msg)
            else:
                for doc in res:
                    try:
                        if "metadata" in doc and doc["metadata"] is not None:
                            mdata = doc["metadata"]
                            if self.has_hidden(mdata["tags"]) and not search_spec["show_hidden"]:
                                continue
                            else:
                                all_tags += mdata["tags"].split()
                        else:
                            mdata = None
                        doc_id = str(doc["_id"])
                        if "file_id" in doc:
                            rdict = self.build_res_dict(doc[name_field], mdata, None,
                                                        doc["file_id"], res_type=rtype, doc_id=doc_id)
                        else:
                            rdict = self.build_res_dict(doc[name_field], mdata, res_type=rtype, doc_id=doc_id)
                        rdict["hidden"] = self.has_hidden(mdata["tags"])
                        filtered_res.append(rdict)
                    except Exception as ex:
                        msg = self.get_traceback_message(ex, f"Got problem with doc {str(doc[name_field])}")
                        print(msg)

        is_all = pane_type == "all"
        for rtype in types_to_grab:
            prepper = preppers[rtype]
            filtered_res = prepper(filtered_res, is_all)

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        all_tags = sorted(list(set(all_tags)))
        sort_field = search_spec["sort_field"]

        if sort_field == "created":
            sort_key_func = sort_created_key
        elif sort_field == "updated":
            sort_key_func = sort_updated_key
        elif sort_field == "size":
            sort_key_func = sort_size_key
        else:
            sort_key_func = sort_mdata_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / CHUNK_SIZE) * CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: chunk_start + CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r

        result = {"success": True, "chunk_dict": chunk_dict, "all_tags": all_tags, "num_rows": len(sorted_results)}
        return jsonify(result)

