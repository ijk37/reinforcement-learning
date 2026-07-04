# 13.2 — The Policy Gradient Theorem

> **Chapter 13: Policy Gradient Methods** · Book section: §13.2
> Previous: [13.1 — Policy Approximation](13-01-policy-approximation-and-advantages.md) · Next: [13.3 — REINFORCE & Baseline](13-03-reinforce-and-baseline.md)

---

## 🌱 The Big Picture

We want gradient ascent on performance $J(\boldsymbol{\theta}) = v_{\pi_\theta}(s_0)$ (episodic case: the true value of the start state). But here's the scary part: performance depends on θ in **two** ways:

1. through the **actions** the policy picks (easy — we know π's formula), and
2. through the **states the agent ends up visiting** — the state distribution — which depends on the policy *and the environment's unknown dynamics*. 😨

How can we possibly compute a gradient that involves the effect of θ on the state distribution, when the environment is unknown? The **policy gradient theorem** answers with a small miracle:

$$\boxed{\;\nabla J(\boldsymbol{\theta}) \;\propto\; \sum_s \mu(s) \sum_a q_\pi(s,a)\, \nabla \pi(a|s, \boldsymbol{\theta})\;}$$

> **The gradient of the state distribution does not appear.** The performance gradient can be written purely in terms of: how often states occur under π (μ), the action values, and the *policy's own* gradient — all things we can sample or estimate!

(μ here is the on-policy distribution; the ∝ is exactness up to a constant — the average episode length in the episodic case, 1 in the continuing/average-reward case.)

---

## 🧠 Reading the theorem

$$\nabla J \propto \sum_s \mu(s) \underbrace{\sum_a q_\pi(s,a)\,\nabla\pi(a|s,\boldsymbol{\theta})}_{\text{per-state push}}$$

For each state (weighted by visitation):
- For each action: push θ in the direction that **increases that action's probability**, scaled by **how good the action is** ($q_\pi$).
- Good actions get their probability pushed up more than bad ones; since probabilities sum to 1, bad actions implicitly lose. ⚖️

### Why no state-distribution gradient? (intuition)

Changing θ slightly changes both *what you do* and *where you end up*. The theorem shows the "where you end up" effects **cancel out in aggregate**: gains and losses from shifted visitation are already accounted for by the value functions. (The book proves it in under a page of telescoping algebra — recommended reading once you're comfortable; the proof unrolls $\nabla v_\pi(s)$ recursively and the dynamics terms fold into μ.)

---

## 🎲 From theorem to algorithm: sampling the gradient

The right side is an expectation over states visited under π. Sampling $S_t \sim \mu$:

$$\nabla J \propto \mathbb{E}_\pi\Big[\sum_a q_\pi(S_t, a)\, \nabla \pi(a|S_t,\boldsymbol{\theta})\Big]$$

Two routes from here:

1. **All-actions methods:** use the sum over actions directly (with learned $\hat q$) — clean but needs estimates for all actions.
2. **REINFORCE route (next note):** replace the sum over actions with the *sampled* action $A_t$ (importance-correcting by dividing by $\pi(A_t|S_t)$), and $q_\pi$ with the *sampled return* $G_t$:

$$\nabla J \propto \mathbb{E}_\pi\Big[G_t\, \frac{\nabla \pi(A_t|S_t,\boldsymbol{\theta})}{\pi(A_t|S_t,\boldsymbol{\theta})}\Big] = \mathbb{E}_\pi\big[G_t\, \nabla \ln \pi(A_t|S_t,\boldsymbol{\theta})\big]$$

The vector $\nabla \ln \pi(A_t|S_t,\boldsymbol{\theta})$ is the **eligibility vector** — "which way to push θ to make this action more likely."

> 💡 For softmax-linear policies it has a lovely closed form: $\nabla \ln \pi(a|s,\boldsymbol{\theta}) = \mathbf{x}(s,a) - \sum_b \pi(b|s,\boldsymbol{\theta})\,\mathbf{x}(s,b)$ — *this action's features minus the policy-average features*.

---

## 🎯 Key Takeaways

1. **Policy gradient theorem:** $\nabla J \propto \sum_s \mu(s)\sum_a q_\pi(s,a)\nabla\pi(a|s,\boldsymbol{\theta})$ — no gradient of the state distribution needed. This is *the* enabling result for all policy-gradient RL.
2. Interpretation: increase each action's probability in proportion to its value, weighted by state visitation.
3. Sampling the theorem gives unbiased stochastic gradient estimates from experience alone.
4. $\nabla \ln \pi$ (the eligibility vector) is the practical workhorse — the direction that makes the taken action more probable.

---

➡️ **Next:** [13.3 — REINFORCE & REINFORCE with Baseline](13-03-reinforce-and-baseline.md) — the theorem turned into runnable Monte Carlo algorithms.
