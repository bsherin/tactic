@user_tile
class NotesTile(TileBase):
    category = "utility"
    exports = ["notes"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.save_attrs += ["current_text"]
        self.current_text = ""
        self.configured = True
        return

    @property
    def options(self):
        return  [
    ]

    def handle_textarea_change(self, text_value):
        self.current_text = text_value
        self.refresh_tile_now()  # This is needed so that the html changes, and is thus changed
        return

    def render_content(self):
        # In the next line the bracket and slash have to be separated otherwise
        # this module is cut off when I reload it.
        new_html = "<textarea style='width: 100%; height: 100%; border: none'>" + self.current_text + "<" + "/textarea>"
        return new_html