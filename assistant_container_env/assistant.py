from tactic_logging import log, setup_logging

setup_logging("tactic_assistant")
log.debug("starting", extra_flag=True)

try:
    import threading
    import time
    import json
    from flask import Flask
    import exception_mixin
    from exception_mixin import ExceptionMixin
    from openai import OpenAI, AssistantEventHandler
    import openai
    from aws_helpers import get_ssm_parameter, resolve_task_identity
    from assistant_session import AssistantSessionAccessor, AssistantSessionStore
    from rabbit_manage import get_pika_connection_with_retries, declare_queue
    import pika

    log.debug("Running OpenAI SDK", version=openai.__version__, file=openai.__file__)

    from qworker import task_worthy, task_worthy_manual_submit, QWorker

except Exception:
    log.exception("*** fatal error during imports in assistant ***")
    log.critical("*** exiting assistant due to fatal error ***")
    raise

CLIENT_CACHE = {}

class StreamEventHandler(AssistantEventHandler):
    def __init__(self, assist, sid):
        AssistantEventHandler.__init__(self)
        self.local_id = sid
        self.assist = assist
        self.sess = self.assist.get_session(sid)
        self.connection, self.channel = get_pika_connection_with_retries(0)

    def on_text_created(self, text):
        self.emit_to_client("chat_status", {"success": True, "status": "created", "local_id": self.local_id})

    def on_text_delta(self, delta, snapshot):
        text = delta.value
        if self.sess.cancel_stream:
            self.emit_to_client("chat_status", {"success": True, "status": "canceled", "local_id": self.local_id})
            raise Exception("stream canceled")
        self.emit_to_client("chat_delta", {
            "success": True,
            "counter": self.sess.stream_counter,
            "local_id": self.local_id,
            "delta": text})
        self.sess.stream_counter += 1

    def on_text_done(self, text):
        self.emit_to_client("chat_status", {"success": True, "status": "completed", "local_id": self.local_id})

    def emit_to_client(self, message, data):
        data["message"] = message
        self.post_packet("host", "emit_to_client", data)

    def post_packet(self, dest_id, task_type, task_data):
        task_packet = {
            "source": self.assist.my_id,
            "status": "presend",
            "callback_type": "no_callback",
            "dest": dest_id,
            "task_type": task_type,
            "task_data": task_data,
            "callback_id": None,
            "response_data": None,
            "reply_to": None,
            "expiration": None,
        }
        declare_queue(self.channel, dest_id)
        self.channel.basic_publish(
            exchange="",
            routing_key=dest_id,
            properties=pika.BasicProperties(
                reply_to=None,
                correlation_id=None,
                delivery_mode=2,
            ),
            body=json.dumps(task_packet),
        )


