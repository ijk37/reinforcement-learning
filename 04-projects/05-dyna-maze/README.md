# Project 5 — Dyna-Q on a Maze 🐭

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [8.1 models & planning](../../01-notes/08-01-models-and-planning.md), [8.2 Dyna-Q](../../01-notes/08-02-dyna-q.md)

## What this shows
Planning = replaying a learned model through the same Q-learning update. By doing `n` simulated updates per real step, the agent **propagates the goal's value backward between real moves**, dramatically cutting the real experience needed.

## Run it
```bash
python dyna_maze.py
```
Prints steps-to-goal per episode for `n_plan ∈ {0, 5, 50}` (0 = plain Q-learning). Saves `dyna_steps.png` if matplotlib is present.

## What to look for
- **n=0** (no planning): early episodes take hundreds of steps.
- **n=5**: noticeably faster.
- **n=50**: near-optimal within a handful of episodes — memory + compute converted into sample efficiency.

## Experiments to try
1. Flip on **Dyna-Q+** (`plus=True` in `dyna_q`) and change the maze mid-run (move a wall to open a shortcut). The √τ exploration bonus drives the agent to rediscover the changed region; plain Dyna-Q may never notice.
2. Compare wall-clock vs. episodes — planning costs compute per real step; is it "free"? (No — but it's usually worth it when real steps are expensive.)
3. Swap uniform planning for **prioritized sweeping** (queue updates by TD-error magnitude, sweep predecessors) and count updates to convergence.
