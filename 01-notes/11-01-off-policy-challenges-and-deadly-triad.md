# 11.1 — Off-policy Approximation: Divergence & the Deadly Triad

> **Chapter 11: Off-policy Methods with Approximation** (starred/advanced chapter) · Book sections: §11.1–§11.3
> Previous: [10.2 — Average-Reward Setting](10-02-average-reward-setting.md) · Next: [11.2 — Value-function Geometry & the Bellman Error](11-02-bellman-error-and-value-geometry.md)

---

## 🌱 The Big Picture

Off-policy learning worked fine with tables (Q-learning!). Function approximation worked fine on-policy (semi-gradient Sarsa!). Combine them, and… **the algorithms can diverge to infinity.** This chapter diagnoses why. It's the most theoretical chapter of the book — here's the beginner-friendly tour of its first half.

**Two distinct challenges of off-policy learning:**
1. **The target of updates:** behavior data is about b's actions, targets are about π → fix with importance sampling, tree backup, etc. (Ch. 5, 7 ideas, now with FA — §11.1 lays out semi-gradient off-policy TD and Expected Sarsa with ratios $\rho_t$.)
2. **The distribution of updates:** updates happen where **b** goes, not where **π** would go. With a table this didn't matter (each update was sound by itself); with FA, *where* you update determines *what* you fit — and the on-policy distribution μ turns out to be load-bearing for stability. This is the new, deadly problem.

---

## 💥 Divergence: the canonical small example (§11.2)

Two states with linear values $w$ and $2w$ (one shared weight!), a transition from the first to the second with reward 0, γ ≈ 1. The semi-gradient off-policy TD update on this transition:

- TD error: $\delta = 0 + \gamma \cdot 2w - w = (2\gamma - 1) w$.
- Update: $w \mathrel{+}= \alpha \rho \delta \cdot 1$. For γ > ½: **moving $w$ toward the target increases the target even more** (the target is $2\gamma w$ — it grows twice as fast as $w$!). Each "correction" makes the error bigger → 🚀 divergence.

On-policy training would *also* visit the second state and correct it back down (whatever follows it would hold it in check); off-policy training may update this transition repeatedly without ever experiencing the consequences from the second state (if π never takes the actions that b would need to follow up) — nothing restrains the runaway.

### Baird's Counterexample (the famous one)

Seven states, linear FA with more weights than needed, behavior policy mostly jumps to the "lower" state uniformly, target policy always takes the action leading to state 7. **Even with expected updates computed exactly (true DP!), the weights oscillate and diverge to ±∞.** Semi-gradient off-policy TD diverges; so does semi-gradient DP. 😱

> Moral: instability has nothing to do with sampling noise or step sizes — even *exact expected* updates diverge. The combination itself is unstable. (Even Q-learning, our trusty friend, has no general convergence guarantee in this regime — its closest guarantees require behavior sufficiently close to the target policy.)

---

## ☠️ The Deadly Triad (§11.3)

Instability arises **whenever all three** ingredients are combined:

1. **Function approximation** — generalizing representations (linear FA counts!);
2. **Bootstrapping** — targets that include current estimates (TD, DP);
3. **Off-policy training** — updating on a distribution other than the target policy's on-policy distribution.

**Any two are safe:**

| Combination | Stable? |
|---|---|
| FA + bootstrapping, **on-policy** (semi-gradient TD/Sarsa) | ✅ |
| FA + off-policy, **no bootstrapping** (gradient MC + IS) | ✅ |
| Bootstrapping + off-policy, **tabular** (Q-learning) | ✅ |
| **All three** | 💥 possible divergence |

Which to give up? All are precious:
- FA: non-negotiable for scale.
- Bootstrapping: huge gains in efficiency and online-ness (MC's variance and episode-waiting are costly).
- Off-policy: needed for learning *many* things at once (one behavior stream, many target policies — key to ambitious agents, options, GVFs of Ch. 17), for exploration-while-learning-optimal, and for learning from demonstrations/replay.

The rest of Chapter 11 hunts for ways to keep all three *safely* — the answer involves true gradients (Gradient-TD) or reweighting (Emphatic-TD), next notes.

---

## 🎯 Key Takeaways

1. Off-policy + FA has **two** problems: correcting targets (solved by IS etc.) and the **update distribution** (the hard one).
2. Tiny example: when a parameter's target grows faster than the parameter, every update worsens the error → divergence; off-policy data fails to apply the corrective updates that on-policy data would.
3. **Baird's counterexample**: even exact DP updates diverge off-policy with linear FA.
4. **Deadly triad** = FA + bootstrapping + off-policy. Any two are fine; all three risk instability — the central stability fact of modern RL (deep RL lives inside this danger zone and manages it with engineering: replay buffers, target networks, etc.).

---

➡️ **Next:** [11.2 — Linear Value-function Geometry & the Bellman Error](11-02-bellman-error-and-value-geometry.md) — to fix the problem, first understand precisely *what* off-policy TD is (and isn't) optimizing.
