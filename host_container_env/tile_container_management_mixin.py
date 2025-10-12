
from qworker import task_worthy
import os
from docker_functions import delete_list_of_queues
import tactic_app

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

class TileContainerManagementMixin:

    @task_worthy
    def tile_ready(self, data):
        self.tile_registry.mark(data["my_id"], "idle", task_arn=data["my_arn"])
        self.post_task(the_id, "ack_ready", {})

    @task_worthy
    def restart_tile_container(self, data):
        the_id = data["tile_id"]
        if not the_id:
            return {"success": False, "message": "No tile ID provided"}

        self.tile_backend.restart(the_id)
        return {"success": True, "message": f"Tile {the_id} restarted"}

    def destroy_child_tiles(self, parent_id):
        print("Destroying child tiles of:", parent_id)
        child_tiles = self.tile_registry.get_children(parent_id)
        print("Found child tiles:", child_tiles)
        print("registry before destruction:", self.tile_registry._registry)
        for child in child_tiles:
            self.destroy_tile(child)
        return {"success": True, "message": f"Destroyed {len(child_tiles)} child tiles of {parent_id}"}

    @task_worthy
    def provide_tile(self, data):
        print("in provide_tile with data:", data)
        the_id = self.tile_backend.launch(
            username=data["username"],
            owner=data["owner"],
            parent=data.get("parent", "host"),
            tile_id=None,
            meta=data.get("meta", {})
        )
        print("Tile launched with ID:", the_id)
        if the_id:
            return {"success": True, "the_id": the_id}

        return {"success": False, "message": "Couldn't create tile"}

    def destroy_tile(self, tile_id):
        self.tile_backend.terminate(tile_id)
        tactic_app.health_tracker.deregister_container(tile_id)
        qlist = [tile_id, tile_id + "_wait", "kill_" + tile_id]
        delete_list_of_queues(qlist)
        self.tile_registry.deregister(tile_id)
        return {"success": True, "message": f"Tile {tile_id} destroyed"}
