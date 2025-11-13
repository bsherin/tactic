import os
exports = {
    "AWS_ACCESS_KEY_ID": "test",
    "AWS_SECRET_ACCESS_KEY": "test",
    "AWS_DEFAULT_REGION": "us-east-2",
}

for name, val in exports.items():
    os.system(f"export {name}={val}")

qurl = "http://localhost.localstack.cloud:4566/000000000000/tactic-storage-events"
qarn = "arn:aws:sqs:us-east-2:000000000000:tactic-storage-events"

params = {
    "BUCKET": "tactic-user-storage",
    "MY_AWS_REGION": "us-east-2",
    "SQS_QUEUE_URL": f"{qurl}"
}

for name, val in params.items():
    os.system(f"awslocal ssm put-parameter --name {name} --value '{val}' --type String")

os.system("awslocal sqs create-queue --queue-name tactic-storage-events")

os.system(f"awslocal sqs set-queue-attributes --queue-url '{qurl}' --attributes file://attributes.json")

config_str = '{"QueueConfigurations": [{"QueueArn": "' + qarn + '", "Events": ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"]}]}'

os.system(f"awslocal s3api put-bucket-notification-configuration --bucket tactic-user-storage --notification-configuration '{config_str}'")


