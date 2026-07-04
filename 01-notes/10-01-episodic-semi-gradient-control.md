# 10.1 — Episodic Semi-gradient Control (Sarsa with Approximation)

> **Chapter 10: On-policy Control with Approximation** · Book sections: §10.1–§10.2
> Previous: [9.5 — Nonlinear & Other Methods](09-05-nonlinear-and-other-methods.md) · Next: [10.2 — The Average-Reward Setting](10-02-average-reward-setting.md)

---

## 🌱 The Big Picture

Prediction with approximation ✅. Now **control**: approximate the **action-value** function

$$\hat q(s, a, \mathbf{w}) \approx q_\pi(s,a)$$

and run the usual GPI loop. The flagship: **episodic semi-gradient Sarsa**.

---

## 🧮 The update

Straight generalization of semi-gradient TD(0) to action values — the one-step Sarsa target with gradients:

$$\mathbf{w}_{t+1} = \mathbf{w}_t + \alpha\Big[R_{t+1} + \gamma\, \hat q(S_{t+1}, A_{t+1}, \mathbf{w}_t) - \hat q(S_t, A_t, \mathbf{w}_t)\Big] \nabla \hat q(S_t, A_t, \mathbf{w}_t)$$

**Policy improvement:** in each state, compute $\hat q(S_t, a, \mathbf{w})$ for every action; act **ε-greedily**. (This works for smallish discrete action sets; continuous actions are an ongoing research frontier — Ch. 13 offers one answer.)

```text
Episodic semi-gradient Sarsa:
for each episode:
    S, A ← initial state, ε-greedy action
    loop:
        take A → R, S′
        if S′ terminal:
            w += α [R − q̂(S,A,w)] ∇q̂(S,A,w);  break
        A′ ← ε-greedy w.r.t. q̂(S′,·,w)
        w += α [R + γ q̂(S′,A′,w) − q̂(S,A,w)] ∇q̂(S,A,w)
        S ← S′; A ← A′
```

---

## 🚗 The Mountain Car (book Example 10.1) — a classic you must know

An underpowered car sits in a valley; the goal is on top of the right hill. **Full throttle isn't enough** — gravity beats the engine. The only solution: **drive backwards up the left slope first**, then accelerate rightward, letting gravity + momentum carry you out. 🏔️🚙🏔️

- **State:** (position, velocity) — two continuous variables.
- **Actions:** full throttle forward / reverse / zero.
- **Reward:** −1 per step until the goal → the agent is *pushed by impatience* to escape fast.
- The twist: things must **get worse before they get better** (moving *away* from the goal is the right start). Pure short-sighted greed fails — a perfect testbed for value-based control.

**Setup that works beautifully:** tile coding (8 tilings) over (position, velocity) per action + semi-gradient Sarsa + **optimistic initial values** ($\hat q = 0$ everywhere while true values are negative) → systematic exploration with *no* ε needed. The learned value surfaces (book Figure 10.1) show the spiral structure of the optimal solution emerging within ~100 episodes.

---

## 🪜 Semi-gradient n-step Sarsa (§10.2)

As always, use the **n-step return** (with $\hat q$ bootstrapping at the end) as the update target:

$$G_{t:t+n} = R_{t+1} + \cdots + \gamma^{n-1}R_{t+n} + \gamma^n \hat q(S_{t+n}, A_{t+n}, \mathbf{w})$$

And as always, the empirical result on Mountain Car: **intermediate n (e.g. n = 4–8) learns faster than both n = 1 and large n.** The bias–variance dial keeps paying rent. The parameter study (α × n) confirms it across settings.

---

## 🎯 Key Takeaways

1. Control with FA: learn $\hat q(s,a,\mathbf{w})$ with semi-gradient Sarsa, act ε-greedily — GPI survives the move to approximation.
2. **Mountain Car**: the canonical "must move away from the goal first" continuous-state testbed; tile coding + optimistic init + Sarsa solves it crisply.
3. n-step semi-gradient Sarsa: intermediate n wins again.
4. Note what's *missing*: a semi-gradient **Q-learning** here. Off-policy + approximation has deep problems — that's Chapter 11's story.

---

➡️ **Next:** [10.2 — The Average-Reward Setting](10-02-average-reward-setting.md) — for continuing tasks with function approximation, discounting stops making sense. Meet RL's "third setting."
