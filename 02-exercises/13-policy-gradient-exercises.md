# Chapter 13 — Policy Gradient Methods · Exercises

> Practice for notes [13.1](../01-notes/13-01-policy-approximation-and-advantages.md)–[13.4](../01-notes/13-04-actor-critic-and-continuous-actions.md).
> ⭐ The foundation of modern deep RL (PPO, A2C, SAC…).

---

## 🧠 Conceptual

### 13.1 — Why parameterize the policy?
Give three advantages of learning $\pi(a|s,\boldsymbol{\theta})$ directly over action-value + ε-greedy methods.

💡 **Hint:** Stochastic optima, continuous actions, smoothness.

<details>
<summary>✅ Full Answer</summary>

1. **Exact stochastic policies:** in partially observable problems the optimal policy may need *specific* action probabilities (e.g., bluff 59% of the time). ε-greedy can't express arbitrary probabilities; a parameterized softmax can.
2. **Continuous action spaces:** no "max over actions" needed — just output the parameters of an action distribution (e.g., a Gaussian's mean/spread). Greedification can't enumerate infinite actions.
3. **Smooth policy changes:** the policy changes continuously with θ, avoiding the discontinuous jumps of ε-greedy when an argmax flips. This smoothness enables stronger convergence guarantees.

(Also: easy to inject prior knowledge via the parameterization; sometimes the policy is simpler than the value function.)
</details>

---

### 13.2 — The policy gradient theorem's magic
State the policy gradient theorem and explain what makes it remarkable (the thing that *doesn't* appear).

💡 **Hint:** No gradient of the state distribution.

<details>
<summary>✅ Full Answer</summary>

$$\nabla J(\boldsymbol{\theta}) \propto \sum_s \mu(s)\sum_a q_\pi(s,a)\,\nabla\pi(a|s,\boldsymbol{\theta})$$

**Remarkable because:** performance depends on θ both through the *actions chosen* **and** through the *distribution of states visited* — and the state distribution depends on the unknown environment dynamics. Yet the theorem shows **the gradient of the state distribution does not appear**. The performance gradient is expressible purely from quantities we can sample: state visitation μ, action values $q_\pi$, and the *policy's own* gradient $\nabla\pi$. This is what makes policy-gradient learning possible from experience alone.
</details>

---

### 13.3 — Baseline: why it helps and stays unbiased
Why does subtracting a baseline $b(s)$ from the return in REINFORCE reduce variance without introducing bias?

💡 **Hint:** $\sum_a b(s)\nabla\pi(a|s) = b(s)\nabla 1 = 0$.

<details>
<summary>✅ Full Answer</summary>

**Unbiased:** the expected contribution of the baseline term is zero, because
$$\sum_a b(s)\nabla\pi(a|s) = b(s)\nabla\sum_a \pi(a|s) = b(s)\nabla 1 = 0.$$
Since $b(s)$ doesn't depend on the action, it can't bias the gradient estimate.

**Variance reduction:** the update is driven by $G_t - b(S_t)$. With a good baseline (e.g., $\hat v(S_t)$), this becomes "**did this outcome beat expectation?**" In states where all actions yield high returns, raw REINFORCE pushes everything up (noisy waste); subtracting the baseline reinforces only *better-than-expected* outcomes, drastically cutting variance and speeding learning.
</details>

---

### 13.4 — Baseline vs. critic
A learned $\hat v(s)$ can serve as a baseline (REINFORCE) or as a bootstrapping critic (actor–critic). What's the difference, and what does each cost/buy?

💡 **Hint:** Subtracted from a full MC return vs. used inside a one-step TD target.

<details>
<summary>✅ Full Answer</summary>

- **As a baseline (REINFORCE with baseline):** $\hat v$ is merely *subtracted* from the full Monte Carlo return $G_t$. No bootstrapping → the gradient estimate stays **unbiased**, but updates are MC-grade: high variance, episode-end only.
- **As a critic (actor–critic):** $\hat v$ is used to **bootstrap** — the return is replaced by the one-step target, so the actor is driven by the **TD error** $\delta_t = R_{t+1} + \gamma\hat v(S_{t+1}) - \hat v(S_t)$. This **introduces bias** but slashes variance and makes learning **fully online and incremental** (works on continuing tasks).

So: baseline buys variance reduction with no bias; critic buys (much more) variance reduction + online-ness at the price of bias.
</details>

---

## 🔢 Math / Worked

### 13.5 — Softmax policy gradient
For a softmax policy over linear action preferences $h(s,a,\boldsymbol{\theta}) = \boldsymbol{\theta}^\top\mathbf{x}(s,a)$, write $\nabla \ln\pi(a|s,\boldsymbol{\theta})$ and interpret it.

💡 **Hint:** Features of the taken action minus the expected features.

<details>
<summary>✅ Full Answer</summary>

$$\nabla \ln\pi(a|s,\boldsymbol{\theta}) = \mathbf{x}(s,a) - \sum_b \pi(b|s,\boldsymbol{\theta})\,\mathbf{x}(s,b)$$

**Interpretation:** it's the **feature vector of the taken action minus the policy-averaged feature vector**. Pushing θ along this direction increases the preference (and thus probability) of action $a$ *relative to* the average action. When weighted by a positive return/advantage in the update, it makes good actions more likely; when weighted by a negative one, less likely. This vector is the "eligibility" that every policy-gradient algorithm uses.
</details>

---

### 13.6 — One REINFORCE update by hand
Two actions, current $\pi = (0.6, 0.4)$. You take action 1 (prob 0.6), the episode return is $G = 2$, baseline $b = 1.5$, step size $\alpha = 0.1$, $\gamma^t = 1$. Using the softmax eligibility $\nabla\ln\pi(a_1) = \mathbf{x}(a_1) - \sum_b \pi(b)\mathbf{x}(b)$ with simple indicator features $\mathbf{x}(a_1)=[1,0], \mathbf{x}(a_2)=[0,1]$, compute the parameter update Δθ.

💡 **Hint:** Δθ = α(G−b)∇lnπ; compute the eligibility vector first.

<details>
<summary>✅ Full Answer</summary>

Eligibility for taken action $a_1$:
$$\nabla\ln\pi(a_1) = [1,0] - (0.6[1,0] + 0.4[0,1]) = [1,0] - [0.6, 0.4] = [0.4, -0.4]$$

Advantage: $G - b = 2 - 1.5 = 0.5$.

$$\Delta\boldsymbol{\theta} = \alpha(G-b)\nabla\ln\pi(a_1) = 0.1 \times 0.5 \times [0.4, -0.4] = [0.02, -0.02]$$

So θ₁ rises and θ₂ falls → action 1's preference (and probability) increases, action 2's decreases. The outcome beat the baseline, so the action just taken is reinforced.
</details>

---

## 💻 Code

### 13.7 — Implement REINFORCE (with baseline)
Sketch a REINFORCE-with-baseline agent for a discrete-action episodic task: collect an episode, compute returns, update a softmax policy and a value baseline.

💡 **Hint:** Two parameter sets (policy θ, value w); update per time step using $G_t$ and $G_t - \hat v$.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np

def reinforce_baseline(env, episodes=1000, alpha_theta=2e-3, alpha_w=1e-2, gamma=0.99):
    d = env.feature_dim
    theta = np.zeros((env.n_actions, d))    # softmax preferences (linear)
    w     = np.zeros(d)                      # value baseline (linear)

    def policy_probs(x):
        h = theta @ x                        # preferences per action
        h -= h.max()                         # numerical stability
        e = np.exp(h); return e / e.sum()

    for _ in range(episodes):
        # --- generate one episode ---
        traj = []                            # list of (x, a, r)
        s = env.reset(); done = False
        while not done:
            x = env.features(s)
            p = policy_probs(x)
            a = np.random.choice(env.n_actions, p=p)
            s2, r, done = env.step(a)
            traj.append((x, a, r)); s = s2

        # --- compute returns and update ---
        G = 0.0
        for t in reversed(range(len(traj))):
            x, a, r = traj[t]
            G = gamma * G + r                            # return from t
            v = w @ x
            delta = G - v                                # advantage (baseline subtracted)
            # baseline (value) update — MC target:
            w += alpha_w * delta * x
            # policy update — eligibility = x for taken action minus expected x:
            p = policy_probs(x)
            grad_log = -np.outer(p, x); grad_log[a] += x  # ∇ln π for all action rows
            theta += alpha_theta * (gamma**t) * delta * grad_log
    return theta, w
```

`delta = G - v` is the baseline-corrected signal; `grad_log[a] += x` then `-= p*x` implements $\mathbf{x}(s,a) - \sum_b\pi(b)\mathbf{x}(s,b)$ across action rows. Drop the baseline (`delta = G`) to get plain REINFORCE — you'll see noticeably higher variance.
</details>

---

### 13.8 — Convert to one-step Actor–Critic
Describe the minimal changes to turn 13.7 into a one-step actor–critic (online, no full-episode return).

💡 **Hint:** Replace G with the bootstrapped TD error; update every step.

<details>
<summary>✅ Full Answer</summary>

```python
# Instead of collecting a whole episode and using G_t, update each step:
x  = env.features(s)
a  = np.random.choice(env.n_actions, p=policy_probs(x))
s2, r, done = env.step(a)
x2 = env.features(s2)

delta = r + (0.0 if done else gamma * (w @ x2)) - (w @ x)   # TD error (bootstrapped)
w     += alpha_w * delta * x                                # critic update
p      = policy_probs(x)
grad_log = -np.outer(p, x); grad_log[a] += x
theta += alpha_theta * I * delta * grad_log                 # actor update (I = γ^t accumulator)
I     *= gamma
s = s2
```

Changes: (1) **no episode buffer** — update online each step; (2) the full return $G_t$ is replaced by the **one-step bootstrapped TD error** $\delta_t = r + \gamma\hat v(S') - \hat v(S)$, which is the single learning signal for *both* the critic ($w$) and the actor ($\theta$); (3) maintain the discount accumulator $I = \gamma^t$. This is fully online and works on continuing tasks (use the differential/average-reward δ there).
</details>

---

➡️ Next: [Chapter 14 — Psychology exercises](14-psychology-exercises.md)
