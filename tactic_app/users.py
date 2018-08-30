
# This module contains the User class machinery required by flask-login

import re
import sys
import datetime
from collections import OrderedDict
from flask import jsonify, request
from flask_login import UserMixin
from tactic_app import login_manager, db, fs, list_collections  # global_stuff db
from tactic_app.communication_utils import read_project_dict, make_jsonizable_and_compress
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

user_data_fields = ["username", "email", "full_name", "favorite_dumpling", "tzoffset"]
res_types = ["list", "collection", "project", "tile", "code"]
name_keys = {"tile": "tile_module_name", "list": "list_name", "project": "project_name", "code": "code_name"}


def put_docs_in_collection(collection_name, dict_list):
    return db[collection_name].insert_many(dict_list)


@login_manager.user_loader
def load_user(userid):
    # This expects that userid will be a string
    # If it's an ObjectId, rather than a string, I get an error likely having to do with login_manager
    result = db.user_collection.find_one({"_id": ObjectId(userid)})

    if result is None:
        return None
    else:
        return User(result)


def remove_user(userid):
    try:
        user = load_user(userid)
        db.drop_collection(user.list_collection_name)
        db.drop_collection(user.tile_collection_name)
        db.drop_collection(user.code_collection_name)
        user.delete_all_data_collections()  # have to do this because of gridfs pointers
        user.delete_all_projects()  # have to do this because of gridfs pointers
        db.drop_collection(user.project_collection_name)
        db.user_collection.delete_one({"_id": ObjectId(userid)})
        return {"success": True, "message": "User successfully revmoed."}
    except Exception as ex:
        return process_exception(ex)


def get_all_users():
    return db.user_collection.find()


def process_exception(ex):
    template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
    error_string = template.format(type(ex).__name__, ex.args)
    error_string += traceback.format_exc()
    return {"success": False, "message": error_string, "alert_type": "alert-warning"}


def copy_between_accounts(source_user, dest_user, res_type, new_res_name, res_name):
    try:
        if res_type == "collection":
            collection_to_copy = source_user.full_collection_name(res_name)
            new_collection_name = dest_user.full_collection_name(new_res_name)
            for doc in db[collection_to_copy].find():
                del doc["_id"]
                if "file_id" in doc:
                    doc_text = fs.get(doc["file_id"]).read()
                    doc["file_id"] = fs.put(doc_text)
                db[new_collection_name].insert_one(doc)
            db[new_collection_name].update_one({"name": "__metadata__"},
                                               {'$set': {"datetime": datetime.datetime.utcnow()}})
        else:
            name_field = name_keys[res_type]
            collection_name = source_user.resource_collection_name(res_type)
            old_dict = db[collection_name].find_one({name_field: res_name})
            new_res_dict = {name_field: new_res_name}
            for (key, val) in old_dict.items():
                if (key == "_id") or (key == name_field):
                    continue
                new_res_dict[key] = val
            if "metadata" not in new_res_dict:
                mdata = {"datetime": datetime.datetime.utcnow(),
                         "updated": datetime.datetime.utcnow(),
                         "tags": "",
                         "notes": ""}
                new_res_dict["metadata"] = mdata
            else:
                new_res_dict["metadata"]["datetime"] = datetime.datetime.utcnow()
            if res_type == "project":
                project_dict = read_project_dict(fs, new_res_dict["metadata"], old_dict["file_id"])
                project_dict["user_id"] = dest_user.get_id()
                pdict = make_jsonizable_and_compress(project_dict)
                new_res_dict["file_id"] = fs.put(pdict)
            elif "file_id" in new_res_dict:
                doc_text = fs.get(new_res_dict["file_id"]).read()
                new_res_dict["file_id"] = fs.put(doc_text)
            new_collection_name = dest_user.resource_collection_name(res_type)
            db[new_collection_name].insert_one(new_res_dict)
        return jsonify({"success": True, "message": "Resource Successfully Copied", "alert_type": "alert-success"})
    except:
        error_string = "Error copying resource" + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})


