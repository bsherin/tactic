
import sys
import datetime
import copy
import re

from tactic_app import app  # global_stuff

from flask import render_template, jsonify, url_for, request
from flask_login import login_required, current_user
import loaded_tile_management

from js_source_management import js_source_dict, _develop, css_source

import datetime
tstring = datetime.datetime.utcnow().strftime("%Y-%H-%M-%S")

@app.route('/view_code/<code_name>')
@login_required
def view_code(code_name):
    javascript_source = url_for('static', filename=js_source_dict["code_viewer_react"])
    return render_template("library/resource_viewer_react.html",
                           resource_name=code_name,
                           develop=str(_develop),
                           has_openapi_key=current_user.has_openapi_key,
                           javascript_source=javascript_source,
                           css_source=css_source("code_viewer_react"),
                           version_string=tstring)

@app.route('/repository_view_code/<list_name>')
@login_required
def repository_view_code(self, code_name):
        user_obj = current_user
        javascript_source = url_for('static', filename=js_source_dict["code_viewer_react"])
        return render_template("library/resource_viewer_react.html",
                               resource_name=code_name,
                               include_metadata=True,
                               include_right=True,
                               include_above_main_area=False,
                               read_only=True,
                               develop=str(_develop),
                               is_repository=True,
                               javascript_source=javascript_source,
                               css_source=css_source("code_viewer_react"),
                               uses_codemirror="True",
                               version_string=tstring)
