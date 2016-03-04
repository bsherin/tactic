@user_tile
class FreqDistPlotter(TileBase, MplFigure):
    category = "plot"
    
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        
        
        self.N = 20
        self.value_list = None
        self.word_list = None
        self.title = None
        self.save_attrs += ["data_source", "value_list", "word_list"]
        
    @property
    def options(self):
        return  [
            {"name": "data_source", "type": "pipe_select"},
            {"name": "N", "type": "int"}
        ]
    
    def draw_plot(self):
        MplFigure.__init__(self)
        ax = self.add_subplot(111)
        # self.subplots_adjust(left=.05, bottom=.15, right=.98, top=.95)
        ax.grid(True)
        x = range(1, len(self.value_list) + 1)
        ax.plot(x, self.value_list, 'bo')
        ax.set_xticks(x)
        ax.set_xticklabels(self.word_list, rotation='vertical')
        self.tight_layout()
        return

    def render_content (self):
        fdist = self.get_pipe_value(self.data_source)
        mc_tuples = fdist.most_common(self.N)
        self.word_list = []
        self.value_list = []
        for tup in mc_tuples:
            self.word_list.append(tup[0])
            self.value_list.append(tup[1])
        self.draw_plot()
        return self.create_figure_html()