@user_tile
class SimpleSelectionTile(TileBase):
    def __init__(self, main_id, tile_id, tile_name=None):
        TileBase.__init__(self, main_id, tile_id, tile_name)
        self.update_events.append("text_select")
        self.extra_text = "placeholder text"
        self.selected_text = "no selection"
        self.tile_type = self.__class__.__name__

    def handle_event(self, event_name, data=None):
        if event_name == "text_select":
            self.selected_text = data["selected_text"]
            self.push_direct_update()
        TileBase.handle_event(self, event_name, data)

    def render_content(self):
        return "{} {}".format(self.extra_text, self.selected_text)

    def update_options(self, form_data):
        self.extra_text = form_data["extra_text"]
        self.spin_and_refresh()

    @property
    def options(self):
        return  [
            {"name": "extra_text", "type": "text", "placeholder": "no selection"}
        ]