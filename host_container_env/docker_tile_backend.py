# backends/docker_backend.py
import os, uuid
from typing import Dict, Tuple, Optional

# Reuse your existing helpers
import docker_functions  # your module
from abstract_tile_backend import TileBackend

class DockerTileBackend(TileBackend):
    IMAGE = "bsherin/tactic-tile"

    def __init__(self, tile_registry, worker):
        self.resources_dir = os.getenv("TRUE_HOST_RESOURCES_DIR", "/srv/tactic/resources")
        # self.user_pool_dir = docker_functions.get_user_pool_dir()
        # self.user_pool_dir = os.getenv("TRUE_HOST_POOL_DIR", "/tacticdata4/pool")
        self.user_pool_dir = None
        self.tile_registry = tile_registry
        self.worker = worker

    def launch(self, username: str,
               owner: Optional[str],
               parent: Optional[str],
               tile_id: Optional[str],
               meta: Dict) -> Tuple[str, str]:
        tid, _ = self.tile_registry.claim_tile(username, owner, parent)
        if tid:
            return tid, "", {}
        env = {
            "CHUNK_SIZE": os.getenv("CHUNK_SIZE", 100),
            "RETRIES": os.getenv("RETRIES", 60),
            "RUNNING_ON_AWS": False
        }

        volumes = {
            self.resources_dir: {"bind": "/root/resources", "mode": "ro"},
        }
        if self.user_pool_dir:
            volumes[self.user_pool_dir] = {"bind": "/mydisk", "mode": "rw"}

        other     = meta.get("other_name", "none")
        unique_id = tile_id or f"tile_{str(uuid.uuid4())}"

        tile_container_id, docker_id = docker_functions.create_container(
            "bsherin/tactic-tile",
            network_mode="bridge",
            owner=owner,
            parent=parent,
            other_name=other,
            username=username,
            env_vars=env,
            volume_dict=volumes,
            publish_all_ports=True,
            special_unique_id=unique_id
        )
        self.tile_registry.mark_status(tile_container_id, "busy", None, username=username, owner=owner, parent=parent, register_heartbeat=True)
        return tile_container_id, "", {}

    def mark_busy(self, tile_id: str):
        self.tile_registry.mark_status(tile_id, "busy")
        return

    def restart(self, tile_id: str):
        tdata = self.tile_registry.get_container_dict(tile_id)
        self.worker.post_task(tile_id, "restart", {})
        # self.worker.post_task(f"kill_{tile_id}", "restart", {})
        return tdata

    def mark_idle(self, tile_id: str):
        self.tile_registry.mark_status(tile_id, "idle")
        return

    def terminate(self, tile_id: str):
        try:
            cont = docker_functions.get_container(tile_id)
            docker_functions.safe_remove(cont)
        except Exception:
            pass