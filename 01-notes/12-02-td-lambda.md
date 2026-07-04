# 12.2 — TD(λ): The Backward View and Eligibility Traces

> **Chapter 12: Eligibility Traces** · Book sections: §12.2–§12.3
> Previous: [12.1 — The λ-return](12-01-lambda-return.md) · Next: [12.3 — Online λ-return & True Online TD(λ)](12-03-true-online-td-lambda.md)

---

## 🌱 The Big Picture

**TD(λ)** is one of the most elegant algorithms in RL. It approximates the forward-view λ-return algorithm using:

- **one extra vector** (the eligibility trace $\mathbf{z}$),
- **one scalar TD error** per step,
- updates that flow **backward** to recently visited states — online, every step, same cost as TD(0)-with-a-trace.

> Computational beauty: the forward view needs the *future*; TD(λ) needs only the *present TD error* plus a fading memory of the *past*. Same math, reversed bookkeeping.

---

## 🧮 The algorithm

The **eligibility trace** $\mathbf{z}_t \in \mathbb{R}^d$ (same shape as $\mathbf{w}$) accumulates and fades:

$$\mathbf{z}_{-1} = \mathbf{0}, \qquad \mathbf{z}_t = \gamma\lambda\, \mathbf{z}_{t-1} + \nabla \hat v(S_t, \mathbf{w}_t)$$

*"Every step: decay the whole trace by γλ, then bump up the components corresponding to the state just visited."* The trace records **which weights recently contributed** to valuations — which are *eligible* for credit or blame.

Then the TD error

$$\delta_t = R_{t+1} + \gamma \hat v(S_{t+1},\mathbf{w}_t) - \hat v(S_t, \mathbf{w}_t)$$

updates **all eligible weights at once**:

$$\boxed{\;\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\, \delta_t\, \mathbf{z}_t\;}$$

```text
Semi-gradient TD(λ):
z = 0
for each step:
    take action (per π), observe R, S′
    z ← γλ z + ∇v̂(S,w)
    δ = R + γ v̂(S′,w) − v̂(S,w)
    w ← w + α δ z
    S ← S′
```

### Intuition: the bell and the echo 🔔

When a TD error occurs ("surprise! this turned out better/worse than expected"), it shouldn't only update the *current* state — earlier states **led here** and deserve a share of the credit/blame, with more recent states deserving more. The trace is exactly that recency-weighted attribution, decaying by γλ per step. (In the tabular case the trace value of a state is large if visited recently/often — credit assignment by *recency* and *frequency*.)

- **λ = 0:** trace = just the current gradient → exactly **TD(0)**.
- **λ = 1, γ = 1:** nothing decays → the sum of updates over an episode equals a Monte Carlo update — "TD(1) is MC", but implementable **online and incrementally** (and on continuing tasks!).

---

## 🔬 Forward ⟷ backward equivalence

For **offline** updating (accumulate increments, apply at episode end), TD(λ)'s total update **exactly equals** the λ-return algorithm's. Online (updating each step), the equivalence is approximate — close for small α, and *fixed entirely* by True Online TD(λ) (next note).

On the 19-state random walk, TD(λ) performs almost identically to the offline λ-return algorithm — slightly worse at high α/λ extremes.

### Convergence ✅
Linear TD(λ) converges on-policy, with an error bound that interpolates beautifully:

$$\overline{VE} \leq \frac{1 - \gamma\lambda}{1 - \gamma} \min_\mathbf{w} \overline{VE}(\mathbf{w})$$

λ → 1 makes the bound approach 1 (MC's asymptotic optimality); λ = 0 gives the familiar $\frac{1}{1-\gamma}$ TD bound. (In practice λ = 1 is rarely best — variance!)

---

## 🎯 Key Takeaways

1. Eligibility trace: $\mathbf{z} \leftarrow \gamma\lambda\mathbf{z} + \nabla\hat v$ — a fading memory of which weights deserve credit.
2. TD(λ) update: $\mathbf{w} \mathrel{+}= \alpha\,\delta_t\,\mathbf{z}_t$ — one error broadcast to all recently active weights.
3. Backward view ≈ forward view (exact when offline); λ=0 → TD(0); λ=1 → online MC.
4. Costs one extra vector; works on continuing tasks; fully online. The classic "single most elegant trick in RL."

---

➡️ **Next:** [12.3 — Online λ-return & True Online TD(λ)](12-03-true-online-td-lambda.md) — fixing the small online discrepancy, with dutch traces.
