@user_tile
class CompareFieldsTable(TileBase):
    category = "utility"
    exports = []

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.reference_value = 0
        self.comparison_type = "equal_to"
        self.comparison_function = ""
        return
    
    @property
    def options(self):
        comparison_types = ["less_than", "equal_to", "greater_than", "not_equal_to"]
        return  [
            {"name": "source_field", "type": "column_select"},
            {"name": "reference_field", "type": "column_select"},
            {"name": "comparison_type", "type": "custom_list", "special_list": comparison_types},
            {"name": "extra_column_to_display", "type": "column_select"}
    ]

    def less_than(self, row_dict):
        try:
            return float(row_dict[self.source_field]) < float(row_dict[self.reference_field])
        except ValueError:
            return False
    
    def greater_than(self, row_dict):
        try:
            return float(row_dict[self.source_field]) > float(row_dict[self.reference_field])
        except ValueError:
            return False
    
    def equal_to(self, row_dict):
        try:
            return float(row_dict[self.source_field]) == float(row_dict[self.reference_field])
        except ValueError:
            return False
    
    def string_equal(self, row_dict):
        try:
            return row_dict[self.source_field] == row_dict[self.reference_field]
        except ValueError:
            return False
        
    def string_not_equal(self, row_dict):
        try:
            return not row_dict[self.source_field] == row_dict[self.reference_field]
        except ValueError:
            return False
    
    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        doc_name = clicked_row[0]
        row_id = clicked_row[1]
        self.go_to_row_in_document(doc_name, row_id)
        return
    
    def build_match_table(self, match_list):
        tarray = []
        tarray.append(["doc_name", "id", self.extra_column_to_display, self.source_field])
        for row_dict in match_list:
            tarray.append([row_dict["doc_name"], row_dict["__id__"], 
                           row_dict[self.extra_column_to_display], row_dict[self.source_field]])
        return self.build_html_table_from_data_list(tarray, title=None, row_clickable=True)

    def render_content(self):
        if self.source_field is None:
            return "not configured"
        if self.comparison_type == "equal_to":
            try:
                fval = float(self.reference_value)
                self.comparison_function = self.equal_to
            except ValueError:
                self.comparison_function = self.string_equal
        elif self.comparison_type == "not_equal_to":
            self.comparison_function = self.string_not_equal
        else:
            try:
                fval = float(self.reference_value)
            except ValueError:
                return "Invalid reference value for comparison type"
            if self.comparison_type == "greater_than":
                self.comparison_function = self.greater_than
            else:
                self.comparison_function = self.less_than
        match_list = []
        for doc_name in self.get_document_names():
            ddata = self.get_document_data(doc_name)
            for row_dict in ddata.values():
                if self.comparison_function(row_dict):
                    row_dict["doc_name"] = doc_name
                    match_list.append(row_dict)
        return self.build_match_table(match_list)


