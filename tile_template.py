
@user_tile
class TileTemplate(TileBase):
    # save_attrs has the variables that will be saved when a project is saved
    save_attrs = TileBase.save_attrs + ["column_source", "tokenizer_func", "stop_list"]

    # exports will be a list of properties. Can be methods with @property before them
    exports = ["vocabulary"]

    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)

        # Emit needs to modify self.update_events to include any events not included
        # in TileBase: "RefreshTile", "UpdateOptions", "ShowFront", "StartSpinner",
         # "StopSpinner", "RefreshTileFromSave", "RebuildTileForms"
        self.update_events.append("EventName")
        # Any other initializations
        return

    @property
    def options(self):
        # options provides the specification for the options that appear on the back of the tile
        # there are 6 types: text, textarea, column_select, tokenizer_select, list_select, pipe_select
        return  [
        {"name": "number_to_show", "type": "text","placeholder": self.to_show},
        {"name": "the_text", "type": "textarea", "placeholder": self.current_text},
        {"name": "text_source", "type": "column_select", "placeholder": self.text_source},
        {"name": "tokenizer", "type": "tokenizer_select", "placeholder": self.tokenizer_func},
        {"name": "stop_list", "type": "list_select", "placeholder": self.stop_list},
        {"name": "vocab_source", "type": "pipe_select", "placeholder": self.vocab_source}
    ]

    def handle_event(self, event_name, data=None):
        # The 7 events listed above are handled by TileBase in some manner
        # Anything else is up to the tile
        if event_name == "TextSelect":
            self.selected_text = data["selected_text"]
            self.refresh_tile_now()
        TileBase.handle_event(self, event_name, data)
        return

    def render_content(self):
        """This should return html for the tile body.
        Will be called on RefreshTile event"""
        return new_html

    def update_options(self, form_data):
        """ Called on the update_options event.
        This is generated when the user clicks submit in the options view of the tile.
        form_data will be a dict with keys that are the option names.
        """
        self.to_show = int(form_data["number_to_show"])
        self.text_source = form_data["text_source"];
        self.tokenizer_func = form_data["tokenizer"];
        self.stop_list = self.get_user_list(form_data["stop_list"])