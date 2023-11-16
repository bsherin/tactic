import traceback
import pymongo
from bson.objectid import ObjectId
from mongo_db_fs import get_dbs
import pika

db, fs, repository_db, repository_fs, use_remote_repository, use_remote_database = get_dbs()

pipeline = [
    {
        "$match": {
            "$and": [
                {"ns.coll": {"$not": {"$eq": "fs.chunks"}}},  # Exclude 'fs.chunks' collection
                {"ns.coll": {"$not": {"$eq": "fs.files"}}},  # Exclude 'fs.chunks' collection
                {"operationType": {"$in": ["insert", "update", "replace"]}},
                # Include insert, update, and replace operations
            ]
        }
    },
    {
        "$project": {
            "ns": True,
            "documentKey": True,  # Include the document's _id
            "operationType": True,  # Include the operation type (insert, update, replace)
        }
    }
]


def get_traceback_message(e, special_string=None):
    if special_string is None:
        template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
    else:
        template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    error_string = template.format(type(e).__name__, e.args)
    error_string += traceback.format_exc()
    return error_string


kind_dict = {
    "tiles": "tile",
    "projects": "project",
    "data_collections": "collection",
    "code": "code",
    "lists": "list"
}


class Handler:
    def __init__(self):
        self.my_id = "mongo_watcher"
        connection = self.get_pika_connection()
        self.channel = connection.channel()
        self._timers = {}
        self._modification_times = {}

    def get_pika_connection(self, retries=0):
        try:
            params = pika.ConnectionParameters(
                heartbeat=600,
                blocked_connection_timeout=300,
                host="megaplex",
                port=5672,
                virtual_host='/'
            )
            connection = pika.BlockingConnection(params)
        except Exception as exc:
            print("Couldn't connect to pika")
            if retries > max_pika_retries:
                print("giving up. No more processing of tasks by this qworker")
                print(self.get_traceback_message(exc, "Here's the error"))
                return None
            else:
                print("trying to connect to pika, sleeping ...")
                time.sleep(3)
                new_retries = retries + 1
                return self.get_pika_connection(retries=new_retries)
        return connection

    def post_mongo_event(self, event_type, _id, username, collection_name):
        self.ask_host("mongo_event", {
            "event_type": event_type,
            "_id": _id,
            "username": username,
            "collection": collection_name
        })
        return

    def handle_event(self, event):
        event_type = event["operationType"]
        username, rescol = event["ns"]["coll"].split(".")
        col = kind_dict["rescol"]
        obj_id = str(event["documentKey"]["_id"])
        self.post_mongo_event(event_type, obj_id, username, col)

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        self.post_task("host", msg_type, task_data, callback_func)
        return

    # noinspection PyUnusedLocal
    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, error_handler=None, special_reply_to=None):
        try:
            callback_id = None
            reply_to = None
            callback_type = "no_callback"
            new_packet = {"source": self.my_id,
                          "status": "presend",
                          "callback_type": callback_type,
                          "dest": dest_id,
                          "task_type": task_type,
                          "task_data": task_data,
                          "callback_id": callback_id,
                          "response_data": None,
                          "reply_to": reply_to,
                          "expiration": expiration}
            self.post_packet(dest_id, new_packet, reply_to, callback_id)
            result = {"success": True}

        except Exception as exc:
            special_string = "Error handling task for task type {} for my_id {}".format(task_type, self.my_id)
            error_string = self.get_traceback_message(exc, special_string)
            debug_log(error_string)
            result = {"success": False, "message": error_string}
        return result

    def get_traceback_message(self, e, special_string=None):
        if special_string is None:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(e).__name__, e.args)
        error_string += traceback.format_exc() + "</pre>"
        return error_string

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None, attempt=0):
        try:
            self.channel.basic_publish(exchange='',
                                       routing_key=dest_id,
                                       properties=pika.BasicProperties(
                                           reply_to=reply_to,
                                           correlation_id=callback_id,
                                           delivery_mode=1
                                       ),
                                       body=json.dumps(task_packet))
        except:
            if attempt == 0:
                connection = self.get_pika_connection()
                if connection is not None:
                    self.channel = connection.channel()
                    self.post_packet(dest_id, task_packet, reply_to, callback_id, attempt=1)
        return


handler = Handler()

try:
    with db.watch(pipeline) as stream:
        for change in stream:
            print(change)
            handler.handle_event(change)

except pymongo.errors.PyMongoError as ex:
    # The ChangeStream encountered an unrecoverable error or the
    # resume attempt failed to recreate the cursor.
    print(get_traceback_message(ex, "got an unrecoverable error"))
