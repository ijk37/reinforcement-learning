# 9.1 — Value-function Approximation & the Prediction Objective

> **Chapter 9: On-policy Prediction with Approximation** · Book sections: §9.1–§9.2
> Previous: [8.5 — Decision-time Planning & MCTS](08-05-decision-time-planning-and-mcts.md) · Next: [9.2 — Gradient & Semi-gradient Methods](09-02-gradient-and-semi-gradient-methods.md)

---

## 🌱 The Big Picture (welcome to Part II!)

Tables die when state spaces explode. Backgammon has $10^{20}$ states; a camera image has more states than atoms in the universe. Two fatal problems: 1) **memory** — can't store a value per state; 2) **data** — most states will *never be visited even once*, so we must **generalize** from seen states to unseen ones.

**The fix:** represent the value function as a **parameterized function**

$$\hat v(s, \mathbf{w}) \approx v_\pi(s)$$

with weight vector $\mathbf{w} \in \mathbb{R}^d$, where $d \ll$ number of states. Could be a linear function of features, a neural network, a decision tree…

> Because there are far fewer weights than states, **changing one weight changes the values of many states**. That's generalization: learning about one state teaches us about many. It's also why things get tricky — improving one state's estimate can *worsen* another's. Welcome to trade-off land.

**Bonus:** function approximation also handles **partial observability** — if the features don't include some hidden aspect of the state, the function simply can't depend on it; approximate methods cope gracefully.

---

## 🔁 Value learning = supervised learning (sort of)

Every method so far updates a state's value toward a **target** ("backed-up value"):

- MC target: $S_t \mapsto G_t$
- TD(0) target: $S_t \mapsto R_{t+1} + \gamma \hat v(S_{t+1}, \mathbf{w})$
- n-step target: $S_t \mapsto G_{t:t+n}$

Treat each update as a **training example** (input $S_t$, desired output = target) and feed it to any supervised function-fitting method. But RL imposes extra demands that rule out many classical methods:

1. **Online learning** — data arrives incrementally; we must learn from it as it streams.
2. **Nonstationary targets** — in GPI, the policy keeps changing (and bootstrapping targets shift as $\mathbf{w}$ learns!). Methods that assume a fixed training set need not apply.

---

## 🎯 The Prediction Objective: $\overline{VE}$ (§9.2)

In tabular land, every state could reach its exact value independently — no objective function needed. With approximation, **we can't get all states right**: more accuracy here = less there ($d$ knobs, many more states). We must say *whose errors matter most*, via a **state weighting** $\mu(s) \geq 0$, $\sum_s \mu(s) = 1$:

$$\overline{VE}(\mathbf{w}) \doteq \sum_s \mu(s)\,\Big[v_\pi(s) - \hat v(s, \mathbf{w})\Big]^2$$

**Mean Squared Value Error**: a μ-weighted average of squared errors.

### What's μ? The on-policy distribution

Naturally: the **fraction of time spent in each state when following π** — frequently-visited states get accurate values; states never seen get whatever generalization gives them. (In continuing tasks: the stationary distribution under π; in episodic tasks it also depends on the start-state distribution.) Since we train on real on-policy experience, the data itself arrives μ-distributed — convenient!

### Honest caveats 🧂

- Is $\overline{VE}$ even the right goal? Our *real* goal is a good **policy**; the best achievable value function isn't necessarily best for that. But $\overline{VE}$ is the clear, standard objective for prediction.
- Best hope in general: converge to a **local optimum** of $\overline{VE}$ (good enough for linear methods, where local = global; less guaranteed for neural nets).
- Critically — and this becomes Chapter 11's drama — some methods (off-policy + bootstrapping + approximation) can **diverge entirely**. With approximation, convergence is a privilege, not a right.

---

## 🎯 Key Takeaways

1. Approximate $v_\pi(s)$ by $\hat v(s, \mathbf{w})$ with $d \ll |\mathcal{S}|$ weights → **generalization**, mandatory for large problems.
2. RL-as-supervised-learning: each backup is a training example — but the method must handle **online, nonstationary** data.
3. Objective: $\overline{VE} = \sum_s \mu(s)[v_\pi(s) - \hat v(s,\mathbf{w})]^2$, weighting errors by the **on-policy distribution** μ.
4. Updating one weight affects many states; per-state perfection is gone — by design.

---

➡️ **Next:** [9.2 — Stochastic-gradient & Semi-gradient Methods](09-02-gradient-and-semi-gradient-methods.md) — how to actually move $\mathbf{w}$: SGD, and the famous "semi-gradient" trick of TD.
