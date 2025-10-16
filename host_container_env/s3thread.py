# s3thread.py
import concurrent.futures as cf
import contextlib
import functools
import os
import threading

# optional: bump this if you expect many concurrent S3 ops
_EXECUTOR = cf.ThreadPoolExecutor(max_workers=8)
_local = threading.local()

def _build_fs():
    import s3fs  # import inside the thread
    # Let s3fs/botocore pick up env/IMDS creds automatically.
    # IMPORTANT: Create the fs inside the worker thread so its event loop is not "running".
    return s3fs.S3FileSystem(anon=False)

def _run_with_new_fs(fn, *args, **kwargs):
    # Create a fresh fs in this worker thread to avoid sharing the event loop across threads.
    fs = _build_fs()
    try:
        return fn(fs, *args, **kwargs)
    finally:
        with contextlib.suppress(Exception):
            fs.clear_instance_cache()

class S3Runner:
    def __init__(self, timeout=180):
        self.timeout = timeout

    def run(self, func, *args, timeout=None, **kwargs):
        """Run an arbitrary function that takes (fs, *args, **kwargs)."""
        fut = _EXECUTOR.submit(_run_with_new_fs, func, *args, **kwargs)
        return fut.result(timeout=timeout or self.timeout)

    def call(self, method, *args, timeout=None, **kwargs):
        """Call a named s3fs method, e.g. call('lexists', 's3://...')."""
        def _invoke(fs, m, *a, **k):
            return getattr(fs, m)(*a, **k)
        return self.run(_invoke, method, *args, timeout=timeout, **kwargs)

    # Nice convenience wrappers
    def lexists(self, path, timeout=None):
        return self.call("lexists", path, timeout=timeout)

    def isdir(self, path, timeout=None):
        return self.call("isdir", path, timeout=timeout)

    def ls(self, path, detail=False, timeout=None):
        return self.call("ls", path, detail=detail, timeout=timeout)

    def info(self, path, timeout=None):
        return self.call("ls", path, timeout=timeout)

    def walk(self, path, maxdepth=None, timeout=None):
        # yield results incrementally without loading all into memory
        def _walker(fs, p, md):
            for dirpath, dirs, files in fs.walk(p, maxdepth=md):
                yield dirpath, dirs, files
        # bridge generator out of thread: collect minimally
        it = self.run(lambda fs, p, md: list(_walker(fs, p, md)), path, maxdepth, timeout=timeout)
        for item in it:
            yield item

s3 = S3Runner()