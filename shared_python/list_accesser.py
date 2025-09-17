import re

class ListAccess(object):

    @property
    def list_collection_name(self):
        return '{}.lists'.format(self.username)

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

    def get_processed_metadata(self, list_name, search_inside=False, search_string=None):
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
            result.update({"success": True, "res_name": res_name})
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
        lists = {}
        for doc in self.db[self.list_collection_name].find({}, {"_id": 0, "metadata": 1, "list_name": 1}):
            if "metadata" in doc:
                lists[doc["list_name"]] = doc["metadata"]["tags"]
            else:
                lists[doc["list_name"]] = ""
        return lists

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
        return self.grab_filtered_resources("list", self.list_collection_name, "list_name",
                                            "the_list", None, search_text, search_spec,
                                            columns, is_repo=is_repo)