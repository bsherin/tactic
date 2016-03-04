@user_tile
class DispersionPlotter(TileBase, MplFigure):
    category = "plot"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.all_words = None
        self.wtf = None
        self.save_attrs += ["all_words", "wtf"]


    @property
    def options(self):
        return  [
            {"name": "text_source", "type": "column_select"},
            {"name": "tokenizer", "type": "tokenizer_select"},
            {"name": "words_to_find", "type": "text"}
        ]
    
    def draw_plot(self):
        MplFigure.__init__(self)
        text = self.all_words
        words = self.wtf
        ax = self.add_subplot(111)

        text = list(text)
        text = list(map(str, text))  # deals with there being unicode
        words = list(map(str, words))
        words.reverse()
        words_to_comp = list(map(str.lower, words))
        text_to_comp = list(map(str.lower, text))

        points = [(x,y) for x in range(len(text_to_comp))
                for y in range(len(words_to_comp))
                if text_to_comp[x] == words_to_comp[y]]

        if len(points) > 0:
            x, y = list(zip(*points))
            ax.plot(x, y, "b|", scalex=.1)
            ax.set_yticks(range(len(words)))
            ax.set_yticklabels(words)
            ax.set_ylim(-1, len(words))
        self.tight_layout()
        return

    def render_content(self):
        all_rows =  self.get_column_data(self.text_source)
        self.all_words = []
        tokenizer = self.get_tokenizer(self.tokenizer)
        for r in all_rows:
            self.all_words += tokenizer(r)
        self.wtf = self.words_to_find.split()
        self.draw_plot()
        return self.create_figure_html()