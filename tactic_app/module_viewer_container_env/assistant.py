import gevent
import signal
import sys, os
import time

from communication_utils import socketio
import exception_mixin
from exception_mixin import ExceptionMixin
from threading import Lock

from qworker import task_worthy, task_worthy_manual_submit

chat_thread = None
chat_thread_lock = Lock()

# noinspection PyUnusedLocal
class Assistant:
    def __init__(self):
        self.openai_api_key = None
        self.chat_client = None
        self.chat_assistant = None
        self.chat_thread = None
        self.current_run_id = None
        signal.signal(signal.SIGTERM, self.clean_up_chat)
        signal.signal(signal.SIGINT, self.clean_up_chat)
        return

    @task_worthy_manual_submit
    def has_openai_key(self, _, task_packet):
        def got_settings(result_dict):
            try:
                settings = result_dict["settings"]
                if "openai_api_key" in settings and len(settings["openai_api_key"]) > 4:
                    print(f"got settings {str(settings)}")
                    self.openai_api_key = settings["openai_api_key"]
                    final_result = True
                else:
                    final_result = False
                return_data = {"has_key": final_result, "success": True}
                self.submit_response(task_packet, return_data)
                return
            except Exception as ex2:
                res2 = self.get_traceback_exception_dict(ex2, "Error checking for api key")
                res2["has_key"] = False
                self.submit_response(task_packet, res2)
                print(str(res2))
                return res2

        try:
            self.ask_host("get_user_settings", {"user_id": self.user_id}, got_settings)
        except Exception as ex:
            res = self.get_traceback_exception_dict(ex, "Error checking for api key")
            res["has_key"] = False
            self.submit_response(task_packet, res)
            print(str(res["message"]))
            return res

    @task_worthy
    def post_prompt(self, data_dict, attempts=0):
        global chat_thread
        global chat_thread_lock
        try:
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
            run = self.chat_client.beta.threads.runs.create(
                thread_id=self.chat_thread.id,
                assistant_id=self.chat_assistant.id,
            )
            self.current_run_id = run.id
            with chat_thread_lock:
                chat_thread = socketio.start_background_task(target=self.wait_for_response)
            return {"success": True}

        except Exception as ex:
            res = self.get_traceback_exception_dict(ex, "Error posting to open ai")
            if attempts == 0:
                self.clean_up_chat()
                attempts += 1
                return self.post_prompt(data_dict, attempts)
            self.clean_up_chat()
            self.emit_to_client("chat_status", {"status": "idle"})
            return res

    def initialize_assistant(self):
        try:
            from openai import OpenAI
            if self.openai_api_key is None:
                return False
            print(f"openai_api_key is {self.openai_api_key}")
            self.chat_client = OpenAI(api_key=self.openai_api_key)
            file_list = []
            fnames = os.listdir("tactic_docs")
            for fname in fnames:
                if fname.endswith(".html"):
                    print(f"uploading {fname}")
                    new_file = self.chat_client.files.create(
                        file=open(f"tactic_docs/{fname}", "rb"),
                        purpose='assistants'
                    )
                    file_list.append(new_file)
            id_list = [file.id for file in file_list]
            instructions = "You are helpful assistant that helps with writing python code for the Tactic environment. You give answers in markdown format. "
            instructions += "The files uploaded via the retrieval tool contain information about this API. The user will want to ask you questions about this API. "
            instructions += "You can assume the user has access to an instance of TileBase via self. "
            instructions += "You can also assume that the user has access to the other objects Library, Tiles, Settings, Collection, and Pipes."
            self.chat_assistant = self.chat_client.beta.assistants.create(
                instructions=instructions,
                model="gpt-4-turbo-preview",
                tools=[{"type": "code_interpreter"}, {"type": "retrieval"}],
                file_ids=id_list
            )
            self.chat_thread = self.chat_client.beta.threads.create()
        except Exception as ex:
            res = self.get_traceback_exception_dict(ex, "Error initializing assistant")
            print(res["message"])
            return False
        return True

    def wait_for_response(self):
        sleep_times = [5, 5, 5, 3, 3, 3, 2]
        max_time = 180
        max_canceled_count = 15
        total_time = 0
        canceled = False
        last_status = None
        canceled_count = 0

        for n in range(500):
            if total_time > max_time and not canceled:
                self.cancel_run()
                canceled = True
            run = self.chat_client.beta.threads.runs.retrieve(
                thread_id=self.chat_thread.id,
                run_id=self.current_run_id
            )
            print("got run.status " + run.status)
            if run.status != last_status:
                last_status = run.status
                self.emit_to_client("chat_status", {"status": run.status})
            if run.status == "completed":
                self.retrieve_response()
                return
            elif run.status in ["in_progress", "queued", "cancelling"]:
                if n >= len(sleep_times):
                    st = 1
                else:
                    st = sleep_times[n]
                if run.status == "cancelling":
                    canceled_count += 1
                    if canceled_count >= max_canceled_count:
                        self.clean_up_chat()
                        self.emit_to_client("chat_status", {"status": "idle"})
                        return
                print(f"sleeping {st} {n}")
                gevent.sleep(st)
                total_time += st
            elif run.status == "failed":
                self.emit_to_client("chat_response", {"response": "response failed", "success": True})
                return
            else:
                return
        self.cancel_run()
        self.emit_to_client("chat_response", {"response": "response timed out", "success": True})
        return

    def retrieve_response(self):
        messages = self.chat_client.beta.threads.messages.list(
            thread_id=self.chat_thread.id
        )
        response = messages.data[0].content[0].text.value
        self.emit_to_client("chat_response", {"success": True, "response": response})
        return

    @task_worthy
    def cancel_run_task(self, _):
        self.cancel_run()
        return {"success": True}

    def cancel_run(self):
        try:
            self.chat_client.beta.threads.runs.cancel(
                thread_id=self.chat_thread.id,
                run_id=self.current_run_id)
        except Exception as ex:
            print("error canceling run")
            print(str(ex))
        return

    def clean_up_chat(self, signum=None, frame=None):
        print("Entering clean_up_chat")
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
        self.chat_client = None
        self.chat_assistant = None
        self.chat_thread = None
        self.current_run_id = None
        return

