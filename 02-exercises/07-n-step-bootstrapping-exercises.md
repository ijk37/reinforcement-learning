# Chapter 7 — n-step Bootstrapping · Exercises

> Practice for notes [7.1](../01-notes/07-01-n-step-td-prediction.md)–[7.3](../01-notes/07-03-n-step-off-policy-and-tree-backup.md).

---

## 🧠 Conceptual

### 7.1 — The spectrum
Where do TD(0) and Monte Carlo sit on the n-step spectrum? Why is an intermediate n often best?

💡 **Hint:** n controls a bias–variance trade-off and how fast credit propagates.

<details>
<summary>✅ Full Answer</summary>

- **TD(0) = n=1** (bootstrap after one step); **MC = n=∞** (never bootstrap, use the full return).
- **Intermediate n is often best** because of two opposing effects:
  - Small n → low variance but more bias (relies heavily on the current, possibly-wrong value estimate) and slow credit propagation (info moves back one state per episode-step).
  - Large n → less bias but high variance (a long noisy sum of rewards), like MC.
  - A middle n propagates reward information several states back per experience **and** keeps variance manageable. Empirically (random walk, Mountain Car) intermediate n wins.
</details>

---

### 7.2 — The update delay
Why can't an n-step method update state $S_t$ at time $t$? When does the update happen, and what does this mean for the last states of an episode?

💡 **Hint:** You need the next n rewards before you can form the target.

<details>
<summary>✅ Full Answer</summary>

The n-step return $G_{t:t+n}$ requires rewards $R_{t+1}, \dots, R_{t+n}$ plus $V(S_{t+n})$ — none of which are available until time $t+n$. So the update for $S_t$ is applied at time $\tau + n$ where $\tau = t$. The algorithm runs **n steps behind** the agent.

For the **last n states** of an episode, $t+n$ exceeds the terminal time $T$, so their n-step returns just equal the full return $G_t$, and their updates are applied during the final "flush" after the episode ends.
</details>

---

### 7.3 — Tree backup vs. importance sampling
For n-step **off-policy** learning, contrast the importance-sampling approach with the tree-backup approach. What does tree backup trade away to avoid importance ratios?

💡 **Hint:** No free lunch — one has variance, the other has a shrinking effective horizon.

<details>
<summary>✅ Full Answer</summary>

- **Importance sampling:** multiply the n-step return by $\prod \pi(A_k|S_k)/b(A_k|S_k)$ to correct for the policy mismatch. General, but products of ratios → **high variance** (and a single π-impossible action zeros the return).
- **Tree backup:** no importance ratios at all. At each level it bootstraps off the estimated values of the **non-taken** actions (weighted by π) and recurses into the taken action weighted by $\pi(A|S)$. It corrects for the policy difference by *averaging over π directly* using current estimates.

**Trade-off:** when π is near-deterministic and b explores a lot, the spine weights $\pi(A_{t+1}|S_{t+1})$ shrink toward 0, so the **effective lookahead horizon shortens** — tree backup swaps importance-sampling variance for a reduced multi-step reach.
</details>

---

## 🔢 Math / Worked

### 7.4 — Compute a 3-step return
Rewards $R_1=1, R_2=2, R_3=3$ and the estimated value $V(S_3) = 10$, with $\gamma = 0.5$. Compute the 3-step return $G_{0:3}$.

💡 **Hint:** $G_{0:3} = R_1 + \gamma R_2 + \gamma^2 R_3 + \gamma^3 V(S_3)$.

<details>
<summary>✅ Full Answer</summary>

$$G_{0:3} = 1 + 0.5(2) + 0.25(3) + 0.125(10) = 1 + 1 + 0.75 + 1.25 = 4.0$$

The first three terms are the real discounted rewards; the last term ($\gamma^3 V(S_3)$) **bootstraps** — it corrects for all the rewards beyond step 3 using the current value estimate.
</details>

---

### 7.5 — Credit assignment picture
In a gridworld where the agent finally reaches a goal, how many state–action values get strengthened after the first episode under (a) 1-step Sarsa and (b) 10-step Sarsa? What does this illustrate?

💡 **Hint:** Count how far back the reward information reaches.

<details>
<summary>✅ Full Answer</summary>

- **(a) 1-step Sarsa:** only the **single last** action before the goal is strengthened (everything earlier bootstraps off still-zero values).
- **(b) 10-step Sarsa:** the **last 10** actions on the path are strengthened in that one episode.

This illustrates that **n controls how far credit propagates back along the trajectory per experience** — larger n assigns credit to more of the actions that led to the reward, dramatically speeding learning (at the cost of higher variance).
</details>

---

## 💻 Code

### 7.6 — Implement n-step TD prediction
Implement n-step TD for state-value prediction over a single episode given as lists `states`, `rewards` (with `rewards[t]` = reward received after `states[t]`). Update a dict `V` in place.

💡 **Hint:** Maintain τ = t − n + 1; sum the discounted window, add the bootstrap term if not past T.

<details>
<summary>✅ Full Answer</summary>

```python
def n_step_td(states, rewards, V, n=4, alpha=0.1, gamma=1.0):
    T = len(states)                       # terminal time (states[0..T-1], reward[t] after states[t])
    for tau in range(T):
        # target: sum of discounted rewards in window [tau+1 .. min(tau+n, T)]
        end = min(tau + n, T)
        G = sum(gamma**(i - tau - 1) * rewards[i] for i in range(tau, end))
        if tau + n < T:                   # bootstrap unless the window reaches terminal
            G += gamma**n * V[states[tau + n]]
        s = states[tau]
        V[s] += alpha * (G - V[s])
    return V
```

(For a streaming/online version you'd interleave action-taking with updates using the τ = t − n + 1 schedule from the note's pseudocode; this batched form is clearer for learning.) Set `n=1` and it becomes TD(0); set `n` ≥ episode length and it becomes Monte Carlo.
</details>

---

### 7.7 — Sweep n to find the best
Describe an experiment (pseudocode level) to reproduce the "intermediate n is best" result on the 19-state random walk. What do you plot?

💡 **Hint:** Grid over (n, α); measure RMS error vs. true values after a few episodes.

<details>
<summary>✅ Full Answer</summary>

```text
true_V = known true values of the 19-state walk
for n in [1, 2, 4, 8, 16, 32, ...]:
    for alpha in linspace(0, 1, 20):
        errors = []
        repeat many runs:
            V = zeros; reset
            for episode in range(10):
                generate a random-walk episode
                run n_step_td(episode, V, n, alpha)
            errors.append( RMS(V - true_V) over states )
        record mean(errors) for (n, alpha)
plot: x = alpha, one curve per n, y = average RMS error after 10 episodes
```

You'll get a family of U-shaped curves; the lowest curves are **intermediate n** (around 4–8), confirming that neither pure TD(0) nor pure MC is best. This mirrors the book's Figure 7.2.
</details>

---

➡️ Next: [Chapter 8 — Planning and Learning exercises](08-planning-and-learning-exercises.md)
