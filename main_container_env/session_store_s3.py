# session_store.py
import io, json, time, uuid
from typing import Any, Optional
import pickle
import os
import msgpack
import boto3
import redis
import numpy as np
import pandas as pd
from redis_tools import get_no_decode_redis_client
from aws_helpers import get_s3_client, get_ssm_parameter

SMALL_LIMIT = 256_000  # bytes

S3_BUCKET = get_ssm_parameter("BUCKET")
SQS_QUEUE_URL = get_ssm_parameter("SQS_QUEUE_URL")
AWS_REGION = get_ssm_parameter("MY_AWS_REGION", "us-east-2")
on_aws = os.getenv("RUNNING_ON_AWS","false").lower() == "true"

class SessionStoreS3:
    """
    Two-tier session storage:
      - Redis for small values and pointers
      - S3 for large payloads
    All keys use a hash-tag {sid} to keep cluster slot affinity.
    """
    def __init__(self, s3_prefix="sessions/"):
        self.r = get_no_decode_redis_client()
        self.s3 = get_s3_client()
        self.bucket = S3_BUCKET
        self.prefix = s3_prefix.rstrip("/") + "/"

    # ----- util -----
    def _k(self, sid: str, suffix: str) -> str:
        # hash-tag everything on {sid} to keep ops in the same slot
        return f"sess.{{{sid}}}.{suffix}"

    def _s3key(self, sid, base_name, name) -> str:
        return f"{self.prefix}{sid}/{base_name}/{name}"

    # ----- serialization helpers -----
    def _pack(self, obj: Any) -> bytes:
        """
        Pack into msgpack where possible; fall back to JSON for plain dict/list;
        encourage callers to pass df/np explicitly to dedicated helpers below.
        """
        try:
            return msgpack.packb(obj, use_bin_type=True)
        except Exception:
            # As a fallback for basic JSON-safe structures
            return json.dumps(obj, separators=(",", ":")).encode("utf-8")

    def _unpack(self, data: bytes) -> Any:
        try:
            return msgpack.unpackb(data, raw=False)
        except Exception:
            return json.loads(data.decode("utf-8"))

    # ----- public API -----
    def put_small(self, sid: str, name: str, obj: Any, ttl: int = 86_400):
        data = self._pack(obj)
        if len(data) > SMALL_LIMIT:
            print(f"*** got size too big for {name} with size {len(data)}")
            raise ValueError(f"value too large ({len(data)} bytes) for put_small; use put_large_*")
        self.r.set(self._k(sid, f"v:{name}"), data)
        self.r.expire(self._k(sid, f"v:{name}"), ttl)

    def put_hsmall(self, sid: str, base_name: str, key: str, obj: Any, ttl: int = 86_400):
        data = self._pack(obj)
        if len(data) > SMALL_LIMIT:
            raise ValueError(f"value too large ({len(data)} bytes) for put_small; use put_large_*")
        self.r.hset(self._k(sid, f"v:{base_name}"), key, data)
        self.r.expire(self._k(sid, f"v:{base_name}"), ttl)

    def get_small(self, sid: str, name: str) -> Optional[Any]:
        raw = self.r.get(self._k(sid, f"v:{name}"))
        return self._unpack(raw) if raw else None

    def get_hsmall(self, sid: str, base_name: str, name: str) -> Optional[Any]:
        raw = self.r.hget(self._k(sid, f"v:{base_name}"), name)
        return self._unpack(raw) if raw else None

    def get_hsmall_all(self, sid: str, base_name: str) -> dict:
        raw = self.r.hgetall(self._k(sid, f"v:{base_name}"))
        return {k.decode(): self._unpack(v) for k, v in raw.items()} if raw else {}

    def delete_small(self, sid, name):
        self.r.delete(self._k(sid, f"v:{name}"))

    def put_large_bytes(self, sid, base_name, key, payload, content_type="application/octet-stream", ttl=86_400):
        s3_key = self._s3key(sid, base_name, key)
        self.s3.put_object(Bucket=self.bucket, Key=s3_key, Body=payload, ContentType=content_type)

        meta = {"am_metadata": True, "key": s3_key, "ct": content_type, "size": len(payload), "ts": int(time.time())}
        redis_key = self._k(sid, f"v:{base_name}")
        self.r.hset(redis_key, key, json.dumps(meta))
        self.r.expire(redis_key, ttl)
        return key

    def delete_large_bytes(self, sid, base_name, key):
        s3_key = self._s3key(sid, base_name, key)
        self.s3.delete_object(Bucket=self.bucket, Key=s3_key)

    def put_hlarge(self, sid, base_name, key, obj):
        import pickle
        raw = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)
        return self.put_large_bytes(sid, base_name, key, raw)

    def get_large_bytes(self, sid, base_name, key) -> bytes:
        s3_key = self._s3key(sid, base_name, key)
        obj = self.s3.get_object(Bucket=self.bucket, Key=s3_key)
        return obj["Body"].read()

    def get_hlarge(self, sid, base_name, name):
        import pickle
        raw = self.get_large_bytes(sid, base_name, name)
        if raw is None:
            return None
        return pickle.loads(raw)

    # Convenience: numpy / pandas
    def put_array(self, sid: str, name: str, arr: np.ndarray, ttl: int = 86_400) -> str:
        buf = io.BytesIO()
        np.save(buf, arr, allow_pickle=False)
        return self.put_large_bytes(sid, name + ".npy", buf.getvalue(), "application/octet-stream", ttl)

    def get_array(self, sid: str, name: str) -> np.ndarray:
        raw = self.get_large_bytes(sid, name + ".npy")
        return np.load(io.BytesIO(raw), allow_pickle=False)

    def put_dataframe(self, sid: str, name: str, df: pd.DataFrame, ttl: int = 86_400) -> str:
        buf = io.BytesIO()
        df.to_parquet(buf, index=False)
        return self.put_large_bytes(sid, name + ".parquet", buf.getvalue(), "application/octet-stream", ttl)

    def get_dataframe(self, sid: str, name: str) -> pd.DataFrame:
        raw = self.get_large_bytes(sid, name + ".parquet")
        return pd.read_parquet(io.BytesIO(raw))

    # optimistic update on small docs (single-key safe in cluster)
    def update_small(self, sid: str, name: str, mutator, ttl: int = 86_400, retries=12):
        k = self._k(sid, f"v:{name}")
        for _ in range(retries):
            with self.r.pipeline() as p:
                p.watch(k)
                cur = p.get(k)
                cur_obj = self._unpack(cur) if cur else {}
                new_obj = mutator(cur_obj)  # returns a new structure
                data = self._pack(new_obj)
                if len(data) > SMALL_LIMIT:
                    raise ValueError("update would exceed small value size; store large payloads in S3")
                p.multi()
                p.set(k, data)
                p.expire(k, ttl)
                try:
                    p.execute()
                    return True
                except redis.WatchError:
                    continue
        return False

    # list pointers (large items) for a session
    def list_large(self, sid: str):
        hm = self.r.hgetall(self._k(sid, "ptrs"))
        return {k.decode(): json.loads(v.decode()) for k, v in hm.items()} if hm else {}