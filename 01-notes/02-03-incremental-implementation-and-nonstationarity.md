# 2.3 — Incremental Implementation & Tracking Nonstationary Problems

> **Chapter 2: Multi-armed Bandits** · Book sections: §2.4–§2.5
> Previous: [2.2 — Action-value Methods](02-02-action-value-methods.md) · Next: [2.4 — Optimistic Initial Values & UCB](02-04-optimistic-initial-values-and-ucb.md)

---

## 🌱 The Big Picture

This note introduces **the most important update rule pattern in the entire book**. Seriously — you will see this exact shape in Monte Carlo methods, TD learning, Q-learning, neural-network training... Learn it once, recognize it everywhere:

$$\boxed{\;\text{NewEstimate} \leftarrow \text{OldEstimate} + \text{StepSize}\,\big[\text{Target} - \text{OldEstimate}\big]\;}$$

The bracket $[\text{Target} - \text{OldEstimate}]$ is the **error**: how far our estimate is from where we'd like it to be. We move the estimate a fraction (StepSize) of the way toward the Target.

---

## 🔢 Incremental computation of averages (§2.4)

Computing a sample average naively means storing *every* reward — memory grows forever. There's a better way. Let $Q_n$ be the average of the first $n-1$ rewards for some action. After receiving the $n$-th reward $R_n$:

$$Q_{n+1} = Q_n + \frac{1}{n}\Big[R_n - Q_n\Big]$$

**Derivation (worth following once):**

$$Q_{n+1} = \frac{1}{n}\sum_{i=1}^{n} R_i = \frac{1}{n}\Big(R_n + \sum_{i=1}^{n-1} R_i\Big) = \frac{1}{n}\Big(R_n + (n-1)\,Q_n\Big) = Q_n + \frac{1}{n}\big(R_n - Q_n\big)$$

Only two numbers needed per action: the current estimate $Q$ and the count $n$. ✨

**Sanity check 🔍:** rewards 1, 0, 2 for one action.
- $Q_1 = 0$ (initial). After $R_1=1$: $Q_2 = 0 + \frac{1}{1}(1-0) = 1$.
- After $R_2=0$: $Q_3 = 1 + \frac{1}{2}(0-1) = 0.5$.
- After $R_3=2$: $Q_4 = 0.5 + \frac{1}{3}(2-0.5) = 1.0$. ✅ Matches $(1+0+2)/3$.

---

## 🌊 Nonstationary problems (§2.5)

The sample average weights **all** rewards equally — the reward from pull #1 counts as much as the reward from pull #10,000. That's perfect if the true values never change (**stationary**). But in most real problems the world drifts: the slot machine payouts change, customer tastes shift, opponents adapt.

In a **nonstationary** problem we should trust **recent rewards more than old ones**. Solution: use a **constant step size** $\alpha \in (0, 1]$ instead of $1/n$:

$$Q_{n+1} = Q_n + \alpha\Big[R_n - Q_n\Big]$$

This makes $Q$ an **exponential recency-weighted average**:

$$Q_{n+1} = (1-\alpha)^n Q_1 + \sum_{i=1}^{n} \alpha (1-\alpha)^{n-i} R_i$$

- The weight on reward $R_i$ decays exponentially the older it is: a reward from $j$ steps ago has weight $\alpha(1-\alpha)^{j-1}$.
- With $\alpha = 0.1$: the latest reward gets weight 0.1, the one before 0.09, then 0.081, ... old rewards fade away. 🍂

### Quick comparison

| | $\alpha_n = 1/n$ (sample average) | $\alpha$ constant |
|---|---|---|
| Weights on rewards | All equal | Exponentially favor recent |
| Converges? | Yes (stationary case) | Never fully converges — by design! |
| Best for | Stationary problems | **Nonstationary** problems (most of real life) |

### The convergence conditions (good to know, often ignored 😄)

Stochastic approximation theory says a step-size sequence $\alpha_n$ guarantees convergence with probability 1 iff:

$$\sum_{n=1}^{\infty} \alpha_n = \infty \qquad \text{and} \qquad \sum_{n=1}^{\infty} \alpha_n^2 < \infty$$

- First condition: steps stay big enough to overcome initial conditions and noise.
- Second condition: steps eventually get small enough to settle down.
- $1/n$ satisfies both ✅. Constant $\alpha$ fails the second ❌ — which is exactly *why* it keeps adapting forever, making it **right** for nonstationary problems. In practice, constant step sizes are used far more often.

---

## 🎯 Key Takeaways

1. **Master pattern:** `New ← Old + StepSize · (Target − Old)`. You'll see it ~50 more times in this book.
2. Sample averages can be computed incrementally with step size $1/n$ — O(1) memory.
3. For changing (nonstationary) worlds, use a **constant step size α** → exponential recency-weighted average.
4. Convergence theory: $\sum \alpha_n = \infty$, $\sum \alpha_n^2 < \infty$. Constant α deliberately violates this to keep tracking.

---

➡️ **Next:** [2.4 — Optimistic Initial Values & UCB](02-04-optimistic-initial-values-and-ucb.md) — two smarter ways to explore than coin-flipping.
