@user_tile
class ExpandedTileTemplate(TileBase):
    category = "utility"  # Category determines the menu under which the tile will appear
    exports = ["result"]  # The list of exports are properties available to other tiles.

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.number_to_show = 5
        self.result = None
        
        # save_attrs has properties to be saved when the tile is saved.
        # note that in most cases you should use += so that the default
        # properties are saved
        self.save_attrs += ["result"] 
        
        return

    def update_options(self, form_data):
        # The version of update_options in TileBase takes these values and assigns them to attributes of the tile
        TileBase.update_options(form_data)
        return
    
    def handle_button_click(self, value, doc_name, active_row_index):
        return
    
    def handle_textarea_change(self, value):
        return
    
    def handle_cell_change(self, column_header, row_index, old_content, new_content, doc_name):
        return
    
    def handle_text_select(self, selected_text, doc_name, active_row_index):
        return
    
    def handle_tile_word_click(self, clicked_word, doc_name, active_row_index):
        # By default this searches the visible table for any appearances of click_word and highlights them.
        TileBase.handle_tile_word_click(self, clicked_word, doc_name, active_row_index)
        return 
    
    def handle_tile_row_click(self, clicked_row, doc_name, active_row_index):
        return
    
    def handle_tile_cell_click(self, clicked_text, doc_name, active_row_index):
        return
    
    def handle_tile_element_click(self, dataset, doc_name, active_row_index):
        return
    
    def handle_log_tile(self):
        self.log_it(self.current_html)
    
    def handle_size_change(self):
        # self.width and self.height will have the current width and height of the tile
        return
    
    def handle_event(self, event_name, data=None):
        if event_name == "TextSelect":
            self.selected_text = data["selected_text"]
        TileBase.handle_event(self, event_name, data)
    
    @property
    def options(self):
        return  [
        {"name": "some_text", "type": "text_select"},
        {"name": "number_to_show", "type": "int"},
        {"name": "my_text_area", "type": "textarea"},
        {"name": "my_bool", "type": "boolean"},
        {"name": "column_source", "type": "column_select"},
        {"name": "doc_name", "type": "document_select"},
        {"name": "my_tokenizer", "type": "tokenizer_select"},
        {"name": "my_list", "type": "list_select"},
        {"name": "my_palette", "type": "palette_select"},
        {"name": "my_pipe", "type": "pipe_select"},
        {"name": "my_list", "type": "custom_list", "special_list": ["a", "b", "c"]},
        {"name": "my_weight_function", "type": "weight_function_select"}
    ]

    def render_content(self):
        # user code here
        self.result = "Result computed from somewhere"
        return new_html
