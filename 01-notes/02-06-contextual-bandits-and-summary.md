# 2.6 — Associative Search (Contextual Bandits) & Chapter Summary

> **Chapter 2: Multi-armed Bandits** · Book sections: §2.9–§2.10
> Previous: [2.5 — Gradient Bandit Algorithms](02-05-gradient-bandit-algorithms.md) · Next: [3.1 — The Agent–Environment Interface](03-01-agent-environment-interface.md)

---

## 🌱 Bridging toward full RL

So far: **one situation**, learn which single action is best. Full RL: **many situations**, learn a *policy* mapping each situation to its best action. **Associative search** (modern name: **contextual bandits**) is the stepping stone between them.

### The setup 🎰🎨

Imagine several different k-armed bandit machines, and at each step you face a **randomly chosen one** — but the machine *tells you which one it is* (say, by its display color). Now you can learn a **policy**: *"if red machine → pull lever 1; if green → pull lever 3."*

- Better than ignoring the color (which could only learn the best *average* action across machines).
- Still **not** full RL: your action affects only the **immediate reward**, not *which situation comes next*.

| Setting | Multiple situations? | Actions affect next situation? |
|---|:---:|:---:|
| k-armed bandit | ❌ | ❌ |
| **Contextual bandit** | ✅ | ❌ |
| Full RL (MDP, Ch. 3+) | ✅ | ✅ |

**Real-world example 📱:** showing news headlines. The "context" is the user profile; the action is which headline to show; reward is a click. Each decision is (approximately) independent of the next — a classic contextual bandit, used heavily in industry.

---

## 📋 Chapter 2 Summary — the exploration toolbox

| Method | Idea | Exploration mechanism | Key parameter |
|---|---|---|---|
| **Greedy** | Always pick best estimate | None ❌ | — |
| **ε-greedy** | Random action ε of the time | Undirected, constant | ε |
| **Optimistic init** | Start estimates high | Only early on | $Q_1$ |
| **UCB** | Value + uncertainty bonus | Directed at uncertainty | c |
| **Gradient bandit** | Softmax over learned preferences | Inherent (probabilistic) | α |

Findings from the parameter study (each method run over a wide range of its parameter):

- All methods perform best at an **intermediate** parameter value (inverted-U curves) — tuning matters!
- On the 10-armed testbed, **UCB performs best overall**, but all are fairly close.
- Each method is **insensitive enough** to its parameter to be practical.

### What's still missing

This chapter's methods are far from a *full* solution to exploration. More sophisticated approaches exist:

- **Gittins indices** — Bayesian optimal solution for certain bandits; computationally feasible only in special cases.
- **Thompson sampling (posterior sampling)** — sample from your belief distribution and act greedily w.r.t. the sample.
- A truly optimal balance could in principle be computed by planning over **information states** (your belief about the bandit) — but the computation explodes; approximations are the realistic path.

None of these scale easily to full RL, which is why simple methods like ε-greedy dominate in practice.

---

## 🎯 Key Takeaways

1. **Contextual bandits** add situations (and policies!) but actions still don't influence the future — the last stop before full RL.
2. All exploration methods have a parameter; performance is an inverted-U in that parameter.
3. **UCB** wins on the testbed; **ε-greedy** wins on simplicity and generality.
4. Exploration remains an open frontier of RL research — Chapter 2's methods are the practical workhorses, not the final word.

---

➡️ **Next chapter:** [3.1 — The Agent–Environment Interface](03-01-agent-environment-interface.md) — the full RL problem at last: Markov Decision Processes, where actions change the future.
