from flask import send_file
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from urllib.parse import urlparse
from typing import Iterator, List, Tuple, Optional
from aws_helpers import get_ssm_parameter
from aws_detection import on_aws
import io

MAX_S3_UPLOAD_MB = int(get_ssm_parameter("MAX_S3_UPLOAD_MB", "1000"))

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
        if on_aws:
            self.s3 = self._session.client(
                "s3",
                region_name="us-east-2",
                config=Config(signature_version="s3v4")
            )
        else:
            self.s3 = self._session.client(
                "s3",
                endpoint_url="http://host.docker.internal:4566",
                region_name="us-east-2",
                aws_access_key_id="test",
                aws_secret_access_key="test",
                config = Config(s3={"addressing_style": "path"})
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
        return resp.get("KeyCount", 0) > 0

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

            yield f"s3://{bucket}/{prefix}".rstrip("/"), dirs, files

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
            ["content-length-range", 1, MAX_S3_UPLOAD_MB * 1024 * 1024],
        ]
        fields = {"key": key}
        if content_type:
            # accept whatever the browser sends (must also append this field in the form)
            conditions.append(["starts-with", "$Content-Type", ""])
            fields["Content-Type"] = content_type

        resp = self.s3.generate_presigned_post(
            Bucket=bucket,
            Key=key,
            Fields=fields,
            Conditions=conditions,
            ExpiresIn=15 * 60  # 15 minutes,
        )
        if not on_aws:
            resp["url"] = resp["url"].replace(
                "http://host.docker.internal:4566",
                "http://0.0.0.0:4566"
            )
        return resp
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
        """
        Delete a 'directory' (prefix). If not recursive, error when non-empty.
        Handles the 'directory marker' object correctly.
        """
        b, k = _split_s3_url(url)
        pfx = self._as_prefix(k or "")  # ensure trailing '/'

        # First page
        first = self.s3.list_objects_v2(Bucket=b, Prefix=pfx, MaxKeys=2)

        keycount = int(first.get("KeyCount", 0))
        contents = first.get("Contents", [])

        # Case A: truly empty -> try to remove stray marker and return
        if keycount == 0:
            # remove any stray marker keys if present (best-effort)
            for marker in (pfx, pfx.rstrip("/")):
                try:
                    self.s3.delete_object(Bucket=b, Key=marker)
                except Exception:
                    pass
            return True

        # Case B: only a directory marker exists (and nothing else)
        # (we asked for MaxKeys=2; if we only got 1, and it's exactly the marker, treat as empty)
        if keycount == 1 and contents and contents[0]["Key"] in (pfx, pfx.rstrip("/")) and not first.get("IsTruncated"):
            try:
                self.s3.delete_object(Bucket=b, Key=contents[0]["Key"])
            except Exception:
                pass
            return True

        # Case C: there is real content under the prefix
        if not recursive:
            raise OSError(f"Directory not empty: {url}")

        # Recursive delete everything under prefix (and marker, if any)
        self._delete_prefix(b, pfx)
        # Best-effort: also remove a marker without trailing slash
        try:
            self.s3.delete_object(Bucket=b, Key=pfx.rstrip("/"))
        except Exception:
            pass
        return True

    def rm(self, url: str, recursive: bool = False):
        b, k = _split_s3_url(url)
        is_prefix = recursive or k.endswith("/")
        if is_prefix:
            self._delete_prefix(b, self._as_prefix(k))
        else:
            self.s3.delete_object(Bucket=b, Key=k)
        return True

    def _delete_prefix(self, bucket: str, prefix: str, batch_size: int = 1000):
        paginator = self.s3.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
            objs = [{"Key": o["Key"]} for o in page.get("Contents", [])]
            for i in range(0, len(objs), batch_size):
                self.s3.delete_objects(Bucket=bucket, Delete={"Objects": objs[i:i + batch_size]})

    def rename(self, src_url: str, dst_url: str, overwrite: bool = False):
        """Rename/move a single object OR a prefix (directory-like)."""
        sb, sk = _split_s3_url(src_url)
        db, dk = _split_s3_url(dst_url)

        if sb != db:
            raise ValueError("rename across buckets not supported (use copy + delete if desired)")

        def _object_exists(bucket: str, key: str) -> bool:
            if not key:
                return False
            try:
                self.s3.head_object(Bucket=bucket, Key=key)
                return True
            except ClientError as e:
                code = e.response.get("Error", {}).get("Code", "")
                if code in ("404", "NoSuchKey", "NotFound"):
                    return False
                raise

        def _prefix_has_any(bucket: str, prefix: str) -> bool:
            resp = self.s3.list_objects_v2(Bucket=bucket, Prefix=prefix, MaxKeys=1)
            return resp.get("KeyCount", 0) > 0

        # Decide whether src is an object or a prefix
        src_is_object = _object_exists(sb, sk)
        src_prefix = self._as_prefix(sk or "")
        src_is_prefix = (not src_is_object) and _prefix_has_any(sb, src_prefix)

        # --- PREFIX MOVE (directory-like), even if src_url didn't end with "/"
        if (not sk) or sk.endswith("/") or src_is_prefix:
            sp = src_prefix
            dp = self._as_prefix(dk or "")

            if not overwrite:
                if _prefix_has_any(db, dp) or _object_exists(db, dk):
                    raise FileExistsError(f"Destination exists: {dst_url}")

            token = None
            keys_to_delete = []

            while True:
                kwargs = {"Bucket": sb, "Prefix": sp}
                if token:
                    kwargs["ContinuationToken"] = token
                page = self.s3.list_objects_v2(**kwargs)
                objects = page.get("Contents", [])

                if not objects and token is None:
                    # nothing to move; may still remove placeholder
                    for marker in (sp, sp.rstrip("/")):
                        try:
                            self.s3.delete_object(Bucket=sb, Key=marker)
                        except Exception:
                            pass
                    return True

                for obj in objects:
                    src_key = obj["Key"]
                    rel = src_key[len(sp):]
                    dst_key = dp + rel

                    if not overwrite:
                        try:
                            self.s3.head_object(Bucket=db, Key=dst_key)
                            raise FileExistsError(f"Destination exists: s3://{db}/{dst_key}")
                        except ClientError as e:
                            if e.response.get("Error", {}).get("Code") not in ("404", "NotFound", "NoSuchKey"):
                                raise

                    # Use copy_object so we don't invoke extra behavior; src_key definitely exists.
                    self.s3.copy_object(
                        Bucket=db,
                        Key=dst_key,
                        CopySource={"Bucket": sb, "Key": src_key},
                        MetadataDirective="COPY",
                    )
                    keys_to_delete.append({"Key": src_key})

                token = page.get("NextContinuationToken")
                if not token:
                    break

            # delete originals (chunked)
            for i in range(0, len(keys_to_delete), 1000):
                self.s3.delete_objects(
                    Bucket=sb,
                    Delete={"Objects": keys_to_delete[i:i + 1000], "Quiet": True},
                )
            return True

        # --- SINGLE OBJECT MOVE
        if not overwrite:
            if _object_exists(db, dk) or _prefix_has_any(db, self._as_prefix(dk)):
                raise FileExistsError(f"Destination exists: {dst_url}")

        self.s3.copy_object(
            Bucket=db,
            Key=dk,
            CopySource={"Bucket": sb, "Key": sk},
            MetadataDirective="COPY",
        )
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