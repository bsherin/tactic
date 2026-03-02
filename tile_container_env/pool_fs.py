import re
import s3fs

BUCKET = "tactic-user-storage"
USERS_ROOT = "users"

from aws_detection import on_aws

class PoolFS(s3fs.S3FileSystem):
    """
    An s3fs filesystem scoped to a single user's prefix.

    - Accepts user paths like "foo/bar.txt" or "/foo/bar.txt"
    - Rewrites them to: "<bucket>/<prefix>/foo/bar.txt"
    """

    def __init__(
        self,
        username: str,
    ):
        self.username = username
        if on_aws:
            super().__init__()
        else:
            super().__init__(key="test", secret="test", endpoint_url="http://host.docker.internal:4566")
        if not username or "/" in username:
            raise ValueError("username must be a non-empty string without '/'")

        self._tactic_bucket = BUCKET
        self._tactic_prefix = f"{USERS_ROOT}/{username}"

    def _qualify(self, path: str) -> str:
        # remove protocol if present
        p = super()._strip_protocol(path)
        if p is None:
            p = ""

        p = str(p)
        # Treat empty / root as the user's root (NOT "list all buckets")
        if p is None or p == "" or p in ("*", "/"):
            return f"{self._tactic_bucket}/{self._tactic_prefix}".rstrip("/")

        p = p.lstrip("/")

        # If user passes "s3://..." then super() already removed protocol,
        # so p is now like "bucket/key..." or "bucket" etc.

        if p.startswith(self._tactic_bucket):
            return p.rstrip("/")

        if p.startswith(self._tactic_prefix):
            return f"{self._tactic_bucket}/{p}".rstrip("/")

        if p.startswith(self.username):
            return f"{self._tactic_bucket}/{USERS_ROOT}/{p}".rstrip("/")

        return f"{self._tactic_bucket}/{self._tactic_prefix}/{p}".rstrip("/")

    def split_path(self, path, *args, **kwargs):
        # qualify first, then let s3fs do its normal split
        return super().split_path(self._qualify(path), *args, **kwargs)

