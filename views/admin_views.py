from flask import render_template, jsonify, send_file
from flask_login import login_required, current_user
from tactic_app import app, use_ssl, shared_dicts, create_megaplex, host_ip
from tactic_app import shared_dicts
from tactic_app.users import User, load_user
from user_manage_views import ResourceManager
from tactic_app.docker_functions import cli, destroy_container, container_owners
from docker_cleanup import do_docker_cleanup
import traceback

repository_user = User.get_user_by_username("repository")

class ContainerManager(ResourceManager):

    def add_rules(self):
        app.add_url_rule('/reset_server', "reset_server", login_required(self.reset_server),
                         methods=['get'])
        app.add_url_rule('/clear_user_containers', "clear_user_containers", login_required(self.clear_user_containers), methods=['get'])
        app.add_url_rule('/destroy_container/<container_id>', "kill_container", login_required(self.kill_container), methods=['get'])
        app.add_url_rule('/container_logs/<container_id>', "container_logs", login_required(self.container_logs), methods=['get'])
        app.add_url_rule('/refresh_container_table', "refresh_container_table", login_required(self.refresh_container_table),
                         methods=['get'])

    def clear_user_containers(self):
        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            all_containers = cli.containers(all=True)
            for cont in all_containers:
                if cont["Image"] in ["tactic_main_image"]:
                    cli.remove_container(cont["Id"], force=True)
                    continue
                if cont["Image"] in ["tactic_tile_image"]:
                    if not cont["Id"] == shared_dicts.test_tile_container_id:
                        cli.remove_container(cont["Id"], force=True)
                    continue
                if cont["Image"] == cont["ImageID"]:
                    cli.remove_container(cont["Id"], force=True)
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

        self.update_selector_list()
        return jsonify({"success": True, "message": "User Containers Cleared", "alert_type": "alert-success"})

    def reset_server(self):
        if not (current_user.get_id() == repository_user.get_id()):
            return jsonify({"success": False, "message": "not authorized", "alert_type": "alert-warning"})
        try:
            do_docker_cleanup()
            create_megaplex()
            shared_dicts.initialize_globals()
            shared_dicts.get_all_default_tiles()
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})

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
            log_text = cli.logs(container_id)
        except Exception as ex:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}</pre>"
            error_string = template.format(type(ex).__name__, ex.args)
            error_string += traceback.format_exc()
            return jsonify({"success": False, "message": error_string, "alert_type": "alert-warning"})
        return jsonify({"success": True, "message": "Got Logs", "log_text": log_text, "alert_type": "alert-success"})

    def refresh_container_table(self):
        self.update_selector_list()
        return jsonify({"success": True})

    def build_resource_array(self):
        larray = [["Name", "Image", "Owner", "Status", "Id"]]
        all_containers = cli.containers(all=True)
        for cont in all_containers:
            owner_id = container_owners[cont["Id"]]
            if owner_id == "host":
                owner_name = "host"
            else:
                owner_name = load_user(owner_id).username
            larray.append([cont["Names"][0], cont["Image"], owner_name, cont["Status"], cont["Id"]])
        return larray

    def build_html_table_from_data_list(self, data_list, title=None):
        the_html = "<table class='tile-table table sortable table-striped table-bordered table-condensed'>"
        if title is not None:
            the_html += "<caption>{0}</caption>".format(title)
        the_html += "<thead><tr>"
        for c in data_list[0]:
            the_html += "<th>{0}</th>".format(c)
        the_html += "</tr><tbody>"
        for r in data_list[1:]:
            the_html += "<tr class='selector-button {0}-selector-button admin-table-row' id='{0}-selector-{1}'>".format(self.res_type,
                                                                                                        r[0])
            for c in r:
                the_html += "<td>{0}</td>".format(c)
            the_html += "</tr>"
        the_html += "</tbody></table>"
        return the_html

    def request_update_selector_list(self, user_obj=None):
        res_array = self.build_resource_array()
        result = self.build_html_table_from_data_list(res_array)
        return result

container_manager = ContainerManager("container")

@app.route('/request_update_admin_selector_list/<res_type>', methods=['GET'])
@login_required
def request_update_admin_selector_list(res_type):
    if res_type == "container":
        return container_manager.request_update_selector_list()
    return ""


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == repository_user.get_id():
        return render_template("admin_interface.html", use_ssl=str(use_ssl))
    else:
        return "not authorized"


@app.route('/get_admin_resource_module_template', methods=['get'])
@login_required
def get_admin_resource_module_template():
    return send_file("templates/admin_resource_module_template.html")