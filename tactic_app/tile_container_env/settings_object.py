
_tworker = None


class TacticSettings:
    def __init__(self):
        return

    @property
    def _tinst(self):
        return _tworker.tile_instance

    def __getitem__(self, name):
        settings = self._tinst.get_user_settings()
        return settings[name]

    def names(self):
        self._tinst.get_user_settings().keys()


Settings = TacticSettings()
