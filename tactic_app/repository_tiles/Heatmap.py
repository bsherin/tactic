@user_tile
class Heatmap(TileBase, MplFigure):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.palette_name = "Paired"
        return

    @property
    def options(self):
        return  [
        {"name": "array_data", "type": "pipe_select"},
        {"name": "palette_name", "type": "palette_select"}
    ]

    def draw_plot(self):
        MplFigure.__init__(self)
        self.dialogs = []
        the_array = self.array
        (nrows, ncols) = the_array.shape
        ax = self.add_subplot(111)
        cax = ax.imshow(the_array, cmap=get_cmap(self.palette_name), aspect="auto", interpolation='nearest')

        ind = numpy.arange(ncols)
        ax.set_xticks(ind, minor=False)
        ax.set_xticks(ind + .5, minor=True)
        ax.get_xaxis().set_ticklabels(ind + 1, size="x-small")

        ind = numpy.arange(nrows)

        ax.set_yticks(ind, minor=False)
        ax.set_yticks(ind + .5, minor=True)
        ax.get_yaxis().set_ticklabels(ind + 1, size="x-small")

        ax.grid(True, which='minor', linestyle='-')

        cbar = self.colorbar(cax)
        self.set_facecolor("white")
        self.tight_layout()
        return

    def render_content(self):
        self.array = numpy.array(self.get_pipe_value(self.array_data))
        self.draw_plot()
        return self.create_figure_html()