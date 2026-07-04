# 5.5 — Off-policy Monte Carlo Control & Chapter Summary

> **Chapter 5: Monte Carlo Methods** · Book sections: §5.7–§5.10
> Previous: [5.4 — Off-policy Prediction](05-04-off-policy-prediction-importance-sampling.md) · Next: [6.1 — TD Prediction](06-01-td-prediction.md)

---

## 🎮 Off-policy MC Control (§5.7)

Now combine everything: learn $q_*$ and $\pi_*$ (the **target**) while *behaving* according to an exploratory soft policy b. The agent gets the best of both worlds: full exploration forever AND convergence toward the truly optimal (deterministic) policy.

```text
Off-policy MC control (weighted importance sampling):
Initialize: Q(s,a) arbitrary; C(s,a) = 0; π(s) = argmax_a Q(s,a)

loop forever (per episode):
    b ← any soft policy (e.g. ε-greedy w.r.t. Q)
    generate episode using b
    G = 0;  W = 1
    for t = T−1 down to 0:
        G = γG + R_{t+1}
        C(S_t,A_t) += W
        Q(S_t,A_t) += (W / C(S_t,A_t)) · (G − Q(S_t,A_t))
        π(S_t) = argmax_a Q(S_t,a)          ← target policy stays greedy
        if A_t ≠ π(S_t):  break              ← π would never do this; rest is useless
        W = W · 1 / b(A_t|S_t)               ← π(A_t|S_t)=1 since π greedy
```

### ⚠️ The painful caveat

See that `break`? Learning proceeds **only from the tails of episodes where the behavior happened to match the greedy policy**. If exploratory actions are common, especially *early* in episodes, learning the early parts of long episodes becomes *glacially slow*. This inefficiency is a core open problem of off-policy MC — and a major motivation for TD methods with bootstrapping (Chapters 6–7, 12).

---

## 🧪 Advanced variance-reduction previews (§5.8–§5.9, starred sections)

Two refinements reduce importance-sampling variance (skim now, revisit later):

- **Discounting-aware IS:** when γ < 1, returns are mostly determined by *early* rewards, yet the ratio multiplies factors for the *whole* episode — pointless extra variance. Treat discounting as probabilistic episode termination and weight partial returns by partial ratios.
- **Per-decision IS:** each reward $R_{t+k}$ only needs the ratio factors *up to time $t+k-1$* — later actions can't have influenced an earlier reward. Using truncated ratios per reward gives an unbiased estimator with lower variance.

---

## 📋 Chapter 5 Summary — Monte Carlo at a glance

| Aspect | Monte Carlo | vs. DP |
|---|---|---|
| Model needed? | ❌ — learns from sample episodes | DP needs full $p(s',r\|s,a)$ |
| Bootstrapping? | ❌ — uses complete actual returns | DP bootstraps |
| Updates | episode-by-episode | sweep-by-sweep |
| Cost per state | independent of #states | sweeps everything |
| Markov assumption | less harmed by violations (no bootstrapping!) | relies on it |
| Best when | episodes are natural & you can simulate; subset of states matters | small, fully-known MDPs |

**The exploration problem and its two solutions:**
- **On-policy** (ε-soft): simple, converges to best *exploring* policy.
- **Off-policy** (importance sampling): learns the *optimal* policy from exploratory data — at the cost of variance and slowness.

**MC control = GPI** with sampled evaluation: episode → average returns into Q → greedify (fully or softly).

---

## 🎯 Key Takeaways

1. Off-policy MC control: behave soft (b), learn greedy (π), correct with **weighted importance sampling**.
2. The `break`-on-non-greedy-action problem makes off-policy MC slow for long episodes — bootstrapping methods will help.
3. MC strengths: model-free, no bootstrap, per-state focus, robust to Markov violations.
4. MC weakness: must wait for episode end; high variance; off-policy version learns only from greedy "tails".
5. Next chapter merges MC's model-freeness with DP's bootstrapping → **temporal-difference learning**, the most central idea in RL.

---

➡️ **Next chapter:** [6.1 — TD Prediction](06-01-td-prediction.md) 🌟 — the headline act of the whole book.
