# 📚 Reinforcement Learning — Study Notes

<div align="center" markdown>

![Reinforcement Learning](../assets/banner.svg)

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

<img src="https://img.shields.io/badge/01_·_Notes-17_chapters-0C93A8?style=for-the-badge&labelColor=076576" alt="Notes">

[Home](../index.md) &nbsp;|&nbsp; [Exercises](../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../03-quiz/) &nbsp;|&nbsp; [Projects](../04-projects/README.md) &nbsp;|&nbsp; [Resources](../05-resources/README.md)

</div>

Beginner-friendly, chapter-wise notes for **_Reinforcement Learning: An Introduction_ (2nd edition)** by **Richard S. Sutton & Andrew G. Barto**.

These notes aim to sit in the sweet spot: **more explanatory than a cheat sheet, gentler than the textbook**. Each note has intuition, worked examples, the essential math (explained, not just stated), and "key takeaways." Read them in order — they build on each other and link forward/back.

> **Naming:** `xx-yy-topic.md` where `xx` = chapter number, `yy` = concept order within the chapter.

---

## 🗺️ How to use these notes

1. **Go in order.** RL is cumulative — the Bellman equation (3.4) underlies almost everything after it.
2. **Don't skip the worked examples.** Tic-tac-toe, the 10-armed testbed, gridworlds, the cliff, Mountain Car — each one makes an abstract idea concrete.
3. **Re-derive the boxed equations** by hand once. Especially: $G_t = R_{t+1} + \gamma G_{t+1}$, the Bellman equations, and the TD update.
4. **Code as you go.** The notes flag what to implement; building the algorithms is how it sticks.

---

## Part 0 — Foundations

### Chapter 1 · Introduction
- [1.1 — What is Reinforcement Learning?](01-01-what-is-reinforcement-learning.md)
- [1.2 — Elements of RL](01-02-elements-of-rl.md)
- [1.3 — An Extended Example: Tic-Tac-Toe](01-03-tic-tac-toe-example.md)

### Chapter 2 · Multi-armed Bandits
- [2.1 — The k-armed Bandit Problem](02-01-k-armed-bandit-problem.md)
- [2.2 — Action-value Methods (sample averages, ε-greedy)](02-02-action-value-methods.md)
- [2.3 — Incremental Implementation & Nonstationarity](02-03-incremental-implementation-and-nonstationarity.md)
- [2.4 — Optimistic Initial Values & UCB](02-04-optimistic-initial-values-and-ucb.md)
- [2.5 — Gradient Bandit Algorithms](02-05-gradient-bandit-algorithms.md)
- [2.6 — Contextual Bandits & Chapter Summary](02-06-contextual-bandits-and-summary.md)

---

## Part I — Tabular Solution Methods

### Chapter 3 · Finite Markov Decision Processes
- [3.1 — The Agent–Environment Interface](03-01-agent-environment-interface.md)
- [3.2 — Goals, Rewards, and Returns](03-02-goals-rewards-and-returns.md)
- [3.3 — Policies and Value Functions](03-03-policies-and-value-functions.md)
- [3.4 — The Bellman Equation](03-04-bellman-equations.md) ⭐
- [3.5 — Optimal Policies & Optimal Value Functions](03-05-optimal-policies-and-value-functions.md)

### Chapter 4 · Dynamic Programming
- [4.1 — Iterative Policy Evaluation](04-01-policy-evaluation.md)
- [4.2 — Policy Improvement & Policy Iteration](04-02-policy-improvement-and-policy-iteration.md)
- [4.3 — Value Iteration](04-03-value-iteration.md)
- [4.4 — Async DP, GPI & Efficiency](04-04-async-dp-gpi-and-efficiency.md)

### Chapter 5 · Monte Carlo Methods
- [5.1 — Monte Carlo Prediction](05-01-monte-carlo-prediction.md)
- [5.2 — MC Action Values & Exploring Starts](05-02-mc-action-values-and-exploring-starts.md)
- [5.3 — MC Control without Exploring Starts (ε-soft)](05-03-mc-control-without-exploring-starts.md)
- [5.4 — Off-policy Prediction via Importance Sampling](05-04-off-policy-prediction-importance-sampling.md)
- [5.5 — Off-policy MC Control & Summary](05-05-off-policy-mc-control-and-summary.md)

### Chapter 6 · Temporal-Difference Learning ⭐
- [6.1 — TD Prediction (TD(0))](06-01-td-prediction.md)
- [6.2 — Optimality of TD(0)](06-02-optimality-of-td0.md)
- [6.3 — Sarsa: On-policy TD Control](06-03-sarsa-on-policy-td-control.md)
- [6.4 — Q-learning & Expected Sarsa](06-04-q-learning-and-expected-sarsa.md)
- [6.5 — Maximization Bias & Double Learning](06-05-maximization-bias-and-double-learning.md)

