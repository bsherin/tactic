
import os, time
from typing import Optional
import boto3
from botocore.config import Config

from abstract_tile_backend import TileBackend
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
    def issue_user_s3_session(username: str, ttl_seconds: int = 18000):
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

    def request_tile(self, temp_id, parent, task_packet):
        if self.tile_registry.queue_count == 0:
            tid, task_arn = self.tile_registry.find_idle_tile(task_packet)
            if tid:
                self.tile_registry.claim_idle_tile(tid, task_packet)
                self.worker.update_tile_status(temp_id, parent, "claimed")
                username = task_packet["task_data"].get("username", "unknown")
                log.debug("warm_tile_claimed", category="tile_management", tile_id=tid, task_arn=task_arn)
                creds = self.issue_user_s3_session(username)
                self.worker.submit_response(task_packet, {"success": True, "the_id": tid,
                                                          "task_arn": task_arn, "creds": creds})
                return
        log.debug("No idle tiles available; queueing request", category="tile_management")
        self.tile_registry.add_to_queue(task_packet)
        self.worker.update_tile_status(temp_id, parent, "queued")

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