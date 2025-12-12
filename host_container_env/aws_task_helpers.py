
import os, time, uuid, json
import boto3
from botocore.config import Config
from aws_helpers import get_ssm_parameter


class ECSTileError(Exception):
    pass

def _bool_env(name, default=False):
    v = os.getenv(name)
    if v is None:
        return default
    return str(v).lower() in ("1","true","yes","on")

def _int_env(name, default):
    v = os.getenv(name)
    try:
        return int(v) if v is not None else default
    except (TypeError, ValueError):
        return default

def _now():
    return int(time.time())

def _ecs_client():
    region = get_ssm_parameter("ECS_REGION")
    return boto3.client("ecs", region_name=region, config=Config(retries={"max_attempts": 10, "mode": "standard"}))

def _describe_task_ip(cluster, task_arn, timeout_s=120):
    """
    Waits until the task is RUNNING or STOPPED, then extracts the ENI IP(s).
    Returns (private_ip, public_ip, last_status, stopped_reason)
    """
    ecs = _ecs_client()
    deadline = _now() + timeout_s
    last_status = ""
    stopped_reason = ""
    private_ip = None
    public_ip = None

    while _now() < deadline:
        resp = ecs.describe_tasks(cluster=cluster, tasks=[task_arn])
        t = resp["tasks"][0]
        last_status = t.get("lastStatus", "")
        stopped_reason = t.get("stoppedReason", "")

        # Parse ENI details
        for att in t.get("attachments", []):
            if att.get("type") == "ElasticNetworkInterface":
                details = {d["name"]: d["value"] for d in att.get("details", [])}
                private_ip = details.get("privateIPv4Address", private_ip)
                public_ip  = details.get("publicIPv4Address", public_ip)

        if last_status == "RUNNING" or last_status == "STOPPED":
            break

        time.sleep(2)

    return private_ip, public_ip, last_status, stopped_reason

def run_tile_on_ecs(
    username,
    tile_id,
    owner,
    parent,
    other_name,
    extra_env
):
    ecs = _ecs_client()

    cluster   = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
    taskdef   = get_ssm_parameter("ECS_TILE_TASKDEF", "tactic-tile")
    subnets   = [s.strip() for s in get_ssm_parameter("ECS_SUBNETS", "").split(",") if s.strip()]
    sgs       = [g.strip() for g in get_ssm_parameter("TILE_SECURITY_GROUPS", "").split(",") if g.strip()]

    if not subnets or not sgs:
        raise ECSTileError("ECS_SUBNETS / ECS_SECURITY_GROUPS must be set.")

    unique_id   = tile_id or str(uuid.uuid4())

    env = {
        "MY_ID": unique_id,
        "OWNER": owner,
        "PARENT": parent,
        "IMAGE_NAME": "bsherin/tactic-tile",
        "PYTHONUNBUFFERED": "Yes",
        "USERNAME": username,
        "USE_WAIT_TASKS": "True",
        "PPI": "0",
        "OTHER_NAME": other_name,
    }

    # Merge extra overrides (e.g., BROKER_URL, REDIS_URL, etc.)
    if extra_env:
        for k, v in extra_env.items():
            env[k] = str(v)

    # Convert to ECS overrides format
    env_list = [{"name": k, "value": v} for k, v in env.items()]

    network_conf = {
        "awsvpcConfiguration": {
            "subnets": subnets,
            "securityGroups": sgs,
            "assignPublicIp": "DISABLED"
        }
    }

    # Fire the task
    resp = ecs.run_task(
        cluster=cluster,
        launchType="FARGATE",
        taskDefinition=taskdef,
        count=1,
        networkConfiguration=network_conf,
        overrides={
            "containerOverrides": [
                {
                    "name": "tactic_tile",
                    "environment": env_list
                }
            ]
        }
        # add tags=[...] here fo r"labels" equivalents.
    )

    failures = resp.get("failures")
    if failures:
        raise ECSTileError(f"ECS run_task failed: {failures}")

    task_arn = resp["tasks"][0]["taskArn"]

    # Wait briefly to get IP; tiles usually talk over MQ/Redis, but you returned an address before
    priv_ip, pub_ip, last, reason = _describe_task_ip(cluster, task_arn, timeout_s=120)
    if last == "STOPPED":
        raise ECSTileError(f"Tile task stopped early: {reason}")

    # Prefer private IP for intra-VPC; use public if you actually need it
    ip = priv_ip or pub_ip or ""

    return unique_id, task_arn