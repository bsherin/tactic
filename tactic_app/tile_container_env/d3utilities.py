
import matplotlib
from matplotlib.colors import rgb2hex
from matplotlib.cm import get_cmap
from tile_base import TileBase
import uuid

class D3Tile(TileBase):
    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self)
        self.styles = None
        self.jscript = None
        self.unique_div_id = "div" + str(uuid.uuid4())

    def palette_to_hex(self, cmap, num):

        step = 1.0 / num
        cmap = get_cmap(self.palette_name)
        breaks = [i * step for i in range(num)]
        breaks.append(1)
        return [rgb2hex(cmap(bb)) for bb in breaks]

    def initialize_client_side(self):
        print "entering initialize_client_side"
        the_html = "<div id={}><div class='d3plot'></div>".format(self.unique_div_id)
        the_html += "<style>{0}</style>".format(self.styles)
        self.tworker.emit_tile_message("displayTileContent", {"html": the_html})
        data = {}
        data["tile_id"] = self.tworker.my_id
        data["tile_message"] = "set_d3_javascript"
        data["javascript_code"] = self.jscript
        self.tworker.ask_host('emit_tile_message', data)
        return

    def execute_d3(self, arg_dict):
        print ("entering execute_d3")
        self.initialize_client_side()
        ddict = {}
        ddict["arg_dict"] = arg_dict
        ddict["tile_id"] = self.tworker.my_id
        ddict["tile_message"] = "execute_d3_func"
        ddict["selector"] = "#" + self.unique_div_id
        self.saved_arg_dict = arg_dict
        self.tworker.ask_host('emit_tile_message', ddict)
        return

    def handle_size_change(self):
        self.execute_d3(self.saved_arg_dict)
        return

    def do_the_refresh(self):
        print ("entering do the refresh")
        try:
            if not self.configured:
                new_html = "Tile not configured"
                self.current_html = new_html
                self.tworker.emit_tile_message("displayTileContent", {"html": new_html})
            else:
                arg_dict = self.render_content()
                self.execute_d3(arg_dict)
        except Exception as ex:
            print self.handle_exception(ex)
        return
