# Chapter 3 — Finite MDPs · Exercises

> Practice for notes [3.1](../01-notes/03-01-agent-environment-interface.md)–[3.5](../01-notes/03-05-optimal-policies-and-value-functions.md).
> The Bellman equation (3.4) is the most important thing in the book — make sure you can do these by hand.

---

## 🧠 Conceptual

### 3.1 — The reward-timing gotcha
Why does the book write the reward for action $A_t$ as $R_{t+1}$ rather than $R_t$? Write out the first six elements of a trajectory.

💡 **Hint:** Reward and next state arrive *together*, one step after the action.

<details>
<summary>✅ Full Answer</summary>

When the agent takes action $A_t$ in state $S_t$, the environment responds **one step later** with both the next state and the reward — so they share the index $t+1$. Writing $R_{t+1}$ keeps reward and next state consistently time-stamped.

Trajectory: $S_0, A_0, R_1, S_1, A_1, R_2, \dots$

(A frequent source of beginner confusion in the math; lock it in now.)
</details>

---

### 3.2 — Markov property and state design
The "last card seen" in blackjack is *not* a Markov state, but the full board in chess *is*. Explain why, and state the general principle for what makes a state Markov.

💡 **Hint:** A state is Markov if it captures everything from the past relevant to the future.

<details>
<summary>✅ Full Answer</summary>

A state is **Markov** if the future (next state and reward distribution) depends only on the current state and action — not on how you got there. Equivalently, the state summarizes all relevant history.

- **Chess board = Markov:** the current position contains everything you need to choose a move; the move sequence that produced it is irrelevant to legal future play.
- **"Last card seen" ≠ Markov:** to predict future blackjack outcomes you need to know *all* cards already dealt (they change the remaining deck), not just the last one. The single last card omits relevant history.

**Principle:** the Markov property is a constraint on the **state representation** — it's the designer's job to include enough information that the future depends only on the present.
</details>

---

### 3.3 — Reward design pitfall
You want a chess agent to win. A colleague suggests rewarding +0.1 per captured piece "to help it learn faster." Explain why this can backfire, citing the reward-design rule.

💡 **Hint:** Reward should say *what*, not *how*.

<details>
<summary>✅ Full Answer</summary>

Capturing pieces is a *means* (a "how"), not the *goal* (the "what" = winning). If you reward captures, the agent may learn to **maximize captures even at the expense of winning** — e.g., grabbing material into a losing position, or avoiding winning sacrifices. The agent optimizes exactly what you reward, loopholes included.

**Rule:** the reward signal should tell the agent *what* you want achieved (win → +1, lose → −1), not *how* to achieve it. Knowledge about *how* (good openings, tactics) belongs in the initial policy or value function, never in the reward.
</details>

---

## 🔢 Math / Worked

### 3.4 — Compute a discounted return
Rewards after time $t$ are $R_{t+1}=2, R_{t+2}=0, R_{t+3}=1, R_{t+4}=3$, then the episode ends. With $\gamma = 0.5$, compute $G_t$. Then verify using the recursion $G_t = R_{t+1} + \gamma G_{t+1}$.

💡 **Hint:** Compute the last return first and work backward.

<details>
<summary>✅ Full Answer</summary>

Direct sum:
$$G_t = 2 + 0.5(0) + 0.5^2(1) + 0.5^3(3) = 2 + 0 + 0.25 + 0.375 = 2.625$$

Recursive check (work backward; after $R_{t+4}$ episode ends so $G_{t+4}=0$):
- $G_{t+3} = R_{t+4} + 0.5\,G_{t+4} = 3 + 0 = 3$
- $G_{t+2} = R_{t+3} + 0.5\,G_{t+3} = 1 + 0.5(3) = 2.5$
- $G_{t+1} = R_{t+2} + 0.5\,G_{t+2} = 0 + 0.5(2.5) = 1.25$
- $G_t = R_{t+1} + 0.5\,G_{t+1} = 2 + 0.5(1.25) = 2.625$ ✅
</details>

---

### 3.5 — Infinite constant reward
An agent receives reward +1 on every step forever. Compute the return $G_t$ for (a) $\gamma = 0.9$, (b) $\gamma = 0.99$, (c) $\gamma = 0$. Interpret.

💡 **Hint:** Geometric series: $\sum_{k=0}^\infty \gamma^k = \frac{1}{1-\gamma}$.

<details>
<summary>✅ Full Answer</summary>

$G_t = \sum_{k=0}^\infty \gamma^k \cdot 1 = \frac{1}{1-\gamma}$.

- **(a) γ = 0.9:** $\frac{1}{0.1} = 10$.
- **(b) γ = 0.99:** $\frac{1}{0.01} = 100$. (More far-sighted → values future reward much more.)
- **(c) γ = 0:** $\frac{1}{1} = 1$. Only the immediate reward counts — a myopic agent.

