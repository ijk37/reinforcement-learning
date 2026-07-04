# Project 7 — Random Walk: TD(0), n-step TD & TD(λ) 🚶

<div align="center" markdown>

[![View the live site — ijk37.com](https://img.shields.io/badge/%F0%9F%A4%96_View_the_Live_Site-IJK37.COM-22D3EE?style=for-the-badge&labelColor=5B4BD6)](https://ijk37.com/reinforcement-learning/)

[Home](../../index.md) &nbsp;|&nbsp; [Notes](../../01-notes/README.md) &nbsp;|&nbsp; [Exercises](../../02-exercises/README.md) &nbsp;|&nbsp; [Quiz Hub](../../03-quiz/) &nbsp;|&nbsp; [All Projects](../README.md)

</div>


> Concepts: [6.1 TD prediction](../../01-notes/06-01-td-prediction.md), [7.1 n-step TD](../../01-notes/07-01-n-step-td-prediction.md), [12.2 TD(λ)](../../01-notes/12-02-td-lambda.md)

## What this shows
The **bias–variance dial** that runs through the whole book. On the 19-state random walk (where the true values are known and linear), we measure prediction error for different `n` (n-step TD) and different `λ` (TD(λ)). The headline result: **intermediate values beat both extremes** — pure one-step TD and pure Monte Carlo are each suboptimal.

## Run it
```bash
python td_lambda.py
```
Pure numpy. Prints the best RMS error (minimized over step sizes) for a range of `n` and `λ`.

## What to look for
- n-step TD: error is lowest around **n = 4** (not n=1, not large n).
- TD(λ): error is lowest around **λ = 0.8–0.9** (not 0, not 1).
- This is exactly the U-shaped pattern from the book's Figures 7.2 and 12.3.

## Experiments to try
1. Increase `episodes` and `seeds` and plot full α-vs-error curves for each n / λ.
2. Add the **offline λ-return** ("forward view") and confirm TD(λ) ("backward view") matches it.
3. Swap accumulating traces for **replacing/dutch** traces and compare.
