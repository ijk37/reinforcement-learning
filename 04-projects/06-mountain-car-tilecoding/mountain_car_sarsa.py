"""
Project 6 — Mountain Car with Tile-Coded Semi-gradient Sarsa
============================================================
Continuous-state control via linear function approximation (Chapters 9-10,
Example 10.1). The underpowered car must drive *backward* first to build
momentum — a task that defeats short-sighted control.

State  = (position in [-1.2, 0.6], velocity in [-0.07, 0.07])
Actions= 0 reverse, 1 coast, 2 forward
Reward = -1 per step until the goal (position >= 0.5).

Run:
    python mountain_car_sarsa.py
Dependencies: numpy (matplotlib optional). Uses tile_coding.py in this folder.
"""
import sys
import numpy as np
from tile_coding import TileCoder

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


class MountainCar:
    def __init__(self, rng):
        self.rng = rng

    def reset(self):
        self.pos = self.rng.uniform(-0.6, -0.4)
        self.vel = 0.0
        return (self.pos, self.vel)

    def step(self, a):
        # a in {0,1,2} -> throttle {-1,0,+1}
        throttle = a - 1
        self.vel += 0.001 * throttle - 0.0025 * np.cos(3 * self.pos)
        self.vel = np.clip(self.vel, -0.07, 0.07)
        self.pos += self.vel
        if self.pos < -1.2:
            self.pos, self.vel = -1.2, 0.0
        done = self.pos >= 0.5
        return (self.pos, self.vel), -1.0, done


def q_value(w, tc, s, a):
    return w[tc.active_tiles(s, a)].sum()


def best_action(w, tc, s):
    qs = [q_value(w, tc, s, a) for a in range(tc.n_actions)]
    return int(np.argmax(qs)), qs


def sarsa(episodes=200, n_tilings=8, alpha=0.1, gamma=1.0, eps=0.0, seed=0):
    rng = np.random.default_rng(seed)
    env = MountainCar(rng)
    tc = TileCoder(n_tilings, tiles_per_dim=[8, 8],
                   low=[-1.2, -0.07], high=[0.6, 0.07], n_actions=3, max_size=4096)
    w = np.zeros(tc.max_size)            # optimistic: true q is negative, zeros encourage exploration
    step_size = alpha / n_tilings
    steps_per_episode = []

    for _ in range(episodes):
        s = env.reset()
        a = (rng.integers(3) if rng.random() < eps else best_action(w, tc, s)[0])
        done = False
        steps = 0
        while not done and steps < 5000:
            steps += 1
            s2, r, done = env.step(a)
            tiles = tc.active_tiles(s, a)
            if done:
                w[tiles] += step_size * (r - w[tiles].sum())
                break
            a2 = (rng.integers(3) if rng.random() < eps else best_action(w, tc, s2)[0])
            target = r + gamma * q_value(w, tc, s2, a2)
            w[tiles] += step_size * (target - w[tiles].sum())
            s, a = s2, a2
        steps_per_episode.append(steps)
    return w, tc, steps_per_episode


def main():
    print("Mountain Car — tile-coded semi-gradient Sarsa (8 tilings, optimistic init).")
    print("Goal: reach position >= 0.5. Reward -1/step, so fewer steps = better.\n")
    w, tc, steps = sarsa(episodes=200)
    print(f"Steps to goal: episode 1 = {steps[0]}, "
          f"episode 50 = {steps[49]}, episode 200 = {steps[-1]}")
    print(f"Mean steps over last 20 episodes: {np.mean(steps[-20:]):.0f}")
    print("A well-trained policy solves it in ~100-150 steps "
          "(it must first reverse up the left hill to build momentum).")

    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(8, 5))
        plt.plot(steps)
        plt.xlabel("episode"); plt.ylabel("steps to reach goal")
        plt.title("Mountain Car: learning curve (lower is better)")
        plt.yscale("log"); plt.tight_layout()
        plt.savefig("mountaincar_learning.png", dpi=120)
        print("\nSaved plot -> mountaincar_learning.png")
    except ImportError:
        print("\n(matplotlib not installed — skipped plot)")


if __name__ == "__main__":
    main()
