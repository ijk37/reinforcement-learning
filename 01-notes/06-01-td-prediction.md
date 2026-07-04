# 6.1 — TD Prediction: TD(0) and Its Advantages

> **Chapter 6: Temporal-Difference Learning** · Book sections: §6.1–§6.2
> Previous: [5.5 — Off-policy MC Control](05-05-off-policy-mc-control-and-summary.md) · Next: [6.2 — Optimality of TD(0)](06-02-optimality-of-td0.md)

---

## 🌟 The Big Picture

> *"If one had to identify one idea as central and novel to reinforcement learning, it would undoubtedly be temporal-difference (TD) learning."* — Sutton & Barto

TD learning is the child of two parents:

- From **Monte Carlo**: learn directly from raw experience, **no model needed**.
- From **Dynamic Programming**: update estimates from other estimates (**bootstrap**) — *don't wait for the final outcome*.

---

## 🧮 The TD(0) update

Compare the targets used to update $V(S_t)$:

**Monte Carlo** (constant-α MC) waits until the episode ends to know the return $G_t$:

$$V(S_t) \leftarrow V(S_t) + \alpha\big[\,G_t - V(S_t)\,\big]$$

**TD(0)** waits only one step, then uses the observed reward plus the *current estimate* of the next state:

$$\boxed{\;V(S_t) \leftarrow V(S_t) + \alpha\big[\,R_{t+1} + \gamma V(S_{t+1}) - V(S_t)\,\big]\;}$$

The quantity in brackets is THE most important quantity in RL — the **TD error**:

$$\delta_t \doteq R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$$

*"The difference between what I now believe (after one step of reality) and what I believed a moment ago."*

### Why is this legitimate? 🤔

Recall: $v_\pi(s) = \mathbb{E}_\pi[R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s]$.

- MC uses an **estimate of the expectation** (it samples the full return).
- DP uses the **exact expectation** but an **estimate of $v_\pi(S_{t+1})$** (bootstraps).
- TD does **both**: it *samples* the one-step outcome AND *bootstraps* off the estimated next value. A **sample update** (one sampled successor) rather than DP's *expected update* (all successors weighted).

---

## 🚗 The intuition: Driving Home (book Example 6.1)

You leave the office predicting "30 min to get home." On the highway you're stuck behind a truck; at 20 min in, you re-predict 35 more (total 55).

- **MC approach:** wait until you actually arrive (say, 43 min total), then go back and adjust *all* earlier predictions toward 43.
- **TD approach:** adjust each prediction immediately toward the **next prediction**: when the estimate jumped from 30 to 55, you already know your initial guess was too optimistic — *why wait until you get home to learn that?*

> 💡 Each later prediction is better-informed than the earlier one — so earlier predictions can learn from later ones, **right now**, online, from every step.

---

## ✅ Advantages of TD methods (§6.2)

1. **vs DP:** no model of the environment needed. ✅
2. **vs MC:** fully **online and incremental** — update every step, not at episode end. Crucial for: very long episodes, and **continuing tasks** that have no episodes at all!
3. **vs off-policy MC:** TD doesn't need to discard/down-weight episodes with exploratory actions (no waiting for complete returns).
4. **Sound:** for any fixed policy π, TD(0) converges to $v_\pi$ (with usual step-size conditions). ✅
5. **Fast:** on stochastic tasks, TD methods usually converge **faster** than constant-α MC in practice. (No theorem proves this universally — but it's the consistent empirical finding.)

### Worked example: Random Walk (book Example 6.2) 🚶

Five states A–B–C–D–E in a row; start at C; move left/right with 50/50 chance; episode terminates off either end; reward +1 off the right end, 0 elsewhere (γ=1). True values: A=1/6, B=2/6, C=3/6, D=4/6, E=5/6.

Result: TD(0) consistently reaches lower error than MC across a range of step sizes — the classic first demonstration that bootstrapping from a "moving target" not only works, it *wins*.

---

## 🎯 Key Takeaways

1. **TD(0) update:** $V(S_t) \mathrel{+}= \alpha[R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]$ — learn from one step of reality plus your own next estimate.
2. **TD error** $\delta_t$: the surprise between successive predictions; the central quantity of RL (and, per Ch. 15, possibly of dopamine in your brain!).
3. TD = MC's model-freeness + DP's bootstrapping.
4. TD updates **every step** — online, incremental, works for continuing tasks.
5. TD converges to $v_\pi$ and typically learns faster than MC.

---

➡️ **Next:** [6.2 — Optimality of TD(0)](06-02-optimality-of-td0.md) — what exactly do TD and MC converge *to* with limited data? (Spoiler: different things, both sensible.)
