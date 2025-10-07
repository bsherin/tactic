# ecs_tile_launcher.py
import os, time, uuid, json
import boto3
from botocore.config import Config

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
    region = os.getenv("ECS_REGION", os.getenv("AWS_REGION", "us-east-2"))
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
    """
    Launch a single tile task on ECS/Fargate and return (tile_unique_id, task_arn, ip_address).
    """
    ecs = _ecs_client()

    cluster   = os.getenv("ECS_CLUSTER", "tactic-cluster")
    taskdef   = os.getenv("ECS_TILE_TASKDEF", "tactic-tile")
    subnets   = [s.strip() for s in os.getenv("ECS_SUBNETS", "").split(",") if s.strip()]
    sgs       = [g.strip() for g in os.getenv("ECS_SECURITY_GROUPS", "").split(",") if g.strip()]
    assign_ip = os.getenv("ECS_ASSIGN_PUBLIC_IP", "ENABLED")  # ENABLED for your public subnets

    if not subnets or not sgs:
        raise ECSTileError("ECS_SUBNETS / ECS_SECURITY_GROUPS must be set.")

    # Build up the environment (mirror your docker path)
    unique_id   = tile_id or str(uuid.uuid4())
    retries     = os.getenv("RETRIES", "0")
    chunk_size  = os.getenv("CHUNK_SIZE", "1048576")  # safe default if not set
    mongo_uri   = os.getenv("MONGO_URI", "")
    use_arm64   = os.getenv("USE_ARM64", "False")
    use_mq      = os.getenv("USE_AMAZON_MQ", "True")
    develop     = os.getenv("DEVELOP", "False")
    debug_main  = os.getenv("DEBUG_MAIN_CONTAINER", "False")
    debug_tile  = os.getenv("DEBUG_TILE_CONTAINER", "False")

    # Anything your app previously passed in:
    env = {
        "RETRIES": retries,
        "CHUNK_SIZE": chunk_size,
        "MY_ID": unique_id,
        "OWNER": owner,
        "PARENT": parent,
        "DB_NAME": os.getenv("db_name", ""),
        "IMAGE_NAME": "bsherin/tactic-tile",
        # NOTE: You intentionally hid MONGO_URI from tiles before; keep that behavior:
        # "MONGO_URI": mongo_uri,
        "DEVELOP": develop,
        "DEBUG_MAIN_CONTAINER": debug_main,
        "DEBUG_TILE_CONTAINER": debug_tile,
        "PYTHONUNBUFFERED": "Yes",
        "USE_ARM64": use_arm64,
        "USE_AMAZON_MQ": use_mq,
        "USERNAME": username,
        # From your create_tile_container() caller:
        "IS_PSEUDO_TILE": str(extra_env.get("IS_PSEUDO_TILE", "False")) if extra_env else "False",
        "USE_WAIT_TASKS": str(extra_env.get("USE_WAIT_TASKS", "True")) if extra_env else "True",
        "PPI": str(extra_env.get("PPI", "0")) if extra_env else "0",
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
            "assignPublicIp": assign_ip
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
        # You can add tags=[...] here if you want "labels" equivalents.
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

    return unique_id, task_arn, ip