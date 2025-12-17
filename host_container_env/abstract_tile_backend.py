import os
from abc import ABC, abstractmethod
from typing import Dict, Tuple, Optional

class TileBackend(ABC):

    @abstractmethod
    def launch(self, username: str, owner: Optional[str], parent: Optional[str], tile_id: Optional[str], meta: Dict,
               project_name: Optional[str] = None, tile_name: Optional[str] = None):
        return
    @abstractmethod
    def restart(self, tile_id: str):
        return
    @abstractmethod
    def terminate(self, tile_id: str):
        return
