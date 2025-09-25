import re
import datetime
import copy
from communication_utils import debinarize_python_object
import zlib
from bson import ObjectId

class NodeAccess(object):

    list_name_field = "list_name"
    list_content_field = "the_list"
    list_additional_mdata_fields = None

    @property
    def node_collection_name(self):
        return '{}.nodes'.format(self.username)


    def get_node_doc(self, node_id):
        doc = self.db[self.node_collection_name].find_one(
            {"_id": ObjectId(node_id)}, {"_id": 0}
        )
        return doc if doc else None

    def get_node_doc_from_id(self, node_id):
        doc = self.db[self.node_collection_name].find_one(
            {"_id": ObjectId(node_id)}, {"_id": 0}
        )
        return doc if doc else None

    def get_unpacked_node(self, node_id):
        node = self.get_node_doc(node_id)
        node["data"] = self.read_node_data(node_id)
        node["_id"] = str(node["_id"])
        del node["file_id"]
        return node

    def read_node_data(self, node_id):
        node = self.get_node_doc(node_id)
        if not node:
            return None
        binarized_python_object = zlib.decompress(self.fs.get(node["file_id"]).read())
        return debinarize_python_object(binarized_python_object)

    def remove_node(self, node_id):
        if not self.node_id_exists(node_id):
            raise ValueError(f"List with _id {node_id} does not exist.")
        self.db[self.node_collection_name].delete_one({"_id": ObjectId(node_id)})
        return

    def create_node(self, type, data, use, title="", searchable_text=""):
        cdata = make_jsonizable_and_compress(data)
        file_id = self.fs.put(cdata)
        print("got the file_id")
        save_dict = {"type": type,
                     "uses": [use],
                     "title": title,
                     "searchable_text": searchable_text,
                     "size": len(cdata),
                     "file_id": file_id}
        print("got the save_dict")
        _id = self.db[self.node_collection_name].insert_one(save_dict).inserted_id
        print("created the nodet")
        return str(_id)


    def node_id_exists(self, node_id):
        return self.db[self.node_collection_name].find_one(
            {"_id": ObjectId(node_id)}, {"_id": 1}
        ) is not None

    def remove_node_uses(self, node_id, meta_id, delete_if_unused=False):
        node = self.get_node_from_id(node_id)
        if not node:
            return {"success": False, "error": "Node not found."}
        if delete_if_unused:
            uses = node["uses"]
            uses.remove(meta_id)
            if len(uses) == 0:
                self.remove_node(node_id)
                return {"success": True}
        if meta_id in node["uses"]:
            node_col.update_one(
                {"_id": ObjectId(node_id)},
                {"$pull": {"uses": meta_id}}
            )
        return {"success": True}


    def update_node(self, node_id, update_dict, update_search_text):
        node = self.get_node_doc(node_id)
        if not node:
            return {"success": False, "error": "Node not found."}

        if "data" in update_dict:
            data = update_dict["data"]
            cdata = make_jsonizable_and_compress(data)
            self.fs.delete(node["file_id"])
            file_id = self.fs.put(cdata)
            del update_dict["data"]
            update_dict["file_id"] = file_id
            update_dict["size"] = len(cdata)

        self.db[self.node_collection_name].update_one(
            {"_id": ObjectId(node_id)},
            {"$set": update_dict}
        )

        if "searchable_text" in update_dict and update_search_text:
            searchable_text = update_dict["searchable_text"]
            if searchable_text:
                for meta_id in node["uses"]:
                    self.update_metabook_text(meta_id)

        return {"success": True}
