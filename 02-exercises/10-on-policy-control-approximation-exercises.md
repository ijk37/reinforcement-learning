# Chapter 10 — On-policy Control with Approximation · Exercises

> Practice for notes [10.1](../01-notes/10-01-episodic-semi-gradient-control.md)–[10.2](../01-notes/10-02-average-reward-setting.md).

---

## 🧠 Conceptual

### 10.1 — Episodic semi-gradient Sarsa
Write the semi-gradient Sarsa update for $\hat q(s,a,\mathbf{w})$ and explain how the policy-improvement step works under function approximation.

💡 **Hint:** Same as semi-gradient TD but on action values; act ε-greedy over $\hat q$.

<details>
<summary>✅ Full Answer</summary>

$$\mathbf{w} \leftarrow \mathbf{w} + \alpha\big[R_{t+1} + \gamma\,\hat q(S_{t+1},A_{t+1},\mathbf{w}) - \hat q(S_t,A_t,\mathbf{w})\big]\nabla \hat q(S_t,A_t,\mathbf{w})$$

**Improvement:** in each state, evaluate $\hat q(S_t, a, \mathbf{w})$ for all actions and act **ε-greedily** (mostly pick the argmax, occasionally random). There's no separate policy storage — the policy is implicit in $\hat q$ and improves automatically as the weights learn. This works cleanly for small discrete action sets; large/continuous action spaces need other approaches (e.g., policy gradients, Ch. 13).
</details>

---

### 10.2 — Mountain Car: why it's hard
Why does the Mountain Car task defeat a short-sighted controller, and what makes it a good test of value-based control?

💡 **Hint:** You must move *away* from the goal first.

<details>
<summary>✅ Full Answer</summary>

The car's engine is too weak to climb the goal hill directly. The solution requires **first driving backward up the opposite slope** to build potential energy, then accelerating forward — i.e., things must **get worse (move away from the goal) before they get better**. A controller that greedily reduces distance-to-goal fails.

It's a great test because the value function must encode this non-obvious, momentum-dependent structure over a **continuous 2D state** (position, velocity), so it exercises function approximation (tile coding) + bootstrapping control together. Optimistic initialization drives exploration with no ε needed.
</details>

---

### 10.3 — Average reward and "deprecating discounting"
In the continuing + function-approximation setting, the book argues discounting becomes pointless. Summarize the argument and its root cause.

💡 **Hint:** The discounted objective is proportional to the average-reward rate, for every γ.

<details>
<summary>✅ Full Answer</summary>

For continuing tasks with FA, the average of the discounted return over the on-policy distribution turns out to equal $\frac{1}{1-\gamma}\, r(\pi)$ — **proportional to the average reward rate** $r(\pi)$. Since the proportionality constant doesn't depend on the policy, **every γ induces the same ranking of policies** → the discount factor changes nothing about which policy is best.

**Root cause:** with function approximation we **lose the policy improvement theorem** (we can't change states independently), so there's no guarantee a discounted "improvement" helps overall. The principled formulation for continuing control + FA is therefore the **average-reward** setting, using differential values. (γ remains meaningful for episodic tasks and as a solution-method parameter.)
</details>

---

## 🔢 Math / Worked

### 10.4 — Differential TD error
Write the differential (average-reward) TD error and its associated update for the average-reward estimate $\bar R$. How does it differ from the discounted TD error?

💡 **Hint:** Subtract the average reward; drop γ.

<details>
<summary>✅ Full Answer</summary>

$$\delta_t = R_{t+1} - \bar R_t + \hat v(S_{t+1},\mathbf{w}) - \hat v(S_t,\mathbf{w})$$
$$\bar R_{t+1} = \bar R_t + \beta\,\delta_t$$

Differences from the discounted error $R_{t+1} + \gamma\hat v(S_{t+1}) - \hat v(S_t)$:
1. **No γ** — there's no discounting in the average-reward setting.
2. **Subtract $\bar R$** — rewards are measured *relative to the running average reward rate*, so values become **differential** ("how much better than average is this state?").

$\bar R$ is itself learned online with step size β.
</details>

---

## 💻 Code

### 10.5 — Tile-coded semi-gradient Sarsa (Mountain Car)
Sketch the implementation: feature construction with tile coding over (position, velocity)×action, ε-greedy action selection, and the Sarsa update.

💡 **Hint:** Active features = the tiles for (s, a); $\hat q$ = sum of their weights; gradient = indicator over active tiles.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np

# Assume a tile coder: active_tiles(s, a) -> list of integer feature indices (binary features)
def q_hat(w, tiles):           return w[tiles].sum()           # linear, binary features
def grad_update(w, tiles, step):
    w[tiles] += step           # gradient is 1 on active tiles, 0 elsewhere

def sarsa_mountain_car(env, tilecoder, d, episodes=500,
                       alpha=0.1/8, gamma=1.0, epsilon=0.0):   # 8 tilings -> alpha=0.1/8
    w = np.zeros(d)            # optimistic init (zeros) since true q is negative

    def act(s):
        if np.random.random() < epsilon:
            return np.random.randint(env.n_actions)
        qs = [q_hat(w, tilecoder(s, a)) for a in range(env.n_actions)]
        return int(np.argmax(qs))

    for _ in range(episodes):
        s = env.reset(); a = act(s); done = False
        while not done:
            s2, r, done = env.step(a)
            tiles = tilecoder(s, a)
            delta = r - q_hat(w, tiles)
            if done:
                grad_update(w, tiles, alpha * delta)
                break
            a2 = act(s2)
            delta += gamma * q_hat(w, tilecoder(s2, a2))
            grad_update(w, tiles, alpha * delta)
            s, a = s2, a2
    return w
```

Key points: **binary tile features** make $\hat q$ a simple sum and the gradient an indicator (so the update just adds `α·δ` to active tiles); **optimistic zeros** drive exploration because true action values are negative (−1 per step), so unvisited (s,a) look attractive — no ε required.
</details>

---

➡️ Next: [Chapter 11 — Off-policy Methods with Approximation exercises](11-off-policy-approximation-exercises.md)
