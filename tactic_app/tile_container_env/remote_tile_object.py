

class RemoteTiles:
    def __init__(self, _tbinstance):
        self._iter_value = -1
        self._tbinstance = _tbinstance
        self._other_tile_data = self._get_other_tile_data()
        self._other_tile_names = list(self._other_tile_data.keys())
        return

    @property
    def names(self):
        self._other_tile_data = self._get_other_tile_data()
        self._other_tile_names = list(self._other_tile_data.keys())
        return self._other_tile_names

    def _get_other_tile_data(self):
        return  self._tbinstance._tworker.post_and_wait(self._tbinstance._main_id,
                                                        "OtherTileData",
                                                        {"tile_id": self._tbinstance._tworker.my_id})

    def __getitem__(self, x):
        return RemoteTile(self._tbinstance, x,
                          self._other_tile_data[x]["tile_id"],
                          self._other_tile_data[x]["pipes"])

    def __iter__(self):
        return self

    def rewind(self):
        self._iter_value = -1
        self._other_tile_data = self._get_other_tile_data()
        self._other_tile_names = list(self._other_tile_data.keys())
        return

    def __next__(self):
        self._iter_value += 1
        if self._iter_value == len(self._other_tile_names):
            raise StopIteration
        else:
            return self[self._other_tile_names[self._iter_value]]

    def __len__(self):
        return len(self.names)

    def __setitem__(self, docname, new_data):
        raise NotImplementedError

    def __repr__(self):
        return "RemoteTiles with {} Tiles".format(str(len(self)))

class RemoteTile:
    def __init__(self, _tbinstance, tile_name, tile_id, pipe_list):
        self._tbinstance = _tbinstance
        self._tile_name = tile_name
        self._tile_id = tile_id
        if pipe_list is None:
            self._pipe_list = []
            self._pipe_dict = {}
        else:
            self._pipe_list = pipe_list
            self._pipe_dict = {p["export_name"]: p["export_tags"] for p in self._pipe_list}
        return

    @property
    def name(self):
        return self._tile_name

    @property
    def pipe_names(self):
        return list(self._pipe_dict.keys())

    @property
    def pipe_tags(self):
        return self._pipe_dict

    def send_message(self, event_name, data=None):
        self._tbinstance.send_tile_message(self.name, event_name, data)
        return

    @property
    def tile_id(self):
        return self._tile_id

    def __getitem__(self, attr):
        return self._tbinstance.get_pipe_value(self.name, attr)

    def __setitem__(self, attr, value):
        raise NotImplementedError

    def __repr__(self):
        return "RemoteTile {}".format(self.name)
