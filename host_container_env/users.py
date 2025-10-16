
# This module contains the User class machinery required by flask-login

import re
import os
import sys
import copy
import datetime
import uuid
from collections import OrderedDict
from flask import jsonify, request, url_for
from flask_login import UserMixin

from tactic_app import login_manager, app, db, fs, repository_db, repository_fs, socketio
from communication_utils import make_jsonizable_and_compress
from bson.objectid import ObjectId
from exception_mixin import generic_exception_handler
from werkzeug.security import generate_password_hash, check_password_hash
from mongo_accesser import MongoAccess
from list_accesser import ListAccess
from code_accesser import CodeAccess
from tile_accesser import TileAccess
from project_accesser import ProjectAccess
from collection_accesser import CollectionAccess
from metabook_accesser import MetabookAccess
from node_accesser import NodeAccess
from temp_data_accesser import TempDataAccess
from exception_mixin import ExceptionMixin
from user_fields import user_data_fields
from user_accesser import UserAccess
from across_accounts_accesser import AcrossAccountsAccess


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

def get_full_user_data_fields():
    static_folder = app.static_folder
    dark_path = os.path.join(static_folder, 'tactic_js/codemirror_dark_themes')
    light_path = os.path.join(static_folder, 'tactic_js/codemirror_light_themes')
    dark_files = sorted(os.listdir(dark_path))
    light_files = sorted(os.listdir(light_path))
    dark_themes = [re.sub(r'\.js$', '', f) for f in dark_files]
    light_themes = [re.sub(r'\.js$', '', f) for f in light_files]
    ufields = copy.deepcopy(user_data_fields)
    for field in ufields:
        if field["name"] == "preferred_dark_theme":
            field["options"] = dark_themes
        if field["name"] == "preferred_light_theme":
            field["options"] = light_themes
    return ufields

