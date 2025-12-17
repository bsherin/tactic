
from qworker import task_worthy
import os
from docker_functions import delete_list_of_queues
from aws_helpers import get_ssm_parameter

recycle_tiles = get_ssm_parameter("RECYCLE_TILES", "true").lower() == "true"

class TileContainerManagementMixin:

    @task_worthy
    def restart_tile_container(self, data):
        the_id = data["tile_id"]
        if not the_id:
            return {"success": False, "message": "No tile ID provided"}

        self.tile_backend.restart(the_id)
        return {"success": True, "message": f"Tile {the_id} restarted"}

    @task_worthy
    def destroy_child_tiles_task(self, data):
        print("got destroy_child_tiles task", data)
        self.tile_registry.release_child_tiles(data["local_id"])
        return {"success": True, "message": f"Destroyed child tiles of {data['local_id']}"}

    @task_worthy
    def provide_tile(self, data):
        the_id, task_arn, creds = self.tile_backend.launch(
            username=data["username"],
            owner=data["owner"],
            parent=data.get("parent", "host"),
            project_name=data.get("project_name", None),
            tile_name=data.get("tile_name", None),
            tile_id=None,
            meta=data.get("meta", {})
        )
        if the_id:
            return {"success": True, "the_id": the_id, "task_arn": task_arn, "creds": creds}

        return {"success": False, "message": "Couldn't create tile"}

    def destroy_tile(self, tile_id, notify=False, force_terminate=False):
        if recycle_tiles and not force_terminate:
            self.tile_backend.restart(tile_id)
            self.tile_registry.release_tile(tile_id)
            return {"success": True, "message": f"Tile {tile_id} released"}
        self.tile_backend.terminate(tile_id)
        user_id = self.tile_registry.get_container_info(tile_id, "owner")
        self.tile_registry.deregister(tile_id)
        if notify and user_id is not None:
            title = f"Tile {tile_id} has been destroyed."
            message = f"Tile {tile_id} has been destroyed by the host."
            self.add_error_drawer_entry(title, message, user_id)
        return {"success": True, "message": f"Tile {tile_id} destroyed"}
