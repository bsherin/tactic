
import redis
import json
import os
import re
from redis.exceptions import ConnectionError, TimeoutError
import threading
import time
from aws_helpers import get_ssm_parameter
from aws_detection import on_aws

print("getting redis client")

if on_aws:
    REDIS_HOST = get_ssm_parameter("REDIS_HOST")
    REDIS_PORT = int(get_ssm_parameter("REDIS_PORT", 6379))

    MESSAGE_QUEUE = message_queue=f"redis://{REDIS_HOST}:{REDIS_PORT}"
    USE_SSL = False
    print("got message queue:", MESSAGE_QUEUE)
else:
    REDIS_HOST = "tactic-redis"
    REDIS_PORT = 6379
    REDIS_USERNAME = None
    REDIS_PASSWORD = None
    USE_SSL = False
    MESSAGE_QUEUE = "redis://tactic-redis:6379"

def get_no_decode_redis_client():
    return ResilientRedisClient(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=False,
        ssl=USE_SSL,
    )

class ResilientRedisClient:
    """
    A thin proxy around redis.Redis that:
      - recreates the underlying client on connection errors
      - retries operations a few times before giving up
    """

    def __init__(
        self,
        host: str,
        port: int,
        decode_responses: bool = True,
        ssl: bool = False,
        max_retries: int = 3,
        reconnect_backoff: float = 0.5,
    ):
        self._host = host
        self._port = port
        self._decode_responses = decode_responses
        self._ssl = ssl
        self._max_retries = max_retries
        self._reconnect_backoff = reconnect_backoff
        self._lock = threading.Lock()
        self._client = self._create_client()

    def _create_client(self) -> redis.Redis:
        # You can tune these timeouts if you like
        return redis.Redis(
            host=self._host,
            port=self._port,
            decode_responses=self._decode_responses,
            ssl=self._ssl,
            socket_connect_timeout=2,   # fail fast on connect
            socket_timeout=5,           # fail reasonably fast on command
            health_check_interval=30,   # ping periodically
        )

    def _reset_client(self):
        with self._lock:
            try:
                # Close the old client's connections, if any
                self._client.close()
            except Exception:
                pass
            self._client = self._create_client()

    def __getattr__(self, name):
        """
        Proxy attribute access to the underlying redis.Redis instance.

        If the attribute is callable (most Redis commands), wrap it in
        a retry loop that refreshes the client on connection errors.
        """
        underlying_attr = getattr(self._client, name)

        if not callable(underlying_attr):
            # e.g. .connection_pool – just return it directly
            return underlying_attr

        def wrapped(*args, **kwargs):
            last_exc = None
            for attempt in range(self._max_retries):
                try:
                    # Always fetch the method from the *current* client
                    method = getattr(self._client, name)
                    return method(*args, **kwargs)
                except (ConnectionError, TimeoutError) as exc:
                    last_exc = exc
                    # Recreate the client and retry
                    self._reset_client()
                    time.sleep(self._reconnect_backoff * (attempt + 1))
            # If we exhausted retries, raise the last exception
            raise last_exc

        return wrapped


# This line replaces your old redis.Redis(...) global
redis_client = ResilientRedisClient(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    ssl=USE_SSL,
)

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
        return self.scan_keys(f"{full_redis_key}.*", tail_only=tail_only)

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