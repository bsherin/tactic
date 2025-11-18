import io, json, time, uuid
from typing import Any, Optional
import pickle
import os
import re
import datetime
import msgpack
import boto3
import redis
from redis_tools import get_no_decode_redis_client
from aws_helpers import get_s3_client, get_ssm_parameter

SMALL_LIMIT = 256_000  # bytes

S3_BUCKET = get_ssm_parameter("SESSION_BUCKET")
SQS_QUEUE_URL = get_ssm_parameter("SQS_QUEUE_URL")
AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
on_aws = os.getenv("RUNNING_ON_AWS","false").lower() == "true"

class SessionAccessor(object):
    def __init__(self, ss, sid):
        object.__setattr__(self, "ss", ss)
        object.__setattr__(self, "sid", sid)

    def __getattr__(self, name):
        return self.get_val(name)

    def __setattr__(self, name, value):
        if name in {"ss", "sid"}:
            object.__setattr__(self, name, value)
        else:
            self.set_val(name, value)

    def get_val(self, name):
        return self.ss.get_val(self.sid, name)

    def set_val(self, name, value):
        self.ss.put_val(self.sid, name, value)

    def end_session(self):
        self.ss.end_session(self.sid)


class SessionStoreS3:
    defaults = {}
    large_params = []
    def __init__(self, s3_prefix="sessions/"):
        self.r = get_no_decode_redis_client()
        self.s3 = get_s3_client()
        self.bucket = S3_BUCKET
        self.s3_prefix = s3_prefix.rstrip("/") + "/"

    # ----- util -----
    def _k(self, sid: str, suffix: str) -> str:
        # hash-tag everything on {sid} to keep ops in the same slot
        return f"sess.{{{sid}}}.{suffix}"

    def _s3keyHash(self, sid, base_name, name) -> str:
        return f"{self.s3_prefix}{sid}/{base_name}/{name}"

    def _s3key(self, sid, name) -> str:
        return f"{self.s3_prefix}{sid}/{name}"

    # ----- serialization helpers -----
    def _pack(self, obj):
        try:
            return msgpack.packb(obj, default=self._encode_ext, use_bin_type=True)
        except Exception:
            return json.dumps(obj, default=self._json_default, separators=(",", ":")).encode("utf-8")

    @staticmethod
    def _encode_ext(obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        if isinstance(obj, datetime.date):
            return obj.isoformat()
        raise TypeError(f"Type not serializable: {type(obj)}")

    @staticmethod
    def _json_default(obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        raise TypeError(f"Type not serializable: {type(obj)}")

    def _unpack(self, b: bytes):
        try:
            obj = msgpack.unpackb(b, raw=False)
            return self._decode_datetimes(obj)
        except Exception:
            obj = json.loads(b.decode("utf-8"))
            return self._decode_datetimes(obj)

    def _decode_datetimes(self, obj):
        """Recursively walk objects and convert ISO strings to datetime"""
        if isinstance(obj, dict):
            return {k: self._decode_datetimes(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [self._decode_datetimes(v) for v in obj]
        if isinstance(obj, str):
            # detect ISO datetime
            try:
                return datetime.datetime.fromisoformat(obj)
            except ValueError:
                return obj
        return obj

    def is_large(self, key):
        for pattern in self.large_params:
            if re.match(pattern, key):
                return True
        return False

    # ----- public API -----

    def initialize_session(self, sid, sdict=None):
        for k, v in self.defaults.items():
            if type(v) == dict and "is_hash" in v and v["is_hash"]:
                if sdict is not None and k in sdict:
                    self.put_hash_all(self, k, sdict[k])
                else:
                    self.put_hash_all(self, k, v["default"])
            else:
                if sdict is not None and k in sdict:
                    self.put_val(sid, k, sdict[k])
                else:
                    self.put_val(sid, k, v["default"])

    def end_session(self, sid, batch=1000):
        pattern = f"sess.{{{sid}}}.*"
        cursor = 0
        while True:
            cursor, keys = self.r.scan(cursor=cursor, match=pattern, count=batch)
            if keys:
                self.r.delete(*keys)  # same hash tag, safe
            if cursor == 0:
                break
        prefix = f"{self.s3_prefix}{sid}/"
        self.delete_s3_prefix(prefix)

    def delete_s3_prefix(self, prefix):
        paginator = self.s3.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=self.bucket, Prefix=prefix):
            objs = page.get("Contents", [])
            if not objs:
                continue
            self.s3.delete_objects(
                Bucket=self.bucket,
                Delete={"Objects": [{"Key": o["Key"]} for o in objs]}
            )

    def end_all_sessions(self, batch=1000):
        pattern = f"sess.*"
        cursor = 0
        while True:
            cursor, keys = self.r.scan(cursor=cursor, match=pattern, count=batch)
            for k in keys:
                self.r.delete(k)
            if cursor == 0:
                break
        prefix = self.s3_prefix
        self.delete_s3_prefix(prefix)

    def put_val(self, sid: str, name: str, obj: Any):
        if self.is_large(name):
            self.put_large(sid, name, obj)
        else:
            self.put_small(sid, name, obj)

    def put_val_hash(self, sid: str, base_name: str, name: str, obj: Any):
        if self.is_large(f"{base_name}.{name}"):
            self.put_large_hash(sid, base_name, name, obj)
        else:
            self.put_small_hash(sid, base_name, name, obj)

    def get_val(self, sid: str, name: str) -> Any:
        if self.is_large(name):
            return self.get_large(sid, name)
        else:
            return self.get_small(sid, name)

    def get_val_hash(self, sid: str, base_name: str, name: str) -> Any:
        if self.is_large(f"{base_name}.{name}"):
            return self.get_large_hash(sid, base_name, name)
        else:
            return self.get_small_hash(sid, base_name, name)

    def get_hash_keys(self, sid, base_name):
        the_keys = self.r.hkeys(self._k(sid, f"v:{base_name}"))
        the_keys = [k.decode() for k in the_keys]
        return the_keys

    def get_hash_all(self, sid: str, base_name: str) -> bool:
        keys = self.get_hash_keys(sid, base_name)
        result = {}
        for k in keys:
            result[k] = self.get_val_hash(sid, base_name, k)
        return result

    def put_hash_all(self, sid: str, base_name: str, hdict: dict):
        keys = hdict.keys()
        result = {}
        for k in keys:
            self.put_val_hash(sid, base_name, k, hdict[k])
        return result

    def put_small(self, sid: str, name: str, obj: Any, ttl: int = 86_400):
        data = self._pack(obj)
        if len(data) > SMALL_LIMIT:
            print(f"*** got size too big for {name} with size {len(data)}")
            raise ValueError(f"value too large ({len(data)} bytes) for put_small; use put_large_*")
        self.r.set(self._k(sid, f"v:{name}"), data)
        self.r.expire(self._k(sid, f"v:{name}"), ttl)

    def put_small_hash(self, sid: str, base_name: str, key: str, obj: Any, ttl: int = 86_400):
        data = self._pack(obj)
        if len(data) > SMALL_LIMIT:
            raise ValueError(f"value too large ({len(data)} bytes) for put_small; use put_large_*")
        self.r.hset(self._k(sid, f"v:{base_name}"), key, data)
        self.r.expire(self._k(sid, f"v:{base_name}"), ttl)

    def get_small(self, sid: str, name: str) -> Optional[Any]:
        raw = self.r.get(self._k(sid, f"v:{name}"))
        return self._unpack(raw) if raw else None

    def get_small_hash(self, sid: str, base_name: str, name: str) -> Optional[Any]:
        raw = self.r.hget(self._k(sid, f"v:{base_name}"), name)
        return self._unpack(raw) if raw else None

    def get_small_hash_all(self, sid: str, base_name: str) -> dict:
        raw = self.r.hgetall(self._k(sid, f"v:{base_name}"))
        return {k.decode(): self._unpack(v) for k, v in raw.items()} if raw else {}

    def delete_small(self, sid, name):
        self.r.delete(self._k(sid, f"v:{name}"))

    def put_large_bytes(self, sid, key, payload, content_type="application/octet-stream", ttl=86_400):
        s3_key = self._s3key(sid, key)
        self.s3.put_object(Bucket=self.bucket, Key=s3_key, Body=payload, ContentType=content_type)

        meta = {"am_metadata": True, "key": s3_key, "ct": content_type, "size": len(payload), "ts": int(time.time())}
        redis_key = self._k(sid, f"v:{base_name}")
        self.r.hset(redis_key, key, json.dumps(meta))
        self.r.expire(redis_key, ttl)
        return key

    def put_large_bytes_hash(self, sid, base_name, key, payload, content_type="application/octet-stream", ttl=86_400):
        s3_key = self._s3keyHash(sid, base_name, key)
        self.s3.put_object(Bucket=self.bucket, Key=s3_key, Body=payload, ContentType=content_type)

        meta = {"am_metadata": True, "key": s3_key, "ct": content_type, "size": len(payload), "ts": int(time.time())}
        redis_key = self._k(sid, f"v:{base_name}")
        self.r.hset(redis_key, key, json.dumps(meta))
        self.r.expire(redis_key, ttl)
        return key

    def delete_large_bytes(self, sid, base_name, key):
        s3_key = self._s3keyHash(sid, base_name, key)
        self.s3.delete_object(Bucket=self.bucket, Key=s3_key)

    def put_large_hash(self, sid, base_name, key, obj):
        import pickle
        raw = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)
        return self.put_large_bytes_hash(sid, base_name, key, raw)

    def put_large(self, sid, key, obj):
        import pickle
        raw = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)
        return self.put_large_bytes(sid, key, raw)

    def get_large_bytes_hash(self, sid, base_name, key) -> bytes:
        s3_key = self._s3keyHash(sid, base_name, key)
        obj = self.s3.get_object(Bucket=self.bucket, Key=s3_key)
        return obj["Body"].read()

    def get_large_bytes(self, sid, key) -> bytes:
        s3_key = self._s3key(sid, key)
        obj = self.s3.get_object(Bucket=self.bucket, Key=s3_key)
        return obj["Body"].read()

    def get_large(self, sid, name):
        import pickle
        raw = self.get_large_bytes(sid, name)
        if raw is None:
            return None
        return pickle.loads(raw)

    def get_large_hash(self, sid, base_name, name):
        import pickle
        raw = self.get_large_bytes_hash(sid, base_name, name)
        if raw is None:
            return None
        return pickle.loads(raw)

    # # Convenience: numpy / pandas
    # import numpy as np
    # import pandas as pd
    # def put_array(self, sid: str, name: str, arr: np.ndarray, ttl: int = 86_400) -> str:
    #     buf = io.BytesIO()
    #     np.save(buf, arr, allow_pickle=False)
    #     return self.put_large_bytes(sid, name + ".npy", buf.getvalue(), "application/octet-stream", ttl)
    #
    # def get_array(self, sid: str, name: str) -> np.ndarray:
    #     raw = self.get_large_bytes(sid, name + ".npy")
    #     return np.load(io.BytesIO(raw), allow_pickle=False)
    #
    # def put_dataframe(self, sid: str, name: str, df: pd.DataFrame, ttl: int = 86_400) -> str:
    #     buf = io.BytesIO()
    #     df.to_parquet(buf, index=False)
    #     return self.put_large_bytes(sid, name + ".parquet", buf.getvalue(), "application/octet-stream", ttl)
    #
    # def get_dataframe(self, sid: str, name: str) -> pd.DataFrame:
    #     raw = self.get_large_bytes(sid, name + ".parquet")
    #     return pd.read_parquet(io.BytesIO(raw))
    #
    # # optimistic update on small docs (single-key safe in cluster)
    # def update_small(self, sid: str, name: str, mutator, ttl: int = 86_400, retries=12):
    #     k = self._k(sid, f"v:{name}")
    #     for _ in range(retries):
    #         with self.r.pipeline() as p:
    #             p.watch(k)
    #             cur = p.get(k)
    #             cur_obj = self._unpack(cur) if cur else {}
    #             new_obj = mutator(cur_obj)  # returns a new structure
    #             data = self._pack(new_obj)
    #             if len(data) > SMALL_LIMIT:
    #                 raise ValueError("update would exceed small value size; store large payloads in S3")
    #             p.multi()
    #             p.set(k, data)
    #             p.expire(k, ttl)
    #             try:
    #                 p.execute()
    #                 return True
    #             except redis.WatchError:
    #                 continue
    #     return False
    #
    # # list pointers (large items) for a session
    # def list_large(self, sid: str):
    #     hm = self.r.hgetall(self._k(sid, "ptrs"))
    #     return {k.decode(): json.loads(v.decode()) for k, v in hm.items()} if hm else {}