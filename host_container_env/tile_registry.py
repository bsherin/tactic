import os
use_ecs = os.getenv("USE_ECS_TILES","false").lower() == "true"

if use_ecs:
    import boto3
    ecs = boto3.client("ecs", region_name=os.getenv("AWS_REGION","us-east-2"))
    CLUSTER = os.getenv("ECS_CLUSTER","tactic-cluster")

class TileContainerRegistry():
    def __init__(self):
        self._registry = {}

    def mark_status(self, tile_id, status, task_arn=None, username=None, owner=None, parent=None):
        print("entering mark_status with tile_id:", tile_id, "status:", status, "task_arn:", task_arn, "username:", username, "owner:", owner, "parent:", parent)
        if tile_id not in self._registry:
            self._registry[tile_id] = {"status": "idle"}
        self._registry[tile_id]["status"] = status
        if username is not None:
            self._registry[tile_id]["username"] = username
        if owner is not None:
            self._registry[tile_id]["owner"] = owner
        if parent is not None:
            self._registry[tile_id]["parent"] = parent
        if use_ecs:
            if task_arn is not None:
                self._registry[tile_id]["task_arn"] = task_arn
            self.set_task_protection(tile_id)
        print("leaving mark_status with registry:", self._registry)

    def release_tile(self, tile_id):
        if tile_id in self._registry:
            self._registry[tile_id]["status"] = "idle"
            self._registry[tile_id].pop("username", None)
            self._registry[tile_id].pop("owner", None)
            self._registry[tile_id].pop("parent", None)
            if use_ecs:
                self.set_task_protection(tile_id)

    def get_children(self, parent_id):
        return [tile_id for tile_id, d in self._registry.items() if d.get("parent") == parent_id]

    def get(self, tile_id):
        return self._registry.get(tile_id, {})

    def get_arn(self, tile_id):
        return self._registry.get(tile_id, {}).get("task_arn")

    def deregister(self, tile_id):
        if tile_id in self._registry:
            del self._registry[tile_id]

    def set_task_protection(self, tile_id):
        if self._registry["tile_id"]["task_arn"]:
            ecs.update_task_protection(
                cluster=CLUSTER,
                tasks=[self._registry[tile_id]["task_arn"]],
                protectionEnabled=self._registry[tile_id]["status"] == "busy"
            )

    def claim_tile(self, username, owner, parent):
        for tile_id, status in self._registry.items():
            if status == "idle":
                self._registry[tile_id]["username"] = username
                self._registry[tile_id]["owner"] = owner
                self._registry[tile_id]["parent"] = parent
                self.mark_status(tile_id, "busy")
                return tile_id, self._registry[tile_id]["task_arn"]
        return None

    def get_number_of_idle_tiles(self):
        return sum(1 for status in self._registry.values() if status == "idle")

    def get_number_of_busy_tiles(self):
        return sum(1 for status in self._registry.values() if status == "busy")

    def get_status_summary(self):
        idle = self.get_number_of_idle_tiles()
        busy = self.get_number_of_busy_tiles()
        return {
            "idle": idle,
            "busy": busy,
            "total": idle + busy
        }
