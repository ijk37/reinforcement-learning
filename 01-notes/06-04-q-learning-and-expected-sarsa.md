# 6.4 — Q-learning & Expected Sarsa

> **Chapter 6: Temporal-Difference Learning** · Book sections: §6.5–§6.6
> Previous: [6.3 — Sarsa](06-03-sarsa-on-policy-td-control.md) · Next: [6.5 — Maximization Bias & Double Learning](06-05-maximization-bias-and-double-learning.md)

---

## ⚡ Q-learning (§6.5) — the most famous RL algorithm

One small change to Sarsa's target creates one of the breakthroughs of RL (Watkins, 1989):

$$\boxed{\;Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha\Big[R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t)\Big]\;}$$

Instead of the value of the action *actually taken next* (Sarsa), the target uses the value of the **best** action available next — regardless of what the agent actually does.

> **Q-learning is off-policy:** the learned Q directly approximates $q_*$ — the optimal action-value function — **independent of the policy being followed**. The behavior policy (e.g., ε-greedy) only determines *which* pairs get visited and updated; the *target* is always the optimal one.

**Convergence:** Q → $q_*$ with probability 1, provided every pair keeps being updated and step sizes satisfy the usual conditions. No importance sampling needed (a one-step method choosing its own target action sidesteps it — more on this in Ch. 7).

```text
Q-learning (off-policy TD control):
for each episode:
    S ← initial state
    repeat each step:
        A ← ε-greedy from Q at S           ← behave exploratorily…
        take A, observe R, S′
        Q(S,A) ← Q(S,A) + α [ R + γ max_a Q(S′,a) − Q(S,A) ]   ← …learn greedily
        S ← S′
    until S terminal
```

---

## 🧗 Cliff Walking — Sarsa vs Q-learning (book Example 6.6, a classic!)

Gridworld: walk from S to G along the edge of a cliff. Reward −1 per step; stepping off the cliff = **−100** and teleport back to start. Both agents use ε-greedy (ε = 0.1, no decay).

| | **Q-learning** | **Sarsa** |
|---|---|---|
| Learns | the **optimal** path — right along the cliff edge 💀 | a **longer, safer** path away from the edge 🛤️ |
| Online performance | *worse*! ε-exploration occasionally walks it off the cliff | *better* — its policy accounts for its own exploration |
| Values learned | $q_*$ (optimal, ignoring exploration) | values of the actual ε-greedy behavior |

> 💡 **The deep lesson:** "optimal" depends on what you account for. Q-learning learns values assuming future behavior is greedy (it won't be, during learning — hence the falls). Sarsa learns values of the *actual exploring* behavior — so it routes around danger. If ε were gradually decayed, **both** would converge to the optimal policy.

---

## 📐 Expected Sarsa (§6.6)

A third sibling: like Q-learning, but instead of the max, use the **expected value** of the next action under the current policy:

$$Q(S_t,A_t) \leftarrow Q(S_t,A_t) + \alpha\Big[R_{t+1} + \gamma \sum_a \pi(a|S_{t+1})\,Q(S_{t+1},a) - Q(S_t,A_t)\Big]$$

- Moves **deterministically** in the direction Sarsa moves **in expectation** — eliminating the variance from randomly sampling $A_{t+1}$.
- Slightly more compute per step (sum over actions), but **dominates Sarsa empirically** across step sizes — on cliff walking it performs best of all three, and can even use α = 1 without degrading asymptotic performance (the cliff environment is deterministic; all randomness came from the policy, which the expectation removes!).
- Flexible: it can be used **on-policy** (π = behavior) or **off-policy** (π = some target like the greedy policy — in which case *Expected Sarsa with greedy π **is exactly Q-learning***! Q-learning is a special case 🤯).

---

## 🎯 Key Takeaways

1. **Q-learning:** target = $R + \gamma \max_a Q(S', a)$. Learns $q_*$ directly; **off-policy**; behavior just needs to keep visiting everything.
2. **Sarsa vs Q-learning on the cliff:** Q-learning learns the optimal-but-risky path, Sarsa the safe one — on-policy methods respect their own exploration.
3. **Expected Sarsa:** averages over next actions instead of sampling → lower variance, better performance, costs a bit more compute.
4. Family picture: Sarsa (sample next action) ⊂ Expected Sarsa (average next actions) ⊃ Q-learning (max next action = Expected Sarsa with greedy target).

---

➡️ **Next:** [6.5 — Maximization Bias & Double Learning](06-05-maximization-bias-and-double-learning.md) — that innocent-looking `max` in Q-learning hides a systematic bias. Meet Double Q-learning.
