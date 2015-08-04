__author__ = 'bls910'

mainwindow_instances = {}
current_main_id = 0
from tiles import tile_classes

def create_new_mainwindow(collection_name, project_name):
    mw = mainWindow(collection_name, project_name)
    mainwindow_instances[mw.main_id] = mw
    return mw.main_id

class mainWindow(object):
    def __init__(self, collection_name, project_name):
        global current_main_id
        self.tile_instances = {}
        self.current_tile_id = 0
        self.collection_name = collection_name # This isn't used yet.
        self.project_name = project_name # This isn't used yet.
        self.main_id = str(current_main_id)
        current_main_id += 1

    def create_tile(self, tile_type):
        new_id = "tile_id_" + str(self.current_tile_id)
        new_tile = tile_classes[tile_type](self.main_id, new_id)
        self.tile_instances[new_id] = new_tile
        self.current_tile_id += 1
        return new_tile