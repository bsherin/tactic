
import copy
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy
# noinspection PyUnresolvedReferences
import qworker
import tile_env
from tile_env import class_info
from tile_env import exec_tile_code
import tile_base
from tile_base import clear_and_exec_user_code, TileBase
import cPickle
from bson.binary import Binary
import inspect
import types
import gevent
import sys, os
sys.stdout = sys.stderr
import time

class TileWorker(QWorker):
    def __init__(self):
        print "about to initialize QWorker"
        QWorker.__init__(self)
        print "QWorker initialized"
        self.tile_instance = None

    @task_worthy
    def hello(self, data_dict):
        return {"success": True, "message": 'This is a tile communicating'}

    def ask_host(self, msg_type, task_data=None, callback_func=None):
        task_data["main_id"] = self.tile_instance.main_id
        self.post_task("host", msg_type, task_data, callback_func)
        return

    def emit_tile_message(self, message, data=None):
        if data is None:
            data = {}
        data["tile_message"] = message
        data["tile_id"] = self.my_id
        self.ask_host("emit_tile_message", data)
        return

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string = "<pre>" + error_string + "</pre>"
        print error_string
        return {"success": False, "message_string": error_string}

    @task_worthy
    def load_source(self, data_dict):
        try:
            print("entering load_source")
            tile_code = data_dict["tile_code"]
            result = exec_tile_code(tile_code)
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return result

    @task_worthy
    def get_options(self, data_dict):
        try:
            the_class = class_info["tile_class"]
            self.tile_instance = the_class(0, 0)
            opt_dict = self.tile_instance.options
            export_list = self.tile_instance.exports
            if len(export_list) > 0:
                if not isinstance(export_list[0], dict):
                    export_list = [{"name": exp, "tags": ""} for exp in export_list]
        except Exception as ex:
            return self.handle_exception(ex, "Error extracting options from source")
        return {"success": True, "opt_dict": opt_dict, "export_list": export_list}

    # This should only be used in the tester tile.
    @task_worthy
    def clear_and_load_code(self, data_dict):
        try:
            the_code = data_dict["the_code"]
            result = clear_and_exec_user_code(the_code)
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return result

    @task_worthy
    def recreate_from_save(self, data):
        try:
            print("entering recreate_from_save. class_name is " + class_info["class_name"])
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            self.handler_instances["tilebase"] = self.tile_instance
            if "tile_log_width" not in data:
                data["tile_log_width"] = data["back_width"]
                data["tile_log_height"] = data["back_height"]
            self.tile_instance.recreate_from_save(data)
            if self.tile_instance.current_html is not None:
                self.tile_instance.current_html = self.tile_instance.current_html.replace(data["base_figure_url"],
                                                                                          data["new_base_figure_url"])
            self.tile_instance.base_figure_url = data["new_base_figure_url"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            print("tile instance started")
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")
        return {"success": True,
                "is_shrunk": self.tile_instance.is_shrunk,
                "saved_size": self.tile_instance.full_tile_height,
                "exports": self.tile_instance.exports,
                "tile_name": self.tile_instance.tile_name,
                "is_d3": self.tile_instance.is_d3}

    @task_worthy
    def get_image(self,  data_dict):
        try:
            encoded_img = Binary(cPickle.dumps(self.tile_instance.img_dict[data_dict["figure_name"]]))
            return {"success": True, "img": encoded_img}
        except Exception as ex:
            return self.handle_exception(ex, "Error loading source")

    @task_worthy
    def reinstantiate_tile(self, reload_dict):
        try:
            print("entering reinstantiate_tile_class")
            self.tile_instance = class_info["tile_class"](None, None, tile_name=reload_dict["tile_name"])
            self.handler_instances["tilebase"] = self.tile_instance
            for (attr, val) in reload_dict.items():
                setattr(self.tile_instance, attr, val)
            form_html = self.tile_instance.create_form_html(reload_dict["form_info"])["form_html"]
            print("leaving reinstantiate_tile_class")
            return {"success": True, "form_html": form_html}
        except Exception as ex:
            return self.handle_exception(ex, "Error reinstantiating tile")

    @task_worthy
    def instantiate_as_pseudo_tile(self, data):
        try:
            print("entering load_source")
            self.tile_instance = PseudoTileClass()
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.user_id = os.environ["OWNER"]
            self.tile_instance.base_figure_url = data["base_figure_url"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            data["exports"] = []
            print("leaving instantiate_tile_class")
            data["success"] = True
            return data
        except Exception as ex:
            return self.handle_exception(ex, "Error initializing pseudo tile")

    @task_worthy
    def instantiate_tile_class(self, data):
        try:
            print("entering instantiate_tile_class")
            self.tile_instance = class_info["tile_class"](None, None, tile_name=data["tile_name"])
            self.handler_instances["tilebase"] = self.tile_instance
            self.tile_instance.user_id = os.environ["OWNER"]
            self.tile_instance.base_figure_url = data["base_figure_url"]
            if "doc_type" in data:
                self.tile_instance.doc_type = data["doc_type"]
            else:
                self.tile_instance.doc_type = "table"
            data["exports"] = self.tile_instance.exports
            print("leaving instantiate_tile_class")
            data["success"] = True
            return data
        except Exception as ex:
            return self.handle_exception(ex, "Error instantiating tile class")

    @task_worthy
    def stop_me(self, data):
        print "killing me"
        self.kill()
        print "I'm killed"
        return {"success": True}

    @task_worthy
    def render_tile(self, data):
        return self.tile_instance.render_me(data)


class PseudoTileClass(TileBase):
    category = "word"
    exports = []
    measures = ["raw_freq", "student_t", "chi_sq", "pmi", "likelihood_ratio"]

    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self, tile_name=tile_name)
        self.is_pseudo = True
        return


if __name__ == "__main__":
    print "entering main"
    tile_base.tworker = TileWorker()
    print "tworker is created, about to start my_id is " + str(tile_base.tworker.my_id)
    tile_base.tworker.start()
    print "tworker started, my_id is " + str(tile_base.tworker.my_id)
    while True:
        time.sleep(1000)
