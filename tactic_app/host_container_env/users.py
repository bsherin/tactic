
# This module contains the User class machinery required by flask-login

import re
import sys
import copy
import datetime
import uuid
from collections import OrderedDict
from flask import jsonify, request
from flask_login import UserMixin
from tactic_app import login_manager, db, fs, repository_db, repository_fs  # global_stuff db
from communication_utils import read_project_dict, make_jsonizable_and_compress
from bson.objectid import ObjectId
from exception_mixin import generic_exception_handler
from werkzeug.security import generate_password_hash, check_password_hash
from mongo_accesser import MongoAccess

from user_fields import user_data_fields


def put_docs_in_collection(collection_name, dict_list):
    return db[collection_name].insert_many(dict_list)


class ModuleNotFoundError(Exception):
    pass


USE_ALT_IDS = True
if USE_ALT_IDS:
    ID_FIELD = "alt_id"
else:
    ID_FIELD = "_id"


@login_manager.user_loader
def load_user(userid):
    # This expects that userid will be a string
    # If it's an ObjectId, rather than a string, I get an error likely having to do with login_manager'
    if USE_ALT_IDS:
        result = db.user_collection.find_one({ID_FIELD: userid})
    else:
        result = db.user_collection.find_one({ID_FIELD: ObjectId(userid)})

    if result is None:
        return None
    else:
        return User(result)


def remove_user(trueid):
    try:
        username = get_username_true_id(trueid)
        user = User.get_user_by_username(username)
        db.drop_collection(user.list_collection_name)
        db.drop_collection(user.tile_collection_name)
        db.drop_collection(user.code_collection_name)
        user.delete_all_data_collections()  # have to do this because of gridfs pointers
        db.drop_collection(user.collection_collection_name)
        user.delete_all_projects()  # have to do this because of gridfs pointers
        db.drop_collection(user.project_collection_name)
        db.user_collection.delete_one({"_id": ObjectId(trueid)})
        return {"success": True, "message": "User successfully revmoed."}
    except Exception as ex:
        return generic_exception_handler.get_traceback_exception_dict(ex)


def get_all_users():
    return db.user_collection.find()


def create_new_alt_id(username):
    update_dict = {"alt_id": str(ObjectId())}
    db["user_collection"].update_one({"username": username},
                                     {'$set': update_dict})
    return update_dict


def get_username_true_id(userid):
    result = db.user_collection.find_one({"_id": ObjectId(userid)})
    if result is not None and "username" in result:
        return result["username"]
    else:
        return None


