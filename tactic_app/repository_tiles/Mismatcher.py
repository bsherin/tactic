@user_tile
class mismatcher(TileBase):
    category = "utility"

    exports = ["some_text"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        return

    @property
    def options(self):
        return  [
            {"name": "column_source", "type": "column_select"},
            {"name": "column_match", "type": "column_select"}
        ]

    def hlight(self, row):
        if row[self.column_match] == row[self.column_source]:
            return False
        else:
            return True
    
    def render_content(self):
        doc_name = self.get_current_document_name()
        mrows = self.get_matching_rows(self.hlight, doc_name)
        for row in mrows:
            token = row[self.column_match]
            self.set_cell_background(doc_name, row["__id__"], self.column_match, '#00ff00')
        new_html = "source is: {} <br> match is : {}".format(self.column_source, self.column_match)
        return new_html

