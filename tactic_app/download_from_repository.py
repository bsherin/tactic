
# This module creates many of the objects that
# need to be imported by other modules.


import sys
import os
import pymongo
from pymongo import MongoClient
from users import User
import os

import datetime

rpath = "/repository_tiles"
dpath = "/downloads"

repository_user = User.get_user_by_username("repository")

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

    tm_list = repository_user.tile_module_names_with_metadata

    for tm in tm_list:
        module_code = repository_user.get_tile_module(tm[0])
        with open(os.getcwd() + dpath + "/" + tm[0] + ".py", 'w') as f:
            f.write(module_code)

except pymongo.errors.PyMongoError as err:
    print("There's a problem with the PyMongo database. ", err)
    sys.exit()

