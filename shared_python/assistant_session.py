

from session_store_s3 import SessionStoreS3, SessionAccessor


INITIAL_LEFT_FRACTION = .69

AssistantSessionAccessor = SessionAccessor


class AssistantSession(SessionStoreS3):
    defaults = {
        "username": {"default": None},
        "user_id": {"default": None},
        "chat_thread_id": {"default": None},
        "openai_api_key": {"default": None},
        "global_id": {"default": None},
        "stream_counter": {"default": 0},
    }

    large_params = []

