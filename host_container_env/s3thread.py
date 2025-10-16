# s3thread.py
import io
import threading
import concurrent.futures as cf
from typing import Any, Callable, Optional
import s3fs


class S3FSRunner:
    """
    Run all s3fs operations in a worker thread to avoid asyncio/gevent conflicts.
    """

    def __init__(
        self,
        max_workers: int = 2,
        fs_kwargs: Optional[dict] = None,
        connect_timeout: int = 5,
        read_timeout: int = 20,
        max_attempts: int = 2,
    ):
        self._exec = cf.ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="s3fs-runner")
        self._local = threading.local()
        self._fs_kwargs = dict(
            asynchronous=False,
            config_kwargs={
                "connect_timeout": connect_timeout,
                "read_timeout": read_timeout,
                "retries": {"max_attempts": max_attempts},
            },
        )
        if fs_kwargs:
            self._fs_kwargs.update(fs_kwargs)

    # ---------- core plumbing ----------
    def _get_fs(self) -> s3fs.S3FileSystem:
        fs = getattr(self._local, "fs", None)
        if fs is None:
            fs = s3fs.S3FileSystem(**self._fs_kwargs)
            self._local.fs = fs
        return fs

    def _run_inner(self, fn: Callable[[s3fs.S3FileSystem], Any], args, kwargs):
        fs = self._get_fs()
        return fn(fs, *args, **kwargs)

    def run(self, fn: Callable[[s3fs.S3FileSystem], Any], *args, timeout: Optional[float] = None, **kwargs) -> Any:
        """
        Run `fn(fs, *args, **kwargs)` in a worker thread. Returns fn's result or raises its exception.
        """
        future = self._exec.submit(self._run_inner, fn, args, kwargs)
        return future.result(timeout=timeout)

    def call(self, method: str, *args, timeout: Optional[float] = None, **kwargs) -> Any:
        """
        Call an s3fs method by name, e.g. call("exists", "s3://bucket/key").
        """
        return self.run(lambda fs, *a, **k: getattr(fs, method)(*a, **k), *args, timeout=timeout, **kwargs)

    # ---------- convenience helpers (safe to use from any thread/greenlet) ----------
    def lexists(self, path: str, timeout: float = 30) -> bool:
        return self.call("lexists", path, timeout=timeout)

    def ls(self, path: str, detail: bool = False, timeout: float = 60):
        return self.call("ls", path, detail=detail, timeout=timeout)

    def isdir(self, path: str):
        return self.call("isdir", path)

    def walk(self, path: str):
        return self.call("isdir", path)

    def info(self, path: str, timeout: float = 30):
        return self.call("info", path, timeout=timeout)

    def open_bytes(self, path: str, timeout: float = 120) -> bytes:
        """Read whole object into memory and return bytes."""
        def _read_all(fs: s3fs.S3FileSystem, p: str) -> bytes:
            with fs.open(p, "rb") as f:
                return f.read()
        return self.run(_read_all, path, timeout=timeout)

    def read_text(self, path: str, encoding="utf-8", timeout: float = 120) -> str:
        data = self.open_bytes(path, timeout=timeout)
        return data.decode(encoding, errors="strict")

    def write_bytes(self, path: str, data: bytes, timeout: float = 120):
        def _write(fs: s3fs.S3FileSystem, p: str, b: bytes):
            with fs.open(p, "wb") as f:
                f.write(b)
        return self.run(_write, path, data, timeout=timeout)

    def write_text(self, path: str, text: str, encoding="utf-8", timeout: float = 120):
        return self.write_bytes(path, text.encode(encoding), timeout=timeout)

    def rm(self, path: str, recursive: bool = False, timeout: float = 60):
        return self.call("rm", path, recursive=recursive, timeout=timeout)

    def mkdir(self, path: str, create_parents: bool = True, timeout: float = 30):
        return self.call("mkdir", path, create_parents=create_parents, timeout=timeout)

    def shutdown(self):
        """Close per-thread s3fs and stop the executor."""
        try:
            fs = getattr(self._local, "fs", None)
            if fs is not None:
                fs.close()
        finally:
            self._exec.shutdown(wait=True)