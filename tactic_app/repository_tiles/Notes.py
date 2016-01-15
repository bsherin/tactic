@user_tile
class NotesTile(TileBase):
    category = "utility"
    exports = ["notes"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        return

    @property
    def options(self):
        return  [
        {"name": "notes", "type": "textarea"},
    ]


    def render_content(self):
        new_html = "<pre>" + self.notes + "</pre>"
        return new_html

