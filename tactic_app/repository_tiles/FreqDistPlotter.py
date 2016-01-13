@user_tile
class FreqDistPlotter(TileBase):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20
        self.value_list = None
        self.word_list = None

    @property
    def options(self):
        return  [
            {"name": "data_source", "type": "pipe_select"},
            {"name": "N", "type": "int"}
        ]

    def handle_size_change(self):
        if self.value_list is None:
            return
        fig = GraphList(self.value_list, self.width, self.height, xlabels=self.word_list)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content (self):
        if self.data_source == None:
            return "No vocab source selected."
        fdist = self.get_pipe_value(self.data_source)
        mc_tuples = fdist.most_common(self.N)
        self.word_list = []
        self.value_list = []
        for tup in mc_tuples:
            self.word_list.append(tup[0])
            self.value_list.append(tup[1])
        fig = GraphList(self.value_list, self.width, self.height, xlabels=self.word_list)
        return self.create_figure_html(fig)