### Chapter 7 · n-step Bootstrapping
- [7.1 — n-step TD Prediction](07-01-n-step-td-prediction.md)
- [7.2 — n-step Sarsa](07-02-n-step-sarsa.md)
- [7.3 — n-step Off-policy & Tree Backup](07-03-n-step-off-policy-and-tree-backup.md)

### Chapter 8 · Planning and Learning with Tabular Methods
- [8.1 — Models and Planning](08-01-models-and-planning.md)
- [8.2 — Dyna-Q](08-02-dyna-q.md)
- [8.3 — Prioritized Sweeping & Update Choices](08-03-prioritized-sweeping-and-update-choices.md)
- [8.4 — Trajectory Sampling & RTDP](08-04-trajectory-sampling-and-rtdp.md)
- [8.5 — Decision-time Planning & MCTS](08-05-decision-time-planning-and-mcts.md)

---

## Part II — Approximate Solution Methods

### Chapter 9 · On-policy Prediction with Approximation
- [9.1 — Value-function Approximation & the Objective](09-01-value-function-approximation.md)
- [9.2 — Gradient & Semi-gradient Methods](09-02-gradient-and-semi-gradient-methods.md)
- [9.3 — Linear Methods & the TD Fixed Point](09-03-linear-methods.md)
- [9.4 — Feature Construction (tile coding, Fourier…)](09-04-feature-construction.md)
- [9.5 — Nonlinear (ANNs), LSTD & Emphasis](09-05-nonlinear-and-other-methods.md)

### Chapter 10 · On-policy Control with Approximation
- [10.1 — Episodic Semi-gradient Control (Mountain Car)](10-01-episodic-semi-gradient-control.md)
- [10.2 — The Average-Reward Setting](10-02-average-reward-setting.md)

### Chapter 11 · Off-policy Methods with Approximation
- [11.1 — Off-policy Challenges & the Deadly Triad](11-01-off-policy-challenges-and-deadly-triad.md)
- [11.2 — Value-function Geometry & the Bellman Error](11-02-bellman-error-and-value-geometry.md)
- [11.3 — Gradient-TD & Emphatic-TD](11-03-gradient-td-and-emphatic-td.md)

### Chapter 12 · Eligibility Traces
- [12.1 — The λ-return](12-01-lambda-return.md)
- [12.2 — TD(λ) & Eligibility Traces](12-02-td-lambda.md)
- [12.3 — Online λ-return & True Online TD(λ)](12-03-true-online-td-lambda.md)
- [12.4 — Sarsa(λ) & Off-policy Traces](12-04-sarsa-lambda-and-off-policy-traces.md)

### Chapter 13 · Policy Gradient Methods ⭐
- [13.1 — Policy Approximation & Its Advantages](13-01-policy-approximation-and-advantages.md)
- [13.2 — The Policy Gradient Theorem](13-02-policy-gradient-theorem.md)
- [13.3 — REINFORCE & Baseline](13-03-reinforce-and-baseline.md)
- [13.4 — Actor–Critic & Continuous Actions](13-04-actor-critic-and-continuous-actions.md)

---

## Part III — Looking Deeper

### Chapter 14 · Psychology
- [14.1 — Classical Conditioning & the TD Model](14-01-classical-conditioning-and-td-model.md)
- [14.2 — Instrumental Conditioning, Habits & Goals](14-02-instrumental-conditioning-and-behavior.md)

### Chapter 15 · Neuroscience
- [15.1 — Dopamine & the Reward Prediction Error Hypothesis](15-01-dopamine-and-reward-prediction-error.md)
- [15.2 — Neural Actor–Critic & RL in the Brain](15-02-neural-actor-critic-and-brain-rl.md)

### Chapter 16 · Applications and Case Studies
- [16.1 — TD-Gammon, Atari/DQN & AlphaGo](16-01-applications-td-gammon-atari-alphago.md)

### Chapter 17 · Frontiers
- [17.1 — Frontiers and the Future of RL](17-01-frontiers-and-future.md)

---

## 🧭 The mental model to carry through everything

Almost every method in this book is an instance of **Generalized Policy Iteration (GPI)**:

```text
   ┌─────────── evaluation ───────────┐
   │   make the value function agree   │
 policy π  ◄────────────────────────►  value function V/Q
   │   make the policy greedy w.r.t.   │
   └────────── improvement ───────────┘
```

When you meet *any* new algorithm, ask: **"How does it evaluate? How does it improve? Does it bootstrap? Does it need a model? On-policy or off-policy?"** Those five questions place it on the map.

---

## 📖 Source
- Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press. Freely available from the authors.

> Notes written as a beginner-first study companion. Equations render on GitHub (LaTeX in `$…$`/`$$…$$`); diagrams use Mermaid where supported.
