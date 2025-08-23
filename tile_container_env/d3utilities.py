from __future__ import print_function

import matplotlib
import warnings
from matplotlib.colors import rgb2hex
import matplotlib as mpl
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    # get_cmap = matplotlib.cm.ColormapRegistry.get_cmap
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
        cmap = mpl.colormaps[self.palette_name]
        breaks = [i * step for i in range(num)]
        return [rgb2hex(cmap(bb)) for bb in breaks]

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
                    super()._do_the_refresh(new_html)
                    return
                else:
                    arg_dict = self.render_content()
            self.current_html = ""
            self._current_arg_dict = arg_dict
            javascript_code = "(selector, w, h, arg_dict, resizing) => {" + self.jscript + "}"
            jw = self.create_widget("javascript",
                                    {"value": {"javascript_code": javascript_code,
                                     "javascript_arg_dict": arg_dict}})

            super()._do_the_refresh([jw.render()])
        except Exception as ex:
            print(self._handle_exception(ex))
        return

