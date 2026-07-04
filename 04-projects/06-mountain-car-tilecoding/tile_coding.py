"""
Minimal tile coder (Sutton-style) for linear function approximation.
Maps a continuous input vector to a list of active feature indices.
"""
import numpy as np


class TileCoder:
    def __init__(self, n_tilings, tiles_per_dim, low, high, n_actions, max_size=4096):
        self.n_tilings = n_tilings
        self.tiles_per_dim = np.array(tiles_per_dim, dtype=float)
        self.low = np.array(low, dtype=float)
        self.high = np.array(high, dtype=float)
        self.n_actions = n_actions
        self.max_size = max_size
        self.scale = self.tiles_per_dim / (self.high - self.low)

    def active_tiles(self, state, action):
        """Return n_tilings hashed indices for (state, action)."""
        s = (np.array(state, dtype=float) - self.low) * self.scale
        indices = []
        for tiling in range(self.n_tilings):
            offset = tiling / self.n_tilings
            coords = np.floor(s + offset).astype(int)
            key = (tiling, tuple(coords), action)
            indices.append(hash(key) % self.max_size)
        return indices
