# 10.2 — The Average-Reward Setting (and Why Discounting Fails with FA)

> **Chapter 10: On-policy Control with Approximation** · Book sections: §10.3–§10.6
> Previous: [10.1 — Episodic Semi-gradient Control](10-01-episodic-semi-gradient-control.md) · Next: [11.1 — Off-policy Challenges & the Deadly Triad](11-01-off-policy-challenges-and-deadly-triad.md)

---

## 🌱 The Big Picture

For **continuing** tasks (no episodes, life goes on forever) **with function approximation**, the book introduces a third classical setting alongside episodic and discounted: **average reward**. Surprise twist: in this regime, *discounting turns out to be conceptually broken* — a deep and underappreciated point.

---

## 📊 The average-reward criterion (§10.3)

Define the **reward rate** of a policy — the long-run average reward per step:

$$r(\pi) \doteq \lim_{h\to\infty} \frac{1}{h}\sum_{t=1}^{h} \mathbb{E}[R_t \mid S_0, A_{0:t-1} \sim \pi] = \sum_s \mu_\pi(s)\sum_a \pi(a|s)\sum_{s',r} p(s',r|s,a)\, r$$

(μ_π = steady-state distribution under π, assumed independent of the start state — an **ergodicity** assumption: in the long run, where you started doesn't matter.)

Policies are ranked by $r(\pi)$: *"How much reward do you collect per unit time, forever?"* ⏱️

### Differential returns and values

Since total reward is infinite, measure everything **relative to the average**. Returns become sums of **differences** between rewards and the average reward:

$$G_t \doteq (R_{t+1} - r(\pi)) + (R_{t+2} - r(\pi)) + (R_{t+3} - r(\pi)) + \cdots$$

This is the **differential return**; the corresponding value functions are **differential value functions** ("how much better than average is it to be here?"). Bellman equations carry over with $r - r(\pi)$ replacing $r$ and no γ.

**Differential TD errors:**

$$\delta_t = R_{t+1} - \bar R_t + \hat v(S_{t+1},\mathbf{w}) - \hat v(S_t,\mathbf{w})$$

where $\bar R_t$ is a running estimate of $r(\pi)$ (updated by $\bar R \mathrel{+}= \beta \delta_t$). Plug into the usual semi-gradient updates → **differential semi-gradient Sarsa** (and n-step versions, §10.5):

```text
differential semi-gradient Sarsa:
take A → R, S′; choose A′
δ = R − R̄ + q̂(S′,A′,w) − q̂(S,A,w)
R̄ += β δ
w += α δ ∇q̂(S,A,w)
```

(Book Example 10.2: an access-control queuing task — accept/reject customers of different priorities at limited servers — solved nicely by this method.)

---

## 💣 Deprecating the discounted setting (§10.4)

Here's the bombshell. For continuing tasks with function approximation, consider ranking policies by discounted value over the on-policy distribution. The book proves:

$$\text{(discounted objective)} \;=\; \frac{1}{1-\gamma}\, r(\pi)$$

> The average of the discounted returns is **proportional to the average reward** — the *ordering of policies is identical for every γ*. **The discount rate does nothing!** 🤯

Why discounting "fails" here, at root: with function approximation we've **lost the policy improvement theorem**. In tabular land, improving the action in one state could only help. With FA, we can't update states independently — there's no guarantee that a step of "improvement" helps overall, for discounted *or* average criteria. (The lack of such guarantees is a recurring theoretical hole; policy-gradient methods in Ch. 13 bring back a different kind of guarantee.)

**Practical reading:** γ stays perfectly meaningful for *episodic* tasks and as a *solution-method parameter*; but for continuing control with FA, the average-reward formulation is the principled one.

---

## 🎯 Key Takeaways

1. Average-reward setting: rank policies by reward **rate** $r(\pi)$; values become **differential** ("better than average?").
2. All TD machinery survives: replace $R$ with $R - \bar R$, drop γ, keep semi-gradients.
3. **Discounting is vacuous for continuing tasks with FA** — it induces the same policy ordering as average reward.
4. Root cause: function approximation breaks the per-state policy improvement guarantee.

---

➡️ **Next chapter:** [11.1 — Off-policy Methods with Approximation](11-01-off-policy-challenges-and-deadly-triad.md) — the danger zone: why off-policy + bootstrapping + FA can blow up, starring Baird's infamous counterexample.
