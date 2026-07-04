# 12.3 — Online λ-return Methods & True Online TD(λ)

> **Chapter 12: Eligibility Traces** · Book sections: §12.4–§12.6 (with §12.3 background)
> Previous: [12.2 — TD(λ)](12-02-td-lambda.md) · Next: [12.4 — Sarsa(λ) & Off-policy Traces](12-04-sarsa-lambda-and-off-policy-traces.md)

---

## 🌱 The Big Picture

TD(λ) only *approximately* matches the λ-return algorithm when updating online. Can we get an **exact** online equivalence? Yes — via a conceptual (expensive) algorithm, the *online λ-return algorithm*, and then a stunning O(d) implementation of it: **True Online TD(λ)**.

---

## ✂️ Truncated λ-returns (§12.3)

The λ-return formally needs the infinite future. But since the weights decay by λ per step, returns beyond some horizon $h$ contribute almost nothing. Define the **truncated λ-return** $G_{t:h}^\lambda$: same geometric blend, but stop at horizon $h$, giving the residual weight to $G_{t:h}$. This yields practical **truncated TD(λ) ("TTD")** algorithms — n-step-like methods with blended targets.

## 🔁 The online λ-return algorithm (§12.4): redoing updates

Clever (if extravagant) idea: at every step, as the horizon of available data grows by one, **redo all updates from the start of the episode** using truncated λ-returns up to the new horizon. Each time step produces a whole new weight sequence; the final weight of each pass is the one used for action/valuation.

- ✅ Fully online; at episode's end its result equals the offline λ-return algorithm's; **performs best of all** (using the latest weights in every target helps!).
- ❌ Computation: each step replays the whole past — $O(T)$ per step, $O(T^2)$ per episode. Conceptual ideal, not a practical tool.

## ✨ True Online TD(λ) (§12.5)

The miracle: for **linear** FA, the online λ-return algorithm's final weight vector each step can be computed **exactly** with O(d) work, using a slightly modified trace — the **dutch trace**:

$$\mathbf{z}_t = \gamma\lambda\,\mathbf{z}_{t-1} + \big(1 - \alpha\gamma\lambda\,\mathbf{z}_{t-1}^\top \mathbf{x}_t\big)\,\mathbf{x}_t$$

and the update (with $V \doteq \mathbf{w}^\top\mathbf{x}$ shorthand):

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\,\delta_t\,\mathbf{z}_t + \alpha\big(V_t - \mathbf{w}_t^\top\mathbf{x}_t\big)\big(\mathbf{z}_t - \mathbf{x}_t\big)$$

(The extra term corrects for the difference between the current weights and the ones that "should" have been used — making the online sequence *exactly* match the ideal.)

- **Trace zoo 🦓:** *accumulating* traces ($\mathbf{z} \mathrel{+}= \mathbf{x}$, classic TD(λ)); *dutch* traces (above — exact online equivalence); *replacing* traces (binary features reset to 1 — an old hack, now superseded by dutch traces).
- Performance: matches/beats TD(λ) across α–λ space on random walks; same asymptotic cost (~2× memory ops).

## 🎁 Bonus insight (§12.6): traces aren't only about TD!

The book derives a **dutch-trace version of Monte Carlo**: a purely non-bootstrapping MC algorithm implemented online with traces, mathematically equivalent to the offline MC linear update but cheaper and incremental. Moral:

> **Eligibility traces are fundamentally about efficient, online credit assignment** — not about bootstrapping per se. Even MC benefits.

---

## 🎯 Key Takeaways

1. Truncated λ-returns make the forward view computable; the **online λ-return algorithm** (redo-all-updates) is the gold-standard target.
2. **True Online TD(λ)** computes that gold standard *exactly* in O(d) per step (linear FA), via **dutch traces**.
3. Trace flavors: accumulating (classic), dutch (exact, preferred), replacing (legacy).
4. Traces = online credit assignment machinery, useful even without bootstrapping.

---

➡️ **Next:** [12.4 — Sarsa(λ), Watkins's Q(λ) & Stable Off-policy Traces](12-04-sarsa-lambda-and-off-policy-traces.md) — traces meet control and off-policy learning; chapter wrap-up.
