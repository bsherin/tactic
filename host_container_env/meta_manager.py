import sys
import re
import os
import io
import zlib
from collections import OrderedDict
from flask import jsonify, request, url_for, render_template, send_file
from bson import ObjectId
from flask_login import login_required, current_user
from tactic_app import app, db, fs
from qworker import task_worthy
from docker_functions import create_container, main_container_info
from resource_manager import LibraryResourceManager, repository_user
from communication_utils import make_jsonizable_and_compress, read_project_dict, debinarize_python_object
import loaded_tile_management
from mongo_accesser import make_name_unique
from redis_tools import create_ready_block

def get_updated_metadata(doc):
    if "metadata" in doc:
        mdata = doc["metadata"]
    else:
        mdata = {}
    mdata["updated"] = datetime.datetime.utcnow()
    return mdata

class NodeManagerMixin:

    @task_worthy
    def create_node_task(self, data):
        type = data.get("type")
        use = data.get("use")
        title = data.get("title", "")
        searchable_text = data.get("searchable_text", "")
        data_content = data.get("data", {})

        _id = self.create_node(type, data_content, use, title, searchable_text)
        return {"success": True, "_id": str(_id)}

    def create_node(self, type, data, use, title="", searchable_text=""):
        print("in create node")
        user_obj = current_user
        cdata = make_jsonizable_and_compress(data)
        file_id = fs.put(cdata)
        print("got the file_id")
        save_dict = {"type": type,
                     "uses": [use],
                     "title": title,
                     "searchable_text": searchable_text,
                     "size": len(cdata),
                     "file_id": file_id}
        print("got the save_dict")
        _id = db[user_obj.node_collection_name].insert_one(save_dict).inserted_id
        print("created the nodet")
        return str(_id)

    @task_worthy
    def create_empty_node_in_metabook_task(self, data):
        type = data.get("type")
        meta_id = data.get("meta_id")
        index = data.get("index", None)
        print(f"Creating empty node of type {type} in metabook {meta_id} at index {index}")

        new_id = self.create_empty_node_in_metabook(type, meta_id, index)
        print("got the new_id, about to return success")
        return {"success": True, "_id": new_id}

    def create_empty_node_in_metabook(self, type, meta_id, index=None):
        print('about to create the empty node')
        new_id = self.create_node(type, {}, meta_id)
        if index is not None:
            self.insert_node_at_index(new_id, meta_id, index, False)
        else:
            self.append_node(new_id, meta_id, False)
        return new_id

    def update_node(self, node_id, update_dict, update_search_text):
        user_obj = current_user
        node = db[user_obj.node_collection_name].find_one({"_id": ObjectId(node_id)})
        if not node:
            return {"success": False, "error": "Node not found."}

        if "data" in update_dict:
            data = update_dict["data"]
            cdata = make_jsonizable_and_compress(data)
            fs.delete(node["file_id"])
            file_id = fs.put(cdata)
            del update_dict["data"]
            update_dict["file_id"] = file_id
            update_dict["size"] = len(cdata)

        db[user_obj.node_collection_name].update_one(
            {"_id": ObjectId(node_id)},
            {"$set": update_dict}
        )

        if "searchable_text" in update_dict and update_search_text:
            searchable_text = update_dict["searchable_text"]
            if searchable_text:
                for meta_id in node["uses"]:
                    self.update_metabook_text(meta_id)

        return

    def insert_node_at_index(self, node_id, meta_id, index, update_search_text=True):
        user_obj = current_user
        node = db[user_obj.node_collection_name].find_one({"_id": ObjectId(node_id)})
        if not node:
            return {"success": False, "error": "Node not found."}
        meta_node = db[user_obj.node_collection_name].find_one({"_id": ObjectId(meta_id)})
        if not meta_node:
            return {"success": False, "error": "Meta node not found."}
        if meta_id not in node["uses"]:
            db[user_obj.node_collection_name].update_one(
                {"_id": ObjectId(node_id)},
                {"$push": {"uses": meta_id}}
            )
        db[user_obj.metabook_collection_name].update_one(
            {"_id": ObjectId(meta_id)},
            {"$push": {"nodes": {"$each": [node_id], "$position": index}},
             "$set": {"metadata": get_updated_metadata(meta_node)}}
        )
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        return

    def remove_node_at_index(self, node_id, meta_id, index, update_search_text=True):
        user_obj = current_user
        node_col = db[user_obj.node_collection_name]
        meta_col = db[user_obj.metabook_collection_name]
        node = node_col.find_one({"_id": ObjectId(node_id)})
        if not node:
            return {"success": False, "error": "Node not found."}
        metabook = meta_col.find_one({"_id": ObjectId(meta_id)})
        nodes = metabook["nodes"]
        if not nodes:
            return {"success": False, "error": "Meta node not found."}
        if not (0 <= index < len(nodes)):
            return {"success": False, "error": "Index not in range."}
        new_nodes = nodes[:index] + nodes[index + 1:]
        meta_col.update_one(
            {"_id": ObjectId(meta_id),},
            {"$set": {"nodes": new_nodes,
                      "metadata": get_updated_metadata(metabook)},
             }
        )
        if meta_id not in new_nodes and meta_id in node["uses"]:
            node_col.update_one(
                {"_id": node_id},
                {"$pull": {"uses": meta_id}}
            )
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        return

    def append_node(self, node_id, meta_id, update_search_text=True):
        print("doing the append")
        user_obj = current_user
        node = db[user_obj.node_collection_name].find_one({"_id": ObjectId(node_id)})
        if not node:
            print("node not found")
            return {"success": False, "error": "Node not found."}
        print("got the node")
        metabook = db[user_obj.metabook_collection_name].find_one({"_id": ObjectId(meta_id)})
        if not metabook:
            print("metabook not found")
            return {"success": False, "error": "Meta node not found."}
        print("got the metabook")
        if meta_id not in node["uses"]:
            db[user_obj.node_collection_name].update_one(
                {"_id": ObjectId(node_id)},
                {"$push": {"uses": meta_id}}
            )
            print("updated the uses")
        else:
            print("meta_id already in uses, not updating")
        print("updating the metabook")
        db[user_obj.metabook_collection_name].update_one(
            {"_id":  ObjectId(meta_id)},
            {"$push": {"nodes": node_id}}
        )
        print("updated the metabook")
        if update_search_text and "searchable_text" in node:
            searchable_text = node["searchable_text"]
            if searchable_text:
                self.update_metabook_text(meta_id)
        print("done with the append")
        return

    def update_metabook_text(self, meta_id):
        user_obj = current_user
        metabook = user_obj.get_metabook(meta_id)
        if not metabook:
            return {"success": False, "error": "Metabook not found."}
        new_searchable_text = ""
        for node_id in metabook["nodes"]:
            node = db[user_obj.node_collection_name].find_one({"_id":  ObjectId(node_id)})
            if node:
                new_searchable_text += f"{node.get('searchable_text', '')}\n"
        db[user_obj.metabook_collection_name].update_one(
            {"_id":  ObjectId(meta_id)},
            {"$set": {"searchable_text": new_searchable_text.strip()}}
        )
        return {"success": True}

    def set_metabook_node_list(self, meta_id, nodes):
        user_obj = current_user
        metabook = db[user_obj.metabook_collection_name].find_one({"_id": ObjectId(meta_id)})
        if not metabook:
            return {"success": False, "error": "Metabook not found."}
        db[user_obj.metabook_collection_name].update_one(
            {"_id":  ObjectId(meta_id)},
            {"$set": {"nodes": nodes,
                      "metadata": get_updated_metadata(metabook)}}
        )
        return {"success": True}


