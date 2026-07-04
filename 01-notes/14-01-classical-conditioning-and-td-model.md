# 14.1 — Psychology I: Prediction & Classical Conditioning

> **Chapter 14: Psychology** · Book sections: §14.1–§14.2
> Previous: [13.4 — Actor–Critic & Continuous Actions](13-04-actor-critic-and-continuous-actions.md) · Next: [14.2 — Instrumental Conditioning & Behavior](14-02-instrumental-conditioning-and-behavior.md)

---

## 🌱 The Big Picture

Part III turns from "how to build RL agents" to "what RL *means* for other fields." Chapter 14 makes a striking case: the algorithms we derived from engineering principles are also **excellent models of how real animals learn** — sometimes predicting experimental results before they were measured.

A vocabulary bridge between the two fields:

| RL term | Psychology correspondence |
|---|---|
| Prediction (value learning) | **Classical (Pavlovian) conditioning** — learning to predict |
| Control (policy learning) | **Instrumental/operant conditioning** — learning to act |
| Reward | Reinforcer |
| TD error | (candidate) reinforcement/teaching signal |

---

## 🔔 Classical Conditioning (§14.2)

Pavlov's dogs: a tone (the **conditioned stimulus, CS**) repeatedly precedes food (the **unconditioned stimulus, US**). Eventually the tone alone triggers salivation (the **conditioned response, CR**). The animal learned to **predict** the US from the CS. This is *prediction learning* — exactly $v_\pi$ in disguise.

### The Rescorla–Wagner model (§14.2.2) — and its limits

A famous psychological model: animals learn only when **surprised** — the associative strength of a CS updates in proportion to the prediction error between the actual US and the *aggregate* prediction of all CSs present.

$$\Delta V_{CS} \propto (\lambda_{US} - V_{\text{total}})$$

This elegantly explains **blocking** (§14.2.1): if CS₁ already predicts the US, adding a redundant CS₂ produces little error → the animal learns *nothing* about CS₂. Surprise drives learning. 🤯 (Notice the kinship with the bandit error term and the TD error — "learn from the surprise.")

But Rescorla–Wagner is **trial-level**: it ignores *timing within a trial*. It can't explain why the exact interval between CS and US matters, second-order conditioning, etc.

### The TD model of conditioning (§14.2.3) — RL to the rescue

Treat conditioning as **real-time TD prediction**: the animal continuously predicts the discounted sum of future USs (rewards); the **TD error δ** is the moment-to-moment teaching signal. This **TD model** is a strict generalization of Rescorla–Wagner that adds *time*, and it reproduces:

- **Timing effects** — how the CS-US interval shapes learning.
- **Higher-order conditioning** (§14.2.1) — a CS that predicts another CS becomes a predictor too, because TD errors propagate backward through time (just like values flowing back in tic-tac-toe!).
- **Stimulus representations** matter: with a "complete serial compound" or "microstimulus" representation of time, TD simulations (§14.2.4) match a wide range of real conditioning data.

> 💡 The deep payoff: a single mechanism — **bootstrapped prediction-error learning** — that we invented for engineering reasons turns out to capture decades of animal-learning phenomena. The TD error isn't just an algorithm detail; it may be a fundamental principle of learning. (Chapter 15 finds it in the brain.)

---

## 🎯 Key Takeaways

1. **Classical conditioning = prediction learning** (value functions); **instrumental conditioning = control** (policies).
2. **Rescorla–Wagner**: learning ∝ prediction error; explains **blocking** ("learn only from surprise"); but is timeless.
3. The **TD model** adds real-time dynamics → captures timing, higher-order conditioning, and more — RL as a quantitative theory of animal learning.
4. The TD error is a candidate for a universal "teaching signal."

---

➡️ **Next:** [14.2 — Instrumental Conditioning, Habits & Goals](14-02-instrumental-conditioning-and-behavior.md) — from predicting to acting, and the model-free/model-based split in the brain.
