import re
import datetime
from communication_utils import make_python_object_jsonizable, debinarize_python_object

name_keys = {"tile": "tile_module_name", "list": "list_name", "project": "project_name", "code": "code_name"}
res_types = ["list", "collection", "project", "tile", "code"]

PROTECTED_METADATA_KEYS = ["_id", "file_id", "name", "my_class_for_recreate", "table_spec", "data_text", "length",
                           "data_rows", "header_list", "number_of_rows"]


def make_name_unique(new_name, existing_names):
    counter = 1
    revised_name = new_name
    if new_name in existing_names:
        while new_name + str(counter) in existing_names:
            counter += 1
        revised_name = new_name + str(counter)
    return revised_name


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

    def create_initial_metadata(self):
        mdata = {"datetime": datetime.datetime.utcnow(),
                 "updated": datetime.datetime.utcnow(),
                 "tags": "",
                 "notes": ""}
        return mdata

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

    def rename_collection(self, old_name, new_name):
        full_old_name = self.build_data_collection_name(old_name)
        full_new_name = self.build_data_collection_name(new_name)
        self.db[full_old_name].rename(full_new_name)
        return

    def update_number_of_docs(self, collection_name):
        number_of_docs = self.db[collection_name].count() - 1
        self.db[collection_name].update_one({"name": "__metadata__"},
                                            {'$set': {"number_of_docs": number_of_docs}})

    def update_collection_time(self, collection_name):
        full_collection_name = self.build_data_collection_name(collection_name)
        self.db[full_collection_name].update_one({"name": "__metadata__"},
                                                 {'$set': {"updated": datetime.datetime.utcnow()}})

    def create_complete_collection(self, new_name, doc_dict, doc_type, document_metadata=None,
                                   header_list_dict=None, collection_metadata=None):
        print("in create_complete_collection")
        print("collection_mdata is " + str(collection_metadata))
        name_exists = new_name in self.data_collections
        if name_exists:
            raise NameExistsError("Collection name {} already exists".format(new_name))
        full_collection_name = self.build_data_collection_name(new_name)
        mdata = self.create_initial_metadata()
        mdata["name"] = "__metadata__"
        mdata["number_of_docs"] = len(list(doc_dict.keys()))
        print("after setting number of docs mdata is " + str(mdata))
        if collection_metadata is not None:
            for k, v in collection_metadata.items():
                mdata[k] = v
        if document_metadata is None:
            document_metadata = {}
        print("before doc_type == table " + str(mdata))
        if doc_type == "table":
            mdata["type"] = "table"
            print("before insert " + str(mdata))
            self.db[full_collection_name].insert_one(mdata)
            print("after insert " + str(mdata))
            for docname, doc_as_list in doc_dict.items():
                if header_list_dict is not None and docname in header_list_dict:
                    header_list = header_list_dict[docname]
                else:
                    header_list = None
                if document_metadata is not None and docname in document_metadata:
                    doc_mdata = document_metadata[docname]
                else:
                    doc_mdata = None
                self.append_document_to_collection(new_name, docname, doc_as_list, "table", header_list, doc_mdata)
        else:
            mdata["type"] = "freeform"
            self.db[full_collection_name].insert_one(mdata)
            for docname, doc in doc_dict.items():
                if document_metadata is not None and docname in document_metadata:
                    doc_mdata = document_metadata[docname]
                else:
                    doc_mdata = None
                self.append_document_to_collection(new_name, docname, doc, "freeform", None, doc_mdata)
        print("cone with create_complete_collection, about to return")
        if "_id" in mdata:
            del mdata["_id"]  # without this can get an error submitting the result
        print(str(mdata))
        return {"success": True, "message": "Collection created", "metadata": mdata}

    def append_document_to_collection(self, collection_name, given_docname, doc, doc_type,
                                      header_list=None, document_metadata=None):
        name_exists = collection_name in self.data_collections
        if not name_exists:
            raise NonexistentNameError("Base collection name {} doesn't exists".format(collection_name))
        full_collection_name = self.build_data_collection_name(collection_name)
        metadata = {}
        if document_metadata is not None:
            for k, val in document_metadata.items():
                if k not in PROTECTED_METADATA_KEYS:
                    metadata[k] = val

        docname = make_name_unique(given_docname, self.get_collection_docnames(collection_name))

        if doc_type == "table":
            if header_list is None:
                header_list = list(doc[0].keys())
            doc_as_dict = {}
            for r, the_row in enumerate(doc):
                the_row.pop("__id__", None)
                the_row.pop("__filename__", None)
                the_row["__id__"] = r
                the_row["__filename__"] = docname
                doc_as_dict[str(r)] = the_row
            if "__filename__" not in header_list:
                header_list = ["__filename__"] + header_list
            if "__id__" not in header_list:
                header_list = ["__id__"] + header_list

            result_binary = make_python_object_jsonizable(doc_as_dict, output_string=False)
            file_id = self.fs.put(result_binary)
            self.db[full_collection_name].insert_one({"name": docname, "file_id": file_id,
                                                      "header_list": header_list, "metadata": metadata})
        else:
            doc_binary = make_python_object_jsonizable(doc, output_string=False)
            file_id = self.fs.put(doc_binary)
            ddict = {"name": docname, "is_binarized": True, "file_id": file_id, "metadata": metadata}
            self.db[full_collection_name].insert_one(ddict)
        self.update_number_of_docs(collection_name)
        return {"success": True}

    def get_collection_metadata(self, short_collection_name):
        name_exists = short_collection_name in self.data_collections
        if not name_exists:
            return None
        full_collection_name = self.build_data_collection_name(short_collection_name)
        the_collection = self.db[full_collection_name]
        return the_collection.find_one({"name": "__metadata__"})

    def set_collection_metadata(self, short_collection_name, tags, notes):
        name_exists = short_collection_name in self.data_collections
        if not name_exists:
            return None
        full_collection_name = self.build_data_collection_name(short_collection_name)
        mdata = self.get_collection_metadata(short_collection_name)
        if mdata is None:
            self.db[full_collection_name].insert_one({"name": "__metadata__", "tags": tags, "notes": notes})
        else:
            self.db[full_collection_name].update_one({"name": "__metadata__"},
                                                     {'$set': {"tags": tags, "notes": notes}})
        return

    def get_collection_docnames(self, short_collection_name):
        name_exists = short_collection_name in self.data_collections
        if not name_exists:
            return None
        full_collection_name = self.build_data_collection_name(short_collection_name)
        the_collection = self.db[full_collection_name]
        doc_names = []

        for f in the_collection.find():
            # fname = f["name"].encode("ascii", "ignore")
            fname = bytes_to_string(f["name"])
            if fname == "__metadata__":
                continue
            else:
                doc_names.append(fname)

        doc_names.sort()
        return doc_names

    def sort_rows(self, row_dict):
        result = []
        sorted_int_keys = sorted([int(key) for key in row_dict.keys()])
        for r in sorted_int_keys:
            result.append(row_dict[str(r)])
        return result

    def get_all_collection_info(self, short_collection_name, return_lists=True):
        name_exists = short_collection_name in self.data_collections

        if not name_exists:
            return False, None, None, None
        else:
            full_collection_name = self.build_data_collection_name(short_collection_name)
            the_collection = self.db[full_collection_name]
            new_collection_dict = {}
            header_list_dict = {}
            doc_metadata_dict = {}
            collection_metadata = the_collection.find_one({"name": "__metadata__"})
            if "type" in collection_metadata and collection_metadata["type"] == "freeform":
                doc_type = "freeform"
            else:
                doc_type = "table"
            for f in the_collection.find():
                fname = bytes_to_string(f["name"])

                if fname == "__metadata__":
                    continue
                if doc_type == "table":
                    if "file_id" in f:
                        new_collection_dict[fname] = debinarize_python_object(self.fs.get(f["file_id"]).read())
                    else:
                        new_collection_dict[fname] = f["data_rows"]
                    if return_lists:
                        new_collection_dict[fname] = self.sort_rows(new_collection_dict[fname])
                    if "header_list" in f:
                        header_list_dict[fname] = f["header_list"]
                    elif "table_spec" in f:
                        header_list_dict[fname] = f["table_spec"]["header_list"]
                    else:
                        header_list_dict[fname] = None
                else:
                    if "is_binarized" in f and f["is_binarized"]:
                        new_collection_dict[fname] = debinarize_python_object(self.fs.get(f["file_id"]).read())
                    elif "encoding" in f:  # legacy
                        new_collection_dict[fname] = self.fs.get(f["file_id"]).read().decode(f["encoding"])
                    else:
                        new_collection_dict[fname] = self.fs.get(f["file_id"]).read()
                if "metadata" in f:
                    doc_metadata_dict[fname] = f["metadata"]
                else:
                    doc_metadata_dict[fname] = {}

        return new_collection_dict, doc_metadata_dict, header_list_dict, collection_metadata

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

    def short_collection_name(self, full_collection_name):
        return re.sub(r"^.*?\.data_collection\.", "", full_collection_name)

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
