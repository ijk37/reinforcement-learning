# 2.1 — The k-armed Bandit Problem

> **Chapter 2: Multi-armed Bandits** · Book section: §2.1
> Previous: [1.3 — Tic-Tac-Toe](01-03-tic-tac-toe-example.md) · Next: [2.2 — Action-value Methods](02-02-action-value-methods.md)

---

## 🌱 The Big Picture

Full RL is hard because actions affect *future situations*. So Chapter 2 deliberately studies a **simplified setting with only one situation** — no states changing, no delayed consequences — to isolate one thing: **how to balance exploration and exploitation using evaluative feedback.**

> **Evaluative feedback** says *how good* your action was ("you got 7 points").
> **Instructive feedback** says *which* action was correct ("you should have picked B").
> RL uses evaluative feedback — this is what makes exploration necessary.

---

## 🎰 The Problem

Imagine a slot machine ("one-armed bandit") with **k levers** instead of one:

- On each **time step** you choose one of $k$ **actions** (pull one lever).
- You receive a numerical **reward** drawn from a probability distribution that depends on which lever you pulled.
- Goal: **maximize total reward over some period**, say 1000 pulls.

**Real-world versions of this exact problem:**
- 🩺 A doctor choosing among experimental treatments for a stream of patients (reward = patient outcome).
- 📰 A website choosing which headline/ad to show (reward = click).
- ☕ You choosing a coffee shop every morning.

---

## 📐 Formal Setup

- Action chosen at time $t$: $A_t$. Reward received: $R_t$.
- Each action $a$ has a true **expected reward**, called its **value**:

$$q_*(a) \doteq \mathbb{E}[R_t \mid A_t = a]$$

Read it as: *"q-star of a is the expected reward given that we pick action a."*

- **If you knew $q_*(a)$ for every action, the problem would be trivial** — always pick the highest. The whole problem exists because you **don't** know the values; you only have **estimates**, written $Q_t(a)$, which we want to drive close to $q_*(a)$.

### Greedy actions, exploration, exploitation

At any time $t$ there is at least one action whose *estimated* value is largest — the **greedy action(s)**.

- Choosing a greedy action = **exploiting** your current knowledge.
- Choosing a non-greedy action = **exploring** (improving your estimate of that action's value).

> Exploitation maximizes expected reward **on this one step**; exploration may produce greater **total** reward in the long run. You cannot do both on a single pull — this is the **conflict** between exploration and exploitation.

**Example intuition 🧠:** Suppose the greedy action's estimated value is known precisely, while several other actions are estimated nearly as good but with high *uncertainty*. One of those uncertain actions is probably actually *better* than the greedy one — but you don't know which. If you have many pulls remaining, exploring them likely pays off.

---

## 🎯 Key Takeaways

1. The k-armed bandit = repeated choice among $k$ actions, each with an unknown reward distribution; **one state, no delayed effects**.
2. True value: $q_*(a) = \mathbb{E}[R_t \mid A_t=a]$. Estimate: $Q_t(a)$. Learning = making $Q_t \to q_*$.
3. Greedy = exploit; non-greedy = explore. Balancing them is the core difficulty.
4. Everything in this chapter transfers to full RL later — bandit-style action selection happens *inside every state* of a real RL problem.

---

➡️ **Next:** [2.2 — Action-value Methods](02-02-action-value-methods.md) — the simplest way to estimate $q_*(a)$ and act on the estimates: sample averages and ε-greedy.
