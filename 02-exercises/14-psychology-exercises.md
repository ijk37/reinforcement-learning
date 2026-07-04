# Chapter 14 — Psychology · Exercises

> Practice for notes [14.1](../01-notes/14-01-classical-conditioning-and-td-model.md)–[14.2](../01-notes/14-02-instrumental-conditioning-and-behavior.md).
> Mostly conceptual — these connect RL math to animal learning.

---

## 🧠 Conceptual

### 14.1 — Two conditioning ↔ two RL problems
Map classical conditioning and instrumental conditioning onto the two halves of RL. Which is "prediction" and which is "control"?

💡 **Hint:** One learns to predict; one learns to act.

<details>
<summary>✅ Full Answer</summary>

- **Classical (Pavlovian) conditioning ↔ prediction** (learning value functions). The animal learns to *predict* a biologically important event (US) from a cue (CS) — like estimating $v_\pi$.
- **Instrumental (operant) conditioning ↔ control** (learning policies). Behavior is shaped by its *consequences* (Thorndike's Law of Effect) — like policy improvement via trial-and-error.

So prediction = "what will happen," control = "what should I do."
</details>

---

### 14.2 — Blocking and the prediction error
Explain the **blocking** phenomenon and how an error-driven model (Rescorla–Wagner) accounts for it. Connect it to the RL idea of learning from "surprise."

💡 **Hint:** If a US is already predicted, adding a redundant cue produces little error.

<details>
<summary>✅ Full Answer</summary>

**Blocking:** if cue CS₁ already reliably predicts the US, and you then present CS₁ **and** a new cue CS₂ together before the US, the animal learns **little or nothing** about CS₂ — its predictive learning is "blocked."

**Rescorla–Wagner account:** learning is proportional to the **prediction error** $(\lambda_{US} - V_{\text{total}})$, where $V_{\text{total}}$ aggregates all present cues' predictions. Since CS₁ already makes $V_{\text{total}} \approx \lambda_{US}$, the error is near zero when CS₂ is added → no learning about CS₂.

**RL connection:** this is exactly "**learn only from surprise**" — the same principle as the bandit error term and the TD error $\delta$. No prediction error, no update.
</details>

---

### 14.3 — Why the TD model improves on Rescorla–Wagner
What does the TD model of conditioning add that the trial-level Rescorla–Wagner model cannot capture? Name two phenomena.

💡 **Hint:** Rescorla–Wagner ignores within-trial timing.

<details>
<summary>✅ Full Answer</summary>

Rescorla–Wagner is **trial-level**: it has no representation of *time within a trial*. The **TD model** treats conditioning as **real-time prediction** of the discounted sum of future USs, with the TD error δ as a moment-to-moment teaching signal. This lets it capture:
1. **Timing effects** — how the precise CS→US interval shapes the strength and timing of the response.
2. **Higher-order (second-order) conditioning** — a cue that predicts another *cue* becomes a predictor too, because TD errors propagate backward through time (just like value backing-up).

(Also serial-compound stimulus effects and the gradual backward shift of the response.)
</details>

---

### 14.4 — Habits vs. goals ↔ model-free vs. model-based
Explain the outcome-devaluation experiment and how it distinguishes habitual from goal-directed behavior. Map each to an RL method family.

💡 **Hint:** Devalue the food; does the animal stop pressing the lever?

<details>
<summary>✅ Full Answer</summary>

**Experiment:** train a rat to press a lever for a food, then **devalue** that food (e.g., pair it with illness so the rat no longer wants it). Test whether the rat still presses the lever.

- **Goal-directed (model-based):** the rat *immediately stops* pressing — it consults its model ("lever → food → now-undesirable") and updates its behavior. ↔ **model-based RL / planning**.
- **Habitual (model-free):** the rat *keeps pressing* — its cached action value hasn't caught up to the new outcome value. ↔ **model-free RL (cached values, e.g., TD)**.

Animals shift from goal-directed to habitual with **overtraining**, mirroring the RL trade-off between flexible-but-expensive planning and fast-but-rigid cached values. Brains appear to run and arbitrate **both** systems — a lesson RL takes back (cf. Dyna).
</details>

---

### 14.5 — Bridging delayed reinforcement
Animals (and agents) can learn even when reward is delayed long after the responsible action. Name the two RL mechanisms from earlier chapters that explain how, and give a one-line description of each.

💡 **Hint:** One is a fading memory; one makes neutral predictors rewarding.

<details>
<summary>✅ Full Answer</summary>

1. **Eligibility traces (Ch. 12):** a fading short-term memory that marks recently-taken actions/states as eligible for credit, so when a delayed reward arrives, the responsible recent events get updated.
2. **Value functions / secondary reinforcement (Ch. 6):** a neutral state that reliably precedes reward acquires value itself (becomes a *conditioned/secondary reinforcer*), so credit can be assigned *immediately upon reaching it* rather than waiting for the primary reward.

Together they solve the **credit-assignment problem** in a biologically plausible way.
</details>

---

➡️ Next: [Chapter 15 — Neuroscience exercises](15-neuroscience-exercises.md)
