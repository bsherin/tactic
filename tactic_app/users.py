
# This module contains the User class machinery required by flask-login

import re
from collections import OrderedDict
from flask.ext.login import UserMixin
from tactic_app import login_manager, db # global_stuff db
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

user_data_fields = ["username", "email", "full_name", "favorite_dumpling"]


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


class User(UserMixin):
    def __init__(self, user_dict):
        self.username = ""  # This is just to be make introspection happy
        for key in user_data_fields:
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, "")
        self.password_hash = user_dict["password_hash"]

    @staticmethod
    def get_user_by_username(username):
        result = db.user_collection.find_one({"username": username})
        if result is None:
            return None
        else:
            return User(result)

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

    # tactic_new need code_collection_name
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

    def full_collection_name(self, cname):
        return self.username + ".data_collection." + cname

    def build_data_collection_name(self, collection_name):
        return '{}.data_collection.{}'.format(self.username, collection_name)

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

    # tactic_new want 4a: code_names, code_names_with_metadata functions, classes
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
    def class_names(self, ):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return []
        classes = []
        for doc in db[self.code_collection_name].find(projection=["classes"]):
            classes += doc["classes"]
        return sorted([str(t) for t in classes], key=str.lower)

    @property
    def function_names(self, ):
        if self.code_collection_name not in db.collection_names():
            db.create_collection(self.code_collection_name)
            return []
        functions = []
        for doc in db[self.code_collection_name].find(projection=["functions"]):
            functions += doc["functions"]
        return sorted([str(t) for t in functions], key=str.lower)

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
            cnames = {"tile": self.tile_collection_name, "list": self.list_collection_name,
                      "project": self.project_collection_name, "code": self.code_collection_name}
            name_keys = {"tile": "tile_module_name", "list": "list_name", "project": "project_name", "code": "code_name"}
            cname = cnames[res_type]
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

    def get_tile_module(self, tile_module_name):
        tile_dict = db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict["tile_module"]

    # tactic_new 4c: get_code, get_code_with_function/class here
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

