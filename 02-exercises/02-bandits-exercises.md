# Chapter 2 — Multi-armed Bandits · Exercises

> Practice for notes [2.1](../01-notes/02-01-k-armed-bandit-problem.md)–[2.6](../01-notes/02-06-contextual-bandits-and-summary.md).
> Read the **💡 Hint**, attempt it, then expand the **✅ Full Answer**.

---

## 🧠 Conceptual

### 2.1 — Greedy can get stuck
Explain precisely how a purely greedy action-value agent can lock onto a suboptimal action *forever*, even when a better action exists. What single change prevents this?

💡 **Hint:** Think about what happens to an action's estimate if it's never selected again.

<details>
<summary>✅ Full Answer</summary>

A greedy agent always picks the action with the highest *current estimate*. Suppose the truly best action gets unlucky early — its first few sampled rewards happen to be low, dragging its estimate below another action's. The greedy agent now never selects it again, so its estimate is **never updated** and stays wrong forever. Meanwhile the agent exploits an inferior action indefinitely.

**Fix:** add exploration. ε-greedy selects a random action with probability ε, guaranteeing every action keeps being sampled, so all estimates converge to their true values and the best action is eventually identified.
</details>

---

### 2.2 — When does exploration matter more?
Two bandit problems are identical except problem A has near-deterministic rewards (tiny variance) and problem B has very noisy rewards (large variance). In which does exploration matter more, and why? What about if rewards are deterministic but the task is *nonstationary*?

💡 **Hint:** Variance affects how many samples you need to trust an estimate.

<details>
<summary>✅ Full Answer</summary>

- **Noisy problem B needs more exploration.** With high variance, a single sample is an unreliable estimate of an action's true value — you must sample each action many times to average out the noise. With near-deterministic rewards (A), one or two samples nearly reveal the true value, so little exploration is needed.
- **Deterministic but nonstationary:** exploration becomes important *again*, even with zero noise. If the true values drift over time, an action that was best earlier may no longer be best. Continual exploration is needed to *detect the change*. (This is why constant-α tracking + ongoing exploration matters in the real world.)
</details>

---

### 2.3 — UCB vs. ε-greedy exploration
Both UCB and ε-greedy explore, but differently. Contrast *how* each chooses which action to explore, and name one practical reason ε-greedy is still preferred in full RL.

💡 **Hint:** One explores blindly; one explores by uncertainty.

<details>
<summary>✅ Full Answer</summary>

- **ε-greedy:** when it explores (probability ε), it picks **uniformly at random** among all actions — *undirected*. It will waste exploration on actions already known to be bad.
- **UCB:** selects $\arg\max_a [Q_t(a) + c\sqrt{\ln t / N_t(a)}]$ — it explores the actions that are most *uncertain or promising*. Exploration is **directed** toward where knowledge is weakest; well-sampled bad actions get tried less and less.
- **Why ε-greedy persists in full RL:** UCB's uncertainty bonus is hard to extend to large state spaces / function approximation and to nonstationary problems. ε-greedy is trivially simple and general, so it remains the default in deep RL.
</details>

---

## 🔢 Math / Worked

### 2.4 — Incremental average by hand
An action has been selected 4 times with rewards 2, 0, 4, 2. (a) Compute $Q_5$ using the sample average. (b) Now verify it via the incremental rule $Q_{n+1} = Q_n + \frac{1}{n}(R_n - Q_n)$, starting from $Q_1 = 0$.

💡 **Hint:** For (b), apply the rule one reward at a time.

<details>
<summary>✅ Full Answer</summary>

**(a)** $Q_5 = (2 + 0 + 4 + 2)/4 = 8/4 = 2.0$.

**(b)** Incrementally (step $n$ uses $\frac{1}{n}$):
- $Q_1 = 0$
- $R_1 = 2$: $Q_2 = 0 + \frac{1}{1}(2 - 0) = 2$
- $R_2 = 0$: $Q_3 = 2 + \frac{1}{2}(0 - 2) = 2 - 1 = 1$
- $R_3 = 4$: $Q_4 = 1 + \frac{1}{3}(4 - 1) = 1 + 1 = 2$
- $R_4 = 2$: $Q_5 = 2 + \frac{1}{4}(2 - 2) = 2$

✅ Both give $Q_5 = 2.0$.
</details>

---

### 2.5 — Constant step size = exponential recency weighting
With the constant-α update $Q_{n+1} = Q_n + \alpha(R_n - Q_n)$ and $\alpha = 0.5$, $Q_1 = 0$, rewards 1, then 1, then 1. Compute $Q_2, Q_3, Q_4$. What is the weight on the *first* reward in $Q_4$?

💡 **Hint:** The weight on $R_i$ is $\alpha(1-\alpha)^{n-i}$.

<details>
<summary>✅ Full Answer</summary>

- $Q_2 = 0 + 0.5(1-0) = 0.5$
- $Q_3 = 0.5 + 0.5(1-0.5) = 0.75$
- $Q_4 = 0.75 + 0.5(1-0.75) = 0.875$

