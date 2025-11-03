
import redis
import json
import os

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

print("getting redis client")

if use_ecs:
    from aws_helpers import get_sms_parameter
    REDIS_HOST = get_sms_parameter("REDIS_HOST")
    REDIS_PORT = int(get_sms_parameter("REDIS_PORT", 6379))
    REDIS_USERNAME = get_sms_parameter("REDIS_USERNAME")
    REDIS_PASSWORD = get_sms_parameter("REDIS_PASSWORD")

    MESSAGE_QUEUE = message_queue=f"rediss://{REDIS_USERNAME}:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}"
    USE_SSL = True
    print("got message queue:", MESSAGE_QUEUE)
else:
    REDIS_HOST = "tactic-redis"
    REDIS_PORT = 6379
    REDIS_USERNAME = None
    REDIS_PASSWORD = None
    USE_SSL = False
    MESSAGE_QUEUE = "redis://tactic-redis:6379"

redis_client = redis.Redis(host=REDIS_HOST,
                      username=REDIS_USERNAME,
                      password=REDIS_PASSWORD,
                      port=REDIS_PORT, decode_responses=True, ssl=USE_SSL)

class RedisManager:
    def __init__(self, cli):
        self.cli = cli
        self.delete_all()

    def set(self, username, key, value):
        full_key = self.expand_key(username, key)
        if isinstance(value, dict):
            value = json.dumps(value)
        self.cli.set(full_key, value)

    def get(self, username, key):
        full_key = self.expand_key(username, key)
        value = self.cli.get(full_key)
        if value is not None:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    def expand_key(self, username, key):
        full_key = f"{self.prefix}.{username}.{key}"
        return full_key

    def delete(self, username, key):
        full_key = self.expand_key(username, key)
        self.cli.delete(full_key)

    def delete_all(self):
        all_keys = self.scan_keys(f"{self.prefix}.*")
        if all_keys:
            self.cli.delete(*all_keys)

    def exists(self, username, key):
        full_key = self.expand_key(username, key)
        return self.cli.exists(full_key) > 0

    def set_hash_dict(self, username, redis_key, value_dict):
        full_redis_key = self.expand_key(username, redis_key)
        if isinstance(value_dict, dict):
            value_dict = {k: json.dumps(v) if isinstance(v, dict) else v for k, v in value_dict.items()}
        self.cli.hmset(full_redis_key, value_dict)

    def get_hash_entry(self, username, redis_key, hash_key):
        full_redis_key = self.expand_key(username, redis_key)
        value = self.cli.hget(full_redis_key, hash_key)
        return value

    def set_hash_entry(self, username, redis_key, hash_key, value):
        full_redis_key = self.expand_key(username, redis_key)
        if isinstance(value, dict):
            value = json.dumps(value)
        self.cli.hset(full_redis_key, hash_key, value)

    def get_hash_keys(self, username, redis_key):
        full_redis_key = self.expand_key(username, redis_key)
        return self.cli.hkeys(full_redis_key)

    def delete_hash_entry(self, username, redis_key, hash_key):
        full_redis_key = self.expand_key(username, redis_key)
        self.cli.hdel(full_redis_key, hash_key)

    def increment_hash_entry(self, username, redis_key, hash_key, increment=1):
        full_redis_key = self.expand_key(username, redis_key)
        return self.cli.hincrby(full_redis_key, hash_key, increment)

    def scan_keys(self, pattern, batch=1000, limit=None):
        cursor = 0
        out = []
        while True:
            cursor, keys = self.cli.scan(cursor=cursor, match=pattern, count=batch)
            out.extend(keys)
            if limit is not None and len(out) >= limit:
                return out[:limit]
            if cursor == 0:
                break
        return out

    def scan_keys_with_prefix(self, username, pattern):
        full_pattern = self.expand_key(username, pattern)
        return self.scan_keys(full_pattern)


class ReadyBlockManager(RedisManager):
    def __init__(self, client):
        self.prefix = "rb"
        RedisManager.__init__(self, client)

    def create_ready_block(self, rb_id, username, id_list, local_id=None):
        for the_id in id_list:
            self.set_ready_block_participant(username, rb_id, the_id, 1)
        self.set_local_id(username, rb_id, local_id)
        return

    def delete_ready_block_participant(self, username, rb_key, participant):
        self.set_ready_block_participant(username, rb_key, participant, 0)
        the_keys = self.get_ready_block_participants(username, rb_key)
        remaining_keys = 0
        for k in the_keys:
            if not k == "local_id":
                v = self.get_ready_block_participant(username, rb_key, participant)
                remaining_keys += int(v)

        if remaining_keys == 0:
            local_id = self.get_local_id(username, rb_key)
            self.delete_ready_block(username, rb_key)
            return the_keys, local_id
        else:
            return False, None

    def get_local_id(self, username, rb_key):
        return self.get_hash_entry(username, f"ready_blocks.{rb_key}", "local_id")

    def set_local_id(self, username, rb_key, local_id):
        self.set_hash_entry(username, f"ready_blocks.{rb_key}", "local_id", local_id)
        return

    def set_ready_block_participant(self, username, rb_key, participant, value):
        self.set_hash_entry(username, f"ready_blocks.{rb_key}", participant, value)
        return

    def get_ready_block_participants(self, username, rb_key):
        return self.get_hash_keys(username, f"ready_blocks.{rb_key}")

    def get_ready_block_participant(self, username, rb_key, participant):
        return self.get_hash_entry(username, f"ready_blocks.{rb_key}", participant)

    def delete_ready_block(self, username, rb_key):
        self.cli.delete(username, f"ready_blocks.{rb_key}")
        return

ready_block_manager = ReadyBlockManager(redis_client)