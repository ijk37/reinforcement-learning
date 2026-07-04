# Chapter 12 — Eligibility Traces · Exercises

> Practice for notes [12.1](../01-notes/12-01-lambda-return.md)–[12.4](../01-notes/12-04-sarsa-lambda-and-off-policy-traces.md).

---

## 🧠 Conceptual

### 12.1 — The λ-return
Define the λ-return and state what λ = 0 and λ = 1 reduce to.

💡 **Hint:** A geometric average of all n-step returns.

<details>
<summary>✅ Full Answer</summary>

$$G_t^\lambda = (1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}\,G_{t:t+n}$$

It's a weighted average of **all** n-step returns, with weights $(1-\lambda)\lambda^{n-1}$ that decay geometrically (and sum to 1).

- **λ = 0:** only the n=1 term survives → $G_t^0 = G_{t:t+1}$ = the **TD(0)** target.
- **λ = 1:** all weight collapses onto the full return → $G_t^1 = G_t$ = the **Monte Carlo** target.

So λ is a continuous dial between TD and MC.
</details>

---

### 12.2 — Forward vs. backward view
Distinguish the forward view from the backward view. Why is the backward view (TD(λ)) a breakthrough?

💡 **Hint:** Looking ahead (acausal) vs. spreading the current error backward (online).

<details>
<summary>✅ Full Answer</summary>

- **Forward view:** for each state, look *ahead* at future rewards/states to compute $G_t^\lambda$ as the update target. Conceptually clean but **acausal** — it needs the future, so it isn't directly implementable online.
- **Backward view (TD(λ)):** maintain an **eligibility trace** $\mathbf{z}$ that remembers recently-visited states; when a TD error δ occurs, broadcast it *backward* to all eligible states at once: $\mathbf{w} \mathrel{+}= \alpha\delta\mathbf{z}$.

**Breakthrough:** the backward view is fully **online, incremental, causal**, and costs only one extra vector — yet it (nearly) reproduces the forward-view λ-return updates. It makes the elegant λ-return idea practical.
</details>

---

### 12.3 — What the trace represents
Describe what the eligibility trace encodes and how it updates. What roles do γ and λ play in its decay?

💡 **Hint:** $\mathbf{z} \leftarrow \gamma\lambda\mathbf{z} + \nabla\hat v$.

<details>
<summary>✅ Full Answer</summary>

The trace marks **which weights/states recently contributed** to value predictions — they are "eligible" for credit or blame when a TD error arrives. Update:

$$\mathbf{z}_t = \gamma\lambda\,\mathbf{z}_{t-1} + \nabla\hat v(S_t,\mathbf{w})$$

Each step: **decay** the whole trace by $\gamma\lambda$, then **bump** the components for the just-visited state. So recently/frequently visited states have larger traces and receive more of the error. **γ** (discounting) and **λ** (the trace-decay parameter) together set how far back credit reaches — a longer effective memory as $\gamma\lambda \to 1$.
</details>

---

### 12.4 — Trace types & when to use traces
Compare accumulating, dutch, and replacing traces. Then: when are eligibility traces worth using vs. not?

💡 **Hint:** Dutch traces give exact online equivalence; traces shine when data is scarce.

<details>
<summary>✅ Full Answer</summary>

- **Accumulating traces:** $\mathbf{z} \mathrel{+}= \nabla\hat v$ (after decay) — the classic TD(λ) trace; can over-accumulate for frequently visited features.
- **Dutch traces:** a slightly modified recursion that makes the *online* updates **exactly** equal the (ideal) online λ-return algorithm for linear FA — the principled modern choice.
- **Replacing traces:** for binary features, reset the active component to 1 instead of adding — an older heuristic, largely superseded by dutch traces.

**When to use traces:** when **data/experience is scarce or non-repeatable** (e.g., online robots) — traces extract more learning per transition, and give MC-like robustness while staying online. **When not:** when **data is cheap** (simulators, replay buffers) and compute is the bottleneck — simple one-step methods can process more data per unit compute.
</details>

---

## 🔢 Math / Worked

### 12.5 — λ-return weights
For λ = 0.8, compute the weight assigned to the 1-step, 2-step, and 3-step returns in $G_t^\lambda$ (assume a long/infinite episode). What fraction of total weight is on the first three returns?

