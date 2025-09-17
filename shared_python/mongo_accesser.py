import re
import datetime
import zlib
from bson import ObjectId
from communication_utils import debinarize_python_object, make_jsonizable_and_compress
from communication_utils import store_temp_data, read_temp_data

import traceback

name_keys = {"tile": "tile_module_name", "list": "list_name", "collection": "collection_name",
             "project": "project_name", "code": "code_name", "metabook": "metabook_name"}
res_types = ["list", "collection", "project", "tile", "code", "metabook"]

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

    def grab_filtered_resources(self, res_type, col_name, name_field, content_field, additional_mdata_fields,
                                search_text, search_spec, columns, is_repo=False):
        all_tags = []
        sort_field = search_spec["sort_field"]
        db_to_use = self.repository_db if is_repo else self.db
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)
        or_list = [{name_field: reg}]
        and_list = []
        if search_spec["search_metadata"]:
            or_list += [{"metadata.notes": reg}, {"metadata.tags": reg}, {"metadata.type": reg}]
            if additional_mdata_fields:
                for fld in additional_mdata_fields:
                    or_list.append({"metadata." + fld: reg})
        if search_spec["search_inside"]:
            or_list += [{"the_list": reg}]
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
        res = db_to_use[col_name].find({"$and": and_list},
                                       {name_field: 1, "metadata": 1, "file_id": 1})
        filtered_res = []
        for doc in res:
            try:
                if "metadata" in doc and doc["metadata"] is not None:
                    mdata = doc["metadata"]
                    doc_id = str(doc["_id"])
                    all_tags += mdata["tags"].split()
                    if "file_id" in doc and "size" in columns:
                        rdict = self.build_res_dict(doc[name_field], mdata, None,
                                                    doc["file_id"], res_type=res_type,
                                                    doc_id=doc_id, sort_field=sort_field)
                    else:
                        rdict = self.build_res_dict(doc[name_field], mdata, res_type=res_type,
                                                    doc_id=doc_id, sort_field=sort_field)
                    if mdata and "tags" in mdata:
                        rdict["hidden"] = self.has_hidden(mdata["tags"])
                    else:
                        rdict["hidden"] = False
                    filtered_res.append(rdict)
            except Exception as ex:
                msg = self.get_traceback_message(ex, f"Got problem with doc {str(doc[name_field])}")
                print(msg)
        return filtered_res, all_tags


    @staticmethod
    def extract_search_context(text: str, search: str, margin: int = 75) -> str:
        index = text.find(search)
        if index == -1:
            return None  # search string not found
        start = max(0, index - margin)
        end = min(len(text), index + len(search) + margin)
        return text[start:end]

    def create_initial_metadata(self):
        mdata = {"datetime": datetime.datetime.utcnow(),
                 "updated": datetime.datetime.utcnow(),
                 "tags": "",
                 "notes": ""}
        return mdata

    @property
    def metabook_collection_name(self):
        return '{}.metabooks'.format(self.username)

    @property
    def node_collection_name(self):
        return '{}.nodes'.format(self.username)

    @property
    def project_collection_name(self):
        return '{}.projects'.format(self.username)

    @property
    def collection_collection_name(self):
        return '{}.data_collections'.format(self.username)

    @property
    def tile_collection_name(self):
        return '{}.tiles'.format(self.username)

    @property
    def code_collection_name(self):
        return '{}.code'.format(self.username)

    @property
    def data_collection_names(self):
        if self.collection_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.collection_collection_name)
            return []
        my_collection_names = []
        for doc in self.db[self.collection_collection_name].find(projection=["collection_name"]):
            my_collection_names.append(doc["collection_name"])
        return sorted([str(t) for t in my_collection_names], key=str.lower)

    @property
    def data_collection_names_with_metadata(self):
        if self.collection_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.collection_collection_name)
            return []
        my_collection_names = []
        for doc in self.db[self.collection_collection_name].find(projection=["collection_name", "metadata"]):
            my_collection_names.append([doc["collection_name"], doc["metadata"]])
        return sorted(my_collection_names, key=self.sort_data_list_key)

    def update_number_of_docs(self, collection_name):
        number_of_docs = self.db[collection_name].count_documents({}) - 1
        self.db[collection_name].update_one({"name": "__metadata__"},
                                            {'$set': {"number_of_docs": number_of_docs}})

    def update_collection_time(self, collection_name):
        mdata = self.get_collection_metadata(collection_name)
        mdata["updated"] = datetime.datetime.utcnow()
        self.db[self.collection_collection_name].update_one({"collection_name": collection_name},
                                                            {'$set': {"metadata": mdata}})

    def create_empty_collection(self, new_name, doc_type, collection_metadata=None):
        return self.create_complete_collection(new_name, {}, doc_type, None, None, collection_metadata)

    def create_complete_collection(self, new_name, doc_dict, doc_type, document_metadata=None,
                                   header_list_dict=None, collection_metadata=None, temp_data=None):

        if temp_data is None and new_name in self.data_collection_names:
            raise NameExistsError("Collection name {} already exists".format(new_name))
        mdata = self.create_initial_metadata()
        mdata["number_of_docs"] = len(list(doc_dict.keys()))
        mdata["type"] = doc_type
        if collection_metadata is not None:
            for k, v in collection_metadata.items():
                mdata[k] = v
        if document_metadata is None:
            document_metadata = {}
        for fname in doc_dict.keys():
            if fname not in document_metadata:
                document_metadata[fname] = {}
        if doc_type == "table":
            if header_list_dict is None:
                header_list_dict = {}
            for fname, dlist in doc_dict.items():
                if doc_type == "table":
                    if header_list_dict is None or fname not in header_list_dict:
                        header_list_dict[fname] = list(dlist[0].keys())
            collection_dict = {"doc_dict": doc_dict,
                               "doc_mdata_dict": document_metadata,
                               "header_list_dic": header_list_dict}
        else:
            collection_dict = {"doc_dict": doc_dict,
                               "doc_mdata_dict": document_metadata}
        new_save_dict = {"metadata": mdata,
                         "collection_name": new_name}
        cdict = make_jsonizable_and_compress(collection_dict)
        new_save_dict["file_id"] = self.fs.put(cdict)
        if temp_data is not None:
            new_save_dict.update(temp_data)
            unique_id = store_temp_data(self.db, new_save_dict)
            return {"success": True, "message": "Collection created", "temp_id": unique_id}
        else:
            self.db[self.collection_collection_name].insert_one(new_save_dict)

        if "_id" in mdata:
            del mdata["_id"]  # without this can get an error submitting the result
        return {"success": True, "message": "Collection created"}

    def append_documents_to_collection(self, collection_name, doc_dict, doc_type,
                                       header_list_dict=None, doc_mddict=None):
        name_exists = collection_name in self.data_collection_names
        if not name_exists:
            raise NonexistentNameError("Base collection name {} doesn't exists".format(collection_name))
        old_doc_dict, old_doc_mddict, old_hl_dict, old_mdata = self.get_all_collection_info(collection_name)

        ndoc_mddict = {}
        if doc_mddict is not None:
            for fname, doc_mdata in doc_mddict.items():
                new_mdata = {}
                for k, val in doc_mdata.items():
                    if k not in PROTECTED_METADATA_KEYS:
                        new_mdata[k] = val
                ndoc_mddict[fname] = new_mdata
        for fname, dlist in doc_dict.items():
            ufname = make_name_unique(fname, list(old_doc_dict.keys()))
            if doc_type == "table":
                if header_list_dict is None or fname not in header_list_dict:
                    header_list = list(dlist[0].keys())
                else:
                    header_list = header_list_dict[fname]
                ndlist = []
                for r, the_row in enumerate(dlist):
                    the_row.pop("__id__", None)
                    the_row.pop("__filename__", None)
                    the_row["__id__"] = r
                    the_row["__filename__"] = ufname
                    ndlist.append(the_row)
                if "__filename__" not in header_list:
                    header_list = ["__filename__"] + header_list
                if "__id__" not in header_list:
                    header_list = ["__id__"] + header_list
                old_hl_dict[ufname] = header_list
                old_doc_dict[ufname] = dlist
            else:
                old_doc_dict[ufname] = dlist
            if fname in ndoc_mddict:
                old_doc_mddict[ufname] = ndoc_mddict[fname]
            else:
                old_doc_mddict[ufname] = {}
        old_mdata["number_of_docs"] = len(old_doc_dict.keys())
        new_save_dict = {"metadata": old_mdata,
                         "collection_name": collection_name}
        collection_dict = {"doc_dict": old_doc_dict,
                           "doc_mdata_dict": old_doc_mddict,
                           "header_list_dic": old_hl_dict}
        cdict = make_jsonizable_and_compress(collection_dict)
        new_save_dict["file_id"] = self.fs.put(cdict)
        old_save_dict = self.db[self.collection_collection_name].find_one({"collection_name": collection_name})
        self.fs.delete(old_save_dict["file_id"])
        self.db[self.collection_collection_name].update_one({"collection_name": collection_name},
                                                            {'$set': new_save_dict})
        return {"success": True}

    def get_collection_metadata(self, short_collection_name):
        name_exists = short_collection_name in self.data_collection_names
        if not name_exists:
            return None
        mdata = self.db[self.collection_collection_name].find_one({"collection_name": short_collection_name},
                                                                  projection=["metadata"])["metadata"]
        return mdata

    def set_collection_metadata(self, short_collection_name, tags, notes, uid=""):
        name_exists = short_collection_name in self.data_collection_names
        if not name_exists:
            return None
        mdata = self.get_collection_metadata(short_collection_name)

        if mdata is None:
            mdata = self.create_initial_metadata()
        mdata["tags"] = tags
        mdata["notes"] = notes
        mdata["mdata_uid"] = uid
        self.db[self.collection_collection_name].update_one({"collection_name": short_collection_name},
                                                             {'$set': {"metadata": mdata}})
        return

    def sort_rows(self, row_dict):
        result = []
        sorted_int_keys = sorted([int(key) for key in row_dict.keys()])
        for r in sorted_int_keys:
            result.append(row_dict[str(r)])
        return result

    def get_all_collection_info(self, short_collection_name, return_lists=True, temp_id=None):
        if temp_id is None and short_collection_name not in self.data_collection_names:
            raise NonexistentNameError("")
        else:
            if temp_id is None:
                save_dict = self.db[self.collection_collection_name].find_one({"collection_name": short_collection_name})
            else:
                save_dict = read_temp_data(self.db, temp_id)
            collection_metadata = save_dict["metadata"]
            if "type" in collection_metadata and collection_metadata["type"] == "freeform":
                doc_type = "freeform"
            else:
                doc_type = "table"
            file_id = save_dict["file_id"]
            binarized_python_object = zlib.decompress(self.fs.get(file_id).read())
            cdict = debinarize_python_object(binarized_python_object)
            if return_lists or doc_type == "freeform":
                new_doc_dict = cdict["doc_dict"]
            else:
                new_doc_dict = {}
                for fname, dlist in cdict["doc_dict"].items():
                    ndoc = {}
                    for r in dlist:
                        ndoc[str(r["__id__"])] = r
                    new_doc_dict[fname] = ndoc
            hld = cdict["header_list_dic"] if "header_list_dic" in cdict else {}
            return new_doc_dict, cdict["doc_mdata_dict"], hld, collection_metadata

    @property
    def data_collection_tags_dict(self):
        if self.collection_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.collection_collection_name)
            return {}
        data_collections = {}
        for doc in self.db[self.collection_collection_name].find(projection=["collection_name", "metadata"]):
            if "metadata" in doc:
                data_collections[doc["collection_name"]] = doc["metadata"]["tags"]
            else:
                data_collections[doc["collection_name"]] = ""
        return data_collections

    def delete_all_data_collections(self):
        for dcol in self.data_collection_names:
            self.remove_collection(dcol)
        return

    def remove_collection(self, collection_name):
        save_dict = self.db[self.collection_collection_name].find_one({"collection_name": collection_name})
        if "file_id" in save_dict:
            self.fs.delete(save_dict["file_id"])
        self.db[self.collection_collection_name].delete_one({"collection_name": collection_name})
        return

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
        if self.project_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in self.db[self.project_collection_name].find(projection=["project_name"]):
            my_project_names.append(doc["project_name"])
        return sorted([str(t) for t in my_project_names], key=str.lower)

    @property
    def metabook_names(self):
        if self.metabook_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.metabook_collection_name)
            return []
        my_metabook_names = []
        for doc in self.db[self.metabook_collection_name].find(projection=["metabook_name"]):
            my_metabook_names.append(doc["metabook_name"])
        return sorted(my_metabook_names, key=str.lower)

    @property
    def metabook_names_with_metadata(self):
        if self.metabook_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.metabook_collection_name)
            return []
        my_metabook_names = []
        for doc in self.db[self.metabook_collection_name].find(projection=["metabook_name", "metadata"]):
            if "metadata" in doc:
                my_metabook_names.append([doc["metabook_name"], doc["metadata"]])
            else:
                my_metabook_names.append([doc["metabook_name"], None])
        return sorted(my_metabook_names, key=self.sort_data_list_key)

    @property
    def metabook_tags_dict(self):
        if self.metabook_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.metabook_collection_name)
            return {}
        metabooks = {}
        for doc in self.db[self.metabook_collection_name].find(projection=["metabook_name", "metadata"]):
            if "metadata" in doc:
                metabooks[doc["metabook_name"]] = doc["metadata"]["tags"]
            else:
                metabooks[doc["metabook_name"]] = ""
        return metabooks

    def remove_node_uses(self, node_id, meta_id, delete_if_unused=False):
        node_col = self.db[self.node_collection_name]
        node = node_col.find_one({"_id":  ObjectId(node_id)})
        if not node:
            return {"success": False, "error": "Node not found."}
        if delete_if_unused:
            uses = node["uses"]
            uses.remove(meta_id)
            if len(uses) == 0:
                node_col.delete_one({"_id":  ObjectId(node_id)})
                return {"success": True}
        if meta_id in node["uses"]:
            node_col.update_one(
                {"_id": ObjectId(node_id)},
                {"$pull": {"uses": meta_id}}
            )
        return {"success": True}

    def remove_metabook(self, metabook_name):
        print(f"in remove_metabook with name {metabook_name}")
        metabook = self.db[self.metabook_collection_name].find_one({"metabook_name": metabook_name})
        if metabook is None:
            print(f"metabook {metabook_name} not found.")
        else:
            print("found the metabook")
            if "nodes" in metabook:
                for node_id in metabook["nodes"]:
                    try:
                        self.remove_node_uses(node_id, metabook._id, True)
                    except Exception as ex:
                        print(f"Error removing node {node_id} from metabook {metabook_name}: {ex}")
            else:
                print("no nodes found")
        print("about to do the delete")
        self.db[self.metabook_collection_name].delete_one({"metabook_name": metabook_name})
        print("done with the delete")
        return

    @property
    def project_names_with_metadata(self):
        if self.project_collection_name not in self.db.list_collection_names():
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
        if self.tile_collection_name not in self.db.list_collection_names():
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
        if self.tile_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in self.db[self.tile_collection_name].find(projection=["tile_module_name"]):
            my_tile_names.append(doc["tile_module_name"])
        return sorted([str(t) for t in my_tile_names], key=str.lower)

    @property
    def code_names(self, ):
        if self.code_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.code_collection_name)
            return []
        my_code_names = []
        for doc in self.db[self.code_collection_name].find(projection=["code_name"]):
            my_code_names.append(doc["code_name"])
        return sorted([str(t) for t in my_code_names], key=str.lower)

    @property
    def code_names_with_metadata(self):
        if self.code_collection_name not in self.db.list_collection_names():
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
        if self.code_collection_name not in self.db.list_collection_names():
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
        names = (self.list_collection_names + self.project_names +
                 self.tile_module_names + self.list_names + self.code_names + self.metadata_names)
        return sorted(names, key=str.lower)

    @property
    def all_names_with_metadata(self):
        col_names_with_metadata = [d + ["collection"] for d in self.data_collection_names_with_metadata]
        proj_names_with_metadata = [d + ["project"] for d in self.project_names_with_metadata]
        list_names_with_metadata = [d + ["list"] for d in self.list_names_with_metadata]
        tile_names_with_metadata = [d + ["tile"] for d in self.tile_module_names_with_metadata]
        code_names_with_metadata = [d + ["code"] for d in self.code_names_with_metadata]
        metabook_names_with_metadata = [d + ["metabook"] for d in self.metabook_names_with_metadata]
        names_with_metadata = col_names_with_metadata + proj_names_with_metadata + list_names_with_metadata + \
            tile_names_with_metadata + code_names_with_metadata + metabook_names_with_metadata
        return sorted(names_with_metadata, key=self.sort_data_list_key)

    @property
    def function_tags_dict(self):
        if self.code_collection_name not in self.db.list_collection_names():
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
                  "collection": self.collection_collection_name,
                  "project": self.project_collection_name, "code": self.code_collection_name,
                  "metabook": self.metabook_collection_name}
        return cnames[res_type]

    def get_all_resource_names(self, res_type):
        colname = self.resource_collection_name(res_type)
        name_key = name_keys[res_type]
        coll = self.db[colname]
        names = [doc[name_key] for doc in coll.find({}, {name_key: 1, "_id": 0})]
        return names

    def get_resource_names(self, res_type, tag_filter=None, search_filter=None):
        if tag_filter is not None:
            tag_filter = tag_filter.lower()
        if search_filter is not None:
            search_filter = search_filter.lower()
        cname = self.resource_collection_name(res_type)
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

    def get_unpacked_node(self, node_id):
        node = self.db[self.node_collection_name].find_one({"_id": ObjectId(node_id)})
        node["data"] = self.read_node_data(node_id)
        node["_id"] = str(node["_id"])
        del node["file_id"]
        return node

    def read_node_data(self, node_id):
        node = self.db[self.node_collection_name].find_one({"_id":  ObjectId(node_id)})
        if not node:
            return None
        binarized_python_object = zlib.decompress(self.fs.get(node["file_id"]).read())
        return debinarize_python_object(binarized_python_object)

    def get_metabook_unpacked(self, meta_id):
        metabook = self.db[self.metabook_collection_name].find_one({"_id":  ObjectId(meta_id)})
        if not metabook:
            return None
        unpacked_nodes = []
        for node_id in metabook["nodes"]:
            unpacked_nodes.append(self.get_unpacked_node(node_id))
        metabook["nodes"] = unpacked_nodes
        metabook["_id"] = str(metabook["_id"])
        return metabook

    def get_metabook(self, meta_id):
        metabook = self.db[self.metabook_collection_name].find_one({"_id":  ObjectId(meta_id)})
        if not metabook:
            return None
        return metabook

    def get_code_with_class(self, class_name):
        if self.code_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.code_collection_name)
        for doc in self.db[self.code_collection_name].find():
            if class_name in doc["metadata"]["classes"]:
                return doc["the_code"]
        return None

    def get_code_with_function(self, function_name):
        if self.code_collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.code_collection_name)
        for doc in self.db[self.code_collection_name].find():
            if function_name in doc["metadata"]["functions"]:
                return doc["the_code"]
        return None

    ### Stuff below here is needed if I mount a Mongo database that hasn't yet
    ### Had data collections updated to the new compact format where they all live in a single collection
    ### This is just what is needed for the minimal thing of running the update
    ### More stuff is in colleciton_manager

    #legacy
    @property
    def data_collections(self):
        cnames = self.db.list_collection_names()
        string_start = self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                my_collection_names.append(m.group(1))
        return sorted([str(t) for t in my_collection_names], key=str.lower)

    # legacy
    def full_collection_name(self, cname):
        return self.username + ".data_collection." + cname

    # legacy
    def build_data_collection_name(self, collection_name):
        return '{}.data_collection.{}'.format(self.username, collection_name)

    #legacy
    def get_short_collection_name(self, full_collection_name):
        return re.sub(r"^.*?\.data_collection\.", "", full_collection_name)

    #legacy
    def remove_collection_legacy(self, collection_name):
        def get_traceback_message(e, special_string=None):
            if special_string is None:
                template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
            else:
                template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
            error_string = template.format(type(e).__name__, e.args)
            error_string += traceback.format_exc() + "</pre>"
            return error_string
        fcname = self.full_collection_name(collection_name)
        for doc in self.db[fcname].find():
            if "file_id" in doc:
                try:
                    self.fs.delete(doc["file_id"])
                except Exception as ex:
                    print("couldn't delete a gridfs entry")
                    self.get_traceback_message(ex)
        self.db.drop_collection(fcname)
        return True

    # legacy
    def get_collection_metadata_legacy(self, short_collection_name):
        name_exists = short_collection_name in self.data_collections
        if not name_exists:
            return None

        full_collection_name = self.build_data_collection_name(short_collection_name)
        the_collection = self.db[full_collection_name]
        return the_collection.find_one({"name": "__metadata__"})

    # legacy
    def get_all_collection_info_legacy(self, short_collection_name, return_lists=True):
        def get_traceback_message(e, special_string=None):
            if special_string is None:
                template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
            else:
                template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
            error_string = template.format(type(e).__name__, e.args)
            error_string += traceback.format_exc() + "</pre>"
            return error_string
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
                try:
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
                except Exception as ex:
                    print(f"Couldn't read document {fname}")
                    print(get_traceback_message(ex))

        return new_collection_dict, doc_metadata_dict, header_list_dict, collection_metadata