"""
Project 5 — Dyna-Q on a Maze
============================
Demonstrates how planning (replaying a learned model) slashes the amount of
real experience needed (Chapter 8, Example 8.1). Also includes Dyna-Q+ with an
exploration bonus, which discovers newly-opened shortcuts (Example 8.3 idea).

Run:
    python dyna_maze.py
Dependencies: numpy (matplotlib optional).
"""
import sys
import numpy as np

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]


class Maze:
    """Standard Dyna maze: 6x9 grid with a wall and a goal."""
    def __init__(self):
        self.rows, self.cols = 6, 9
        self.start = (2, 0)
        self.goal = (0, 8)
        self.walls = {(1, 2), (2, 2), (3, 2), (4, 5), (0, 7), (1, 7), (2, 7)}

    def reset(self):
        self.pos = self.start
        return self.pos

    def step(self, a):
        dr, dc = ACTIONS[a]
        r, c = self.pos
        nr = min(self.rows - 1, max(0, r + dr))
        nc = min(self.cols - 1, max(0, c + dc))
        if (nr, nc) in self.walls:
            nr, nc = r, c           # blocked
        self.pos = (nr, nc)
        done = (self.pos == self.goal)
        return self.pos, (1.0 if done else 0.0), done


def eps_greedy(Q, s, eps, rng):
    if rng.random() < eps:
        return rng.integers(4)
    q = Q[s]
    # break ties randomly (crucial early on, when all Q values are equal)
    best = np.flatnonzero(q == q.max())
    return int(rng.choice(best))


def dyna_q(env, episodes, n_plan, alpha=0.1, gamma=0.95, eps=0.1,
           plus=False, kappa=1e-3, seed=0):
    rng = np.random.default_rng(seed)
    Q = np.zeros((env.rows, env.cols, 4))
    model = {}                          # (s,a) -> (r, s2)
    last_tried = {}                     # for Dyna-Q+ bonus
    seen_pairs = []                     # list of (s,a) ever tried (for O(1) sampling)
    t = 0
    steps_per_episode = []

    for _ in range(episodes):
        s = env.reset()
        done = False
        steps = 0
        while not done:
            t += 1
            steps += 1
            a = eps_greedy(Q, s, eps, rng)
            s2, r, done = env.step(a)
            # direct RL
            Q[s][a] += alpha * (r + gamma * np.max(Q[s2]) - Q[s][a])
            # model learning
            if (s, a) not in model:
                seen_pairs.append((s, a))
            model[(s, a)] = (r, s2)
            last_tried[(s, a)] = t
            # planning: sample previously-experienced (state, action) pairs directly
            for _ in range(n_plan):
                ps, pa = seen_pairs[rng.integers(len(seen_pairs))]
                pr, ps2 = model[(ps, pa)]
                if plus:
                    tau = t - last_tried.get((ps, pa), 0)
                    pr = pr + kappa * np.sqrt(tau)
                Q[ps][pa] += alpha * (pr + gamma * np.max(Q[ps2]) - Q[ps][pa])
            s = s2
        steps_per_episode.append(steps)
    return Q, steps_per_episode


def main():
    env = Maze()
    print("Dyna-Q on the standard maze — steps to reach the goal per episode.")
    print("More planning steps (n) => far fewer real steps needed.\n")
    for n in (0, 5, 50):
        # average over a few seeds for a stable picture
        all_steps = []
        for seed in range(5):
            _, steps = dyna_q(env, episodes=30, n_plan=n, seed=seed)
            all_steps.append(steps)
        avg = np.mean(all_steps, axis=0)
        print(f" n_plan={n:2d} | steps in episode 2 = {avg[1]:6.0f} | "
              f"episode 10 = {avg[9]:5.0f} | episode 30 = {avg[-1]:4.0f}")

    print("\nObserve: with n=0 (plain Q-learning) early episodes are very long; "
          "with n=50 the agent reaches near-optimal in just a few episodes.")

    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(8, 5))
        for n in (0, 5, 50):
            curves = [dyna_q(env, 30, n, seed=s)[1] for s in range(5)]
            plt.plot(np.mean(curves, axis=0), label=f"n_plan={n}")
        plt.xlabel("episode"); plt.ylabel("steps to goal")
        plt.ylim(0, 800); plt.legend(); plt.title("Dyna-Q: planning vs. learning")
        plt.tight_layout(); plt.savefig("dyna_steps.png", dpi=120)
        print("\nSaved plot -> dyna_steps.png")
    except ImportError:
        print("\n(matplotlib not installed — skipped plot)")


if __name__ == "__main__":
    main()
