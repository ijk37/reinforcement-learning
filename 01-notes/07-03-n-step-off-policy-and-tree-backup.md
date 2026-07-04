# 7.3 — n-step Off-policy Learning & the Tree Backup Algorithm

> **Chapter 7: n-step Bootstrapping** · Book sections: §7.3–§7.7
> Previous: [7.2 — n-step Sarsa](07-02-n-step-sarsa.md) · Next: [8.1 — Models and Planning](08-01-models-and-planning.md)

---

## 🌱 The Big Picture

Multi-step + off-policy = powerful but tricky. When learning about target policy π from behavior policy b over **n steps**, the mismatch between policies must be corrected for **every step** in the window. Two routes:

1. **Importance sampling** — simple, general, but high variance.
2. **Tree backup** — no importance sampling at all! 🎁

---

## ⚖️ Route 1: n-step methods with importance sampling (§7.3)

Weight the n-step return by the importance ratio over the actions in the window:

$$\rho_{t:h} \doteq \prod_{k=t}^{\min(h, T-1)} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$

n-step off-policy update for state values:

$$V_{t+n}(S_t) \leftarrow V_{t+n-1}(S_t) + \alpha\, \rho_{t:t+n-1} \big[G_{t:t+n} - V_{t+n-1}(S_t)\big]$$

For action values (off-policy n-step Sarsa), the first action needs no correction (we're *evaluating* it, not weighting its selection), so the ratio starts one step later: $\rho_{t+1:t+n}$.

**Pain point 😖:** products of ratios have high variance — one unlikely action under b can blow up the weight by 10×; one π-impossible action zeroes the whole return. The starred §7.4 reduces variance with **control variates** (per-decision formulations); the deeper fix is structural →

---

## 🌳 Route 2: The n-step Tree Backup Algorithm (§7.5)

**Question:** can we do multi-step **off-policy learning with NO importance sampling?** Yes — Q-learning and Expected Sarsa do it for one step; **tree backup** is their multi-step generalization.

### The idea, in pictures

Down the trajectory's spine ($S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1}, \dots$), at every state we *also* consider all the actions **not taken** — they "dangle" off the spine like leaves of a tree:

```text
S_t ──A_t──► S_{t+1} ──A_{t+1}──► S_{t+2} ──···
              ├─ a′ (not taken): bootstrap  π(a′|S)·Q(S,a′)
              └─ a″ (not taken): bootstrap  π(a″|S)·Q(S,a″)
```

The update target blends, at every level:
- **leaf actions (not taken):** contribute their current *estimates* $Q(S, a)$, weighted by π's probability of taking them;
- **the spine action (actually taken):** contributes its probability-weighted *actual* continuation — recursively.

Formally (the recursive definition):

$$G_{t:t+n} \doteq R_{t+1} + \gamma \sum_{a \neq A_{t+1}} \pi(a|S_{t+1})\,Q(S_{t+1},a) \;+\; \gamma\, \pi(A_{t+1}|S_{t+1})\, G_{t+1:t+n}$$

with the base case $G_{T-1:t+n} = R_T$ at termination (and the one-step case being exactly Expected Sarsa's target).

**Why no importance ratios?** Each action's contribution is *already* weighted by π's probability of choosing it — we never pretend the sampled action was drawn from π; we *average over* π directly, using estimates for the branches we didn't experience. The actually-taken action just gets its π-weight attached to the deeper, more "real" part of the target.

The update is the usual one: $Q(S_t,A_t) \mathrel{+}= \alpha [G_{t:t+n} - Q(S_t,A_t)]$.

> 💡 **Trade-off:** if π is nearly deterministic and b explores a lot, the spine weights $\pi(A_{t+1}|S_{t+1})$ often shrink toward 0 — the effective lookahead becomes short. No free lunch: tree backup swaps variance (IS) for shortened horizons.

---

## 🧩 Unification: n-step Q(σ) (§7.6, starred)

At each step, choose: **sample** (Sarsa-style, σ=1) or **expect** (tree-backup-style, σ=0)? The parameter $\sigma_t \in [0,1]$ interpolates per-step, unifying n-step Sarsa, Expected Sarsa, and tree backup into one family of algorithms.

---

## 📋 Chapter 7 Summary

1. n-step methods occupy the space **between one-step TD and MC**; intermediate n typically wins.
2. Off-policy correction over n steps: either **importance sampling** (general, high variance) or **tree backup** (no IS, but horizon shrinks for near-deterministic targets).
3. All conform to the same pattern: construct a target return, update toward it, lag n steps behind.
4. Costs: more memory and computation per step than one-step methods, and updates are delayed — the price of better credit assignment. Eligibility traces (Ch. 12) will offer a more elegant, incremental way to get multi-step effects.

---

➡️ **Next chapter:** [8.1 — Models and Planning](08-01-models-and-planning.md) — what if the agent learned its *own model* of the world and planned with it?
