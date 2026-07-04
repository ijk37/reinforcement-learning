# 9.4 — Feature Construction for Linear Methods

> **Chapter 9: On-policy Prediction with Approximation** · Book sections: §9.5–§9.6
> Previous: [9.3 — Linear Methods](09-03-linear-methods.md) · Next: [9.5 — Nonlinear & Other Methods](09-05-nonlinear-and-other-methods.md)

---

## 🌱 The Big Picture

Linear methods are only as good as their features. Feature construction is where you inject **domain knowledge** into RL — and the design choices control **how the agent generalizes**. Here are the classic toolkits.

---

## 1️⃣ Polynomials (§9.5.1)

State = numbers $(s_1, s_2)$ → features like $(1, s_1, s_2, s_1 s_2, s_1^2, s_2^2, s_1 s_2^2, \dots)$.

- Fixes the basic problem that raw values alone can't represent **interactions** between dimensions (e.g., value depends on the *product* of position and velocity).
- Number of features explodes exponentially in dimension → keep order low, or prune. Generally **outperformed by Fourier features**; mainly of historical/intro value.

## 2️⃣ Fourier Basis (§9.5.2) 🎵

Features are cosines of integer-weighted combinations of (rescaled) state variables:

$$x_i(s) = \cos(\pi\, \mathbf{c}^i \cdot s), \qquad s \in [0,1]^k$$

- Easy to use, performs surprisingly well — the book's experiments show Fourier basis **beating polynomials** clearly on the 1000-state walk.
- Practical tip from the book: use a **different step size per feature**, $\alpha_i = \alpha / \|\mathbf{c}^i\|$ (high-frequency features get smaller steps).
- Weakness: cosines are global → trouble with sharp discontinuities (ringing); great for smooth value functions.

## 3️⃣ Coarse Coding (§9.5.3) 🎯🎯🎯

Cover the state space with many **overlapping receptive fields** (e.g., circles). Feature $i$ = 1 if the state is inside circle $i$, else 0 — **binary, sparse** features.

- A state activates several circles; learning at one state updates all its circles → generalization to **all states sharing those circles**.
- **Size/shape of fields controls generalization**: big circles → broad generalization (coarse but fast); small → fine discrimination (precise but slow spread). Elongated fields → generalize more along one dimension.
- Book's lesson (Figure 9.8): receptive-field size affects mostly the **speed/breadth of early learning**; with enough features, **final** resolution is determined by the number of features more than their size. The acuity sneaks in anyway. ✨

## 4️⃣ Tile Coding (§9.5.4) 🧱 — THE practical workhorse

Coarse coding engineered for computers:

- Partition the space into a grid of **tiles** (one "tiling"). One tiling alone = state aggregation.
- Use **multiple tilings, each offset** by a different amount. A state activates exactly **one tile per tiling** → with 8 tilings, exactly 8 active binary features.

```text
tiling 1:   ┌──┬──┬──┐      tilings 2..8 are the same grid,
            │  │ ●│  │      each shifted by a different offset.
            └──┴──┴──┘      state ● activates one tile in each.
```

**Why everyone loves it:**
- **Sparse + binary + constant active count** → blazing fast (sum a few weights); step size easy to set ($\alpha = 1/(\text{number of tilings})$ → exact one-shot fit; in practice e.g. $\alpha = 0.1/8$).
- Generalization controlled by tile shapes and offset patterns (asymmetric offsets generalize more evenly than uniform ones; log-stripes, diagonal stripes for dimension-selective generalization).
- **Hashing** can shrink memory: collapse the huge tile grid into a small table of pseudo-random tiles — works because only a tiny fraction of the space is ever visited.

## 5️⃣ Radial Basis Functions (§9.5.5)

Soft, Gaussian versions of coarse-coding circles: $x_i(s) = \exp\left(-\frac{\|s - c_i\|^2}{2\sigma_i^2}\right)$ — features vary smoothly in [0,1].

- Pro: smooth, differentiable approximations.
- Con (per the book): in practice, often **no real advantage** over binary tiles, more compute, more parameters to tune; RBF networks that also learn the centers/widths drift into nonlinear-FA territory with its complications.

---

## 🎚️ Selecting step size manually (§9.6)

Useful rule of thumb for linear FA with stochastic data: to converge in about $\tau$ experiences with roughly similar feature vectors,

$$\alpha \doteq \big(\tau\, \mathbb{E}[\mathbf{x}^\top \mathbf{x}]\big)^{-1}$$

i.e., one over (target horizon × the expected squared norm of the features). For tile coding with $n$ tilings, $\mathbf{x}^\top\mathbf{x} = n$, giving the $\alpha = 1/(\tau n)$ recipe above.

---

## 🎯 Key Takeaways

1. Features = the knobs of **generalization**; pick them to match how the value function actually varies.
2. **Fourier**: easy, strong on smooth problems. **Polynomials**: mostly superseded.
3. **Coarse coding**: overlapping receptive fields; their size/shape sets generalization breadth.
4. **Tile coding**: sparse, binary, fixed active count, hashable — the practical default for linear RL.
5. Step-size rule: $\alpha = 1/(\tau\,\mathbb{E}[\mathbf{x}^\top\mathbf{x}])$.

---

➡️ **Next:** [9.5 — Nonlinear Approximation & Friends](09-05-nonlinear-and-other-methods.md) — neural networks, least-squares TD, memory-based methods, and interest/emphasis.
