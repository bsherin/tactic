__author__ = 'bls910'
# just a comment
mainwindow_instances = {}
tile_classes = {}
user_tiles = {}
tokenizer_dict = {}
loaded_user_modules = {}
weight_functions = {}

def distribute_event(event_name, main_id, data_dict=None, tile_id=None):
    mwindow = mainwindow_instances[main_id]
    if tile_id is not None:
        tile_instance = mwindow.tile_instances[tile_id]
        if event_name in tile_instance.update_events:
            tile_instance.post_event(event_name, data_dict)
    else:
        for tile_id, tile_instance in mwindow.tile_instances.items():
            if event_name in tile_instance.update_events:
                tile_instance.post_event(event_name, data_dict)
    if event_name in mwindow.update_events:
        mwindow.post_event(event_name, data_dict)