class MetabookManager(LibraryResourceManager):
    collection_list = "metabook_names"
    collection_list_with_metadata = "metabook_names_with_metadata"
    collection_name = "metabook_collection_name"
    name_field = "metabook_name"

    def add_rules(self):
        app.add_url_rule('/new_metabook',
                         "new_metabook",
                         login_required(self.new_metabook),
                         methods=['get', 'post'])
        app.add_url_rule('/read_metabook/<meta_id>',
                         "read_metabook",
                         login_required(self.read_metabook),
                         methods=['get', 'post'])

    def get_node(self, node_id):
        user_obj = current_user
        node = self.db[user_obj.node_collection_name].find_one({"_id": ObjectId(node_id)})
        if not node:
            return jsonify({"success": False, "error": "Node not found."}), 404
        return jsonify({"success": True, "node": node})

    def new_metabook(self):
        user_obj = current_user
        metabook_name = request.json['metabook_name']
        if not metabook_name:
            return jsonify({"success": False, "error": "Metabook name cannot be empty."}), 400
        mdata = loaded_tile_management.create_initial_metadata()
        data_dict = {
            "metabook_name": metabook_name,
            "metadata": mdata,
            "search_text": "",
            "nodes": []
        }
        _id = self.db[user_obj.metabook_collection_name].insert_one(data_dict).inserted_id
        return jsonify({"success": True, "_id": str(_id)})

    def read_metabook(self, meta_id):
        user_obj = current_user
        metabook = user_obj.get_metabook_unpacked(meta_id)
        if not metabook:
            return jsonify({"success": False, "error": "Metabook not found."}), 404
        return jsonify({"success": True, "metabook": metabook})

    def rename_me(self, old_name):
        try:
            new_name = request.json["new_name"]
            self.db[current_user.list_collection_name].update_one({"metabook_name": old_name},
                                                             {'$set': {"metabook_name": new_name}})
            return jsonify({"success": True, "message": "Metabook name changed", "alert_type": "alert-success"})
        except Exception as ex:
            return self.get_exception_for_ajax(ex, "Error renaming metabook")

    def grab_metadata(self, res_name):
        user_obj = current_user
        doc = self.db[user_obj.metabook_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata

    def save_metadata(self, res_name, tags, notes, uid=""):
        doc = self.db[current_user.metabook_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = {}
        mdata["tags"] = tags
        mdata["notes"] = notes
        mdata["mdata_uid"] = uid
        self.db[current_user.metabook_collection_name].update_one({self.name_field: res_name}, {'$set': {"metadata": mdata}})

    def delete_tag(self, tag):
        doclist = self.db[current_user.metabook_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            if tag in taglist:
                taglist.remove(tag)
                mdata["tags"] = " ".join(taglist)
                res_name = doc["list_name"]
                self.db[current_user.metabook_collection_name].update_one({self.name_field: res_name}, {'$set': {"metadata": mdata}})
        return

    def rename_tag(self, tag_changes):
        doclist = self.db[current_user.metabook_collection_name].find()
        for doc in doclist:
            if "metadata" not in doc:
                continue
            mdata = doc["metadata"]
            tagstring = mdata["tags"]
            taglist = tagstring.split()
            for old_tag, new_tag in tag_changes:
                if old_tag in taglist:
                    taglist.remove(old_tag)
                    if new_tag not in taglist:
                        taglist.append(new_tag)
                    mdata["tags"] = " ".join(taglist)
                    res_name = doc["list_name"]
                    self.db[current_user.metabook_collection_name].update_one({self.name_field: res_name},
                                                                     {'$set': {"metadata": mdata}})
        return


class RepositoryMetabookManager(MetabookManager):
    rep_string = "repository-"
    is_repository = True

    def add_rules(self):
        app.add_url_rule('/repository_read_metabook/<meta_id>',
                         "repository_read_metabook",
                         login_required(self.repository_read_metabook),
                         methods=['get', 'post'])

    def repository_read_metabook(self, meta_id):
        user_obj = repository_user
        metabook = user_obj.get_metabook_unpacked(meta_id)
        if not metabook:
            return jsonify({"success": False, "error": "Metabook not found."}), 404
        return jsonify({"success": True, "metabook": metabook})

    def grab_metadata(self, res_name):
        user_obj = repository_user
        doc = self.repository_db[user_obj.metabook_collection_name].find_one({self.name_field: res_name})
        if "metadata" in doc:
            mdata = doc["metadata"]
        else:
            mdata = None
        return mdata