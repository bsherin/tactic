@user_tile
class BasicTileTemplate(TileBase):
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)

        return

    @property
    def options(self):
        return  [
        {"name": "some_text", "type": "text"}
    ]


    def render_content(self):
        """This should return html for the tile body.
        Will be called on RefreshTile event"""
        return new_html


