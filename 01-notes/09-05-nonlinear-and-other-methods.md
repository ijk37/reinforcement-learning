# 9.5 — Nonlinear Approximation, LSTD, Memory-based Methods & Emphasis

> **Chapter 9: On-policy Prediction with Approximation** · Book sections: §9.7–§9.12
> Previous: [9.4 — Feature Construction](09-04-feature-construction.md) · Next: [10.1 — Episodic Semi-gradient Control](10-01-episodic-semi-gradient-control.md)

---

## 🧠 Artificial Neural Networks (§9.7)

ANNs do what fixed features can't: **learn the features themselves**.

- A network of layers; each unit computes a weighted sum then a **nonlinear activation** (sigmoid, ReLU…). Without nonlinearity, many layers collapse to one linear map — the nonlinearity is the point.
- A single hidden layer (wide enough) can approximate any continuous function — but **depth** is what gives hierarchical, abstract features and the spectacular successes of deep learning.
- Trained by **backpropagation** = chain-rule computation of gradients, plugged into our SGD/semi-gradient updates: TD with a neural $\hat v$ is exactly what **TD-Gammon** did in 1992 (Ch. 16), and **DQN** did for Atari (with γ-discounted Q-learning + deep convnets).
- Practical hazards & remedies: overfitting (→ regularization, dropout), vanishing gradients in deep nets (→ ReLU, batch norm, better init), instability with bootstrapping (→ target networks, replay — discussed with DQN in Ch. 16).

> 💡 For our purposes: an ANN is just a differentiable $\hat v(s,\mathbf{w})$ — all the semi-gradient machinery applies unchanged. The guarantees, however, weaken: convergence to local optima at best.

---

## 🧮 Least-Squares TD (§9.8)

Recall: linear TD(0) converges *iteratively* to $\mathbf{w}_{TD} = \mathbf{A}^{-1}\mathbf{b}$. **LSTD** says: why iterate? **Estimate A and b directly from data and solve.**

$$\widehat{\mathbf{A}}_t = \sum_{k} \mathbf{x}_k(\mathbf{x}_k - \gamma \mathbf{x}_{k+1})^\top + \epsilon \mathbf{I}, \qquad \widehat{\mathbf{b}}_t = \sum_k R_{k+1}\mathbf{x}_k, \qquad \mathbf{w}_t = \widehat{\mathbf{A}}_t^{-1}\, \widehat{\mathbf{b}}_t$$

| | Semi-gradient TD | LSTD |
|---|---|---|
| Compute per step | $O(d)$ | $O(d^2)$ (with incremental inverse / Sherman–Morrison) |
| Data efficiency | uses each sample once | **most data-efficient** linear TD |
| Step size | needed | none! (but ε in $\epsilon\mathbf{I}$ plays a similar role) |
| Forgets (for changing π)? | yes, naturally | **never forgets** — a problem in control |

Worth it when $d$ is small and data is precious; for large $d$ or GPI-style changing policies, plain TD's cheapness and forgetfulness win.

---

## 🗄️ Memory-based & Kernel-based methods (§9.9–§9.10)

**Nonparametric** alternatives: don't fit global parameters — **store training examples** and compute values on demand:

- **Nearest neighbor / weighted average / locally weighted regression:** value of a query state ≈ (distance-weighted) values of stored nearby examples. "Lazy learning."
- Pros: no global structure imposed; accuracy concentrates *exactly* where real trajectories go (the relevant-state focusing theme again!); adding experience is trivial.
- Challenge: fast nearest-neighbor search in big memories (k-d trees, hashing).
- **Kernel regression** is the umbrella view: a kernel function $k(s, s')$ says *how relevant* stored state $s'$ is to query $s$ — and the "kernel trick" lets simple kernels act like huge (even infinite) feature spaces. Tile coding and RBFs have kernel interpretations.

---

## 🔍 Interest and Emphasis (§9.11)

One last on-policy refinement: maybe we don't care about all states equally (e.g., early-episode states matter more, or only states near decisions matter). Introduce:

- **Interest** $I_t \geq 0$: how much we care about valuing state $S_t$ accurately (any basis, even causal hindsight).
- **Emphasis** $M_t$: scales the update; follows the recursion $M_t = I_t + \gamma^n M_{t-n}$ — bootstrapping *propagates* the interest of earlier states onto the states they bootstrap from.

Updates become $\mathbf{w} \mathrel{+}= \alpha\, M_t\, [\text{target} - \hat v]\nabla\hat v$. The book's Example 9.4 shows emphasis yielding *exactly correct* values where interest lies, where plain TD would compromise. (Emphasis returns in Ch. 11 as **Emphatic TD**, with stability significance.)

---

## 📋 Chapter 9 wrap-up

- Generalization via parameterized $\hat v(s,\mathbf{w})$; objective $\overline{VE}$ under the on-policy distribution μ.
- SGD for unbiased targets (MC); **semi-gradient** for bootstrapped targets (TD) — linear on-policy case provably fine (TD fixed point, $\frac{1}{1-\gamma}$ bound).
- Features: Fourier / coarse / **tile coding** / RBF; or learn them with **ANNs**; or skip parameters entirely (memory/kernels); or solve directly (LSTD).

---

## 🎯 Key Takeaways

1. ANNs = learned features + semi-gradient TD; the engine of deep RL, minus tabular-era guarantees.
2. LSTD: data-efficient, $O(d^2)$, no step size, never forgets.
3. Memory/kernel methods: local, lazy, trajectory-focused.
4. Interest & emphasis: weight updates by how much you care — sharper accuracy where it counts.

---

➡️ **Next chapter:** [10.1 — Episodic Semi-gradient Control](10-01-episodic-semi-gradient-control.md) — from predicting values to controlling: semi-gradient Sarsa and the Mountain Car.
