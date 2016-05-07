@user_tile
class ScatterPlot(TileBase, MplFigure):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.the_data = None
        self.save_attrs += ["the_data"]

    @property
    def options(self):
        return  [
            {"name": "data_table", "type": "pipe_select"},
            {"name": "plot_title", "type": "text"}
        ]

    def draw_plot(self):
        MplFigure.__init__(self)
        ax = self.add_subplot(111)
        ax.grid(True)
        x = [v[0] for v in self.the_data]
        y = [v[1] for v in self.the_data]
        if isinstance(x[0], str) or isinstance(y[0], str):
            ax.set_xlabel(x[0])
            ax.set_ylabel(y[0])
            x = x[1:]
            y = y[1:]
        ax.plot(x, y, 'bo')
        if not (self.plot_title == None or self.plot_title == ""):
            ax.set_title(self.plot_title, fontsize=10)
        self.tight_layout()
        return
    
    def render_content (self):
        self.the_data = self.get_pipe_value(self.data_table)
        self.draw_plot()
        return self.create_figure_html()