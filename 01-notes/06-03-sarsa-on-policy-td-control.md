# 6.3 — Sarsa: On-policy TD Control

> **Chapter 6: Temporal-Difference Learning** · Book section: §6.4
> Previous: [6.2 — Optimality of TD(0)](06-02-optimality-of-td0.md) · Next: [6.4 — Q-learning & Expected Sarsa](06-04-q-learning-and-expected-sarsa.md)

---

## 🌱 The Big Picture

Time to use TD for **control** (finding good policies), following the trusty GPI pattern. As always in model-free control, we need **action values** $q(s,a)$. The on-policy TD control algorithm is called **Sarsa** — and the name is literally its data: each update uses the quintuple

$$(S_t,\; A_t,\; R_{t+1},\; S_{t+1},\; A_{t+1}) \;\;\to\;\; \textbf{S,A,R,S,A} \;🙂$$

---

## 🧮 The Sarsa update

Apply the TD(0) idea to state–action pairs instead of states:

$$\boxed{\;Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha\Big[R_{t+1} + \gamma\, Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)\Big]\;}$$

- Done after **every transition**; if $S_{t+1}$ is terminal, define $Q(S_{t+1}, A_{t+1}) = 0$.
- Note carefully: the target uses $Q(S_{t+1}, A_{t+1})$ — the value of the action the agent **actually took next** (chosen by the current, exploring policy). That's what makes Sarsa **on-policy**: it learns the value of the policy it is actually following — exploration moves included.

## 🔁 The full control algorithm

```text
Sarsa (on-policy TD control):
Initialize Q(s,a) arbitrarily (Q(terminal,·)=0)

for each episode:
    S ← initial state
    A ← ε-greedy action from Q at S
    for each step of episode:
        take action A, observe R, S′
        A′ ← ε-greedy action from Q at S′
        Q(S,A) ← Q(S,A) + α [ R + γ Q(S′,A′) − Q(S,A) ]
        S ← S′;  A ← A′
    until S is terminal
```

GPI in action: evaluation = the TD update; improvement = the policy is always ε-greedy w.r.t. the latest Q.

**Convergence:** Sarsa converges to an optimal policy with probability 1 provided all state–action pairs are visited infinitely often and the policy converges in the limit to the greedy policy (e.g., ε-greedy with ε → 0, like ε = 1/t).

---

## 🌬️ Worked example: Windy Gridworld (book Example 6.5)

A gridworld with a crosswind: in middle columns, any move also pushes you **upward** by 1 or 2 cells. Start S, goal G, reward −1 per step (undiscounted). 

- **Why MC struggles here:** some policies *never terminate* (you loop forever) — MC can't finish an episode to learn from it. 😵
- **Sarsa learns online, step by step**, so during the episode it already discovers that looping policies are bad and switches away — no termination needed for learning.
- With ε = 0.1, α = 0.5, Sarsa finds a near-optimal path (the wind makes the best route counterintuitive — you aim *below* the goal and let the wind carry you up 🪁).

> 💡 **The key advantage demonstrated:** online TD control learns *during* the episode. Methods that must wait for episode end can be helpless when episodes are long or unbounded.

---

## 🎯 Key Takeaways

1. **Sarsa update:** $Q(S,A) \mathrel{+}= \alpha[R + \gamma Q(S',A') - Q(S,A)]$ using the quintuple S,A,R,S′,A′.
2. **On-policy:** the next-action value in the target is the action *actually selected* by the current (ε-greedy) policy — Sarsa learns the value of *how it actually behaves*, exploration included.
3. Full algorithm = TD evaluation + ε-greedy improvement, every step. GPI again.
4. Converges to optimal given infinite visits + ε decaying to 0.
5. Because it accounts for exploration, Sarsa tends to learn **safe** policies (vivid example next note: the Cliff!).

---

➡️ **Next:** [6.4 — Q-learning & Expected Sarsa](06-04-q-learning-and-expected-sarsa.md) — the off-policy sibling that learns the optimal values directly, and the famous Cliff Walking comparison.
