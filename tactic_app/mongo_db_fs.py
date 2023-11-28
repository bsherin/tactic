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

def get_dbs(get_repo=True):
    global repository_type
    global database_type
    print("getting mongo client")
    if ("USE_REMOTE_DATABASE" in os.environ) and (os.environ.get("USE_REMOTE_DATABASE") == "True"):
        from ssh_pymongo import MongoSession
        use_remote_database = True
        remote_username = os.environ.get("REMOTE_USERNAME")
        remote_key_file = os.environ.get("REMOTE_KEY_FILE")

        print("getting session")
        session = MongoSession(
            host='tactictext.net',
            port=22,
            user=remote_username,
            key=remote_key_file,
            to_port=27017
        )
        print("connecting to session")
        db = session.connection[db_name]
        fs = gridfs.GridFS(db)
        print("*** got remote db " + str(db))
        database_type = "AWS"

    else:
        use_remote_database = False
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
        if ("USE_REMOTE_REPOSITORY" in os.environ) and (os.environ.get("USE_REMOTE_REPOSITORY") == "True"):
            try:
                print("*** using remote repository ***")
                use_remote_repository = True
                remote_username = os.environ.get("REMOTE_USERNAME")
                remote_password = os.environ.get("REMOTE_PASSWORD")

                from ssh_pymongo import MongoSession
                print("getting session")
                session = MongoSession(host="tactic.northwestern.edu", port=22, user=remote_username,
                                       password=remote_password,
                                       to_port=27017)
                print("connecting to session")
                repository_db = session.connection[db_name]
                repository_fs = gridfs.GridFS(repository_db)
                print("*** created repository_db " + str(repository_db))
                repository_type = "Northwestern"
            except Exception as ex:
                errmsg = exception_mixin.generic_exception_handler.extract_short_error_message(ex,
                                                                                              "Error connecting to remote repository")
                print(errmsg)
                print("*** failed to connect to remote repository, using local ***")
                use_remote_repository = False
                repository_db = db
                repository_fs = fs
        elif ("USE_REMOTE_REPOSITORY_KEY" in os.environ) and (os.environ.get("USE_REMOTE_REPOSITORY_KEY") == "True"):
            try:
                print("*** using remote repository key with file ***")
                use_remote_repository = True
                remote_username = os.environ.get("REMOTE_USERNAME")
                remote_key_file = os.environ.get("REMOTE_KEY_FILE")

                from ssh_pymongo import MongoSession
                print("getting session")
                session = MongoSession(
                    host='tactictext.net',
                    port=22,
                    user=remote_username,
                    key=remote_key_file,
                    to_port=27017
                )
                print("connecting to session")
                repository_db = session.connection[db_name]
                repository_fs = gridfs.GridFS(repository_db)
                print("*** created repository_db " + str(repository_db))
                repository_type = "AWS"
            except Exception as ex:
                errmsg = exception_mixin.generic_exception_handler.extract_short_error_message(ex,
                                                                                              "Error connecting to remote repository")
                print(errmsg)
                print("*** failed to connect to remote repository, using local ***")
                use_remote_repository = False
                repository_db = db
                repository_fs = fs
        else:
            use_remote_repository = False
            repository_db = db
            repository_fs = fs
            repository_type = "Local"
    else:
        use_remote_repository = False
        repository_db = None
        repository_fs = None
    return db, fs, repository_db, repository_fs, use_remote_repository, use_remote_database
