print("entering mongo_db_fs.py")
import os
from pymongo import MongoClient
import gridfs
import exception_mixin
from aws_helpers import get_ssm_parameter
from aws_detection import am_fargate

db_name = get_ssm_parameter("DB_NAME", "tacticdb")

if am_fargate() and os.getenv("MONGO_URI_FARGATE"):
    mongo_uri = get_ssm_parameter("MONGO_URI_FARGATE")
else:
    mongo_uri = get_ssm_parameter("MONGO_URI", "tactic-mongo")

print("*** mongo_uri is " + mongo_uri + " ***")

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
