# 9.2 — Stochastic-gradient and Semi-gradient Methods

> **Chapter 9: On-policy Prediction with Approximation** · Book section: §9.3
> Previous: [9.1 — Value-function Approximation](09-01-value-function-approximation.md) · Next: [9.3 — Linear Methods](09-03-linear-methods.md)

---

## 🌱 The Big Picture

We have an objective ($\overline{VE}$). Now the optimizer: **stochastic gradient descent (SGD)** — the same workhorse that trains all of deep learning — plus RL's special twist when targets bootstrap: **semi-gradients**.

---

## 📉 Gradient descent refresher (60 seconds)

$\mathbf{w}$ is a vector of $d$ weights; $\hat v(s,\mathbf{w})$ is differentiable in $\mathbf{w}$. The **gradient** $\nabla \hat v(s,\mathbf{w})$ is the vector of partial derivatives — the direction in weight-space that increases $\hat v(s,\mathbf{w})$ fastest. To *reduce* an error, step the weights *against* the error's gradient. "Stochastic" = each step uses just **one** (noisy) example, not the whole distribution — perfect for online RL.

---

## ✅ True gradient SGD (when the target doesn't depend on w)

Suppose on each step we observe $S_t$ and (some possibly noisy) target $U_t$. Minimize the squared error by:

$$\boxed{\;\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\Big[U_t - \hat v(S_t, \mathbf{w}_t)\Big]\nabla \hat v(S_t, \mathbf{w}_t)\;}$$

(The same `New ← Old + α·Error·(direction)` pattern — now in weight space.)

**Gradient Monte Carlo:** use $U_t = G_t$ (the full return). Since $\mathbb{E}[G_t|S_t] = v_\pi(S_t)$ — an **unbiased** target — SGD theory applies, and convergence to a **local optimum of $\overline{VE}$** is guaranteed (with decreasing α). ✅

```text
Gradient Monte Carlo prediction:
for each episode (generated with π):
    for t = 0..T−1:
        w ← w + α [G_t − v̂(S_t,w)] ∇v̂(S_t,w)
```

---

## ⚠️ Semi-gradient TD (when the target DOES depend on w)

Now use the TD target $U_t = R_{t+1} + \gamma \hat v(S_{t+1}, \mathbf{w})$. Notice: the target **itself contains $\mathbf{w}$** (through $\hat v(S_{t+1},\mathbf{w})$). The honest gradient of the error would have to differentiate through the target too. The TD update **doesn't** — it treats the target as a constant and only differentiates the estimate:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\Big[R_{t+1} + \gamma \hat v(S_{t+1},\mathbf{w}_t) - \hat v(S_t, \mathbf{w}_t)\Big]\nabla \hat v(S_t, \mathbf{w}_t)$$

Hence the name: **semi-gradient** — only *part* of the true gradient.

### Why cheat? Is it safe? 🤔

- **Why:** bootstrapping is what makes TD fast, online, and continual — we keep it.
- **Cost:** semi-gradient methods are *not* true gradient descent on any objective; the usual SGD convergence guarantees don't apply.
- **Good news:** in the important **linear case** (next note), semi-gradient TD(0) converges reliably — to a point near the optimum (the *TD fixed point*).
- **Bad news (saved for Ch. 11):** combine semi-gradients with **off-policy** training and divergence becomes possible. The "deadly triad" looms.

| | Gradient MC | Semi-gradient TD(0) |
|---|---|---|
| Target | $G_t$ (unbiased, high variance) | $R + \gamma \hat v(S',\mathbf{w})$ (biased, low variance) |
| True SGD? | ✅ | ❌ (target treated as constant) |
| Converges to | local optimum of $\overline{VE}$ | TD fixed point (linear case) |
| Speed | slower, episodic | typically much faster, fully online |

---

## 🏔️ State aggregation — the simplest function approximation

Partition states into **groups**; one weight per group; every state in a group shares that value. ($\nabla \hat v$ = 1 for the group's weight, 0 elsewhere — SGD becomes the tabular update applied to groups.)

**Book Example 9.1 — 1000-state random walk:** 1000 states, jumps of up to 100 left/right, 10 groups of 100 states. Gradient MC converges to a **staircase** approximation of the true (nearly linear) value function. Within each group, the estimate fits best the *most-visited* states — μ in action! The state distribution visibly shapes *where* the approximation is accurate.

---

## 🎯 Key Takeaways

1. SGD update: $\mathbf{w} \mathrel{+}= \alpha[U_t - \hat v(S_t,\mathbf{w})]\nabla \hat v(S_t,\mathbf{w})$.
2. **Unbiased target (MC)** → true SGD → guaranteed local optimum.
3. **Bootstrapped target (TD)** → **semi-gradient**: faster and online, but weaker guarantees (fine on-policy + linear; dangerous off-policy).
4. State aggregation: the bridge between tables and full-blown approximation; reveals how μ shapes accuracy.

---

➡️ **Next:** [9.3 — Linear Methods](09-03-linear-methods.md) — the most important special case: $\hat v = \mathbf{w}^\top \mathbf{x}(s)$, and the celebrated TD fixed point.
