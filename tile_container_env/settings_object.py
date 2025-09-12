
_tworker = None


class TacticSettings:
    def __init__(self):
        return

    @property
    def _tinst(self):
        return _tworker.tile_instance

    def __getitem__(self, name):
        settings = self._tinst.get_settings_objects_settings()
        return settings[name]

    @property
    def names(self):
        return list(self._tinst.get_settings_object_settings().keys())


Settings = TacticSettings()
