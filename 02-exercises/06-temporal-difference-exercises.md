# Chapter 6 — Temporal-Difference Learning · Exercises

> Practice for notes [6.1](../01-notes/06-01-td-prediction.md)–[6.5](../01-notes/06-05-maximization-bias-and-double-learning.md).
> ⭐ The most important chapter — make sure the TD update and the Sarsa/Q-learning distinction are second nature.

---

## 🧠 Conceptual

### 6.1 — TD = MC + DP
Explain how TD learning combines an idea from Monte Carlo with an idea from Dynamic Programming. What does "bootstrapping" mean?

💡 **Hint:** One parent gives "learn from experience"; the other gives "update from estimates."

<details>
<summary>✅ Full Answer</summary>

- **From Monte Carlo:** TD learns directly from raw **experience**, with **no model** of the environment.
- **From Dynamic Programming:** TD updates each estimate using **other current estimates** — it doesn't wait for the final return.

**Bootstrapping** = updating an estimate based (partly) on another estimate. TD(0) bootstraps because its target $R_{t+1} + \gamma V(S_{t+1})$ contains the estimate $V(S_{t+1})$. MC does *not* bootstrap (it uses the actual full return); DP *does* bootstrap (it uses successor-state value estimates).
</details>

---

### 6.2 — The TD error
Write the TD error $\delta_t$ and describe in words what it measures. Why is it called the most important quantity in RL?

💡 **Hint:** It's the gap between two successive predictions.

<details>
<summary>✅ Full Answer</summary>

$$\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$$

It measures the **difference between what we believed before the step** ($V(S_t)$) and **what we believe after one step of reality** ($R_{t+1} + \gamma V(S_{t+1})$) — i.e., the *surprise* or prediction error.

It's central because nearly every RL update is "move the estimate by α·δ"; δ drives learning in TD, Sarsa, Q-learning, actor–critic, and (per Chapter 15) appears to correspond to phasic **dopamine** signals in the brain.
</details>

---

### 6.3 — Sarsa vs. Q-learning targets
Write both update targets. Explain precisely which is on-policy and which is off-policy, and why.

💡 **Hint:** Look at *which* next-action value enters the target.

<details>
<summary>✅ Full Answer</summary>

- **Sarsa (on-policy):** target $= R_{t+1} + \gamma Q(S_{t+1}, A_{t+1})$, where $A_{t+1}$ is the action **actually taken next** by the current (exploring) policy. Sarsa learns the value of the policy it is *actually following*, exploration included.
- **Q-learning (off-policy):** target $= R_{t+1} + \gamma \max_a Q(S_{t+1}, a)$, using the value of the **best** next action regardless of what's actually done. Q-learning learns $q_*$ (the optimal policy's values) while behaving with a different (e.g., ε-greedy) policy.

On-policy = the value being learned matches the behavior policy; off-policy = the learned (target) policy differs from the behavior policy.
</details>

---

### 6.4 — Cliff Walking intuition
On the cliff-walking task, Q-learning learns the optimal (edge) path but earns *less* online reward than Sarsa, which takes a longer, safer route. Explain the apparent paradox.

💡 **Hint:** What does each method assume about future exploration?

<details>
<summary>✅ Full Answer</summary>

Q-learning learns $q_*$ — the values **assuming greedy (optimal) future behavior**. The optimal path hugs the cliff edge. But during learning the agent still explores ε-greedily, and those occasional random steps near the edge plunge it off the cliff (−100), hurting *online* reward.

Sarsa learns the values of its **actual ε-greedy behavior**, so it "knows" that walking near the edge is risky *given that it sometimes acts randomly* — and routes safely away. Hence Sarsa earns more reward *during* learning, even though Q-learning's learned policy is optimal. If ε were decayed to 0, both converge to the optimal path.
</details>

---

### 6.5 — Maximization bias
What is maximization bias, and why does Double Q-learning remove it?

💡 **Hint:** The max of noisy estimates overestimates the true max; decouple selection from evaluation.

<details>
<summary>✅ Full Answer</summary>

**Maximization bias:** taking the **max over noisy estimates** as an estimate of the max of true values produces a systematic **positive** bias — the max operation cherry-picks whichever action got lucky upward noise, even if all true values are equal.

**Double Q-learning fix:** keep two independent estimates $Q_1, Q_2$. Use one to **select** the best action ($A^* = \arg\max_a Q_1(a)$) and the *other* to **evaluate** it ($Q_2(A^*)$). Since $Q_2$'s noise is independent of the selection, $\mathbb{E}[Q_2(A^*)] = q(A^*)$ — unbiased. The lucky noise that wins the argmax no longer also inflates the value.
</details>

