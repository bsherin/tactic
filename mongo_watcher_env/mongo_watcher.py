import traceback
import pymongo
from bson.objectid import ObjectId
from mongo_db_fs import get_dbs
import exception_mixin
import json
import pika
import time
from rabbit_manage import get_pika_connection_with_retries, get_pika_connection

db, fs, repository_db, repository_fs = get_dbs()

pipeline = [
    {
        "$match": {
            "$and": [
                {"ns.coll": {"$not": {"$eq": "fs.chunks"}}},  # Exclude 'fs.chunks' collection
                {"ns.coll": {"$not": {"$eq": "fs.files"}}},  # Exclude 'fs.files' collection
                {"operationType": {"$in": ["insert", "update", "delete"]}},
            ]
        }
    },
    {
        "$project": {
            "ns": True,
            "documentKey": True,  # Include the document's _id
            "operationType": True,  # Include the operation type
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
    "lists": "list",
    "metabooks": "metabook"
}


class Handler:
    def __init__(self):
        self.my_id = "mongo_watcher"
        self.connection, self.channel = get_pika_connection_with_retries(0)
        self._timers = {}
        self._modification_times = {}

    def post_mongo_event(self, event_type, _id, username, res_type):
        self.ask_host("mongo_event", {
            "event_type": event_type,
            "id": _id,
            "username": username,
            "res_type": res_type
        })
        return

    def handle_event(self, event):
        try:
            event_type = event["operationType"]
            col = event["ns"]["coll"]
            if "." in col:
                username, rescol = event["ns"]["coll"].split(".")
                res_type = kind_dict[rescol]
            else:
                if col == "user_collection":
                    username = ""
                    res_type = "user"
            obj_id = str(event["documentKey"]["_id"])
            self.post_mongo_event(event_type, obj_id, username, res_type)
        except Exception as exc:
            error_string = self.get_traceback_message(exc, "Got an error in handle_event")
            print(error_string)
            return

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
            print(error_string)
            result = {"success": False, "message": error_string}
        return result

    def get_traceback_message(self, e, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(e).__name__, e.args)
        error_string += traceback.format_exc()
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
        except Exception as exc:
            print(self.get_traceback_message(exc, f"Exeption in post_packet with attempt={attempt}"))
            if attempt < 10:
                connection, channel = get_pika_connection()
                if connection is not None:
                    print("trying again")
                    self.channel = connection.channel()
                    self.post_packet(dest_id, task_packet, reply_to, callback_id, attempt + 1)
            else:
                print("post failed and attempt wasn't 0")
        return


handler = Handler()

try:
    with db.watch(pipeline) as stream:
        for change in stream:
            try:
                print(change)
                handler.handle_event(change)
            except:
                print("an error slipped through, skipping")

except pymongo.errors.PyMongoError as ex:
    # The ChangeStream encountered an unrecoverable error or the
    # resume attempt failed to recreate the cursor.
    print(get_traceback_message(ex, "got an unrecoverable error"))
