# 4.2 — Policy Improvement & Policy Iteration

> **Chapter 4: Dynamic Programming** · Book sections: §4.2–§4.3
> Previous: [4.1 — Policy Evaluation](04-01-policy-evaluation.md) · Next: [4.3 — Value Iteration](04-03-value-iteration.md)

---

## 🌱 The Big Picture

We can evaluate a policy. Now the payoff: use the value function to **find a better policy**, then evaluate *that* one, improve again… until no improvement is possible — at which point we've found an **optimal** policy. This loop is **policy iteration**, the grandfather of most control algorithms in RL.

---

## 📈 Policy Improvement (§4.2)

Suppose we know $v_\pi$ for some deterministic policy π. In state $s$, should we deviate from π and pick a different action $a$? Evaluate that with the action value:

$$q_\pi(s, a) = \sum_{s', r} p(s', r \mid s, a)\Big[r + \gamma\, v_\pi(s')\Big]$$

*"Take $a$ once, follow π afterwards."* If $q_\pi(s, a) > v_\pi(s)$, then deviating is better at $s$ — and the **policy improvement theorem** guarantees that switching to $a$ *every time* you visit $s$ gives a policy that is better **overall**:

> **Policy improvement theorem:** if $q_\pi(s, \pi'(s)) \geq v_\pi(s)$ for all states $s$, then $\pi' \geq \pi$ (i.e., $v_{\pi'}(s) \geq v_\pi(s)$ everywhere). Strict inequality at any state gives strict improvement.

### The greedy policy

Why stop at changing one state? Improve at **all** states simultaneously — define the **greedy policy**:

$$\pi'(s) \doteq \underset{a}{\arg\max}\; q_\pi(s,a) = \underset{a}{\arg\max} \sum_{s',r} p(s',r \mid s,a)\big[r + \gamma v_\pi(s')\big]$$

By construction it satisfies the theorem's condition, so **the greedy policy is always ≥ the original**. And the kicker:

> If the greedy policy is *no better* than π (i.e., $v_{\pi'} = v_\pi$), then $v_\pi$ satisfies the **Bellman optimality equation** — meaning **π was already optimal!**

So policy improvement always either strictly improves the policy or certifies it optimal. (The argument extends to stochastic policies too.)

---

## 🔄 Policy Iteration (§4.3)

Alternate the two operations until stable:

$$\pi_0 \xrightarrow{\text{Evaluate}} v_{\pi_0} \xrightarrow{\text{Improve}} \pi_1 \xrightarrow{\text{E}} v_{\pi_1} \xrightarrow{\text{I}} \pi_2 \xrightarrow{\text{E}} \cdots \xrightarrow{\text{I}} \pi_* \xrightarrow{\text{E}} v_*$$

```text
1. Initialization:
     V(s) arbitrary; π(s) arbitrary

2. Policy Evaluation:
     run iterative policy evaluation for current π (until Δ < θ)

3. Policy Improvement:
     policy_stable = true
     for each state s:
         old_action = π(s)
         π(s) = argmax_a Σ_{s',r} p(s',r|s,a)[r + γV(s')]
         if old_action ≠ π(s): policy_stable = false
     if policy_stable: stop, return V ≈ v*, π ≈ π*
     else: go to 2
```

**Why it terminates:** a finite MDP has only finitely many deterministic policies, and each iteration strictly improves (or stops) → convergence to an optimal policy in **finitely many iterations**. In practice it converges *remarkably* fast — often just a few iterations.

### Worked example: Jack's Car Rental 🚗 (book Example 4.2)

Jack manages two rental locations. Rentals earn $10 each; overnight he may move up to 5 cars between locations at $2 per car. Demand and returns are Poisson-random. State = (#cars at loc 1, #cars at loc 2); action = net cars moved; γ = 0.9.

Policy iteration starts from "never move cars" and after just **4 improvements** settles on the optimal policy — a smooth surface dictating how many cars to shuttle for every inventory combination. A nice example of an MDP that is *not* a toy gridworld.

### Mind-bender example: Gambler's Problem note 💰
(§4.4's example, but worth mentioning) — policy iteration's cousin value iteration solves it; see next note.

---

## ⚠️ A subtlety worth knowing

If policy evaluation is run *to convergence* each time, policy iteration can be slow — each evaluation is itself an iterative computation. Do we really need an exact $v_\pi$ before improving? **No!** This observation leads directly to **value iteration** (next note) and, more generally, to **generalized policy iteration** (note 4.4) — the pattern underlying nearly all of RL.

---

## 🎯 Key Takeaways

1. **Policy improvement theorem:** acting greedily w.r.t. $v_\pi$ never makes a policy worse; usually strictly better.
2. Greedy policy: $\pi'(s) = \arg\max_a q_\pi(s,a)$ — one-step lookahead on current values.
3. **Policy iteration** = Evaluate ⇄ Improve until stable → guaranteed optimal in finite iterations.
4. "No improvement possible" ⇨ Bellman optimality satisfied ⇨ already optimal.

---

➡️ **Next:** [4.3 — Value Iteration](04-03-value-iteration.md) — what happens if you truncate policy evaluation to a *single sweep*?
