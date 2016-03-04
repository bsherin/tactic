@user_tile
class WordnetLookup:
    category = "word"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.display_message("Starting Wordnet")
        self.selected_text = "no selection"
        self.number_to_show = 5
        self.configured = True

    @property
    def options(self):
        return  [
            {"name": "number_to_show", "type": "int"}
        ]

    def render_content(self):
        res = nltk.corpus.wordnet.synsets(self.selected_text)[:self.number_to_show]
        self.display_message("")
        return "<div>Synsets are:</div><div>{}</div>".format(res)

    def handle_text_select(self, selected_text, doc_name, active_row_index):
        self.selected_text = selected_text
        self.refresh_tile_now()