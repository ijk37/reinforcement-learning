# Project 4 — TD Control: Cliff Walking & Windy Gridworld 🧗🌬️

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [6.3 Sarsa](../../01-notes/06-03-sarsa-on-policy-td-control.md), [6.4 Q-learning & Expected Sarsa](../../01-notes/06-04-q-learning-and-expected-sarsa.md)

## What this shows
The single most illuminating comparison in tabular RL: **Sarsa (on-policy) vs. Q-learning (off-policy)** on Cliff Walking. Q-learning learns the *optimal* path hugging the cliff; Sarsa learns a *safer* detour because it accounts for the fact that it still explores. Plus Windy Gridworld, where online TD control thrives even though some policies never terminate.

## Run it
```bash
python td_control.py
```
Prints ASCII maps of each agent's greedy path and average returns; saves `cliff_returns.png` if matplotlib is present.

## What to look for
- **Sarsa's path** stays a row away from the cliff; **Q-learning's path** runs along the very edge.
- Q-learning's *online* return is typically **worse** (those ε-greedy steps occasionally plunge off the cliff for −100), even though its *learned* policy is optimal — the key on-policy/off-policy lesson.
- In Windy Gridworld, the greedy path visibly "aims low" and lets the wind carry it up to the goal.

## Experiments to try
1. Add **Expected Sarsa** (target `r + γ·Σ_a π(a|s')·Q[s'][a]`) and confirm it's smoother than Sarsa and can use larger α.
2. **Decay ε** toward 0 and watch Sarsa's path converge to Q-learning's optimal path.
3. Add King's-move (8 actions) wind, as in Exercise 6.9, and see the path shorten.
