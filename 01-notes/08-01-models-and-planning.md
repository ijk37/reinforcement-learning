# 8.1 — Models and Planning

> **Chapter 8: Planning and Learning with Tabular Methods** · Book section: §8.1
> Previous: [7.3 — n-step Off-policy & Tree Backup](07-03-n-step-off-policy-and-tree-backup.md) · Next: [8.2 — Dyna-Q](08-02-dyna-q.md)

---

## 🌱 The Big Picture

So far the book has kept two families apart:

- **Model-based** methods (DP, heuristic search): rely on **planning** with a model.
- **Model-free** methods (MC, TD): rely on **learning** from real experience.

Chapter 8's mission: show these are **deeply related and can be unified**. Both estimate value functions, both update values by looking ahead at futures and backing up values. The difference is only *where the experience comes from*.

---

## 🗺️ What is a model?

> A **model** = anything the agent can use to predict how the environment responds to actions.

Two kinds:

| | **Distribution model** | **Sample model** |
|---|---|---|
| Produces | all possible outcomes + their probabilities, $p(s', r\|s,a)$ | *one* outcome, sampled with the right probabilities |
| Example (12 dice) | table of all sums & probabilities | a dice-rolling simulator 🎲 |
| Power | stronger (can always sample from it) | weaker but **much easier to build** |
| Used by | Dynamic programming | Simulators, Dyna, MCTS |

A model is used to **simulate** experience: given a start state and a policy, a sample model produces entire plausible episodes — *simulated experience*.

---

## 🧠 What is planning?

> **Planning** = any process that takes a **model** as input and produces or improves a **policy**.

The book's key insight — the structure shared by all the methods we've seen:

```text
        model ──► simulated experience ──► values ──► policy      (planning)
  environment ──► real experience      ──► values ──► policy      (learning)
```

**State-space planning** (the kind in this book) = search through the state space using value backups, exactly like learning methods do — just driven by *simulated* rather than *real* transitions.

### Example: Random-sample one-step tabular Q-planning

Take Q-learning, but feed it model-generated transitions:

```text
loop forever:
    1. pick a random state S, random action A
    2. ask the model: (R, S′) = model(S, A)
    3. Q(S,A) ← Q(S,A) + α [ R + γ max_a Q(S′,a) − Q(S,A) ]
```

This converges to the optimal policy *for the model* — pure planning, but using a learning algorithm's update on simulated experience. **Learning methods double as planning methods.** 🤝

---

## 🧩 Why this unification matters

1. **Any learning algorithm → planning algorithm** by swapping real experience for simulated experience.
2. Planning can be done **incrementally, in tiny pieces** — a few updates at a time — which is exactly what you need when planning must be interleaved with acting (no "stop the world while I think for an hour").
3. Within one agent, **real experience can do double duty**:
   - improve the value function directly (**direct RL**), and
   - improve the model (**model-learning**) → which improves values indirectly (**indirect RL / planning**).

That two-lane architecture is **Dyna**, the next note. 🛣️

---

## 🎯 Key Takeaways

1. Model = environment predictor. **Distribution** models give probabilities; **sample** models give samples (easier to obtain, often all you need).
2. Planning = model → (simulated experience) → better policy. Learning = real experience → better policy. **Same backbone.**
3. Any value-update learning rule (e.g., Q-learning) can run on simulated experience = instant planning algorithm.
4. Plan in small increments to interleave with acting.

---

➡️ **Next:** [8.2 — Dyna-Q](08-02-dyna-q.md) — the elegant architecture that learns, plans, and acts all at once.