💡 **Hint:** Weight on the n-step return is $(1-\lambda)\lambda^{n-1}$.

<details>
<summary>✅ Full Answer</summary>

$(1-\lambda) = 0.2$.
- 1-step: $0.2 \times 0.8^0 = 0.2$
- 2-step: $0.2 \times 0.8^1 = 0.16$
- 3-step: $0.2 \times 0.8^2 = 0.128$

Sum of first three = $0.2 + 0.16 + 0.128 = 0.488$ → about **49%** of the total weight is on the first three returns. The weights decay geometrically by a factor of λ = 0.8 each step; the "time constant" is roughly $1/(1-\lambda) = 5$ steps.
</details>

---

### 12.6 — Trace decay by hand
A tabular state is visited at t=0, then not again. With γ = 1, λ = 0.9, accumulating trace, give its trace value at t=0, 1, 2, 3 (trace = 1 when visited).

💡 **Hint:** Multiply by γλ each step after the visit.

<details>
<summary>✅ Full Answer</summary>

At t=0 the state is visited so its trace becomes 1 (after decay of the prior 0 + bump). Then it decays by $\gamma\lambda = 0.9$ each step:
- t=0: 1.0
- t=1: 0.9
- t=2: 0.81
- t=3: 0.729

So a TD error two steps later (t=2) would update this state's value by `α · δ · 0.81` — recent-but-fading credit.
</details>

---

## 💻 Code

### 12.7 — Tabular TD(λ) prediction
Implement online tabular TD(λ) with accumulating traces for state-value prediction.

💡 **Hint:** Keep a trace dict `z`; decay all entries by γλ each step, bump the current state, then `V += α δ z` for all states with nonzero trace.

<details>
<summary>✅ Full Answer</summary>

```python
from collections import defaultdict

def td_lambda(env, episodes=500, alpha=0.1, gamma=1.0, lam=0.9):
    V = defaultdict(float)
    for _ in range(episodes):
        z = defaultdict(float)                       # eligibility traces
        s = env.reset(); done = False
        while not done:
            a = env.policy(s)                        # fixed policy (prediction)
            s2, r, done = env.step(a)
            delta = r + (0.0 if done else gamma * V[s2]) - V[s]
            z[s] += 1.0                              # accumulating trace bump
            # broadcast the TD error to all eligible states
            for state, trace in list(z.items()):
                V[state] += alpha * delta * trace
                z[state] = gamma * lam * trace       # decay
                if z[state] < 1e-8:
                    del z[state]                     # prune negligible traces (sparse)
            s = s2
    return V
```

One δ updates *every recently visited state*, scaled by its trace. λ = 0 makes `z[s]` the only nonzero trace → exactly TD(0); λ = 1 (γ = 1) accumulates so the episode's total update equals a Monte Carlo update — but computed fully online.
</details>

---

### 12.8 — Extend to Sarsa(λ)
Describe the changes to 12.7 to get tabular Sarsa(λ) for control.

💡 **Hint:** Traces over (s,a) pairs; ε-greedy; δ uses Q(s′,a′).

<details>
<summary>✅ Full Answer</summary>

```python
# Q[(s,a)] instead of V[s]; traces z keyed by (s,a).
# Choose a = ε-greedy(Q, s) BEFORE the loop, and a2 = ε-greedy(Q, s2) each step.
delta = r + (0 if done else gamma * Q[(s2, a2)]) - Q[(s, a)]
z[(s, a)] += 1.0
for sa, trace in list(z.items()):
    Q[sa] += alpha * delta * trace
    z[sa] = gamma * lam * trace
s, a = s2, a2
```

Changes: (1) values and traces are keyed by **state–action pairs**; (2) actions are chosen **ε-greedily** from Q (control, with improvement built in); (3) the TD error uses the **next chosen action's** Q-value $Q(S_{t+1}, A_{t+1})$ (on-policy, Sarsa-style). Result: graded credit fading along the whole trajectory — exactly the gridworld picture from note 12.4.
</details>

---

➡️ Next: [Chapter 13 — Policy Gradient Methods exercises](13-policy-gradient-exercises.md)
