---
hide:
  - navigation
---

# Reinforcement Learning

A beginner-to-mastery study companion to **_Reinforcement Learning: An Introduction_ (2nd ed.)** by **Sutton &amp; Barto** — organized as three tightly-linked layers: **read the theory → test yourself → run the code.**

<div class="rl-hero-grid" markdown>

[:octicons-book-16: Notes](01-notes/README.md){ .rl-card .rl-card-notes }

[:octicons-pencil-16: Exercises](02-exercises/README.md){ .rl-card .rl-card-exercises }

[:octicons-checklist-16: Quiz Hub](03-quiz/index.html){ .rl-card .rl-card-quiz }

[:octicons-tools-16: Projects](04-projects/README.md){ .rl-card .rl-card-projects }

[:octicons-archive-16: Resources](05-resources/README.md){ .rl-card .rl-card-resources }

</div>

## Course Flow

1. **Read** the chapter's notes in [01-notes](01-notes/README.md).
2. **Test yourself** with the matching set in [02-exercises](02-exercises/README.md) — attempt → hint → write your answer → expand the full solution.
3. **Drill recall** in the [Quiz Hub](03-quiz/index.html) — random questions, shuffled options, instant scoring and review.
4. **Run the code** for that topic in [04-projects](04-projects/README.md) and try the suggested experiments.

Everything runs **offline with numpy alone** (matplotlib optional) — no `gym`, no GPU, no cloud.

## Chapter Map

| Part | Chapters | Focus |
| --- | --- | --- |
| **0 · Foundations** | 1–2 | Introduction · Multi-armed Bandits |
| **I · Tabular** | 3–8 | MDPs · DP · Monte Carlo · TD · n-step · Planning |
| **II · Approximation** | 9–13 | Prediction · Control · Off-policy · Traces · Policy Gradients |
| **III · Looking Deeper** | 14–17 | Psychology · Neuroscience · Applications · Frontiers |

## The Projects at a Glance

| # | Project | Concept | Chapters |
| --- | --- | --- | --- |
| 1 | [Ten-armed Testbed](04-projects/01-ten-armed-bandit/README.md) | ε-greedy, UCB, optimistic init, gradient bandit | 2 |
| 2 | [Gridworld DP](04-projects/02-gridworld-dp/README.md) | policy evaluation / iteration, value iteration | 3–4 |
| 3 | [Blackjack Monte Carlo](04-projects/03-blackjack-monte-carlo/README.md) | model-free prediction &amp; control | 5 |
| 4 | [Cliff &amp; Windy TD](04-projects/04-cliff-and-windy-td/README.md) | Sarsa vs Q-learning (on- vs off-policy) | 6 |
| 5 | [Dyna Maze](04-projects/05-dyna-maze/README.md) | integrated planning + learning (Dyna-Q/Q+) | 8 |
| 6 | [Mountain Car (tile coding)](04-projects/06-mountain-car-tilecoding/README.md) | linear function approximation | 9–10 |
| 7 | [Random Walk TD(λ)](04-projects/07-random-walk-td-lambda/README.md) | bias–variance: n-step &amp; eligibility traces | 6,7,12 |
| 8 | [CartPole Actor–Critic](04-projects/08-cartpole-actor-critic/README.md) | policy gradients: REINFORCE &amp; actor–critic | 13 |

## The One Question to Ask About Every Algorithm

> *How does it evaluate? How does it improve? Does it bootstrap? Does it need a model? On-policy or off-policy?*

Those five questions place any method on the map.

## Quick Links

- [All notes](01-notes/README.md)
- [Practice exercises](02-exercises/README.md)
- [Quiz Hub](03-quiz/index.html)
- [Runnable projects](04-projects/README.md)
- [Resources](05-resources/README.md)
