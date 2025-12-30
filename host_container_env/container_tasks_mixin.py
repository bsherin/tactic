import re
from datetime import datetime
from aws_task_helpers import get_ssm_parameter

LIBRARY_CHUNK_SIZE = int(get_ssm_parameter("LIBRARY_CHUNK_SIZE", "25"))

from qworker import task_worthy

from docker_functions import cli, restart_container, destroy_container, container_id, container_owner
from docker_functions import container_other_name
from aws_detection import on_aws

from exception_mixin import NotAuthorizedError

from users import load_user

base_user_image_names = ["bsherin/tactic-tile", "bsherin/tactic-main", "bsherin/tactic-module-viewer"]

tactic_user_image_names = []
for base_name in base_user_image_names:
    tactic_user_image_names.append(f"{base_name}:x86")
for base_name in base_user_image_names:
    tactic_user_image_names.append(f"{base_name}:arm64")

class ContainerTasksMixin:

    @task_worthy
    def clear_user_containers_task(self, data):
        admin_id = data["user_id"]
        admin_user = self.get_user_from_data(data)
        tactic_image_ids = {}
        for iname in tactic_user_image_names:
            tactic_image_ids[iname] = cli.images.get(iname).id
        if not admin_user.username == "admin":
            raise NotAuthorizedError()
        self.emit_status_message("removing user containers", admin_id)
        all_containers = cli.containers.list(all=True)
        for cont in all_containers:
            if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic-main"]:
                self.emit_status_message("removing main container " + cont.attrs["Name"], admin_id)
                cont.remove(force=True)
                continue
            if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic-tile"]:
                the_id = container_id(cont)
                if not the_id == "tile_test_container":
                    self.emit_status_message("removing tile container " + cont.attrs["Name"], admin_id)
                    cont.remove(force=True)
                continue
            if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic-module-viewer"]:
                the_id = container_id(cont)
                if not the_id == "tile_test_container":
                    self.emit_status_message("removing module viewer container " + cont.attrs["Name"], admin_id)
                    cont.remove(force=True)
                continue

        self.emit_clear_status(admin_id)
        self.refresh_selector_list(admin_id)
        return {"success": True, "message": "User Containers Cleared", "alert_type": "alert-success"}

    @task_worthy
    def reset_server_task(self, data):
        admin_user = self.get_user_from_data(data)
        admin_id = data["user_id"]
        if not admin_user.username == "admin":
            raise NotAuthorizedError()
        self.emit_status_message("Restarting the host container", admin_id)
        restart_container("host")

        self.emit_clear_status(admin_id)
        self.refresh_selector_list(admin_id)
        return {"success": True, "message": "Server successefully reset", "alert_type": "alert-success"}

    @task_worthy
    def set_desired_idle_tiles(self, data):
        admin_user = self.get_user_from_data(data)
        target_value = data["target_value"]
        if not admin_user.username == "admin":
            raise NotAuthorizedError()
        self.tile_registry.set_desired_idle(target_value)
        return {"success": True, "message": "new idle value set", "alert_type": "alert-success"}

    @task_worthy
    def get_desired_idle_tiles(self, data):
        admin_user = self.get_user_from_data(data)
        if not admin_user.username == "admin":
            raise NotAuthorizedError()
        val = self.tile_registry.desired_idle
        return {"success": True, "target_value": val}

    @task_worthy
    def kill_container_task(self, data):
        admin_user = self.get_user_from_data(data)
        cont_id = data["cont_id"]
        admin_id = data["user_id"]
        if not admin_user.username == "admin":
            raise NotAuthorizedError()
        if self.tile_registry.exists(cont_id):
            self.destroy_tile(cont_id, notify=False)
        else:
            destroy_container(cont_id)
        self.refresh_selector_list(admin_id)
        return {"success": True, "message": "Container Destroeyd", "alert_type": "alert-success"}

    def build_container_res_dict(self, cont):
        owner_id = container_owner(cont)
        if owner_id == "host":
            owner_name = "host"
        elif owner_id == "system":
            owner_name = "system"
        else:
            owner_name = load_user(owner_id).username
        image_id = cont.attrs["Image"]
        if image_id in self.image_id_names:
            image_name = self.image_id_names[image_id]
        else:
            image_name = image_id

        new_row = {"Id": container_id(cont),
                   "Other_name": container_other_name(cont),
                   "Name": cont.attrs["Name"],
                   "Image": image_name,
                   "Owner": owner_name,
                   "Status": cont.status,
                   "Uptime": self.get_uptime_string(cont.attrs["Created"])
                   }
        return new_row

    @staticmethod
    def get_uptime_string_from_dt(dt):
        if dt.tzinfo is None:
            n = datetime.now()
        else:
            n = datetime.now(dt.tzinfo)
        td = n - dt
        if td.days >= 1:
            daypart = td.seconds / 86400
            return f"{td.days + daypart:.1f} days"
        hours = int(td.seconds / 3600)
        if hours >= 1:
            secs = td.seconds - hours * 3600
            hourpart = secs / 3600
            return f"{hours + hourpart:.1f} hours"
        minutes = int(td.seconds / 60)
        if minutes >= 1:
            secs = td.seconds - minutes * 60
            minpart = secs / 60
            return f"{minutes + minpart:.1f} minutes"
        return f"{int(td.seconds)} seconds"

    def get_uptime_string(self, created_string):
        cstring = re.sub(r"\..*$", "", created_string)  # get rid of microseconds and extra chars
        dt = datetime.strptime(cstring, "%Y-%m-%dT%H:%M:%S")
        return self.get_uptime_string_from_dt(dt)

    def get_tile_container_chunk(self):
        tile_chunks = []
        for tile_id, info in self.tile_registry.get_items():
            if "created_dt" not in info or not type(info["created_dt"]) == datetime:
                up_time = "unknown"
            else:
                up_time = self.get_uptime_string_from_dt(info["created_dt"])
            new_row = {"Id": tile_id,
                       "Other_name": "",
                       "Name": "",
                       "Image": "bsherin/tactic-tile:x86",
                       "Owner": info.get("username", ""),
                       "Status": info.get("status"),
                       "Uptime": up_time}
            tile_chunks.append(new_row)
        return tile_chunks

    @task_worthy
    def grab_container_list_chunk_task(self, data):
        admin_user = self.get_user_from_data(data)
        if not admin_user.username == "admin":
            return {"success": False, "message": "not authorized", "alert_type": "alert-warning"}
        def sort_regular_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        search_spec = data["search_spec"]
        row_number = data["row_number"]
        search_text = search_spec['search_string']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)

        all_containers = cli.containers.list(all=True)
        filtered_res = []
        match_keys = ["Other_name", "Name", "Image", "Owner", "Status"]
        self.image_id_names = {}
        all_images = cli.images.list(filters={"dangling": False})
        for img in all_images:
            if len(img.tags) > 0:
                self.image_id_names[img.id] = img.tags[0]

        for cont in all_containers:
            new_row = self.build_container_res_dict(cont)
            for k in match_keys:
                if reg.match(new_row[k], re.IGNORECASE):
                    filtered_res.append(new_row)
                    break
        if on_aws:
            for row in self.get_tile_container_chunk():
                for k in match_keys:
                    if reg.match(row[k], re.IGNORECASE):
                        filtered_res.append(row)
                        break

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        sort_field = search_spec["sort_field"]
        sort_key_func = sort_regular_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / LIBRARY_CHUNK_SIZE) * LIBRARY_CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: chunk_start + LIBRARY_CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r
        return {"success": True, "chunk_dict": chunk_dict, "num_rows": len(sorted_results)}