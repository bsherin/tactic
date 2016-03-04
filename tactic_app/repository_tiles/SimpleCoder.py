@user_tile
class SimpleCoder(TileBase):
    category = "utility"
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)

    def handle_button_click(self, value, doc_name, active_row_index):
        self.set_cell(doc_name, active_row_index, self.destination_column, value)
        return

    @property
    def options (self):
        txtstr = ""
        for txt in self.current_text:
            txtstr += "\n" + txt
        return [{"name": "current_text","type": "textarea"},
                {"name": "destination_column","type": "column_select"}]

    def render_content (self):
        the_html = ""
        rows = self.current_text.split("\n")
        for r in rows:
            the_html += "<button value='{0}'>{0}</button>".format (r)
        return the_html
