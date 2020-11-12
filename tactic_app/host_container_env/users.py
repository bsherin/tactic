
# This module contains the User class machinery required by flask-login

import re
import sys
import datetime
from collections import OrderedDict
from flask import jsonify, request
from flask_login import UserMixin
from tactic_app import login_manager, db, fs, list_collections  # global_stuff db
from communication_utils import read_project_dict, make_jsonizable_and_compress
from bson.objectid import ObjectId
from exception_mixin import generic_exception_handler
from werkzeug.security import generate_password_hash, check_password_hash
from mongo_accesser import MongoAccess

user_data_fields = ["username", "email", "full_name", "favorite_dumpling", "tzoffset", "theme", "preferred_dark_theme"]
default_dark_theme = "nord"
possible_dark_themes = ["material", "nord", "oceanic-next", "pastel-on-dark"]


def put_docs_in_collection(collection_name, dict_list):
    return db[collection_name].insert_many(dict_list)


class ModuleNotFoundError(Exception):
    pass


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
        return generic_exception_handler.get_traceback_exception_dict(ex)


def get_all_users():
    return db.user_collection.find()


class User(UserMixin, MongoAccess):

    def __init__(self, user_dict):
        self.username = ""  # This is just to be make introspection happy
        self.db = db  # This is to make mongoaccesser work
        self.fs = fs  # This is to make mongoaccesser work
        for key in user_data_fields:
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, "")
        self.password_hash = user_dict["password_hash"]

    def is_authenticated(self):
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

    def dt_to_datestring(self, dt):
        return dt.strftime("%b %d, %Y, %H:%M")

    def dt_to_sortstring(self, dt):
        return dt.strftime("%Y%m%d%H%M%S")

    def get_timestrings(self, dt):
        localtime = self.localize_time(dt)
        datestring = self.dt_to_datestring(localtime)
        datestring_for_sort = self.dt_to_sortstring(dt)
        return datestring, datestring_for_sort

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

    def get_theme(self):
        print("in get theme")
        theme = self.user_data_dict["theme"]
        print("got theme {}".format(str(theme)))
        if theme == "dark":
            return "dark"
        else:
            return "light"

    def get_preferred_dark_theme(self):
        preferred_dark_theme = self.user_data_dict["preferred_dark_theme"]
        if preferred_dark_theme is None:
            return default_dark_theme
        else:
            return preferred_dark_theme

    def get_tzoffset(self):
        return self.user_data_dict["tzoffset"]

    @property
    def user_data_dict(self):
        result = OrderedDict()
        for key in user_data_fields:
            if hasattr(self, key):
                result[key] = getattr(self, key)
            else:
                result[key] = None
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
        print("in update_account with " + str(data_dict))
        if "password" in data_dict:
            if len(data_dict["password"]) < 4:
                return {"success": False, "message": "Passwords must be at least 4 characters."}
            update_dict["password_hash"] = generate_password_hash(data_dict["password"])
        for (key, val) in data_dict.items():
            if "password" not in key:
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
                         "email": "",
                         "preferred_dark_theme": default_dark_theme}
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
    def my_record(self):
        return db.user_collection.find_one({"username": self.username})


def load_remote_user(userid, the_db):
    # This expects that userid will be a string
    # If it's an ObjectId, rather than a string, I get an error likely having to do with login_manager
    result = the_db.user_collection.find_one({"_id": ObjectId(userid)})

    if result is None:
        return None
    else:
        return User(result)


# noinspection PyMethodOverriding
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
