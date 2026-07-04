# 6.5 — Maximization Bias, Double Learning & Afterstates

> **Chapter 6: Temporal-Difference Learning** · Book sections: §6.7–§6.9
> Previous: [6.4 — Q-learning & Expected Sarsa](06-04-q-learning-and-expected-sarsa.md) · Next: [7.1 — n-step TD Prediction](07-01-n-step-td-prediction.md)

---

## 🎈 Maximization Bias (§6.7)

All our control methods take a **max over estimated values** (explicitly in Q-learning, implicitly via the greedy policy in Sarsa). Here's the trap:

> Using the **maximum of noisy estimates** as an estimate of the **maximum of true values** produces a systematic **positive bias**.

**Intuition 🎲:** suppose ten actions all have true value 0, but your estimates are noisy — some look slightly positive, some slightly negative. The *max* of the estimates is almost surely positive, even though the *true* max is 0. The max operation cherry-picks the luckiest noise.

**Book Example 6.7:** A tiny MDP where state B offers many actions whose rewards average **−0.1** (all genuinely bad). Q-learning initially *loves* going to B — random positive flukes in some action's estimate make B's max look good — and takes far longer than necessary to learn to avoid it. ε-greedy Q-learning chooses the bad LEFT action much more often than the 5% an unbiased learner would.

---

## 👯 Double Learning — the fix

The root cause: **the same samples** are used both to *choose* the best action and to *evaluate* it. The lucky noise that wins the argmax also inflates the value. Solution: **split the data into two independent estimates** $Q_1$ and $Q_2$:

- Use $Q_1$ to **choose** the best action: $A^* = \arg\max_a Q_1(a)$
- Use $Q_2$ to **evaluate** it: $Q_2(A^*)$

Then $\mathbb{E}[Q_2(A^*)] = q(A^*)$ — **unbiased!** $Q_2$'s noise is independent of the argmax's choice, so no cherry-picking. (A second symmetric estimate with the roles swapped gives another unbiased estimate.)

### Double Q-learning

Flip a coin on each step; heads updates $Q_1$, tails $Q_2$:

$$Q_1(S_t,A_t) \leftarrow Q_1(S_t,A_t) + \alpha\Big[R_{t+1} + \gamma\, Q_2\big(S_{t+1}, \arg\max_a Q_1(S_{t+1},a)\big) - Q_1(S_t,A_t)\Big]$$

(and symmetrically with 1 ↔ 2 on tails). Behavior policy can use $Q_1 + Q_2$.

- Doubles memory, but **not** per-step computation.
- On the example above, Double Q-learning is essentially unaffected by maximization bias and homes in on the right policy fast. ✅
- Legacy: this idea became **Double DQN**, a standard component of deep RL systems.

---

## ♟️ Afterstates (§6.8) — a smart representation trick

Remember the tic-tac-toe agent from Chapter 1? It evaluated board positions **after its move** — neither a conventional state value (before the move) nor an action value $q(s,a)$. These are **afterstate value functions**, useful when:

> We know the *immediate, deterministic* effect of our action (e.g., what the board looks like after we place our X), but not what happens beyond.

**Why they're efficient:** different (state, action) pairs can produce the **same** afterstate — e.g., two different positions + different moves yielding an identical resulting board. A conventional $q(s,a)$ would have to learn the two pairs *separately*; an afterstate value function assesses the shared result **once**. Less to learn, more data per learned thing. ✨

Afterstates fit the same GPI machinery; they appear in games, queuing, and anywhere an action's first-stage outcome is known.

---

## 📋 Chapter 6 wrap-up

The one-step TD control family:

| Algorithm | Target | Policy type |
|---|---|---|
| Sarsa | $R + \gamma Q(S', A')$ | on-policy |
| Expected Sarsa | $R + \gamma \sum_a \pi(a\|S')Q(S',a)$ | either |
| Q-learning | $R + \gamma \max_a Q(S',a)$ | off-policy |
| Double Q-learning | $R + \gamma Q_2(S', \arg\max_a Q_1(S',a))$ | off-policy, bias-free |

TD methods are today the **most widely used** RL methods: simple, online, computationally cheap. Two directions extend them in the coming chapters: **n-step methods** (Ch. 7, toward MC) and **models/planning** (Ch. 8, toward DP).

---

## 🎯 Key Takeaways

1. Max over noisy estimates ⇒ **positive (maximization) bias**; it can seriously mislead early learning.
2. **Double learning:** decouple *selection* from *evaluation* with two independent estimates; unbiased; powers Double DQN.
3. **Afterstates:** evaluate the position *after* your deterministic move; merges equivalent (s, a) pairs and speeds learning.
4. TD + GPI gives the practical workhorses of all of RL: Sarsa, Q-learning, Expected Sarsa.

---

➡️ **Next chapter:** [7.1 — n-step TD Prediction](07-01-n-step-td-prediction.md) — between the one-step TD and full-return MC extremes lies a spectrum, and the best methods usually live in the middle.
