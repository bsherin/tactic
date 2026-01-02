from tactic_logging import log, setup_logging, bind_request, new_task_id

setup_logging("mongo_watcher")
log.info("starting", extra_flag=True)

try:
    import traceback
    import pymongo
    from mongo_db_fs import get_dbs
    import json
    import pika
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

    kind_dict = {
        "tiles": "tile",
        "projects": "project",
        "data_collections": "collection",
        "code": "code",
        "lists": "list",
        "metabooks": "metabook"
    }
except Exception:
    log.exception("*** fatal error during imports in mongo_watcher ***")
    log.critical("*** exiting mongo_watcher due to fatal error ***")
    raise

def get_traceback_message(e, special_string=None):
    if special_string is None:
        template = "An exception of type {0} occured. Arguments:\n{1!r}\n"
    else:
        template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
    error_string = template.format(type(e).__name__, e.args)
    error_string += traceback.format_exc()
    return error_string

class Handler:
    def __init__(self):
        self.my_id = "mongo_watcher"
        self.connection, self.channel = get_pika_connection_with_retries()
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
        task_id = new_task_id()
        task_type = "handle_mongo_event"
        with bind_request(task_id, "handling_event", task_type):
            username = None
            res_type = None
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
            except Exception:
                log.exception("Error in handle_event")
                return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        self.post_task("host", msg_type, task_data, callback_func)
        return

    # noinspection PyUnusedLocal
    def post_task(self, dest_id, task_type, task_data=None, callback_func=None,
                  callback_data=None, expiration=None, special_reply_to=None):
        new_id = new_task_id()
        with bind_request(new_id, "presend", task_type):
            try:
                log.debug("post_task")
                callback_id = None
                reply_to = None
                callback_type = "no_callback"
                new_packet = {"source": self.my_id,
                              "task_id": new_id,
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
                log.exception("Error posting task", task_type=task_type, my_id=self.my_id)
                special_string = "Error handling task for task type {} for my_id {}".format(task_type, self.my_id)
                error_string = self.get_traceback_message(exc, special_string)
                result = {"success": False, "message": error_string}
            return result

    @staticmethod
    def get_traceback_message(e, special_string=None):
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
                                           delivery_mode=2
                                       ),
                                       body=json.dumps(task_packet))
        except Exception:
            if attempt < 10:
                log.exception("Error in post_packet, retrying", dest_id=dest_id, attempt=attempt)
                connection, channel = get_pika_connection()
                if connection is not None:
                    self.channel = connection.channel()
                    self.post_packet(dest_id, task_packet, reply_to, callback_id, attempt + 1)
            else:
                log.exception("Error in post packet, giving up", dest_id=dest_id)
        return


handler = Handler()

try:
    with db.watch(pipeline) as stream:
        for change in stream:
            try:
                log.debug(change)
                handler.handle_event(change)
            except:
                log.exception("an error slipped through, skipping")

except pymongo.errors.PyMongoError:
    # The ChangeStream encountered an unrecoverable error or the
    # resume attempt failed to recreate the cursor.
    log.exception("unrecoverable error in mongo watcher")
except Exception:
    log.exception("fatal error in mongo watcher")
