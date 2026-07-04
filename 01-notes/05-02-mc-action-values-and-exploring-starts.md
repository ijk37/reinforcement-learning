# 5.2 — MC Estimation of Action Values & Monte Carlo Control with Exploring Starts

> **Chapter 5: Monte Carlo Methods** · Book sections: §5.2–§5.3
> Previous: [5.1 — Monte Carlo Prediction](05-01-monte-carlo-prediction.md) · Next: [5.3 — MC Control without Exploring Starts](05-03-mc-control-without-exploring-starts.md)

---

## 🌱 Why action values now? (§5.2)

With a model, state values suffice: one-step lookahead picks the best action. **Without a model, state values aren't enough** — you can't look ahead without knowing where actions lead! So MC's primary goal becomes estimating

$$q_\pi(s, a) \approx \text{average of returns following visits to the pair } (s,a)$$

Exactly the same machinery as before, just with state–action **pairs** as the things we visit and average over.

### 🚨 The problem: maintaining exploration

Here's the catch. If π is deterministic, then in each state you only ever take *one* action — so you get returns for only one action per state, and the estimates of all the **other** actions never improve. But comparing alternatives is the whole point of action values!

> This is the general problem of **maintaining exploration**, and it haunts all of control. To evaluate all actions, we must ensure **every state–action pair is visited infinitely often** (in the limit).

**Fix #1 — Exploring starts (ES):** start each episode at a *randomly chosen state–action pair* (every pair having nonzero probability of being the start). Useful in simulations; usually impossible when learning from real interaction (you can't teleport a robot into arbitrary situations 🤖💨).

**Fix #2 — Stochastic policies** with $\pi(a|s) > 0$ for all $a$ (next note).

---

## 🔄 Monte Carlo Control (§5.3) — GPI with samples

We apply **generalized policy iteration** using MC in the evaluation role:

$$\pi_0 \xrightarrow{\text{MC evaluate}} q_{\pi_0} \xrightarrow{\text{greedify}} \pi_1 \xrightarrow{\text{E}} q_{\pi_1} \xrightarrow{\text{I}} \pi_2 \rightarrow \cdots \rightarrow \pi_*, q_*$$

- **Evaluation:** run many episodes, average returns → $Q \approx q_\pi$.
- **Improvement:** greedify: $\pi(s) = \arg\max_a Q(s, a)$. The policy improvement theorem still applies — each greedification is ≥ the previous policy. **Note: no model needed for improvement** because we have *action* values!

### Making it practical: don't wait for perfect evaluation

In principle each evaluation needs infinitely many episodes. In practice (same idea as value iteration) we **alternate after every episode**:

```text
Monte Carlo ES (Exploring Starts) control:
Initialize: π(s) arbitrary; Q(s,a) arbitrary; Returns(s,a) empty lists

loop forever (per episode):
    choose random S0, A0 (exploring start: all pairs prob > 0)
    generate episode from S0,A0 following π
    G = 0
    for t = T−1 down to 0:
        G = γG + R_{t+1}
        unless (S_t, A_t) appeared earlier in episode:
            append G to Returns(S_t, A_t)
            Q(S_t, A_t) = average(Returns(S_t, A_t))
            π(S_t) = argmax_a Q(S_t, a)      ← improve immediately!
```

After each episode: observed returns update Q, then the policy is greedified **at the visited states**. Evaluation and improvement are interleaved episode-by-episode — GPI in its natural sampled form.

---

## 🃏 Blackjack, solved (book Example 5.3)

Exploring starts is easy in simulated blackjack (deal random initial cards, force a random first action). Running MC ES converges to the **optimal blackjack policy** — which matches the famous "basic strategy" charts, with a nuanced policy for usable-ace hands. From nothing but simulated games and averaging. 🎉

---

## 🎯 Key Takeaways

1. Model-free control needs **action values** $q(s,a)$, not state values.
2. Deterministic policies starve most actions of data → the **exploration maintenance problem**.
3. **Exploring starts**: random initial state–action pair each episode — clean fix, but only viable in simulators.
4. **MC control = GPI**: episode → update Q (evaluation) → greedify π at visited states (improvement).
5. Convergence of MC ES to $\pi_*$ is intuitively plausible and empirically solid — but a formal proof remains one of RL's open theoretical questions!

---

➡️ **Next:** [5.3 — MC Control *without* Exploring Starts](05-03-mc-control-without-exploring-starts.md) — ε-soft policies, for when you can't teleport.
