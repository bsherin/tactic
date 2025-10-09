# tile_backend.py
import os
from abc import ABC, abstractmethod
from typing import Dict, Tuple, Optional

class TileBackend(ABC):
    """Return (tile_id, address_or_ip) from launch()."""

    @abstractmethod
    def launch(self, username: str, owner: Optional[str], parent: Optional[str], tile_id: Optional[str], meta: Dict) -> Tuple[str, str]:
        return

    @abstractmethod
    def mark_busy(self, tile_id: str):
        return

    @abstractmethod
    def mark_idle(self, tile_id: str):
        return
    @abstractmethod
    def restart(self, tile_id: str):
        return
    @abstractmethod
    def terminate(self, tile_id: str):
        return
