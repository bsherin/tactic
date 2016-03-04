@user_tile
class WordCloud(TileBase, MplFigure):
    category = "plot"

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.wordcloud = None
        self.the_text = None

    @property
    def options(self):
        return  [
            {"name": "text_column", "type": "column_select"}
        ]
    
    def draw_plot(self):
        MplFigure.__init__(self)
        from wordcloud import WordCloud
        self.wordcloud = WordCloud(width=self.width + 20, 
                                   height=self.height + 20, 
                                   margin=1,
                                   scale=1,
                                   background_color="white").generate(self.the_text)
        ax = self.add_subplot(111)
        ax.imshow(self.wordcloud)
        ax.axis("off")
        self.tight_layout()

    def render_content(self):
        self.the_text = self.get_column_data(self.text_column)
        self.the_text = " ".join(self.the_text)
        self.draw_plot()
        return self.create_figure_html()