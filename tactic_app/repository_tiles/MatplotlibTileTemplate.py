@user_tile
class MatplotlibTileTemplate(TileBase, MplFigure):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.value_list = None
        self.N = 20

    @property
    def options(self):
        return  [
            {"name": "value_list_source", "type": "pipe_select"},
            {"name": "N", "type": "int"}
        ]

    def draw_plot(self):
        MplFigure.__init__(self)
        ax = self.add_subplot(111)
        ax.grid(True)
        x = range(1, len(self.value_list) + 1)
        ax.plot(x, self.value_list, 'bo')
        ax.set_xticks(x)
        self.tight_layout()
        return
    
    def render_content (self):
        self.value_list = self.get_pipe_value(self.value_list_source)[1:self.N]
        self.draw_plot()
        return self.create_figure_html()