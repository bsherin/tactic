@user_tile
class DocumentLIst(TileBase):
    category = "utility"
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.configured = True
        return

    @property
    def options(self):      
        return  []
    
    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        doc_name = clicked_row[0]
        self.go_to_document(doc_name)
        return

    def render_content(self):
        doc_list = self.get_document_names()
        data_list = [["Doc Name"]]
        for doc in doc_list:
            data_list.append([doc])
        new_html = self.build_html_table_from_data_list(data_list, row_clickable=True)
        return new_html

