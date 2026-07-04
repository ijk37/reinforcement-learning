# 2.5 — Gradient Bandit Algorithms

> **Chapter 2: Multi-armed Bandits** · Book section: §2.8
> Previous: [2.4 — Optimistic Initial Values & UCB](02-04-optimistic-initial-values-and-ucb.md) · Next: [2.6 — Contextual Bandits & Chapter Summary](02-06-contextual-bandits-and-summary.md)

---

## 🌱 The Big Picture

Everything so far *estimated action values* and chose actions based on them. Here's a completely different philosophy:

> Don't estimate how good actions are. Instead, learn a numerical **preference** $H_t(a)$ for each action, and choose actions according to those preferences.

Only **relative** preferences matter — adding 100 to every preference changes nothing. This idea is a tiny preview of **policy gradient methods** (Chapter 13), which power much of modern deep RL.

---

## 🎲 From preferences to probabilities: softmax

Action probabilities come from the **soft-max distribution** (a.k.a. Gibbs/Boltzmann):

$$\Pr\{A_t = a\} \doteq \frac{e^{H_t(a)}}{\sum_{b=1}^{k} e^{H_t(b)}} \doteq \pi_t(a)$$

- $\pi_t(a)$ = probability of taking action $a$ at time $t$ (our first use of the policy notation π!).
- Bigger preference → exponentially bigger probability, but **every action always has some probability** → built-in exploration. ✅
- Initially all preferences are 0 → all actions equally likely.

**Quick example 🔢** with 3 actions, $H = (2, 1, 0)$:
$e^2 \approx 7.39,\; e^1 \approx 2.72,\; e^0 = 1$, sum ≈ 11.11
→ $\pi \approx (0.67, 0.24, 0.09)$.

---

## 📈 The learning rule

After selecting $A_t$ and receiving $R_t$, update **all** preferences:

$$H_{t+1}(A_t) \leftarrow H_t(A_t) + \alpha\,(R_t - \bar{R}_t)\,(1 - \pi_t(A_t))$$
$$H_{t+1}(a) \leftarrow H_t(a) - \alpha\,(R_t - \bar{R}_t)\,\pi_t(a) \qquad \text{for all } a \neq A_t$$

where $\bar{R}_t$ is the **average of all rewards so far** — the **baseline**.

### How to read it 🧠

- If the reward beat the baseline ($R_t > \bar{R}_t$): *"that went better than usual"* → **raise** the chosen action's preference, lower all others.
- If the reward fell below baseline: *"worse than usual"* → **lower** the chosen action's preference, raise the others.
- The $(1-\pi)$ and $\pi$ factors scale updates sensibly (rare actions get bigger nudges when chosen).

### Why the baseline matters (a lot!) ⚓

Suppose all true rewards are shifted up by +4 (every action pays well). Without a baseline, *every* reward looks "good" and whatever action you happen to pick gets reinforced — learning becomes nearly random. With the baseline $\bar{R}_t$, only *better-than-average* outcomes are reinforced. The book's experiment shows the version **with baseline performs dramatically better** when rewards are shifted. The baseline doesn't change what the algorithm converges to *in expectation* — it slashes the **variance** of updates.

> 💡 Remember "baseline reduces variance" — it returns as a starring concept in REINFORCE-with-baseline and actor–critic methods (Chapter 13).

---

## 🔬 Why "gradient" bandit? (the beautiful part)

This update is **stochastic gradient ascent** on expected reward: in expectation, each preference moves in the direction that increases $\mathbb{E}[R_t]$:

$$H_{t+1}(a) \approx H_t(a) + \alpha \frac{\partial\, \mathbb{E}[R_t]}{\partial H_t(a)}$$

The book proves this by showing the expected update equals the true gradient — even though the algorithm never knows the gradient and only uses each sampled reward. This guarantees robust convergence properties, and the same math reappears as the **policy gradient theorem** in Chapter 13.

---

## 🎯 Key Takeaways

1. Gradient bandits learn **preferences** $H(a)$, not values; actions are sampled from a **softmax** over preferences.
2. Update: reinforce the chosen action if reward exceeds the **baseline** (average reward), weaken otherwise.
3. The baseline doesn't bias learning, but **massively reduces variance** → much faster, more reliable learning.
4. It's secretly **stochastic gradient ascent** on expected reward → preview of policy gradient methods (Ch. 13).

---

➡️ **Next:** [2.6 — Contextual Bandits & Chapter Summary](02-06-contextual-bandits-and-summary.md) — adding *situations* back in, and a final showdown of all the methods.
