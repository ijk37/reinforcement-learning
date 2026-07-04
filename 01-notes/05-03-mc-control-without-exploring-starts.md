# 5.3 — Monte Carlo Control without Exploring Starts (ε-soft Policies)

> **Chapter 5: Monte Carlo Methods** · Book section: §5.4
> Previous: [5.2 — MC Action Values & Exploring Starts](05-02-mc-action-values-and-exploring-starts.md) · Next: [5.4 — Off-policy Prediction via Importance Sampling](05-04-off-policy-prediction-importance-sampling.md)

---

## 🌱 The Big Picture

Exploring starts are unrealistic — a real robot can't begin each episode in a random state taking a random action. Alternative: make the **policy itself keep exploring**. Two families of solutions exist:

- **On-policy methods:** evaluate and improve **the same policy** that's generating behavior. (This note.)
- **Off-policy methods:** behave with one policy, learn about a different one. (Next note.)

---

## 🧂 ε-soft policies

A policy is **soft** if $\pi(a|s) > 0$ for *all* states and actions — every action always has a chance. We use **ε-greedy policies**: with probability 1−ε pick the greedy action; otherwise pick uniformly at random. Formally, every action gets probability at least $\frac{\varepsilon}{|\mathcal{A}(s)|}$, and the greedy action gets the rest:

$$\pi(a|s) = \begin{cases} 1 - \varepsilon + \dfrac{\varepsilon}{|\mathcal{A}(s)|} & \text{if } a = \text{greedy action} \\[2mm] \dfrac{\varepsilon}{|\mathcal{A}(s)|} & \text{otherwise} \end{cases}$$

ε-greedy policies are examples of **ε-soft** policies (those with $\pi(a|s) \geq \varepsilon/|\mathcal{A}(s)|$).

---

## 🔄 On-policy MC control

Same GPI dance as before, with one change: instead of greedifying *all the way*, the improvement step moves the policy to the **ε-greedy** policy w.r.t. current Q:

```text
On-policy first-visit MC control (for ε-soft policies):
Initialize: Q(s,a) arbitrary; Returns(s,a) empty; π = an arbitrary ε-soft policy

loop forever (per episode):
    generate an episode following π (no exploring starts needed — π explores!)
    G = 0
    for t = T−1 down to 0:
        G = γG + R_{t+1}
        unless (S_t,A_t) seen earlier in episode:
            append G to Returns(S_t,A_t);  Q(S_t,A_t) = average(...)
            A* = argmax_a Q(S_t,a)
            update π(·|S_t) to be ε-greedy w.r.t. Q     ← soft improvement
```

### Does the improvement theorem still hold? ✅

Yes — the book proves that the ε-greedy policy w.r.t. $q_\pi$ is **≥ any ε-soft policy** π. So the policy still monotonically improves *within the ε-soft family*, and GPI converges to the **best ε-soft policy** (equivalently: the optimal policy of a modified environment that occasionally randomizes your actions).

### The price you pay 💵

You don't get the truly optimal (deterministic) policy — you get the best policy *that keeps exploring with probability ε*. Usually near-optimal in practice, and you can decay ε over time. The desire to learn the *truly* optimal policy while still behaving exploratorily leads to the next topic…

---

## 🆚 On-policy vs Off-policy — the fork in the road

| | **On-policy** | **Off-policy** |
|---|---|---|
| Learns about… | the policy being followed | a *different* (target) policy |
| Exploration | built into the learned policy (it stays soft) | done by a separate *behavior* policy |
| Result | best ε-soft policy | can learn the truly optimal policy |
| Complexity / variance | simpler, faster convergence | more powerful, higher variance, slower |
| Famous example | Sarsa (Ch. 6) | Q-learning (Ch. 6) |

> 🧭 **Mental model:** on-policy = "learning on the job" (your behavior and your learning target are the same). Off-policy = "learning from watching someone else" (or from your own *exploratory* self while evaluating your *greedy* self).

---

## 🎯 Key Takeaways

1. Drop exploring starts by making the policy **ε-soft** — exploration becomes part of the policy itself.
2. Improvement step greedifies *softly*: move to the ε-greedy policy w.r.t. Q.
3. The policy improvement theorem extends: convergence to the **best ε-soft policy**.
4. To get the *optimal* policy while exploring forever, we need **off-policy** learning — next.

---

➡️ **Next:** [5.4 — Off-policy Prediction via Importance Sampling](05-04-off-policy-prediction-importance-sampling.md) — the math of learning about one policy from another's experience.
