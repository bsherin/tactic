from __future__ import print_function

import matplotlib
import warnings
from matplotlib.colors import rgb2hex
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    from matplotlib.cm import get_cmap
    # noinspection PyUnresolvedReferences
from tile_base import TileBase
import uuid


class D3Tile(TileBase):
    def __init__(self, main_id_ignored=None, tile_id_ignored=None, tile_name=None):
        TileBase.__init__(self)
        self.save_attrs += ["current_arg_dict", "jscript", "unique_div_id"]
        self.jscript = None
        self._current_arg_dict = None
        self._unique_div_id = "div" + str(uuid.uuid4())
        self.is_d3 = True

    def palette_to_hex(self, cmap, num):
        step = 1.0 / num
        cmap = get_cmap(self.palette_name)
        breaks = [i * step for i in range(num)]
        return [rgb2hex(cmap(bb)) for bb in breaks]

    def _initialize_client_side(self, styles):
        the_html = "<div id={}><div class='d3plot'></div>".format(self._unique_div_id)
        the_html += "<style>{0}</style>".format(styles)
        self._tworker.emit_tile_message("displayTileContentWithJavascript", {html: the_html, javascript_code: self.jscript})
        # data = {}
        # data["tile_id"] = self._tworker.my_id
        # data["tile_message"] = "set_d3_javascript"
        # data["javascript_code"] = self.jscript
        # self._tworker.ask_host('emit_tile_message', data)
        return

    def _set_d3(self, arg_dict):
        print("in _set_d3")
        # if "styles" in arg_dict:
        #     styles = arg_dict["styles"]
        # else:
        #     styles = ""
        # the_html = "<div id={}><div class='d3plot'></div>".format(self._unique_div_id)
        # the_html += "<style>{0}</style>".format(styles)
        # self._initialize_client_side(styles)
        ddict = {}
        ddict["arg_dict"] = arg_dict
        ddict["tile_id"] = self._tworker.my_id
        ddict["javascript_code"] = "(selector, w, h, arg_dict, resizing) => {" + self.jscript + "}"
        the_html = "<div class='jscript-target'></div>"
        if "styles" in arg_dict:
            styles = arg_dict["styles"]
        else:
            styles = ""
        the_html += "<style>{0}</style>".format(styles)
        ddict["html"] = the_html
        ddict["tile_message"] = "displayTileContentWithJavascript"
        self._saved_arg_dict = arg_dict
        self._tworker.ask_host('emit_tile_message', ddict)
        return

    # def handle_size_change(self):
    #     self._execute_d3(self._saved_arg_dict)
    #     return

    def refresh_tile_now(self, arg_dict=None):
        if arg_dict is None:
            self.post_event("RefreshTile")
        else:
            self._current_arg_dict = arg_dict
            self.post_event("RefreshTileFromSave")

    def _refresh_from_save(self):
        print("in refresh_from_save in d3Tile")
        self._do_the_refresh(arg_dict=self._current_arg_dict)

    def _do_the_refresh(self, arg_dict=None):
        print ("entering do the refresh in a D3Tile")
        try:
            if arg_dict is None:
                if not self.configured:
                    new_html = "Tile not configured"
                    arg_dict = {}
                    self._tworker.emit_tile_message("displayTileContent", {"html": new_html})
                    return
                else:
                    arg_dict = self.render_content()
            arg_dict["tile_id"] = self._tworker.my_id
            self.current_html = ""
            self._current_arg_dict = arg_dict
            self._set_d3(arg_dict)
        except Exception as ex:
            print(self._handle_exception(ex))
        return
