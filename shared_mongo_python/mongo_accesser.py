import re
import datetime
from datetime import datetime, timezone
from tactic_logging import log

name_keys = {"tile": "tile_module_name", "list": "list_name", "collection": "collection_name",
             "project": "project_name", "code": "code_name", "metabook": "metabook_name"}
res_types = ["list", "collection", "project", "tile", "code", "metabook"]

PROTECTED_METADATA_KEYS = ["_id", "file_id", "name", "my_class_for_recreate", "table_spec", "data_text", "length",
                           "data_rows", "header_list", "number_of_rows"]


def bytes_to_string(bstr):
    if isinstance(bstr, bytes):
        return bstr.decode()
    else:
        return bstr


class MongoAccessException(Exception):
    pass


class NameExistsError(MongoAccessException):
    pass


class NonexistentNameError(MongoAccessException):
    pass

class MongoAccess(object):

    @staticmethod
    def update_metadata(mdata, update_created=False):
        mdata["updated"] = datetime.now(timezone.utc)
        if update_created:
            mdata["datetime"] = mdata["updated"]
        return mdata

    @staticmethod
    def sort_data_list_key(item):
        return str.lower(str(item[0]))

    @staticmethod
    def has_hidden(tag_string):
        if re.search("(^|/| )hidden($|/| )", tag_string):
            return True
        return False

    def grab_filtered_resources(self, res_type, col_name, name_field, content_field, additional_mdata_fields,
                                search_text, search_spec, columns, is_repo=False):
        def _ok_field(f):
            return isinstance(f, str) and f.strip() != ""

        # choose DB
        db_to_use = self.repository_db if is_repo else self.db
        sort_field = search_spec["sort_field"]

        # compile a safe regex (literal search, case-insensitive), wrapped with .* ... .*
        # if you want real regex power from search_text, drop re.escape.
        reg = re.compile(".*" + re.escape(search_text) + ".*", re.IGNORECASE)

        # ---- build OR clause safely
        or_list = []
        if _ok_field(name_field):
            or_list.append({name_field: reg})

        if search_spec.get("search_metadata"):
            # fixed metadata fields
            or_list += [
                {"metadata.notes": reg},
                {"metadata.tags": reg},
                {"metadata.type": reg},
            ]
            # optional metadata fields
            if additional_mdata_fields:
                for fld in additional_mdata_fields:
                    if _ok_field(fld):
                        or_list.append({f"metadata.{fld}": reg})

        if search_spec.get("search_inside"):
            if _ok_field(content_field):
                or_list.append({content_field: reg})
            else:
                # optional: log so you know why inside-search was ignored for this type
                # self.mworker.send_info("grab_filtered_resources", f"Ignoring search_inside: invalid content_field={content_field!r}")
                pass

        and_list = []
        if or_list:
            and_list.append({"$or": or_list})

        # ---- hidden filtering
        if not search_spec.get("show_hidden"):
            hidden_reg = r"(^|/| )hidden($|/| )"
            and_list.append({"metadata.tags": {"$not": {"$regex": hidden_reg}}})

        # ---- active tag filter
        if search_spec.get("active_tag"):
            atag = search_spec["active_tag"]
            if atag.startswith("/"):
                atag = atag[1:]
            # escape the tag so special chars don't become regex tokens
            tag_reg = rf"(^|/| ){re.escape(atag)}($|/| )"
            and_list.append({"metadata.tags": {"$regex": tag_reg}})

        # final query (avoid {"$and": []} which would match everything, but is fine too)
        query = {"$and": and_list} if and_list else {}

        # projection — don't include invalid keys
        projection = {"metadata": 1, "file_id": 1}
        if _ok_field(name_field):
            projection[name_field] = 1

        res = db_to_use[col_name].find(query, projection)

        # ---- collect results
        all_tags = []
        filtered_res = []
        for doc in res:
            try:
                mdata = doc.get("metadata") or {}
                doc_id = str(doc.get("_id"))

                # gather tags (robust to missing)
                tags_str = mdata.get("tags", "")
                if isinstance(tags_str, str):
                    all_tags += tags_str.split()

                # name value may be missing if name_field was invalid or absent in doc
                name_val = doc.get(name_field) if _ok_field(name_field) else None

                if "file_id" in doc and "size" in columns:
                    rdict = self.build_res_dict(
                        name_val, mdata, doc["file_id"],
                        res_type=res_type, doc_id=doc_id, sort_field=sort_field
                    )
                else:
                    rdict = self.build_res_dict(
                        name_val, mdata, None,
                        res_type=res_type, doc_id=doc_id, sort_field=sort_field
                    )

                rdict["hidden"] = self.has_hidden(tags_str) if isinstance(tags_str, str) else False
                filtered_res.append(rdict)

            except Exception:
                # be careful not to KeyError while composing the error message
                safe_name = doc.get(name_field) if _ok_field(name_field) else None
                log.exception("Problem processing document", name=safe_name)

        return filtered_res, all_tags


    @staticmethod
    def extract_search_context(text: str, search: str, margin: int = 75) -> str:
        index = text.find(search)
        if index == -1:
            return None  # search string not found
        start = max(0, index - margin)
        end = min(len(text), index + len(search) + margin)
        return text[start:end]

    @staticmethod
    def create_initial_metadata():
        mdata = {"datetime": datetime.now(timezone.utc),
                 "updated": datetime.now(timezone.utc),
                 "tags": "",
                 "notes": ""}
        return mdata

    @staticmethod
    def sort_rows(row_dict):
        result = []
        sorted_int_keys = sorted([int(key) for key in row_dict.keys()])
        for r in sorted_int_keys:
            result.append(row_dict[str(r)])
        return result

    def resource_collection_name(self, res_type):
        return getattr(self, f"{res_type}_collection_name")

    def get_name_field(self, res_type):
        return getattr(self, f"{res_type}_name_field")

    def get_resource_doc(self, res_type, res_name):
        return getattr(self, f"get_{res_type}_doc")(res_name)

    def get_resource_doc_from_id(self, res_type, res_id):
        return getattr(self, f"get_{res_type}_doc_from_id")(res_id)

    def get_all_resource_names(self, res_type):
        colname = getattr(self, f"{res_type}_collection_name")
        name_key = name_keys[res_type]
        coll = self.db[colname]
        names = [doc[name_key] for doc in coll.find({}, {name_key: 1, "_id": 0})]
        return names

    def get_filtered_resource_names(self, res_type, tag_filter=None, search_filter=None, username=None):
        if username is None:
            username = self.username
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        cname = getattr(self, f"{res_type}_collection_name")(username)
        name_key = name_keys[res_type]
        if cname not in self.db.list_collection_names():
            self.db.create_collection(cname)
            return []
        res_names = []
        for doc in self.db[cname].find():
            if tag_filter is not None:
                if "metadata" in doc:
                    if "tags" in doc["metadata"]:
                        if tag_filter in doc["metadata"]["tags"].lower():
                            res_names.append(doc[name_key])
            elif search_filter is not None:
                if search_filter in doc[name_key].lower():
                    res_names.append(doc[name_key])
            else:
                res_names.append(doc[name_key])
        return sorted([str(t) for t in res_names], key=str.lower)

    def get_fs_file_siz_info(self, file_id, is_repo=False):
        db_to_use = self.repository_db if is_repo else self.db
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

    def build_res_dict(self, name, mdata, file_id=None, res_type=None, doc_id=None, sort_field=None):
        datestring_for_sort = ""
        updatestring_for_sort = ""
        if mdata is None:
            datestring = ""
            tagstring = ""
            updatestring = ""
            notes = ""
        else:
            if "datetime" in mdata:
                datestring, datestring_for_sort = self.get_timestrings(mdata["datetime"])
            else:
                datestring = ""
                datestring_for_sort = ""
            if "updated" in mdata:
                updatestring, updatestring_for_sort = self.get_timestrings(mdata["updated"])
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
        else:
            size = 0
        sf_value = None
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


    ### Stuff below here is needed if I mount a Mongo database that hasn't yet
    ### Had data collections updated to the new compact format where they all live in a single collection
    ### This is just what is needed for the minimal thing of running the update
    ### More stuff is in colleciton_manager

    #legacy
    # @property
    # def data_collections(self):
    #     cnames = self.db.list_collection_names()
    #     string_start = self.username + ".data_collection."
    #     my_collection_names = []
    #     for cname in cnames:
    #         m = re.search(string_start + "(.*)", cname)
    #         if m:
    #             my_collection_names.append(m.group(1))
    #     return sorted([str(t) for t in my_collection_names], key=str.lower)
    #
    # # legacy
    # def full_collection_name(self, cname):
    #     return self.username + ".data_collection." + cname
    #
    # # legacy
    # def build_data_collection_name(self, collection_name):
    #     return '{}.data_collection.{}'.format(self.username, collection_name)
    #
    # #legacy
    # def get_short_collection_name(self, full_collection_name):
    #     return re.sub(r"^.*?\.data_collection\.", "", full_collection_name)
    #
    # #legacy
    # def remove_collection_legacy(self, collection_name):
    #     def get_traceback_message(e, special_string=None):
    #         if special_string is None:
    #             template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
    #         else:
    #             template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    #         error_string = template.format(type(e).__name__, e.args)
    #         error_string += traceback.format_exc() + "</pre>"
    #         return error_string
    #     fcname = self.full_collection_name(collection_name)
    #     for doc in self.db[fcname].find():
    #         if "file_id" in doc:
    #             try:
    #                 self.fs.delete(doc["file_id"])
    #             except Exception as ex:
    #                 print("couldn't delete a gridfs entry")
    #                 get_traceback_message(ex)
    #     self.db.drop_collection(fcname)
    #     return True
    #
    # # legacy
    # def get_collection_metadata_legacy(self, short_collection_name):
    #     name_exists = short_collection_name in self.data_collections
    #     if not name_exists:
    #         return None
    #
    #     full_collection_name = self.build_data_collection_name(short_collection_name)
    #     the_collection = self.db[full_collection_name]
    #     return the_collection.find_one({"name": "__metadata__"})
    #
    # # legacy
    # def get_all_collection_info_legacy(self, short_collection_name, return_lists=True):
    #     def get_traceback_message(e, special_string=None):
    #         if special_string is None:
    #             template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
    #         else:
    #             template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    #         error_string = template.format(type(e).__name__, e.args)
    #         error_string += traceback.format_exc() + "</pre>"
    #         return error_string
    #     name_exists = short_collection_name in self.data_collections
    #
    #     if not name_exists:
    #         return False, None, None, None
    #     else:
    #         full_collection_name = self.build_data_collection_name(short_collection_name)
    #         the_collection = self.db[full_collection_name]
    #         new_collection_dict = {}
    #         header_list_dict = {}
    #         doc_metadata_dict = {}
    #         collection_metadata = the_collection.find_one({"name": "__metadata__"})
    #         if "type" in collection_metadata and collection_metadata["type"] == "freeform":
    #             doc_type = "freeform"
    #         else:
    #             doc_type = "table"
    #         for f in the_collection.find():
    #             fname = bytes_to_string(f["name"])
    #
    #             if fname == "__metadata__":
    #                 continue
    #             try:
    #                 if doc_type == "table":
    #                     if "file_id" in f:
    #                         new_collection_dict[fname] = debinarize_python_object(self.fs.get(f["file_id"]).read())
    #                     else:
    #                         new_collection_dict[fname] = f["data_rows"]
    #                     if return_lists:
    #                         new_collection_dict[fname] = self.sort_rows(new_collection_dict[fname])
    #                     if "header_list" in f:
    #                         header_list_dict[fname] = f["header_list"]
    #                     elif "table_spec" in f:
    #                         header_list_dict[fname] = f["table_spec"]["header_list"]
    #                     else:
    #                         header_list_dict[fname] = None
    #                 else:
    #                     if "is_binarized" in f and f["is_binarized"]:
    #                         new_collection_dict[fname] = debinarize_python_object(self.fs.get(f["file_id"]).read())
    #                     elif "encoding" in f:  # legacy
    #                         new_collection_dict[fname] = self.fs.get(f["file_id"]).read().decode(f["encoding"])
    #                     else:
    #                         new_collection_dict[fname] = self.fs.get(f["file_id"]).read()
    #                 if "metadata" in f:
    #                     doc_metadata_dict[fname] = f["metadata"]
    #                 else:
    #                     doc_metadata_dict[fname] = {}
    #             except Exception as ex:
    #                 print(f"Couldn't read document {fname}")
    #                 print(get_traceback_message(ex))
    #
    #     return new_collection_dict, doc_metadata_dict, header_list_dict, collection_metadata