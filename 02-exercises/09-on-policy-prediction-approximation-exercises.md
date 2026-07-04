# Chapter 9 — On-policy Prediction with Approximation · Exercises

> Practice for notes [9.1](../01-notes/09-01-value-function-approximation.md)–[9.5](../01-notes/09-05-nonlinear-and-other-methods.md).

---

## 🧠 Conceptual

### 9.1 — Why approximation, and the cost
Why must large problems use function approximation instead of tables? What capability does this give, and what does it cost?

💡 **Hint:** Memory and unseen states → generalization → can't perfect every state.

<details>
<summary>✅ Full Answer</summary>

**Why:** huge state spaces make a per-state table infeasible in **memory**, and most states are **never visited**, so we must **generalize** from seen states to unseen ones.

**Capability gained:** with $d \ll |\mathcal{S}|$ weights, changing one weight changes many states' values → **generalization** (learning about one state informs many). It also gracefully handles partial observability (the function just can't depend on missing info).

**Cost:** we can no longer make every state's value exactly correct — improving accuracy in one region can worsen it elsewhere. We must choose *which* errors matter (the objective $\overline{VE}$ with state weighting μ), and convergence guarantees weaken.
</details>

---

### 9.2 — The prediction objective
Write the Mean Squared Value Error $\overline{VE}$ and explain the role of the weighting μ. What is the natural choice for μ in on-policy learning?

💡 **Hint:** Weight errors by how often you're in each state.

<details>
<summary>✅ Full Answer</summary>

$$\overline{VE}(\mathbf{w}) = \sum_s \mu(s)\,[v_\pi(s) - \hat v(s,\mathbf{w})]^2$$

μ(s) ≥ 0, $\sum_s \mu(s) = 1$, specifies **how much we care about each state's error**. Because we can't be accurate everywhere, μ decides where to spend representational capacity.

**Natural choice:** the **on-policy distribution** — the fraction of time spent in each state while following π (the stationary distribution in continuing tasks). Conveniently, training on real on-policy experience automatically samples states in proportion to μ.
</details>

---

### 9.3 — Semi-gradient: why "semi"?
In semi-gradient TD, what part of the true gradient is omitted, and why is it done anyway? What's the danger?

💡 **Hint:** The bootstrapped target also depends on **w**.

<details>
<summary>✅ Full Answer</summary>

The TD target $R_{t+1} + \gamma \hat v(S_{t+1}, \mathbf{w})$ **contains w** (through the bootstrapped next-state value). A true gradient would differentiate through the target too; semi-gradient **ignores** the target's dependence on w, differentiating only the estimate $\hat v(S_t, \mathbf{w})$. Hence "semi."

**Why anyway:** bootstrapping is what makes TD fast, online, and applicable to continuing tasks — we keep it. **Danger:** semi-gradient methods aren't true SGD on any objective, so the usual convergence guarantees don't hold. On-policy with linear FA it still converges (to the TD fixed point); off-policy it can **diverge** (the deadly triad, Ch. 11).
</details>

---

### 9.4 — Tile coding properties
List three reasons tile coding is the practical default for linear RL, and explain how the number of tilings sets the step size.

💡 **Hint:** Sparse, binary, fixed active count.

<details>
<summary>✅ Full Answer</summary>

Reasons:
1. **Sparse + binary features:** exactly one tile active per tiling → value = sum of a few weights → very fast.
2. **Constant number of active features** (= number of tilings) → easy, stable step-size selection and predictable computation.
3. **Controllable generalization:** tile shapes and offset patterns directly shape how broadly learning generalizes; **hashing** can bound memory.

**Step size:** with $m$ tilings, exactly $m$ features are active, so $\mathbf{x}^\top\mathbf{x} = m$. Setting $\alpha = 1/m$ makes one update move the estimate fully to the target for a state (exact one-shot fit); in practice $\alpha = (1/(\tau m))$ for learning over ~τ experiences (e.g., $0.1/m$).
</details>

---

## 🔢 Math / Worked

### 9.5 — Linear gradient is just the features
For linear $\hat v(s, \mathbf{w}) = \mathbf{w}^\top \mathbf{x}(s)$, what is $\nabla_\mathbf{w} \hat v(s, \mathbf{w})$? Write the semi-gradient TD(0) weight update explicitly.

