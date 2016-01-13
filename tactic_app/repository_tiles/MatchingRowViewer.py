@user_tile
class MatchingRowViewer(TileBase):
    category = "utility"
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        return
    
    @property
    def options(self):
        return  [
            {"name": "matching_rows", "type": "pipe_select"}
    ]
    
    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        doc_name = clicked_row[0]
        row_id = clicked_row[1]
        self.go_to_row_in_document(doc_name, row_id)
        return
    
    def build_match_table(self, match_list):
        tarray = []
        header_list = ["doc_name", "id"]
        key_list = ["__filename__", "__id__"]
        for key in match_list[0].keys():
            if not key in ["__id__", "__filename__"]:
                key_list.append(key)
                header_list.append(key)
        tarray.append(header_list)
        for row_dict in match_list:
            new_row = [row_dict[key] for key in key_list]
            tarray.append(new_row)
        return self.build_html_table_from_data_list(tarray, title=None, row_clickable=True)

    def render_content(self):
        if self.matching_rows == "":
            return "not configured"
        self.dm("displaying " + str(self.matching_rows))
        return self.build_match_table(self.get_pipe_value(self.matching_rows))

