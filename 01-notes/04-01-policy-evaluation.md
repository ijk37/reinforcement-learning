# 4.1 — Iterative Policy Evaluation (Prediction)

> **Chapter 4: Dynamic Programming** · Book section: §4.1
> Previous: [3.5 — Optimal Policies](03-05-optimal-policies-and-value-functions.md) · Next: [4.2 — Policy Improvement & Policy Iteration](04-02-policy-improvement-and-policy-iteration.md)

---

## 🌱 The Big Picture

**Dynamic Programming (DP)** = a collection of algorithms that compute optimal policies **given a perfect model** of the MDP (you know $p(s', r|s,a)$ exactly). DP is limited in practice (perfect models are rare, computation is heavy) but is **theoretically essential**: every method in the rest of the book is an attempt to achieve what DP achieves — with less computation and without a model.

> Core idea of DP (and of all RL): **use value functions to organize the search for good policies**, by turning Bellman equations into update rules.

First problem: **prediction** — given a policy π, compute $v_\pi$.

---

## 🔁 The algorithm: turn the Bellman equation into an update

Recall the Bellman equation for $v_\pi$ — a consistency condition that the true $v_\pi$ uniquely satisfies. **Iterative policy evaluation** simply applies it repeatedly as an *assignment*:

$$v_{k+1}(s) \leftarrow \sum_a \pi(a|s) \sum_{s', r} p(s', r \mid s, a)\Big[r + \gamma\, v_k(s')\Big] \qquad \text{for all } s$$

- Start from an arbitrary $v_0$ (e.g., all zeros; terminal states must be 0).
- Each round updates **every state** once — a **sweep** through the state space.
- As $k \to \infty$, $v_k \to v_\pi$. Guaranteed. ✅

This kind of operation is called an **expected update**: we update one state's value based on the values of **all** possible successor states, weighted by their probabilities (using the model — no sampling involved).

### Two flavors of sweeping

- **Two-array version:** compute all new values from old values, then swap arrays.
- **In-place version:** overwrite values immediately; new values are used right away within the same sweep. Usually converges **faster** and is what people actually implement.

### Stopping rule 🛑
Stop when the largest change in a sweep is tiny: $\max_s |v_{k+1}(s) - v_k(s)| < \theta$.

```python
# Iterative Policy Evaluation (in-place)
V = zeros(num_states)
repeat:
    delta = 0
    for s in states:
        v_old = V[s]
        V[s] = sum over a of pi(a|s) * sum over s',r of p(s',r|s,a) * (r + gamma * V[s'])
        delta = max(delta, abs(v_old - V[s]))
until delta < theta
```

---

## 🗺️ Worked example: the 4×4 Gridworld (book Example 4.1)

- 14 normal states + 2 terminal corners (shaded). Actions: up/down/left/right. Every step: reward **−1** until termination (undiscounted, episodic). Moves off-grid leave the state unchanged.
- Policy to evaluate: **equiprobable random** (each action prob. 0.25).

Watch the values flow outward from the terminal corners, sweep by sweep:

| Sweep | What $V$ looks like |
|---|---|
| $k=0$ | all 0 |
| $k=1$ | every non-terminal state = −1 (one step of −1 reward, successors still 0) |
| $k=2$ | states adjacent to terminals = −1.7…, others −2 |
| $k=10$ | values like −6.1, −8.4, −9 emerging |
| $k=\infty$ | final values: −14, −18, −20, −22 pattern — i.e. *the expected number of (negated) steps to terminate under random walking* |

> 💡 **Interpretation:** under the random policy, from the hardest state you wander an expected 22 steps before reaching a terminal corner. The value function *measures* your policy.

And a teaser: even the value function of the *random* policy is enough to find the **optimal** policy in this gridworld — just act greedily with respect to it. That's the subject of the next note.

---

## 🎯 Key Takeaways

1. DP assumes a **known model** and computes value functions by **sweeps of expected updates**.
2. Iterative policy evaluation: Bellman equation → assignment; $v_k \to v_\pi$ guaranteed.
3. **Expected update** = full-width, probability-weighted, one-step lookahead using the model.
4. In-place updates converge faster; stop when the max change per sweep is below a threshold.

---

➡️ **Next:** [4.2 — Policy Improvement & Policy Iteration](04-02-policy-improvement-and-policy-iteration.md) — now that we can *evaluate* a policy, how do we make it *better*?
