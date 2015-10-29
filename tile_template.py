@user_tile
class TileTemplate(TileBase):
    # save_attrs has the variables that will be saved when a project is saved
    save_attrs = TileBase.save_attrs + ["some_text"]

    # exports will be a list of properties. Can be methods with @property before them
    exports = ["some_text"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)

        # Any other initializations
        return

    @property
    def options(self):
        # options provides the specification for the options that appear on the back of the tile
        # there are 6 types: text, textarea, column_select, tokenizer_select, list_select, pipe_select
        return  [
        {"name": "some_text", "type": "text","placeholder": self.some_text},
    ]


    def render_content(self):
        """This should return html for the tile body.
        Will be called on RefreshTile event"""
        return new_html

