# 🚀 Reinforcement Learning — Projects

<div align="center" markdown>

![Reinforcement Learning](../assets/banner.svg)

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

<img src="https://img.shields.io/badge/04_·_Projects-8_labs-7C6CF0?style=for-the-badge&labelColor=5B4BD6" alt="Projects">

[Home](../index.md) &nbsp;|&nbsp; [Notes](../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../03-quiz/) &nbsp;|&nbsp; [Resources](../05-resources/README.md)

</div>

Hands-on, **runnable** projects that bring the [notes](../01-notes/README.md) and [exercises](../02-exercises/README.md) to life. Each project is self-contained, implements its environment from scratch (no `gym`/`gymnasium` needed), and runs on **numpy alone** — `matplotlib` is optional (scripts print results and only plot if it's installed).

> Everything runs offline on Windows/macOS/Linux. The projects follow the book's arc, from the simplest bandit to policy-gradient control.

---

## Setup

```bash
pip install -r requirements.txt        # numpy (required), matplotlib (optional)
```

Run any project from its own folder, e.g.:

```bash
cd 01-ten-armed-bandit
python bandits.py
```

---

## The projects

| # | Project | Concept | Chapters | Key file |
|---|---------|---------|----------|----------|
| 1 | [Ten-armed Testbed](01-ten-armed-bandit/README.md) | exploration vs. exploitation; ε-greedy, UCB, optimistic init, gradient bandit | 2 | `bandits.py` |
| 2 | [Gridworld DP](02-gridworld-dp/README.md) | policy evaluation, policy iteration, value iteration | 3–4 | `gridworld_dp.py` |
| 3 | [Blackjack Monte Carlo](03-blackjack-monte-carlo/README.md) | model-free prediction & control from simulated episodes | 5 | `blackjack_mc.py` |
| 4 | [Cliff & Windy TD](04-cliff-and-windy-td/README.md) | Sarsa vs. Q-learning; on-policy vs. off-policy | 6 | `td_control.py` |
| 5 | [Dyna Maze](05-dyna-maze/README.md) | integrating planning, acting & learning (Dyna-Q / Q+) | 8 | `dyna_maze.py` |
| 6 | [Mountain Car (tile coding)](06-mountain-car-tilecoding/README.md) | linear function approximation, semi-gradient Sarsa | 9–10 | `mountain_car_sarsa.py` |
| 7 | [Random Walk TD(λ)](07-random-walk-td-lambda/README.md) | bias–variance: n-step & eligibility traces | 6,7,12 | `td_lambda.py` |
| 8 | [CartPole Actor–Critic](08-cartpole-actor-critic/README.md) | policy gradients: REINFORCE & actor–critic | 13 | `reinforce_actor_critic.py` |

---

## Suggested path

Work them **in order** — each introduces one new idea on top of the last:

```text
1 bandit (no states)
2 DP (model known)            ─┐
3 Monte Carlo (model-free)     │  tabular
4 TD control (online)          │
5 Dyna (planning + learning)  ─┘
6 function approximation      ─┐
7 eligibility traces / n-step  │  scaling up
8 policy gradients            ─┘
```

By the end you'll have implemented, by hand, a representative method from every major family in the book.

## Notes on running
- All scripts default to **modest workloads** so they finish quickly; flags like `--episodes`, `--runs`, `--steps` let you scale up toward the book's figures.
- Project 5 (Dyna with 50 planning steps) is the most compute-heavy; give it a minute.
- If `matplotlib` is missing, every script still runs and prints its results — install it to also get saved `.png` plots.

---

## Where to go next
- Reproduce the book's actual figures (more runs/seeds, full parameter sweeps).
- Swap linear policies/values for small **neural networks** (Project 8) → you're one step from DQN and A2C.
- Study modern algorithms that build directly on these: **DQN** (Project 4 + replay + target net), **PPO/A2C/SAC** (Project 8), **AlphaZero/MuZero** (Projects 5 + 8 + MCTS).

> Companion to the [notes](../01-notes/README.md) and [exercises](../02-exercises/README.md). Same five questions apply to every algorithm here: *evaluate? improve? bootstrap? model? on- or off-policy?*
