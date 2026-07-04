# 4.3 — Value Iteration

> **Chapter 4: Dynamic Programming** · Book section: §4.4
> Previous: [4.2 — Policy Improvement & Policy Iteration](04-02-policy-improvement-and-policy-iteration.md) · Next: [4.4 — Async DP, GPI & Efficiency](04-04-async-dp-gpi-and-efficiency.md)

---

## 🌱 The Big Picture

Policy iteration is great, but each step contains a *full* policy evaluation (many sweeps). **Value iteration** truncates evaluation to **one single sweep** — and merges evaluation and improvement into one elegant update. It still converges to $v_*$. ✅

---

## ⚡ The update

Take the Bellman **optimality** equation and turn it into an assignment (just like policy evaluation did with the ordinary Bellman equation):

$$v_{k+1}(s) \leftarrow \max_a \sum_{s', r} p(s', r \mid s, a)\Big[r + \gamma\, v_k(s')\Big] \qquad \text{for all } s$$

Compare with one sweep of policy evaluation: the only change is replacing the policy-average $\sum_a \pi(a|s)(\cdot)$ with $\max_a(\cdot)$. Each update simultaneously asks *"what's the best I could do in one step from here?"*

**Two ways to see value iteration:**
1. Bellman optimality equation → update rule.
2. Policy iteration where evaluation is stopped after **one sweep** and improvement happens implicitly through the max.

For arbitrary $v_0$, the sequence $\{v_k\}$ converges to $v_*$.

```text
Value Iteration
repeat:
    Δ = 0
    for each state s:
        v = V(s)
        V(s) = max_a Σ_{s',r} p(s',r|s,a) [ r + γ V(s') ]
        Δ = max(Δ, |v − V(s)|)
until Δ < θ
output deterministic policy: π(s) = argmax_a Σ_{s',r} p(s',r|s,a)[r + γV(s')]
```

Note the final step: once values converge, **extract the policy** by one last greedy lookahead.

---

## 🎰 Worked example: The Gambler's Problem (book Example 4.3)

A gambler bets on coin flips. Heads → wins the stake; tails → loses it. Start with some capital $s \in \{1, \dots, 99\}$; goal: reach \$100.

- **States:** capital 1–99. **Actions:** stake $a \in \{1, \dots, \min(s, 100-s)\}$.
- **Reward:** 0 everywhere except +1 on reaching \$100. Undiscounted, episodic.
- Probability of heads $p_h = 0.4$ (an *unfair* coin — house edge!).

Value iteration converges to $v_*(s)$ = probability of winning from capital $s$. The optimal policy is wild and counterintuitive: 📉📈

- At \$50: bet **everything** (one bold flip!).
- At \$51: bet just \$1 (then you're back to ≥50 either way).
- The policy is spiky — bold play at 25, 50, 75, minimal bets elsewhere.

**Lesson:** with an unfair coin, *minimizing the number of flips* is key — every extra flip leaks expected value. Optimal policies can look bizarre but be perfectly logical. Also note: the optimal *value function* is unique, but many optimal *policies* exist (there are ties in the argmax).

---

## 🤹 Practical notes

- Faster convergence is often achieved by **interposing multiple evaluation sweeps between improvement steps** — a spectrum between pure value iteration (1 sweep) and pure policy iteration (∞ sweeps). All converge.
- Value iteration's per-sweep cost is like policy evaluation's plus a max over actions: $O(|\mathcal{S}|^2 |\mathcal{A}|)$ per sweep for typical representations.
- Like all DP, it requires sweeping the *whole* state space — painful for large problems (see next note for the fix).

---

## 🎯 Key Takeaways

1. Value iteration = Bellman **optimality** equation as an update rule: $v_{k+1}(s) = \max_a \sum_{s',r} p(\cdot)[r + \gamma v_k(s')]$.
2. It is policy iteration with evaluation **truncated to one sweep** — and it still converges to $v_*$.
3. Extract the optimal policy at the end via greedy one-step lookahead.
4. Gambler's problem: optimal behavior can be highly non-obvious; trust the math, verify with simulation.

---

➡️ **Next:** [4.4 — Asynchronous DP, Generalized Policy Iteration & Efficiency](04-04-async-dp-gpi-and-efficiency.md) — dropping the "sweep everything" requirement, and the grand unifying pattern of all RL: GPI.
