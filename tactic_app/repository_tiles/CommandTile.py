@user_tile
class CommandTile(TileBase):
    category = "utility"
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        return

    @property
    def options(self):
        return  [
        {"name": "command_text", "type": "textarea"},
    ]

    def render_content(self):
        new_html= "<pre>" + self.command_text + "</pre>"
        exec(self.command_text)
        return new_html