Interpretation: γ controls the effective horizon. As γ → 1 the agent weighs distant rewards almost like immediate ones; γ = 0 makes it purely greedy for the next reward.
</details>

---

### 3.6 — Solve a 2-state Bellman system
A policy gives: in $s_1$, with prob 0.5 → reward 4 and go to terminal ($v=0$); with prob 0.5 → reward 0 and stay in $s_1$. With $\gamma = 0.9$, write and solve the Bellman equation for $v_\pi(s_1)$.

💡 **Hint:** Set up $v(s_1) = $ expected [reward + γ·value of next], with $v(s_1)$ on both sides.

<details>
<summary>✅ Full Answer</summary>

$$v_\pi(s_1) = 0.5\,[4 + 0.9 \cdot 0] + 0.5\,[0 + 0.9\, v_\pi(s_1)]$$
$$v_\pi(s_1) = 2 + 0.45\, v_\pi(s_1)$$
$$v_\pi(s_1)(1 - 0.45) = 2 \;\Rightarrow\; v_\pi(s_1) = \frac{2}{0.55} \approx 3.64$$

This is the power of the Bellman equation: an infinite-horizon expectation collapses into a small linear equation.
</details>

---

### 3.7 — Bellman expectation vs. optimality
Write both the Bellman *expectation* equation for $v_\pi$ and the Bellman *optimality* equation for $v_*$. Identify the single structural difference and explain why it makes the optimality equation nonlinear.

💡 **Hint:** One averages over actions; the other maximizes.

<details>
<summary>✅ Full Answer</summary>

Expectation:
$$v_\pi(s) = \sum_a \pi(a|s)\sum_{s',r} p(s',r|s,a)[r + \gamma v_\pi(s')]$$

Optimality:
$$v_*(s) = \max_a \sum_{s',r} p(s',r|s,a)[r + \gamma v_*(s')]$$

**Difference:** the policy-weighted average $\sum_a \pi(a|s)(\cdot)$ is replaced by $\max_a(\cdot)$.

**Why nonlinear:** the $\max$ operator is not a linear function of its inputs (it's piecewise-linear with kinks). So the optimality equations form a *nonlinear* system and generally can't be solved by linear algebra; we need iterative methods like value iteration (Chapter 4).
</details>

---

### 3.8 — From $q_*$ to $\pi_*$ with no model
Suppose you are handed $q_*(s, a)$ for all $s, a$. Give the optimal policy. Then explain why having $v_*$ (instead of $q_*$) would *not* be enough to act without a model.

💡 **Hint:** Greedy w.r.t. $q_*$ is trivial; greedy w.r.t. $v_*$ requires a one-step lookahead.

<details>
<summary>✅ Full Answer</summary>

With $q_*$: $\pi_*(s) = \arg\max_a q_*(s,a)$ — just pick the best action by table lookup. **No model needed.**

With only $v_*$: to choose the best action you must evaluate $\sum_{s',r} p(s',r|s,a)[r + \gamma v_*(s')]$ for each action — which **requires knowing the dynamics $p$** (where each action leads). Without a model you can't perform this lookahead. This is exactly why model-free control methods (Sarsa, Q-learning) learn *action* values $q$, not state values $v$.
</details>

---

## 💻 Code

### 3.9 — Represent and query an MDP
Write a small Python representation of the recycling-robot-style MDP as a dictionary `p[(s,a)] -> list of (prob, next_state, reward)`, and a function that computes the expected immediate reward $r(s,a)$ from it.

💡 **Hint:** Expected reward = $\sum$ prob × reward over all outcomes.

<details>
<summary>✅ Full Answer</summary>

```python
# Toy 2-state MDP: states 'high'/'low', actions 'search'/'wait'
p = {
    ('high', 'search'): [(0.7, 'high', 2.0), (0.3, 'low',  2.0)],
    ('high', 'wait'):   [(1.0, 'high', 0.5)],
    ('low',  'search'): [(0.6, 'low',  2.0), (0.4, 'high', -3.0)],  # 0.4 -> battery died
    ('low',  'wait'):   [(1.0, 'low',  0.5)],
}

def expected_reward(s, a):
    return sum(prob * reward for (prob, _s2, reward) in p[(s, a)])

def transition_prob(s, a, s2):
    return sum(prob for (prob, ns, _r) in p[(s, a)] if ns == s2)

print(expected_reward('low', 'search'))   # 0.6*2 + 0.4*(-3) = 1.2 - 1.2 = 0.0
print(transition_prob('high', 'search', 'low'))  # 0.3
```

Each `(state, action)` maps to a list of weighted outcomes — this is the four-argument dynamics $p(s',r|s,a)$ in code form. From it you can derive expected rewards and transition probabilities, which is all dynamic programming (Chapter 4) needs.
</details>

---

➡️ Next: [Chapter 4 — Dynamic Programming exercises](04-dynamic-programming-exercises.md)
