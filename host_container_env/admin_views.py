from flask import render_template, request
import json
from flask_login import login_required, current_user
from tactic_app import app
from mongo_db_fs import database_type
from users import User
from utils import utcnow
from rabbit_manage import get_pika_connection_with_retries
from service_controls import apply_log_level, CONTROL_EXCHANGE
from tactic_logging import log
from redis_tools import redis_client as r
from aws_detection import on_aws

tstring = utcnow().strftime("%Y-%H-%M-%S")

admin_user = User.get_user_by_username("admin")

from js_source_management import js_source_dict, _develop, css_source


@app.route('/admin_interface', methods=['GET', 'POST'])
@login_required
def admin_interface():
    if current_user.get_id() == admin_user.get_id():
        return render_template("library/library_home_react.html",
                               on_aws=on_aws,
                               database_type=database_type,
                               repository_type="",
                               develop=str(_develop),
                               is_remote="no",
                               version_string=tstring,
                               page_title="tactic admin",
                               css_source=css_source("admin_home_react"),
                               module_source=js_source_dict["admin_home_react"])
    else:
        return "not authorized"

@app.route("/set_log_level/<level>", methods=["POST", "GET"])
@login_required
def set_log_level(level):
    if current_user.get_id() == admin_user.get_id():
        log.info("setting log level to", level=level)
        apply_log_level(level)
        r.set("control:log_level", level.upper())
        connection, channel = get_pika_connection_with_retries()
        channel.exchange_declare(exchange=CONTROL_EXCHANGE, exchange_type="fanout", durable=True)
        body = json.dumps({"type": "set_log_level", "level": level}).encode("utf-8")
        channel.basic_publish(exchange=CONTROL_EXCHANGE, routing_key="", body=body)

        return {"status": "ok", "level": level}
    else:
        return "not authorized"