---

## 🔢 Math / Worked

### 6.6 — TD(0) update by hand
$V(S_t) = 5$, observed reward $R_{t+1} = 2$, $V(S_{t+1}) = 6$, $\gamma = 0.9$, $\alpha = 0.1$. Compute $\delta_t$ and the updated $V(S_t)$.

💡 **Hint:** Compute δ first, then add α·δ.

<details>
<summary>✅ Full Answer</summary>

$$\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t) = 2 + 0.9(6) - 5 = 2 + 5.4 - 5 = 2.4$$
$$V(S_t) \leftarrow 5 + 0.1(2.4) = 5.24$$
</details>

---

### 6.7 — Expected Sarsa = Q-learning?
Show that Expected Sarsa with a **greedy** target policy reduces exactly to Q-learning. Then state Expected Sarsa's advantage over plain Sarsa.

💡 **Hint:** A greedy π puts all probability on the argmax action.

<details>
<summary>✅ Full Answer</summary>

Expected Sarsa target: $R_{t+1} + \gamma \sum_a \pi(a|S_{t+1}) Q(S_{t+1}, a)$.

If π is **greedy**, then $\pi(a|S_{t+1}) = 1$ for $a = \arg\max_{a'} Q(S_{t+1}, a')$ and 0 otherwise, so the sum collapses to $\max_a Q(S_{t+1}, a)$ — exactly the Q-learning target. So **Q-learning is a special case of Expected Sarsa**.

**Advantage over Sarsa:** Expected Sarsa averages over the next action's distribution instead of *sampling* one action, eliminating the variance from that random choice. Result: more stable updates and typically better performance across step sizes (can even use α = 1 in deterministic tasks).
</details>

---

## 💻 Code

### 6.8 — Implement tabular Q-learning
Write `q_learning(env, episodes, alpha, gamma, epsilon)` for a discrete env exposing `reset()`, `step(a)->(s2,r,done)`, and `n_actions`. Return the learned Q-table.

💡 **Hint:** ε-greedy behavior; target uses `max_a Q[s2]`.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np
from collections import defaultdict

def q_learning(env, episodes=500, alpha=0.5, gamma=1.0, epsilon=0.1):
    Q = defaultdict(lambda: np.zeros(env.n_actions))

    def policy(s):
        if np.random.random() < epsilon:
            return np.random.randint(env.n_actions)     # explore
        return int(np.argmax(Q[s]))                     # exploit

    for _ in range(episodes):
        s = env.reset()
        done = False
        while not done:
            a = policy(s)                                # behavior = ε-greedy
            s2, r, done = env.step(a)
            target = r + (0.0 if done else gamma * np.max(Q[s2]))  # off-policy target
            Q[s][a] += alpha * (target - Q[s][a])
            s = s2
    return Q
```

Key: the **behavior** is ε-greedy, but the **target** uses `max` over next-state Q (the greedy/optimal policy) → off-policy. To make it **Sarsa**, instead choose `a2 = policy(s2)` and use `Q[s2][a2]` in the target (and carry `a2` into the next step).
</details>

---

### 6.9 — Convert Q-learning to Double Q-learning
Describe the minimal code changes to turn the 6.8 solution into Double Q-learning.

💡 **Hint:** Two tables, a coin flip, cross-evaluation.

<details>
<summary>✅ Full Answer</summary>

```python
Q1 = defaultdict(lambda: np.zeros(env.n_actions))
Q2 = defaultdict(lambda: np.zeros(env.n_actions))

# behavior policy uses the SUM (or average) of the two tables:
def policy(s):
    if np.random.random() < epsilon: return np.random.randint(env.n_actions)
    return int(np.argmax(Q1[s] + Q2[s]))

# inside the loop, after observing (s, a, r, s2, done):
if np.random.random() < 0.5:
    a_star = np.argmax(Q1[s2])                          # select with Q1
    target = r + (0 if done else gamma * Q2[s2][a_star])# evaluate with Q2
    Q1[s][a] += alpha * (target - Q1[s][a])
else:
    a_star = np.argmax(Q2[s2])                          # select with Q2
    target = r + (0 if done else gamma * Q1[s2][a_star])# evaluate with Q1
    Q2[s][a] += alpha * (target - Q2[s][a])
```

Changes: (1) two Q-tables; (2) coin flip picks which to update each step; (3) the **selection** of the max action uses one table, the **evaluation** uses the other — breaking the correlation that causes maximization bias.
</details>

---

➡️ Next: [Chapter 7 — n-step Bootstrapping exercises](07-n-step-bootstrapping-exercises.md)
