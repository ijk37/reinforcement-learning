"""
Project 8 — CartPole: REINFORCE & One-step Actor-Critic
=======================================================
Policy-gradient control (Chapter 13) on a self-contained CartPole.
Implements a linear softmax policy trained two ways:
  - REINFORCE with a value baseline (Monte Carlo policy gradient)
  - One-step Actor-Critic (bootstrapped TD error drives the actor)

No deep-learning framework needed — gradients are derived by hand for the
linear-softmax policy and linear value function, with simple feature
normalization so plain numpy converges.

Run:
    python reinforce_actor_critic.py                 # runs both, compares
    python reinforce_actor_critic.py --algo ac --episodes 800
Dependencies: numpy (matplotlib optional). Uses cartpole.py in this folder.
"""
import argparse
import sys
import numpy as np
from cartpole import CartPole

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


# crude state normalization so polynomial features behave well
SCALE = np.array([2.4, 3.0, 0.21, 3.0])


def features(s):
    """Polynomial features: normalized state + squares/interactions + bias.

    A purely linear value function can't represent CartPole's value well, which
    starves the bootstrapped actor-critic critic. Adding pairwise products and
    squares (degree-2 terms) makes the linear-in-weights model expressive enough
    for both REINFORCE and actor-critic to learn. dim = 4 + 10 + 1 = 15.
    """
    z = s / SCALE
    quad = [z[i] * z[j] for i in range(4) for j in range(i, 4)]   # squares + interactions
    return np.concatenate([z, quad, [1.0]])


def softmax(h):
    z = h - h.max()
    e = np.exp(z)
    return e / e.sum()


class LinearPolicy:
    def __init__(self, d, n_actions, rng):
        self.theta = np.zeros((n_actions, d))
        self.rng = rng

    def probs(self, x):
        return softmax(self.theta @ x)

    def sample(self, x):
        p = self.probs(x)
        return int(self.rng.choice(len(p), p=p)), p

    def grad_log(self, x, a):
        """∇_theta ln pi(a|x) for all action rows: x for taken action minus E[x]."""
        p = self.probs(x)
        g = -np.outer(p, x)
        g[a] += x
        return g


def reinforce(episodes, alpha_theta=2e-3, alpha_w=1e-2, gamma=0.99, seed=0):
    rng = np.random.default_rng(seed)
    env = CartPole(rng)
    d = len(features(env.reset()))           # feature dimension (depends on features())
    pi = LinearPolicy(d, env.n_actions, rng)
    w = np.zeros(d)                      # value baseline
    returns = []

    for _ in range(episodes):
        # --- generate an episode ---
        traj = []
        s = env.reset()
        done = False
        ep_return = 0.0
        while not done:
            x = features(s)
            a, _ = pi.sample(x)
            s2, r, done = env.step(a)
            traj.append((x, a, r))
            ep_return += r
            s = s2
        returns.append(ep_return)

        # --- updates with baseline-corrected returns ---
        G = 0.0
        # precompute discounted returns from each step
        Gs = np.zeros(len(traj))
        for t in reversed(range(len(traj))):
            G = traj[t][2] + gamma * G
            Gs[t] = G
        for t, (x, a, _) in enumerate(traj):
            v = w @ x
            delta = Gs[t] - v
            w += alpha_w * delta * x                  # baseline (value) update
            pi.theta += alpha_theta * (gamma ** t) * delta * pi.grad_log(x, a)
    return returns


def actor_critic(episodes, alpha_theta=2e-3, alpha_w=0.1, gamma=0.99, seed=0):
    rng = np.random.default_rng(seed)
    env = CartPole(rng)
    d = len(features(env.reset()))           # feature dimension (depends on features())
    pi = LinearPolicy(d, env.n_actions, rng)
    w = np.zeros(d)
    returns = []

    for _ in range(episodes):
        s = env.reset()
        done = False
        I = 1.0
        ep_return = 0.0
        while not done:
            x = features(s)
            a, _ = pi.sample(x)
            s2, r, done = env.step(a)
            ep_return += r
            x2 = features(s2)
            v = w @ x
            v_next = 0.0 if done else w @ x2
            delta = r + gamma * v_next - v            # TD error (bootstrapped)
            w += alpha_w * delta * x                  # critic
            pi.theta += alpha_theta * I * delta * pi.grad_log(x, a)   # actor
            I *= gamma
            s = s2
        returns.append(ep_return)
    return returns


def summarize(name, returns):
    window = 50
    smoothed = np.convolve(returns, np.ones(window) / window, "valid")
    print(f"{name:18s} | mean return last 50 = {np.mean(returns[-50:]):6.1f} | "
          f"best 50-ep avg = {smoothed.max():6.1f}")
    return returns


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--algo", choices=["reinforce", "ac", "both"], default="both")
    p.add_argument("--episodes", type=int, default=600)
    args = p.parse_args()

    print(f"CartPole policy gradient (max return = {CartPole().max_steps}). "
          f"{args.episodes} episodes.\n")
    results = {}
    if args.algo in ("reinforce", "both"):
        results["REINFORCE+base"] = summarize("REINFORCE+base", reinforce(args.episodes))
    if args.algo in ("ac", "both"):
        results["Actor-Critic"] = summarize("Actor-Critic", actor_critic(args.episodes))

    print("\nReturns should climb over training as the pole stays up longer.")

    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(8, 5))
        for name, ret in results.items():
            sm = np.convolve(ret, np.ones(20) / 20, "valid")
            plt.plot(sm, label=name)
        plt.xlabel("episode"); plt.ylabel("return (smoothed)")
        plt.title("CartPole: policy-gradient learning curves"); plt.legend()
        plt.tight_layout(); plt.savefig("cartpole_learning.png", dpi=120)
        print("Saved plot -> cartpole_learning.png")
    except ImportError:
        print("(matplotlib not installed — skipped plot)")


if __name__ == "__main__":
    main()
