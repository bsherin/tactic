from pymongo import MongoClient
import gridfs
from aws_helpers import get_ssm_parameter
from aws_detection import am_fargate
from tactic_logging import log

db_name = get_ssm_parameter("DB_NAME", "tacticdb")

if am_fargate():
    mongo_uri = get_ssm_parameter("MONGO_URI_FARGATE")
else:
    mongo_uri = get_ssm_parameter("MONGO_URI", "tactic-mongo")

log.debug("got mongo_uri", mongo_uri=mongo_uri)

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
    log.debug("getting mongo client", mongo_uri=mongo_uri)
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=30000)
    log.debug("got mongo client")
    # force connection on a request as the
    # connect=True parameter of MongoClient seems
    # to be useless here
    client.server_info()
    log.debug("got mongo server info")
    # noinspection PyUnresolvedReferences
    db = client[db_name]
    log.debug("got db")
    fs = gridfs.GridFS(db)
    log.debug("got fs")
    log.debug("Connected to MongoDB", mongo_uri=mongo_uri, database=db_name)
    database_type = "Local"
    if get_repo:
        repository_db = db
        repository_fs = fs
        repository_type = "Local"
    else:
        repository_db = None
        repository_fs = None
    return db, fs, repository_db, repository_fs
