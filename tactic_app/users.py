
# This module contains the User class machinery required by flask-login

import re, sys
import pymongo
from flask.ext.login import UserMixin
from tactic_app import login_manager, db
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


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
        self.username = user_dict["username"]
        self.password_hash = user_dict["password_hash"]

    @staticmethod
    def get_user_by_username(username):
        result = db.user_collection.find_one({"username": username})
        if result is None:
            return None
        else:
            return User(result)

    def create_collection_meta_data(self, collection_type):
        result = {
            "username": self.username,
            "user_id": self.get_id(),
            "collection_type": collection_type
        }
        return result

    @staticmethod
    def create_new(user_dict):
        username = user_dict["username"]
        password = user_dict["password"]
        password_hash = generate_password_hash(password)
        new_user_dict = {"username": username, "password_hash": password_hash, "data_collections": [], "projects": []}
        db.user_collection.insert_one(new_user_dict)
        return User.get_user_by_username(username)

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
    def my_record(self):
        return db.user_collection.find_one({"username": self.username})

    @property
    def data_collections(self):
        cnames = db.collection_names()
        string_start =self.username + ".data_collection."
        my_collection_names = []
        for cname in cnames:
            m = re.search(string_start + "(.*)", cname)
            if m:
                my_collection_names.append(m.group(1))
        return my_collection_names

    def full_collection_name(self, cname):
        return self.username + ".data_collection." + cname

    @property
    def project_names(self):
        if self.project_collection_name not in db.collection_names():
            db.create_collection(self.project_collection_name)
            return []
        my_project_names = []
        for doc in db[self.project_collection_name].find():
            my_project_names.append(doc["project_name"])
        return my_project_names

    @property
    def list_names(self):
        if self.list_collection_name not in db.collection_names():
            db.create_collection(self.list_collection_name)
            return []
        my_list_names = []
        for doc in db[self.list_collection_name].find():
            my_list_names.append(doc["list_name"])
        return my_list_names

    def get_list(self, list_name):
        list_dict = db[self.list_collection_name].find_one({"list_name": list_name})
        return list_dict["the_list"]
