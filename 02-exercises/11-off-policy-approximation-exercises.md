# Chapter 11 — Off-policy Methods with Approximation · Exercises

> Practice for notes [11.1](../01-notes/11-01-off-policy-challenges-and-deadly-triad.md)–[11.3](../01-notes/11-03-gradient-td-and-emphatic-td.md). (Advanced/starred chapter.)

---

## 🧠 Conceptual

### 11.1 — The deadly triad
Name the three ingredients of the deadly triad. Why is *any two* of them safe but *all three* dangerous? Which one would you give up most reluctantly and why?

💡 **Hint:** Function approximation, bootstrapping, off-policy training.

<details>
<summary>✅ Full Answer</summary>

The three: **(1) function approximation, (2) bootstrapping, (3) off-policy training.**

- **Any two are safe:** on-policy + FA + bootstrapping (semi-gradient TD) converges; off-policy + FA without bootstrapping (gradient MC) converges; off-policy + bootstrapping but tabular (Q-learning) converges.
- **All three together** can cause the value estimates to **diverge to infinity** — even with exact expected updates (Baird's counterexample), so it's not a sampling-noise issue.

All three are precious: FA is needed for scale; bootstrapping for efficiency/online learning; off-policy for learning many things at once / learning optimal while exploring / replay & demonstrations. There's no obvious one to drop — which is exactly why this is a central open problem (deep RL *manages* it with engineering rather than solving it).
</details>

---

### 11.2 — Why off-policy + FA can diverge
Using the two-state $w \to 2w$ example, explain intuitively why a semi-gradient off-policy update can blow up.

💡 **Hint:** The target grows faster than the estimate it's chasing.

<details>
<summary>✅ Full Answer</summary>

Consider a transition from a state valued $w$ to a state valued $2w$ (shared weight), reward 0, γ near 1. The TD error is $\delta = 0 + \gamma(2w) - w = (2\gamma - 1)w$. For γ > ½, moving $w$ toward the target *increases the target ($2\gamma w$) even more* — each "correction" makes the gap **bigger**, so $w$ runs away to ∞.

**Why off-policy matters:** under **on-policy** training the agent would also visit the second state and the corrective updates there would hold the values in check. Off-policy training may repeatedly update this transition **without** experiencing the downstream consequences (if the target policy's continuation is never sampled), so nothing restrains the divergence.
</details>

---

### 11.3 — Why not gradient-descend the Bellman error?
The book shows the Bellman error $\overline{BE}$ is "not learnable." What does that mean, and which objective do we target instead?

💡 **Hint:** Two MDPs, identical data, different BE.

<details>
<summary>✅ Full Answer</summary>

"**Not learnable**" means $\overline{BE}$ **cannot be determined from the observable data distribution alone**: two different MDPs can produce *exactly* the same stream of feature/reward observations yet have different Bellman errors with different minimizers. So no amount of experience pins it down — you'd need access to underlying states beyond the features.

Instead we target the **projected Bellman error $\overline{PBE}$**, which *is* learnable and whose minimizer is the **TD fixed point** (the right solution). Gradient-TD methods do true SGD on $\overline{PBE}$. (The naive squared-TD-error objective $\overline{TDE}$ is learnable but has the *wrong* minimizer.)
</details>

---

### 11.4 — Gradient-TD vs. Emphatic-TD
Both fix off-policy divergence with linear FA. Contrast their core ideas and their practical drawbacks.

💡 **Hint:** True gradient on PBE (extra vector) vs. reweighting updates (emphasis).

<details>
<summary>✅ Full Answer</summary>

- **Gradient-TD (GTD2/TDC):** performs **true stochastic gradient descent** on $\overline{PBE}$, using a **second learned weight vector** v (on a faster timescale) to estimate part of the gradient. Provably convergent off-policy. **Drawback:** ~2× the machinery (extra vector + step size), and slower than plain TD.
- **Emphatic-TD:** **reweights** the updates (via "interest" and "emphasis") so the effective update distribution behaves like a stabilizing on-policy one. Minimal change to the TD update, convergent **in expectation**. **Drawback:** the emphasis involves products of importance ratios → potentially **very high variance**, so sample-path behavior can be erratic.

Both illustrate the tension: **stability vs. efficiency/variance**, still not fully resolved.
</details>

---

## 🔢 Math / Worked

### 11.5 — TDC update equations
Write the two coupled updates of TDC (linear, with importance ratio ρ, features $\mathbf{x}, \mathbf{x}'$, TD error δ). Identify the "semi-gradient TD part" and the "correction part."

💡 **Hint:** Helper vector v; main update = δx term minus a correction term.

<details>
<summary>✅ Full Answer</summary>

$$\mathbf{v} \leftarrow \mathbf{v} + \beta\,\rho\,(\delta - \mathbf{v}^\top\mathbf{x})\,\mathbf{x}$$
$$\mathbf{w} \leftarrow \mathbf{w} + \alpha\,\rho\big(\underbrace{\delta\,\mathbf{x}}_{\text{semi-gradient TD part}} - \underbrace{\gamma\,\mathbf{x}'(\mathbf{x}^\top\mathbf{v})}_{\text{gradient correction}}\big)$$

- The **$\delta\mathbf{x}$** term is exactly the ordinary semi-gradient TD update.
- The **$-\gamma\mathbf{x}'(\mathbf{x}^\top\mathbf{v})$** term is the correction that turns it into true gradient descent on $\overline{PBE}$, where v approximates $\mathbb{E}[\mathbf{x}\mathbf{x}^\top]^{-1}\mathbb{E}[\rho\delta\mathbf{x}]$. The two-timescale condition (β larger/faster than α) makes v track its target so the w-update is approximately the true PBE gradient. Hence "TD with gradient Correction."
</details>

---

## 💻 Code

### 11.6 — Demonstrate divergence, then stability
Describe a minimal experiment showing semi-gradient off-policy TD diverging on Baird-style dynamics, and what TDC would show instead. What do you plot?

💡 **Hint:** Plot the weight norm (or components) over updates.

<details>
<summary>✅ Full Answer</summary>

```text
Set up Baird's 7-state counterexample:
  - linear features with more weights than needed (the over-parameterized layout)
  - behavior policy b: mostly transition to the lower state
  - target policy π: always take the action to state 7
  - reward 0, γ ≈ 0.99

Run two learners on the SAME transitions (even use expected updates to remove noise):
  (A) semi-gradient off-policy TD:  w += α ρ δ x
  (B) TDC: the two coupled updates from 11.5

Plot: each weight component (or ||w||) vs. update number.
```

**Expected:** learner (A)'s weights **grow without bound** (oscillating/diverging to ±∞), even with exact expected updates — demonstrating the deadly triad. Learner (B) (TDC) keeps the weights **bounded and converging** toward the PBE solution. This is the canonical empirical illustration that the instability is intrinsic to the FA+bootstrap+off-policy combination, not to sampling noise — and that true-gradient methods cure it.
</details>

---

➡️ Next: [Chapter 12 — Eligibility Traces exercises](12-eligibility-traces-exercises.md)
