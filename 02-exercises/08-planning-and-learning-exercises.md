# Chapter 8 — Planning and Learning with Tabular Methods · Exercises

> Practice for notes [8.1](../01-notes/08-01-models-and-planning.md)–[8.5](../01-notes/08-05-decision-time-planning-and-mcts.md).

---

## 🧠 Conceptual

### 8.1 — Distribution vs. sample models
Define both kinds of model and give an example of each. Which does Dyna use, and why is it often easier to obtain?

💡 **Hint:** Dice: full table of sums vs. a roller.

<details>
<summary>✅ Full Answer</summary>

- **Distribution model:** gives all possible next states/rewards *and their probabilities* — i.e., $p(s',r|s,a)$. Example: a full table of the probability of every sum when rolling 12 dice. Used by dynamic programming.
- **Sample model:** produces just *one* outcome, sampled with the correct probabilities. Example: a dice-rolling simulator. Used by Dyna and MCTS.

**Dyna uses a sample model** (in tabular deterministic form, it simply memorizes the last observed $(R, S')$ for each $(S,A)$). Sample models are easier because you only need to be able to *simulate* one outcome, not enumerate and quantify all of them.
</details>

---

### 8.2 — Learning and planning unified
Explain the sentence "any learning algorithm can be turned into a planning algorithm." What is the only thing that changes?

💡 **Hint:** Real vs. simulated experience.

<details>
<summary>✅ Full Answer</summary>

Both learning and planning estimate value functions by backing up values along transitions. The **only difference** is the *source* of the transitions:
- **Learning** uses **real** experience from the environment.
- **Planning** uses **simulated** experience from a model.

So feeding model-generated transitions into, say, the Q-learning update yields a planning algorithm ("random-sample one-step tabular Q-planning"). This unification is the conceptual core of Chapter 8 and of Dyna.
</details>

---

### 8.3 — When the model is wrong
Why does Dyna-Q recover quickly when the environment becomes *harder* (a path is blocked) but may fail to notice when it becomes *easier* (a shortcut opens)? What does Dyna-Q+ add?

💡 **Hint:** Does the agent ever visit the changed region under its current policy?

<details>
<summary>✅ Full Answer</summary>

- **Harder (blocking):** the agent's planned path now fails in reality, it earns less reward than the model predicted, and real experience quickly corrects the model where the agent acts. Optimistic model errors get discovered fast.
- **Easier (shortcut):** the agent's current policy still works fine, so it **never visits** the region where the shortcut appeared — it never gathers the experience needed to discover the improvement. This is an exploration failure.

**Dyna-Q+** adds an **exploration bonus** to modeled rewards: $\tilde r = r + \kappa\sqrt{\tau}$, where $\tau$ is the time since $(s,a)$ was last tried. The agent is periodically "curious" about stale transitions and re-checks them, so it discovers new shortcuts.
</details>

---

### 8.4 — Expected vs. sample updates
For a large branching factor b, is one expected update better than b sample updates? Summarize the chapter's answer and the rule of thumb.

💡 **Hint:** Sample updates compound their own progress.

<details>
<summary>✅ Full Answer</summary>

For **large b**, b sample updates achieve **most** of the error reduction of one expected update — and they do so incrementally, with each sample bootstrapping off successor values that earlier samples already improved. So per unit of computation, **sample updates are usually preferable when b is large**. For **small b** (few outcomes), the exactness of an expected update is cheap and wins.

**Rule of thumb:** big stochastic branching → sample updates (this is why sample-based planning like MCTS dominates huge domains); small/deterministic branching → expected updates.
</details>

---

### 8.5 — Background vs. decision-time planning
Contrast Dyna-style background planning with decision-time planning (e.g., MCTS in a chess engine). When is each appropriate?

💡 **Hint:** Improve a global policy continuously vs. compute the single best move now.

<details>
<summary>✅ Full Answer</summary>

- **Background planning (Dyna):** runs continuously between actions, gradually improving a **global** value function / policy that's stored and reused. Best when **fast responses** are needed (no time to deliberate per move).
- **Decision-time planning (MCTS, heuristic search):** focuses all computation on the **current state**, looking ahead to choose the single best action *now*; the results are often discarded after the move. Best when there's **time to think per decision** (board games) and the state space is too huge to value globally.

They can be combined (e.g., AlphaGo: learned value/policy nets *plus* MCTS at play time).
</details>

---

## 🔢 Math / Worked

### 8.6 — Dyna-Q planning budget
In Dyna-Q with n planning steps per real step, after the very first episode that reaches the goal, roughly how does increasing n (0 → 5 → 50) change the number of episodes to near-optimal? Explain the mechanism.

💡 **Hint:** Planning replays remembered transitions, propagating the goal value backward without new real steps.

<details>
<summary>✅ Full Answer</summary>

Increasing n **sharply reduces** the episodes needed (the book's maze: ~25 episodes at n=0, ~5 at n=5, ~3 at n=50).

**Mechanism:** after the first episode, plain Q-learning (n=0) has updated only the one state–action value leading into the goal. With planning, the agent **mentally replays** stored transitions between real steps, so the goal's value propagates backward through many states during the "thinking" time — turning compute + memory into sample efficiency. More planning steps = more backward propagation per real step.
</details>

---

## 💻 Code

### 8.7 — Implement Tabular Dyna-Q
Implement the Dyna-Q loop: one direct RL update + model update + n planning updates per real step. Assume a deterministic env and a `model` dict.

💡 **Hint:** Model maps `(s,a) -> (r, s2)`; planning samples from previously seen pairs.

<details>
<summary>✅ Full Answer</summary>

```python
import numpy as np, random
from collections import defaultdict

def dyna_q(env, episodes=50, n_plan=10, alpha=0.5, gamma=0.95, epsilon=0.1):
    Q = defaultdict(lambda: np.zeros(env.n_actions))
    model = {}                                   # (s,a) -> (r, s2)   [deterministic]
    seen = defaultdict(set)                      # s -> set of actions tried there

    def policy(s):
        if random.random() < epsilon: return random.randrange(env.n_actions)
        return int(np.argmax(Q[s]))

    for _ in range(episodes):
        s = env.reset(); done = False
        while not done:
            a = policy(s)
            s2, r, done = env.step(a)
            # (d) direct RL
            Q[s][a] += alpha * (r + gamma * np.max(Q[s2]) - Q[s][a])
            # (e) model learning
            model[(s, a)] = (r, s2); seen[s].add(a)
            # (f) planning: n simulated updates from remembered transitions
            for _ in range(n_plan):
                sp = random.choice(list(seen.keys()))
                ap = random.choice(list(seen[sp]))
                rp, sp2 = model[(sp, ap)]
                Q[sp][ap] += alpha * (rp + gamma * np.max(Q[sp2]) - Q[sp][ap])
            s = s2
    return Q
```

The same Q-learning update is used for both direct RL (real transition) and planning (remembered transitions) — the unification in action. Set `n_plan=0` and you recover plain Q-learning.
</details>

---

### 8.8 — Add the Dyna-Q+ exploration bonus
Describe the changes to 8.7 to implement Dyna-Q+.

💡 **Hint:** Track time since last visit per (s,a); add κ√τ to modeled reward during planning.

<details>
<summary>✅ Full Answer</summary>

```python
kappa = 1e-3
last_tried = defaultdict(int)     # (s,a) -> global timestep last tried
t = 0
# also: when a (s,a) is observed for a state, initialize model entries for ALL actions
#       of that state (so untried actions can be "imagined", often as (0, s))

# during planning, for sampled (sp, ap):
tau = t - last_tried[(sp, ap)]
rp, sp2 = model[(sp, ap)]
bonus = kappa * (tau ** 0.5)
Q[sp][ap] += alpha * (rp + bonus + gamma * np.max(Q[sp2]) - Q[sp][ap])

# increment t every real step; set last_tried[(s,a)] = t when actually taken
```

Changes: (1) a `last_tried` timestamp per pair and a global clock `t`; (2) add the bonus $\kappa\sqrt{\tau}$ to the modeled reward in **planning** updates; (3) optionally seed the model with all actions of visited states so long-untried actions become attractive over time. This makes the agent re-explore stale regions and discover newly-opened shortcuts.
</details>

---

➡️ Next: [Chapter 9 — On-policy Prediction with Approximation exercises](09-on-policy-prediction-approximation-exercises.md)
