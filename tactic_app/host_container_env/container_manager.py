
import re
import os
from datetime import datetime
from flask import jsonify, request
from flask_login import login_required, current_user
from tactic_app import app  # create_megaplex
from users import User, load_user
from resource_manager import ResourceManager
from docker_functions import cli, destroy_container, container_owner, get_log
from docker_functions import container_id, container_memory_usage, restart_container
from docker_functions import container_other_name, tactic_image_names
from exception_mixin import generic_exception_handler
# from docker_cleanup import do_docker_cleanup
import tactic_app

admin_user = User.get_user_by_username("admin")
CHUNK_SIZE = int(int(os.environ.get("CHUNK_SIZE")) / 2)

import loaded_tile_management


class ContainerManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/reset_server/<library_id>', "reset_server", login_required(self.reset_server),
                         methods=['get'])
        app.add_url_rule('/clear_user_containers/<library_id>', "clear_user_containers",
                         login_required(self.clear_user_containers), methods=['get'])
        app.add_url_rule('/kill_container/<cont_id>', "kill_container",
                         login_required(self.kill_container), methods=['get'])
        app.add_url_rule('/container_logs/<cont_id>', "container_logs",
                         login_required(self.container_logs), methods=['get'])
        app.add_url_rule('/grab_container_list_chunk', "grab_container_list_chunk",
                         login_required(self.grab_container_list_chunk), methods=['get', 'post'])

    def clear_user_containers(self, library_id):
        tactic_image_names = ["bsherin/tactic:tile", "bsherin/tactic:main", "bsherin/tactic:module_viewer"]
        tactic_image_ids = {}
        for iname in tactic_image_names:
            tactic_image_ids[iname] = cli.images.get(iname).id

        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            self.show_um_message("removing user containers", library_id, timeout=None)
            all_containers = cli.containers.list(all=True)
            for cont in all_containers:
                if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic:main"]:
                    self.show_um_message("removing main container " + cont.attrs["Name"], library_id, timeout=None)
                    cont.remove(force=True)
                    continue
                if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic:tile"]:
                    the_id = container_id(cont)
                    if not the_id == "tile_test_container":
                        self.show_um_message("removing tile container " + cont.attrs["Name"],
                                             library_id, timeout=None)
                        cont.remove(force=True)
                    continue
                if cont.attrs["Image"] == tactic_image_ids["bsherin/tactic:module_viewer"]:
                    the_id = container_id(cont)
                    if not the_id == "tile_test_container":
                        self.show_um_message("removing module viewer container " + cont.attrs["Name"],
                                             library_id, timeout=None)
                        cont.remove(force=True)
                    continue
                # if cont.attrs["Image"] == cont.attrs["ImageID"]:
                #     self.show_um_message("removing image container " + cont["Id"], library_id)
                #     cli.remove_container(cont["Id"], force=True)
        except Exception as ex:
            return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error clearing user containers")

        self.clear_um_message(library_id)
        self.refresh_selector_list()
        return jsonify({"success": True, "message": "User Containers Cleared", "alert_type": "alert-success"})

    def reset_server(self, library_id):
        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            self.show_um_message("Restarting the host container", library_id)
            restart_container("host")
            # self.show_um_message("removing all containers", library_id)
            # do_docker_cleanup()
            # self.show_um_message("recreating the megaplex", library_id)
            # create_megaplex()
            # self.show_um_message("initializing the global tile manager", library_id)
            # loaded_tile_management.initialize()
            # self.show_um_message("getting default tiles", library_id)
            # global_tile_manager.get_all_default_tiles()
        except Exception as ex:
            return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error resetting server")

        self.clear_um_message(library_id)
        self.refresh_selector_list()
        return jsonify({"success": True, "message": "Server successefully reset", "alert_type": "alert-success"})

    def kill_container(self, cont_id):
        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            destroy_container(cont_id)
        except Exception as ex:
            return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error killing container")
        self.refresh_selector_list()
        return jsonify({"success": True, "message": "Container Destroeyd", "alert_type": "alert-success"})

    def container_logs(self, cont_id):
        print("in container_logs in container_manager")
        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            print("passed admin_user test")
            log_text = get_log(cont_id).decode()
            print("got the logs")
        except Exception as ex:
            print("got an exception")
            return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error getting container logs")
        return jsonify({"success": True, "message": "Got Logs", "log_text": log_text, "alert_type": "alert-success"})

    def build_res_dict(self, cont):
        image_id_names = {}
        for iname in tactic_image_names:
            try:
                image_id_names[cli.images.get(iname).id] = iname
            except:
                print("no image " + iname)
        owner_id = container_owner(cont)
        if owner_id == "host":
            owner_name = "host"
        elif owner_id == "system":
            owner_name = "system"
        else:
            owner_name = load_user(owner_id).username
        image_id = cont.attrs["Image"]
        if image_id in image_id_names:
            image_name = image_id_names[image_id]
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

    def get_uptime_string(self, created_string):
        cstring = re.sub(r"\..*$", "", created_string)  # get rid of microseconds and extra chars
        dt = datetime.strptime(cstring, "%Y-%m-%dT%H:%M:%S")
        n = datetime.now()
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

    def grab_container_list_chunk(self):
        if not current_user.get_id() == admin_user.get_id():
            return

        def sort_regular_key(item):
            if sort_field not in item:
                return ""
            return item[sort_field]

        search_spec = request.json["search_spec"]
        row_number = request.json["row_number"]
        search_text = search_spec['search_string']
        reg = re.compile(".*" + search_text + ".*", re.IGNORECASE)

        all_containers = cli.containers.list(all=True)
        filtered_res = []
        match_keys = ["Other_name", "Name", "Image", "Owner", "Status"]
        for cont in all_containers:
            new_row = self.build_res_dict(cont)
            for k in match_keys:
                if reg.match(new_row[k], re.IGNORECASE):
                    filtered_res.append(new_row)
                    break

        if search_spec["sort_direction"] == "ascending":
            reverse = False
        else:
            reverse = True

        sort_field = search_spec["sort_field"]
        sort_key_func = sort_regular_key

        sorted_results = sorted(filtered_res, key=sort_key_func, reverse=reverse)

        chunk_start = int(row_number / CHUNK_SIZE) * CHUNK_SIZE
        chunk_list = sorted_results[chunk_start: chunk_start + CHUNK_SIZE]
        chunk_dict = {}
        for n, r in enumerate(chunk_list):
            chunk_dict[n + chunk_start] = r
        return jsonify(
            {"success": True, "chunk_dict": chunk_dict, "num_rows": len(sorted_results)})

