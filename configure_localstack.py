import json
import boto3

# --- Config you can tweak ---
ENDPOINT = "http://localhost:4566"   # LocalStack endpoint
REGION = "us-east-2"
ACCOUNT_ID = "000000000000"          # LocalStack default
USER_BUCKET = "tactic-user-storage"
SESSION_BUCKET = "tactic-session-storage"
QUEUE_NAME = "tactic-user-storage-events"
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

# LocalStack “fake” credentials
SESSION = boto3.session.Session(
    aws_access_key_id="test",
    aws_secret_access_key="test",
    region_name=REGION,
)

s3 = SESSION.client("s3", endpoint_url=ENDPOINT)
sqs = SESSION.client("sqs", endpoint_url=ENDPOINT)
ssm = SESSION.client("ssm", endpoint_url=ENDPOINT)

# ------------------------
# 1) Create S3 buckets
# ------------------------
for bucket in [USER_BUCKET, SESSION_BUCKET]:
    try:
        print(f"Ensuring bucket {bucket} exists...")
        # For LocalStack, you can usually omit CreateBucketConfiguration, but it doesn't hurt
        s3.create_bucket(
            Bucket=bucket,
            CreateBucketConfiguration={"LocationConstraint": REGION},
        )
    except s3.exceptions.BucketAlreadyOwnedByYou:
        print(f"Bucket {bucket} already exists (owned by you).")
    except s3.exceptions.BucketAlreadyExists:
        print(f"Bucket {bucket} already exists (global).")
    except Exception as e:
        print(f"Bucket {bucket}: {e}")

# ------------------------
# 2) Set CORS on user bucket
# ------------------------
cors_config = {
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],   # relax for local dev
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000,
        }
    ]
}

print("Setting CORS on tactic-user-storage...")
s3.put_bucket_cors(Bucket=USER_BUCKET, CORSConfiguration=cors_config)

# ------------------------
# 3) Create "folders" in S3 (just zero-byte objects with trailing /)
# ------------------------
for key in ["users/", "users/bsherinrem/"]:
    print(f"Ensuring prefix object {key} exists...")
    s3.put_object(Bucket=USER_BUCKET, Key=key)

# ------------------------
# 4) Create SQS queue + policy
# ------------------------
print(f"Creating SQS queue {QUEUE_NAME}...")
queue_resp = sqs.create_queue(QueueName=QUEUE_NAME)
queue_url = queue_resp["QueueUrl"]
queue_arn = f"arn:aws:sqs:{REGION}:{ACCOUNT_ID}:{QUEUE_NAME}"
print(f"Queue URL: {queue_url}")
print(f"Queue ARN: {queue_arn}")

# Policy allowing S3 bucket to send messages to this queue
policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "SQS:SendMessage",
            "Resource": queue_arn,
            "Condition": {
                "ArnEquals": {
                    "aws:SourceArn": f"arn:aws:s3:::{USER_BUCKET}"
                }
            },
        }
    ],
}

print("Attaching policy to SQS queue...")
sqs.set_queue_attributes(
    QueueUrl=queue_url,
    Attributes={"Policy": json.dumps(policy)},
)

# ------------------------
# 5) Wire S3 notifications → SQS
# ------------------------
notification_config = {
    "QueueConfigurations": [
        {
            "QueueArn": queue_arn,
            "Events": [
                "s3:ObjectCreated:*",
                "s3:ObjectRemoved:*",
            ],
        }
    ]
}

print("Setting S3 → SQS notification configuration...")
s3.put_bucket_notification_configuration(
    Bucket=USER_BUCKET,
    NotificationConfiguration=notification_config,
)

# ------------------------
# 6) Write SSM parameters
# ------------------------
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

print("Writing SSM parameters...")
for name, val in params.items():
    print(f"  {name} = {val}")
    ssm.put_parameter(
        Name=name,
        Value=val,
        Type="String",
        Overwrite=True,
    )

print("Done.")