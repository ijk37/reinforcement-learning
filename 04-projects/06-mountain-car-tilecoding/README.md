# Project 6 — Mountain Car with Tile Coding 🏔️🚙

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [9.4 feature construction](../../01-notes/09-04-feature-construction.md), [10.1 episodic semi-gradient control](../../01-notes/10-01-episodic-semi-gradient-control.md)

## What this shows
Control in a **continuous** state space using **linear function approximation** with **tile coding** and **semi-gradient Sarsa** (Example 10.1). The underpowered car can't climb directly — it must learn to swing backward first. Optimistic initialization (`w = 0`, true values negative) drives exploration with **no ε needed**.

## Files
- `tile_coding.py` — a minimal hashed tile coder (reusable).
- `mountain_car_sarsa.py` — the environment + agent + learning curve.

## Run it
```bash
python mountain_car_sarsa.py
```
Prints steps-to-goal over episodes; saves `mountaincar_learning.png` if matplotlib is present.

## What to look for
- Episode 1 takes thousands of steps (random flailing); within ~100 episodes it drops to ~100–150 steps.
- The solution is **counterintuitive**: the policy first accelerates *away* from the goal to build momentum — a vivid example of why far-sighted value functions beat greedy distance-reduction.

## Experiments to try
1. Vary the number of tilings (4, 8, 16) and tiles-per-dim; observe the speed/resolution trade-off.
2. Add **n-step semi-gradient Sarsa** and confirm intermediate n learns fastest (Chapter 10.2 / Figure 10.4).
3. Visualize the learned cost-to-go surface `−max_a q(s,a)` over (position, velocity) — you'll see the spiral structure of the optimal solution.