class User(UserMixin):

    def __init__(self, user_dict):
        self.username = ""  # This is just to be make introspection happy
        for key in user_data_fields:
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, "")
        self.password_hash = user_dict["password_hash"]

    def is_authenticate(self):
        return True

    def is_anonymous(self):
        return False

    def set_user_timezone_offset(self, tzoffset):
        db["user_collection"].update_one({"username": self.username},
                                         {'$set': {"tzoffset": tzoffset}})
        return

    def set_last_login(self):
        current_time = datetime.datetime.utcnow()
        db["user_collection"].update_one({"username": self.username},
                                         {'$set': {"last_login": current_time}})
        return

    def localize_time(self, dt):
        tzoffset = self.get_tzoffset()
        return dt - datetime.timedelta(hours=tzoffset)

    @staticmethod
    def get_user_by_username(username):
        result = db.user_collection.find_one({"username": username})
        if result is None:
            return None
        else:
            return User(result)

    def get_tzoffset(self):
        return self.user_data_dict["tzoffset"]

    @property
    def user_data_dict(self):
        result = OrderedDict()
        for key in user_data_fields:
            result[key] = getattr(self, key)
        return result

    def create_collection_meta_data(self, collection_type):
        result = {
            "username": self.username,
            "user_id": self.get_id(),
            "collection_type": collection_type
        }
        return result

    def resource_collection_name(self, res_type):
        cnames = {"tile": self.tile_collection_name, "list": self.list_collection_name,
                  "project": self.project_collection_name, "code": self.code_collection_name}
        return cnames[res_type]

    def update_account(self, data_dict):
        update_dict = {}
        if "password" in data_dict:
            if len(data_dict["password"]) < 4:
                return {"success": False, "message": "Passwords must be at least 4 characters."}
            update_dict["password_hash"] = generate_password_hash(data_dict["password"])
        for (key, val) in data_dict.items():
            if not key == "password":
                update_dict[key] = val
        try:
            db["user_collection"].update_one({"username": self.username},
                                             {'$set': update_dict})
            return {"success": True, "message": "Information successfully updated."}
        except:
            return {"success": False, "message": "Problem updating info."}

    @staticmethod
    def create_new(user_dict):
        username = user_dict["username"]
        if len(username) < 4:
            return {"success": False, "message": "Usernames must be at least 4 characters.", "username": username}
        if "." in username:
            return {"success": False, "message": "Usernames cannot contain a period.", "username": username}
        password = user_dict["password"]
        if len(password) < 4:
            return {"success": False, "message": "Passwords must be at least 4 characters.", "username": username}
        if db.user_collection.find_one({"username": username}) is not None:
            return {"success": False, "message": "That username is taken.", "username": username}
        password_hash = generate_password_hash(password)
        new_user_dict = {"username": username,
                         "password_hash": password_hash,
                         "email": ""}
        db.user_collection.insert_one(new_user_dict)
        return {"success": True, "message": "", "username": username}

    # get_id is required by login_manager
    def get_id(self):
        # Note that I have to convert this to a string for login_manager to be happy.
        return str(db.user_collection.find_one({"username": self.username})["_id"])

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_user_dict(self):
        return {"username": self.username, "password_hash": self.password_hash}

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
    def my_record(self):
        return db.user_collection.find_one({"username": self.username})

    @property
    def data_collections(self):
        cnames = db.collection_names()
        string_start = self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                my_collection_names.append(m.group(1))
        return sorted([str(t) for t in my_collection_names], key=str.lower)

    @property
    def data_collection_names_with_metadata(self):
        cnames = db.collection_names()
        string_start = self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                mdata = db[cname].find_one({"name": "__metadata__"})
                my_collection_names.append([m.group(1), mdata])

        return sorted(my_collection_names, key=self.sort_data_list_key)

    @property
    def data_collection_tags_dict(self):
        cnames = db.collection_names()
        string_start = self.username + ".data_collection."
        data_collection_names = {}
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                mdata = db[cname].find_one({"name": "__metadata__"})
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
        for doc in db[fcname].find():
            if "file_id" in doc:
                fs.delete(doc["file_id"])
        db.drop_collection(fcname)
        return True

    def delete_all_projects(self):
        for proj in self.project_names:
            self.remove_project(proj)
        return

    def remove_project(self, project_name):
        save_dict = db[self.project_collection_name].find_one({"project_name": project_name})
        if "file_id" in save_dict:
            fs.delete(save_dict["file_id"])
        db[self.project_collection_name].delete_one({"project_name": project_name})
        return

    @property
    def project_names(self):
        if self.project_collection_name not in db.collection_names():
            db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in db[self.project_collection_name].find(projection=["project_name"]):
            my_project_names.append(doc["project_name"])
        return sorted([str(t) for t in my_project_names], key=str.lower)

    @property
    def list_names(self):
        if self.list_collection_name not in db.collection_names():
            db.create_collection(self.list_collection_name)
            return []
        my_list_names = []
        for doc in db[self.list_collection_name].find(projection=["list_name"]):
            my_list_names.append(doc["list_name"])
        return sorted([str(t) for t in my_list_names], key=str.lower)

    def sort_data_list_key(self, item):
        return str.lower(str(item[0]))

    @property
    def list_names_with_metadata(self):
        if self.list_collection_name not in db.collection_names():
            db.create_collection(self.list_collection_name)
            return []
        my_list_names = []
        for doc in db[self.list_collection_name].find(projection=["list_name", "metadata"]):
            if "metadata" in doc:
                my_list_names.append([doc["list_name"], doc["metadata"]])
            else:
                my_list_names.append([doc["list_name"], None])
        return sorted(my_list_names, key=self.sort_data_list_key)

    @property
    def list_tags_dict(self, ):
        if self.list_collection_name not in db.collection_names():
            db.create_collection(self.list_collection_name)
            return {}
        lists = {}
        for doc in db[self.list_collection_name].find(projection=["list_name", "metadata"]):
            if "metadata" in doc:
                lists[doc["list_name"]] = doc["metadata"]["tags"]
            else:
                lists[doc["list_name"]] = ""
        return lists

    @property
    def project_names_with_metadata(self):
        if self.project_collection_name not in db.collection_names():
            db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in db[self.project_collection_name].find(projection=["project_name", "metadata"]):
            if "metadata" in doc:
                my_project_names.append([doc["project_name"], doc["metadata"]])
            else:
                my_project_names.append([doc["project_name"], None])
        return sorted(my_project_names, key=self.sort_data_list_key)

    @property
    def tile_module_names_with_metadata(self):
        if self.tile_collection_name not in db.collection_names():
            db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in db[self.tile_collection_name].find(projection=["tile_module_name", "metadata"]):
            if "metadata" in doc:
                my_tile_names.append([doc["tile_module_name"], doc["metadata"]])
            else:
                my_tile_names.append([doc["tile_module_name"], None])
        return sorted(my_tile_names, key=self.sort_data_list_key)

    @property
    def tile_module_names(self,):
        if self.tile_collection_name not in db.collection_names():
            db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in db[self.tile_collection_name].find(projection=["tile_module_name"]):
            my_tile_names.append(doc["tile_module_name"])
        return sorted([str(t) for t in my_tile_names], key=str.lower)

    @property
    def code_names(self, ):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return []
        my_code_names = []
        for doc in db[self.code_collection_name].find(projection=["code_name"]):
            my_code_names.append(doc["code_name"])
        return sorted([str(t) for t in my_code_names], key=str.lower)

    @property
    def code_names_with_metadata(self):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return []
        my_code_names = []
        for doc in db[self.code_collection_name].find(projection=["code_name", "metadata"]):
            if "metadata" in doc:
                my_code_names.append([doc["code_name"], doc["metadata"]])
            else:
                my_code_names.append([doc["code_name"], None])
        return sorted(my_code_names, key=self.sort_data_list_key)

    @property
    def class_tags_dict(self):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return {}
        classes = {}
        for doc in db[self.code_collection_name].find():
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
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return {}
        functions = {}
        for doc in db[self.code_collection_name].find():
            tags = doc["metadata"]["tags"]
            for f in doc["metadata"]["functions"]:
                functions[f] = tags
        return functions

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
                mdata = db[cname].find_one({"name": "__metadata__"})
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
            if cname not in db.collection_names():
                db.create_collection(cname)
                return []
            res_names = []
            for doc in db[cname].find():
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
        list_dict = db[self.list_collection_name].find_one({"list_name": list_name})
        return list_dict["the_list"]

    def get_tile_dict(self, tile_module_name):
        tile_dict = db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict

    def get_tile_module(self, tile_module_name):
        tile_dict = db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict["tile_module"]

    def get_tile_module_dict(self, tile_module_name):
        tile_dict = db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict

    def get_code(self, code_name):
        code_dict = db[self.code_collection_name].find_one({"code_name": code_name})
        return code_dict["the_code"]

    def get_code_with_class(self, class_name):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
        for doc in db[self.code_collection_name].find():
            if class_name in doc["metadata"]["classes"]:
                return doc["the_code"]
        return None

    def get_code_with_function(self, function_name):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
        for doc in db[self.code_collection_name].find():
            if function_name in doc["metadata"]["functions"]:
                return doc["the_code"]
        return None


