# 12.1 — The λ-return

> **Chapter 12: Eligibility Traces** · Book section: §12.1
> Previous: [11.3 — Gradient-TD & Emphatic-TD](11-03-gradient-td-and-emphatic-td.md) · Next: [12.2 — TD(λ)](12-02-td-lambda.md)

---

## 🌱 The Big Picture

Chapter 7 placed methods on a spectrum by choosing **one** n for n-step returns. Why choose? **Average them all!** Any weighted average of n-step returns (weights summing to 1) is also a valid update target — a **compound update**. The λ-return is the most famous one: a geometric blend of *every* n-step return. It's the "forward view" that eligibility traces will implement efficiently.

---

## 🧮 Definition

Average all n-step returns with geometrically decaying weights $(1-\lambda)\lambda^{n-1}$:

$$G_t^\lambda \doteq (1 - \lambda) \sum_{n=1}^{\infty} \lambda^{n-1}\, G_{t:t+n}$$

For an episodic task ending at $T$, all the n-step returns with $t + n \geq T$ equal the full return $G_t$, so:

$$G_t^\lambda = (1-\lambda)\sum_{n=1}^{T-t-1} \lambda^{n-1} G_{t:t+n} \;+\; \lambda^{T-t-1}\, G_t$$

### Reading the weights 📊

```text
weight
  │ (1−λ)        ← 1-step return gets the most weight
  │   (1−λ)λ
  │     (1−λ)λ²
  │        ...                        λ^{T−t−1} → the full MC return
  └──────────────────────────────────────────────► n
```

- **λ = 0:** only the 1-step return survives → $G_t^0 = G_{t:t+1}$ = **the TD(0) target**. (That's why it's called TD(0)!)
- **λ = 1:** all weight onto the full return → $G_t^1 = G_t$ = **the Monte Carlo target**.
- **0 < λ < 1:** a smooth blend — short-horizon returns dominate, but longer ones keep contributing. Each successive n-step return is weighted $\lambda$ times the previous.

> λ ("lambda") is thus a *continuous* dial between TD and MC — like n, but blending instead of choosing. A useful intuition: the λ-return "bootstraps a little at every horizon," with **time constant** ~$1/(1-\lambda)$ steps of real reward before bootstrapping takes over.

---

## 🔭 The offline λ-return algorithm (forward view)

Use $G_t^\lambda$ as the target in the usual semi-gradient update, applied **offline** (at episode end):

$$\mathbf{w} \leftarrow \mathbf{w} + \alpha\big[G_t^\lambda - \hat v(S_t,\mathbf{w})\big]\nabla \hat v(S_t, \mathbf{w}), \qquad t = 0,\dots,T-1$$

On the 19-state random walk, its α–λ performance surface looks almost identical to n-step methods' α–n surface, with **intermediate λ best** — comparable quality, smoother dial.

### Why "forward view"? 👀

For each state visited, we look **forward in time** at the rewards and states that *will* come, and blend them into the target:

> Imagine riding the trajectory and, at each state, peering ahead toward the future to decide its update — then moving on and never revisiting. Conceptually clean, but seemingly **uncomputable online** (the future hasn't happened yet!) and acausal.

The miracle of Chapter 12: an exactly (or almost exactly) equivalent **backward view** exists that is fully online and incremental, using a short-term memory called the **eligibility trace**. That's the next note.

---

## 🎯 Key Takeaways

1. Any normalized average of n-step returns is a valid target; the **λ-return** averages all of them with weights $(1-\lambda)\lambda^{n-1}$.
2. λ = 0 → TD(0); λ = 1 → Monte Carlo; in between → the best of both (empirically intermediate λ wins).
3. The λ-return defines the **forward view** — theoretically ideal, not directly implementable online.
4. Eligibility traces (next) implement the same thing **backwards**, cheaply, online.

---

➡️ **Next:** [12.2 — TD(λ)](12-02-td-lambda.md) — the backward view: one trace vector, one TD error, updates to all recently-visited states at once.