# noinspection PyUnusedLocal,PyMissingConstructor
class Assistant(QWorker, ExceptionMixin, AssistantEventHandler):
    def __init__(self):
        id_prefix = get_ssm_parameter("MODULE_VIEWER_PREFIX", "module_viewer_")
        self.my_arn, self.my_id = resolve_task_identity(id_prefix)
        QWorker.__init__(self,  service_name="assistant", special_id=self.my_id)
        AssistantEventHandler.__init__(self)
        self.ss = AssistantSessionStore()
        return

    def get_session(self, sid):
        return AssistantSessionAccessor.create(self.ss, sid)

    @task_worthy_manual_submit
    def start_session(self, data_dict, task_packet):
        user_id = data_dict.get("user_id", None)
        sid = data_dict.get("local_id", None)
        def got_key(key_data):
            api_key = key_data.get("api_key", None)
            if api_key is None or api_key == "":
                result = {"success": False, "status": "failed", "message": "No OpenAI API key provided."}
                self.submit_response(task_packet, result)
                return
            session_data = {
                "user_id": user_id,
                "global_id": data_dict["global_id"],
                "openai_api_key": api_key,
            }
            self.ss.initialize_session(sid, session_data)
            self.submit_response(task_packet, {"success": True, "status": "created"})
            return
        try:
            if self.ss.session_exists(sid):
                return {"success": False, "status": "exists"}
            self.post_task("host", "get_openai_api_key", {"user_id": user_id}, got_key)

        except Exception as ex:
            log.exception("Error starting session")
            res = self.get_traceback_exception_dict(ex, "Error starting session")
            return {"success": False, "message": res["message"], "status": "failed"}

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_to_client(self, message, data):
        data["message"] = message
        self.ask_host("emit_to_client", data)

    def get_client(self, sid, create_if_missing=True):
        sess = self.get_session(sid)
        openai_api_key = sess.openai_api_key
        if openai_api_key in CLIENT_CACHE:
            return CLIENT_CACHE[openai_api_key]
        elif not create_if_missing:
            return None
        chat_client = OpenAI(api_key=openai_api_key)
        CLIENT_CACHE[openai_api_key] = chat_client
        return chat_client

    def get_assistant_id(self, sid):
        sess = self.get_session(sid)
        if sess.assistant_id is not None:
            return sess.assistant_id
        client = self.get_client(sid)
        if client is None:
            return None
        assistant_id = self.initialize_assistant(client)
        sess.assistant_id = assistant_id
        return assistant_id

    @staticmethod
    def initialize_assistant(chat_client):
        try:
            # print("Initializing assistant")
            # vector_store = chat_client.vector_stores.create(name="Tactic Docs")
            # print("Created vector store with ID: " + vector_store.id)
            # file_streams = []
            # fnames = os.listdir("tactic_docs")
            # print("Found files in tactic_docs: " + str(fnames))
            # for fname in fnames:
            #     if fname.endswith(".html"):
            #         stream = open(f"tactic_docs/{fname}", "rb")
            #         file_streams.append(stream)
            # file_batch = chat_client.vector_stores.file_batches.upload_and_poll(
            #     vector_store_id=vector_store.id, files=file_streams
            # )
            # print("Uploaded files to vector store, batch ID: " + file_batch.id)
            instructions = "You are helpful assistant that helps with writing python code for the Tactic environment. You give answers in markdown format. "
            instructions += "The files uploaded contain information about this API. You should use these files to answer questions about Tactic. "
            instructions += "You should also use the code interpreter tool to help the user write code. "
            instructions += "If the information you need isn't in the uploaded files, feel free to answer based on your other training data. "
            instructions += "You can assume the user has access to an instance of TileBase via self. "
            instructions += "You can also assume that the user has access to the other objects Library, Tiles, Settings, Collection, and Pipes. "
            instructions += "Please format any equations in LaTeX format. The equations should be surrounded by double dollar signs."
            instructions += "Please also format inline equations in LaTex format. The equations should be surrounded by single dollar signs."
            chat_assistant = chat_client.beta.assistants.create(
                name="Tactic Assistant",
                instructions=instructions,
                model="gpt-4.1",
                tools=[{"type": "code_interpreter"}],
                # tool_resources={
                #     "file_search": {
                #         "vector_store_ids": [vector_store.id]
                #     },
                # }
            )
            log.debug("Created assistant")
            return chat_assistant.id

        except Exception:
            log.exception("Error initializing assistant")
            return False

    def get_thread_id(self, sid):
        sess = self.get_session(sid)
        if sess.thread_id is not None:
            return sess.thread_id
        chat_client = self.get_client(sid)
        if chat_client is None:
            log.error("No chat client available, cannot create thread")
            return None
        chat_thread = chat_client.beta.threads.create()
        sess.thread_id = chat_thread.id
        return chat_thread.id

    @task_worthy
    def clear_thread(self, data):
        sid = data.get("local_id", None)
        sess = self.get_session(sid)
        if sess.thread_id is None:
            return {"success": True}
        chat_client = self.get_client(sid, create_if_missing=False)
        if chat_client is not None:
            try:
                chat_client.beta.threads.delete(sess.thread_id)
                sess.thread_id = None
            except Exception:
                log.exception("Error deleting thread")
        return {"success": True}

    @task_worthy
    def get_past_messages(self, data_dict):
        sid = data_dict.get("local_id", None)
        sess = self.get_session(sid)
        if sess.thread_id is None:
            return {"success": True, "messages": []}
        try:
            chat_client = self.get_client(sid)
            if chat_client is None:
                log.error("get client returned None")
                return {"success": True, "messages": []}
            messages = chat_client.beta.threads.messages.list(thread_id=sess.thread_id)
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
            log.exception("Error getting past messages")
            res = self.get_traceback_exception_dict(ex, "Error getting past messages")
            return {"success": False, "message": res["message"], "messages": []}

    def handle_chat_request(self, sid, chat_client, assistant_id, thread_id):
        t = threading.Thread(target=self.run_streaming_chat,
                             args=(sid, chat_client, assistant_id, thread_id))
        t.deamon = True
        t.start()
        return {"success": True, "status": "started"}

    def run_streaming_chat(self, sid, chat_client, assistant_id, thread_id):
        with chat_client.beta.threads.runs.stream(
                thread_id=thread_id,
                assistant_id=assistant_id,
                event_handler=StreamEventHandler(self, sid),
        ) as stream:
            stream.until_done()

    @task_worthy
    def post_prompt_stream(self, data_dict, attempts=0):
        sid = data_dict.get("local_id", None)
        sess = self.get_session(sid)
        try:
            chat_client = self.get_client(sid)
            assistant_id = self.get_assistant_id(sid)
            thread_id = self.get_thread_id(sid)
            prompt = data_dict["prompt"]
            chat_client.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=prompt
            )
            sess.stream_counter = 0
            sess.cancel_stream = False
            return self.handle_chat_request(sid, chat_client, assistant_id, thread_id)

        except Exception as ex:
            if attempts == 0:
                self.clean_up_chat(sid)
                attempts += 1
                log.warning("Retrying post prompt stream after error", attempt=attempts)
                return self.post_prompt_stream(data_dict, attempts)
            log.exception("Error posting prompt stream")
            self.clean_up_chat(sid)
            self.emit_to_client("chat_status", {"status": "idle", "room": sid})
            return res

    @task_worthy
    def cancel_run_task(self, data):
        sid = data.get("local_id", None)
        if sid is not None:
            sess = self.get_session(sid)
            sess.cancel_stream = True
        return {"success": True}

    @task_worthy
    def updated_global_ids(self, data):
        global_ids = data["global_ids"]
        open_sessions = self.ss.get_unique_sids()
        for sid in open_sessions:
            gid = self.ss.get_val(sid, "global_id")
            if gid not in global_ids:
                self.ss.end_session(sid)

    @task_worthy
    def end_session(self, data):
        sid = data.get("local_id", None)
        if sid is not None:
            if sess is not None:
                self.clean_up_chat(sid)
                self.ss.end_session(sid)
        return {"success": True}

    def clean_up_chat(self, sid, ignum=None, frame=None):
        sess = self.get_session(sid)
        try:
            if chat_client is not None:
                try:
                    if sess.thread_id is not None:
                        self.chat_client.beta.threads.delete(sess.thread_id)
                except Exception:
                    log.exception("Error deleting thread")
                try:
                    if self.chat_assistant is not None:
                        self.chat_client.beta.assistants.delete(sess.assistant_id)
                except Exception:
                    log.exception("Error deleting assistant")
        except Exception:
            log.exception("Error cleaning up chat")
        return

if __name__ == "__main__":
    try:
        app = Flask(__name__)
        exception_mixin.app = app
        log.debug("entering main")
        mworker = Assistant()
        log.info("assistant created", my_id=mworker.my_id)
        mworker.start()
        log.info("mworker started", my_id=mworker.my_id)
    except Exception:
        log.exception("*** fatal error starting assistant ***")
        log.critical("*** exiting due to fatal error ***")
        raise
    while True:
        time.sleep(1000)