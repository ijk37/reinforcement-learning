# 7.1 — n-step TD Prediction

> **Chapter 7: n-step Bootstrapping** · Book section: §7.1
> Previous: [6.5 — Maximization Bias & Double Learning](06-05-maximization-bias-and-double-learning.md) · Next: [7.2 — n-step Sarsa](07-02-n-step-sarsa.md)

---

## 🌱 The Big Picture

MC and one-step TD are **two extremes of a spectrum**:

```text
TD(0) ——— 2-step ——— 3-step ——— ... ——— n-step ——— ... ——— Monte Carlo
bootstrap after 1 step                              bootstrap never
```

**n-step methods** look $n$ real steps into the future, then bootstrap. Why care? Because **neither extreme is usually best** — the sweet spot is typically in between. n-step methods also free the *time of bootstrapping* from the *time of action* (one-step methods force them to be the same).

---

## 🧮 The n-step return

Recall the targets:

- MC target (full return): $G_t = R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{T-t-1} R_T$
- TD(0) target (one-step return): $G_{t:t+1} = R_{t+1} + \gamma V_t(S_{t+1})$

Generalize — take $n$ real rewards, then plug in the estimated value of the state reached:

$$G_{t:t+n} \doteq R_{t+1} + \gamma R_{t+2} + \cdots + \gamma^{n-1} R_{t+n} + \gamma^n V_{t+n-1}(S_{t+n})$$

The estimate $V(S_{t+n})$ **corrects for** all the missing rewards beyond step $n$. If the episode ends before $n$ steps ($t+n \geq T$), the n-step return just equals the full return $G_t$.

### The update

$$V_{t+n}(S_t) \leftarrow V_{t+n-1}(S_t) + \alpha\Big[G_{t:t+n} - V_{t+n-1}(S_t)\Big]$$

⚠️ **Practical wrinkle:** you can't update at time $t$ — you must wait until time $t+n$ to have seen the $n$ rewards. So the algorithm runs $n$ steps "behind" the agent, and the last $n$ states get their updates after the episode ends. (Implementation stores the last $n+1$ states/rewards in a circular buffer.)

### Why it's sound: the error-reduction property 📉

The worst-case error of the n-step return's expectation is at most $\gamma^n$ times the worst-case error of the current value function:

$$\max_s \Big| \mathbb{E}_\pi[G_{t:t+n} | S_t = s] - v_\pi(s) \Big| \;\leq\; \gamma^n \max_s \big| V_{t+n-1}(s) - v_\pi(s) \big|$$

So n-step returns are *better* targets than the current estimate — all n-step methods converge.

---

## 🚶 The Random Walk, revisited (book Example 7.1)

On a 19-state random walk, sweep $n$ and α and measure error after 10 episodes:

- $n = 1$ (TD(0)): learns, but slowly propagates information — one state per episode-step.
- $n = 4$-ish: **best performance** 🏆
- $n$ large (toward MC): worse again — high variance washes out the benefit.

**Why intermediate n wins, intuitively:** with one-step TD, only the state *adjacent* to the terminal reward changes after the first episode. With n-step, the reward information propagates **n states back** in one shot — faster credit assignment — while still keeping variance below MC's. 🎯

| | small n | large n |
|---|---|---|
| Bias (from bootstrapping off wrong V) | higher | lower |
| Variance (from sampling many rewards) | lower | higher |
| Information propagation per step | slow | fast |

n is yet another bias–variance dial. (Chapter 12's eligibility traces will let us *blend all n simultaneously* — TD(λ).)

---

## 🎯 Key Takeaways

1. n-step return: $n$ real rewards + bootstrapped value of the n-th next state.
2. Generalizes TD(0) ($n{=}1$) and MC ($n{=}\infty$); updates lag $n$ steps behind the action.
3. Error-reduction property guarantees convergence.
4. **Intermediate n usually performs best** — the spectrum's interior beats both endpoints. One of the book's recurring empirical lessons.

---

➡️ **Next:** [7.2 — n-step Sarsa](07-02-n-step-sarsa.md) — the same idea for control.
