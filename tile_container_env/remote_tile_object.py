
_tworker = None


class RemoteTiles:
    def __init__(self):
        self._iter_value = -1
        self._other_tile_data = None
        self._other_tile_names = None
        return

    @property
    def names(self):
        self._other_tile_data = self._get_other_tile_data()
        self._other_tile_names = list(self._other_tile_data.keys())
        return self._other_tile_names

    def _get_other_tile_data_if_necessary(self):
        if self._other_tile_data is None:
            self._other_tile_data = self._get_other_tile_data()
            self._other_tile_names = list(self._other_tile_data.keys())

    def keys(self):
        return self.names

    def _get_other_tile_data(self):
        return _tworker.post_and_wait(_tworker.tile_instance._main_id, "OtherTileData",
                                      {"tile_id": _tworker.tile_instance._tworker.my_id})

    def __getitem__(self, x):
        self._get_other_tile_data_if_necessary()
        return RemoteTile(_tworker.tile_instance, x,
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
        self._get_other_tile_data_if_necessary()
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

    def send_message(self, event_name, data=None, callback_func=None):
        self._tbinstance.send_tile_message(self.name, event_name, data, callback_func=callback_func)
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


class RemotePipes:
    def __init__(self):
        return

    @property
    def names(self):
        otd = self._get_other_tile_data()
        result = []
        for tile_name, tdict in otd.items():
            if tdict["pipes"] is not None:
                for pipe in tdict["pipes"]:
                    result.append(tile_name + "_" + pipe["export_name"])
        return result

    def keys(self):
        return self.names

    def _get_other_tile_data(self):
        return _tworker.post_and_wait(_tworker.tile_instance._main_id, "OtherTileData", {"tile_id": _tworker.my_id})

    def __getitem__(self, pipe_key):
        return _tworker.tile_instance.get_pipe_value(pipe_key)


Tiles = RemoteTiles()
Pipes = RemotePipes()
