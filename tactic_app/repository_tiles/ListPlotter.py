@user_tile
class ListPlotter(TileBase):
    category = "plot"
    save_attrs = TileBase.save_attrs + ["data_source"]
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20

    @property
    def options(self):
        return  [
            {"name": "data_source", "type": "pipe_select"},
            {"name": "N", "type": "int"}
        ]

    def handle_size_change(self):
        if self.data_source is None:
            return
        data_dict = self.get_pipe_value(self.data_source)
        data_dict["value_list"] = data_dict["value_list"][:self.N]
        fig = GraphList(data_dict, self.width, self.height)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content (self):
        if self.data_source == None:
            return "No vocab source selected."
        data_dict = self.get_pipe_value(self.data_source)
        data_dict["value_list"] = data_dict["value_list"][:self.N]
        fig = GraphList(data_dict, self.width, self.height)
        return self.create_figure_html(fig)