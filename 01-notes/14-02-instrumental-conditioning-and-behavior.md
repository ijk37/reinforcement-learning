# 14.2 — Psychology II: Instrumental Conditioning, Habits & Goals

> **Chapter 14: Psychology** · Book sections: §14.3–§14.7
> Previous: [14.1 — Classical Conditioning & TD Model](14-01-classical-conditioning-and-td-model.md) · Next: [15.1 — Neuroscience & the Reward Prediction Error Hypothesis](15-01-dopamine-and-reward-prediction-error.md)

---

## 🎯 Instrumental Conditioning (§14.3)

Where classical conditioning is about *predicting*, **instrumental (operant) conditioning** is about *acting*: behavior is shaped by its **consequences**. Thorndike's **Law of Effect** (1911):

> Actions followed by satisfaction are **strengthened**; actions followed by discomfort are **weakened** — in that situation.

This is precisely **trial-and-error control** — the policy-improvement half of RL. The Law of Effect contains both essential RL ingredients: **selectional** (try alternatives, keep what works) *and* **associative** (the strengthening is tied to the *situation*). It's the psychological root of policy learning.

---

## ⏳ The Problem of Delayed Reinforcement (§14.4)

Real rewards often come long after the actions that earned them. Two mechanisms — both already in our toolbox — bridge the gap:

1. **Eligibility traces** (Ch. 12): a fading memory marking recently-taken actions as *eligible* for credit when a later reward arrives. 🐾
2. **TD/value learning** (Ch. 6): values act as **secondary/conditioned reinforcers** — a neutral state that reliably precedes reward becomes rewarding itself, so credit can be assigned *immediately* upon reaching it rather than waiting for the primary reward.

Together they're a psychologically plausible solution to the **credit-assignment problem** — the same problem RL engineering had to solve.

---

## 🗺️ Cognitive Maps & Model-based Behavior (§14.5)

Tolman's rats showed **latent learning**: they learned a maze's *structure* without rewards, then exploited it instantly once reward appeared — evidence of an internal **cognitive map** (a model of the environment). This is the psychological counterpart of **model-based RL** and **planning** (Ch. 8): environment models support flexible, goal-directed behavior.

---

## 🤖 vs 🧭 Habitual and Goal-directed Behavior (§14.6) — the big synthesis

Modern animal psychology distinguishes two control systems, and they map **cleanly** onto our two families of RL:

| | **Habitual** | **Goal-directed** |
|---|---|---|
| RL counterpart | **Model-free** (cached values, e.g. TD) | **Model-based** (plan with a model) |
| Speed | fast, automatic, reflexive | slow, deliberative |
| Flexibility | rigid — insensitive to changed outcome values | flexible — adapts immediately to new goals/values |
| Classic test | keeps pressing lever for now-devalued food 🍬❌ | stops pressing once food is devalued ✅ |

**The outcome-devaluation experiment** is the key diagnostic: train a rat to press a lever for a food, then make that food undesirable (e.g., pair it with illness). A **goal-directed** rat immediately stops pressing (it consults its model: "lever → bad food → don't"). A **habitual** rat keeps pressing (its cached value hasn't caught up). Animals shift from goal-directed to habitual with **overtraining** — exactly the engineering trade-off between cheap fast policies and expensive flexible planning.

> 💡 The brain appears to run **both** a model-free and a model-based controller and **arbitrate** between them — arguably the most important idea this chapter contributes back to RL: maybe agents *should* maintain both, using each where it's strongest. (A theme echoed in Dyna, Ch. 8.)

---

## 🎯 Key Takeaways

1. **Instrumental conditioning = control**; Thorndike's **Law of Effect** is trial-and-error policy learning (selectional + associative).
2. **Delayed reinforcement** is bridged by **eligibility traces** + **value functions as secondary reinforcers** — RL's credit-assignment tools, in biology.
3. **Cognitive maps** = environment models = model-based RL/planning.
4. **Habitual ↔ model-free**, **goal-directed ↔ model-based**; outcome devaluation distinguishes them; brains use and arbitrate **both**.

---

➡️ **Next chapter:** [15.1 — Neuroscience: Dopamine & the Reward Prediction Error Hypothesis](15-01-dopamine-and-reward-prediction-error.md) — the TD error, found in the brain.
