import re
import datetime
import copy
from bson.objectid import ObjectId

class ListAccess(object):

    list_name_field = "list_name"
    list_content_field = "the_list"
    list_additional_mdata_fields = None

    @property
    def list_collection_name(self):
        return '{}.lists'.format(self.username)

    def get_list_doc(self, list_name):
        doc = self.db[self.list_collection_name].find_one(
            {"list_name": list_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_list_doc_from_id(self, list_id):
        doc = self.db[self.list_collection_name].find_one(
            {"_id": ObjectId(list_id)}, {"_id": 0}
        )
        return doc if doc else None

    def remove_list(self, list_name):
        if not self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} does not exist.")
        self.db[self.list_collection_name].delete_one({"list_name": list_name})
        return

    def get_list_content(self, list_name):
        doc = self.db[self.list_collection_name].find_one(
            {"list_name": list_name}, {"the_list": 1, "_id": 0}
        )
        return doc.get("the_list", None) if doc else None

    def get_list_metadata(self, list_name):
        doc = self.db[self.list_collection_name].find_one(
            {"list_name": list_name}, {"metadata": 1, "_id": 0}
        )
        return doc.get("metadata", None) if doc else None

    def get_processed_list_metadata(self, list_name, search_inside=False, search_string=None):
        mdata = self.get_list_metadata(list_name)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_list_content(list_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": list_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def list_name_exists(self, list_name):
        return self.db[self.list_collection_name].find_one(
            {"list_name": list_name}, {"_id": 1}
        ) is not None

    def get_list_content_with_metadata(self, list_name, process_metadata=False):
        doc = self.db[self.list_collection_name].find_one(
            {"list_name": list_name}, {"_id": 0, "the_list": 1, "metadata": 1, "list_name": 1}
        )
        if doc is None:
            return None
        the_list = doc.get("the_list", None)
        metadata = doc.get("metadata", None)
        if process_metadata and metadata is not None:
            metadata = self.process_metadata(metadata)
        return {
            "the_list": the_list,
            "metadata": metadata,
            "list_name": list_name
        }

    @property
    def list_names(self):
        names = [
            doc["list_name"]
            for doc in self.db[self.list_collection_name].find(
                {}, {"list_name": 1, "_id": 0}
            )
        ]
        return names

    @property
    def list_names_with_metadata(self):
        my_list_names = []
        for doc in self.db[self.list_collection_name].find({}, {"_id": 0, "metadata": 1, "list_name": 1}):
            if "metadata" in doc:
                my_list_names.append([doc["list_name"], doc["metadata"]])
            else:
                my_list_names.append([doc["list_name"], None])
        return sorted(my_list_names, key=self.sort_data_list_key)

    @property
    def list_tags_dict(self):
        tags = {}
        for doc in self.db[self.list_collection_name].find({}, {"_id": 0, "metadata": 1, "list_name": 1}):
            if "metadata" in doc:
                tags[doc["list_name"]] = doc["metadata"]["tags"]
            else:
                tags[doc["list_name"]] = ""
        return tags

    def get_all_list_tags(self, show_hidden=True):
        res_list = self.list_names_with_metadata
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_lists(self, search_text, search_spec, columns, is_repo=False):
        flist, all_tags =  self.grab_filtered_resources("list", self.list_collection_name, "list_name",
                                                        "the_list", self.list_additional_mdata_fields, search_text, search_spec,
                                                        columns, is_repo=is_repo)
        for val in flist:
            val["icon:th"] = "icon:list"
            val["icon:upload"] = ""
            val["size"] = ""
        return flist, all_tags


    def create_list(self, list_name, template_name=None):
        if self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} already exists.")
        if template_name is not None:
            template_data = self.get_list_content_with_metadata(template_name)
            if template_data is None:
                raise ValueError(f"Template list {template_name} does not exist.")
            metadata = copy.copy(template_data["metadata"])
            metadata = self.update_metadata(metadata, True)
            the_list = template_data["the_list"]
        else:
            metadata = self.create_initial_metadata()
            the_list = []
        self.db[self.list_collection_name].insert_one({
            "list_name": list_name,
            "the_list": the_list,
            "metadata": metadata})
        return

    def create_list_from_data(self, list_name, the_list, metadata=None):
        if self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} already exists.")
        if metadata is None:
            metadata = self.create_initial_metadata()
        else:
            metadata = self.update_metadata(metadata, True)
        self.db[self.list_collection_name].insert_one({
            "list_name": list_name,
            "the_list": the_list,
            "metadata": metadata})
        return

    def create_list_from_doc(self, list_name, the_doc):
        if self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} already exists.")
        metadata = self.update_metadata(the_doc["metadata"], True)

        self.db[self.list_collection_name].insert_one({
            "list_name": list_name,
            "the_list": the_doc["the_list"],
            "metadata": metadata})
        return


    def update_list(self, list_name, new_list):
        if not self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} does not exist.")
        metadata = self.get_list_metadata(list_name)
        if metadata is None:
            metadata = {}
        metadata = self.update_metadata(metadata)
        self.db[self.list_collection_name].update_one(
            {"list_name": list_name},
            {"$set": {"the_list": new_list, "metadata": metadata}}
        )
        return

    def rename_list(self, old_name, new_name):
        if not self.list_name_exists(old_name):
            raise ValueError(f"List with name {old_name} does not exist.")
        if self.list_name_exists(new_name):
            raise ValueError(f"List with name {new_name} already exists.")
        self.db[self.list_collection_name].update_one(
            {"list_name": old_name},
            {"$set": {"list_name": new_name}}
        )
        return

    def save_list_metadata(self, list_name, metadata):
        if not self.list_name_exists(list_name):
            raise ValueError(f"List with name {list_name} does not exist.")
        mdata = self.get_list_metadata(list_name)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        self.db[self.list_collection_name].update_one(
            {"list_name": list_name},
            {"$set": {"metadata": mdata}}
        )
        return

    def rename_tags_in_lists(self, tag_changes):
        if not tag_changes:
            return
        for doc in self.db[self.list_collection_name].find({}, {"_id": 0, "metadata": 1, "list_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.list_collection_name].update_one(
                            {"list_name": doc["list_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_lists(self, tag):
        if not tag:
            return
        for doc in self.db[self.list_collection_name].find({}, {"_id": 0, "metadata": 1, "list_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.list_collection_name].update_one(
                        {"list_name": doc["list_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return