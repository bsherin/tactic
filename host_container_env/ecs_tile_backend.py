# backends/ecs_backend.py
import os, uuid, time
from typing import Dict, Tuple, Optional
import boto3
from botocore.config import Config

from abstract_tile_backend import TileBackend
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

    def __init__(self, tile_registry, worker):
        self.cluster = os.getenv("ECS_CLUSTER", "tactic-cluster")
        self.taskdef = os.getenv("ECS_TILE_TASKDEF", "tactic-tile")  # family only → will use latest ACTIVE rev
        # For ad-hoc launches we still need networking:
        self.subnets = [s.strip() for s in os.getenv("ECS_SUBNETS", "").split(",") if s.strip()]
        self.sgs     = [g.strip() for g in os.getenv("ECS_SECURITY_GROUPS", "").split(",") if g.strip()]
        self.assign_public = os.getenv("ECS_ASSIGN_PUBLIC_IP", "ENABLED")
        self.tile_registry = tile_registry
        self.workd = worker

    def launch(self, username: str, owner: Optional[str], parent: Optional[str], tile_id: Optional[str], meta: Dict) -> Tuple[str, str]:
        # 1) Try to claim a warm tile if your pool exists
        tid, task_arn = self.tile_registry.claim_tile(username, owner, parent)
        if tid:
            print("***Claimed warm tile: ***")
            return tid, task_arn

        print("***Warm tile pool empty, launching ad-hoc ECS tile...***")
        # 2) Fall back to ad-hoc on-demand run (optional)
        if not self.subnets or not self.sgs:
            raise ECSTileError("No idle tiles and ECS_SUBNETS/ECS_SECURITY_GROUPS not set for ad-hoc launch.")

        env = {
            "CHUNK_SIZE": os.getenv("CHUNK_SIZE", 100),
        }
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
            extra_env=env
        )
        # You can optionally add this new tile to the registry as busy
        self.tile_registry.mark_status(uid, "busy", owner=username, parent=parent)
        return uid, task_arn

    def mark_busy(self, tile_id: str):
        self.tile_registry.mark_status(tile_id, "busy")

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
        self.tile_registry.mark_status(tile_id, "idle")

    def restart(self, tile_id: str):
        tdata = self.tile_registry.get(tile_id)
        self.worker.post_task(tile_id, "restart", {})
        self.worker.post_task(f"kill_{tile_id}", "restart", {})
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

    # ---- You’ll implement these lookups in your host registry ----------------
    def _lookup_task_arn(self, tile_id: str) -> Optional[str]:
        self.tile_registry.get_arn(tile_id)
        return None