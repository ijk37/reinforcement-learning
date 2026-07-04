# 13.1 — Policy Approximation and Its Advantages

> **Chapter 13: Policy Gradient Methods** · Book section: §13.1
> Previous: [12.4 — Sarsa(λ) & Off-policy Traces](12-04-sarsa-lambda-and-off-policy-traces.md) · Next: [13.2 — The Policy Gradient Theorem](13-02-policy-gradient-theorem.md)

---

## 🌱 The Big Picture

Everything so far was **action-value methods**: learn $q$, derive the policy by (ε-)greedification. Chapter 13 flips the script:

> **Parameterize the policy itself** — $\pi(a|s, \boldsymbol{\theta})$ with parameters $\boldsymbol{\theta}$ — and adjust θ by **gradient ascent on performance**:

$$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t + \alpha\, \widehat{\nabla J(\boldsymbol{\theta}_t)}$$

where $J(\theta)$ is a performance measure (episodic: value of the start state $v_{\pi_\theta}(s_0)$). A value function may still be learned to *help* (→ **actor–critic**: "actor" = policy, "critic" = value function), but action selection no longer requires consulting value tables.

---

## 🧰 How to parameterize a policy (discrete actions)

Most common: **softmax in action preferences.** Compute a numerical preference $h(s, a, \boldsymbol{\theta})$ for each action (linear in features, or a neural net), then:

$$\pi(a|s,\boldsymbol{\theta}) \doteq \frac{e^{h(s,a,\boldsymbol{\theta})}}{\sum_b e^{h(s,b,\boldsymbol{\theta})}}$$

(Exactly the gradient-bandit idea from Chapter 2, now with states!) The only requirement on the parameterization: differentiable in θ, and (for exploration) never exactly deterministic during learning.

---

## 🏆 Why bother? Four real advantages

### 1. Naturally stochastic policies — sometimes *required*
In problems with **imperfect information** (partial observability), the *optimal* policy may be genuinely stochastic — e.g., poker bluffing at specific probabilities ♠️, or the book's **corridor gridworld** (Example 13.1) where two states look identical and the best policy goes right with probability ≈0.59. Action-value methods with ε-greedy can't express *specific* probabilities; policy parameterization can. And softmax-over-**q-values** wouldn't help either — values converge to real numbers, driving the policy toward determinism; preferences are free to drive probabilities anywhere.

### 2. Policies can be simpler than values
Sometimes the value function is gnarly but the policy is trivial ("always accelerate toward the goal"). Parameterize whichever is simpler — often that's the policy.

### 3. Smooth policy changes → better convergence
ε-greedy policies can **jump discontinuously** when an argmax flips by a hair. Parameterized policies change **continuously** with θ. This smoothness is precisely what enables the strong(er) convergence guarantees of policy-gradient methods — and what the policy gradient theorem will exploit.

### 4. Injecting prior knowledge
Want the initial policy to mimic an expert, or to respect known structure? Choosing the policy parameterization is a natural place to encode it.

### 5. Continuous action spaces (preview of §13.7)
With infinite actions, "max over actions" is unworkable — but a parameterized policy can just output, say, the mean and width of a Gaussian over actions. Policy methods scale to continuous control where greedification can't follow.

---

## 🆚 Side-by-side

| | Action-value methods | Policy gradient methods |
|---|---|---|
| Learns | $\hat q(s,a,\mathbf{w})$; policy implicit | $\pi(a\|s,\boldsymbol{\theta})$ explicitly (± a critic) |
| Action selection | argmax / ε-greedy | sample from π |
| Stochastic optima | can't represent precisely | natural ✅ |
| Continuous actions | hard | natural ✅ |
| Policy change w.r.t. parameters | discontinuous jumps | smooth ✅ |
| Guarantee flavor | fixed-point arguments | **gradient ascent on performance** |

---

## 🎯 Key Takeaways

1. Policy gradient: learn $\pi(a|s,\boldsymbol{\theta})$ directly by gradient ascent on performance $J(\theta)$.
2. Softmax over differentiable action preferences = the standard discrete parameterization.
3. Wins: exact stochastic policies, simpler hypotheses, smooth updates (better theory), priors, continuous actions.
4. Add a learned value function as helper → **actor–critic** (note 13.4).

---

➡️ **Next:** [13.2 — The Policy Gradient Theorem](13-02-policy-gradient-theorem.md) — the theoretical gem: how to compute the performance gradient *without* differentiating through the environment.
