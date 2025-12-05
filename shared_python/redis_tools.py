
import redis
import json
import os
import re

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

print("getting redis client")

if use_ecs:
    from aws_helpers import get_ssm_parameter
    REDIS_HOST = get_ssm_parameter("REDIS_HOST")
    REDIS_PORT = int(get_ssm_parameter("REDIS_PORT", 6379))
    REDIS_USERNAME = get_ssm_parameter("REDIS_USERNAME")
    REDIS_PASSWORD = get_ssm_parameter("REDIS_PASSWORD")

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

def get_no_decode_redis_client():
    return redis.Redis(host=REDIS_HOST,
                       username=REDIS_USERNAME,
                       password=REDIS_PASSWORD,
                       port=REDIS_PORT, decode_responses=False, ssl=USE_SSL)

class RedisManager(object):
    prefix = ""

    def __init__(self, cli):
        self.cli = cli

    def expand_key(self, key, narrower=None):
        if narrower is None:
            full_key = f"{self.prefix}.{key}"
        else:
            full_key = f"{self.prefix}.{narrower}.{key}"
        return full_key

    def set(self, kay, value, narrower=None):
        full_key = self.expand_key(kay, narrower)
        if isinstance(value, dict):
            value = json.dumps(value)
        self.cli.set(full_key, value)

    def get(self, key, narrower=None):
        full_key = self.expand_key(key, narrower)
        value = self.cli.get(full_key)
        if value is not None:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    def delete(self, key, narrower=None):
        full_key = self.expand_key(key, narrower)
        self.cli.delete(full_key)

    def delete_all(self):
        # non-blocking deletion per key, works across slots
        pattern = f"{self.prefix}.*"
        for k in self.cli.scan_iter(match=pattern, count=5000):
            try:
                self.cli.unlink(k)  # fall back to delete if older Redis
            except Exception:
                self.cli.delete(k)

    def exists(self, key, narrower=None):
        full_key = self.expand_key(key, narrower)
        return self.cli.exists(full_key)

    def set_hash_dict(self, redis_key, value_dict, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        if isinstance(value_dict, dict):
            value_dict = {k: json.dumps(v) if isinstance(v, dict) else v for k, v in value_dict.items()}
        self.cli.hmset(full_redis_key, value_dict)

    def get_hash_dict(self, redis_key, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        value = self.cli.hgetall(full_redis_key)
        if value:
            # Convert values to JSON if they are strings
            for k, v in value.items():
                try:
                    value[k] = json.loads(v) if isinstance(v, str) else v
                except json.JSONDecodeError:
                    pass
            return value
        return {}

    def get_hash_entry(self, redis_key, hash_key, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        value = self.cli.hget(full_redis_key, hash_key)
        return value

    def set_hash_entry(self, redis_key, hash_key, value, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        if isinstance(value, dict):
            value = json.dumps(value)
        self.cli.hset(full_redis_key, hash_key, value)

    def get_hash_keys(self, redis_key, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        return self.cli.hkeys(full_redis_key)

    def delete_hash_entry(self, redis_key, hash_key, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        self.cli.hdel(full_redis_key, hash_key)

    def increment_hash_entry(self, redis_key, hash_key, increment=1, narrower=None):
        full_redis_key = self.expand_key(redis_key, narrower)
        return self.cli.hincrby(full_redis_key, hash_key, increment)

    def scan_keys(self, pattern, batch=1000, limit=None, tail_only=False):
        cursor = 0
        out = []
        while True:
            cursor, keys = self.cli.scan(cursor=cursor, match=pattern, count=batch)
            out.extend(keys)
            if limit is not None and len(out) >= limit:
                return out[:limit]
            if cursor == 0:
                break
        if tail_only:
            new_out = []
            for key in out:
                new_out.append(self.get_tail(key))
            out = new_out
        return out

    def get_keys_with_base(self, base, narrower=None, tail_only=False):
        full_redis_key = self.expand_key(base, narrower)
        self.scan_keys(f"{full_redis_key}.*", tail_only=tail_only)

    @staticmethod
    def get_tail(kstring):
        matches = re.findall(r"\.([^.]*)$", kstring)
        if not matches:
            return ""
        return matches[0]

    def scan_keys_with_prefix(self, pattern, narrower=None, tail_only=False):
        full_pattern = self.expand_key(pattern, narrower)
        return self.scan_keys(full_pattern, tail_only=tail_only)

    def delete_keys_with_prefix(self, pattern, narrower=None):
        all_keys = self.scan_keys_with_prefix(pattern, narrower)
        for k in all_keys:
            self.cli.delete(k)