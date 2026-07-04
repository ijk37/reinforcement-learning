# Chapter 5 — Monte Carlo Methods · Exercises

> Practice for notes [5.1](../01-notes/05-01-monte-carlo-prediction.md)–[5.5](../01-notes/05-05-off-policy-mc-control-and-summary.md).

---

## 🧠 Conceptual

### 5.1 — What MC needs vs. what DP needs
State the core idea of Monte Carlo value estimation. What does it require from the environment, and why is that a weaker (easier) requirement than DP's?

💡 **Hint:** Think "average the returns" — and what you need to *get* returns.

<details>
<summary>✅ Full Answer</summary>

**Core idea:** the value of a state is the expected return from it, so estimate it by **averaging the actual returns** observed after visiting that state. As the number of visits grows, the average converges to the true value.

**Requirement:** only the ability to **generate sample episodes** (real or simulated experience). It does **not** need the transition probabilities $p(s',r|s,a)$.

**Why weaker:** in many problems (e.g., blackjack) writing down the full probability distribution is extremely hard, but *simulating* a game is trivial. Being able to sample is a much milder requirement than knowing the complete dynamics, so MC applies where DP can't.
</details>

---

### 5.2 — First-visit vs. every-visit
Define both. Which is unbiased, and why is the other still acceptable?

💡 **Hint:** "Unbiased" relates to whether the averaged returns are i.i.d.

<details>
<summary>✅ Full Answer</summary>

- **First-visit MC:** for each episode, average the return following only the **first** time a state is visited in that episode.
- **Every-visit MC:** average the return following **every** visit to the state.

**First-visit is unbiased:** each averaged return is an independent sample of $v_\pi(s)$ (different episodes are independent), so the estimate is unbiased and its error falls as $1/\sqrt{n}$.

**Every-visit** averages returns from multiple visits within one episode, which are **correlated** → slightly biased. But the bias vanishes as visits grow, it still converges to $v_\pi(s)$, and it extends more naturally to function approximation and eligibility traces.
</details>

---

### 5.3 — Why control needs action values
Explain why model-free MC **control** must estimate $q(s,a)$ rather than $v(s)$, and how this creates the "maintaining exploration" problem.

💡 **Hint:** How would you pick the greedy action from $v$ alone?

<details>
<summary>✅ Full Answer</summary>

To improve a policy you must compare actions. With only $v(s)$ and **no model**, you can't tell which action leads to the best successor state (that lookahead needs $p$). With $q(s,a)$ you simply pick $\arg\max_a q(s,a)$ — no model needed.

**Exploration problem:** a deterministic policy takes only one action per state, so returns are observed for only *that* action — the values of all other actions never improve. To estimate $q$ for *all* actions you must ensure every state–action pair keeps being visited. Two fixes: **exploring starts** (random initial pair) or **ε-soft policies**.
</details>

---

### 5.4 — Exploring starts vs. ε-soft
Compare the two exploration-maintenance approaches. When is each usable?

💡 **Hint:** Can you teleport a real robot into an arbitrary state–action pair?

<details>
<summary>✅ Full Answer</summary>

- **Exploring starts (ES):** begin each episode at a randomly chosen state–action pair, every pair having nonzero probability. Guarantees coverage. **Usable in simulation** (you control the start), but usually **impossible with real interaction** — you can't drop a physical agent into any arbitrary situation.
- **ε-soft policies:** keep the policy itself stochastic ($\pi(a|s) \geq \varepsilon/|\mathcal{A}|$ for all $a$), so exploration happens during normal behavior. **Usable everywhere**, including real robots. The cost: it converges to the best *ε-soft* policy, not the truly optimal deterministic one (unless ε is decayed).
</details>

---

### 5.5 — Ordinary vs. weighted importance sampling
For off-policy MC, contrast ordinary and weighted importance sampling on bias and variance. Which is preferred in practice and why?

💡 **Hint:** One divides by the count; the other by the sum of ratios.

<details>
<summary>✅ Full Answer</summary>

- **Ordinary IS** ($V = \frac{\sum \rho_t G_t}{|\mathcal{T}(s)|}$): **unbiased**, but variance can be **unbounded** — importance ratios $\rho$ can be huge, so a single weighted return can be wildly off.
- **Weighted IS** ($V = \frac{\sum \rho_t G_t}{\sum \rho_t}$): **biased** (bias → 0 as samples grow), but variance is **bounded** and much lower; on the first sample it just equals the observed return.

**Preferred:** weighted IS, almost always — its dramatically lower variance outweighs the vanishing bias. (Blackjack experiments show it reaching low error orders of magnitude faster.)
</details>

---

## 🔢 Math / Worked

### 5.6 — Compute a first-visit MC estimate
Episodes (state sequences with returns already computed for the first visit to state X):
- Ep1: first-visit return to X = 4
- Ep2: X not visited
- Ep3: first-visit return to X = 0
- Ep4: first-visit return to X = 8

Give the first-visit MC estimate $V(X)$.

💡 **Hint:** Average only the episodes where X was first-visited.

<details>
<summary>✅ Full Answer</summary>

Average the three returns from episodes where X appeared: $(4 + 0 + 8)/3 = 12/3 = 4.0$.

Ep2 contributes nothing (X not visited). So $V(X) = 4.0$.
</details>

---

### 5.7 — Importance sampling ratio
A target policy π and behavior policy b act over a 3-step trajectory with these probabilities for the taken actions:

| step | π(a|s) | b(a|s) |
|---|---|---|
| 0 | 0.8 | 0.5 |
| 1 | 0.0 | 0.4 |
| 2 | 0.9 | 0.5 |

Compute the importance-sampling ratio $\rho_{0:2}$. What does the result imply for learning from this trajectory?

💡 **Hint:** $\rho = \prod \pi/b$. Watch the zero.

<details>
<summary>✅ Full Answer</summary>

$$\rho_{0:2} = \frac{0.8}{0.5} \times \frac{0.0}{0.4} \times \frac{0.9}{0.5} = 1.6 \times 0 \times 1.8 = 0$$

The middle factor is 0 because π would **never** take the action that b took at step 1. So $\rho = 0$: this trajectory carries **no information** about π's value — the weighted return contributes nothing. (This is exactly why off-policy MC control "breaks" and restarts learning whenever a non-greedy action occurs.)
</details>

---

## 💻 Code

### 5.8 — First-visit MC prediction
Implement `mc_prediction(episodes, gamma)` where each episode is a list of `(state, reward)` pairs (reward is the reward received *entering* that step). Return a dict of state → estimated value via first-visit MC.

💡 **Hint:** Walk each episode backward accumulating G; record the first visit per episode.

<details>
<summary>✅ Full Answer</summary>

```python
from collections import defaultdict

def mc_prediction(episodes, gamma=1.0):
    returns_sum = defaultdict(float)
    returns_cnt = defaultdict(int)

    for episode in episodes:                       # episode = [(S0,R1),(S1,R2),...]
        states  = [s for (s, _r) in episode]
        rewards = [r for (_s, r) in episode]
        G = 0.0
        seen_first = set()
        # find first-visit index for each state
        first_idx = {}
        for i, s in enumerate(states):
            first_idx.setdefault(s, i)
        # backward accumulation
        for t in reversed(range(len(states))):
            G = gamma * G + rewards[t]
            s = states[t]
            if first_idx[s] == t:                  # this t is the first visit
                returns_sum[s] += G
                returns_cnt[s] += 1

    return {s: returns_sum[s] / returns_cnt[s] for s in returns_sum}
```

Backward accumulation gives O(T) per episode; the `first_idx` map ensures each state is credited only at its first visit. Average across episodes → first-visit estimate.
</details>

---

### 5.9 — Incremental weighted IS update
Write the per-step update equations for off-policy MC using **weighted** importance sampling with cumulative weights, and explain the role of `C`.

💡 **Hint:** Maintain `C(s,a)` = running sum of weights; update Q by `W/C`.

<details>
<summary>✅ Full Answer</summary>

Processing an episode **backward**, with $W$ the running importance ratio (starts at 1):

```text
G = gamma*G + R
C(S,A) = C(S,A) + W
Q(S,A) = Q(S,A) + (W / C(S,A)) * (G - Q(S,A))
W = W * pi(A|S) / b(A|S)
if W == 0: break          # rest of episode contributes nothing
```

`C(s,a)` is the **cumulative sum of weights** seen for that pair. Dividing by it makes `Q` a *weighted* average of returns (weighted by their importance ratios) rather than a plain average — implementing weighted IS incrementally with O(1) memory per pair. The `W/C` factor is the effective step size, which automatically shrinks as more weight accumulates.
</details>

---

➡️ Next: [Chapter 6 — Temporal-Difference Learning exercises](06-temporal-difference-exercises.md)
