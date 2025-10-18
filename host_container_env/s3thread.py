from __future__ import annotations
from flask import jsonify, send_file
import boto3
from botocore.config import Config
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
        self.s3 = self._session.client(
            "s3",
            config=Config(signature_version="s3v4")
        )

    @staticmethod
    def _as_prefix(key: str) -> str:
        return key if key.endswith("/") else key + "/"

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
                "last_modified": resp["LastModified"],
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
                "last_modified": None,
            }

        # --- Nothing found
        raise FileNotFoundError(f"S3 path not found: {path}")

    def read_text(self, path: str, encoding: str = "utf-8") -> str:
        b, k = _split_s3_url(path)
        obj = self.s3.get_object(Bucket=b, Key=k)
        return obj["Body"].read().decode(encoding)

    def upload_info(self, dest_path, content_type):
        bucket, key = _split_s3_url(dest_path)
        conditions = [
            {"bucket": bucket},
            ["starts-with", "$key", key],
            ["content-length-range", 1, max_mb * 1024 * 1024],
        ]
        fields = {"key": key, "success_action_status": "201"}
        if content_type:
            # accept whatever the browser sends (must also append this field in the form)
            conditions.append(["starts-with", "$Content-Type", ""])
            fields["Content-Type"] = content_type

        return s3.generate_presigned_post(
            Bucket=bucket,
            Key=key,
            Fields=fields,
            Conditions=conditions,
            ExpiresIn=expires_in,
        )
    def download(self, url: str):
        bucket, key = _split_s3_url(url)
        obj = self.s3.get_object(Bucket=bucket, Key=key)
        file_stream = io.BytesIO(obj['Body'].read())
        file_stream.seek(0)
        filename = key.split("/")[-1] if key else bucket
        return send_file(
            file_stream,
            as_attachment=True,
            download_name=filename
        )

    def mkdir(self, url: str, create_placeholder: bool = True):
        """Create a 'directory' prefix; optionally write a zero-byte marker at prefix/."""
        b, k = _split_s3_url(url)
        pfx = self._as_prefix(k or "")
        if create_placeholder:
            self.s3.put_object(Bucket=b, Key=pfx, Body=b"")
        return True

    def rmdir(self, url: str, recursive: bool = False):
        """Delete prefix. If not recursive, error when non-empty."""
        b, k = _split_s3_url(url)
        pfx = self._as_prefix(k or "")
        first = self.s3.list_objects_v2(Bucket=b, Prefix=pfx, MaxKeys=2)
        if not first.get("KeyCount", 0):
            # remove a stray placeholder if present
            try:
                self.s3.delete_object(Bucket=b, Key=pfx)
            except Exception:
                pass
            return True
        if not recursive:
            raise OSError(f"Directory not empty: {url}")
        self._delete_prefix(b, pfx)
        return True

    def rm(self, url: str, recursive: bool = False):
        b, k = _split_s3_url(url)
        is_prefix = recursive or k.endswith("/")
        if is_prefix:
            self._delete_prefix(b, self._as_prefix(k))
        else:
            self.s3.delete_object(Bucket=b, Key=k)
        return True

    def _delete_prefix(self, bucket: str, prefix: str):
        token = None
        while True:
            kwargs = {"Bucket": bucket, "Prefix": prefix}
            if token:
                kwargs["ContinuationToken"] = token
            page = self.s3.list_objects_v2(**kwargs)
            keys = [{"Key": obj["Key"]} for obj in page.get("Contents", [])]
            if keys:
                for i in range(0, len(keys), 1000):
                    self.s3.delete_objects(Bucket=bucket, Delete={"Objects": keys[i:i + 1000], "Quiet": True})
            token = page.get("NextContinuationToken")
            if not token:
                break

    def rename(self, src_url: str, dst_url: str, overwrite: bool = False):
        """Rename/move a single object OR a prefix (if src endswith('/'))."""
        sb, sk = _split_s3_url(src_url)
        db, dk = _split_s3_url(dst_url)

        # prefix move
        if not sk or sk.endswith("/"):
            sp = self._as_prefix(sk or "")
            dp = self._as_prefix(dk or "")
            # if destination exists and not overwrite, guard
            if not overwrite:
                exists = self.s3.list_objects_v2(Bucket=db, Prefix=dp, MaxKeys=1).get("KeyCount", 0)
                if exists:
                    raise FileExistsError(f"Destination prefix exists: {dst_url}")

            # list all under source, copy, then delete
            token = None
            copied = 0
            keys_to_delete = []
            while True:
                kwargs = {"Bucket": sb, "Prefix": sp}
                if token:
                    kwargs["ContinuationToken"] = token
                page = self.s3.list_objects_v2(**kwargs)
                objects = page.get("Contents", [])
                if not objects and token is None:
                    # nothing to move; may still remove placeholder
                    try:
                        self.s3.delete_object(Bucket=sb, Key=sp)
                    except Exception:
                        pass
                    return True
                for obj in objects:
                    src_key = obj["Key"]
                    rel = src_key[len(sp):]
                    dst_key = dp + rel
                    if not overwrite:
                        # optional: check existence; skip if exists or raise
                        try:
                            self.s3.head_object(Bucket=db, Key=dst_key)
                            raise FileExistsError(f"Destination exists: s3://{db}/{dst_key}")
                        except ClientError as e:
                            if e.response.get("Error", {}).get("Code") not in ("404", "NotFound", "NoSuchKey"):
                                raise
                    self.s3.copy({"Bucket": sb, "Key": src_key}, db, dst_key)
                    keys_to_delete.append({"Key": src_key})
                    copied += 1
                token = page.get("NextContinuationToken")
                if not token:
                    break

            # delete originals (chunked)
            for i in range(0, len(keys_to_delete), 1000):
                self.s3.delete_objects(Bucket=sb, Delete={"Objects": keys_to_delete[i:i + 1000], "Quiet": True})
            return True

        # single object move
        if not overwrite:
            try:
                self.s3.head_object(Bucket=db, Key=dk)
                raise FileExistsError(f"Destination exists: {dst_url}")
            except ClientError as e:
                if e.response.get("Error", {}).get("Code") not in ("404", "NotFound", "NoSuchKey"):
                    raise
        self.s3.copy({"Bucket": sb, "Key": sk}, db, dk)
        self.s3.delete_object(Bucket=sb, Key=sk)
        return True

    def copy(self, src_url: str, dst_url: str, overwrite: bool = False):
        """
        Duplicate a file (copy src -> dst) without deleting the source.
        Works across buckets as well.
        """
        sb, sk = _split_s3_url(src_url)
        db, dk = _split_s3_url(dst_url)

        # If not overwriting, check if destination exists
        if not overwrite:
            try:
                self.s3.head_object(Bucket=db, Key=dk)
                raise FileExistsError(f"Destination exists: {dst_url}")
            except ClientError as e:
                code = e.response.get("Error", {}).get("Code", "")
                if code not in ("404", "NotFound", "NoSuchKey"):
                    raise

        # Perform the copy
        self.s3.copy({"Bucket": sb, "Key": sk}, db, dk)
        return True

    mv = rename

boto_s3 = BotoS3()