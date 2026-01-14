from abc import ABC, abstractmethod
from typing import Dict, Optional

class TileBackend(ABC):

    @abstractmethod
    def request_tile(self, task_packete):
        return
    @abstractmethod
    def restart(self, tile_id: str):
        return
    @abstractmethod
    def terminate(self, tile_id: str):
        return
