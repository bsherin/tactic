import sys
from StringIO import StringIO
from tile_base import TileBase, task_worthy

# noinspection PyUnresolvedReferences
from qworker import task_worthy_methods

from matplotlib_utilities import MplFigure


# noinspection PyTypeChecker
class ConsoleStringIO(StringIO):
    def __init__(self, tile, data):
        self.my_tile = tile
        self.data = data
        StringIO.__init__(self)
        return

    def write(self, s):
        StringIO.write(self, s)
        if not s == "\n":   # The print commmand automatically adds a \n. We don't want to print it.
            self.data["result_string"] = s
            self.my_tile.tworker.post_task(self.my_tile.main_id, "got_console_print", self.data)
        return

class PseudoTileClass(TileBase, MplFigure):
    category = "word"
    exports = []
    measures = ["raw_freq", "student_t", "chi_sq", "pmi", "likelihood_ratio"]

    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self, tile_name=tile_name)
        self.is_pseudo = True
        self.console_namespace = {"self": self}
        return

    @task_worthy
    def clear_console_namespace(self, data):
        try:
            self.console_namespace = {"self": self}
        except Exception as ex:
            data["result_string"] = self.handle_exception(ex, "Error clearing console namespace", print_to_console=False)
        return data

    @task_worthy
    def exec_console_code(self, data):
        old_stdout = sys.stdout
        try:
            self._pipe_dict = data["pipe_dict"]
            redirected_output = ConsoleStringIO(self, data)
            sys.stdout = redirected_output
            exec(data["the_code"], globals(), self.console_namespace)
            sys.stdout = old_stdout
        except Exception as ex:
            data["result_string"] = self.handle_exception(ex, "Error executing console code", print_to_console=False)
            sys.stdout = old_stdout
        return data