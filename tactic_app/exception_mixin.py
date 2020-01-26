
import traceback
import os
import json
from flask import jsonify

if "IMAGE_NAME" in os.environ:
    if os.environ.get("IMAGE_NAME") == "tactic_tile_image":
        from tile_o_plex import app
    else:
        app = None  # Will be here if in the module_viewer image is set externally

else:
    app = None  # If running on server will be set when app is initialized


class MessagePostException(Exception):
    pass


class ExceptionMixin(object):

    def __init__(self):
        pass

    def do_jsonify(self, msg):
        import flask
        res = {"success": False, "message": msg, "alert_type": "alert-warning"}
        if flask.has_app_context():
            return jsonify(res)
        else:
            with app.app_context():
                return jsonify(res)

    def get_short_exception_dict(self, e, special_string=None):
        msg = self.extract_short_error_message(e, special_string)
        return {"success": False, "message": msg, "alert_type": "alert-warning"}

    def get_traceback_exception_dict(self, e, special_string=None):
        msg = self.get_traceback_message(e, special_string)
        return {"success": False, "message": msg, "alert_type": "alert-warning"}

    def get_exception_for_ajax(self, e, special_string=None):
        msg = self.extract_short_error_message(e, special_string)
        return self.do_jsonify(msg)

    def extract_short_error_message(self, e, special_string=None):
        error_type = type(e).__name__
        if special_string is None:
            special_string = "An error occurred of type"
        result = special_string + ": " + error_type
        if len(e.args) > 0:
            result += " " + str(e.args[0])
        return result

    def get_traceback_message(self, e, special_string=None):
        if special_string is None:
            template = "<pre>An exception of type {0} occured. Arguments:\n{1!r}\n"
        else:
            template = special_string + "<pre>\n" + "An exception of type {0} occurred. Arguments:\n{1!r}\n"
        error_string = template.format(type(e).__name__, e.args)
        error_string += traceback.format_exc() + "</pre>"
        return error_string

    def get_traceback_exception_for_ajax(self, e, special_string=None):
        msg = self.get_traceback_message(e, special_string)
        return self.do_jsonify(msg)


generic_exception_handler = ExceptionMixin()
