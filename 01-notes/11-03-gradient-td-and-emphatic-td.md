# 11.3 — Gradient-TD & Emphatic-TD Methods

> **Chapter 11: Off-policy Methods with Approximation** · Book sections: §11.7–§11.10
> Previous: [11.2 — Value-function Geometry](11-02-bellman-error-and-value-geometry.md) · Next: [12.1 — The λ-return](12-01-lambda-return.md)

---

## 🌱 The Big Picture

Two principled families achieve **stable off-policy learning with function approximation** — defeating the deadly triad (for linear FA):

1. **Gradient-TD:** do *true* stochastic gradient descent on the **projected Bellman error** ($\overline{PBE}$).
2. **Emphatic-TD:** *reweight* the updates so the off-policy distribution behaves like an on-policy one — restoring the stability that on-policy distributions guarantee.

---

## 📐 Gradient-TD methods (§11.7): GTD2 and TDC

Doing SGD on $\overline{PBE} = \mathbb{E}[\rho\delta\mathbf{x}]^\top \mathbb{E}[\mathbf{x}\mathbf{x}^\top]^{-1}\mathbb{E}[\rho\delta\mathbf{x}]$ looks impossible online — the gradient involves a *product of expectations* (sampling it naively gives biased estimates — you'd need independent samples) plus a matrix inverse.

**The trick:** learn a **second weight vector** $\mathbf{v} \approx \mathbb{E}[\mathbf{x}\mathbf{x}^\top]^{-1}\mathbb{E}[\rho\delta\mathbf{x}]$ — a least-squares estimate of part of the gradient — on a slightly faster timescale, and use it in the main update. Two coupled cheap updates, $O(d)$ each:

$$\mathbf{v} \leftarrow \mathbf{v} + \beta\,\rho\,(\delta - \mathbf{v}^\top\mathbf{x})\,\mathbf{x}$$

$$\textbf{GTD2:}\quad \mathbf{w} \leftarrow \mathbf{w} + \alpha\,\rho\,(\mathbf{x} - \gamma\mathbf{x}')(\mathbf{x}^\top\mathbf{v})$$

$$\textbf{TDC (a.k.a. GTD(0)):}\quad \mathbf{w} \leftarrow \mathbf{w} + \alpha\,\rho\big(\delta\,\mathbf{x} - \gamma\,\mathbf{x}'(\mathbf{x}^\top\mathbf{v})\big)$$

(TDC = "TD with gradient Correction": the familiar semi-gradient TD term **plus a correction term**.)

- ✅ **Provably convergent** on Baird's counterexample and in general (linear FA, off-policy), under two-timescale step-size conditions.
- ❌ Slower than plain TD; a second parameter vector and step size to manage. (This is a genuine cost — research continues on hybrids that act like TD on-policy and like gradient methods off-policy.)

---

## ⚖️ Emphatic-TD methods (§11.8)

Different philosophy: the on-policy distribution is special because (with linear semi-gradient updates) it guarantees stability. Off-policy data breaks that distribution — so **reweight states** (using "interest" and "emphasis," from §9.11) such that the *effective* update distribution is stabilizing again:

$$M_t = \lambda... \text{(simplest one-step form below)}$$

One-step Emphatic-TD:

```text
δ = R' + γ v̂(S′,w) − v̂(S,w)
M = γ ρ_{t−1} M_{prev} + I_t        ← emphasis: interest now + discounted, IS-corrected emphasis flowing from predecessors
w += α M ρ δ ∇v̂(S,w)
```

Followership matters: states that target-policy trajectories *would* reach from interesting states get **boosted emphasis** — recreating, in expectation, an on-policy-like weighting.

- ✅ Stable & convergent **in expectation** on Baird's counterexample (theoretically converges to the ideal interest-weighted solution).
- ❌ The emphasis $M_t$ involves products of importance ratios → potentially **enormous variance**; the practical sample-path behavior can be wild. Elegant theory, hard practice.

---

## 📉 Reducing variance (§11.9)

Off-policy methods are intrinsically higher-variance than on-policy ones (you're learning about something you're not doing — data is only partially relevant). Standard tools:

- **Weighted importance sampling** (Ch. 5's lesson) — adapting it to FA is nontrivial but approximations exist.
- **Tree backup / no-IS methods** (Ch. 7) extended with FA.
- **Per-decision** IS and control variates (Ch. 7, 12).
- Capping/clipping ratios; keeping behavior close to target policies.

---

## 📋 Chapter 11 wrap-up

| Approach | Idea | Pro | Con |
|---|---|---|---|
| Semi-gradient TD + IS | just correct the targets | simple, fast | **can diverge** (deadly triad) |
| Gradient-TD (GTD2/TDC) | true SGD on $\overline{PBE}$, helper vector v | provable convergence, O(d) | ~2× machinery, slower |
| Emphatic-TD | reweight updates to restore stability | elegant, minimal change | high variance in practice |

Off-policy + FA remains a frontier: the tension between **efficiency (TD-like)** and **stability (gradient/emphasis)** isn't fully resolved — which is also why deep RL often just runs semi-gradient Q-learning *carefully* (replay, target networks, near-on-policy data) and gets away with it.

---

## 🎯 Key Takeaways

1. **GTD2/TDC**: a second learned vector turns PBE descent into two O(d) online updates — provably stable off-policy linear TD.
2. **Emphatic-TD**: emphasis-weighted updates restore an on-policy-like distribution — stable in expectation, high variance in samples.
3. Variance is the other half of the battle: weighted IS, tree backup, control variates, ratio capping.
4. Practical deep RL mostly *manages* the deadly triad rather than solving it. Know where the cliff is. 🧗

---

➡️ **Next chapter:** [12.1 — The λ-return](12-01-lambda-return.md) — eligibility traces: the elegant machinery that unifies TD and MC, one decaying trace at a time.
