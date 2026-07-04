"""
Project 4 — TD Control: Cliff Walking & Windy Gridworld
=======================================================
Sarsa (on-policy) vs Q-learning (off-policy) on two classic gridworlds
(Chapter 6, Examples 6.5 and 6.6).

Cliff Walking demonstrates the famous safe-vs-optimal behavioral difference:
  - Q-learning learns the optimal path right along the cliff edge,
  - Sarsa learns a safer path because it accounts for its own exploration.

Run:
    python td_control.py
Dependencies: numpy (matplotlib optional).
"""
import sys
import numpy as np

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]   # up, down, left, right


# --------------------------------------------------------------------------- #
# Environments
# --------------------------------------------------------------------------- #
class CliffWalking:
    """4x12 grid. Start bottom-left, goal bottom-right, cliff between them."""
    def __init__(self):
        self.rows, self.cols = 4, 12
        self.start = (3, 0)
        self.goal = (3, 11)

    def reset(self):
        self.pos = self.start
        return self.pos

    def step(self, a):
        dr, dc = ACTIONS[a]
        r, c = self.pos
        r = min(self.rows - 1, max(0, r + dr))
        c = min(self.cols - 1, max(0, c + dc))
        self.pos = (r, c)
        # cliff = bottom row, columns 1..10
        if r == 3 and 1 <= c <= 10:
            self.pos = self.start
            return self.start, -100.0, False
        done = (self.pos == self.goal)
        return self.pos, -1.0, done


class WindyGridworld:
    """7x10 grid with upward wind in the middle columns (Example 6.5)."""
    WIND = [0, 0, 0, 1, 1, 1, 2, 2, 1, 0]

    def __init__(self):
        self.rows, self.cols = 7, 10
        self.start = (3, 0)
        self.goal = (3, 7)

    def reset(self):
        self.pos = self.start
        return self.pos

    def step(self, a):
        dr, dc = ACTIONS[a]
        r, c = self.pos
        w = self.WIND[c]
        r = min(self.rows - 1, max(0, r + dr - w))   # wind pushes up
        c = min(self.cols - 1, max(0, c + dc))
        self.pos = (r, c)
        done = (self.pos == self.goal)
        return self.pos, -1.0, done


# --------------------------------------------------------------------------- #
# Agents
# --------------------------------------------------------------------------- #
def eps_greedy(Q, s, eps, rng, n_actions=4):
    if rng.random() < eps:
        return rng.integers(n_actions)
    return int(np.argmax(Q[s]))


def sarsa(env, episodes, alpha=0.5, gamma=1.0, eps=0.1, seed=0):
    rng = np.random.default_rng(seed)
    Q = np.zeros((env.rows, env.cols, 4))
    returns = []
    for _ in range(episodes):
        s = env.reset()
        a = eps_greedy(Q, s, eps, rng)
        total = 0.0
        done = False
        while not done:
            s2, r, done = env.step(a)
            a2 = eps_greedy(Q, s2, eps, rng)
            target = r + (0 if done else gamma * Q[s2][a2])
            Q[s][a] += alpha * (target - Q[s][a])
            s, a = s2, a2
            total += r
        returns.append(total)
    return Q, returns


def q_learning(env, episodes, alpha=0.5, gamma=1.0, eps=0.1, seed=0):
    rng = np.random.default_rng(seed)
    Q = np.zeros((env.rows, env.cols, 4))
    returns = []
    for _ in range(episodes):
        s = env.reset()
        total = 0.0
        done = False
        while not done:
            a = eps_greedy(Q, s, eps, rng)
            s2, r, done = env.step(a)
            target = r + (0 if done else gamma * np.max(Q[s2]))
            Q[s][a] += alpha * (target - Q[s][a])
            s = s2
            total += r
        returns.append(total)
    return Q, returns


def greedy_path(env, Q, max_len=200):
    s = env.reset()
    path = [s]
    for _ in range(max_len):
        a = int(np.argmax(Q[s]))
        s, _, done = env.step(a)
        path.append(s)
        if done:
            break
    return path


def render_path(env, path, title):
    arrows = {(3, 0): "S"}
    grid = [["." for _ in range(env.cols)] for _ in range(env.rows)]
    if isinstance(env, CliffWalking):
        for c in range(1, 11):
            grid[3][c] = "C"     # cliff
    grid[env.goal[0]][env.goal[1]] = "G"
    grid[env.start[0]][env.start[1]] = "S"
    for (r, c) in path:
        if grid[r][c] == ".":
            grid[r][c] = "*"
    print(f"\n{title}")
    for row in grid:
        print("  " + "".join(row))


def main():
    print("=" * 60)
    print("CLIFF WALKING  (S=start, G=goal, C=cliff, *=greedy path)")
    print("=" * 60)
    env = CliffWalking()
    Qs, rs = sarsa(env, 500)
    Qq, rq = q_learning(env, 500)
    render_path(env, greedy_path(env, Qs), "Sarsa greedy path (safer, away from edge):")
    render_path(env, greedy_path(env, Qq), "Q-learning greedy path (optimal, along edge):")
    print(f"\nAvg return over last 100 episodes:  "
          f"Sarsa={np.mean(rs[-100:]):.1f}   Q-learning={np.mean(rq[-100:]):.1f}")
    print("Note: Q-learning's *online* return is often WORSE due to occasional "
          "exploratory falls off the cliff, even though its learned path is optimal.")

    print("\n" + "=" * 60)
    print("WINDY GRIDWORLD")
    print("=" * 60)
    wenv = WindyGridworld()
    Qw, rw = sarsa(wenv, 300)
    render_path(wenv, greedy_path(wenv, Qw), "Sarsa greedy path (wind pushes you up):")
    print(f"Steps in greedy solution: {len(greedy_path(wenv, Qw)) - 1}")

    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(8, 5))
        plt.plot(np.convolve(rs, np.ones(10)/10, 'valid'), label="Sarsa")
        plt.plot(np.convolve(rq, np.ones(10)/10, 'valid'), label="Q-learning")
        plt.xlabel("episode"); plt.ylabel("return (smoothed)")
        plt.title("Cliff Walking: Sarsa vs Q-learning online return")
        plt.ylim(-200, 0); plt.legend(); plt.tight_layout()
        plt.savefig("cliff_returns.png", dpi=120)
        print("\nSaved plot -> cliff_returns.png")
    except ImportError:
        print("\n(matplotlib not installed — skipped plot)")


if __name__ == "__main__":
    main()
