import sys
import time
import gevent
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


def watch_pool():
    observer = Observer()
    event_handler = WatchdogHandler()
    observer.schedule(event_handler, "/pool", recursive=True)
    observer.start()

    try:
        while True:
            gevent.sleep(1)  # Let gevent yield to other greenlets
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

class WatchdogHandler(FileSystemEventHandler):

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


