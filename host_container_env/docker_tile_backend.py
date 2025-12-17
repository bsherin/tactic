# backends/docker_backend.py
import os, uuid
from typing import Dict, Tuple, Optional

# Reuse your existing helpers
import docker_functions  # your module
from abstract_tile_backend import TileBackend

creds = {
        "AccessKeyId": "ak",
        "SecretAccessKey": "sak",
        "SessionToken": "token",
        "region": "us-east-2",
}

class DockerTileBackend(TileBackend):
    IMAGE = "bsherin/tactic-tile"

    def __init__(self, tile_registry, worker):
        # self.resources_dir = os.getenv("TRUE_HOST_RESOURCES_DIR", "/srv/tactic/resources")
        self.user_pool_dir = None
        self.tile_registry = tile_registry
        self.worker = worker

    def launch(self, username: str,
               owner: Optional[str],
               parent: Optional[str],
               tile_id: Optional[str],
               meta:Dict,
               project_name: Optional[str] = None,
               tile_name: Optional[str] = None):
        tid, _ = self.tile_registry.claim_tile(username, owner, parent, project_name=project_name, tile_name=tile_name)
        if tid:
            return tid, "", creds
        env = {
            "RUNNING_ON_AWS": False
        }

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
            publish_all_ports=True,
            special_unique_id=unique_id,

        )

        args = {
            "username": username,
            "owner": owner,
            "parent": parent,
            "tile_name": tile_name,
            "project_name": project_name
        }
        self.tile_registry.mark_status(tile_container_id, "busy", **args)
        return tile_container_id, "", creds

    def restart(self, tile_id: str):
        tdata = self.tile_registry.get_container_dict(tile_id)
        self.worker.post_task(tile_id, "restart", {})
        # self.worker.post_task(f"kill_{tile_id}", "restart", {})
        return tdata

    def terminate(self, tile_id: str):
        try:
            cont = docker_functions.get_container(tile_id)
            docker_functions.safe_remove(cont)
        except Exception:
            pass