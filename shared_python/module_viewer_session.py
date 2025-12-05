

from session_store_s3 import SessionStoreS3, SessionAccessor


INITIAL_LEFT_FRACTION = .69

ModuleViewerSessionAccessor = SessionAccessor


class ModuleViewerSessionStore(SessionStoreS3):
    defaults = {
        "username": {"default": None},
        "user_id": {"default": None},
        "module_name": {"default": None},
        "openai_api_key": {"default": None},
        "global_id": {"default": None}
    }

    large_params = []

