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
        """Return True if the object or prefix exists (directory or file)."""
        bucket, key = _split_s3_url(path)

        # Empty key = bucket root always exists
        if not key:
            return True

        # Try a direct head_object first (file or dir marker)
        try:
            self.s3.head_object(Bucket=bucket, Key=key)
            return True
        except self.s3.exceptions.ClientError as e:
            code = e.response.get("Error", {}).get("Code", "")
            if code not in ("404", "NoSuchKey"):
                raise

        # Fallback: check if anything exists *under* this prefix
        if not key.endswith("/"):
            prefix = key + "/"
        else:
            prefix = key
        resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
        return "Contents" in resp or "CommonPrefixes" in resp

    def isdir(self, path: str) -> bool:
        """Return True if the path corresponds to a prefix (directory-like)."""
        bucket, key = _split_s3_url(path)
        if not key.endswith("/"):
            key = key + "/"
        resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=key, MaxKeys=1)
        return "Contents" in resp or "CommonPrefixes" in resp

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
        """
        Return metadata about an S3 object or prefix.
        Works for both files and 'directories'.
        """
        bucket, key = _split_s3_url(path)

        # Root always exists
        if not key:
            return {"name": path, "type": "directory"}

        # --- Try to get object metadata (file or dir marker)
        try:
            resp = self.s3.head_object(Bucket=bucket, Key=key)
            return {
                "name": path,
                "type": "file",
                "size": resp["ContentLength"],
                "last_modified": resp["LastModified"].isoformat(),
                "etag": resp.get("ETag"),
            }
        except self.s3.exceptions.ClientError as e:
            code = e.response.get("Error", {}).get("Code", "")
            if code not in ("404", "NoSuchKey"):
                raise

        # --- Maybe it's a directory prefix (no trailing slash required)
        prefix = key if key.endswith("/") else key + "/"
        resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
        if "Contents" in resp or "CommonPrefixes" in resp:
            return {
                "name": path if path.endswith("/") else path + "/",
                "type": "directory",
                "size": 0,
            }

        # --- Nothing found
        raise FileNotFoundError(f"S3 path not found: {path}")


s3 = BotoS3()