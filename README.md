<div align="center">

<a href="https://ijk37.com/reinforcement-learning/"><img src="assets/banner.svg" alt="Reinforcement Learning" width="100%"></a>

<p>
  <a href="https://ijk37.com/reinforcement-learning/"><img src="https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6" alt="View the live site — ijk37.com"></a>
</p>

<p>
  <a href="01-notes/README.md"><img src="https://img.shields.io/badge/Notes-17_chapters-0C93A8?style=for-the-badge&labelColor=076576" alt="Study Notes"></a>
  <a href="02-exercises/README.md"><img src="https://img.shields.io/badge/Exercises-17_sets-10B981?style=for-the-badge&labelColor=0A8F68" alt="Exercises"></a>
  <a href="https://ijk37.com/reinforcement-learning/03-quiz/"><img src="https://img.shields.io/badge/Quiz_Hub-Open-22D3EE?style=for-the-badge&labelColor=5B4BD6" alt="Quiz Hub"></a>
  <a href="04-projects/README.md"><img src="https://img.shields.io/badge/Projects-8_labs-7C6CF0?style=for-the-badge&labelColor=5B4BD6" alt="Projects"></a>
  <a href="05-resources/README.md"><img src="https://img.shields.io/badge/Resources-Reference-076576?style=for-the-badge&labelColor=0B1220" alt="Resources"></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Runs_on-numpy_only-10B981?style=flat-square&labelColor=0B1220" alt="numpy only">
  <img src="https://img.shields.io/badge/Chapters-1–17-0C93A8?style=flat-square&labelColor=0B1220" alt="Chapters">
  <img src="https://img.shields.io/badge/Projects-8-7C6CF0?style=flat-square&labelColor=0B1220" alt="Projects count">
  <img src="https://img.shields.io/badge/Offline-no_GPU,_no_cloud-22D3EE?style=flat-square&labelColor=0B1220" alt="Offline">
</p>

<p><em>A self-study companion to <strong>Reinforcement Learning: An Introduction (2nd edition)</strong> by Richard S. Sutton &amp; Andrew G. Barto — read the theory, test yourself, run the code.</em></p>

</div>

---

## Course Dashboard

| Section | Purpose | Start Here |
| --- | --- | --- |
| **01 Notes** | 60 chapter-wise study notes (Ch. 1–17) with intuition, worked examples, and the essential math | [Browse notes](01-notes/README.md) |
| **02 Exercises** | 17 chapter exercise sets, each with a visible **💡 Hint** and a collapsible **✅ Full Answer** | [Open exercises](02-exercises/README.md) |
| **03 Quiz** | Interactive chapter + cumulative quizzes — random questions, shuffled options, instant review | [Launch quiz hub](https://ijk37.com/reinforcement-learning/03-quiz/) |
| **04 Projects** | 8 runnable Python projects — from the bandit testbed to actor–critic, built from scratch | [View projects](04-projects/README.md) |
| **05 Resources** | Reference material and the source textbook | [See resources](05-resources/README.md) |

Everything is beginner-friendly, GitHub-rendered (LaTeX + Mermaid + collapsible answers), and the code runs **offline with just numpy** (matplotlib optional). No `gym`, no GPU, no cloud.

## Learning Path

```text
Read notes -> Self-test with exercises -> Drill the quiz -> Run the project -> Revisit weak spots
```

The three layers are designed to be used **together, chapter by chapter**:

1. **Read** the chapter's notes in [`01-notes`](01-notes/README.md).
2. **Test yourself** with the matching set in [`02-exercises`](02-exercises/README.md) — attempt → peek at the hint → write your answer → expand the full answer.
3. **Drill recall** in the [Quiz Hub](https://ijk37.com/reinforcement-learning/03-quiz/) — random questions and shuffled options with instant scoring.
4. **Run the code** for that topic in [`04-projects`](04-projects/README.md) and tinker with the suggested experiments.

The recurring lens for *every* algorithm in the book:

> **How does it evaluate? How does it improve? Does it bootstrap? Does it need a model? On-policy or off-policy?**

## Chapter Map

| Part | Chapters | Notes | Exercises |
| --- | --- | --- | --- |
| **Foundations** | 1 Introduction · 2 Multi-armed Bandits | [notes](01-notes/README.md) | [ex](02-exercises/README.md) |
| **I · Tabular** | 3 MDPs · 4 DP · 5 Monte Carlo · 6 TD · 7 n-step · 8 Planning | [notes](01-notes/README.md) | [ex](02-exercises/README.md) |
| **II · Approximation** | 9 Prediction · 10 Control · 11 Off-policy · 12 Traces · 13 Policy Gradients | [notes](01-notes/README.md) | [ex](02-exercises/README.md) |
| **III · Looking Deeper** | 14 Psychology · 15 Neuroscience · 16 Applications · 17 Frontiers | [notes](01-notes/README.md) | [ex](02-exercises/README.md) |

## The Projects at a Glance

| # | Project | Concept | Chapters |
| --- | --- | --- | --- |
| 1 | [Ten-armed Testbed](04-projects/01-ten-armed-bandit/README.md) | ε-greedy, UCB, optimistic init, gradient bandit | 2 |
| 2 | [Gridworld DP](04-projects/02-gridworld-dp/README.md) | policy evaluation / iteration, value iteration | 3–4 |
| 3 | [Blackjack Monte Carlo](04-projects/03-blackjack-monte-carlo/README.md) | model-free prediction & control | 5 |
| 4 | [Cliff & Windy TD](04-projects/04-cliff-and-windy-td/README.md) | Sarsa vs Q-learning (on- vs off-policy) | 6 |
| 5 | [Dyna Maze](04-projects/05-dyna-maze/README.md) | integrated planning + learning (Dyna-Q/Q+) | 8 |
| 6 | [Mountain Car (tile coding)](04-projects/06-mountain-car-tilecoding/README.md) | linear function approximation | 9–10 |
| 7 | [Random Walk TD(λ)](04-projects/07-random-walk-td-lambda/README.md) | bias–variance: n-step & eligibility traces | 6,7,12 |
| 8 | [CartPole Actor–Critic](04-projects/08-cartpole-actor-critic/README.md) | policy gradients: REINFORCE & actor–critic | 13 |

Each project's README explains the concept, how to run it, what to look for, and experiments to try.

## Setup

```bash
# (optional) create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate            # Windows (PowerShell:  .venv\Scripts\Activate.ps1)
# source .venv/bin/activate       # macOS / Linux

# install the project dependencies (numpy required, matplotlib optional)
pip install -r 04-projects/requirements.txt
```

Then run any project from its own folder, e.g.:

```bash
cd 04-projects/01-ten-armed-bandit
python bandits.py
```

Every script **prints its results**, and additionally saves a `.png` plot if matplotlib is installed.

> The root `requirements.txt` holds the **site** build dependencies (MkDocs). Use `04-projects/requirements.txt` to run the code.

## Live Site

This repository doubles as a published site: the same Markdown files build into a [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) site, auto-deployed to GitHub Pages at **[ijk37.com/reinforcement-learning](https://ijk37.com/reinforcement-learning/)**. See [`assets/site_design.md`](assets/site_design.md) for how the "repo **and** live site from the same files" setup works.

## Source

Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press — freely available from the authors.

---

<div align="center">

<strong>Read the notes. Drill the exercises. Prove it in the code.</strong>

</div>