class User(UserMixin, MongoAccess):

    def __init__(self, user_dict, use_remote=False):
        print("creating User")
        self.username = ""  # This is just to be make introspection happy
        if use_remote:
            self.db = repository_db
            self.fs = repository_fs
        else:
            self.db = db  # This is to make mongoaccesser work
            self.fs = fs  # This is to make mongoaccesser work
        for fdict in user_data_fields:
            key = fdict["name"]
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, fdict["default"])
        self.password_hash = user_dict["password_hash"]
        print("leaving __init__ in User")

    def create_new_alt_key(self, username=None):
        update_dict = {"alt_id": str(ObjectId())}
        if username is None:
            username = self.username
        self.db["user_collection"].update_one({"username": username},
                                         {'$set': update_dict})
        return update_dict

    @property
    def is_authenticated(self):
        # This really should always return True
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_active(self):
        return self.status == "active"

    def set_user_timezone_offset(self, tzoffset):
        self.db["user_collection"].update_one({"username": self.username},
                                         {'$set': {"tzoffset": tzoffset}})
        return

    def set_last_login(self):
        current_time = datetime.datetime.utcnow()
        self.db["user_collection"].update_one({"username": self.username},
                                         {'$set': {"last_login": current_time}})
        return

    def dt_to_datestring(self, dt):
        return dt.strftime("%b %d, %Y, %H:%M")

    def dt_to_sortstring(self, dt):
        return dt.strftime("%Y%m%d%H%M%S")

    def process_metadata(self, mdata):
        if "datetime" in mdata:
            datestring = self.get_timestrings(mdata["datetime"])[0]
        else:
            datestring = ""
        additional_mdata = copy.copy(mdata)
        standard_mdata = ["datetime", "tags", "notes", "_id", ID_FIELD, "name"]
        for field in standard_mdata:
            if field in additional_mdata:
                del additional_mdata[field]
        if "updated" in additional_mdata:
            additional_mdata["updated"] = self.get_timestrings(additional_mdata["updated"])[0]
        if "collection_name" in additional_mdata:
            additional_mdata["collection_name"] = self.get_short_collection_name(
                additional_mdata["collection_name"])
        return {"datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"],
                "additional_mdata": additional_mdata}

    def get_timestrings(self, dt):
        localtime = self.localize_time(dt)
        datestring = self.dt_to_datestring(localtime)
        datestring_for_sort = self.dt_to_sortstring(dt)
        return datestring, datestring_for_sort

    def localize_time(self, dt):
        tzoffset = self.get_tzoffset()
        return dt - datetime.timedelta(hours=tzoffset)

    @staticmethod
    def get_user_by_username(username, use_remote=False):
        print("in get_user_by_username")
        if use_remote:
            result = repository_db.user_collection.find_one({"username": username})
        else:
            result = db.user_collection.find_one({"username": username})
        print("got get user result " + str("result"))
        if result is None:
            return None
        else:
            if USE_ALT_IDS and "alt_id" not in result:
                create_new_alt_id(username)
            print("about to resturn from get_user_by_username")
            return User(result, use_remote)

    def get_theme(self):
        return self.user_data_dict["theme"]

    def get_preferred_dark_theme(self):
        return self.user_data_dict["preferred_dark_theme"]

    def get_preferred_light_theme(self):
        return self.user_data_dict["preferred_light_theme"]

    def get_preferred_interface(self):
        return self.user_data_dict["preferred_interface"]

    def get_library_style(self):
        return self.user_data_dict["library_style"]

    def get_tzoffset(self):
        return self.user_data_dict["tzoffset"]

    @property
    def user_data_dict(self):
        result = OrderedDict()
        for fdict in user_data_fields:
            key = fdict["name"]
            if hasattr(self, key):
                result[key] = getattr(self, key)
            else:
                result[key] = fdict["default"]
        return result

    def get_true_id(self):
        return str(self.db.user_collection.find_one({"username": self.username})["_id"])

    def update_account(self, data_dict):
        update_dict = {}
        if "password" in data_dict:
            if len(data_dict["password"]) < 4:
                return {"success": False, "message": "Passwords must be at least 4 characters."}
            update_dict["password_hash"] = generate_password_hash(data_dict["password"])
        for (key, val) in data_dict.items():
            if "password" not in key:
                update_dict[key] = val
        try:
            self.db["user_collection"].update_one({"username": self.username},
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
        return str(self.db.user_collection.find_one({"username": self.username})[ID_FIELD])

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_user_dict(self):
        return {"username": self.username, "password_hash": self.password_hash}

    @property
    def my_record(self):
        return self.db.user_collection.find_one({"username": self.username})


def load_remote_user(userid, the_db):
    # This expects that userid will be a string
    # If it's an ObjectId, rather than a string, I get an error likely having to do with login_manager
    result = the_db.user_collection.find_one({"_id": ObjectId(userid)})

    if result is None:
        return None
    else:
        return User(result)


# noinspection PyMethodOverriding,PyMissingConstructor
class RemoteUser(User):
    def __init__(self, user_dict, repository_db):
        self.username = ""  # This is just to be make introspection happy
        for key in user_data_fields:
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, "")
        self.password_hash = user_dict["password_hash"]
        self.repository_db = repository_db

    @staticmethod
    def get_user_by_username(username, repository_db):
        result = repository_db.user_collection.find_one({"username": username})
        if result is None:
            return None
        else:
            return RemoteUser(result, repository_db)

    @property
    def tile_module_names_with_metadata(self):
        if self.tile_collection_name not in self.repository_db.list_collection_names():
            self.repository_db.create_collection(self.tile_collection_name)
            return []
        my_tile_names = []
        for doc in self.repository_db[self.tile_collection_name].find(projection=["tile_module_name", "metadata"]):
            if "metadata" in doc:
                my_tile_names.append([doc["tile_module_name"], doc["metadata"]])
            else:
                my_tile_names.append([doc["tile_module_name"], None])
        return sorted(my_tile_names, key=self.sort_data_list_key)

    def get_tile_module(self, tile_module_name):
        tile_dict = self.repository_db[self.tile_collection_name].find_one({"tile_module_name": tile_module_name})
        return tile_dict["tile_module"]
