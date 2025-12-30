
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    # get_cmap = matplotlib.cm.ColormapRegistry.get_cmap
    # noinspection PyUnresolvedReferences
from tile_base import TileBase
from tactic_logging import log
import uuid

class D3Tile(TileBase):
    def __init__(self, _main_id_ignored=None, _tile_id_ignored=None, _tile_name=None):
        TileBase.__init__(self)
        self.save_attrs += ["current_arg_dict", "jscript", "unique_div_id"]
        self.jscript = None
        self._current_arg_dict = None
        self._unique_div_id = "div" + str(uuid.uuid4())
        self.is_d3 = True

    def palette_to_hex(self, cmap, num):
        from matplotlib.colors import rgb2hex
        import matplotlib as mpl
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
        self._do_the_refresh(arg_dict=self._current_arg_dict)

    def _do_the_refresh(self, arg_dict=None):
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
            jw = self.widget("javascript",
                                    {"value": {"code": self.jscript, "args": arg_dict}})

            super()._do_the_refresh([jw.render()])
        except Exception as ex:
            log.exception("Error in do_the_refresh")
            self._handle_exception(ex)
        return

