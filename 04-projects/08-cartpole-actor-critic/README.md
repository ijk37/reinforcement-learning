# Project 8 — CartPole: REINFORCE & Actor–Critic 🎯

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [13.2 policy gradient theorem](../../01-notes/13-02-policy-gradient-theorem.md), [13.3 REINFORCE & baseline](../../01-notes/13-03-reinforce-and-baseline.md), [13.4 actor–critic](../../01-notes/13-04-actor-critic-and-continuous-actions.md)

## What this shows
**Policy-gradient** control — learning a parameterized policy directly instead of deriving it from action values. Two algorithms on a self-contained CartPole:
- **REINFORCE with baseline** (Monte Carlo policy gradient), and
- **One-step Actor–Critic** (the bootstrapped TD error drives the actor).

Gradients for the softmax policy and value function are derived **by hand** — no PyTorch/TensorFlow, just numpy. Features are **degree-2 polynomials** (normalized state + squares + interactions); a purely linear value function is too weak for the bootstrapped actor–critic critic, but these features make both methods learn.

## Files
- `cartpole.py` — classic CartPole physics, no `gym` needed.
- `reinforce_actor_critic.py` — both learners + comparison.

## Run it
```bash
python reinforce_actor_critic.py                  # runs both
python reinforce_actor_critic.py --algo ac --episodes 800
```
Prints learning summaries; saves `cartpole_learning.png` if matplotlib is present.

## What to look for
- Returns climb from ~10–20 (pole falls fast) toward the cap (500) as the policy improves.
- **Actor–Critic** is online (updates every step) and typically smoother; **REINFORCE** is higher-variance (full-episode returns) but unbiased.
- Try removing the baseline (use `delta = Gs[t]` in `reinforce`) to *feel* the variance increase.

## Notes & experiments
- Degree-2 polynomial features keep this dependency-free yet expressive enough to learn (typically ~470/500 for REINFORCE, ~380/500 for actor–critic over 500 episodes). Learning is still a bit noisy — average over seeds or raise `--episodes` for smoother curves.
1. Swap the linear policy for a small **neural net** (one hidden layer) to boost performance.
2. Add **entropy regularization** to the actor to maintain exploration.
3. Extend the actor to a **Gaussian policy** and try a continuous-action task (Chapter 13.7).
