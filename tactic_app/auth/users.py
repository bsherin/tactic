__author__ = 'bls910'

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

    @staticmethod
    def create_new(user_dict):
        username = user_dict["username"]
        password = user_dict["password"]
        password_hash = generate_password_hash(password)
        new_user_dict = {"username": username, "password_hash": password_hash}
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