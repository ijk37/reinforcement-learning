# 1.3 — An Extended Example: Tic-Tac-Toe

> **Chapter 1: Introduction** · Book sections: §1.5–§1.7
> Previous: [1.2 — Elements of RL](01-02-elements-of-rl.md) · Next: [2.1 — The k-armed Bandit Problem](02-01-k-armed-bandit-problem.md)

---

## 🌱 Why This Example Matters

Tic-tac-toe is tiny, but it shows the *entire* RL machinery working end-to-end — and it introduces **temporal-difference learning**, the single most central idea in this book. If you deeply understand this example, Chapters 2–6 will feel natural.

**Setup:** we play tic-tac-toe against an *imperfect* opponent (one who sometimes blunders). We want to learn to exploit the opponent's weaknesses. Note: classical game theory (minimax) assumes a *perfect* opponent, so it can't exploit blunders — RL can.

---

## 🛠️ The Value-Function Approach

**Step 1 — Assign a value to every state.**
Make a table with one number per possible board position — the **value** of that state = our latest estimate of the *probability of winning* from that state.

Initial values:
- States with three X's in a row (we already won): value = **1**
- States with three O's in a row, or full board (we lost/drew): value = **0**
- Everything else: initial guess of **0.5** ("maybe I'll win, maybe not")

**Step 2 — Play many games, choosing moves by value.**
Most of the time, move **greedily**: pick the move leading to the state with the highest value. Occasionally, pick a random move instead — an **exploratory move** (remember exploration vs. exploitation!).

**Step 3 — Learn: update values as you play.**
After each greedy move, nudge the value of the *earlier* state toward the value of the *later* state:

$$V(S_t) \leftarrow V(S_t) + \alpha \Big[ V(S_{t+1}) - V(S_t) \Big]$$

where:
- $S_t$ = the state before our move, $S_{t+1}$ = the state after our move (and the opponent's reply),
- $\alpha$ = a small positive number called the **step-size parameter** (learning rate), e.g. 0.1,
- the bracket $[V(S_{t+1}) - V(S_t)]$ is the **error** between consecutive estimates.

> 💡 This is called **temporal-difference (TD) learning** because the update is based on the *difference* between estimates at two successive *times*. It's the seed of Chapter 6.

**Intuition:** "I thought my winning chance in state A was 0.5, but after the move I landed in state B where my chance looks like 0.9. So state A was better than I thought — raise $V(A)$ a little toward 0.9."

### Walk-through with numbers 🔢

Say $\alpha = 0.1$, $V(A) = 0.5$, and we move from A to B where $V(B) = 0.9$:

$$V(A) \leftarrow 0.5 + 0.1 \times (0.9 - 0.5) = 0.54$$

Do this over thousands of games, and values **flow backwards** from the winning states toward the early states — the value table converges toward true winning probabilities (against this opponent), and the greedy policy converges to an optimal policy against this opponent.

---

## 🔑 Lessons This Example Teaches

1. **Learning *while* interacting** — no separate training labels; the agent improves from its own games.
2. **Delayed reward handled by values** — the only "real" reward is at game end, yet every move gets feedback through the value updates.
3. **Planning vs. reacting** — this simple player looks only one move ahead, but it *behaves* far-sightedly because values summarize the future.
4. **Exploration is necessary** — without occasional non-greedy moves, the player may never discover better lines of play.
5. **It generalizes far beyond games** — there doesn't need to be an opponent; the same ideas apply to any sequential decision problem. With **function approximation** (neural networks, Chapter 9) instead of a table, this scales to backgammon (TD-Gammon learned from 1.5 million self-play games and reached world-champion level — Chapter 16).

### A subtle point about exploratory moves 🤔
We do **not** update values on exploratory moves (in this simple scheme), because the exploratory move wasn't what we *believe* is the best — learning from it would pollute our estimate of greedy play. (Later in the book we'll see more refined ways to handle this: on-policy vs. off-policy learning, Chapter 5.)

---

## 📜 A Tiny Bit of History (§1.7)

The modern field braided together **three threads**:

1. **Learning by trial and error** — from animal psychology (Thorndike's *Law of Effect*, 1911: actions followed by satisfaction get strengthened).
2. **Optimal control** — Richard Bellman's **dynamic programming** and the **Bellman equation** (1950s); the **Markov Decision Process (MDP)** formalism. (Chapters 3–4.)
3. **Temporal-difference learning** — secondary reinforcers in psychology → Samuel's checkers player (1959) → Sutton & Barto → Watkins' Q-learning (1989) → Tesauro's TD-Gammon (1992).

These threads merged in the 1980s–90s into the field this book defines.

---

## 🎯 Key Takeaways

1. A value function over states + greedy moves + occasional exploration + TD updates = a complete, working RL agent.
2. The TD update $V(S_t) \leftarrow V(S_t) + \alpha[V(S_{t+1}) - V(S_t)]$ moves estimates toward *later, better-informed* estimates.
3. Values **propagate backwards** through experienced states, solving the delayed-reward problem.
4. The same recipe scales from tic-tac-toe to backgammon and Go — just swap the table for a function approximator.

---

➡️ **Next chapter:** [2.1 — The k-armed Bandit Problem](02-01-k-armed-bandit-problem.md) — we strip RL down to its simplest form (a single state!) to study the exploration–exploitation problem in isolation.
