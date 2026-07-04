# Chapter 15 — Neuroscience · Exercises

> Practice for notes [15.1](../01-notes/15-01-dopamine-and-reward-prediction-error.md)–[15.2](../01-notes/15-02-neural-actor-critic-and-brain-rl.md).

---

## 🧠 Conceptual

### 15.1 — The Reward Prediction Error Hypothesis
State the hypothesis precisely. What quantity from earlier chapters does phasic dopamine correspond to?

💡 **Hint:** Phasic dopamine ≈ δ.

<details>
<summary>✅ Full Answer</summary>

**Reward Prediction Error Hypothesis:** the **phasic (burst) activity of dopamine neurons** signals a **reward prediction error** — essentially the **TD error** $\delta_t = R_{t+1} + \gamma \hat v(S_{t+1}) - \hat v(S_t)$.

So the brain appears to broadcast something like the TD error as a global teaching signal (dopamine's wide projections make this plausible).
</details>

---

### 15.2 — The three dopamine signatures
List the three experimental dopamine responses (Schultz's monkey experiments) and explain how each matches a property of the TD error.

💡 **Hint:** Surprise, learned cue, omission.

<details>
<summary>✅ Full Answer</summary>

1. **Unexpected reward → dopamine burst.** Matches a large **positive δ** ("better than expected").
2. **Predicted reward → no response at reward time; burst shifts to the predicting cue.** Matches TD: once the reward is predicted, δ at reward time → 0, and the error *propagates backward* to the earliest reliable predictor (just as value information backs up to earlier states).
3. **Predicted reward omitted → dopamine dips below baseline at the expected time.** Matches a **negative δ** ("worse than expected").

All three are precisely what a TD-error signal does over the course of learning — a striking match between theory and biology.
</details>

---

### 15.3 — Actor–critic in the brain
How does the actor–critic architecture map onto brain anatomy, and what role does dopamine play for each component?

💡 **Hint:** Striatum split; δ as a shared teaching signal.

<details>
<summary>✅ Full Answer</summary>

- **Critic ↔ ventral striatum:** learns value predictions; uses the dopamine δ to improve them (TD learning).
- **Actor ↔ dorsal striatum:** learns action tendencies (the policy); uses δ to adjust them (policy-gradient-like — actions followed by positive δ become more likely).
- **Dopamine (δ)** is the **shared teaching signal** broadcast to both. This mirrors the actor–critic algorithm, where one TD error updates both the value function and the policy. Plausible **three-factor synaptic rules** (presynaptic × postsynaptic × neuromodulator) implement the `δ × eligibility` updates we derived mathematically.
</details>

---

### 15.4 — Addiction as a broken prediction error
Briefly explain the book's model of how addictive drugs can hijack the dopamine/TD-error system. Why does it lead to runaway value for drug-seeking?

💡 **Hint:** A pharmacological δ that can't be "predicted away."

<details>
<summary>✅ Full Answer</summary>

Some theories model addictive drugs as producing a **pharmacological surge of dopamine** that acts like a **positive prediction error which cannot be reduced by prediction**. Normally, once an outcome is well-predicted, δ → 0 and learning stops; but if the drug *always* induces a positive δ no matter how well predicted, the value of drug-seeking actions keeps increasing **without bound**. This is a poignant illustration of what happens when a learning signal is corrupted — the normal self-limiting property of TD learning (errors shrink as predictions improve) is broken.
</details>

---

### 15.5 — Why should an RL student care about neuroscience?
Give two takeaways an RL practitioner should retain from this chapter.

💡 **Hint:** The constructs aren't arbitrary; the dialogue is two-way.

<details>
<summary>✅ Full Answer</summary>

1. **The core RL constructs are not arbitrary inventions.** Value functions, TD errors, eligibility traces, and actor–critic structures keep reappearing as the brain's *own* apparent solutions to learning from interaction — strong evidence they capture something fundamental.
2. **Cross-pollination is real and ongoing.** RL theory sharpened neuroscience (the dopamine/δ correspondence was partly *predicted* by the theory), and neuroscience inspires new RL ideas (intrinsic motivation/curiosity, arbitration between model-free and model-based controllers). Watching this dialogue is a source of research directions.
</details>

---

➡️ Next: [Chapter 16 — Applications & Case Studies exercises](16-applications-exercises.md)
