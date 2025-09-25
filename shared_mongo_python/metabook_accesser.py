import re
import datetime
import copy
from bson import ObjectId

class MetabookAccess(object):

    metabook_name_field = "metabook_name"
    metabook_content_field = "searchable_text"
    metabook_additional_mdata_fields = None

    @property
    def metabook_collection_name(self):
        return '{}.metabooks'.format(self.username)

    def get_metabook_doc(self, metabook_name):
        doc = self.db[self.metabook_collection_name].find_one(
            {"metabook_name": metabook_name}, {"_id": 0}
        )
        return doc if doc else None

    def get_metabook_doc_from_id(self, metabook_id):
        doc = self.db[self.metabook_collection_name].find_one(
            {"_id": ObjectId(metabook_id)}, {"_id": 0}
        )
        return doc if doc else None

    def get_metabook_doc_by_id(self, metabook_id):
        doc = self.db[self.metabook_collection_name].find_one(
            {"_id": ObjectId(metabook_id)   }, {"_id": 0}
        )
        return doc if doc else None

    def get_metabook_unpacked(self, meta_id):
        doc = self.get_metabook_doc_by_id(meta_id)
        if not metabook:
            return None
        unpacked_nodes = []
        for node_id in metabook["nodes"]:
            unpacked_nodes.append(self.get_unpacked_node(node_id))
        metabook["nodes"] = unpacked_nodes
        metabook["_id"] = str(metabook["_id"])
        return metabook

    def create_empty_metabook(self, metabook_name):
        if self.metabook_name_exists(metabook_name):
            raise ValueError(f"metabook with name {metabook_name} already exists.")
        metadata = self.create_initial_metadata()
        _id = self.db[self.metabook_collection_name].insert_one({
            "metabook_name": metabook_name,
            "searchable_text": "",
            "nodes": [],
            "metadata": metadata
        }).inserted_id
        return _id

    def add_metabook_to_uses(self, node_id, meta_id):
        node = self.get_node_doc(node_id)
        if not node:
            return {"success": False, "error": "Node not found."}
        meta_node = self.get_metabook_doc_by_id(meta_id)
        if not meta_node:
            return {"success": False, "error": "Meta node not found."}
        if meta_id not in node["uses"]:
            db[user_obj.node_collection_name].update_one(
                {"_id": ObjectId(node_id)},
                {"$push": {"uses": meta_id}}
            )
        return {"success": True}

    def update_metabook_text(self, meta_id):
        metabook = self.get_metabook_doc_by_id(meta_id)
        if not metabook:
            return {"success": False, "error": "Metabook not found."}
        new_searchable_text = ""
        for node_id in metabook["nodes"]:
            node = self.get_node_doc(node_id)
            if node:
                new_searchable_text += f"{node.get('searchable_text', '')}\n"
        self.db[self.metabook_collection_name].update_one(
            {"_id":  ObjectId(meta_id)},
            {"$set": {"searchable_text": new_searchable_text.strip()}}
        )
        return {"success": True}

    def insert_node_at_index(self, node_id, meta_id, index, update_search_text=True):
        node = self.get_node_doc(node_id)
        if not node:
            return {"success": False, "error": "Node not found."}
        meta_node = self.get_metabook_doc_by_id(meta_id)
        if not meta_node:
            return {"success": False, "error": "Meta node not found."}

        self.add_metabook_to_uses(node_id, meta_id)

        self.db[self.metabook_collection_name].update_one(
            {"_id": ObjectId(meta_id)},
            {"$push": {"nodes": {"$each": [node_id], "$position": index}},
             "$set": {"metadata": self.get_updated_metadata(meta_node)}}
        )
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        return {"success": True}

    def append_node(self, node_id, meta_id, update_search_text=True):
        print("doing the append")
        node = self.get_node_doc(node_id)
        if not node:
            print("node not found")
            return {"success": False, "message": "Node not found."}
        metabook = self.get_metabook_doc_by_id(meta_id)
        if not metabook:
            print("metabook not found")
            return {"success": False, "message": "Meta node not found."}
        print("got the metabook")
        self.add_metabook_to_uses(node_id, meta_id)
        print("updating the metabook")
        self.db[self.metabook_collection_name].update_one(
            {"_id": ObjectId(meta_id)},
            {"$push": {"nodes": node_id}}
        )
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        return {"success": True}


    def remove_metabook(self, metabook_name):
        if not self.metabook_name_exists(metabook_name):
            raise ValueError(f"metabook with name {metabook_name} does not exist.")
        metabook = self.get_metabook_doc_by_id(metabook_name)
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


    def get_metabook_content(self, metabook_name):
        doc = self.db[self.metabook_collection_name].find_one(
            {"metabook_name": metabook_name}, {"searchable_text": 1, "_id": 0}
        )
        return doc.get("searchable_text", None) if doc else None

    def get_metabook_metadata(self, metabook_name):
        doc = self.db[self.metabook_collection_name].find_one(
            {"metabook_name": metabook_name}, {"metadata": 1, "_id": 0}
        )
        return doc.get("metadata", None) if doc else None

    def get_processed_metabook_metadata(self, metabook_name, search_inside=False, search_string=None):
        mdata = self.get_metabook_metadata(metabook_name)
        if mdata is None:
            return None
        else:
            result = self.process_metadata(mdata)
            search_context = None
            if search_inside and search_string is not None and len(search_string) > 0:
                searchable_text = self.get_metabook_content(metabook_name)
                if searchable_text is not None:
                    search_context = self.extract_search_context(searchable_text, search_string)
            result.update({"success": True, "res_name": metabook_name})
            if search_context is not None:
                result["search_context"] = search_context
            return result

    def metabook_name_exists(self, metabook_name):
        return self.db[self.metabook_collection_name].find_one(
            {"metabook_name": metabook_name}, {"_id": 1}
        ) is not None

    def get_metabook_content_with_metadata(self, metabook_name, process_metadata=False):
        doc = self.db[self.metabook_collection_name].find_one(
            {"metabook_name": metabook_name}, {"_id": 0, "searchable_text": 1, "metadata": 1, "metabook_name": 1}
        )
        if doc is None:
            return None
        searchable_text = doc.get("searchable_text", None)
        metadata = doc.get("metadata", None)
        if process_metadata and metadata is not None:
            metadata = self.process_metadata(metadata)
        return {
            "searchable_text": searchable_text,
            "metadata": metadata,
            "metabook_name": metabook_name
        }

    @property
    def metabook_names(self):
        names = [
            doc["metabook_name"]
            for doc in self.db[self.metabook_collection_name].find(
                {}, {"metabook_name": 1, "_id": 0}
            )
        ]
        return names

    @property
    def metabook_names_with_metadata(self):
        my_metabook_names = []
        for doc in self.db[self.metabook_collection_name].find({}, {"_id": 0, "metadata": 1, "metabook_name": 1}):
            if "metadata" in doc:
                my_metabook_names.append([doc["metabook_name"], doc["metadata"]])
            else:
                my_metabook_names.append([doc["metabook_name"], None])
        return sorted(my_metabook_names, key=self.sort_data_list_key)

    @property
    def metabook_tags_dict(self):
        tags = {}
        for doc in self.db[self.metabook_collection_name].find({}, {"_id": 0, "metadata": 1, "metabook_name": 1}):
            if "metadata" in doc:
                tags[doc["metabook_name"]] = doc["metadata"]["tags"]
            else:
                tags[doc["metabook_name"]] = ""
        return tags

    def get_all_metabook_tags(self, show_hidden=True):
        res_list = self.metabook_names_with_metadata
        result = []
        for res_item in res_list:
            mdata = res_item[1]
            if mdata and "tags" in mdata:
                result += str(mdata["tags"].lower()).split()
        all_tags = sorted(list(set(result)))
        if not show_hidden:
            all_tags = list(filter(lambda tag: not re.search("(^|/| )hidden($|/| )", tag), all_tags))
        return all_tags

    def grab_filtered_metabooks(self, search_text, search_spec, columns, is_repo=False):
        flist, all_tags =  self.grab_filtered_resources("metabook", self.metabook_collection_name, "metabook_name",
                                                        "searchable_text", self.metabook_additional_mdata_fields, search_text, search_spec,
                                                        columns, is_repo=is_repo)
        for val in flist:
            val["icon:th"] = "icon:manual"
            val["icon:upload"] = ""
            val["size"] = ""
        return flist, all_tags


    def create_metabook_from_data(self, metabook_name, searchable_text, metadata=None):
        if self.metabook_name_exists(metabook_name):
            raise ValueError(f"metabook with name {metabook_name} already exists.")
        if metadata is None:
            metadata = self.create_initial_metadata()
        else:
            metadata = self.update_metadata(metadata, True)
        self.db[self.metabook_collection_name].insert_one({
            "metabook_name": metabook_name,
            "searchable_text": searchable_text,
            "metadata": metadata})
        return


    def update_metabook(self, metabook_name, new_metabook):
        if not self.metabook_name_exists(metabook_name):
            raise ValueError(f"metabook with name {metabook_name} does not exist.")
        metadata = self.get_metabook_metadata(metabook_name)
        if metadata is None:
            metadata = {}
        metadata = self.update_metadata(metadata)
        self.db[self.metabook_collection_name].update_one(
            {"metabook_name": metabook_name},
            {"$set": {"searchable_text": new_metabook, "metadata": metadata}}
        )
        return

    def rename_metabook(self, old_name, new_name):
        if not self.metabook_name_exists(old_name):
            raise ValueError(f"metabook with name {old_name} does not exist.")
        if self.metabook_name_exists(new_name):
            raise ValueError(f"metabook with name {new_name} already exists.")
        self.db[self.metabook_collection_name].update_one(
            {"metabook_name": old_name},
            {"$set": {"metabook_name": new_name}}
        )
        return

    def save_metabook_metadata(self, metabook_name, metadata):
        if not self.metabook_name_exists(metabook_name):
            raise ValueError(f"metabook with name {metabook_name} does not exist.")
        mdata = self.get_metabook_metadata(metabook_name)
        if mdata is None:
            mdata = {}
        mdata.update(metadata)
        self.db[self.metabook_collection_name].update_one(
            {"metabook_name": metabook_name},
            {"$set": {"metadata": metadata}}
        )
        return

    def rename_tags_in_metabooks(self, tag_changes):
        if not tag_changes:
            return
        for doc in self.db[self.metabook_collection_name].find({}, {"_id": 0, "metadata": 1, "metabook_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata is not None and "tags" in mdata:
                taglist = mdata["tags"].split()
                for old_tag, new_tag in tag_changes:
                    if old_tag in taglist:
                        taglist.remove(old_tag)
                        if new_tag not in taglist:
                            taglist.append(new_tag)
                        self.db[self.metabook_collection_name].update_one(
                            {"metabook_name": doc["metabook_name"]},
                            {"$set": {"metadata.tags": " ".join(taglist)}}
                        )
        return

    def delete_tag_in_metabooks(self, tag):
        if not tag:
            return
        for doc in self.db[self.metabook_collection_name].find({}, {"_id": 0, "metadata": 1, "metabook_name": 1}):
            mdata = doc.get("metadata", None)
            if mdata and "tags" in mdata:
                taglist = mdata["tags"].split()
                if tag in taglist:
                    taglist.remove(tag)
                    self.db[self.metabook_collection_name].update_one(
                        {"metabook_name": doc["metabook_name"]},
                        {"$set": {"metadata.tags": " ".join(taglist)}}
                    )
        return

    def set_metabook_node_list(self, meta_id, nodes):
        metabook = self.get_metabook_doc_by_id(meta_id)
        if not metabook:
            return {"success": False, "error": "Metabook not found."}
        self.db[self.metabook_collection_name].update_one(
            {"_id":  ObjectId(meta_id)},
            {"$set": {"nodes": nodes,
                      "metadata": self.get_updated_metadata(metabook)}}
        )
        return {"success": True}

    def remove_node_at_index(self, node_id, meta_id, index, update_search_text=True):
        node = self.get_node(node_id)
        if not node:
            return {"success": False, "error": "Node not found."}
        metabook = self.get_metabook_doc_by_id(meta_id)
        nodes = metabook["nodes"]
        if not nodes:
            return {"success": False, "error": "Meta node not found."}
        if not (0 <= index < len(nodes)):
            return {"success": False, "error": "Index not in range."}
        new_nodes = nodes[:index] + nodes[index + 1:]
        self.db[self.metabook_collection_name].update_one(
            {"_id": ObjectId(meta_id),},
            {"$set": {"nodes": new_nodes,
                      "metadata": self.get_updated_metadata(metabook)},
             }
        )
        if meta_id not in new_nodes and meta_id in node["uses"]:
            self.db[self.node_collection_name].update_one(
                {"_id": node_id},
                {"$pull": {"uses": meta_id}}
            )
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        return {"success": True}