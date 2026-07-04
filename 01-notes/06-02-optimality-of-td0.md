# 6.2 — Optimality of TD(0): Batch Updating & Certainty Equivalence

> **Chapter 6: Temporal-Difference Learning** · Book section: §6.3
> Previous: [6.1 — TD Prediction](06-01-td-prediction.md) · Next: [6.3 — Sarsa: On-policy TD Control](06-03-sarsa-on-policy-td-control.md)

---

## 🌱 The Big Picture

TD and MC both converge to $v_\pi$ given infinite data. But what about **finite** data — say, 10 episodes? It turns out they converge to **different answers**, and the difference reveals *why* TD usually learns faster. This is one of the most illuminating sections in the book.

---

## 📦 Batch updating

Setup to make the comparison clean: take a fixed batch of experience (e.g., 10 episodes). Repeatedly present the whole batch; on each pass, accumulate the increments prescribed by the update rule and apply them once; repeat until the value function converges. Both methods (with small enough α) converge deterministically — but **to different value functions**.

---

## 🕵️ The "You are the Predictor" example (book Example 6.4)

You observe 8 episodes from an unknown Markov process with states A and B:

```text
A,0,B,0      ← one episode: A → reward 0 → B → reward 0 → end
B,1          ← six episodes like this
B,1
B,1
B,1
B,1
B,1
B,0          ← one episode
```

**Everyone agrees:** $V(B) = 6/8 = 0.75$.

**But what is $V(A)$?** Two defensible answers:

1. **The TD answer: $V(A) = 0.75$.** Reason like a Markov modeler: A always transitioned to B (with reward 0), and B is worth 0.75 — so A must be worth 0.75 too. You're building the *maximum-likelihood model* of the chain and computing values from it.
2. **The MC answer: $V(A) = 0$.** We saw A exactly once, and the return that followed was 0. Average of observed returns = 0. Minimizes squared error **on the observed data**.

> The MC answer fits the *past* data best; the TD answer is expected to fit *future* data better — because it exploits the Markov structure.

---

## 🎓 Certainty equivalence — the formal statement

- **Batch MC** converges to the values that minimize **mean square error on the training set**.
- **Batch TD(0)** converges to the **certainty-equivalence estimate**: the value function that would be *exactly correct* if the maximum-likelihood model of the Markov process (transition fractions observed = true probabilities) were exactly right.

This explains the speed difference:

> Batch TD(0) converges to the certainty-equivalence estimate — and that estimate is, in a sense, the best use you can make of limited data in a Markov environment. That's why TD beats MC on the random-walk task even though MC is "optimal" in the limited fit-the-data sense.

And the kicker: computing the certainty-equivalence estimate *directly* (build the model, solve it) takes $O(n^3)$ memory/computation for $n$ states — while TD approximates the same answer with $O(n)$ memory and simple per-step updates. **On large problems, TD may be the only feasible way to approximate the certainty-equivalence solution.**

Non-batch TD(0) (the normal online version) doesn't hit these batch answers exactly, but it "moves roughly in that direction" — hence its practical speed advantage.

---

## 🧠 Connecting to Markov-ness

- TD's advantage comes from **exploiting the Markov property** (state B's value is shared knowledge usable for predicting A).
- MC's robustness comes from **not** relying on it. In partially observable or non-Markov problems, MC's "just average actual returns" can be the safer bet. Trade-off noted; remember it.

---

## 🎯 Key Takeaways

1. With finite data, batch MC and batch TD converge to **different** value functions — both principled.
2. **MC:** best fit to observed returns. **TD:** certainty-equivalence estimate — correct under the max-likelihood Markov model of the data.
3. TD effectively learns a model's answer **without ever building the model** — with O(n) memory.
4. This is the deep reason TD typically learns faster than MC in Markov domains.

---

➡️ **Next:** [6.3 — Sarsa](06-03-sarsa-on-policy-td-control.md) — TD goes from prediction to **control**.
