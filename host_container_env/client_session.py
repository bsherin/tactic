import time

from redis_tools import RedisManager, redis_client
from aws_task_helpers import get_ssm_parameter

CLIENT_SESSION_TIMEOUT_SECS = float(get_ssm_parameter("CLIENT_SESSION_TIMEOUT_SECS", "3600"))

class ClientSessionRegistry(RedisManager):
    prefix = "client_session"

    def __init__(self, worker):
        super().__init__(redis_client)
        self.worker = worker

    def initiate_session(self, global_id):
        self.register_client_interaction(global_id)

    def set_session_info(self, global_id, hash_key, value):
        self.set_hash_entry(global_id, hash_key, value)

    def get_session_info(self, global_id, hash_key):
        return self.get_hash_entry(global_id, hash_key)

    def register_client_interaction(self, global_id):
        self.set_session_info(global_id, "last_interaction", str(time.time()))

    def get_last_interaction(self, global_id):
        last_interaction_str = self.get_session_info(global_id, "last_interaction")
        if last_interaction_str:
            return float(last_interaction_str)
        return None

    def get_open_sessions(self):
        return self.scan_keys_with_prefix("*", tail_only=True)

    @staticmethod
    def emit_end_session(global_id):
        socketio.emit("endSession", {}, namespace='/main', room=global_id)

    def sweep_sessions(self):
        now = time.time()
        global_ids = self.get_open_sessions()
        for global_id in global_ids:
            last_interaction = self.get_last_interaction(global_id)
            if not last_interaction:
                self.register_client_interaction(global_id)
                continue
            if (now - last_interaction) > CLIENT_SESSION_TIMEOUT_SECS:
                print(f"ending client session {global_id}")
                self.worker.end_client_session(global_id)

    def registry_heartbeat(self):
        self.sweep_sessions()