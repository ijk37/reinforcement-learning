# 2.2 — Action-value Methods: Sample Averages and ε-Greedy

> **Chapter 2: Multi-armed Bandits** · Book sections: §2.2–§2.3
> Previous: [2.1 — The k-armed Bandit Problem](02-01-k-armed-bandit-problem.md) · Next: [2.3 — Incremental Implementation & Nonstationarity](02-03-incremental-implementation-and-nonstationarity.md)

---

## 🌱 The Big Picture

We need two things: a way to **estimate** action values, and a rule to **select actions** using those estimates. Together these are called **action-value methods**.

---

## 📊 Step 1: Estimating values — the sample-average method

The value of an action is its mean reward, so the natural estimate is the **average of rewards actually received**:

$$Q_t(a) \doteq \frac{\text{sum of rewards when } a \text{ taken prior to } t}{\text{number of times } a \text{ taken prior to } t}$$

- If action $a$ has never been tried, define $Q_t(a)$ as some default (e.g. 0).
- By the **law of large numbers**, as an action is taken infinitely often, $Q_t(a) \to q_*(a)$. ✅

**Example 🔢:** You pulled lever 3 four times and got rewards 1, 0, 2, 1.
$Q(3) = (1+0+2+1)/4 = 1.0$.

---

## 🎯 Step 2: Selecting actions

### Greedy selection
Always pick the action with the highest current estimate:

$$A_t \doteq \underset{a}{\arg\max}\; Q_t(a)$$

($\arg\max_a$ = "the action $a$ that maximizes the expression"; ties broken randomly.)

**Problem:** pure greed never explores. If an early unlucky sample makes the best lever *look* bad, greedy may ignore it forever and get stuck on a worse lever. 🪤

### ε-greedy selection (the workhorse)
Behave greedily *most* of the time, but with small probability $\varepsilon$ (e.g. 0.1 or 0.01), pick an action **uniformly at random** (including possibly the greedy one):

```text
with probability 1 − ε:  choose argmax_a Q(a)     (exploit)
with probability ε:      choose a random action   (explore)
```

**Why it works:** every action keeps getting sampled forever, so all $Q_t(a) \to q_*(a)$, and the probability of selecting the truly best action converges to better than $1-\varepsilon$.

---

## 🧪 The 10-armed Testbed (§2.3) — what the experiments show

The book tests these methods on 2000 randomly generated 10-armed bandit problems (true values $q_*(a)$ drawn from a normal distribution; rewards = $q_*(a)$ + noise). Results over 1000 steps, averaged:

| Method | Long-run behavior |
|---|---|
| **Greedy** ($\varepsilon=0$) | Improves fastest at the very start, then **plateaus low** (~1.0 reward/step vs ~1.55 possible). Often gets stuck on a suboptimal action. Picks the best action only ~33% of the time. |
| **ε = 0.1** | Explores a lot, finds the best action early, picks it ~91% of the time (can't exceed $1 - \varepsilon + \varepsilon/10$). |
| **ε = 0.01** | Improves slowly but eventually **outperforms** ε = 0.1 on both measures. |

**Lessons:**

1. Greedy fails because exploration is needed to avoid locking onto bad estimates.
2. There's a trade-off *within* exploration too: big ε learns fast but wastes pulls forever; small ε learns slow but exploits more eventually. A nice trick: **start with large ε and reduce it over time**.
3. How much exploration helps **depends on the problem**: noisier rewards (higher variance) → more exploration needed. Even with *deterministic* rewards, exploration helps if the problem **changes over time** (nonstationarity) — and nonstationarity is the norm in real RL.

---

## 🐍 Pseudocode — complete ε-greedy bandit agent

```python
# k actions; initialize:
Q = [0.0] * k       # value estimates
N = [0]   * k       # times each action was chosen

loop forever:
    if random() < epsilon:
        A = random_action()            # explore
    else:
        A = argmax(Q)                  # exploit
    R = bandit(A)                      # pull lever, observe reward
    N[A] += 1
    Q[A] += (1 / N[A]) * (R - Q[A])    # incremental average (next note!)
```

---

## 🎯 Key Takeaways

1. **Sample-average estimate:** $Q_t(a)$ = mean of rewards received for $a$; converges to $q_*(a)$.
2. **Greedy** gets stuck; **ε-greedy** guarantees continued exploration with one tiny change.
3. Choice of ε is itself a trade-off; decaying ε over time gives the best of both.
4. The noisier or less stationary the problem, the more exploration matters.

---

➡️ **Next:** [2.3 — Incremental Implementation & Nonstationarity](02-03-incremental-implementation-and-nonstationarity.md) — how to compute averages without storing every reward, and what to do when the world keeps changing.
