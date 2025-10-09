# backends/ecs_backend.py
import os, uuid, time
from typing import Dict, Tuple, Optional
import boto3
from botocore.config import Config

from asbract_tile_backend import TileBackend
from aws_task_helpers import run_tile_on_ecs, ECSTileError  # your helper we already built

def _ecs():
    region = os.getenv("ECS_REGION", os.getenv("AWS_REGION", "us-east-2"))
    return boto3.client("ecs", region_name=region, config=Config(retries={"max_attempts": 10, "mode": "standard"}))

class ECSTileBackend(TileBackend):
    """
    Works in two modes:
      - Warm pool (preferred): claim an idle tile from your host registry.
      - Ad-hoc: if none idle, launch one via run_tile_on_ecs().
    """

    def __init__(self, tile_registry):
        self.cluster = os.getenv("ECS_CLUSTER", "tactic-cluster")
        self.taskdef = os.getenv("ECS_TILE_TASKDEF", "tactic-tile")  # family only → will use latest ACTIVE rev
        # For ad-hoc launches we still need networking:
        self.subnets = [s.strip() for s in os.getenv("ECS_SUBNETS", "").split(",") if s.strip()]
        self.sgs     = [g.strip() for g in os.getenv("ECS_SECURITY_GROUPS", "").split(",") if g.strip()]
        self.assign_public = os.getenv("ECS_ASSIGN_PUBLIC_IP", "ENABLED")
        self.tile_registry = tile_registry

    def _claim_idle_from_registry(self, owner, parent) -> Optional[Tuple[str, str]]:
        return self.tile_registry.claim_tile(owner, parent)

    def _mark_in_registry(self, tile_id: str, status: str, meta: Optional[Dict] = None):
        self.tile_registry.mark(tile_id, status, meta)
        return

    # --------------------------------------------------------------------------

    def launch(self, username: str, owner: Optional[str], parent: Optional[str], tile_id: Optional[str], meta: Dict) -> Tuple[str, str]:
        # 1) Try to claim a warm tile if your pool exists
        tid, task_arn = self.claim_tile(username, owner, parent)
        if tid:
            return tid

        # 2) Fall back to ad-hoc on-demand run (optional)
        if not self.subnets or not self.sgs:
            raise ECSTileError("No idle tiles and ECS_SUBNETS/ECS_SECURITY_GROUPS not set for ad-hoc launch.")

        env = {
            "PPI": str(meta.get("ppi", 0)),
            "USE_WAIT_TASKS": "True",
            "IS_PSEUDO_TILE": "True" if meta.get("is_pseudo") else "False",
            "USERNAME": username,
            # Any other runtime env like BROKER_URL, REDIS_URL expected by tile
        }
        for k in ("BROKER_URL", "REDIS_URL"):
            v = os.getenv(k)
            if v:
                env[k] = v

        uid, task_arn, ip = run_tile_on_ecs(
            username=username,
            tile_id=tile_id,
            owner=owner,
            parent=parent,
            other_name=meta.get("other_name", "none"),
            extra_env=env
        )
        # You can optionally add this new tile to the registry as busy
        self.mark_status(uid, "busy", owner=username, parent=parent)
        return uid

    def mark_busy(self, tile_id: str):
        self.mark_status(tile_id, "busy")

    def mark_idle(self, tile_id: str):
        # If you use task protection to prevent scale-in while active, be sure to disable it on idle:
        try:
            ecs = _ecs()
            # Requires task ARN; if you track mapping tile_id→task_arn in your registry, use it here.
            task_arn = self._lookup_task_arn(tile_id)
            if task_arn:
                ecs.update_task_protection(
                    cluster=self.cluster, tasks=[task_arn], protectionEnabled=False
                )
        except Exception:
            pass
        self.mark_status(tile_id, "idle")

    def restart(self, tile_id: str):
        """
        Preferred: have the tile execv itself on command (fast “deep clean”).
        Fallback: stop the task and let the Service replace it.
        """
        # Example control plane:
        # post_task_to_tile(tile_id, "self_reset", {})
        try:
            ecs = _ecs()
            task_arn = self._lookup_task_arn(tile_id)
            if task_arn:
                ecs.update_task_protection(cluster=self.cluster, tasks=[task_arn], protectionEnabled=False)
                ecs.stop_task(cluster=self.cluster, task=task_arn, reason="tile restart requested")
        except Exception:
            pass

    def terminate(self, tile_id: str):
        """
        If tiles are managed by a Service for a warm pool, your 'terminate' likely
        means: mark idle and let autoscaler trim. If you truly want it gone now,
        stop the task (Service will replace it; separately lower desiredCount).
        """
        try:
            ecs = _ecs()
            task_arn = self._lookup_task_arn(tile_id)
            if task_arn:
                ecs.update_task_protection(cluster=self.cluster, tasks=[task_arn], protectionEnabled=False)
                ecs.stop_task(cluster=self.cluster, task=task_arn, reason="tile terminated")
        finally:
            self._mark_in_registry(tile_id, "terminated")

    # ---- You’ll implement these lookups in your host registry ----------------
    def _lookup_task_arn(self, tile_id: str) -> Optional[str]:
        """
        Your host should track tile_id -> taskArn (store on READY registration).
        Stub returns None here.
        """
        return None