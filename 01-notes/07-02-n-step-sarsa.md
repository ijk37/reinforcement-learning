# 7.2 — n-step Sarsa (Control)

> **Chapter 7: n-step Bootstrapping** · Book section: §7.2
> Previous: [7.1 — n-step TD Prediction](07-01-n-step-td-prediction.md) · Next: [7.3 — n-step Off-policy Learning & Tree Backup](07-03-n-step-off-policy-and-tree-backup.md)

---

## 🌱 The Big Picture

Exactly the move you'd expect: swap states for **state–action pairs**, attach ε-greedy improvement, and the n-step machinery becomes a control method — **n-step Sarsa**.

---

## 🧮 The n-step return for action values

$$G_{t:t+n} \doteq R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n Q_{t+n-1}(S_{t+n}, A_{t+n})$$

(ends with the **Q-value of the pair actually reached**, n steps ahead; if the episode ends first, it's the full return.)

### The update

$$Q_{t+n}(S_t, A_t) \leftarrow Q_{t+n-1}(S_t, A_t) + \alpha\Big[G_{t:t+n} - Q_{t+n-1}(S_t, A_t)\Big]$$

```text
n-step Sarsa:
choose A0 ε-greedy; store S0, A0
for t = 0, 1, 2, ...:
    take A_t → observe R_{t+1}, S_{t+1}
    if S_{t+1} terminal: T = t+1
    else: choose A_{t+1} ε-greedy; store it
    τ = t − n + 1                  ← the time whose estimate is now updateable
    if τ ≥ 0:
        G = Σ_{i=τ+1}^{min(τ+n, T)} γ^{i−τ−1} R_i
        if τ + n < T:  G += γ^n Q(S_{τ+n}, A_{τ+n})
        Q(S_τ, A_τ) += α (G − Q(S_τ, A_τ))
        (and make π ε-greedy w.r.t. Q)
until τ = T − 1
```

---

## 🗺️ Why n-step control learns SO much faster — the gridworld picture (book Figure 7.4)

Picture an agent wandering a gridworld and finally reaching a goal G with a positive reward (all other rewards 0, initial values 0).

- **1-step Sarsa:** only the **single last** action before the goal gets its value increased this episode. Everything earlier learned *nothing*. 🐌
- **10-step Sarsa:** the **last ten** actions of the path get strengthened — credit flows ten steps back in one episode. 🚀

> 💡 This single picture is the best intuition for n-step methods: **n controls how far credit/blame reaches back along the trajectory per experience.**

### Variants

- **n-step Expected Sarsa:** same, but the final term is the *expected* value over actions at $S_{t+n}$: $\gamma^n \sum_a \pi(a|S_{t+n}) Q(S_{t+n}, a)$ — lower variance, same spirit as 1-step Expected Sarsa. (The book writes this as $\gamma^n \bar V(S_{t+n})$ where $\bar V$ is the expected approximate value.)

---

## 🎯 Key Takeaways

1. n-step Sarsa = n real rewards + Q of the (n-steps-later) pair; updates lag n steps.
2. **Credit assignment speedup**: one episode updates the last n actions, not just the last one.
3. Expected-Sarsa-style final term reduces variance further.
4. Same GPI loop as always: TD-style evaluation + ε-greedy improvement.

---

➡️ **Next:** [7.3 — n-step Off-policy Learning & the Tree Backup Algorithm](07-03-n-step-off-policy-and-tree-backup.md) — multi-step learning from someone else's behavior, with and without importance sampling.