**Weight on the first reward $R_1$ in $Q_4$:** using $\alpha(1-\alpha)^{n-i}$ with $\alpha=0.5$, $n=3$ updates applied, $i=1$: the oldest reward's weight is $(1-\alpha)^{3} = 0.5^3 = 0.125$ on the initial-influence side; more directly, $Q_4 = (1-\alpha)^3 Q_1 + \sum \alpha(1-\alpha)^{3-i}R_i$. The weight on $R_1$ is $\alpha(1-\alpha)^{2} = 0.5 \times 0.25 = 0.125$. Recent rewards count more — exactly the recency weighting we want for nonstationary problems.
</details>

---

### 2.6 — Convergence conditions
State the two stochastic-approximation conditions on a step-size sequence $\{\alpha_n\}$ that guarantee convergence. Show that $\alpha_n = 1/n$ satisfies both, and that a constant $\alpha$ violates one. Why is violating it sometimes *desirable*?

💡 **Hint:** $\sum 1/n$ diverges; $\sum 1/n^2$ converges.

<details>
<summary>✅ Full Answer</summary>

Conditions:
$$\sum_{n=1}^\infty \alpha_n = \infty \quad\text{(steps big enough to overcome initial conditions/noise)}$$
$$\sum_{n=1}^\infty \alpha_n^2 < \infty \quad\text{(steps eventually small enough to converge)}$$

- **$\alpha_n = 1/n$:** $\sum 1/n = \infty$ ✅ (harmonic series diverges); $\sum 1/n^2 = \pi^2/6 < \infty$ ✅. Both hold → converges.
- **Constant $\alpha$:** $\sum \alpha = \infty$ ✅, but $\sum \alpha^2 = \infty$ ❌ (second condition fails).
- **Why desirable:** failing the second condition means the estimate *never fully settles* — it keeps responding to recent rewards. That's exactly what you want in a **nonstationary** problem, where the target keeps moving. So constant α is a feature, not a bug, for tracking.
</details>

---

## 💻 Code

### 2.7 — Implement the 10-armed testbed
Write Python to (a) create a 10-armed bandit with true values $q_*(a) \sim \mathcal{N}(0,1)$ and rewards $\mathcal{N}(q_*(a), 1)$, and (b) run an ε-greedy agent for 1000 steps. Return the per-step average reward.

💡 **Hint:** Track `Q` and `N` arrays; use the incremental update.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np

def run_bandit(epsilon=0.1, steps=1000, k=10, seed=0):
    rng = np.random.default_rng(seed)
    q_true = rng.normal(0, 1, k)          # true action values
    Q = np.zeros(k)                       # estimates
    N = np.zeros(k)                       # counts
    rewards = np.zeros(steps)

    for t in range(steps):
        if rng.random() < epsilon:
            a = rng.integers(k)           # explore
        else:
            a = np.argmax(Q)              # exploit (ties -> first)
        r = rng.normal(q_true[a], 1)      # sample reward
        N[a] += 1
        Q[a] += (r - Q[a]) / N[a]         # incremental sample average
        rewards[t] = r
    return rewards

# Average over many runs to reproduce the book's curves:
avg = np.mean([run_bandit(epsilon=0.1, seed=s) for s in range(2000)], axis=0)
print(avg[:5], "...", avg[-1])
```

To reproduce the book's Figure 2.2, run 2000 independent bandit problems and average the reward at each step for ε = 0, 0.01, 0.1. You'll see ε = 0.1 rise fastest, ε = 0.01 overtake it later, and greedy (ε = 0) plateau lowest.
</details>

---

### 2.8 — Add optimistic initialization and compare
Modify 2.7 so `Q` starts at +5 instead of 0, with **greedy** selection (ε = 0) and constant α = 0.1. Explain what you'd expect to see in the first ~20 steps versus a realistic-initialization greedy agent.

💡 **Hint:** Every real reward (~0) disappoints relative to +5.

<details>
<summary>✅ Full Answer</summary>

```python
def run_optimistic(steps=1000, k=10, alpha=0.1, Q0=5.0, seed=0):
    rng = np.random.default_rng(seed)
    q_true = rng.normal(0, 1, k)
    Q = np.full(k, Q0)
    rewards = np.zeros(steps)
    for t in range(steps):
        a = np.argmax(Q)                  # pure greedy
        r = rng.normal(q_true[a], 1)
        Q[a] += alpha * (r - Q[a])        # constant step size
        rewards[t] = r
    return rewards
```

**Expected behavior:** early on, whichever action is tried returns a reward near 0, which is far below the optimistic +5. So its estimate *drops*, and the next greedy choice switches to a different (still-optimistic) action. The agent thus cycles through and tries **all** actions several times in the first ~tens of steps — exploration emerges from greedy selection. A realistic-init (Q0 = 0) greedy agent does almost no exploration and often sticks on the first decent action.

There's a characteristic early *spike then dip* in the optimistic curve before it surpasses ε-greedy. Caveat: this only drives exploration **at the start** — useless for nonstationary tasks.
</details>

---

➡️ Next: [Chapter 3 — Finite MDPs exercises](03-mdps-exercises.md)
