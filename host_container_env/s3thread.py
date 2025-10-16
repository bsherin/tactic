from __future__ import annotations
import boto3
from botocore.exceptions import ClientError
from urllib.parse import urlparse
from typing import Iterable, Iterator, List, Tuple, Dict, Optional
import datetime as dt
import io


def _split_s3_url(url: str) -> Tuple[str, str]:
    # accepts s3://bucket/key or "bucket/key"
    if url.startswith("s3://"):
        p = urlparse(url)
        return p.netloc, p.path.lstrip("/")
    # bare "bucket/key"
    parts = url.split("/", 1)
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[1]


class BotoS3:
    def __init__(self, session: Optional[boto3.session.Session] = None):
        self._session = session or boto3.session.Session()
        self.s3 = self._session.client("s3")

    # --- s3fs-like helpers ---
    def lexists(self, path: str) -> bool:
        bucket, key = _split_s3_url(path)
        if not key or key.endswith("/"):
            prefix = key.rstrip("/") + "/"
            resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
            return resp.get("KeyCount", 0) > 0
        # try object head
        try:
            self.s3.head_object(Bucket=bucket, Key=key)
            return True
        except ClientError as e:
            if e.response["Error"]["Code"] in ("404", "NoSuchKey", "NotFound"):
                # maybe it's a “directory” prefix
                prefix = key.rstrip("/") + "/"
                resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
                return resp.get("KeyCount", 0) > 0
            raise

    def ls(self, path: str, detail: bool = False) -> List:
        bucket, key = _split_s3_url(path)
        prefix = key.rstrip("/") + "/" if key and not key.endswith("/") else key
        paginator = self.s3.get_paginator("list_objects_v2")
        it = paginator.paginate(Bucket=bucket, Prefix=prefix, Delimiter="/")

        results = []
        for page in it:
            # “directories”
            for cp in page.get("CommonPrefixes", []):
                name = cp["Prefix"]
                entry = {
                    "name": f"s3://{bucket}/{name}",
                    "type": "directory",
                    "size": 0,
                    "LastModified": None,
                }
                results.append(entry if detail else entry["name"].rstrip("/"))

            # files
            for obj in page.get("Contents", []):
                # skip the “directory marker” objects if any
                if obj["Key"].endswith("/") and obj["Size"] == 0:
                    continue
                entry = {
                    "name": f"s3://{bucket}/{obj['Key']}",
                    "type": "file",
                    "size": obj["Size"],
                    "LastModified": obj.get("LastModified"),
                }
                results.append(entry if detail else entry["name"])
        return results

    def walk(self, path: str, maxdepth: Optional[int] = None) -> Iterator[Tuple[str, List[str], List[str]]]:
        bucket, key = _split_s3_url(path)
        start_prefix = key.rstrip("/") + "/" if key and not key.endswith("/") else key or ""
        # BFS over prefixes using Delimiter to avoid listing whole bucket
        queue: List[Tuple[str, int]] = [(start_prefix, 0)]
        while queue:
            prefix, depth = queue.pop(0)
            paginator = self.s3.get_paginator("list_objects_v2")
            it = paginator.paginate(Bucket=bucket, Prefix=prefix, Delimiter="/")

            dirs, files = [], []
            for page in it:
                for cp in page.get("CommonPrefixes", []):
                    sub = cp["Prefix"]
                    dirs.append(sub.split("/")[-2])  # immediate child name
                    if maxdepth is None or depth + 1 < maxdepth:
                        queue.append((sub, depth + 1))
                for obj in page.get("Contents", []):
                    if obj["Key"].endswith("/") and obj["Size"] == 0:
                        continue
                    files.append(obj["Key"].split("/")[-1])

            yield (f"s3://{bucket}/{prefix}".rstrip("/"), dirs, files)

    # handy reads if you need them on host
    def read_bytes(self, path: str) -> bytes:
        bucket, key = _split_s3_url(path)
        resp = self.s3.get_object(Bucket=bucket, Key=key)
        return resp["Body"].read()

    def read_text(self, path: str, encoding="utf-8") -> str:
        return self.read_bytes(path).decode(encoding)

    def info(self, path: str) -> dict:
        """Return metadata for a single S3 object (similar to s3fs.info)."""
        bucket, key = _split_s3_url(path)
        if not key or key.endswith("/"):
            # It's a 'directory'-like prefix — emulate minimal info
            prefix = key.rstrip("/") + "/"
            resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
            if resp.get("KeyCount", 0) == 0:
                raise FileNotFoundError(f"No such key or prefix: {path}")
            return {
                "name": f"s3://{bucket}/{prefix}",
                "type": "directory",
                "size": 0,
                "LastModified": None,
            }

        try:
            resp = self.s3.head_object(Bucket=bucket, Key=key)
            return {
                "name": path,
                "type": "file",
                "size": resp["ContentLength"],
                "ETag": resp["ETag"],
                "LastModified": resp["LastModified"],
                "ContentType": resp.get("ContentType"),
            }
        except self.s3.exceptions.ClientError as e:
            code = e.response["Error"]["Code"]
            if code in ("404", "NoSuchKey", "NotFound"):
                raise FileNotFoundError(f"No such key: {path}")
            raise

s3 = BotoS3()