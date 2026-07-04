# 3.4 — The Bellman Equation

> **Chapter 3: Finite Markov Decision Processes** · Book section: §3.5 (second half)
> Previous: [3.3 — Policies and Value Functions](03-03-policies-and-value-functions.md) · Next: [3.5 — Optimal Policies and Optimal Value Functions](03-05-optimal-policies-and-value-functions.md)

---

## 🌱 The Big Picture

If you learn **one equation** from this book, make it this one. The **Bellman equation** expresses the fundamental recursive structure of value functions: *the value of a state = expected immediate reward + discounted value of the next state.* Dynamic programming (Ch. 4), TD learning (Ch. 6), Q-learning — all are ways of (approximately) solving Bellman equations.

---

## 🧮 Deriving it (gently)

Start from two facts you already know:

1. The return is recursive: $G_t = R_{t+1} + \gamma G_{t+1}$
2. The value is an expectation: $v_\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]$

Substitute (1) into (2):

$$v_\pi(s) = \mathbb{E}_\pi[R_{t+1} + \gamma G_{t+1} \mid S_t = s] = \mathbb{E}_\pi[R_{t+1} + \gamma\, v_\pi(S_{t+1}) \mid S_t = s]$$

Now expand the expectation over everything random — the action (chosen by π), and the next state & reward (chosen by the environment's dynamics $p$):

$$\boxed{\;v_\pi(s) = \sum_a \pi(a|s) \sum_{s'} \sum_{r} p(s', r \mid s, a)\,\Big[r + \gamma\, v_\pi(s')\Big]\;}$$

This is the **Bellman equation for $v_\pi$**.

### How to read it out loud 🗣️

> "The value of state $s$ is: average over actions I might take (weighted by my policy), then average over next states and rewards the environment might give (weighted by the dynamics), of the immediate reward plus the discounted value of where I end up."

It's a **weighted average over all one-step futures**, where each future contributes its reward plus the discounted value of its successor state.

---

## 🌳 Backup diagrams — the book's visual language

The book draws these relationships as **backup diagrams**. For $v_\pi$:

```text
            (s)            ← open circle = a state
           / | \
          a  a  a          ← policy π chooses among actions
         (•) (•) (•)       ← solid circle = a state–action pair
        / |   |   | \
       r  r   r   r  r     ← environment chooses next state & reward
     (s') (s') (s') (s')
```

Value information gets **backed up** from the leaf nodes (future states) to the root (current state). Every algorithm in this book has a backup diagram showing *which* future values it uses to update *which* current value.

### The Bellman equation for $q_\pi$

$$q_\pi(s,a) = \sum_{s'} \sum_{r} p(s', r \mid s, a)\Big[r + \gamma \sum_{a'} \pi(a' \mid s')\, q_\pi(s', a')\Big]$$

Same idea: action value = expected reward + discounted (policy-averaged) value of the next state–action pair.

---

## 🔢 A tiny worked example

Two states. In state $s_1$, policy always takes action that leads: 50% to $s_2$ with reward 2, 50% stays in $s_1$ with reward 0. In $s_2$ everything terminates with reward 0 ($v(s_2)=0$). Let γ = 0.9. Bellman equation at $s_1$:

$$v_\pi(s_1) = 0.5\,[2 + 0.9 \cdot 0] + 0.5\,[0 + 0.9 \cdot v_\pi(s_1)]$$

$$v_\pi(s_1) = 1 + 0.45\, v_\pi(s_1) \;\;\Rightarrow\;\; v_\pi(s_1) = \frac{1}{0.55} \approx 1.82$$

🪄 Notice what happened: the Bellman equation turned the *infinite* sum over futures into a small **system of linear equations** — one equation per state, one unknown per state. For a finite MDP with known dynamics, $v_\pi$ is the **unique solution** of this system. (Chapter 4 solves it iteratively.)

---

## 💡 Why this matters so much

- The Bellman equation is a **consistency condition**: a candidate value function is correct *if and only if* it satisfies the equation in every state.
- Almost every RL algorithm = pick some way to push estimated values toward satisfying a Bellman equation:
  - **Dynamic programming (Ch. 4):** sweep through all states applying the equation exactly (needs the model $p$).
  - **TD learning (Ch. 6):** sample one transition and nudge $V(S_t)$ toward $R_{t+1} + \gamma V(S_{t+1})$ (no model needed!).
- Value functions decompose a lifetime optimization problem into **local, one-step relationships** — that's the magic.

---

## 🎯 Key Takeaways

1. **Bellman equation:** $v_\pi(s) = \sum_a \pi(a|s) \sum_{s',r} p(s',r|s,a)[r + \gamma v_\pi(s')]$ — value now = expected reward + discounted value next.
2. It's an **averaging over all one-step futures**, visualized by backup diagrams.
3. For finite MDPs it gives a linear system whose **unique solution is $v_\pi$**.
4. RL algorithms ≈ approximate Bellman-equation solvers. Keep this lens for the whole book.

---

➡️ **Next:** [3.5 — Optimal Policies and Optimal Value Functions](03-05-optimal-policies-and-value-functions.md) — from evaluating a given policy to finding the *best* one: $v_*$, $q_*$, and the Bellman **optimality** equation.
