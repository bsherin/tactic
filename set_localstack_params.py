import json
import boto3

ENDPOINT = "http://localhost:4566"   # LocalStack endpoint
REGION = "us-east-2"
ACCOUNT_ID = "000000000000"          # LocalStack default

USER_BUCKET = "tactic-user-storage"
SESSION_BUCKET = "tactic-session-storage"
QUEUE_NAME = "tactic-storage-events"
CLIENT_SESSION_TIMEOUT_SECS = "3600"
TILE_HEARTBEAT_TIMEOUT_SECS = "600"
HEARTBEAT_INTERVAL_SECS = "60"
HOST_UTILITY_INTERVAL_SECS = "60"
METRIC_PUBLISH_INTERVAL_SECS = "180"
CLIENT_ACTIVITY_INTERVAL_SECS = "60"
TILE_SERVICE = "tactic-tile-pool"
MAIN_SERVICE = "tactic-main-service"
MODULE_VIEWER_SERVICE = "tactic-module-viewer"
TILE_ID_PREFIX = "tile_"
MAIN_ID_PREFIX = "main_service_"
MODULE_VIEWER_PREFIX = "module_viewer_"

params = {
    "BUCKET": USER_BUCKET,
    "SESSION_BUCKET": SESSION_BUCKET,
    "MY_AWS_REGION": REGION,
    "SQS_QUEUE_URL": queue_url,
    "CLIENT_SESSION_TIMEOUT_SECS": CLIENT_SESSION_TIMEOUT_SECS,
    "TILE_HEARTBEAT_TIMEOUT_SECS": TILE_HEARTBEAT_TIMEOUT_SECS,
    "HEARTBEAT_INTERVAL_SECS": HEARTBEAT_INTERVAL_SECS,
    "HOST_UTILITY_INTERVAL_SECS": HOST_UTILITY_INTERVAL_SECS,
    "METRIC_PUBLISH_INTERVAL_SECS": METRIC_PUBLISH_INTERVAL_SECS,
    "CLIENT_ACTIVITY_INTERVAL_SECS": CLIENT_ACTIVITY_INTERVAL_SECS,
    "TILE_SERVICE": TILE_SERVICE,
    "MAIN_SERVICE": MAIN_SERVICE,
    "MODULE_VIEWER_SERVICE": MODULE_VIEWER_SERVICE,
    "TILE_ID_PREFIX": TILE_ID_PREFIX,
    "MAIN_ID_PREFIX": MAIN_ID_PREFIX,
    "MODULE_VIEWER_PREFIX": MODULE_VIEWER_PREFIX
}

SESSION = boto3.session.Session(
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name=REGION,
)
ssm = SESSION.client("ssm", endpoint_url=ENDPOINT)

for name, val in params.items():
    print(f"  {name} = {val}")
    ssm.put_parameter(
        Name=name,
        Value=val,
        Type="String",
        Overwrite=True,
    )