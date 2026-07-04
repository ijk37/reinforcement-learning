# 13.4 — Actor–Critic Methods & Continuous Actions

> **Chapter 13: Policy Gradient Methods** · Book sections: §13.5–§13.8
> Previous: [13.3 — REINFORCE & Baseline](13-03-reinforce-and-baseline.md) · Next: [14.1 — Psychology I](14-01-classical-conditioning-and-td-model.md)

---

## 🎭 Actor–Critic (§13.5)

Replace REINFORCE's full return $G_t$ with the **one-step bootstrapped return** — and the baseline with the same learned value function:

$$\delta_t = R_{t+1} + \gamma\,\hat v(S_{t+1},\mathbf{w}) - \hat v(S_t,\mathbf{w}) \qquad \text{(the TD error!)}$$

$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t + \alpha^{\boldsymbol{\theta}}\, \delta_t\, \nabla \ln \pi(A_t|S_t,\boldsymbol{\theta})$$

- **Actor** = the policy π(·|·,θ): decides what to do.
- **Critic** = the value function $\hat v(\cdot,\mathbf{w})$: evaluates each move — its TD error is the "review" 🎬: positive δ ("better than expected") → make that action likelier; negative δ → less likely.

```text
One-step actor–critic (episodic):
for each step of episode:
    A ~ π(·|S,θ)
    take A → R, S′
    δ = R + γ v̂(S′,w) − v̂(S,w)         (if S′ terminal: v̂(S′,·)=0)
    w += α_w δ ∇v̂(S,w)                  ← critic learns (semi-gradient TD(0))
    θ += α_θ I δ ∇ln π(A|S,θ)           ← actor learns  (I = γ^t accumulator)
    S ← S′
```

**Why bootstrap?** Same trade as TD vs MC: bias introduced, variance slashed, **fully online and incremental** — works on continuing problems, learns during episodes. In practice the trade is overwhelmingly favorable. Add **eligibility traces** for both θ and w (actor–critic with traces, the book's full algorithm) and you have a classic, complete online agent. For continuing tasks, use the **average-reward** formulation with differential TD errors (§13.6).

> 🧠 Actor–critic also has a neuroscience resonance: dopamine signals behave like δ broadcast to both an "actor" and a "critic" in the brain (Chapter 15) — one reason this architecture is beloved.

---

## 🎛️ Continuous Actions: Gaussian Policies (§13.7)

When actions are real numbers (motor torques, bet sizes…), don't enumerate — **parameterize a distribution**. The policy outputs the **mean** and **standard deviation** of a normal distribution, then samples:

$$\pi(a|s,\boldsymbol{\theta}) = \frac{1}{\sigma(s,\boldsymbol{\theta})\sqrt{2\pi}} \exp\left(-\frac{(a - \mu(s,\boldsymbol{\theta}))^2}{2\sigma(s,\boldsymbol{\theta})^2}\right)$$

with e.g. $\mu(s,\boldsymbol{\theta}) = \boldsymbol{\theta}_\mu^\top \mathbf{x}_\mu(s)$ and $\sigma(s,\boldsymbol{\theta}) = \exp(\boldsymbol{\theta}_\sigma^\top \mathbf{x}_\sigma(s))$ (exponential keeps σ positive).

- All the policy-gradient machinery applies — just compute $\nabla \ln \pi$ for the Gaussian.
- σ controls **exploration**: the agent can learn to *narrow* its action distribution as it becomes confident. 🎯
- This is the gateway to modern continuous control (robotics, locomotion).

---

## 📋 Chapter 13 wrap-up (and Part II send-off)

| Method | Update driver | Variance | Online? |
|---|---|---|---|
| REINFORCE | $G_t$ | high | episode-end |
| REINFORCE + baseline | $G_t - \hat v(S_t)$ | medium | episode-end |
| **Actor–critic** | $\delta_t$ (TD error) | low | **every step** ✅ |

Policy-gradient advantages recap: stochastic optimal policies ✔, continuous actions ✔, smooth updates with the **policy gradient theorem**'s exact gradient formula ✔, easy priors ✔. Together with value-based methods, you now hold both halves of modern RL: **DQN-style** (value) and **PPO/A2C-style** (policy gradient) algorithms all trace their lineage to Chapters 6 and 13.

---

## 🎯 Key Takeaways

1. **Actor–critic** = policy-gradient actor + TD-error critic; the TD error δ is the *single* learning signal for both.
2. Bootstrapped critic → bias for (much less) variance; fully online; traces for both parameter vectors.
3. **Gaussian policies** handle continuous actions: learn mean (and spread) of the action distribution.
4. You've completed the core algorithms of the book — Part III (Ch. 14–17) looks outward: psychology, neuroscience, applications, frontiers.

---

➡️ **Next (Part III):** [14.1 — Psychology: Classical Conditioning & the TD Model](14-01-classical-conditioning-and-td-model.md) — how RL algorithms turn out to be uncannily good models of animal learning.
