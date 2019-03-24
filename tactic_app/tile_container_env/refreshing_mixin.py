

class RefreshingMixin:
    def spin_and_refresh(self):
        self.post_event("StartSpinner")
        self.post_event("RefreshTile")
        self.post_event("StopSpinner")

    def start_spinner(self):
        self._tworker.emit_tile_message("startSpinner")

    def stop_spinner(self):
        self._tworker.emit_tile_message("stopSpinner")

    def refresh_tile_now(self, new_html=None):
        if new_html is None:
            self.post_event("RefreshTile")
        else:
            self.current_html = new_html
            self.post_event("RefreshTileFromSave")

    def display_status(self, message):
        self._do_the_refresh(message)
        return
