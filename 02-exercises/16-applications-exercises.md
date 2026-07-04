# Chapter 16 — Applications and Case Studies · Exercises

> Practice for note [16.1](../01-notes/16-01-applications-td-gammon-atari-alphago.md).
> These tie the whole book's machinery to landmark systems — great for interviews.

---

## 🧠 Conceptual

### 16.1 — TD-Gammon ingredients
What RL ingredients (from which chapters) combined to make TD-Gammon? Why was backgammon an especially favorable domain?

💡 **Hint:** TD(λ) + neural net + self-play + afterstates.

<details>
<summary>✅ Full Answer</summary>

Ingredients:
- **TD(λ)** (Ch. 12) for the learning rule.
- A **multilayer neural network** (Ch. 9, nonlinear function approximation) estimating the probability of winning.
- **Self-play** (~1.5 million games) to generate experience.
- **Afterstates** (Ch. 6) as the representation (evaluate the position *after* the move).

**Why backgammon was favorable:** the **dice** make it highly stochastic with a large branching factor, so sample-based TD self-play explores naturally and the value function generalizes smoothly; there's no need for deep tactical search. The stochasticity that makes the game hard for brute-force search is exactly what suits sampling-based value learning. TD-Gammon reached world-championship level and changed human opening theory.
</details>

---

### 16.2 — DQN and the deadly triad
DQN uses Q-learning with a deep network — which is the deadly triad (FA + bootstrapping + off-policy). What two engineering tricks keep it stable, and how does each help?

💡 **Hint:** Experience replay; target network.

<details>
<summary>✅ Full Answer</summary>

1. **Experience replay:** store transitions in a buffer and train on **random minibatches**. This breaks the strong temporal **correlations** between consecutive samples, reuses data efficiently, and smooths the update distribution — mitigating instability and improving sample efficiency.
2. **Target network:** compute the bootstrap target using a **slowly-updated frozen copy** of the network ($\max_a Q(s', a; \mathbf{w}^-)$). This prevents the target from chasing the rapidly-changing online weights (the "moving target chasing itself" that drives divergence), greatly stabilizing learning.

Together they don't *solve* the deadly triad but **manage** it well enough to learn 49 Atari games from raw pixels at human level.
</details>

---

### 16.3 — AlphaGo Zero as GPI
Explain how AlphaGo Zero's loop of self-play + MCTS + neural network is an instance of Generalized Policy Iteration.

💡 **Hint:** MCTS = improvement; network training = evaluation.

<details>
<summary>✅ Full Answer</summary>

- **Policy improvement = MCTS:** at each position, Monte Carlo Tree Search (Ch. 8), guided by the current network, produces a **stronger** move distribution than the raw network policy (search improves on the base policy).
- **Policy evaluation = network training:** the network is trained to **match** the MCTS-improved move probabilities and the self-play game outcomes (value targets).

Iterating these two — search to improve, then learn to absorb the improvement — is exactly **GPI**: an improvement operator and an evaluation/representation step chasing each other toward optimal play. Starting from random weights and pure self-play, this loop surpassed all prior versions (and generalized to chess/shogi as AlphaZero).
</details>

---

### 16.4 — Pick the method for the domain
For each application, name a plausible RL formulation (state, action, reward) and whether it leans value-based, policy-based, or planning-heavy:
(a) personalized web article recommendation, (b) a glider learning to gain altitude in thermals.

💡 **Hint:** (a) is nearly a contextual bandit; (b) is continuous control.

<details>
<summary>✅ Full Answer</summary>

**(a) Web recommendation** — close to a **contextual bandit** (Ch. 2): state = user/context features; action = which article to show; reward = click/engagement. Actions barely affect the next state, so it's value-based / bandit-style (estimate action values per context). Often handled with bandit algorithms or lightweight value methods.

**(b) Thermal soaring glider** — **continuous control** RL: state = position, velocity, vertical wind estimates, bank angle; action = continuous control surface / bank adjustments; reward = rate of altitude gain (or staying aloft). Continuous actions favor **policy-gradient / actor–critic** methods (Ch. 13) with Gaussian policies. Some planning is possible if a thermal model is available.
</details>

---

## 💻 Light coding / design

### 16.5 — Sketch a minimal DQN training step
Write pseudocode for one DQN learning step using a replay buffer and a target network.

💡 **Hint:** Sample a minibatch; target uses the frozen network; periodically sync.

<details>
<summary>✅ Full Answer</summary>

```python
# online_net (params w), target_net (params w_minus), replay buffer D
def dqn_step(online_net, target_net, D, optimizer, gamma, batch=32):
    s, a, r, s2, done = D.sample(batch)                 # random minibatch (breaks correlation)

    # bootstrap target from the FROZEN target network:
    with no_grad():
        max_q_next = target_net(s2).max(dim=1).values
        y = r + gamma * max_q_next * (1 - done)         # 0 future value if terminal

    q = online_net(s).gather(1, a)                      # Q(s,a) from online net
    loss = mse(q, y)                                    # semi-gradient: y treated as constant

    optimizer.zero_grad(); loss.backward(); optimizer.step()

# elsewhere in the training loop:
#   - act ε-greedily using online_net, store (s,a,r,s2,done) in D
#   - every C steps: target_net.load_state_dict(online_net.state_dict())   # sync
```

The two stabilizers are visible: **`D.sample`** (experience replay) and the **`target_net` / periodic sync** (target network). The target `y` is detached (`no_grad`) — that's the semi-gradient treatment of the bootstrapped target.
</details>

---

➡️ Next: [Chapter 17 — Frontiers exercises](17-frontiers-exercises.md)
