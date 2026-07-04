# 9.3 — Linear Methods & the TD Fixed Point

> **Chapter 9: On-policy Prediction with Approximation** · Book section: §9.4
> Previous: [9.2 — Gradient & Semi-gradient Methods](09-02-gradient-and-semi-gradient-methods.md) · Next: [9.4 — Feature Construction](09-04-feature-construction.md)

---

## 🌱 The Big Picture

**Linear function approximation** is the special case that matters most — the one with the strongest theory, cheapest computation, and (with good features) excellent practical performance:

$$\hat v(s, \mathbf{w}) \doteq \mathbf{w}^\top \mathbf{x}(s) = \sum_{i=1}^{d} w_i\, x_i(s)$$

- $\mathbf{x}(s) = (x_1(s), \dots, x_d(s))^\top$ is the **feature vector** of state $s$ — a fixed mapping you design (next note is all about *how*).
- Each feature is a *basis function*; the value estimate is a weighted sum of features.
- Gorgeous property: $\nabla \hat v(s, \mathbf{w}) = \mathbf{x}(s)$ — the gradient is just the features! SGD becomes:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\,\big[U_t - \hat v(S_t,\mathbf{w}_t)\big]\,\mathbf{x}(S_t)$$

*"Bump each weight in proportion to its feature's activity and the error."* (Tabular = the special case of one-hot features, one per state!)

---

## 📐 Convergence results for linear methods

- **Gradient MC:** converges to the **global** optimum of $\overline{VE}$ (linear ⇒ the objective is convex — only one optimum). ✅
- **Semi-gradient TD(0):** converges (under usual conditions) — but to a *different* point: the **TD fixed point** $\mathbf{w}_{TD}$.

### The TD fixed point and its quality bound

At the fixed point, the expected TD update is zero. The book derives it explicitly ($\mathbf{w}_{TD} = \mathbf{A}^{-1}\mathbf{b}$ where $\mathbf{A} = \mathbb{E}[\mathbf{x}_t(\mathbf{x}_t - \gamma\mathbf{x}_{t+1})^\top]$, $\mathbf{b} = \mathbb{E}[R_{t+1}\mathbf{x}_t]$). What matters for intuition is the **guarantee**:

$$\overline{VE}(\mathbf{w}_{TD}) \;\leq\; \frac{1}{1-\gamma}\, \min_{\mathbf{w}} \overline{VE}(\mathbf{w})$$

> TD's asymptotic error is at most $\frac{1}{1-\gamma}$ times the best possible error. With γ close to 1 this *expansion factor* is large — TD can settle substantially short of the MC solution.

**So why use TD?** Because the bound is loose in practice, and TD buys **drastically lower variance and faster learning**. The classic trade: MC = better asymptote, TD = better journey. (n-step methods interpolate, as always.)

⚠️ **Critical fine print:** this convergence is for **on-policy** training. Update on a different state distribution than μ (off-policy), and even linear semi-gradient TD can **diverge**. (Chapter 11 stages the autopsy.)

### Semi-gradient n-step TD

The natural extension — n-step return as target, same linear update — converges similarly; on the 19-state random walk, **intermediate n again performs best**, mirroring the tabular result.

---

## 🧮 What "linear" does NOT mean

Linear in the **weights**, not in the state! Features can be arbitrary nonlinear functions of the state. With Fourier features or tile coding (next note), $\hat v$ can be a wildly nonlinear function of position, velocity, etc. The *learning* stays simple; the *representation* carries the nonlinearity. This division of labor — handcrafted nonlinearity + linear learning — was RL's workhorse for decades (and remains great for many problems).

---

## 🎯 Key Takeaways

1. Linear FA: $\hat v = \mathbf{w}^\top\mathbf{x}(s)$; gradient = feature vector; updates are trivially cheap.
2. Gradient MC → global optimum. Semi-gradient TD(0) → **TD fixed point**, with error ≤ $\frac{1}{1-\gamma}\times$ optimal.
3. The convergence story holds **on-policy**; off-policy + bootstrapping + FA = trouble (Ch. 11).
4. "Linear" constrains weights, not features — all the representational power lives in $\mathbf{x}(s)$.

---

➡️ **Next:** [9.4 — Feature Construction](09-04-feature-construction.md) — polynomials, Fourier basis, coarse coding, tile coding, RBFs: the art of building $\mathbf{x}(s)$.
