
from qworker import task_worthy

use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

class TileContainerManagementMixin:

    @task_worthy
    def tile_ready(self, data):
        self.tile_registry.mark(data["my_id"], "idle", task_arn=data["my_arn"])
        self.post_task(the_id, "ack_ready", {})

    @task_worthy
    def provide_tile(self, data):
        the_id = self.tile_backend.launch(
            username=data["username"],
            owner=data["owner"],
            parent=data.get("parent", "host"),
            meta=data.get("meta", {})
        )
        if the_id:
            return {"success": True, "the_id": the_id}

        return {"success": False, "message": "Couldn't create tile"}
