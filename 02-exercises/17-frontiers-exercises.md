# Chapter 17 — Frontiers · Exercises

> Practice for note [17.1](../01-notes/17-01-frontiers-and-future.md).
> Open-ended — these are "think and discuss" questions about where RL is going.

---

## 🧠 Conceptual

### 17.1 — General Value Functions
What is a General Value Function (GVF), and why might learning many GVFs help even an agent that only cares about reward?

💡 **Hint:** Predict *any* signal; auxiliary tasks shape representations.

<details>
<summary>✅ Full Answer</summary>

A **GVF** generalizes the value function to predict the discounted accumulation of **any** signal (a "cumulant"), not just reward — e.g., "how much light will my sensor see?" or "how many steps until I bump a wall?" GVFs turn value learning into a general tool for **predictive knowledge** of the world.

**Why it helps reward-only agents:** learning many GVFs at once = many **auxiliary prediction tasks**. Even if you only care about reward, these tasks force the network to build **richer, more useful representations**, which accelerates and stabilizes learning of the main task. (A standard trick in modern deep RL: add auxiliary prediction heads.)
</details>

---

### 17.2 — Options and temporal abstraction
What is an "option," and what problem does temporal abstraction solve? What turns the MDP into when you use options?

💡 **Hint:** A sub-policy + termination condition; planning over extended actions.

<details>
<summary>✅ Full Answer</summary>

An **option** is a **temporally-extended action**: a sub-policy plus a **termination condition** (e.g., "navigate to the door, stop on arrival"). 

**Problem solved:** real agents must reason at **multiple timescales** — "make coffee" vs. "twitch a finger." Options let an agent plan and learn over **abstract, multi-step behaviors** instead of only primitive one-step actions, making long-horizon problems tractable.

Using options turns the MDP into a **semi-MDP** (decisions occur at variable time intervals). This is the foundation of **hierarchical RL**; automatically *discovering* useful options remains an open research problem.
</details>

---

### 17.3 — State construction and partial observability
Why is "constructing state from observations" one of RL's deepest open problems? Name two approaches.

💡 **Hint:** Reality gives observations, not Markov states.

<details>
<summary>✅ Full Answer</summary>

Most of the book *assumes* a good Markov state, but real agents receive a **stream of observations** that is usually **partially observable** — no single observation is a Markov state. The agent must *construct* an internal state that summarizes relevant history so the future depends only on it. This is hard and largely unsolved; good representations may be the whole ballgame.

Approaches: **recurrent neural networks** (carry a learned hidden state across time), **predictive state representations** (represent state by predictions about future observations), and **belief states** (probability distributions over hidden states, as in POMDP methods).
</details>

---

### 17.4 — The danger of reward design
Why is specifying reward both important and dangerous? Name two techniques that help, and connect this to AI safety.

💡 **Hint:** Misspecified reward → gamed proxy; shaping, intrinsic motivation, inverse RL.

<details>
<summary>✅ Full Answer</summary>

A powerful optimizer maximizes **exactly what you reward**, loopholes included — so a misspecified reward leads to unintended, sometimes harmful behavior (the agent "games" the proxy). Sparse rewards also make exploration brutally hard.

Techniques:
- **Reward shaping** (carefully, to avoid creating loopholes) to densify the signal.
- **Intrinsic motivation / curiosity** — reward novelty or learning progress to drive exploration when extrinsic reward is sparse.
- **Inverse RL / imitation** — *infer* the reward from expert demonstrations instead of hand-coding it.

**AI safety connection:** as agents become more capable and autonomous, a misspecified objective in a strong optimizer is a serious hazard — this is central to **alignment** research.
</details>

---

### 17.5 — Your learning roadmap (reflection)
Propose a concrete personal plan to consolidate everything: which algorithms to implement, in what order, and on what environments.

💡 **Hint:** Bandits → tabular → deep value → policy gradient → planning.

<details>
<summary>✅ Full Answer</summary>

A sensible progression (example):

1. **Bandits:** ε-greedy, UCB, gradient bandit on the 10-armed testbed (reproduce the book's figures).
2. **Tabular control:** Sarsa, Q-learning, Expected Sarsa, Double Q-learning on Gridworld / Cliff Walking / Windy Gridworld.
3. **Planning:** Dyna-Q and Dyna-Q+ on a maze (show the shortcut/blocking effects).
4. **Function approximation:** tile-coded semi-gradient Sarsa on **Mountain Car**.
5. **Deep value RL:** DQN (replay + target network) on CartPole, then an Atari game.
6. **Policy gradient:** REINFORCE → REINFORCE+baseline → one-step actor–critic (A2C) on CartPole; Gaussian-policy actor–critic on a continuous-control task (e.g., Pendulum).
7. **Modern algorithms:** read/implement PPO, SAC, and study AlphaZero/MuZero (learning + planning).

For every algorithm, apply the GPI lens: *What's the state, reward, policy, value function? Does it bootstrap? Need a model? On- or off-policy?* Coding each one is what makes the theory stick.
</details>

---

🏁 **You've finished the exercise set.** Revisit any chapter's questions before they're easy *without* peeking at the answers — that's the real test of mastery. See the [exercises index](README.md) or jump back to the [notes](../01-notes/README.md).
