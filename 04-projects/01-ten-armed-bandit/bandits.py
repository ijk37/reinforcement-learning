"""
Project 1 — The 10-armed Testbed
=================================
Reproduces the core experiments from Chapter 2 (Sutton & Barto):
compares greedy, epsilon-greedy, optimistic-initialization, UCB, and
gradient-bandit agents on randomly generated 10-armed bandit problems.

Run:
    python bandits.py            # prints summary; saves a plot if matplotlib is present
    python bandits.py --runs 500 --steps 1000

Dependencies: numpy (required), matplotlib (optional).
"""
import argparse
import sys
import numpy as np

try:
    sys.stdout.reconfigure(encoding="utf-8")   # clean output on Windows consoles
except Exception:
    pass


# --------------------------------------------------------------------------- #
# The environment: a k-armed bandit with Gaussian rewards.
# --------------------------------------------------------------------------- #
class Bandit:
    def __init__(self, k=10, rng=None):
        self.k = k
        self.rng = rng or np.random.default_rng()
        self.q_true = self.rng.normal(0.0, 1.0, k)   # true action values q*(a)
        self.optimal = int(np.argmax(self.q_true))

    def reward(self, a):
        return self.rng.normal(self.q_true[a], 1.0)  # reward ~ N(q*(a), 1)


# --------------------------------------------------------------------------- #
# Agents. Each exposes act() -> action and update(a, r).
# --------------------------------------------------------------------------- #
class EpsilonGreedy:
    def __init__(self, k, epsilon=0.0, q_init=0.0, alpha=None, rng=None):
        self.k, self.epsilon, self.alpha = k, epsilon, alpha
        self.rng = rng or np.random.default_rng()
        self.Q = np.full(k, float(q_init))
        self.N = np.zeros(k)

    def act(self):
        if self.rng.random() < self.epsilon:
            return self.rng.integers(self.k)
        return int(np.argmax(self.Q))

    def update(self, a, r):
        self.N[a] += 1
        step = self.alpha if self.alpha is not None else 1.0 / self.N[a]
        self.Q[a] += step * (r - self.Q[a])


class UCB:
    def __init__(self, k, c=2.0, rng=None):
        self.k, self.c = k, c
        self.rng = rng or np.random.default_rng()
        self.Q = np.zeros(k)
        self.N = np.zeros(k)
        self.t = 0

    def act(self):
        self.t += 1
        # untried actions are treated as maximal
        if np.any(self.N == 0):
            return int(np.argmin(self.N))
        bonus = self.c * np.sqrt(np.log(self.t) / self.N)
        return int(np.argmax(self.Q + bonus))

    def update(self, a, r):
        self.N[a] += 1
        self.Q[a] += (r - self.Q[a]) / self.N[a]


class GradientBandit:
    def __init__(self, k, alpha=0.1, baseline=True, rng=None):
        self.k, self.alpha, self.use_baseline = k, alpha, baseline
        self.rng = rng or np.random.default_rng()
        self.H = np.zeros(k)        # preferences
        self.avg_reward = 0.0
        self.t = 0
        self._pi = np.ones(k) / k

    def _softmax(self):
        z = self.H - self.H.max()
        e = np.exp(z)
        return e / e.sum()

    def act(self):
        self._pi = self._softmax()
        return int(self.rng.choice(self.k, p=self._pi))

    def update(self, a, r):
        self.t += 1
        if self.use_baseline:
            self.avg_reward += (r - self.avg_reward) / self.t
        baseline = self.avg_reward if self.use_baseline else 0.0
        one_hot = np.zeros(self.k); one_hot[a] = 1.0
        self.H += self.alpha * (r - baseline) * (one_hot - self._pi)


# --------------------------------------------------------------------------- #
# Experiment driver
# --------------------------------------------------------------------------- #
def run(agent_factory, runs, steps, k=10, seed=0):
    """Average reward and % optimal action across many independent bandit runs."""
    rewards = np.zeros(steps)
    optimal = np.zeros(steps)
    master = np.random.default_rng(seed)
    for run_i in range(runs):
        rng = np.random.default_rng(master.integers(1 << 31))
        env = Bandit(k, rng)
        agent = agent_factory(k, rng)
        for t in range(steps):
            a = agent.act()
            r = env.reward(a)
            agent.update(a, r)
            rewards[t] += r
            optimal[t] += (a == env.optimal)
    return rewards / runs, optimal / runs


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--runs", type=int, default=300)
    p.add_argument("--steps", type=int, default=1000)
    args = p.parse_args()

    agents = {
        "greedy (eps=0)":        lambda k, rng: EpsilonGreedy(k, 0.0, rng=rng),
        "eps-greedy (0.1)":      lambda k, rng: EpsilonGreedy(k, 0.1, rng=rng),
        "eps-greedy (0.01)":     lambda k, rng: EpsilonGreedy(k, 0.01, rng=rng),
        "optimistic (Q0=5)":     lambda k, rng: EpsilonGreedy(k, 0.0, q_init=5.0, alpha=0.1, rng=rng),
        "UCB (c=2)":             lambda k, rng: UCB(k, 2.0, rng=rng),
        "gradient (a=0.1)":      lambda k, rng: GradientBandit(k, 0.1, True, rng=rng),
    }

    print(f"10-armed testbed  |  runs={args.runs}  steps={args.steps}\n")
    results = {}
    for name, fac in agents.items():
        avg_r, opt = run(fac, args.runs, args.steps)
        results[name] = (avg_r, opt)
        print(f"{name:24s}  final avg reward={avg_r[-1]:5.2f}   "
              f"%optimal(last 100)={opt[-100:].mean()*100:5.1f}%")

    try:
        import matplotlib.pyplot as plt
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 8))
        for name, (avg_r, opt) in results.items():
            ax1.plot(avg_r, label=name)
            ax2.plot(opt * 100, label=name)
        ax1.set(xlabel="steps", ylabel="average reward", title="10-armed testbed")
        ax2.set(xlabel="steps", ylabel="% optimal action")
        ax1.legend(); ax2.legend()
        fig.tight_layout()
        fig.savefig("bandit_results.png", dpi=120)
        print("\nSaved plot -> bandit_results.png")
    except ImportError:
        print("\n(matplotlib not installed — skipped plot)")


if __name__ == "__main__":
    main()
