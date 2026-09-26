
import traceback
import os
import json
from flask import jsonify

if "IMAGE_NAME" in os.environ:
    if os.environ.get("IMAGE_NAME") == "bsherin/tactic-tile":
        from tile_o_plex import app
    else:
        app = None  # Will be here if in the module_viewer image is set externally

else:
    app = None  # If running on server will be set when app is initialized


class MessagePostException(Exception):
    pass


class TileModuleNotFoundError(Exception):
    pass

class TileMetadataNotFoundError(Exception):
    pass

class NotAuthorizedError(Exception):
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

    @staticmethod
    def get_exception_line_number(e, preferred_filename=None, preferred_filename_prefix=None):
        """Return the most useful source line represented by an exception.

        Syntax errors do not necessarily have a traceback, but do carry their
        source line directly.  For runtime errors, callers may identify the
        generated user-code file so a deeper library frame does not hide the
        line in the user's tile that called it.
        """
        if getattr(e, "lineno", None) is not None:
            return e.lineno

        extracted = traceback.extract_tb(e.__traceback__)
        if preferred_filename:
            for frame in reversed(extracted):
                if frame.filename == preferred_filename:
                    return frame.lineno
        if preferred_filename_prefix:
            for frame in reversed(extracted):
                if frame.filename.startswith(preferred_filename_prefix):
                    return frame.lineno
        if extracted:
            return extracted[-1].lineno
        return None

    def get_traceback_exception_dict(self, e, special_string=None, preferred_filename=None):
        msg = self.get_traceback_message(e, special_string)
        line_number = self.get_exception_line_number(e, preferred_filename)

        return {"success": False, "message": msg, "alert_type": "alert-warning", "line_number": line_number}

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
