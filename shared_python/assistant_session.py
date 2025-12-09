

from session_store_s3 import SessionStoreS3, SessionAccessor


INITIAL_LEFT_FRACTION = .69

AssistantSessionAccessor = SessionAccessor


class AssistantSessionStore(SessionStoreS3):
    defaults = {
        "username": {"default": None},
        "user_id": {"default": None},
        "openai_api_key": {"default": None},
        "global_id": {"default": None},
        "thread_id": {"default": None},
        "assistant_id": {"default": None},
        "stream_counter": {"default": 0},
        "cancel_stream": {"default": False},
    }

    large_params = []

