import sys
import time
import pika
import json
import traceback
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

max_pika_retries = 100

class Watcher:

    def __init__(self, directory_to_watch):
        self.DIRECTORY_TO_WATCH = directory_to_watch
        self.event_handler = Handler()
        self.observer = Observer()


    def run(self):
        self.observer.schedule(self.event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print("Observer stopped")
        self.observer.join()


class Handler(FileSystemEventHandler):
    def __init__(self):
        FileSystemEventHandler.__init__(self)
        self.my_id = "pool_watcher"
        connection = self.get_pika_connection()
        self.channel = connection.channel()

    def get_pika_connection(self, retries = 0):
        try:
            params = pika.ConnectionParameters(
                heartbeat=600,
                blocked_connection_timeout=300,
                host="megaplex",
                port=5672,
                virtual_host='/'
            )
            connection = pika.BlockingConnection(params)
        except Exception as ex:
            print("Couldn't connect to pika")
            if retries > max_pika_retries:
                print("giving up. No more processing of tasks by this qworker")
                print(self.get_traceback_message(ex, "Here's the error"))
                return None
            else:
                print("trying to connect to pika, sleeping ...")
                time.sleep(3)
                new_retries = retries + 1
                return self.get_pika_connection(retries=new_retries)
        return connection

    def post_pool_event(self, event_type, path, is_directory, dest_path=None):
        self.ask_host("pool_event", {
            "event_type": event_type,
            "is_directory": is_directory,
            "path": path,
            "dest_path": dest_path
        })
        return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        self.post_task("host", msg_type, task_data, callback_func)
        return

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

        except Exception as ex:
            special_string = "Error handling task for task type {} for my_id {}".format(task_type, self.my_id)
            error_string = self.get_traceback_message(ex, special_string)
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

    def on_modified(self, event):
        src_path = self.append_slash(event.src_path, event.is_directory)
        print(f"Modified file: {src_path}")
        self.post_pool_event("modify", src_path, event.is_directory)

    def on_created(self, event):
        src_path = self.append_slash(event.src_path, event.is_directory)
        print(f"Created file: {src_path}")
        self.post_pool_event("create", src_path, event.is_directory)

    def on_deleted(self, event):
        src_path = self.append_slash(event.src_path, event.is_directory)
        print(f"Deleted file: {src_path}")
        self.post_pool_event("delete", src_path, event.is_directory)
        return

    def append_slash(self, path, is_directory):
        if is_directory and not path[-1] == "/":
            path = path + "/"
        return path

    def on_moved(self, event):
        src_path = self.append_slash(event.src_path, event.is_directory)
        dest_path = self.append_slash(event.dest_path, event.is_directory)
        print(f"Moved file: {src_path} to {dest_path}")
        self.post_pool_event("move", src_path, event.is_directory, dest_path)
        return


if __name__ == "__main__":
    watcher = Watcher("/pool")
    watcher.run()
