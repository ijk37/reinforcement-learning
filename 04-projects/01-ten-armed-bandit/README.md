# Project 1 — The 10-armed Testbed 🎰

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [2.2 action-value methods](../../01-notes/02-02-action-value-methods.md), [2.4 optimistic init & UCB](../../01-notes/02-04-optimistic-initial-values-and-ucb.md), [2.5 gradient bandits](../../01-notes/02-05-gradient-bandit-algorithms.md)

## What this shows
The exploration–exploitation trade-off in its purest form. We generate many random 10-armed bandit problems and compare five strategies head-to-head — exactly the experiments behind Chapter 2's famous figures.

## Run it
```bash
python bandits.py                 # default: 300 runs × 1000 steps
python bandits.py --runs 2000 --steps 1000   # closer to the book's figures
```
Prints a summary table and, if matplotlib is installed, saves `bandit_results.png` (average reward + % optimal action over time).

## What to look for
- **Greedy (ε=0)** improves fastest at first, then plateaus low — it gets stuck.
- **ε=0.1** finds the best arm quickly; **ε=0.01** is slower but eventually higher.
- **Optimistic init** explores early *with no ε* and often wins early — but only helps at the start.
- **UCB** usually edges out ε-greedy by exploring where it's most uncertain.
- **Gradient bandit** learns preferences via softmax + a reward baseline.

## Experiments to try
1. Remove the baseline in `GradientBandit` (`baseline=False`) and add +4 to every `q_true` — watch performance collapse without the baseline.
2. Make the problem **nonstationary**: have `q_true` drift each step (`q_true += rng.normal(0, 0.01, k)`) and compare sample-average (`alpha=None`) vs. constant `alpha=0.1`.
3. Sweep ε, c, α and plot a "parameter study" (inverted-U curves).
