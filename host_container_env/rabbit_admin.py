import requests
from requests.auth import HTTPBasicAuth
from aws_helpers import get_ssm_parameter, load_secret_json
from aws_detection import on_aws
from tactic_logging import log

if on_aws:
    RABBIT_HOST = get_ssm_parameter("RABBIT_HOST")
    SECRET_ARN = get_ssm_parameter("MQ_SECRET_ARN")
    REGION = get_ssm_parameter("MY_AWS_REGION")

    log.debug("on aws, using mq with host", host=RABBIT_HOST)

    creds = load_secret_json(SECRET_ARN)

    RABBIT_USER = creds["username"]
    RABBIT_PASS = creds["password"]
    API_STR = f"http://{RABBIT_HOST}:15672/api"
else:
    log.debug("not on aws, using rabbit defaults")
    RABBIT_HOST = "megaplex"
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
    log.debug(f"deleting queue", queue=qname, status=r.status_code)

def delete_wait_queues():
    queues = list_queues()
    to_delete = [
        q["name"]
        for q in queues
        if q["name"].endswith("_wait") or q["name"].startswith("wait_")
    ]

    if not to_delete:
        log.debug("no matching queues found to delete")
        return

    log.debug("will delete these queues", queues=to_delete)

    for qname in to_delete:
        delete_queue(qname)