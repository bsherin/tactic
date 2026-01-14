
from qworker import task_worthy, task_worthy_manual_submit
from aws_helpers import get_ssm_parameter
from tactic_logging import log

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
        log.debug("Destroying child tiles", local_id=data["local_id"])
        self.tile_registry.release_child_tiles(data["local_id"])
        return {"success": True, "message": f"Destroyed child tiles of {data['local_id']}"}

    @task_worthy_manual_submit
    def provide_tile(self, data, task_packet):
        task_packet["username"] = data["username"]
        task_packet["owner"]    = data["owner"]
        task_packet["parent"]   = data.get("parent", "host")
        task_packet["project_name"] = data.get("project_name", None)
        task_packet["tile_name"]    = data.get("tile_name", None)
        task_packet["meta"]         = data.get("meta", {})
        self.tile_backend.request_tile(task_packet)

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
