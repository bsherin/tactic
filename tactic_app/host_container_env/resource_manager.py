# noinspection PyPackageRequirements
from flask import render_template, jsonify, request
from flask_login import current_user
import re, os

import tactic_app
from tactic_app import socketio, db, fs, repository_db, use_remote_repository, use_remote_database
from users import User
from exception_mixin import ExceptionMixin
import loaded_tile_management

print("in resource_manager with repository_db " + str(repository_db))
print("in resource_manager with use_remote_database " + str(use_remote_database))

repository_user = User.get_user_by_username("repository", use_remote_repository)

CHUNK_SIZE = int(int(os.environ.get("CHUNK_SIZE")) / 2)


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
        socketio.emit("update-{}-selector-row".format(self.res_type), res_dict,
                      namespace='/main', room=user_obj.get_id())

    def refresh_selector_list(self, user_obj=None):
        if user_obj is None:
            user_obj = current_user
        socketio.emit("refresh-{}-selector".format(self.res_type), {},
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
            if full_tag[0] is not "/":
                full_tag = "/" + full_tag
            parts = re.findall("/[^/]*", full_tag)
            current = ""
            for k in parts:
                current = current + k
                complete_list.append(current)
        return complete_list

    def build_res_dict(self, name, mdata, user_obj=None, file_id=None):
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
        if file_id is not None:
            if use_remote_database:
                return_data["size_for_sort"] = ""
                return_data["size"] = ""
            else:
                size_text, size = self.get_fs_file_siz_info(file_id)
                return_data["size_for_sort"] = size
                return_data["size"] = size_text
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


class LibraryResourceManager(ResourceManager):

    def __init__(self, res_type):
        ResourceManager.__init__(self, res_type)

    def get_fs_file_siz_info(self, file_id):
        db_to_use = self.repository_db if request.json["is_repository"] else self.db
        fsize = db_to_use["fs.files"].find_one({"_id": file_id})["length"]
        if fsize < 100000:
            ltext = "{}kb".format(round(fsize / 1000, 1))
        else:
            ltext = "{}mb".format(round(fsize / 1000000, 1))
        return ltext, fsize

    def has_hidden(self, tag_string):
        return "/hidden" in self.get_all_subtags(tag_string)

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

    @property
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

    @property
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

    @property
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

    @property
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

    @property
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

    def prep_collection_results(self, filtered_list):
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

    def prep_project_results(self, filtered_list):
        icon_dict = {"table": "icon:projects",
                     "freeform": "icon:projects",
                     "notebook": "icon:console",
                     "jupyter": "icon:globe-network"}
        for val in filtered_list:
            if val["res_type"] == "project":
                if "type" in val:
                    val["icon:th"] = icon_dict[val["type"]]
                else:
                    val["icon:th"] = icon_dict["table"]
                val["icon:upload"] = ""
        return filtered_list

    def prep_list_results(self, filtered_list):
        for val in filtered_list:
            if val["res_type"] == "list":
                val["icon:th"] = "icon:list"
                val["icon:upload"] = ""
                val["size"] = ""
                val["size_for_sort"] = 0
        return filtered_list

    def prep_code_results(self, filtered_list):
        for val in filtered_list:
            if val["res_type"] == "code":
                val["icon:th"] = "icon:code"
                val["icon:upload"] = ""
                val["size"] = ""
                val["size_for_sort"] = 0
        return filtered_list

    def prep_tile_results(self, filtered_list):
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

    def grab_all_list_chunk(self, do_jsonify=True):
        specs = {"collection": self.collection_spec,
                 "project": self.project_spec,
                 "tile": self.tile_spec,
                 "list": self.list_spec,
                 "code": self.code_spec}
        db_to_use = self.repository_db if request.json["is_repository"] else self.db

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
        for res_type, spec in specs.items():
            print(f"*** getting res_type {res_type}")
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
            print(f"about to get results with collection_name {collection_name} and name_field {name_field}")
            res = db_to_use[collection_name].find({"$or": or_list}, projection=[name_field, "metadata", "file_id"])
            if search_spec["active_tag"]:
                for doc in res:
                    try:
                        if "metadata" in doc and doc["metadata"] is not None:
                            mdata = doc["metadata"]
                            if self.has_hidden(mdata["tags"]):
                                all_subtags = self.add_hidden_to_all_subtags(mdata["tags"])
                                all_tags += self.add_hidden_to_tags(mdata["tags"])
                                if not self.has_hidden(search_spec["active_tag"]):
                                    continue
                            else:
                                all_subtags = self.get_all_subtags(mdata["tags"])
                                all_tags += mdata["tags"].split()
                            if search_spec["active_tag"] in all_subtags:
                                if "file_id" in doc:
                                    rdict = self.build_res_dict(doc[name_field], mdata, None, doc["file_id"])
                                else:
                                    rdict = self.build_res_dict(doc[name_field], mdata)
                                rdict["res_type"] = res_type
                                filtered_res.append(rdict)
                    except Exception as ex:
                        print("Got problem with doc " + str(doc[name_field]))
                print(f"got filtered_res of len {len(filtered_res)}")
            else:
                for doc in res:
                    try:
                        if "metadata" in doc and doc["metadata"] is not None:
                            mdata = doc["metadata"]

                            if self.has_hidden(mdata["tags"]):
                                all_tags += self.add_hidden_to_tags(mdata["tags"])
                                continue
                            else:
                                all_tags += mdata["tags"].split()
                        else:
                            mdata = None
                        if "file_id" in doc:
                            rdict = self.build_res_dict(doc[name_field], mdata, None, doc["file_id"])
                        else:
                            rdict = self.build_res_dict(doc[name_field], mdata)
                        rdict["res_type"] = res_type
                        filtered_res.append(rdict)
                    except Exception as ex:
                        print("Got problem with doc " + str(doc[name_field]))

        for prepper in [self.prep_collection_results, self.prep_project_results, self.prep_tile_results,
                        self.prep_list_results, self.prep_code_results]:
            filtered_res = prepper(filtered_res)

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
        if do_jsonify:
            return jsonify(result)
        else:
            return result

    def grab_resource_list_chunk(self, collection_name, name_field, content_field, additional_mdata_fields=None,
                                 do_jsonify=True):
        #  search_spec has active_tag, search_string, search_inside, search_metadata, sort_field, sort_direction
        db_to_use = self.repository_db if request.json["is_repository"] else self.db

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
        filtered_res = []
        all_tags = []
        if search_spec["active_tag"]:
            for doc in res:
                try:
                    if "metadata" in doc and doc["metadata"] is not None:
                        mdata = doc["metadata"]
                        if self.has_hidden(mdata["tags"]):
                            all_subtags = self.add_hidden_to_all_subtags(mdata["tags"])
                            all_tags += self.add_hidden_to_tags(mdata["tags"])
                            if not self.has_hidden(search_spec["active_tag"]):
                                continue
                        else:
                            all_subtags = self.get_all_subtags(mdata["tags"])
                            all_tags += mdata["tags"].split()
                        if search_spec["active_tag"] in all_subtags:
                            if "file_id" in doc:
                                rdict = self.build_res_dict(doc[name_field], mdata, None, doc["file_id"])
                            else:
                                rdict = self.build_res_dict(doc[name_field], mdata)
                            filtered_res.append(rdict)
                except Exception as ex:
                    print("Got problem with doc " + str(doc[name_field]))
        else:
            for doc in res:
                try:
                    if "metadata" in doc and doc["metadata"] is not None:
                        mdata = doc["metadata"]

                        if self.has_hidden(mdata["tags"]):
                            all_tags += self.add_hidden_to_tags(mdata["tags"])
                            continue
                        else:
                            all_tags += mdata["tags"].split()
                    else:
                        mdata = None
                    if "file_id" in doc:
                        rdict = self.build_res_dict(doc[name_field], mdata, None, doc["file_id"])
                    else:
                        rdict = self.build_res_dict(doc[name_field], mdata)
                    filtered_res.append(rdict)
                except Exception as ex:
                    print("Got problem with doc " + str(doc[name_field]))

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
        if do_jsonify:
            return jsonify(result)
        else:
            return result
