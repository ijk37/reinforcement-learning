# Project 2 — Gridworld Dynamic Programming 🗺️

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [4.1 policy evaluation](../../01-notes/04-01-policy-evaluation.md), [4.2 policy iteration](../../01-notes/04-02-policy-improvement-and-policy-iteration.md), [4.3 value iteration](../../01-notes/04-03-value-iteration.md)

## What this shows
With a **known model**, you can compute optimal behavior exactly. This implements all three DP algorithms on the 4×4 gridworld (Example 4.1) and verifies that policy iteration and value iteration reach the same answer.

## Run it
```bash
python gridworld_dp.py
```
Pure numpy, no plotting. Prints value grids and arrow-policies to the terminal.

## What to look for
- The **random policy's** values match the book's pattern (0, −14, −20, −22 …) — it's the negated expected number of steps to reach a terminal corner under random walking.
- **Policy iteration** converges in just a few improvement steps.
- **Value iteration** recovers the same optimal values and the "head to the nearest corner" policy.
- The final `assert` confirms both methods agree.

## Experiments to try
1. Add discounting (`GAMMA = 0.9`) and watch values shrink toward 0 far from terminals.
2. Print `V` after each sweep of **value iteration** to watch information propagate outward from the corners (the "1 sweep = all states −1" effect from the note).
3. Add a special high-reward teleport state and re-derive the optimal policy.
