"""
Project 7 — Random Walk: TD(0), n-step TD, and TD(lambda)
=========================================================
Prediction experiments on the 19-state random walk (Chapters 6, 7, 12).
Shows the bias-variance dial: intermediate n and intermediate lambda
beat both extremes (pure TD(0) and pure Monte Carlo).

States 1..19 in a line; start in the middle (state 10). Each step moves
left/right with prob 1/2. Terminate off the left end (reward -1) or off the
right end (reward +1). gamma = 1. True value of state i is linear: -1 + 2*i/20.

Run:
    python td_lambda.py
Dependencies: numpy (matplotlib optional).
"""
import sys
import numpy as np

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

N = 19
START = (N + 1) // 2          # state 10
TRUE_V = np.array([-1 + 2 * i / (N + 1) for i in range(1, N + 1)])  # states 1..N


def generate_episode(rng):
    """Return list of states visited (1..N) and the terminal reward."""
    s = START
    states = [s]
    while True:
        if rng.random() < 0.5:
            s -= 1
        else:
            s += 1
        if s == 0:
            return states, -1.0
        if s == N + 1:
            return states, +1.0
        states.append(s)


def rms_error(V):
    return np.sqrt(np.mean((V[1:N+1] - TRUE_V) ** 2))


def n_step_td(episodes, n, alpha, seed):
    rng = np.random.default_rng(seed)
    V = np.zeros(N + 2)            # index 0 and N+1 are terminal (value 0)
    errs = []
    for _ in range(episodes):
        states, reward = generate_episode(rng)
        T = len(states)
        # rewards are 0 except the terminal transition (reward) at the end
        for t in range(T):
            tau = t
            end = min(tau + n, T)
            G = 0.0               # all intermediate rewards are 0
            if tau + n >= T:      # window reaches terminal -> include terminal reward
                G += reward
            else:
                G += V[states[tau + n]]   # bootstrap (gamma=1)
            V[states[tau]] += alpha * (G - V[states[tau]])
        errs.append(rms_error(V))
    return np.mean(errs)


def td_lambda(episodes, lam, alpha, seed):
    rng = np.random.default_rng(seed)
    V = np.zeros(N + 2)
    errs = []
    for _ in range(episodes):
        z = np.zeros(N + 2)       # eligibility traces
        s = START
        done = False
        while not done:
            if rng.random() < 0.5:
                s2 = s - 1
            else:
                s2 = s + 1
            if s2 == 0:
                r, done, v_next = -1.0, True, 0.0
            elif s2 == N + 1:
                r, done, v_next = +1.0, True, 0.0
            else:
                r, done, v_next = 0.0, False, V[s2]
            delta = r + v_next - V[s]     # gamma = 1
            z[s] += 1.0
            V += alpha * delta * z
            z *= lam                       # gamma*lambda, gamma=1
            s = s2
        errs.append(rms_error(V))
    return np.mean(errs)


def main():
    episodes, seeds = 10, 50
    print("19-state random walk — average RMS error over first "
          f"{episodes} episodes ({seeds} seeds).\n")

    print("n-step TD (intermediate n is best):")
    for n in (1, 2, 4, 8, 16):
        best = min(np.mean([n_step_td(episodes, n, a, s) for s in range(seeds)])
                   for a in (0.05, 0.1, 0.2, 0.4))
        print(f"  n={n:2d}  best RMS over alphas = {best:.3f}")

    print("\nTD(lambda) (intermediate lambda is best):")
    for lam in (0.0, 0.4, 0.8, 0.9, 0.95, 1.0):
        best = min(np.mean([td_lambda(episodes, lam, a, s) for s in range(seeds)])
                   for a in (0.05, 0.1, 0.2, 0.4))
        print(f"  lambda={lam:.2f}  best RMS over alphas = {best:.3f}")

    print("\nTakeaway: neither pure TD(0) (n=1, lambda=0) nor pure MC "
          "(n=inf, lambda=1) is best — the interior wins.")


if __name__ == "__main__":
    main()
