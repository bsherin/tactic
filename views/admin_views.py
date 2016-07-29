from flask import render_template, request, jsonify
from flask_login import login_required, current_user
from tactic_app import app, use_ssl, shared_dicts
from tactic_app.users import User
from docker_functions import cli
import traceback

repository_user = User.get_user_by_username("repository")

@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == repository_user.get_id():
        return render_template("admin_interface.html", use_ssl=str(use_ssl))
    else:
        return "not authorized"

@app.route('/clear_user_containers', methods=['GET', 'POST'])
@login_required
def clear_user_containers():
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
        return jsonify({"success": False, "message": error - string, "alert_type": "alert-warning"})

    return jsonify({"success": True, "message": "User Containers Cleared", "alert_type": "alert-success"})