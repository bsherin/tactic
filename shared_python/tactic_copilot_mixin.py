import re
import json
import pika
import uuid
import threading
import time
from qworker import task_worthy
from openai import OpenAI
from openai import APIError, RateLimitError, APITimeoutError
from rabbit_manage import get_pika_connection_with_retries, declare_queue
from tactic_logging import log
from contextvars import copy_context
from copilot_context import (
    build_completion_input,
    extract_response_usage,
    limit_background_context,
    normalize_copilot_model,
    split_code_at_cursor,
)
from tactic_api_retrieval import (
    build_legacy_api_context,
    build_relevant_api_context,
)


class StreamWorker:
    def __init__(self, local_id, change_counter, cursor_counter, client, instructions,
                 completion_input, model_name, cm_unique_id, context_metrics=None):
        self.connection, self.channel = get_pika_connection_with_retries(0)
        self.client = client
        self.instructions = instructions
        self.completion_input = completion_input
        self.model_name = model_name
        self.cm_unique_id = cm_unique_id
        self.context_metrics = context_metrics or {}

        self.local_id = local_id
        self.change_counter = change_counter
        self.cursor_counter = cursor_counter
        self.my_id = str(uuid.uuid4())

    def event_loop(self):
        chunks = []
        started_at = time.monotonic()

        try:
            stream = self.client.responses.create(
                model=self.model_name,
                instructions=self.instructions,
                input=self.completion_input,
                reasoning={"effort": "none"},
                max_output_tokens=64,
                stream=True,
            )

            for event in stream:
                event_type = getattr(event, "type", None)
                if event_type == "response.output_text.delta":
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
                            "cursor_counter": self.cursor_counter,
                            "display_label": first_line,
                            "room": self.local_id,
                            "cmUniqueId": self.cm_unique_id,
                        },
                    )
                elif event_type == "response.completed":
                    response = getattr(event, "response", None)
                    usage = extract_response_usage(response)
                    log.info(
                        "OpenAI autocomplete completed",
                        requested_model=self.model_name,
                        response_model=getattr(response, "model", None),
                        latency_ms=round((time.monotonic() - started_at) * 1000),
                        **self.context_metrics,
                        **usage,
                    )

        except RateLimitError:
            log.exception("OpenAI rate limit for autocomplete", room=self.local_id)
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "rate_limit",
                    "message": "OpenAI rate limit exceeded for autocomplete. Please try again shortly.",
                    "change_counter": self.change_counter,
                    "cursor_counter": self.cursor_counter,
                    "room": self.local_id,
                    "cmUniqueId": self.cm_unique_id,
                },
            )
        except APITimeoutError:
            log.exception("OpenAI autocomplete timeout")
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "timeout",
                    "message": "Timed out while contacting OpenAI for autocomplete.",
                    "change_counter": self.change_counter,
                    "cursor_counter": self.cursor_counter,
                    "room": self.local_id,
                    "cmUniqueId": self.cm_unique_id,
                },
            )
        except APIError:
            log.exception("OpenAI API error during autocomplete")
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "api_error",
                    "message": "Error from OpenAI while generating autocomplete.",
                    "change_counter": self.change_counter,
                    "cursor_counter": self.cursor_counter,
                    "room": self.local_id,
                    "cmUniqueId": self.cm_unique_id,
                },
            )
        except Exception:
            log.exception("Unexpected error during autocomplete")
            self.emit_to_client(
                "AutocompleteError",
                {
                    "error": "unexpected",
                    "message": "Unexpected error while generating autocomplete.",
                    "change_counter": self.change_counter,
                    "cursor_counter": self.cursor_counter,
                    "room": self.local_id,
                    "cmUniqueId": self.cm_unique_id,
                },
            )
        finally:
            try:
                self.channel.close()
                self.connection.close()
            except Exception:
                pass

    def start(self):
        ctx = copy_context()
        thread = threading.Thread(target=lambda: ctx.run(self.event_loop), daemon=True)
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