class User(UserMixin, MongoAccess, ListAccess, CodeAccess, TileAccess, TempDataAccess, UserAccess,
           ProjectAccess, CollectionAccess, MetabookAccess, NodeAccess,
           AcrossAccountsAccess):

    def __init__(self, user_dict):
        self.username = ""  # This is just to be make introspection happy
        self.db = db  # This is to make mongoaccesser work
        self.fs = fs  # This is to make mongoaccesser work
        self.repository_db = repository_db
        self.repository_fs = repository_fs  # This is to make mongoaccesser work
        for fdict in get_full_user_data_fields():
            key = fdict["name"]
            if key in user_dict:
                setattr(self, key, user_dict[key])
            else:
                setattr(self, key, fdict["default"])
        self.password_hash = user_dict["password_hash"]

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

    @property
    def pool_dir(self):
        return f"/pool/{self.username}"

    @property
    def has_pool(self):
        return os.path.exists(self.pool_dir)

    @staticmethod
    def make_name_unique(new_name, existing_names):
        counter = 1
        revised_name = new_name
        if new_name in existing_names:
            while new_name + str(counter) in existing_names:
                counter += 1
            revised_name = new_name + str(counter)
        return revised_name


    @staticmethod
    def send_import_report(result, library_id):
        if "content" in result:
            content = result["content"]
        else:
            content = ""
        new_resource_name = None

        title = result["title"]

        if result["success"] == "partial":
            content += "{} files not read successfully. ".format(len(result["failed_reads"].keys()))

        if "file_decoding_errors" in result and len(result["file_decoding_errors"].keys()) > 0:
            content += "<br><b>Decoding errors were enountered</b>"
            for filename, val in result["file_decoding_errors"].items():
                number_of_errors = str(len(val))
                content += "<br>{}: {} errors".format(filename, number_of_errors)
                for error_detail in val:
                    content += "<br>{}".format(error_detail)
        if "failed_reads" in result and len(result["failed_reads"].keys()) > 0:
            content += "<br><b>Reads failed for the following reasons:</b>"
            for filename, val in result["failed_reads"].items():
                content += "<br>File {}:</br>".format(filename)
                content += "{}".format(val)
        data = {"title": title, "content": content, "resource_name": new_resource_name, "success": result["success"]}
        socketio.emit("upload-response", data, namespace='/main', room=library_id)
        return

    def set_user_timezone_offset(self, tzoffset):
        self.update_user_doc(self.username, {"tzoffset": tzoffset})
        return

    def set_last_login(self):
        current_time = datetime.datetime.utcnow()
        self.update_user_doc(self.username, {"last_login": current_time})
        return

    def dt_to_datestring(self, dt):
        current_year = datetime.datetime.now().year
        if dt.year == current_year:
            return dt.strftime("%b %d, %H:%M")
        return dt.strftime("%b %d, %Y, %H:%M")

    def dt_to_sortstring(self, dt):
        return dt.strftime("%Y%m%d%H%M%S")

    def simple_process_metadata(self, mdata):
        if "datetime" in mdata:
            datestring = self.get_timestrings(mdata["datetime"])[0]
            del mdata["datetime"]
            mdata["created"] = datestring
        if "updated" in mdata:
            updatestring = self.get_timestrings(mdata["updated"])[0]
            del mdata["updated"]
            mdata["updated"] = updatestring
        return mdata

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
        return {"datestring": datestring, "tags": mdata["tags"], "notes": mdata["notes"],
                "additional_mdata": additional_mdata}

    def get_timestrings(self, dt):
        if not isinstance(dt, datetime.datetime):
            return "unknown", "unknown"
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
            if USE_ALT_IDS and "alt_id" not in result:
                create_new_alt_id(username)
            return User(result)

    @property
    def has_openapi_key(self):
        return len(self.user_data_dict["openai_api_key"]) > 4

    def get_openai_api_key(self):
        return self.user_data_dict["openai_api_key"]

    def get_theme(self):
        return self.user_data_dict["theme"]

    def get_preferred_dark_theme(self):
        return self.user_data_dict["preferred_dark_theme"]

    def get_preferred_light_theme(self):
        return self.user_data_dict["preferred_light_theme"]

    def get_preferred_interface(self):
        return self.user_data_dict["preferred_interface"]

    def get_tzoffset(self):
        return self.user_data_dict["tzoffset"]

    @property
    def user_data_dict(self):
        result = OrderedDict()
        for fdict in get_full_user_data_fields():
            key = fdict["name"]
            if hasattr(self, key):
                result[key] = getattr(self, key)
            else:
                result[key] = fdict["default"]
        return result

    def get_true_id(self):
        return self.get_true_user_is(self.username)

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
            self.update_user_doc(self.username, update_dict)
            if "password_hash" in update_dict:
                del update_dict["password_hash"]
            data = {"updates": update_dict}
            socketio.emit("user-settings-updated", data, namespace='/main', room=self.get_id())
            return {"success": True, "message": "Information successfully updated."}
        except:
            return {"success": False, "message": "Problem updating info."}

    def update_settings(self, data_dict):
        update_dict = {}
        for (key, val) in data_dict.items():
            update_dict[key] = val
        try:
            self.update_user_doc(self.username, update_dict)
            data = {"updates": update_dict}
            socketio.emit("user-settings-updated", data, namespace='/main', room=self.get_id())
            return {"success": True, "message": "Information successfully updated."}
        except:
            return {"success": False, "message": "Problem updating info."}

    @staticmethod
    def create_new(user_dict, seed_db=None):
        if seed_db is None:
            the_db = db
        else:
            the_db = seed_db

        username = user_dict["username"]
        if len(username) < 4:
            return {"success": False, "message": "Usernames must be at least 4 characters.", "username": username}
        if "." in username:
            return {"success": False, "message": "Usernames cannot contain a period.", "username": username}
        password = user_dict["password"]
        if len(password) < 4:
            return {"success": False, "message": "Passwords must be at least 4 characters.", "username": username}
        password_hash = generate_password_hash(password)
        return self.create_user(username, password_hash, "", alt_db=seed_db)

    # get_id is required by login_manager
    def get_id(self):
        # Note that I have to convert this to a string for login_manager to be happy.
        return self.get_user_id(self.username, ID_FIELD)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def my_record(self):
        return self.db.user_collection.find_one({"username": self.username})


