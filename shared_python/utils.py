from datetime import datetime, timezone

def utcnow():
    return datetime.now(timezone.utc)

def utc_fromtimestamp(ts):
    return datetime.fromtimestamp(ts, tz=timezone.utc)