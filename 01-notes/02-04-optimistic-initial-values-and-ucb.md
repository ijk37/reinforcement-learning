# 2.4 — Optimistic Initial Values & Upper-Confidence-Bound (UCB)

> **Chapter 2: Multi-armed Bandits** · Book sections: §2.6–§2.7
> Previous: [2.3 — Incremental Implementation](02-03-incremental-implementation-and-nonstationarity.md) · Next: [2.5 — Gradient Bandit Algorithms](02-05-gradient-bandit-algorithms.md)

---

## 🌱 The Big Picture

ε-greedy explores **blindly** — when it explores, it picks among all actions with equal probability, even ones it already knows are terrible. This note covers two smarter exploration strategies:

1. **Optimistic initial values** — make everything look great at the start, so the agent explores naturally.
2. **UCB** — explore actions in proportion to *how uncertain* you are about them.

---

## 🌞 Optimistic Initial Values (§2.6)

**Trick:** instead of initializing $Q_1(a) = 0$, initialize **wildly optimistically**, e.g. $Q_1(a) = +5$ when true values are around 0–1.5.

**What happens:** whichever action the agent tries first, the actual reward (≈ 0–1.5) is a *disappointment* compared to +5, so the estimate drops, and the greedy choice switches to a different (still optimistic) action. The agent ends up trying **all** actions several times **before** estimates settle — exploration emerges from pure greedy selection! 🤯

On the 10-armed testbed, greedy-with-optimism ($Q_1 = 5$, ε = 0) eventually **beats** ε-greedy ($Q_1 = 0$, ε = 0.1).

**Limitations (important!):**

- It's a **temporary** drive to explore: once the optimism washes out, exploration stops. If the task is **nonstationary** (the best action changes later), this trick can't help — it only explores *at the beginning*. ❌
- Any method that focuses on initial conditions is unlikely to help in the general nonstationary case. The "beginning of time" only happens once.
- Side note: with sample-average updates, the very first reward completely overwrites the initial value (since $\alpha_1 = 1/1 = 1$); the optimism trick is most natural with constant step size, where initial values bias estimates *persistently but decreasingly*.

> 💡 Still, it's a simple, often-effective trick, and a nice reminder that **initial values are a knob you control** — they can encode prior knowledge or set the level of optimism.

---

## 📏 Upper-Confidence-Bound Action Selection (§2.7)

ε-greedy's random exploration is indiscriminate. Better idea: explore the actions that are **most promising or most uncertain** — the ones that *could plausibly be optimal*.

$$A_t \doteq \underset{a}{\arg\max}\left[\, Q_t(a) + c\,\sqrt{\frac{\ln t}{N_t(a)}} \;\right]$$

where:
- $N_t(a)$ = number of times action $a$ has been selected so far,
- $c > 0$ controls the degree of exploration,
- if $N_t(a) = 0$, $a$ is considered maximizing (try every action once first).

### How to read this formula 🧠

- $Q_t(a)$ — *"how good does it look?"* (exploitation term)
- $c\sqrt{\ln t / N_t(a)}$ — *"how uncertain am I?"* (exploration bonus). It's a measure of the **upper confidence bound**: the true value is plausibly at most this much above the estimate.

The bonus behaves beautifully:
- Pick action $a$ → $N_t(a)$ grows → its bonus **shrinks** (we're more certain now).
- Don't pick $a$ → $t$ grows but $N_t(a)$ doesn't → its bonus **grows** (uncertainty creeps up) → eventually $a$ gets tried again.
- Because of $\ln t$, all actions get tried infinitely often, but bad-looking actions get tried **less and less frequently** over time. Exploration is *directed*, not random.

> ☕ **Analogy:** you keep going to your top-rated coffee shop, but the longer you ignore the place across the street, the more you wonder "maybe they improved?" — until curiosity wins and you check again. UCB formalizes that itch.

**Performance:** on the 10-armed testbed, UCB generally **outperforms ε-greedy** (apart from a characteristic spike in the early steps when it systematically samples everything).

**Limitations:** UCB is harder to extend beyond bandits — it struggles with nonstationary problems and with large state spaces / function approximation. That's why ε-greedy, despite its crudeness, remains the default in full RL.

---

## 🎯 Key Takeaways

1. **Optimistic initialization**: set $Q_1$ high → greedy agents explore on their own. Simple, effective, but only helps **early**; useless for nonstationary tasks.
2. **UCB**: select actions by *estimated value + uncertainty bonus*. Explores deliberately where knowledge is weakest.
3. The UCB bonus $c\sqrt{\ln t / N_t(a)}$ shrinks with experience of $a$ and grows (slowly) with total time.
4. On bandits: UCB ≥ ε-greedy ≥ greedy. In full RL: ε-greedy still rules due to simplicity.

---

➡️ **Next:** [2.5 — Gradient Bandit Algorithms](02-05-gradient-bandit-algorithms.md) — a totally different philosophy: don't estimate values at all; learn *preferences* instead.
