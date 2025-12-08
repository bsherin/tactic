import re
import logging
import json
import pika
import uuid
import threading
from qworker import task_worthy
from openai import OpenAI
from openai import APIError, RateLimitError, APITimeoutError
from rabbit_manage import get_pika_connection_with_retries, declare_queue


log = logging.getLogger(__name__)


class StreamWorker:
    """
    Runs the OpenAI streaming call in a background thread and forwards
    deltas to the host via RabbitMQ, which then emits them to the client.
    """
    def __init__(self, local_id, change_counter, client, instructions, context_code, model_name, cm_unique_id):
        self.connection, self.channel = get_pika_connection_with_retries(0)
        self.client = client
        self.instructions = instructions
        self.context_code = context_code
        self.model_name = model_name
        self.cm_unique_id = cm_unique_id

        self.local_id = local_id
        self.change_counter = change_counter
        self.my_id = str(uuid.uuid4())

    def event_loop(self):
        chunks = []

        try:
            # Create the streaming response *inside* this thread
            stream = self.client.responses.create(
                model=self.model_name,
                instructions=self.instructions,
                input=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": (
                                    "Complete the following code. "
                                    "The cursor is at the end of this snippet:\n\n"
                                    f"{self.context_code}"
                                ),
                            }
                        ],
                    }
                ],
                max_output_tokens=128,
                stream=True,
            )

            for event in stream:
                if getattr(event, "type", None) == "response.output_text.delta":
                    delta = getattr(event, "delta", "")
                    # delta may be a string or an object with .text
                    if hasattr(delta, "text"):
                        new_text = delta.text
                    else:
                        new_text = str(delta)

                    chunks.append(new_text)
                    current_suggestion = "".join(chunks).strip()
                    first_line = (
                        current_suggestion.splitlines()[0]
                        if "\n" in current_suggestion
                        else current_suggestion
                    )

                    self.emit_to_client(
                        "AutocompleteDelta",
                        {
                            "text": new_text,
                            "change_counter": self.change_counter,
                            "display_label": first_line,
                            "room": self.local_id,
                            "cmUniqueId": self.cm_unique_id,
                        },
                    )
                else:
                    print(f"StreamWorker: got some other kind of event {getattr(event, 'type', None)}")

        except RateLimitError as e:
            log.warning("OpenAI rate limit for autocomplete (stream worker): %s", e)
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "rate_limit",
                    "message": "OpenAI rate limit exceeded for autocomplete. Please try again shortly.",
                    "change_counter": self.change_counter,
                    "room": self.local_id,
                },
            )
        except APITimeoutError as e:
            log.warning("OpenAI autocomplete timeout (stream worker): %s", e)
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "timeout",
                    "message": "Timed out while contacting OpenAI for autocomplete.",
                    "change_counter": self.change_counter,
                    "room": self.local_id,
                },
            )
        except APIError as e:
            log.exception("OpenAI API error during autocomplete (stream worker): %s", e)
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "api_error",
                    "message": "Error from OpenAI while generating autocomplete.",
                    "change_counter": self.change_counter,
                    "room": self.local_id,
                },
            )
        except Exception as e:
            log.exception("Unexpected error during autocomplete (stream worker): %s", e)
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "unexpected",
                    "message": "Unexpected error while generating autocomplete.",
                    "change_counter": self.change_counter,
                    "room": self.local_id,
                },
            )
        finally:
            try:
                self.channel.close()
                self.connection.close()
            except Exception:
                pass

    def start(self):
        thread = threading.Thread(target=self.event_loop, daemon=True)
        thread.start()

    def emit_to_client(self, message, data):
        data["message"] = message
        self.post_packet("host", "emit_to_client", data)

    def post_packet(self, dest_id, task_type, task_data):
        task_packet = {
            "source": self.my_id,
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


class CopilotMixin(object):

    @staticmethod
    def extract_context(code_str, cursor_pos,
                        before_lines: int = 40,
                        after_lines: int = 10) -> str:
        lines = code_str.splitlines()
        running_len = 0
        line_idx = len(lines)

        for i, line in enumerate(lines):
            running_len += len(line) + 1  # +1 for '\n'
            if running_len > cursor_pos:
                line_idx = i
                break

        start_idx = max(0, line_idx - before_lines)
        end_idx = min(len(lines), line_idx + after_lines + 1)
        context_lines = lines[start_idx:end_idx]
        return "\n".join(context_lines)

    @staticmethod
    def clean_openai_completion(text: str) -> str:
        """
        Strip backticks / code fences; otherwise leave text unchanged.
        """
        text = re.sub(r'^\s*```[a-zA-Z0-9_+-]*\s*', '', text, flags=re.IGNORECASE | re.MULTILINE)
        text = re.sub(r'```+\s*$', '', text, flags=re.MULTILINE)
        return text

    @staticmethod
    def _get_openai_client_for_session(sess):
        if not getattr(sess, "openai_api_key", None):
            print("openai_api_key not set")
            return None
        return OpenAI(api_key=sess.openai_api_key)

    @task_worthy
    def update_ai_complete(self, data_dict):
        cm_unique_id = data_dict.get("cmUniqueId")
        local_id = data_dict.get("local_id")

        sess = self.get_session(local_id)
        if sess is None:
            print("no session found")
            return {"success": False, "message": "Session not found"}

        client = self._get_openai_client_for_session(sess)
        if client is None:
            print("no openai client found")
            return {"success": False, "message": "OpenAI API key not set"}

        code_str = data_dict["code_str"]
        cursor_position = data_dict["cursor_position"]
        mode = data_dict.get("mode", "python")
        change_counter = data_dict.get("change_counter")

        context_code = self.extract_context(code_str, cursor_position)

        instructions = (
            "You are a helpful coding assistant embedded in an IDE.\n"
            "Your job is to provide *only* the code that should appear "
            "immediately after the user's existing code.\n"
            f"The user is editing {mode} code.\n"
            "Requirements:\n"
            "- Respond with valid code that can be pasted directly into the editor.\n"
            "- Do NOT repeat or modify the user's existing code.\n"
            "- Do NOT include comments, explanations, or surrounding text.\n"
            "- Do NOT include markdown, backticks, quotes, or any other formatting.\n"
            "- Just return the raw code continuation.\n"
        )

        model_name = "gpt-5.1"  # or "gpt-4.1" / "gpt-4o" / "gpt-4o-mini"

        try:
            stream_worker = StreamWorker(
                local_id=local_id,
                change_counter=change_counter,
                client=client,
                instructions=instructions,
                context_code=context_code,
                model_name=model_name,
                cm_unique_id=cm_unique_id
            )
            stream_worker.start()
            return {"success": True}
        except Exception as e:
            log.exception("Unexpected error starting stream worker: %s", e)
            return {
                "success": False,
                "message": "Unexpected error while starting autocomplete stream.",
            }