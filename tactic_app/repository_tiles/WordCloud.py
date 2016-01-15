@user_tile
class WordCloud(TileBase):
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

    def handle_size_change(self):
        if self.the_text is None:
            return
        from wordcloud import WordCloud
        self.wordcloud = WordCloud(width=self.width, 
                                   height=self.height, 
                                   margin=1,
                                   scale=1,
                                   background_color="white").generate(self.the_text)
        fig = ImageShow(self.wordcloud, self.width, self.height)
        new_html = self.create_figure_html(fig)
        self.refresh_tile_now(new_html)
        return

    def render_content (self):
        from wordcloud import WordCloud
        if self.text_column == None:
            return "No text source selected."
        self.the_text = self.get_column_data(self.text_column)
        self.the_text = " ".join(self.the_text)
        self.wordcloud = WordCloud(width=self.width + 20, 
                                   height=self.height + 20, 
                                   margin=1,
                                   scale=1,
                                   background_color="white").generate(self.the_text)
        fig = ImageShow(self.wordcloud, self.width, self.height)
        return self.create_figure_html(fig)