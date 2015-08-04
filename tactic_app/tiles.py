__author__ = 'bls910'


from tactic_app import socketio

tile_classes = {}
# tile_instances = {}
# current_tile_id = 0

# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    global tile_classes
    tile_classes[tclass.__name__] = tclass
    return tclass

class TileBase(object):
    def __init__(self, main_id, tile_id):
        global current_tile_id
        self.update_events = []
        self.tile_id = tile_id
        self.main_id = main_id
        return

    def update_data(self, data):
        print "update data not implemented"
        return

    def handle_event(self, event_name, data):
        print "handle event not implemented"
        return

    def initiate_update(self):
        socketio.emit("update-tile", {"tile_id": str(self.tile_id)}, namespace='/main', room=self.main_id)

    def push_direct_update(self):
        new_html = self.render_content()
        socketio.emit("push-direct-update", {"tile_id": str(self.tile_id), "html": new_html}, namespace='/main', room=self.main_id)

class SelectionTile(TileBase):
    def __init__(self, main_id, tile_id):
        TileBase.__init__(self, main_id, tile_id)
        self.update_events.append("text_select")
        self.selected_text = ""
        return

    def update_data(self, data):
        self.selected_text = data["selected_text"]
        return

    def handle_event(self, event_name, data):
        if event_name == "text_select":
            self.update_data(data);
            # self.initiate_update()
            self.push_direct_update()

    def render_content(self):
        return self.selected_text

    def update_options(self, form_data):
        return

@tile_class
class SimpleSelectionTile(SelectionTile):
    options = [{
        "name": "extra_text",
        "type": "text",
        "placeholder":"no selection"
    }]
    def __init__(self, main_id, tile_id):
        SelectionTile.__init__(self, main_id, tile_id)
        self.extra_text = "placeholder text"
        self.selected_text = "no selection"

    def render_content(self):
        return "{} {}".format(self.extra_text, self.selected_text)

    def update_options(self, form_data):
        self.extra_text = form_data["extra_text"]

