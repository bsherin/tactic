import sys
import time
import pika
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


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
        connection = self.get_pika_connection()
        self.channel = connection.channel()

    def get_pika_connection(self):
        params = pika.ConnectionParameters(
            heartbeat=600,
            blocked_connection_timeout=300,
            host="megaplex",
            port=5672,
            virtual_host='/'
        )
        connection = pika.BlockingConnection(params)
        return connection

    def post_pool_event(self, event_type, path):
        self.ask_host("pool_event", {"event_type": event_type, "path": path})
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
            special_string = "Error handling callback for task type {} for my_id {}".format(task_type, self.my_id)
            error_string = self.handle_exception(ex, special_string)
            debug_log(error_string)
            result = {"success": False, "message": error_string}
        return result

    def post_packet(self, dest_id, task_packet, reply_to=None, callback_id=None):
        channel = self.channel
        channel.queue_declare(queue=dest_id, durable=False, exclusive=False)
        channel.basic_publish(exchange='',
                              routing_key=dest_id,
                              properties=pika.BasicProperties(
                                  reply_to=reply_to,
                                  correlation_id=callback_id,
                                  delivery_mode=1
                              ),
                              body=json.dumps(task_packet))
        return

    def on_modified(self, event):
        if event.is_directory:
            return None
        else:
            print(f"Modified file: {event.src_path}")

    def on_created(self, event):
        if event.is_directory:
            return None
        else:
            print(f"Created file: {event.src_path}")

    def on_deleted(self, event):
        if event.is_directory:
            return None
        else:
            print(f"Deleted file: {event.src_path}")


if __name__ == "__main__":
    watcher = Watcher("/pool")
    watcher.run()
