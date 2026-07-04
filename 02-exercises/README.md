# 🏋️ Reinforcement Learning — Exercises

<div align="center" markdown>

![Reinforcement Learning](../assets/banner.svg)

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

<img src="https://img.shields.io/badge/02_·_Exercises-17_sets-10B981?style=for-the-badge&labelColor=0A8F68" alt="Exercises">

[Home](../index.md) &nbsp;|&nbsp; [Notes](../01-notes/README.md) &nbsp;|&nbsp; [Quiz Hub](../03-quiz/) &nbsp;|&nbsp; [Projects](../04-projects/README.md) &nbsp;|&nbsp; [Resources](../05-resources/README.md)

</div>

Practice problems for every chapter of **_Reinforcement Learning: An Introduction_ (2nd ed.)** by Sutton & Barto, paired with the [study notes](../01-notes/README.md).

Each chapter file mixes **conceptual/descriptive questions**, **math-by-hand problems**, and **small coding tasks**. Every exercise follows the same format:

- **💡 Hint** — a visible nudge to get you unstuck. Read it *after* thinking, *before* giving up.
- **✅ Full Answer** — a collapsible `<details>` block with the complete, worked solution. **Try the problem first**, then expand to check.

> **How to study:** attempt the question cold → peek at the hint only if stuck → write your answer → expand the full answer and compare. For coding tasks, run your version before reading the solution.

---

## 📚 Chapter index

### Part 0 — Foundations
- [Chapter 1 — Introduction](01-introduction-exercises.md)
- [Chapter 2 — Multi-armed Bandits](02-bandits-exercises.md)

### Part I — Tabular Solution Methods
- [Chapter 3 — Finite MDPs](03-mdps-exercises.md)
- [Chapter 4 — Dynamic Programming](04-dynamic-programming-exercises.md)
- [Chapter 5 — Monte Carlo Methods](05-monte-carlo-exercises.md)
- [Chapter 6 — Temporal-Difference Learning](06-temporal-difference-exercises.md) ⭐
- [Chapter 7 — n-step Bootstrapping](07-n-step-bootstrapping-exercises.md)
- [Chapter 8 — Planning and Learning](08-planning-and-learning-exercises.md)

### Part II — Approximate Solution Methods
- [Chapter 9 — On-policy Prediction with Approximation](09-on-policy-prediction-approximation-exercises.md)
- [Chapter 10 — On-policy Control with Approximation](10-on-policy-control-approximation-exercises.md)
- [Chapter 11 — Off-policy Methods with Approximation](11-off-policy-approximation-exercises.md)
- [Chapter 12 — Eligibility Traces](12-eligibility-traces-exercises.md)
- [Chapter 13 — Policy Gradient Methods](13-policy-gradient-exercises.md) ⭐

### Part III — Looking Deeper
- [Chapter 14 — Psychology](14-psychology-exercises.md)
- [Chapter 15 — Neuroscience](15-neuroscience-exercises.md)
- [Chapter 16 — Applications and Case Studies](16-applications-exercises.md)
- [Chapter 17 — Frontiers](17-frontiers-exercises.md)

---

## ✅ Recommended order

Work the exercises **right after** reading the matching notes chapter — while the ideas are fresh. The coding tasks build on each other:

```text
bandit (ε-greedy/UCB)  →  tabular Q-learning/Sarsa  →  Dyna-Q  →
tile-coded Sarsa (Mountain Car)  →  DQN  →  REINFORCE → actor–critic
```

If you implement that chain end-to-end, you'll have re-derived most of modern RL by hand.

---

## 🧭 The one question to ask about every algorithm

> *How does it evaluate? How does it improve? Does it bootstrap? Does it need a model? On-policy or off-policy?*

Most exercises are secretly checking whether you can answer these five for the method at hand.

---

> Companion to the [notes](../01-notes/README.md). Equations render on GitHub via LaTeX (`$…$`); answers are hidden in collapsible `<details>` blocks so you can self-test.
