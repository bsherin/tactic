from gevent import monkey; monkey.patch_all()
import gevent
import signal
import sys, os
import time
from flask import Flask
from communication_utils import socketio
import exception_mixin
from exception_mixin import ExceptionMixin
from threading import Lock
from openai import OpenAI, AssistantEventHandler

from qworker import task_worthy, task_worthy_manual_submit, QWorker

class StreamEventHandler(AssistantEventHandler):
    def __init__(self, assist, main_id):
        AssistantEventHandler.__init__(self)
        self.main_id = main_id
        self.assist = assist

    def on_text_created(self, text):
        self.assist.emit_to_client("chat_status", {"success": True, "status": "created", "main_id": self.main_id})

    def on_text_delta(self, delta, snapshot):
        text = delta.value
        if self.assist.cancel_stream:
            self.assist.emit_to_client("chat_status", {"success": True, "status": "canceled", "main_id": self.main_id})
            raise Exception("stream canceled")
        self.assist.emit_to_client("chat_delta", {
            "success": True,
            "counter": self.assist.stream_counter,
            "main_id": self.main_id,
            "delta": text})
        self.assist.stream_counter += 1

    def on_text_done(self, text):
        self.assist.emit_to_client("chat_status", {"success": True, "status": "completed", "main_id": self.main_id})


