
# This module creates many of the objects that
# need to be imported by other modules.


import sys
import os
import pymongo
from pymongo import MongoClient
from users import User
import ssl

import datetime

rpath = "bsherinremtiles"


def create_initial_metadata():
    mdata = {"datetime": datetime.datetime.utcnow(),
             "tags": "",
             "notes": ""}
    return mdata

repository_user = User.get_user_by_username("bsherin")


def add_tile_module(full_filename):
    user_obj = repository_user
    filename, file_extension = os.path.splitext(full_filename)
    mdata = None
    if file_extension == ".py":
        if db[user_obj.tile_collection_name].find_one({"tile_module_name": filename}) is not None:
            print "module name exists, deleting the old one"
            mdata = grab_metadata(filename)
            delete_tile_module(filename)
        with open(rpath + "/" + full_filename) as f:
            the_module = f.read()
        if mdata is None:
            mdata = create_initial_metadata()
        else:
            mdata["datetime"] = datetime.datetime.utcnow()
        data_dict = {"tile_module_name": filename, "tile_module": the_module, "metadata": mdata}
        db[user_obj.tile_collection_name].insert_one(data_dict)


def delete_tile_module(tile_module_name):
    user_obj = repository_user
    db[user_obj.tile_collection_name].delete_one({"tile_module_name": tile_module_name})
    return


def grab_metadata(res_name):
    doc = db[repository_user.tile_collection_name].find_one({"tile_module_name": res_name})
    if "metadata" in doc:
        mdata = doc["metadata"]
    else:
        mdata = None
    return mdata

try:
    print "getting client"
    use_ssl = os.environ.get("USE_SSL")
    CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE"))
    STEP_SIZE = int(os.environ.get("STEP_SIZE"))
    if ("USE_LOCAL_SERVER" in os.environ) and (os.environ.get("USE_LOCAL_SERVER") == "True"):
        client = MongoClient("localhost", serverSelectionTimeoutMS=10)
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        db = client.tacticdb

    else:
        client = MongoClient(host=os.environ.get("MONGOLAB_URI"))
        # force connection on a request as the
        # connect=True parameter of MongoClient seems
        # to be useless here
        client.server_info()
        db = client.heroku_4ncbq1zd
    for filename in os.listdir(rpath):
        print "adding tile module " + filename
        add_tile_module(filename)

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()

