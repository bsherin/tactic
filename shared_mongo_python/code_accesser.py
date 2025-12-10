import re
import datetime
import copy
from bson import ObjectId

class CodeAccess(object):

    code_name_field = "code_name"
    code_content_field = "the_code"
    code_additional_mdata_fields =  ["functions", "classes"]

    def code_collection_name(self, username=None):
        if username is None:
            username = self.username
        return '{}.code'.format(username)

    def get_code_doc(self, code_name):
        doc = self.db[self.code_collection_name()].find_one(
            {"code_name": code_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_code_doc_from_id(self, code_id):
        doc = self.db[self.code_collection_name()].find_one(
            {"_id": ObjectId(code_id)}, {"_id": 0}
        )
        return doc if doc else None

    def remove_code(self, code_name):
        if not self.code_name_exists(code_name):
            raise ValueError(f"Code with name {code_name} does not exist.")
        self.db[self.code_collection_name()].delete_one({"code_name": code_name})
        return

    def get_code_content(self, code_name):
        doc = self.db[self.code_collection_name()].find_one(
            {"code_name": code_name}, {"the_code": 1, "_id": 0}
        )
        return doc.get("the_code", None) if doc else None

    def get_code_metadata(self, code_name):
        doc = self.db[self.code_collection_name()].find_one(
            {"code_name": code_name}, {"metadata": 1, "_id": 0}
        )
        return doc.get("metadata", None) if doc else None

    def get_processed_code_metadata(self, code_name, search_inside=False, search_string=None):
        mdata = self.get_code_metadata(code_name)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_code_content(code_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": code_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def code_name_exists(self, code_name):
        return self.db[self.code_collection_name()].find_one(
            {"code_name": code_name}, {"_id": 1}
        ) is not None

    def get_code_content_with_metadata(self, code_name, process_metadata=False, username=None):
        doc = self.db[self.code_collection_name(username)].find_one(
            {"code_name": code_name}, {"_id": 0, "the_code": 1, "metadata": 1, "code_name": 1}
        )
        if doc is None:
            return None
        the_code = doc.get("the_code", None)
        metadata = doc.get("metadata", None)
        if process_metadata and metadata is not None:
            metadata = self.process_metadata(metadata)
        return {
            "the_code": the_code,
            "metadata": metadata,
            "code_name": code_name
        }

    def code_names(self):
        names = [
            doc["code_name"]
            for doc in self.db[self.code_collection_name()].find(
                {}, {"code_name": 1, "_id": 0}
            )
        ]
        return names

    def code_names_with_metadata(self):
        my_code_names = []
        for doc in self.db[self.code_collection_name()].find({}, {"_id": 0, "metadata": 1, "code_name": 1}):
            if "metadata" in doc:
                my_code_names.append([doc["code_name"], doc["metadata"]])
            else:
                my_code_names.append([doc["code_name"], None])
        return sorted(my_code_names, key=self.sort_data_list_key)

    @property
    def code_tags_dict(self):
        tags = {}
        for doc in self.db[self.code_collection_name()].find({}, {"_id": 0, "metadata": 1, "code_name": 1}):
            if "metadata" in doc:
                tags[doc["code_name"]] = doc["metadata"].get("tags", [])
            else:
                tags[doc["code_name"]] = ""
        return tags

    def class_tags_dict(self, username):
        classes = {}
        for doc in self.db['{}.code'.format(username)].find():
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            if "classes" not in mdata:
                continue
            tags = mdata.get("tags", "")
            for c in mdata["classes"]:
                classes[c] = tags
        return classes

    def get_filtered_class_names(self, tag_filter=None, search_filter=None, username=None):
        if username is None:
            username = self.username
        class_names = []
        for doc in self.db[self.code_collection_name(username)].find():
            if tag_filter is not None:
                if "metadata" in doc:
                    if "tags" in doc["metadata"]:
                        if tag_filter in doc["metadata"]["tags"].lower():
                            class_names += doc["metadata"]["classes"]
            elif search_filter is not None:
                for fname in doc["metadata"]["classes"]:
                    if search_filter in fname.lower():
                        class_names += doc[fnames]
            else:
                class_names += doc["metadata"]["classes"]
        return class_names

    def get_class_with_metadata(self, class_name, username=None):
        if username is None:
            username = self.username
        found = False
        doc = None
        for doc in self.db[self.code_collection_name(username)].find():
            if class_name in doc["metadata"]["classes"]:
                found = True
                break
        if not found:
            class_dict = None
        else:
            class_dict = {"the_code": doc["the_code"],
                          "code_name": doc["code_name"],
                          "metadata": doc["metadata"]}
        return class_dict

    def function_tags_dict(self, username):
        functions = {}
        for doc in self.db['{}.code'.format(username)].find():
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            if "functions" not in mdata:
                continue
            tags = mdata.get("tags", "")
            for f in mdata["functions"]:
                functions[f] = tags
        return functions

    def get_filtered_function_names(self, tag_filter=None, search_filter=None, username=None):
        if username is None:
            username = self.username
        function_names = []
        for doc in self.db[self.code_collection_name(username)].find():
            if tag_filter is not None:
                if "metadata" in doc:
                    if "tags" in doc["metadata"]:
                        if tag_filter in doc["metadata"]["tags"].lower():
                            function_names += doc["metadata"]["functions"]
            elif search_filter is not None:
                for fname in doc["metadata"]["functions"]:
                    if search_filter in fname.lower():
                        function_names += doc[fnames]
            else:
                function_names += doc["metadata"]["functions"]
        return function_names

    def get_function_with_metadata(self, function_name, username=None):
        if username is None:
            username = self.username
        found = False
        doc = None
        for doc in self.db[self.code_collection_name(username)].find():
            if function_name in doc["metadata"]["functions"]:
                found = True
                break
        if not found:
            function_dict = None
        else:
            function_dict = {"the_code": doc["the_code"],
                             "code_name": doc["code_name"],
                             "metadata": doc["metadata"]}
        return function_dict

    def get_all_code_tags(self, show_hidden=True):
        res_list = self.code_names_with_metadata()
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_codes(self, search_text, search_spec, columns, is_repo=False):
        flist, all_tags =  self.grab_filtered_resources("code", self.code_collection_name(), "code_name",
                                                        "the_code", self.code_additional_mdata_fields, search_text, search_spec,
                                                        columns, is_repo=is_repo)
        for val in flist:
            val["icon:th"] = "icon:code"
            val["icon:upload"] = ""
            val["size"] = ""
        return flist, all_tags

    def create_code(self, code_name, template_name=None):
        if self.code_name_exists(code_name):
            raise ValueError(f"code with name {code_name} already exists.")
        if template_name is not None:
            template_data = self.get_code_content_with_metadata(template_name)
            if template_data is None:
                raise ValueError(f"Template code {template_name} does not exist.")
            metadata = copy.copy(template_data["metadata"])
            metadata = self.update_metadata(metadata, True)
            metadata["functions"] = []
            metadata["classes"] = []
            the_code = template_data["the_code"]
        else:
            metadata = self.create_initial_metadata()
            the_code = []
        self.db[self.code_collection_name()].insert_one({
            "code_name": code_name,
            "the_code": the_code,
            "metadata": metadata})
        return

    def create_code_from_doc(self, code_name, doc):
        if self.code_name_exists(code_name):
            raise ValueError(f"code with name {code_name} already exists.")
        metadata = doc.get("metadata", None)
        if metadata is None:
            metadata = self.create_initial_metadata()
        else:
            metadata = self.update_metadata(metadata, True)
        the_code = doc.get("the_code", "")
        self.db[self.code_collection_name()].insert_one({
            "code_name": code_name,
            "the_code": the_code,
            "metadata": metadata}
        )
        return

    def get_code_with_function(self, function_name):
        for doc in self.db[self.code_collection_name()].find():
            if function_name in doc["metadata"]["functions"]:
                return doc["the_code"]
        return None

    def get_code_with_class(self, class_name):
        for doc in self.db[self.code_collection_name()].find():
            if class_name in doc["metadata"]["classes"]:
                return doc["the_code"]
        return None

    def create_code_from_data(self, code_name, the_code, metadata=None):
        if self.code_name_exists(code_name):
            raise ValueError(f"code with name {code_name} already exists.")
        if metadata is None:
            metadata = self.create_initial_metadata()
        else:
            metadata = self.update_metadata(metadata, True)
        self.db[self.code_collection_name()].insert_one({
            "code_name": code_name,
            "the_code": the_code,
            "metadata": metadata})
        return


    def update_code(self, code_name, new_code, classes=None, functions=None):
        if not self.code_name_exists(code_name):
            raise ValueError(f"code with name {code_name} does not exist.")
        metadata = self.get_code_metadata(code_name)
        if metadata is None:
            metadata = {}
        metadata["classes"] = classes
        metadata["functions"] = functions
        metadata = self.update_metadata(metadata)
        self.db[self.code_collection_name()].update_one(
            {"code_name": code_name},
            {"$set": {"the_code": new_code, "metadata": metadata}}
        )
        return

    def rename_code(self, old_name, new_name):
        if not self.code_name_exists(old_name):
            raise ValueError(f"code with name {old_name} does not exist.")
        if self.code_name_exists(new_name):
            raise ValueError(f"code with name {new_name} already exists.")
        self.db[self.code_collection_name()].update_one(
            {"code_name": old_name},
            {"$set": {"code_name": new_name}}
        )
        return

    def save_code_metadata(self, code_name, metadata):
        if not self.code_name_exists(code_name):
            raise ValueError(f"code with name {code_name} does not exist.")
        mdata = self.get_code_metadata(code_name)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        self.db[self.code_collection_name()].update_one(
            {"code_name": code_name},
            {"$set": {"metadata": mdata}}
        )
        return

    def rename_tags_in_codes(self, tag_changes):
        if not tag_changes:
            return
        for doc in self.db[self.code_collection_name()].find({}, {"_id": 0, "metadata": 1, "code_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.code_collection_name()].update_one(
                            {"code_name": doc["code_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_codes(self, tag):
        if not tag:
            return
        for doc in self.db[self.code_collection_name()].find({}, {"_id": 0, "metadata": 1, "code_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.code_collection_name()].update_one(
                        {"code_name": doc["code_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return