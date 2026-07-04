# Chapter 4 — Dynamic Programming · Exercises

> Practice for notes [4.1](../01-notes/04-01-policy-evaluation.md)–[4.4](../01-notes/04-04-async-dp-gpi-and-efficiency.md).

---

## 🧠 Conceptual

### 4.1 — What DP assumes
List the two strong assumptions DP makes that the rest of the book works to relax. For each, name the chapter/method that relaxes it.

💡 **Hint:** One is about knowledge of the world; one is about computation/coverage.

<details>
<summary>✅ Full Answer</summary>

1. **A perfect model** of the environment ($p(s',r|s,a)$ known exactly). Relaxed by **Monte Carlo (Ch. 5)** and **TD (Ch. 6)**, which learn from experience without a model.
2. **Enough computation to sweep the entire state space** repeatedly. Relaxed by **asynchronous DP / sample-based methods (Ch. 4.5, 8)** and by **function approximation (Ch. 9+)** for huge state spaces.

(DP also implicitly assumes the problem is small enough to store a value per state — tabular.)
</details>

---

### 4.2 — Policy improvement theorem in words
State the policy improvement theorem and explain why "the greedy policy is never worse than the policy it was derived from." What does it mean if greedification produces *no* change?

💡 **Hint:** Compare $q_\pi(s, \pi'(s))$ to $v_\pi(s)$.

<details>
<summary>✅ Full Answer</summary>

**Theorem:** if for all states $q_\pi(s, \pi'(s)) \geq v_\pi(s)$, then $\pi' \geq \pi$ (i.e., $v_{\pi'}(s) \geq v_\pi(s)$ everywhere).

The **greedy** policy $\pi'(s) = \arg\max_a q_\pi(s,a)$ satisfies the condition by construction: choosing the best action is at least as good as following the old policy's action. So greedifying never hurts.

**If greedification produces no change** ($v_{\pi'} = v_\pi$), then $v_\pi$ satisfies the Bellman *optimality* equation — meaning **π was already optimal**. So each improvement step either strictly improves the policy or certifies it optimal.
</details>

---

### 4.3 — Why does value iteration work?
Value iteration uses just *one* sweep of evaluation per improvement. Explain how it relates to (a) policy iteration and (b) the Bellman optimality equation.

💡 **Hint:** It's the Bellman optimality equation turned into an assignment.

<details>
<summary>✅ Full Answer</summary>

- **(a) vs policy iteration:** policy iteration runs full policy evaluation (many sweeps to convergence) between improvements. Value iteration truncates evaluation to a *single sweep* and folds improvement in via the max. Both converge to $v_*$; value iteration just doesn't wait for exact evaluation.
- **(b) Bellman optimality:** the update $v_{k+1}(s) \leftarrow \max_a \sum_{s',r} p(s',r|s,a)[r + \gamma v_k(s')]$ is the Bellman optimality equation used as an assignment. Repeated application is a contraction that converges to the unique fixed point $v_*$.
</details>

---

## 🔢 Math / Worked

### 4.4 — One sweep of policy evaluation (4×4 gridworld)
Undiscounted ($\gamma=1$), reward −1 per step, equiprobable random policy, $V$ initialized to 0 everywhere. After **one** in-place sweep, what is the value of any non-terminal state, and why?

💡 **Hint:** All successor values are still 0 on the first sweep.

<details>
<summary>✅ Full Answer</summary>

For any non-terminal state, every action gives reward −1 and leads to a successor whose current value is 0:
$$V(s) = \sum_a 0.25 \cdot [-1 + 1 \cdot 0] = -1$$

So after the first sweep **every non-terminal state has value −1**. (Subsequent sweeps push values toward the true expected number of steps to termination: −14, −18, −20, −22 in the corners-pattern.) This shows information propagating outward from the terminal states one sweep at a time.
</details>

---

### 4.5 — Value iteration update by hand
A state $s$ has two actions. Action L: reward 0, goes to a state with current value 10. Action R: reward 5, goes to a state with current value 3. With $\gamma = 0.9$, compute the value-iteration update $v_{k+1}(s)$ and the greedy action.

💡 **Hint:** Compute each action's backed-up value, then take the max.

<details>
<summary>✅ Full Answer</summary>

- Action L: $0 + 0.9 \times 10 = 9.0$
- Action R: $5 + 0.9 \times 3 = 5 + 2.7 = 7.7$

$$v_{k+1}(s) = \max(9.0, 7.7) = 9.0, \quad \text{greedy action} = L$$

Even though R has the bigger *immediate* reward, L is better because it leads to a much more valuable state — the value function captures the long-run consequence.
</details>

---

### 4.6 — Generalized Policy Iteration
Explain GPI in two sentences, and state where its fixed point lies. Name three later algorithms (from any chapter) that are instances of GPI.

💡 **Hint:** Two interacting processes; the fixed point is where they stop disagreeing.

<details>
<summary>✅ Full Answer</summary>

**GPI** = letting two processes interact: *policy evaluation* (make the value function consistent with the policy) and *policy improvement* (make the policy greedy w.r.t. the value function), at any granularity. The **fixed point** is reached when the policy is greedy with respect to its *own* value function — which is exactly the Bellman optimality condition, i.e., $\pi_*$ and $v_*$.

Instances: **Monte Carlo control (Ch. 5)**, **Sarsa & Q-learning (Ch. 6)**, **Dyna-Q (Ch. 8)**, **actor–critic (Ch. 13)** — among nearly all RL methods.
</details>

---

## 💻 Code

### 4.7 — Implement iterative policy evaluation
Write a function `policy_evaluation(states, actions, p, pi, gamma, theta)` that returns $V$ for a given policy, using in-place sweeps until the max change < θ.

💡 **Hint:** `p[(s,a)]` returns `[(prob, s2, r), ...]`; `pi[(s,a)]` returns the action probability.

<details>
<summary>✅ Full Answer</summary>

```python
def policy_evaluation(states, actions, p, pi, gamma=0.9, theta=1e-6):
    V = {s: 0.0 for s in states}
    while True:
        delta = 0.0
        for s in states:
            if is_terminal(s):
                continue
            v_old = V[s]
            V[s] = sum(
                pi[(s, a)] * sum(prob * (r + gamma * V[s2])
                                 for (prob, s2, r) in p[(s, a)])
                for a in actions(s)
            )
            delta = max(delta, abs(v_old - V[s]))
        if delta < theta:
            return V
```

This is the Bellman expectation equation applied as an in-place assignment, sweeping until values stabilize. Swap the `sum over a` for a `max over a` and you've got value iteration.
</details>

---

### 4.8 — Turn it into policy iteration
Sketch (pseudocode) the full policy-iteration loop using the evaluation function from 4.7. Where is the convergence test for the policy?

💡 **Hint:** Loop evaluate → improve; stop when the greedy policy stops changing.

<details>
<summary>✅ Full Answer</summary>

```python
def policy_iteration(states, actions, p, gamma=0.9):
    pi = {s: actions(s)[0] for s in states}      # arbitrary deterministic policy
    while True:
        V = evaluate(pi)                          # full policy evaluation (det. policy)
        policy_stable = True
        for s in states:
            if is_terminal(s):
                continue
            old = pi[s]
            # greedify: pick action with the best one-step backed-up value
            pi[s] = max(actions(s), key=lambda a:
                        sum(prob * (r + gamma * V[s2]) for (prob, s2, r) in p[(s, a)]))
            if old != pi[s]:
                policy_stable = False
        if policy_stable:                         # <-- policy convergence test
            return pi, V
```

The convergence test is `policy_stable`: when an entire improvement pass changes **no** action, the policy is greedy w.r.t. its own value function → optimal. Guaranteed to terminate in finitely many iterations for a finite MDP.
</details>

---

➡️ Next: [Chapter 5 — Monte Carlo Methods exercises](05-monte-carlo-exercises.md)