# noinspection PyUnusedLocal,PyMissingConstructor
class Assistant(QWorker, ExceptionMixin, AssistantEventHandler):
    def __init__(self):
        QWorker.__init__(self)
        AssistantEventHandler.__init__(self)
        self.openai_api_key = os.environ.get("OPENAI_API_KEY")
        self.chat_client = None
        self.chat_assistant = None
        self.chat_thread = None
        self.current_run_id = None
        self.stream_counter = 0
        signal.signal(signal.SIGTERM, self.clean_up_chat)
        signal.signal(signal.SIGINT, self.clean_up_chat)
        self.cancel_stream = False
        return

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_to_client(self, message, data):
        data["message"] = message
        self.ask_host("emit_to_client", data)

    def initialize_assistant(self):
        try:
            if self.openai_api_key is None:
                return False
            self.chat_client = OpenAI(api_key=self.openai_api_key)
            self.vector_store = self.chat_client.beta.vector_stores.create(name="Tactic Docs")
            file_streams = []
            fnames = os.listdir("tactic_docs")
            for fname in fnames:
                if fname.endswith(".html"):
                    stream = open(f"tactic_docs/{fname}", "rb")
                    file_streams.append(stream)
            file_batch = self.chat_client.beta.vector_stores.file_batches.upload_and_poll(
                vector_store_id=self.vector_store.id, files=file_streams
            )
            instructions = "You are helpful assistant that helps with writing python code for the Tactic environment. You give answers in markdown format. "
            instructions += "The files uploaded contain information about this API. You should use these files to answer questions about Tactic. "
            instructions += "You should also use the code interpreter tool to help the user write code. "
            instructions += "If the information you need isn't in the uploaded files, feel free to answer based on your other training data. "
            instructions += "You can assume the user has access to an instance of TileBase via self. "
            instructions += "You can also assume that the user has access to the other objects Library, Tiles, Settings, Collection, and Pipes. "
            instructions += "Please format any equations in LaTeX format. The equations should be surrounded by double dollar signs."
            instructions += "Please also format inline equations in LaTex format. The equations should be surrounded by single dollar signs."
            self.chat_assistant = self.chat_client.beta.assistants.create(
                name="Tactic Assistant",
                instructions=instructions,
                model="gpt-4.1",
                tools=[{"type": "code_interpreter"}, {"type": "file_search"}],
                tool_resources={
                    "file_search": {
                        "vector_store_ids": [self.vector_store.id]
                    },
                }
            )
            self.chat_thread = self.chat_client.beta.threads.create()
        except Exception as ex:
            res = self.get_traceback_exception_dict(ex, "Error initializing assistant")
            print(res["message"])
            return False
        return True

    @task_worthy
    def clear_thread(self, _):
        if self.chat_client is not None:
            try:
                if self.chat_thread is not None:
                    self.chat_client.beta.threads.delete(self.chat_thread.id)
                self.chat_thread = self.chat_client.beta.threads.create()
            except Exception as ex:
                error_string = self.extract_short_error_message(ex, "error deleting thread")
                print(error_string)
        return {"success": True}

    @task_worthy
    def get_past_messages(self, data_dict):
        print("in get past messages")
        try:
            if self.chat_client is None:
                print("no chat client")
                return {"success": True, "messages": []}
            messages = self.chat_client.beta.threads.messages.list(thread_id=self.chat_thread.id)
            mdict = messages.dict()
            result = []
            for k in range(len(mdict["data"]) - 1, -1, -1):
                txt = mdict["data"][k]["content"][0]["text"]["value"]
                if mdict["data"][k]["assistant_id"] is None:
                    kind = "user"
                else:
                    kind = "assistant"
                result.append({"kind": kind, "text": txt})
            return {"success": True, "messages": result}
        except Exception as ex:
            res = self.get_traceback_exception_dict(ex, "Error getting past messages")
            print(res["message"])
            return {"success": False, "message": res["message"], "messages": []}

    @task_worthy
    def post_prompt_stream(self, data_dict, attempts=0):
        try:
            print("in post prompt stream")
            if self.chat_client is None:
                client_exists = self.initialize_assistant()
                if not client_exists:
                    raise Exception("No chat client exists")

            prompt = data_dict["prompt"]
            self.chat_client.beta.threads.messages.create(
                thread_id=self.chat_thread.id,
                role="user",
                content=prompt
            )
            self.stream_counter = 0
            self.cancel_stream = False
            with self.chat_client.beta.threads.runs.stream(
                thread_id=self.chat_thread.id,
                assistant_id=self.chat_assistant.id,
                event_handler=StreamEventHandler(self, data_dict["main_id"]),
            ) as stream:
                stream.until_done()
            print("leaving post prompt stream")
            return {"success": True}

        except Exception as ex:
            print("got exception")
            res = self.get_traceback_exception_dict(ex, "Error posting to open ai")
            if attempts == 0:
                self.clean_up_chat()
                attempts += 1
                return self.post_prompt_stream(data_dict, attempts)
            self.clean_up_chat()
            self.emit_to_client("chat_status", {"status": "idle"})
            return res

    @task_worthy
    def cancel_run_task(self, _):
        print("got cancel run task")
        self.cancel_run()
        return {"success": True}

    def cancel_run(self):
        try:
            self.cancel_stream = True
        except Exception as ex:
            print("error canceling run")
            print(str(ex))
        return

    def clean_up_chat(self, signum=None, frame=None):
        if self.chat_client is not None:
            try:
                if self.chat_thread is not None:
                    self.chat_client.beta.threads.delete(self.chat_thread.id)
            except Exception as ex:
                error_string = self.extract_short_error_message(ex, "error deleting thread")
                print(error_string)
            try:
                if self.chat_assistant is not None:
                    self.chat_client.beta.assistants.delete(self.chat_assistant.id)
            except Exception as ex:
                error_string = self.extract_short_error_message(ex, "error deleting assistant")
                print(error_string)
        self.remove_old_tactic_assistants()  # shouldn't be nessesary, but just in case
        self.chat_client = None
        self.chat_assistant = None
        self.chat_thread = None
        self.current_run_id = None
        return

    def remove_old_tactic_assistants(self):
        if self.chat_client is None:
            return
        for asst in self.chat_client.beta.assistants.list():
            try:
                if it.name == "Tactic Assistant":
                    print("deleting assistant " + it.id)
                    client.beta.assistants.delete(it.id)
            except Exception as ex:
                print("got error deleting assistant")
                continue
        return

if __name__ == "__main__":
    app = Flask(__name__)
    exception_mixin.app = app
    print("entering main")
    mworker = Assistant()
    print("assistant is created, about to start my_id is " + str(mworker.my_id))
    mworker.start()
    print("mworker started, my_id is " + str(mworker.my_id))
    while True:
        time.sleep(1000)