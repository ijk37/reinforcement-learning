# Project 3 — Blackjack with Monte Carlo 🃏

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [5.1 MC prediction](../../01-notes/05-01-monte-carlo-prediction.md), [5.2 MC control & exploring starts](../../01-notes/05-02-mc-action-values-and-exploring-starts.md)

## What this shows
Why Monte Carlo is special: it learns **purely from simulated games** with no knowledge of transition probabilities. We run MC control with **exploring starts** to learn a near-optimal Blackjack policy — and it reproduces the structure of the famous "basic strategy" chart.

## Run it
```bash
python blackjack_mc.py                     # 200k episodes
python blackjack_mc.py --episodes 500000   # crisper policy
```
Pure numpy. Prints the learned hit/stick grid and win/draw/loss rates.

## What to look for
- The learned policy says **stick on high sums, hit on low sums**, with the threshold depending on the dealer's card — matching known optimal play.
- The win rate stays below 50% — Blackjack genuinely favors the dealer, so even optimal play loses on net. The point is that MC *found* the best achievable policy from experience alone.

## Experiments to try
1. Switch to **MC prediction**: fix the policy "stick on 20–21, else hit" and average returns to estimate the value surface (Example 5.1).
2. Replace exploring starts with an **ε-soft** policy (Chapter 5.3) — no forced random first action — and compare.
3. Add the **usable-ace** grid printout and compare it to the no-ace grid; the strategies differ noticeably.
