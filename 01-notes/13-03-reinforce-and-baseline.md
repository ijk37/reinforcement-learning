# 13.3 — REINFORCE: Monte Carlo Policy Gradient (with Baseline)

> **Chapter 13: Policy Gradient Methods** · Book sections: §13.3–§13.4
> Previous: [13.2 — The Policy Gradient Theorem](13-02-policy-gradient-theorem.md) · Next: [13.4 — Actor–Critic & Continuous Actions](13-04-actor-critic-and-continuous-actions.md)

---

## 🚀 REINFORCE (§13.3)

Take the sampled form of the policy gradient theorem and do stochastic gradient ascent:

$$\boxed{\;\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t + \alpha\, \gamma^t\, G_t\, \nabla \ln \pi(A_t | S_t, \boldsymbol{\theta})\;}$$

($G_t$ = the full Monte Carlo return from time $t$; the $\gamma^t$ factor appears for discounted episodic problems.)

### Read it like a sentence 🗣️

> "Make the action I actually took **more probable**, in proportion to **how good the total outcome was** ($G_t$), and inversely to **how probable the action already was** (the division hidden in ∇ln π)."

- $G_t$ large & positive → push hard toward this action. Negative → push away.
- Dividing by $\pi(A_t|S_t)$ prevents a subtle failure: frequently-chosen actions would otherwise win just by being updated often, even if mediocre.

```text
REINFORCE:
loop forever (per episode):
    generate episode S0,A0,R1,...,S_{T−1},A_{T−1},R_T following π(·|·,θ)
    for t = 0..T−1:
        G = return from step t
        θ += α γ^t G ∇ln π(A_t|S_t,θ)
```

**Properties:** unbiased gradient estimate → good theoretical convergence (to a local optimum, with decreasing α). But it's **Monte Carlo**: full-episode returns → **high variance, slow learning**, episodic only.

---

## ⚓ REINFORCE with Baseline (§13.4)

Variance rescue, exactly like the bandit baseline of Chapter 2. Subtract from $G_t$ any **baseline** $b(s)$ that doesn't depend on the action:

$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t + \alpha\, \gamma^t \big(G_t - b(S_t)\big)\, \nabla \ln \pi(A_t|S_t,\boldsymbol{\theta})$$

**Still unbiased!** (The subtracted term has zero expectation: $\sum_a b(s) \nabla\pi(a|s) = b(s)\nabla\sum_a \pi(a|s) = b(s)\nabla 1 = 0$.) But variance can drop **dramatically**.

### The natural baseline: a learned state value $\hat v(S_t, \mathbf{w})$

Learn $\mathbf{w}$ by Monte Carlo ($\mathbf{w} \mathrel{+}= \alpha_\mathbf{w} (G_t - \hat v(S_t,\mathbf{w}))\nabla\hat v$), and use it as the baseline. The update is then driven by

$$G_t - \hat v(S_t, \mathbf{w}) \quad\approx\quad \text{"did this turn out better or worse than expected from here?"}$$

**Intuition 🧠:** in a state where *all* actions lead to high returns, raw REINFORCE pushes *everything* up (waste); with the baseline, only **better-than-expected** outcomes get reinforced and worse-than-expected get suppressed. Differential feedback ≫ absolute feedback.

**Empirical (book Figure 13.2, corridor gridworld):** REINFORCE-with-baseline learns **much faster** than plain REINFORCE and tolerates a much wider range of step sizes. 📈

---

## ⚠️ Is the baseline a "critic"? Not yet!

Vocabulary checkpoint: the baseline $\hat v$ here is **not bootstrapping** — it's just subtracted from a full MC return. The book reserves **actor–critic** for methods where the value function is used for **bootstrapping** (the one-step target $R + \gamma\hat v(S')$ replaces $G_t$) — which introduces bias *deliberately* in exchange for huge variance reduction and online-ness. That's the next note.

---

## 🎯 Key Takeaways

1. **REINFORCE:** θ += α·γᵗ·G_t·∇ln π — make good-outcome actions likelier. Unbiased, simple, high variance, episode-end updates only.
2. Any action-independent baseline keeps the estimate **unbiased**; a learned $\hat v(s)$ baseline slashes variance.
3. Baseline ≠ critic: no bootstrapping yet → no bias, but also no online updates and MC-grade variance.
4. The eligibility vector $\nabla\ln\pi$ is your "make this action more likely" lever — memorize its role; every modern PG method (A2C, PPO, …) is built on it.

---

➡️ **Next:** [13.4 — Actor–Critic Methods & Continuous Actions](13-04-actor-critic-and-continuous-actions.md) — add bootstrapping, go online, and handle continuous action spaces with Gaussian policies.
