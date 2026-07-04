# 3.3 — Policies and Value Functions

> **Chapter 3: Finite Markov Decision Processes** · Book section: §3.5 (first half)
> Previous: [3.2 — Goals, Rewards, and Returns](03-02-goals-rewards-and-returns.md) · Next: [3.4 — The Bellman Equation](03-04-bellman-equations.md)

---

## 🌱 The Big Picture

We now define the two central objects of all of RL — the **policy** (how the agent behaves) and the **value functions** (how good states and actions are *under that behavior*). Nearly every algorithm in this book is a way of estimating value functions.

---

## 🧭 Policy

A **policy** $\pi$ is a mapping from states to probabilities of selecting each action:

$$\pi(a \mid s) \doteq \Pr\{A_t = a \mid S_t = s\}$$

- *"If the agent is following policy π at time t, then π(a|s) is the probability it picks action a in state s."*
- A **deterministic** policy is the special case where one action gets probability 1; we then write $a = \pi(s)$.
- RL methods specify how the policy **changes with experience**.

**Example 🤖:** the recycling robot might have π(`search` | `high`) = 0.9, π(`wait` | `high`) = 0.1, π(`recharge` | `low`) = 1.0.

---

## 💎 State-value function $v_\pi$

> *"How good is it to be in state s, if I follow policy π from here on?"*

$$v_\pi(s) \doteq \mathbb{E}_\pi[G_t \mid S_t = s] = \mathbb{E}_\pi\!\left[\sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \,\Big|\, S_t = s\right]$$

- $\mathbb{E}_\pi[\cdot]$ = expected value **given the agent follows π**.
- The value of any terminal state is 0 (no future rewards).
- $v_\pi$ is called the **state-value function for policy π**.

## 💎 Action-value function $q_\pi$

> *"How good is it to take action a in state s, and follow π afterwards?"*

$$q_\pi(s, a) \doteq \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]$$

- Called the **action-value function for policy π**; this is the "Q" in **Q-learning**.
- Difference from $v_\pi$: the first action is *forced* to be $a$ (maybe an action π would never choose!); only afterwards do we follow π.
- Relationship: $v_\pi(s) = \sum_a \pi(a|s)\, q_\pi(s,a)$ — the state's value is the policy-weighted average of its action values.

### 🤔 Why do we need *both*?

- With $v_\pi$ alone, choosing the best action requires knowing the environment dynamics (you must look one step ahead: "which action leads to the best states?").
- With $q_\pi$, the best action is just $\arg\max_a q(s,a)$ — **no model needed**. That's why model-free control methods (Monte Carlo, Sarsa, Q-learning) work with action values.

---

## 📏 Estimating values from experience

Value functions can be **estimated from experience** — this is what most of the book is about:

- **Monte Carlo way (Ch. 5):** keep averages of the *actual returns* that followed each state. As visits → ∞, the average → $v_\pi(s)$.
- **Function approximation way (Ch. 9+):** too many states to average each one? Maintain $v_\pi$ as a parameterized function (e.g., a neural net) and adjust parameters to match observed returns.

---

## 🗺️ Worked example: Gridworld (from the book, Example 3.5)

A 5×5 grid; actions = north/south/east/west; moving off the grid = reward −1 and stay put; all other moves = reward 0, **except**:

- From special state **A**: any action → reward **+10**, teleport to A′ (bottom of A's column).
- From special state **B**: any action → reward **+5**, teleport to B′.

Computing $v_\pi$ for the **equiprobable random policy** (γ = 0.9) reveals the magic of value functions:

- $v_\pi(A) \approx 8.8$, which is **less than 10** — because the teleport drops you near the bottom edge where bumping into walls (−1) is likely. The value accounts for *future consequences*.
- $v_\pi(B) \approx 5.3$, **more than 5** — the teleport to B′ lands somewhere decent, adding future value on top of the immediate +5.
- States near the bottom edge have **negative** values: the random policy keeps bumping into walls.

> 💡 This is the essence of value functions: they blend **immediate rewards** and **discounted future prospects** into one number per state.

---

## 🎯 Key Takeaways

1. Policy: $\pi(a|s)$ = probability of action $a$ in state $s$.
2. $v_\pi(s) = \mathbb{E}_\pi[G_t | S_t{=}s]$: expected return from $s$ **under π**.
3. $q_\pi(s,a) = \mathbb{E}_\pi[G_t | S_t{=}s, A_t{=}a]$: expected return taking $a$ first, then following π.
4. $v_\pi(s) = \sum_a \pi(a|s) q_\pi(s,a)$; action values let you pick actions *without a model*.
5. Values ≠ rewards: a state with a big immediate reward can have modest value, and vice versa.

---

➡️ **Next:** [3.4 — The Bellman Equation](03-04-bellman-equations.md) — the recursive relationship that value functions satisfy, and the foundation of nearly every RL algorithm.
