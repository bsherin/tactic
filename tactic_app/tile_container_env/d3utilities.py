
import matplotlib
from matplotlib.colors import rgb2hex
from matplotlib.cm import get_cmap
from tile_base import TileBase
import uuid

class D3Tile(TileBase):
    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self)
        self.save_attrs += ["current_arg_dict", "jscript", "unique_div_id"]
        self.jscript = None
        self.current_arg_dict = None
        self.unique_div_id = "div" + str(uuid.uuid4())
        self.is_d3 = True

    def palette_to_hex(self, cmap, num):

        step = 1.0 / num
        cmap = get_cmap(self.palette_name)
        breaks = [i * step for i in range(num)]
        return [rgb2hex(cmap(bb)) for bb in breaks]

    def initialize_client_side(self, styles):
        print "entering initialize_client_side"
        the_html = "<div id={}><div class='d3plot'></div>".format(self.unique_div_id)
        the_html += "<style>{0}</style>".format(styles)
        self.tworker.emit_tile_message("displayTileContent", {"html": the_html})
        data = {}
        data["tile_id"] = self.tworker.my_id
        data["tile_message"] = "set_d3_javascript"
        data["javascript_code"] = self.jscript
        self.tworker.ask_host('emit_tile_message', data)
        return

    def execute_d3(self, arg_dict):
        print ("entering execute_d3")
        if "styles" in arg_dict:
            styles = arg_dict["styles"]
        else:
            styles = ""
        self.initialize_client_side(styles)
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

    def refresh_tile_now(self, arg_dict=None):
        if arg_dict is None:
            self.post_event("RefreshTile")
        else:
            self.current_arg_dict = arg_dict
            self.post_event("RefreshTileFromSave")

    def refresh_from_save(self):
        print "in refresh_from_save in d3Tile"
        self.do_the_refresh(arg_dict=self.current_arg_dict)

    def do_the_refresh(self, arg_dict=None):
        print ("entering do the refresh")
        try:
            if arg_dict == None:
                if not self.configured:
                    new_html = "Tile not configured"
                    arg_dict= {}
                    self.tworker.emit_tile_message("displayTileContent", {"html": new_html})
                    return
                else:
                    arg_dict = self.render_content()
            self.current_html = ""
            self.current_arg_dict = arg_dict
            self.execute_d3(arg_dict)
        except Exception as ex:
            print self.handle_exception(ex)
        return