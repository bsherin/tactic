@user_tile
class Heatmap(TileBase):
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

    def handle_size_change(self):
        if self.array_data is None:
            return
        fig = ArrayHeatmap(self.array, self.width, self.height, palette_name=self.palette_name)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content(self):
        if self.array_data is None:
            return "No source selected yet."
        self.array = self.get_pipe_value(self.array_data)
        fig = ArrayHeatmap(self.array, self.width, self.height, palette_name=self.palette_name)
        return self.create_figure_html(fig)