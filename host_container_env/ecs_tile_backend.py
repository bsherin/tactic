
import os, time
from typing import Dict, Optional
import boto3
from botocore.config import Config

from abstract_tile_backend import TileBackend
from aws_task_helpers import run_tile_on_ecs, ECSTileError  # your helper we already built
from aws_helpers import get_ssm_parameter
from tactic_logging import log

def _ecs():
    region = get_ssm_parameter("ECS_REGION")
    return boto3.client("ecs", region_name=region, config=Config(retries={"max_attempts": 10, "mode": "standard"}))

def _sts():
    region = get_ssm_parameter("ECS_REGION")
    return boto3.client("sts", region_name=region)

class ECSTileBackend(TileBackend):
    """
    Works in two modes:
      - Warm pool (preferred): claim an idle tile from your host registry.
      - Ad-hoc: if none idle, launch one via run_tile_on_ecs().
    """

    def __init__(self, tile_registry, worker):
        self.cluster = get_ssm_parameter("ECS_CLUSTER", "tactic-cluster")
        self.taskdef = get_ssm_parameter("ECS_TILE_TASKDEF", "tactic-tile")  # family only → will use latest ACTIVE rev
        # For ad-hoc launches we need networking:
        self.subnets = [s.strip() for s in get_ssm_parameter("ECS_SUBNETS", "").split(",") if s.strip()]
        self.sgs     = [g.strip() for g in get_ssm_parameter("TILE_SECURITY_GROUPS", "").split(",") if g.strip()]
        self.tile_registry = tile_registry
        self.worker = worker

    @staticmethod
    def issue_user_s3_session(username: str, ttl_seconds: int = 7200):
        role_arn = f"arn:aws:iam::{os.getenv('ACCOUNT_ID', '924818964184')}:role/TacticTileS3SessionRole"
        sts = _sts()
        resp = sts.assume_role(
            RoleArn=role_arn,
            RoleSessionName=f"user-{username}-{int(time.time())}",
            DurationSeconds=ttl_seconds,
            Tags=[{"Key": "userId", "Value": username}]
        )
        creds = resp["Credentials"]
        return {
            "AccessKeyId": creds["AccessKeyId"],
            "SecretAccessKey": creds["SecretAccessKey"],
            "SessionToken": creds["SessionToken"],
            "region": os.getenv("AWS_REGION", "us-east-2"),
        }

    def launch(self, username: str, owner: Optional[str],
               parent: Optional[str], tile_id: Optional[str], meta: Dict,
               project_name: Optional[str] = None,
               tile_name: Optional[str] = None):
        tid, task_arn = self.tile_registry.claim_tile(username, owner, parent, project_name, tile_name)
        if tid:
            log.debug("warm_tile_claimed", category="tile_management", tile_id=tid, task_arn=task_arn)
            creds = self.issue_user_s3_session(username)
            return tid, task_arn, creds

        log.warning("***Warm tile pool empty, launching ad-hoc ECS tile...***", category="tile_management")
        if not self.subnets or not self.sgs:
            raise ECSTileError("No idle tiles and ECS_SUBNETS/ECS_SECURITY_GROUPS not set for ad-hoc launch.")

        for k in ("BROKER_URL", "REDIS_URL"):
            v = os.getenv(k)
            if v:
                env[k] = v

        uid, task_arn = run_tile_on_ecs(
            username=username,
            tile_id=tile_id,
            owner=owner,
            parent=parent,
            other_name=meta.get("other_name", "none"),
        )
        tile_id = f"tile_{uid}"
        args = {
            "owner": username,
            "parent": parent,
            "project_name": project_name,
            "tile_name": tile_name,
            "register_heartbeat": True
        }
        self.tile_registry.mark_status(tile_id, "busy", **args)
        creds = self.issue_user_s3_session(username)
        return uid, task_arn, creds

    def restart(self, tile_id: str):
        tdata = self.tile_registry.get(tile_id)
        self.worker.post_task(tile_id, "restart", {})
        # self.worker.post_task(f"kill_{tile_id}", "restart", {})
        return tdata

    def terminate(self, tile_id: str):
        try:
            ecs = _ecs()
            task_arn = self._lookup_task_arn(tile_id)
            if task_arn:
                ecs.update_task_protection(cluster=self.cluster, tasks=[task_arn], protectionEnabled=False)
            ecs.stop_task(cluster=self.cluster, task=task_arn, reason="tile terminated")
        finally:
            pass

    def _lookup_task_arn(self, tile_id: str) -> Optional[str]:
        return self.tile_registry.get_arn(tile_id)