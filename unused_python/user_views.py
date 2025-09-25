import re
import os
import copy
from flask import jsonify, request
from flask_login import login_required, current_user
from tactic_app import app, db
import loaded_tile_management
from users import remove_user, User, create_new_alt_id, get_username_true_id
from communication_utils import make_python_object_jsonizable
from library_views import collection_manager
from pymongo import MongoClient
from bson.objectid import ObjectId
from mongo_accesser import bytes_to_string, res_types
import gridfs
from tactic_app import Database
import tactic_app


admin_user = User.get_user_by_username("admin")

LIBRARY_CHUNK_SIZE = int(int(os.environ.get("LIBRARY_CHUNK_SIZE")) / 2)

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

seed_db_name = "tactic_seed"

# noinspection PyMethodOverriding
class UserManager(ResourceManager):
    def add_rules(self):

        app.add_url_rule('/create_user_database/<userid>', "create_user_database",
                         login_required(self.create_user_database), methods=['get', "post"])



    def dump_user_db(self, user_id):
        username = get_username_true_id(userid)
        result = self.create_user_database(username)
        return result




