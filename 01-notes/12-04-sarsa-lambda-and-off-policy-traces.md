# 12.4 — Sarsa(λ), Watkins's Q(λ) & Off-policy Traces

> **Chapter 12: Eligibility Traces** · Book sections: §12.7–§12.13
> Previous: [12.3 — True Online TD(λ)](12-03-true-online-td-lambda.md) · Next: [13.1 — Policy Approximation & Its Advantages](13-01-policy-approximation-and-advantages.md)

---

## 🎮 Sarsa(λ) (§12.7) — traces for control

Mechanical extension to action values: action-value λ-return + action-value traces.

```text
Sarsa(λ) with binary features & linear FA:
z = 0
for each step:
    take A → R, S′;  choose A′ (ε-greedy)
    δ = R + γ q̂(S′,A′,w) − q̂(S,A,w)
    z ← γλ z + ∇q̂(S,A,w)        (accumulating; or dutch / replacing variants)
    w ← w + α δ z
    S,A ← S′,A′
```

(True-online Sarsa(λ) exists too and performs best — e.g., on Mountain Car.)

### The picture worth a thousand updates 🗺️ (book Figure 12.10)

Gridworld, all values initially 0, one reward at goal G. After one episode reaching G:

- **1-step Sarsa:** strengthens only the **final** action.
- **n-step (10) Sarsa:** strengthens the last 10 actions **equally**.
- **Sarsa(λ), λ=0.9:** strengthens **all** actions of the episode, **fading with distance from the goal** — smooth, graded credit assignment all the way back. 🌈

---

## 🔀 Off-policy traces

**Variable λ and γ (§12.8):** the modern unified view lets λ and γ be *functions of state* ($\lambda_t = \lambda(S_t)$, $\gamma_t = \gamma(S_t)$ — "termination/bootstrapping functions"), unifying episodic & continuing tasks (γ=0 at "terminal" states) and enabling flexible per-state bootstrapping. Mostly notation to recognize when reading research papers.

**Off-policy traces with control variates (§12.9):** fold importance-sampling ratios *into the trace recursion*, e.g. $\mathbf{z}_t = \rho_t(\gamma_t\lambda_t \mathbf{z}_{t-1} + \nabla\hat v)$ — per-decision corrections, lower variance than weighting whole returns, exact in expectation but still variance-prone in samples.

**Watkins's Q(λ) → Tree-Backup(λ) (§12.10):**
- **Watkins's Q(λ):** Q-learning with traces — but the moment a **non-greedy** action is taken, the trace is **cut to zero** (the future no longer reflects the greedy target policy). Simple; horizon shrinks with exploration.
- **Tree-Backup(λ):** the λ-version of Chapter 7's tree backup — no importance sampling, the trace fades by the *target policy's probability* of the taken actions ($\mathbf{z}_t = \gamma_t\lambda_t\,\pi(A_t|S_t)\,\mathbf{z}_{t-1} + \nabla\hat q$). The natural off-policy trace method.

**Stability (§12.11):** Gradient-TD and Emphatic-TD ideas extend to traces (GTD(λ), HTD(λ), Emphatic TD(λ)) — guaranteeing off-policy convergence with the usual extra cost/variance trade-offs.

**Implementation (§12.12):** with sparse features (tile coding!), almost all trace components are ~0 — track only the nonzero ones; trace-based methods then cost barely more than one-step methods.

---

## 📋 Chapter 12 wrap-up: should you use traces?

| Situation | Verdict |
|---|---|
| Data is scarce / experience can't be repeated (online robots) | **Traces shine** — squeeze more from each transition 🟢 |
| Data is cheap (simulators, replay buffers) | Often *not* worth it — cheap one-step methods (DQN-style) process more data for the same compute 🟡 |
| Need fast multi-step credit assignment, fully online | Traces (or n-step) — choose λ by cross-validation-ish tuning 🟢 |

Traces give MC-like benefits (robustness to delayed rewards, non-Markov-ness) while remaining **online and incremental**, with a one-vector overhead. λ near 1 brings MC's variance; λ = 0 brings TD's bias. As always: the interior wins.

---

## 🎯 Key Takeaways

1. **Sarsa(λ):** graded, fading credit along the whole trajectory — beautiful and effective control.
2. **Watkins's Q(λ)** cuts traces at exploratory actions; **Tree-Backup(λ)** fades traces by target-policy probabilities (no IS).
3. Variable λ, γ unify episodic/continuing and per-state bootstrapping (research-paper literacy!).
4. Use traces when **data is precious**; skip them when data is cheap and compute is the bottleneck.

---

➡️ **Next chapter:** [13.1 — Policy Gradient Methods](13-01-policy-approximation-and-advantages.md) — the road not yet taken: skip value-greedification entirely and **optimize the policy directly**.
