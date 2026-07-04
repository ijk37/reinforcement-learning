# 11.2 — Linear Value-function Geometry & the Bellman Error

> **Chapter 11: Off-policy Methods with Approximation** · Book sections: §11.4–§11.6
> Previous: [11.1 — The Deadly Triad](11-01-off-policy-challenges-and-deadly-triad.md) · Next: [11.3 — Gradient-TD & Emphatic-TD](11-03-gradient-td-and-emphatic-td.md)

---

## 🌱 The Big Picture

To build stable off-policy methods, we need to be precise about **what we're trying to optimize**. This note is the "map" of objectives — geometric picture included. It's abstract, but the picture pays off: it explains exactly where TD methods live and why naive fixes fail.

---

## 🗺️ The geometry (§11.4)

Think of **every value function as a point** in a high-dimensional space (one coordinate per state). With linear FA, the representable functions $\hat v(\cdot,\mathbf{w})$ form a flat **subspace** — usually *not* containing the true $v_\pi$.

Distances are measured with the μ-weighted norm: $\|v\|^2_\mu = \sum_s \mu(s) v(s)^2$ (errors in often-visited states matter more). The **projection** $\Pi v$ = the closest representable function to $v$.

```text
                v_π  ●  (true values — outside the subspace)
                    /|
                   / |  ← VE: distance from v_π
                  /  |
   ──────────────●───┴──────────────  representable subspace
               Πv_π (best possible fit)
```

Key players, for a candidate $v_\mathbf{w}$ in the subspace:

- **Value error** $\overline{VE}$: distance to $v_\pi$. Its minimizer is $\Pi v_\pi$ (what MC methods converge to).
- **Bellman error** $\overline{BE}$: apply the Bellman operator $B_\pi$ to $v_\mathbf{w}$; the result generally leaves the subspace; $\overline{BE} = \|B_\pi v_\mathbf{w} - v_\mathbf{w}\|^2_\mu$ measures how badly the Bellman equation is violated. (True $v_\pi$ is the unique function with zero Bellman error.)
- **Projected Bellman error** $\overline{PBE}$: project the Bellman result back into the subspace first; $\overline{PBE} = \|\Pi(B_\pi v_\mathbf{w} - v_\mathbf{w})\|^2_\mu$.

> **The punchline:** $\overline{PBE} = 0$ exactly at the **TD fixed point** $\mathbf{w}_{TD}$ — the place linear semi-gradient TD goes (on-policy). So TD methods are best understood as seeking *zero projected Bellman error*.

---

## 🧗 Why not just do gradient descent on the Bellman error? (§11.5)

A true-gradient method (a "residual" method) on some objective would be stable by construction. Candidate objectives:

- **TD error squared** $\overline{TDE}$: minimize $\mathbb{E}[\delta_t^2]$ ("naive residual gradient"). Converges! But to the **wrong place** — the book's A-split example shows it prefers values that are *worse* than the true ones even when exact values are representable. Penalizing all temporal surprise is just not the right goal. ❌
- **Bellman error** $\overline{BE}$: gradient descent on it (the *residual-gradient algorithm*) is the natural choice, and works in deterministic environments or with **two independent samples** of each transition (double sampling). But it converges slowly, often to wrong-looking solutions (A-presplit example), and —

## 🚫 The Bellman error is not learnable (§11.6)

A deep negative result: two MDPs can generate **exactly the same observable data distribution** yet have **different Bellman errors with different minimizers**. So $\overline{BE}$ **cannot be estimated from data alone** — no amount of experience determines it (you'd need access to the underlying states beyond features). "Learnable" here = determinable from experience; BE isn't.

By contrast, $\overline{PBE}$ and $\overline{TDE}$ **are** learnable (determinable from data) — and of these, **PBE has the right minimizer** (the TD fixed point).

> **Conclusion of the hunt:** the right objective for stable off-policy TD is the **projected Bellman error** — and the next note builds true-gradient methods for it.

---

## 🎯 Key Takeaways

1. Value functions are points; linear FA = a subspace; projection Π (μ-weighted) finds the best representable fit.
2. Objective zoo: $\overline{VE}$ (MC's target), $\overline{BE}$ (Bellman violation), $\overline{PBE}$ (projected violation, = 0 at TD fixed point), $\overline{TDE}$ (wrong minimizer).
3. Naive squared-TD-error descent converges to poor solutions; $\overline{BE}$ descent needs double sampling, behaves oddly — and $\overline{BE}$ is **fundamentally unlearnable** from data.
4. $\overline{PBE}$ is learnable and has the right solution → target it. (Next: Gradient-TD does exactly this.)

---

➡️ **Next:** [11.3 — Gradient-TD and Emphatic-TD Methods](11-03-gradient-td-and-emphatic-td.md) — the two principled escapes from the deadly triad.
