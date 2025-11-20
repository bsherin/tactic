
from qworker import task_worthy
import os
from docker_functions import delete_list_of_queues
import tactic_app

use_ecs = os.getenv("USE_ECS_TILES", "false").lower() == "true"
recycle_tiles = os.getenv("RECYCLE_TILES", "false").lower() == "true"

class TileContainerManagementMixin:

    # @task_worthy
    # def tile_ready(self, data):
    #     if use_ecs:
    #         self.tile_registry.mark_status(data["my_id"], "idle", task_arn=data["my_arn"])
    #     self.post_task(data["my_id"], "ack_ready", {})

    @task_worthy
    def restart_tile_container(self, data):
        the_id = data["tile_id"]
        if not the_id:
            return {"success": False, "message": "No tile ID provided"}

        self.tile_backend.restart(the_id)
        return {"success": True, "message": f"Tile {the_id} restarted"}

    def destroy_child_tiles(self, parent_id):
        child_tiles = self.tile_registry.get_children(parent_id)
        for child in child_tiles:
            self.destroy_tile(child)
        return {"success": True, "message": f"Destroyed {len(child_tiles)} child tiles of {parent_id}"}

    @task_worthy
    def provide_tile(self, data):
        print("in provide_tile with data:", data)
        the_id, task_arn, creds = self.tile_backend.launch(
            username=data["username"],
            owner=data["owner"],
            parent=data.get("parent", "host"),
            tile_id=None,
            meta=data.get("meta", {})
        )
        print("Tile launched with ID:", the_id)
        if the_id:
            return {"success": True, "the_id": the_id, "task_arn": task_arn, "creds": creds}

        return {"success": False, "message": "Couldn't create tile"}

    def destroy_tile(self, tile_id, notify=False):
        # qlist = [tile_id, tile_id + "_wait", "kill_" + tile_id]
        if recycle_tiles:
            # delete_list_of_queues(qlist)
            self.tile_backend.restart(tile_id)
            self.tile_registry.release_tile(tile_id)
            return {"success": True, "message": f"Tile {tile_id} released"}
        self.tile_backend.terminate(tile_id)
        tactic_app.health_tracker.deregister_container(tile_id)
        user_id = self.tile_registry.get(tile_id).get("owner", None)
        self.tile_registry.deregister(tile_id)
        if notify and user_id is not None:
            title = f"Tile {tile_id} has been destroyed."
            message = f"Tile {tile_id} has been destroyed by the host."
            self.add_error_drawer_entry(title, message, user_id)
        return {"success": True, "message": f"Tile {tile_id} destroyed"}