class CopilotMixin:
    @staticmethod
    def _get_api_spec(api_dict, max_entries=50):
        result = build_legacy_api_context(api_dict, max_entries=max_entries)
        if not result and api_dict:
            log.warning("Could not build API spec for session")
        return result

    def get_ai_background_context(self, _data_dict):
        """Service-specific hook for tile or notebook context."""
        return ""

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
            return None
        return OpenAI(api_key=sess.openai_api_key)

    @task_worthy
    def update_ai_complete(self, data_dict):
        if not getattr(self, "_api_metadata_loaded", False):
            log.debug("No API catalog available, fetching...")
            api_response = self.post_and_wait("host", "get_api_dict_task", {})
            if not isinstance(api_response, dict):
                api_response = {}
            catalog = api_response.get("api_catalog")
            self.api_catalog = catalog if isinstance(catalog, dict) else {}
            self.api_spec = self._get_api_spec(api_response)
            self._api_metadata_loaded = True
            log.debug(
                "API catalog fetched successfully.",
                catalog_entries=len(self.api_catalog.get("entries", [])),
            )
        cm_unique_id = data_dict.get("cmUniqueId")
        local_id = data_dict.get("local_id")

        sess = self.get_session(local_id)
        if sess is None:
            log.error("no session found")
            return {"success": False, "message": "Session not found"}

        client = self._get_openai_client_for_session(sess)
        if client is None:
            log.error("no openai client found")
            return {"success": False, "message": "OpenAI API key not set"}

        code_str = data_dict["code_str"]
        cursor_position = data_dict["cursor_position"]
        mode = data_dict.get("mode", "python")
        change_counter = data_dict.get("change_counter")
        cursor_counter = data_dict.get("cursor_counter")

        prefix, suffix = split_code_at_cursor(code_str, cursor_position)
        background_context = limit_background_context(
            self.get_ai_background_context(data_dict)
        )
        completion_input = build_completion_input(
            prefix=prefix,
            suffix=suffix,
            mode=mode,
            background_context=background_context,
        )

        ai_context = data_dict.get("ai_context")
        context_kind = ai_context.get("kind") if isinstance(ai_context, dict) else "local"
        api_scope = getattr(self, "copilot_api_scope", None) or context_kind
        catalog_entries = self.api_catalog.get("entries", [])
        catalog_available = isinstance(catalog_entries, list) and bool(catalog_entries)
        if catalog_available:
            api_context = build_relevant_api_context(
                self.api_catalog,
                prefix=prefix,
                suffix=suffix,
                scope=api_scope,
                language=mode,
            )
            api_context_source = "catalog" if api_context else "none"
        elif str(mode or "").lower() in ("python", "py"):
            api_context = self.api_spec or ""
            api_context_source = "legacy" if api_context else "none"
        else:
            api_context = ""
            api_context_source = "none"
        api_reference_count = sum(
            1 for line in api_context.splitlines() if line.startswith("- ")
        )

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

        if api_context:
            instructions += (
                "\n\nYou are coding against the Tactic API. "
                "Use these references when relevant:\n"
                f"{api_context}\n"
            )


        model_name = normalize_copilot_model(data_dict.get("model_name"))

        try:
            stream_worker = StreamWorker(
                local_id=local_id,
                change_counter=change_counter,
                cursor_counter=cursor_counter,
                client=client,
                instructions=instructions,
                completion_input=completion_input,
                model_name=model_name,
                cm_unique_id=cm_unique_id,
                context_metrics={
                    "context_kind": context_kind or "local",
                    "background_context_chars": len(background_context),
                    "active_prefix_chars": len(prefix),
                    "active_suffix_chars": len(suffix),
                    "api_context_chars": len(api_context),
                    "api_reference_count": api_reference_count,
                    "api_context_source": api_context_source,
                },
            )
            stream_worker.start()
            return {"success": True}
        except Exception:
            log.exception("Unexpected error starting stream worker")
            return {
                "success": False,
                "message": "Unexpected error while starting autocomplete stream.",
            }
