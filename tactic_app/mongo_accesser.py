
import re

name_keys = {"tile": "tile_module_name", "list": "list_name", "project": "project_name", "code": "code_name"}
res_types = ["list", "collection", "project", "tile", "code"]


class MongoAccess(object):

    @property
    def project_collection_name(self):
        return '{}.projects'.format(self.username)

    @property
    def list_collection_name(self):
        return '{}.lists'.format(self.username)

    @property
    def tile_collection_name(self):
        return '{}.tiles'.format(self.username)

    @property
    def code_collection_name(self):
        return '{}.code'.format(self.username)

    @property
    def data_collections(self):
        cnames = self.db.collection_names()
        string_start = self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                my_collection_names.append(m.group(1))
        return sorted([str(t) for t in my_collection_names], key=str.lower)

    @property
    def data_collection_names_with_metadata(self):
        cnames = self.db.collection_names()
        string_start = self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                mdata = self.db[cname].find_one({"name": "__metadata__"})
                my_collection_names.append([m.group(1), mdata])

        return sorted(my_collection_names, key=self.sort_data_list_key)

    @property
    def data_collection_tags_dict(self):
        cnames = self.db.collection_names()
        string_start = self.username + ".data_collection."
        data_collection_names = {}
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                mdata = self.db[cname].find_one({"name": "__metadata__"})
                if mdata is None:
                    data_collection_names[m.group(1)] = ""
                else:
                    data_collection_names[m.group(1)] = mdata["tags"]

        return data_collection_names

    def delete_all_data_collections(self):
        for dcol in self.data_collections:
            self.remove_collection(dcol)
        return

    def full_collection_name(self, cname):
        return self.username + ".data_collection." + cname

    def build_data_collection_name(self, collection_name):
        return '{}.data_collection.{}'.format(self.username, collection_name)

    def remove_collection(self, collection_name):
        fcname = self.full_collection_name(collection_name)
        for doc in self.db[fcname].find():
            if "file_id" in doc:
                self.fs.delete(doc["file_id"])
        self.db.drop_collection(fcname)
        return True

    def delete_all_projects(self):
        for proj in self.project_names:
            self.remove_project(proj)
        return

    def remove_project(self, project_name):
        save_dict = self.db[self.project_collection_name].find_one({"project_name": project_name})
        if "file_id" in save_dict:
            self.fs.delete(save_dict["file_id"])
        self.db[self.project_collection_name].delete_one({"project_name": project_name})
        return

    @property
    def project_names(self):
        if self.project_collection_name not in self.db.collection_names():
            self.db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in self.db[self.project_collection_name].find(projection=["project_name"]):
            my_project_names.append(doc["project_name"])
        return sorted([str(t) for t in my_project_names], key=str.lower)

    @property
    def list_names(self):
        if self.list_collection_name not in self.db.collection_names():
            self.db.create_collection(self.list_collection_name)
            return []
        my_list_names = []
        for doc in self.db[self.list_collection_name].find(projection=["list_name"]):
            my_list_names.append(doc["list_name"])
        return sorted([str(t) for t in my_list_names], key=str.lower)

    def sort_data_list_key(self, item):
        return str.lower(str(item[0]))

    @property
    def list_names_with_metadata(self):
        if self.list_collection_name not in self.db.collection_names():
            self.db.create_collection(self.list_collection_name)
            return []
        my_list_names = []
        for doc in self.db[self.list_collection_name].find(projection=["list_name", "metadata"]):
            if "metadata" in doc:
                my_list_names.append([doc["list_name"], doc["metadata"]])
            else:
                my_list_names.append([doc["list_name"], None])
        return sorted(my_list_names, key=self.sort_data_list_key)

    @property
    def list_tags_dict(self):
        if self.list_collection_name not in self.db.collection_names():
            self.db.create_collection(self.list_collection_name)
            return {}
        lists = {}
        for doc in self.db[self.list_collection_name].find(projection=["list_name", "metadata"]):
            if "metadata" in doc:
                lists[doc["list_name"]] = doc["metadata"]["tags"]
            else:
                lists[doc["list_name"]] = ""
        return lists

    @property
    def project_names_with_metadata(self):
        if self.project_collection_name not in self.db.collection_names():
            self.db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in self.db[self.project_collection_name].find(projection=["project_name", "metadata"]):
            if "metadata" in doc:
                my_project_names.append([doc["project_name"], doc["metadata"]])
            else:
                my_project_names.append([doc["project_name"], None])
        return sorted(my_project_names, key=self.sort_data_list_key)

    @property
    def tile_module_names_with_metadata(self):
        if self.tile_collection_name not in self.db.collection_names():
            self.db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in self.db[self.tile_collection_name].find(projection=["tile_module_name", "metadata"]):
            if "metadata" in doc:
                my_tile_names.append([doc["tile_module_name"], doc["metadata"]])
            else:
                my_tile_names.append([doc["tile_module_name"], None])
        return sorted(my_tile_names, key=self.sort_data_list_key)

    @property
    def tile_module_names(self, ):
        if self.tile_collection_name not in self.db.collection_names():
            self.db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in self.db[self.tile_collection_name].find(projection=["tile_module_name"]):
            my_tile_names.append(doc["tile_module_name"])
        return sorted([str(t) for t in my_tile_names], key=str.lower)

    @property
    def code_names(self, ):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
            return []
        my_code_names = []
        for doc in self.db[self.code_collection_name].find(projection=["code_name"]):
            my_code_names.append(doc["code_name"])
        return sorted([str(t) for t in my_code_names], key=str.lower)

    @property
    def code_names_with_metadata(self):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
            return []
        my_code_names = []
        for doc in self.db[self.code_collection_name].find(projection=["code_name", "metadata"]):
            if "metadata" in doc:
                my_code_names.append([doc["code_name"], doc["metadata"]])
            else:
                my_code_names.append([doc["code_name"], None])
        return sorted(my_code_names, key=self.sort_data_list_key)

    @property
    def class_tags_dict(self):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
            return {}
        classes = {}
        for doc in self.db[self.code_collection_name].find():
            tags = doc["metadata"]["tags"]
            for c in doc["metadata"]["classes"]:
                classes[c] = tags
        return classes

    @property
    def all_names(self):
        names = self.collection_names + self.project_names + self.tile_module_names + self.list_names + self.code_names
        return sorted(names, key=str.lower)

    @property
    def all_names_with_metadata(self):
        col_names_with_metadata = [d + ["collection"] for d in self.data_collection_names_with_metadata]
        proj_names_with_metadata = [d + ["project"] for d in self.project_names_with_metadata]
        list_names_with_metadata = [d + ["list"] for d in self.list_names_with_metadata]
        tile_names_with_metadata = [d + ["tile"] for d in self.tile_module_names_with_metadata]
        code_names_with_metadata = [d + ["code"] for d in self.code_names_with_metadata]
        names_with_metadata = col_names_with_metadata + proj_names_with_metadata + list_names_with_metadata + \
                              tile_names_with_metadata + code_names_with_metadata
        return sorted(names_with_metadata, key=self.sort_data_list_key)

    @property
    def function_tags_dict(self):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
            return {}
        functions = {}
        for doc in self.db[self.code_collection_name].find():
            tags = doc["metadata"]["tags"]
            for f in doc["metadata"]["functions"]:
                functions[f] = tags
        return functions

    def resource_collection_name(self, res_type):
        cnames = {"tile": self.tile_collection_name, "list": self.list_collection_name,
                  "project": self.project_collection_name, "code": self.code_collection_name}
        return cnames[res_type]

    def get_resource_names(self, res_type, tag_filter=None, search_filter=None):
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        if res_type == "collection":
            dcollections = self.data_collections
            res_names = []
            for dcol in dcollections:
                cname = self.build_data_collection_name(dcol)
                mdata = self.db[cname].find_one({"name": "__metadata__"})
                if tag_filter is not None:
                    if mdata is not None and "tags" in mdata:
                        if tag_filter in mdata["tags"].lower():
                            res_names.append(dcol)
                elif search_filter is not None:
                    if search_filter in dcol.lower():
                        res_names.append(dcol)
                else:
                    res_names.append(dcol)
        else:
            cname = self.resource_collection_name(res_type)
            name_key = name_keys[res_type]
            if cname not in self.db.collection_names():
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

    def get_list(self, list_name):
        list_dict = self.db[self.list_collection_name].find_one({"list_name": list_name})
        return list_dict["the_list"]

    def get_tile_dict(self, tile_module_name):
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict

    def get_tile_module(self, tile_module_name):
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        if tile_dict is None:
            raise ModuleNotFoundError
        return tile_dict["tile_module"]

    def get_tile_module_dict(self, tile_module_name):
        tile_dict = self.db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict

    def get_code(self, code_name):
        code_dict = self.db[self.code_collection_name].find_one({"code_name": code_name})
        return code_dict["the_code"]

    def get_code_with_class(self, class_name):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
        for doc in self.db[self.code_collection_name].find():
            if class_name in doc["metadata"]["classes"]:
                return doc["the_code"]
        return None

    def get_code_with_function(self, function_name):
        if self.code_collection_name not in self.db.collection_names():
            self.db.create_collection(self.code_collection_name)
        for doc in self.db[self.code_collection_name].find():
            if function_name in doc["metadata"]["functions"]:
                return doc["the_code"]
        return None
