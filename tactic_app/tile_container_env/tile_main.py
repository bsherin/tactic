
import copy
# noinspection PyUnresolvedReferences
from qworker import QWorker, task_worthy
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
        return {"success": True, "message": 'This is tile communicating'}

    def handle_exception(self, ex, special_string=None):
        if special_string is None:
            template = "An exception of type {0} occured. Arguments:\n{1!r}"
        else:
            template = special_string + "\n" + "An exception of type {0} occurred. Arguments:\n{1!r}"
        error_string = template.format(type(ex).__name__, ex.args)
        error_string = "<pre>" + error_string + "</pre>"
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
            if "tile_log_width" not in data:
                data["tile_log_width"] = data["back_width"]
                data["tile_log_height"] = data["back_height"]
            self.tile_instance.recreate_from_save(data)
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
                "tile_name": self.tile_instance.tile_name}

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
    def RefreshTile(self, data):
        return self.tile_instance.RefreshTile(data)

    @task_worthy
    def compile_save_dict(self, data):
        return self.tile_instance.compile_save_dict(data)

    @task_worthy
    def get_property(self, data_dict):
        return self.tile_instance.get_property(data_dict)

    @task_worthy
    def TileSizeChange(self, data):
        return self.tile_instance.TileSizeChange(data)

    @task_worthy
    def RefreshTileFromSave(self, data):
        return self.tile_instance.RefreshTileFromSave(data)

    @task_worthy
    def SetSizeFromSave(self, data_dict):
        return self.tile_instance.SetSizeFromSave(data_dict)

    @task_worthy
    def UpdateOptions(self, data_dict):
        return self.tile_instance.UpdateOptions(data_dict)

    @task_worthy
    def CellChange(self, data_dict):
        return self.tile_instance.CellChange(data_dict)

    @task_worthy
    def FreeformTextChange(self, data_dict):
        return self.tile_instance.FreeformTextChange(data_dict)

    @task_worthy
    def TileButtonClick(self, data_dict):
        return self.tile_instance.TileButtonClick(data_dict)

    @task_worthy
    def TileFormSubmit(self, data_dict):
        return self.tile_instance.TileFormSubmit(data_dict)

    @task_worthy
    def TileTextAreaChange(self, data_dict):
        return self.tile_instance.TileTextAreaChange(data_dict)

    @task_worthy
    def TextSelect(self, data_dict):
        return self.tile_instance.TextSelect(data_dict)

    @task_worthy
    def DocChange(self, data_dict):
        return self.tile_instance.DocChange(data_dict)

    @task_worthy
    def PipeUpdate(self, data_dict):
        return self.tile_instance.PipeUpdate(data_dict)

    @task_worthy
    def TileWordClick(self, data_dict):
        return self.tile_instance.TileWordClick(data_dict)

    @task_worthy
    def TileRowClick(self, data_dict):
        return self.tile_instance.TileRowClick(data_dict)

    @task_worthy
    def TileCellClick(self, data_dict):
        return self.tile_instance.TileCellClick(data_dict)

    @task_worthy
    def TileElementClick(self, data_dict):
        return self.tile_instance.TileElementClick(data_dict)

    @task_worthy
    def HideOptions(self, data_dict):
        return self.tile_instance.HideOptions(data_dict)

    @task_worthy
    def StartSpinner(self, data_dict):
        return self.tile_instance.StartSpinner(data_dict)

    @task_worthy
    def StopSpinner(self, data_dict):
        return self.tile_instance.StopSpinner(data_dict)

    @task_worthy
    def ShrinkTile(self, data_dict):
        return self.tile_instance.ShrinkTile(data_dict)

    @task_worthy
    def ExpandTile(self, data_dict):
        return self.tile_instance.ExpandTile(data_dict)

    @task_worthy
    def LogTile(self, data_dict):
        return self.tile_instance.LogTile(data_dict)

    @task_worthy
    def LogParams(self, data_dict):
        return self.tile_instance.LogParams(data_dict)

    @task_worthy
    def RebuildTileForms(self, data_dict):
        return self.tile_instance.RebuildTileForms(data_dict)

    @task_worthy
    def create_form_html(self, data):
        return self.tile_instance.create_form_html(data)

    @task_worthy
    def render_tile(self, data):
        return self.tile_instance.render_me(data)

    @task_worthy
    def exec_console_code(self, data):
        return self.tile_instance.exec_console_code(data)

    @task_worthy
    def get_export_info(self, data):
        return self.tile_instance.get_export_info(data)

    @task_worthy
    def evaluate_export(self, data):
        return self.tile_instance.evaluate_export(data)

    @task_worthy
    def transfer_pipe_value(self, data):
        return self.tile_instance.transfer_pipe_value(data)


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
