import os
from pymongo import MongoClient
import gridfs
import exception_mixin

if "DB_NAME" in os.environ:
    db_name = os.environ.get("DB_NAME")
else:
    db_name = "tacticdb"

mongo_uri = os.environ.get("MONGO_URI")

repository_type = "not set"
database_type = "not set"

def get_dump_dbs(dump_db_name):
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
    client.drop_database(dump_db_name)
    dump_db = client[dump_db_name]
    dump_fs = gridfs.GridFS(dump_db)
    return dump_db, dump_fs

def get_dbs(get_repo=True):
    global repository_type
    global database_type
    print("getting mongo client with mongo_uri " + mongo_uri)
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
    print("got the client")
    # force connection on a request as the
    # connect=True parameter of MongoClient seems
    # to be useless here
    client.server_info()
    print("did server info")
    # noinspection PyUnresolvedReferences
    db = client[db_name]
    print("got db")
    fs = gridfs.GridFS(db)
    print("got fs")
    database_type = "Local"
    if get_repo:
        repository_db = db
        repository_fs = fs
        repository_type = "Local"
    else:
        repository_db = None
        repository_fs = None
    return db, fs, repository_db, repository_fs
