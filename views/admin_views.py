from flask import render_template, jsonify, send_file
from flask_login import login_required, current_user
from tactic_app import app, use_ssl, create_megaplex
from tactic_app.host_workers import global_tile_manager
from tactic_app.users import User, load_user, get_all_users, remove_user
from user_manage_views import ResourceManager
from tactic_app.docker_functions import cli, destroy_container, container_owner
from docker_cleanup import do_docker_cleanup
import tactic_app
import traceback


repository_user = User.get_user_by_username("repository")
global_tile_manager = tactic_app.shared_dict["global_tile_manager"]

class ContainerManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/reset_server/<user_manage_id>', "reset_server", login_required(self.reset_server),
                         methods=['get'])
        app.add_url_rule('/clear_user_containers/<user_manage_id>', "clear_user_containers",
                         login_required(self.clear_user_containers), methods=['get'])
        app.add_url_rule('/destroy_container/<container_id>', "kill_container",
                         login_required(self.kill_container), methods=['get'])
        app.add_url_rule('/container_logs/<container_id>', "container_logs",
                         login_required(self.container_logs), methods=['get'])
        app.add_url_rule('/refresh_container_table', "refresh_container_table",
                         login_required(self.refresh_container_table), methods=['get'])

    def clear_user_containers(self, user_manage_id):
        tactic_image_names = ["tactic_tile_image", "tactic_main_image"]
        tactic_image_ids = {}
        for iname in tactic_image_names:
            tactic_image_ids[iname] = cli.images.get(iname).id

        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            self.show_um_message("removing user containers", user_manage_id)
            all_containers = cli.containers.list(all=True)
            for cont in all_containers:
                if cont.attrs["Image"] == tactic_image_ids["tactic_main_image"]:
                    self.show_um_message("removing main container " + cont.id, user_manage_id)
                    cont.remove(force=True)
                    continue
                if cont.attrs["Image"] == tactic_image_ids["tactic_tile_image"]:
                    if not cont.id == global_tile_manager.test_tile_container_id:
                        self.show_um_message("removing tile container " + cont.id, user_manage_id)
                        cont.remove(force=True)
                    continue
                # if cont.attrs["Image"] == cont.attrs["ImageID"]:
                #     self.show_um_message("removing image container " + cont["Id"], user_manage_id)
                #     cli.remove_container(cont["Id"], force=True)
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.clear_um_message(user_manage_id)
        self.update_selector_list()
        return jsonify({"success": True, "message": "User Containers Cleared", "alert_type": "alert-success"})

    def reset_server(self, user_manage_id):
        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            self.show_um_message("removing all containers", user_manage_id)
            do_docker_cleanup()
            self.show_um_message("recreating the megaplex", user_manage_id)
            create_megaplex()
            self.show_um_message("initializing the global tile manager", user_manage_id)
            global_tile_manager.initialize()
            self.show_um_message("getting default tiles", user_manage_id)
            global_tile_manager.get_all_default_tiles()
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.clear_um_message(user_manage_id)
        self.update_selector_list()
        return jsonify({"success": True, "message": "Server successefully reset", "alert_type": "alert-success"})

    def kill_container(self, container_id):
        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            destroy_container(container_id)
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
        self.update_selector_list()
        return jsonify({"success": True, "message": "Container Destroeyd", "alert_type": "alert-success"})

    def container_logs(self, container_id):
        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            log_text = cli.containers.get(container_id).logs()
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
        return jsonify({"success": True, "message": "Got Logs", "log_text": log_text, "alert_type": "alert-success"})

    def refresh_container_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

    # noinspection PyMethodOverriding
    def build_resource_array(self):
        tactic_image_names = ["tactic_tile_image", "tactic_main_image", "tactic_megaplex_image", "forwarder_image"]
        image_id_names = {}
        for iname in tactic_image_names:
            image_id_names[cli.images.get(iname).id] = iname

        larray = [["Id", "Name", "Image", "Owner", "Status", "Created"]]
        all_containers = cli.containers.list(all=True)
        for cont in all_containers:
            owner_id = container_owner[cont.id]
            if owner_id == "host":
                owner_name = "host"
            elif owner_id == "system":
                owner_name = "system"
            else:
                owner_name = load_user(owner_id).username
            larray.append([cont.short_id, cont.attrs["Name"],
                           image_id_names[cont.attrs["Image"]],
                           owner_name, cont.status, cont.attrs["Created"]])
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

container_manager = ContainerManager("container")


class UserManager(ResourceManager):
    def add_rules(self):
        app.add_url_rule('/refresh_user_table', "refresh_user_table",
                         login_required(self.refresh_user_table), methods=['get'])
        app.add_url_rule('/delete_user/<userid>', "delete_user",
                         login_required(self.delete_user), methods=['get', "post"])

    def refresh_user_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

    def delete_user(self, userid):
        result = remove_user(userid)
        self.update_selector_list()
        return jsonify(result)

    def build_resource_array(self):
        user_list = get_all_users()
        larray = [["_id", "username", "full_name", "email"]]
        for user in user_list:
            urow = []
            for field in larray[0]:
                if field in user:
                    urow.append(str(user[field]))
                else:
                    urow.append("")
            larray.append(urow)
        return larray

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result


user_manager = UserManager("user")


@app.route('/request_update_admin_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_admin_selector_list(res_type):
    if res_type == "container":
        the_html = container_manager.request_update_selector_list()
    elif res_type == "user":
        the_html = user_manager.request_update_selector_list()
    return jsonify({"html": the_html})


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == repository_user.get_id():
        return render_template("admin_interface.html", use_ssl=str(use_ssl))
    else:
        return "not authorized"

