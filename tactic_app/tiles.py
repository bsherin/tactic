__author__ = 'bls910'
from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField

tile_classes = {}
tile_instances = {}
select_tile_instances = {}
current_tile_id = 0

# Decorator function used to register runnable analyses in analysis_dict
def tile_class(tclass):
    global tile_classes
    tile_classes[tclass.__name__] = tclass
    return tclass

class TileBase(object):
    def __init__(self):
        global current_tile_id
        self.tile_id = "tile_" + str(current_tile_id)
        tile_instances[self.tile_id] = self
        current_tile_id += 1

class SelectionTile(TileBase):
    def __init__(self):
        TileBase.__init__(self)
        select_tile_instances[self.tile_id] = self

    def render_content(self, selected_text):
        return selected_text

    def update_options(self, form_data):
        return

@tile_class
class SimpleSelectionTile(SelectionTile):
    options = [{
        "name": "extra_text",
        "type": "text",
        "placehold":"no selection"
    }]
    def __init__(self):
        SelectionTile.__init__(self)
        self.extra_text = "placeholder text"
        self.selected_text = "no selection"

    def render_content(self):
        return "{} {}".format(self.extra_text, self.selected_text)

    def update_options(self, form_data):
        self.extra_text = form_data["extra_text"]

    # class OptionsForm(Form):
    #     extra_text = StringField('Extra Text')
    #     submit = SubmitField('Submit Options')
