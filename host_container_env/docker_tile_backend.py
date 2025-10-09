# backends/docker_backend.py
import os, uuid
from typing import Dict, Tuple, Optional

# Reuse your existing helpers
import docker_functions  # your module
from abstract_tile_backend import TileBackend

class DockerTileBackend(TileBackend):
    IMAGE = "bsherin/tactic-tile"  # your tag logic already handled inside create_container()

    def __init__(self, tile_registry):
        # Any local paths you need can be read from env or hardcoded for dev.
        self.resources_dir = os.getenv("TRUE_HOST_RESOURCES_DIR", "/srv/tactic/resources")
        self.user_pool_dir = os.getenv("POOL_DIR", "/tacticdata4/pool")
        self.tile_registry = None

    def launch(self, username: str, owner: Optional[str], parent: Optional[str], tile_id: Optional[str], meta: Dict) -> Tuple[str, str]:
        env = {
            "PPI": str(meta.get("ppi", 0)),
            "USE_WAIT_TASKS": "True",
            "IS_PSEUDO_TILE": "True" if meta.get("is_pseudo") else "False",
            "USERNAME": username,
        }

        # Minimal volumes for local dev (match your compose if you like)
        volumes = {
            self.resources_dir: {"bind": "/root/resources", "mode": "ro"},
        }
        if self.user_pool_dir:
            volumes[self.user_pool_dir] = {"bind": "/mydisk", "mode": "rw"}

        owner     = meta.get("owner", "host")
        parent    = meta.get("parent", "host")
        other     = meta.get("other_name", "none")
        unique_id = tile_id or str(uuid.uuid4())

        # Your existing function already sets labels, tags, arch, etc.
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
        return tile_container_id

    def mark_busy(self, tile_id: str):
        # no-op for local; your host registry tracks this
        return

    def mark_idle(self, tile_id: str):
        # no-op for local; your host registry tracks this
        return

    def restart(self, tile_id: str):
        """
        Prefer to tell the tile to self-reset via MQ (execv) to mirror prod.
        Fallback: if you have a helper to restart the container, call it here.
        """
        # Example (if you have a control path):
        # post_task_to_tile(tile_id, "self_reset", {})
        try:
            docker_functions.restart_container_by_label("my_id", tile_id)  # if you have such a helper
        except Exception:
            pass

    def terminate(self, tile_id: str):
        # Same as restart: either signal the tile, or remove the container by label.
        try:
            docker_functions.remove_container_by_label("my_id", tile_id)
        except Exception:
            pass