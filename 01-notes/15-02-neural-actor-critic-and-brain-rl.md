# 15.2 — Neural Actor–Critic & RL in the Brain

> **Chapter 15: Neuroscience** · Book sections: §15.7–§15.13
> Previous: [15.1 — Dopamine & Reward Prediction Error](15-01-dopamine-and-reward-prediction-error.md) · Next: [16.1 — Applications & Case Studies](16-01-applications-td-gammon-atari-alphago.md)

---

## 🎭 Neural Actor–Critic (§15.7–§15.8)

If dopamine is the TD error δ, what consumes it? The **actor–critic** architecture (Ch. 13) maps remarkably well onto brain anatomy:

- The **striatum** (part of the basal ganglia) is implicated in both roles, often split:
  - **Dorsal striatum → actor** (action selection / policy).
  - **Ventral striatum → critic** (value prediction).
- The **dopamine signal δ** is broadcast to both, serving as the shared teaching signal:
  - The **critic** uses δ to improve its value predictions (TD learning).
  - The **actor** uses δ to adjust action tendencies (policy-gradient-like: actions followed by positive δ become more likely).

### Actor and Critic learning rules (§15.8)

The book discusses biologically plausible **three-factor learning rules**: a synapse changes based on (1) **presynaptic** activity, (2) **postsynaptic** activity, and (3) a **neuromodulator** (dopamine = δ). The product of a local eligibility-like trace and the global δ signal echoes our `θ += α · δ · (eligibility)` updates almost exactly. Biology seems to implement the very update equations we derived. ✨

---

## 🧩 Other connections (§15.9–§15.13)

- **Hedonistic neurons (§15.9):** Klopf's hypothesis that individual neurons might be reward-seeking units — an early inspiration for the whole "neuron as RL agent" idea.
- **Collective reinforcement learning (§15.10):** how networks of locally-learning units could collectively solve RL problems.
- **Model-based methods in the brain (§15.11):** evidence that the brain also runs model-based (goal-directed) computations — prefrontal cortex and hippocampus implicated — consistent with the habit/goal duality of Chapter 14.
- **Addiction (§15.12):** a sobering application. Some theories model addictive drugs as producing a **pharmacological dopamine surge that can't be "predicted away"** — the TD error stays positive no matter how well-predicted the drug is, so the value of drug-seeking grows without bound. A poignant illustration of what happens when a learning signal is hijacked. 💊⚠️

---

## 🎯 Why this chapter matters for an RL student

You don't need the neuroscience to *use* RL — but it delivers two lasting lessons:

1. **The core RL constructs are not arbitrary.** Value functions, TD errors, eligibility traces, actor–critic — they keep reappearing as the brain's own solutions. That's strong evidence they're capturing something fundamental about learning from interaction.
2. **Cross-pollination is real.** RL theory sharpened neuroscience (the dopamine story); neuroscience inspires new RL (curiosity, intrinsic motivation, arbitration between controllers). Keep an eye on the dialogue.

---

## 🎯 Key Takeaways

1. **Actor–critic ↔ basal ganglia**: dorsal striatum ≈ actor, ventral striatum ≈ critic, dopamine δ the shared teaching signal.
2. **Three-factor (neuromodulated) synaptic rules** ≈ our `δ × eligibility` updates — biology mirrors the math.
3. The brain also does model-based RL (goal-directed control); addiction shows the dark side of an un-learnable prediction error.
4. The deep takeaway: RL's central abstractions appear to be **how brains actually learn**.

---

➡️ **Next chapter:** [16.1 — Applications & Case Studies](16-01-applications-td-gammon-atari-alphago.md) — the greatest hits: TD-Gammon, Atari/DQN, and AlphaGo.
