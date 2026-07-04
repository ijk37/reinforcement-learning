<div align="center">

# 🧪 RL Quiz Hub

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[![Open the Quiz Hub](https://img.shields.io/badge/%F0%9F%A7%AA_Open_the_Quiz_Hub-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/03-quiz/)

</div>

A self-contained, dependency-free quiz app (plain HTML/CSS/JS) covering all 17 chapters of **Sutton &amp; Barto**. Open [`index.html`](index.html) locally or use the live [Quiz Hub](https://ijk37.com/reinforcement-learning/03-quiz/).

## What it does

- A **hub** ([`index.html`](index.html)) with a card per chapter plus cumulative **mixed** quizzes.
- A **quiz engine** ([`quiz.html`](quiz.html), run via `?topic=<id>`): each attempt draws a **random subset** of the pool, **reshuffles the answer options** every render (kills position bias), and gives a question navigator, elapsed timer, instant scoring, and a full per-question **review** with explanations.

## Files

| File | Role |
| --- | --- |
| `index.html` | Chapter/mixed hub → links to `quiz.html?topic=<id>` |
| `quiz.html` | The engine (all logic + cyberpunk styling inline) |
| `data.js` | `TOPICS`, `QUIZ_CONFIG`, `attemptSizeFor`, and chapters 01–02 |
| `data-part1.js` | Chapters 03–08 (tabular methods) |
| `data-part2.js` | Chapters 09–13 (approximation) |
| `data-part3.js` | Chapters 14–17 (looking deeper) |
| `data-mixed.js` | Cumulative mixed quizzes (loaded last; samples the pools) |

## Adding questions

Each question is an object:

```js
{ q: "Question?", options: ["A", "B", "C", "D"], answer: 1, explain: "Why B is correct." }
```

Append more to `QUESTIONS["<chapter-id>"]` in the matching `data-*.js` file (keep `0 ≤ answer < options.length`). The mixed quizzes automatically include anything you add, since they concatenate the chapter pools. This is a **starter bank** — pools can be grown over time.