def load_remote_user(userid, the_db):
    # This expects that userid will be a string
    # If it's an ObjectId, rather than a string, I get an error likely having to do with login_manager
    result = the_db.user_collection.find_one({"_id": ObjectId(userid)})

    if result is None:
        return None
    else:
        return User(result)


class RemoteUser(User):
    def __init__(self, user_dict, remote_db):
        self.username = ""  # This is just to be make introspection happy
        for key in user_data_fields:
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, "")
        self.password_hash = user_dict["password_hash"]
        self.remote_db = remote_db

    @staticmethod
    def get_user_by_username(username, remote_db):
        result = remote_db.user_collection.find_one({"username": username})
        if result is None:
            return None
        else:
            return RemoteUser(result, remote_db)

    @property
    def tile_module_names_with_metadata(self):
        if self.tile_collection_name not in self.remote_db.collection_names():
            self.remote_db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in self.remote_db[self.tile_collection_name].find(projection=["tile_module_name", "metadata"]):
            if "metadata" in doc:
                my_tile_names.append([doc["tile_module_name"], doc["metadata"]])
            else:
                my_tile_names.append([doc["tile_module_name"], None])
        return sorted(my_tile_names, key=self.sort_data_list_key)

    def get_tile_module(self, tile_module_name):
        tile_dict = self.remote_db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict["tile_module"]
