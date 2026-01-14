import uuid
from typing import Dict
from tactic_logging import log

import docker_functions
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
        self.user_pool_dir = None
        self.tile_registry = tile_registry
        self.worker = worker

    def request_tile(self, task_packet: Dict):
        tid, _ = self.tile_registry.claim_tile(task_packet)
        if tid:
            self.worker.submit_response(task_packet, {"success": True, "the_id": tid, "task_arn": "", "creds": creds})
        else:
            log.debug("No idle tiles available; queuing request", category="tile_management")
            self.tile_registry.add_to_queue(task_packet)

    def add_container(self):
        env = {
            "RUNNING_ON_AWS": False
        }

        unique_id = f"tile_{str(uuid.uuid4())}"

        tile_container_id, docker_id = docker_functions.create_container(
            "bsherin/tactic-tile",
            network_mode="bridge",
            env_vars=env,
            publish_all_ports=True,
            special_unique_id=unique_id,

        )

        self.tile_registry.mark_status(tile_container_id, "idle", {})
        return

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