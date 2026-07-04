# 8.3 — Prioritized Sweeping & Expected vs. Sample Updates

> **Chapter 8: Planning and Learning with Tabular Methods** · Book sections: §8.4–§8.5
> Previous: [8.2 — Dyna-Q](08-02-dyna-q.md) · Next: [8.4 — Trajectory Sampling & RTDP](08-04-trajectory-sampling-and-rtdp.md)

---

## 🎯 Prioritized Sweeping (§8.4) — plan where it matters

Dyna-Q plans by replaying transitions **uniformly at random** from memory. Wasteful! Early on, almost all values are unchanged — most simulated updates accomplish exactly nothing (updating a zero-value state from zero-value successors 🤷).

**Better idea — work backwards from change:**

> When some state's value changes (e.g., the goal's neighbor after reaching the goal), the states that **lead into it** are the ones whose values probably need updating next. Propagate change *backward* through the model, in order of urgency.

**Mechanism:** a priority queue of state–action pairs, prioritized by the size of their potential update (TD error magnitude):

```text
Prioritized sweeping (sketch):
after each real step (S,A) → R,S′:
    P = | R + γ max_a Q(S′,a) − Q(S,A) |        ← how big would this update be?
    if P > θ: push (S,A) into queue with priority P

planning, repeat n times (while queue nonempty):
    (S,A) = pop highest priority
    update Q(S,A) via the model
    for every (S̄,Ā) predicted to lead to S:     ← predecessors!
        P̄ = | R̄ + γ max_a Q(S,a) − Q(S̄,Ā) |
        if P̄ > θ: push (S̄,Ā) with priority P̄
```

**Result:** on maze tasks, prioritized sweeping reaches optimal solutions **5–10× faster** than unprioritized Dyna-Q; it has solved mazes with millions of states. 🏎️

(Extensions exist for stochastic environments — use expected updates with learned transition frequencies — and variants that propagate *forward* from changes too.)

---

## ⚖️ Expected vs. Sample Updates (§8.5) — a fundamental compute trade-off

One-step updates come in two strengths:

| | **Expected update** (DP-style) | **Sample update** (TD-style) |
|---|---|---|
| Uses | **all** possible next states, weighted by probability | **one** sampled next state |
| Needs | distribution model | sample model (or real experience) |
| Per-update cost | ≈ b× more compute (b = branching factor) | 1 unit |
| Sampling error | none ✅ | yes ❌ |

Example (Q-value form): expected update
$$Q(s,a) \leftarrow \sum_{s',r} p(s',r|s,a)\big[r + \gamma \max_{a'} Q(s',a')\big]$$
vs. sample update (with model-sampled $S', R$): the usual Q-learning-style step.

### The surprising answer to "which is better per unit of compute?" 🤔

If an expected update costs $b$ times a sample update, is one expected update better than $b$ sample updates? The book's analysis (Figure 8.7) says: **for large branching factors, NO** —

- $b$ sample updates achieve **most of the error reduction** of one expected update… but their benefit accrues **incrementally** along the way.
- Sample updates also feed on progress: each successive sample bootstraps off successor values that the *earlier samples already improved* — an effect expected updates don't get mid-computation.
- For small $b$ (few possible outcomes), expected updates win — exactness is cheap.

> 💡 **Rule of thumb:** big stochastic branching → sample updates; small branching / deterministic → expected updates. This is why sample-based planning (like MCTS) dominates in huge domains.

---

## 🎯 Key Takeaways

1. Uniform replay wastes planning compute; **prioritized sweeping** queues updates by urgency and sweeps **backward** from changed values.
2. 5–10× speedups are typical; the backward-focusing idea generalizes ("backward focusing" of planning computations).
3. Expected updates are exact but cost ~b× compute; sample updates approximate the same improvement at 1/b the cost **and** compound their own progress.
4. In large problems, **sample updates rule**.

---

➡️ **Next:** [8.4 — Trajectory Sampling & Real-time DP](08-04-trajectory-sampling-and-rtdp.md) — should planning effort follow the *on-policy distribution* of states the agent actually visits?
