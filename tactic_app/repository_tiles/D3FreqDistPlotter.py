@user_tile
class D3FreqDistPlotter(TileBase):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.N = 20
        self.value_list = None
        self.word_list = None
        self.data_list = None
        self.save_attrs += ["data_list", "word_list", "data_dict"]
        self.margin_top = 20
        self.margin_bottom = 45
        self.margin_left = 40
        self.margin_right = 20

    @property
    def options(self):
        return  [
            {"name": "data_source", "type": "pipe_select"},
            {"name": "N", "type": "int"},
            {"name": "margin_top", "type": "int"},
            {"name": "margin_bottom", "type": "int"},
            {"name": "margin_left", "type": "int"},
            {"name": "margin_right", "type": "int"}
        ]

    def render_content (self):
        fdist = self.get_pipe_value(self.data_source)
        mc_tuples = fdist.most_common(self.N)
        self.word_list = []
        self.data_list = []
        for i, tup in enumerate(mc_tuples):
            self.word_list.append(tup[0])
            self.data_list.append([i + 1, tup[1]])
        margins = {"top": self.margin_top, "bottom": self.margin_bottom, 
                        "left": self.margin_left, "right": self.margin_right}
        new_html = self.create_scatterplot_html(self.data_list, xlabels=self.word_list, margins=margins)
        return new_html