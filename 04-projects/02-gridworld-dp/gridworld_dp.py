"""
Project 2 — Gridworld Dynamic Programming
=========================================
Implements iterative policy evaluation, policy iteration, and value
iteration on the classic 4x4 gridworld (Chapter 4, Example 4.1).

Gridworld:
  - 4x4 grid, states 0..15. States 0 and 15 are terminal (corners).
  - Actions: up/down/left/right. Moving off the grid stays in place.
  - Reward: -1 on every transition until termination. Undiscounted (gamma=1).

The true value function of the equiprobable random policy has the well-known
pattern (0, -14, -20, -22, ...). Value iteration recovers the optimal policy
(head straight to the nearest terminal corner).

Run:
    python gridworld_dp.py
Dependencies: numpy.
"""
import sys
import numpy as np

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

N = 4
N_STATES = N * N
TERMINALS = {0, N_STATES - 1}
ACTIONS = {"U": -N, "D": +N, "L": -1, "R": +1}
GAMMA = 1.0


def step(s, a):
    """Deterministic transition. Returns (next_state, reward)."""
    if s in TERMINALS:
        return s, 0.0
    row, col = divmod(s, N)
    if a == "U" and row == 0:   ns = s
    elif a == "D" and row == N - 1: ns = s
    elif a == "L" and col == 0: ns = s
    elif a == "R" and col == N - 1: ns = s
    else: ns = s + ACTIONS[a]
    return ns, -1.0


def policy_evaluation(policy, theta=1e-6):
    """policy[s] -> dict action->prob. Returns V."""
    V = np.zeros(N_STATES)
    while True:
        delta = 0.0
        for s in range(N_STATES):
            if s in TERMINALS:
                continue
            v_old = V[s]
            V[s] = sum(p * (r + GAMMA * V[ns])
                       for a, p in policy[s].items()
                       for (ns, r) in [step(s, a)])
            delta = max(delta, abs(v_old - V[s]))
        if delta < theta:
            return V


def greedy_policy_from(V):
    """Greedy deterministic policy w.r.t. V (one-step lookahead)."""
    policy = {}
    for s in range(N_STATES):
        if s in TERMINALS:
            policy[s] = {}
            continue
        best, best_a = -np.inf, None
        for a in ACTIONS:
            ns, r = step(s, a)
            q = r + GAMMA * V[ns]
            if q > best:
                best, best_a = q, a
        policy[s] = {best_a: 1.0}
    return policy


def policy_iteration():
    # start with equiprobable random policy
    policy = {s: ({a: 1 / len(ACTIONS) for a in ACTIONS} if s not in TERMINALS else {})
              for s in range(N_STATES)}
    iterations = 0
    while True:
        iterations += 1
        V = policy_evaluation(policy)
        new_policy = greedy_policy_from(V)
        # check stability (compare chosen actions)
        stable = all(set(new_policy[s]) == set(policy[s]) or s in TERMINALS
                     for s in range(N_STATES))
        policy = new_policy
        if stable:
            return policy, V, iterations


def value_iteration(theta=1e-6):
    V = np.zeros(N_STATES)
    sweeps = 0
    while True:
        sweeps += 1
        delta = 0.0
        for s in range(N_STATES):
            if s in TERMINALS:
                continue
            v_old = V[s]
            V[s] = max(step(s, a)[1] + GAMMA * V[step(s, a)[0]] for a in ACTIONS)
            delta = max(delta, abs(v_old - V[s]))
        if delta < theta:
            break
    return greedy_policy_from(V), V, sweeps


def show_values(V, title):
    print(f"\n{title}")
    grid = V.reshape(N, N)
    for row in grid:
        print("  " + " ".join(f"{v:6.1f}" for v in row))


def show_policy(policy, title):
    print(f"\n{title}")
    arrows = {"U": "^", "D": "v", "L": "<", "R": ">"}
    for s in range(N_STATES):
        if s in TERMINALS:
            ch = "#"
        else:
            ch = arrows[next(iter(policy[s]))]
        print(f" {ch}", end="\n" if (s + 1) % N == 0 else "")


def main():
    # 1) Evaluate the random policy
    random_policy = {s: ({a: 1 / len(ACTIONS) for a in ACTIONS} if s not in TERMINALS else {})
                     for s in range(N_STATES)}
    V_rand = policy_evaluation(random_policy)
    show_values(V_rand, "Value of equiprobable RANDOM policy (expect ~0,-14,-20,-22 pattern):")

    # 2) Policy iteration
    pi_star, V_pi, iters = policy_iteration()
    show_values(V_pi, f"Optimal value via POLICY ITERATION ({iters} improvement steps):")
    show_policy(pi_star, "Optimal policy (policy iteration):")

    # 3) Value iteration
    pi_vi, V_vi, sweeps = value_iteration()
    show_values(V_vi, f"Optimal value via VALUE ITERATION ({sweeps} sweeps):")
    show_policy(pi_vi, "Optimal policy (value iteration):")

    assert np.allclose(V_pi, V_vi, atol=1e-3), "PI and VI should agree!"
    print("\nOK: Policy iteration and value iteration agree on the optimal values.")


if __name__ == "__main__":
    main()
