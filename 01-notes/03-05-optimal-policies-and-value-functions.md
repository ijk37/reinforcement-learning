# 3.5 — Optimal Policies and Optimal Value Functions

> **Chapter 3: Finite Markov Decision Processes** · Book sections: §3.6–§3.8
> Previous: [3.4 — The Bellman Equation](03-04-bellman-equations.md) · Next: [4.1 — Policy Evaluation](04-01-policy-evaluation.md)

---

## 🌱 The Big Picture

We can now state precisely what "solving" an RL problem means: finding an **optimal policy** — one that gets as much reward as possible in the long run. This note defines optimality and presents the **Bellman optimality equation**, the single most load-bearing equation in RL.

---

## 🥇 What makes a policy optimal?

Define a partial ordering: policy $\pi \geq \pi'$ if $v_\pi(s) \geq v_{\pi'}(s)$ **for every state** $s$.

> **Fact:** for any finite MDP there is always at least one policy that is ≥ all others. That is an **optimal policy**, denoted $\pi_*$ (there may be several, but…)

…all optimal policies share the same value functions:

$$v_*(s) \doteq \max_\pi v_\pi(s) \qquad\qquad q_*(s,a) \doteq \max_\pi q_\pi(s,a)$$

called the **optimal state-value function** and **optimal action-value function**. They relate by:

$$q_*(s,a) = \mathbb{E}[R_{t+1} + \gamma\, v_*(S_{t+1}) \mid S_t = s, A_t = a]$$

---

## ⭐ The Bellman Optimality Equation

The value of a state under an optimal policy must equal the expected return of the **best action** from that state (no policy-averaging anymore — just take the max!):

$$\boxed{\;v_*(s) = \max_a \sum_{s'} \sum_r p(s', r \mid s, a)\Big[r + \gamma\, v_*(s')\Big]\;}$$

And for action values:

$$q_*(s,a) = \sum_{s'} \sum_r p(s', r \mid s, a)\Big[r + \gamma \max_{a'} q_*(s', a')\Big]$$

### Compare side by side 👀

| Bellman **expectation** equation (for $v_\pi$) | Bellman **optimality** equation (for $v_*$) |
|---|---|
| $\sum_a \pi(a\|s) \dots$ — average over the policy's choices | $\max_a \dots$ — take the **best** action |
| Linear system → easy to solve | **Nonlinear** (because of max) → needs iterative methods |
| Evaluates a *given* policy | Characterizes the *best possible* values |

For finite MDPs the Bellman optimality equation has a **unique solution**, independent of any policy.

---

## 🔓 Why $v_*$ and $q_*$ unlock everything

**Given $v_*$:** a simple **one-step-ahead greedy** policy is optimal! In each state, pick the action whose one-step lookahead value $\sum_{s',r} p(s',r|s,a)[r + \gamma v_*(s')]$ is largest. The beauty: a greedy, short-term-looking search yields *long-term* optimal behavior, because $v_*$ already bakes in all future consequences.

**Given $q_*$:** even easier — no lookahead, no model needed:

$$\pi_*(s) = \underset{a}{\arg\max}\; q_*(s, a)$$

Just consult the table. This is why so much of RL focuses on learning action values.

**Gridworld example 🗺️:** solving the Bellman optimality equation for the 5×5 gridworld from the previous note gives $v_*(A) = 24.4$ (vs. 8.8 under the random policy) — the optimal policy makes a beeline back to A to keep collecting the +10 teleport.

---

## 🧗 Optimality and Approximation (§3.7) — a dose of realism

Explicitly solving the Bellman optimality equation requires three things that are **almost never all true**:

1. You accurately know the dynamics $p(s', r|s,a)$;
2. You have enough computation to solve it (think: chess has ~$10^{47}$ states — even a fast computer would need millennia);
3. The states are Markov.

So in practice, RL = **approximately** solving the Bellman optimality equation. And here is a key insight that makes RL special:

> The **online** nature of RL lets it put effort into learning good decisions for **frequently encountered** states, at the expense of rarely-seen ones. (TD-Gammon plays expert backgammon yet might choose badly on board positions that never occur in real games — who cares!)

Memory limits also force approximation: small problems can use **tables** (one entry per state — "tabular methods", Part I of the book); large problems need **parameterized function approximation** (Part II).

---

## 🎯 Key Takeaways (and Chapter 3 wrap-up)

1. $\pi_*$ = a policy whose value is ≥ every other policy's in *every* state; it always exists for finite MDPs.
2. **Bellman optimality equation**: $v_*(s) = \max_a \sum_{s',r} p(s',r|s,a)[r + \gamma v_*(s')]$ — like the Bellman equation but with **max instead of average**.
3. Given $v_*$ → greedy one-step lookahead is optimal. Given $q_*$ → just argmax, **no model needed**.
4. Exact solution is usually impossible (model, compute, memory) → the entire rest of the book is about **approximation**.
5. Chapter 3 gave us the *problem*; Chapters 4–8 give increasingly practical *solutions* (DP → Monte Carlo → TD → planning).

---

➡️ **Next chapter:** [4.1 — Policy Evaluation](04-01-policy-evaluation.md) — our first solution method: dynamic programming, which assumes a perfect model and computes value functions by iterative sweeps.
