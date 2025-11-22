import os
import requests
from requests.auth import HTTPBasicAuth
from aws_helpers import get_ssm_parameter, load_secret_json

if os.environ.get("USE_AMAZON_MQ") == "True" or os.environ.get("USE_AMAZON_MQ") is True:
    print("using amazon mq")
    import boto3

    USE_AMAZON_MQ = True
    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
    SECRET_ARN = get_ssm_parameter("MQ_SECRET_ARN")
    REGION = get_ssm_parameter("MY_AWS_REGION")

    print("using amazon mq with host:", RABBIT_HOST)

    creds = load_secret_json(SECRET_ARN)

    RABBIT_USER = creds["username"]
    RABBIT_PASS = creds["password"]
    API_STR = f"https://{RABBIT_HOST}/api"
else:
    print("not using amazon mq")
    RABBIT_HOST = "megaplex"
    USE_AMAZON_MQ = False
    RABBIT_USER = "guest"
    RABBIT_PASS = "guest"
    API_STR = f"http://{RABBIT_HOST}:15672/api"


def list_queues():
    resp = requests.get(f"{API_STR}/queues/%2F", auth=HTTPBasicAuth(RABBIT_USER, RABBIT_PASS))
    resp.raise_for_status()
    queues = resp.json()
    return queues

def delete_queue(qname: str):
    r = requests.delete(
        f"{API_STR}/queues/%2F/{qname}",
        auth=HTTPBasicAuth(RABBIT_USER, RABBIT_PASS)
    )
    print(r.status_code, r.text)

def delete_host_wait_queues():
    queues = list_queues()
    to_delete = [
        q["name"]
        for q in queues
        if q["name"].startswith("host") and q["name"].endswith("_wait")
    ]

    if not to_delete:
        print("No matching queues found.")
        return

    print("Will delete these queues:")
    for name in to_delete:
        print("  ", name)

    # safety: uncomment prompt if you want
    # input("Press Enter to continue...")

    for qname in to_delete:
        delete_queue(qname)