💡 **Hint:** Differentiate a dot product w.r.t. w.

<details>
<summary>✅ Full Answer</summary>

$$\nabla_\mathbf{w} \hat v(s,\mathbf{w}) = \mathbf{x}(s)$$

So the semi-gradient TD(0) update is:

$$\mathbf{w} \leftarrow \mathbf{w} + \alpha\big[R_{t+1} + \gamma\,\mathbf{w}^\top\mathbf{x}(S_{t+1}) - \mathbf{w}^\top\mathbf{x}(S_t)\big]\,\mathbf{x}(S_t)$$

i.e., "bump each weight in proportion to its feature's value at $S_t$ and the TD error." Tabular methods are the special case where $\mathbf{x}(s)$ is a one-hot vector (one feature per state).
</details>

---

### 9.6 — The TD fixed point bound
State the quality guarantee for the TD fixed point $\mathbf{w}_{TD}$ relative to the best possible $\overline{VE}$. With γ = 0.9, what is the worst-case expansion factor? Why use TD despite this?

💡 **Hint:** The factor is $1/(1-\gamma)$.

<details>
<summary>✅ Full Answer</summary>

$$\overline{VE}(\mathbf{w}_{TD}) \leq \frac{1}{1-\gamma}\min_\mathbf{w}\overline{VE}(\mathbf{w})$$

With γ = 0.9, the factor is $1/(1-0.9) = 10$ — TD's asymptotic error could be up to 10× the best achievable (MC's target). The bound is loose in practice, though.

**Why use TD anyway:** it has **much lower variance** and **learns much faster** than MC, is fully online, and works on continuing tasks. The classic trade: MC has the better asymptote, TD the better journey — and intermediate n / λ interpolate.
</details>

---

## 💻 Code

### 9.7 — State aggregation on the 1000-state walk
Implement state aggregation (groups of 100) with Gradient Monte Carlo for the 1000-state random walk. Describe the resulting value function shape.

💡 **Hint:** Feature = which group; gradient = one-hot over groups; this reduces to a tabular update per group.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np

def state_aggregation_mc(episodes, n_states=1000, n_groups=10, alpha=2e-5, gamma=1.0):
    group_size = n_states // n_groups
    w = np.zeros(n_groups)                 # one weight per group

    def group(s): return (s - 1) // group_size
    def value(s): return w[group(s)]       # v̂(s) = w[group(s)]  (linear, one-hot feature)

    for episode in episodes:               # episode = [(state, reward_after), ...]
        states  = [s for s,_ in episode]
        rewards = [r for _,r in episode]
        G = 0.0
        for t in reversed(range(len(states))):
            G = gamma*G + rewards[t]
            s = states[t]
            # gradient is 1 for the active group, 0 elsewhere:
            w[group(s)] += alpha * (G - value(s))   # MC target = full return G
    return w
```

**Resulting shape:** a **staircase** — the true value function of this walk is nearly linear, but aggregation forces all 100 states in a group to share one value, producing flat steps. Within each group the estimate best fits the **most-visited** states (μ weighting), which you can see as the steps tilting toward where the random walk spends more time.
</details>

---

### 9.8 — Semi-gradient TD(0) with linear features
Write the per-step update loop for semi-gradient TD(0) with a generic feature function `x(s)` returning a NumPy vector.

💡 **Hint:** δ = r + γ wᵀx(s2) − wᵀx(s); w += α δ x(s).

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np

def semi_gradient_td0(env, x, d, episodes=500, alpha=0.01, gamma=1.0):
    w = np.zeros(d)
    for _ in range(episodes):
        s = env.reset(); done = False
        while not done:
            a = env.policy(s)                  # fixed policy π (prediction task)
            s2, r, done = env.step(a)
            xs = x(s)
            v_s  = w @ xs
            v_s2 = 0.0 if done else w @ x(s2)
            delta = r + gamma * v_s2 - v_s     # TD error
            w += alpha * delta * xs            # semi-gradient: gradient = features xs
            s = s2
    return w
```

Note only `x(s)` (the gradient at the *current* state) multiplies the update — the target's dependence on `w` via `x(s2)` is deliberately ignored (that's the "semi"). On-policy + linear → converges to the TD fixed point.
</details>

---

➡️ Next: [Chapter 10 — On-policy Control with Approximation exercises](10-on-policy-control-approximation-exercises.md)
