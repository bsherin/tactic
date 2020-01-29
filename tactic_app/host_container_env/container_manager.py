
from flask import jsonify
from flask_login import login_required, current_user
from tactic_app import app # create_megaplex
from users import User, load_user
from resource_manager import ResourceManager
from docker_functions import cli, destroy_container, container_owner, get_log
from docker_functions import container_id, container_memory_usage, restart_container
from docker_functions import container_other_name
from exception_mixin import generic_exception_handler
# from docker_cleanup import do_docker_cleanup
import tactic_app

admin_user = User.get_user_by_username("admin")
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

    def clear_user_containers(self, library_id):
        tactic_image_names = ["tactic_tile_image", "tactic_main_image", "module_viewer_image"]
        tactic_image_ids = {}
        for iname in tactic_image_names:
            tactic_image_ids[iname] = cli.images.get(iname).id

        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            self.show_um_message("removing user containers", library_id, timeout=None)
            all_containers = cli.containers.list(all=True)
            for cont in all_containers:
                if cont.attrs["Image"] == tactic_image_ids["tactic_main_image"]:
                    self.show_um_message("removing main container " + cont.attrs["Name"], library_id, timeout=None)
                    cont.remove(force=True)
                    continue
                if cont.attrs["Image"] == tactic_image_ids["tactic_tile_image"]:
                    the_id = container_id(cont)
                    if not the_id == "tile_test_container":
                        self.show_um_message("removing tile container " + cont.attrs["Name"],
                                             library_id, timeout=None)
                        cont.remove(force=True)
                    continue
                if cont.attrs["Image"] == tactic_image_ids["module_viewer_image"]:
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
        if not (current_user.get_id() == admin_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            log_text = get_log(cont_id)
        except Exception as ex:
            return generic_exception_handler.get_traceback_exception_for_ajax(ex, "Error getting container logs")
        return jsonify({"success": True, "message": "Got Logs", "log_text": log_text, "alert_type": "alert-success"})

    def get_resource_data_list(self, user_obj=None):
        tactic_image_names = ["tactic_tile_image", "tactic_main_image", "tactic_megaplex_image",
                              "module_viewer_image", "tactic_host_image"]
        image_id_names = {}
        for iname in tactic_image_names:
            image_id_names[cli.images.get(iname).id] = iname

        result = []

        all_containers = cli.containers.list(all=True)
        for cont in all_containers:
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
                       "Created": cont.attrs["Created"]
                       }
            result.append(new_row)
        return result


