# 8.5 — Decision-time Planning, Rollouts & Monte Carlo Tree Search

> **Chapter 8: Planning and Learning with Tabular Methods** · Book sections: §8.8–§8.13
> Previous: [8.4 — Trajectory Sampling & RTDP](08-04-trajectory-sampling-and-rtdp.md) · Next: [9.1 — Value-function Approximation](09-01-value-function-approximation.md)

---

## ⏰ Two ways to use planning (§8.8)

| | **Background planning** (e.g., Dyna) | **Decision-time planning** (e.g., chess engines) |
|---|---|---|
| When | continuously, between actions | *right now*, focused on the **current state** |
| Output | a globally improved policy/value table | (mainly) the **single next move** |
| Result kept? | yes, accumulates | often discarded after the move |
| Best when | fast responses required | more time available per move (board games) |

Decision-time planning looks ahead from the current state $S_t$, evaluates the futures, picks an action — values and policy beyond this decision are typically thrown away. Both modes can be mixed.

---

## 🔭 Heuristic Search (§8.9)

The classical AI version: from the current state, grow a **tree** of possible continuations; apply an evaluation function at the leaves; **back up** values to the root (exactly DP-style expected updates, just organized as a depth-bounded tree!); move to the best root action.

> Insight: deeper search = "multi-step greedification." Acting greedily w.r.t. a *deeper lookahead* gives better actions than one-step greedy — if the value function is imperfect (it always is), search compensates. That's why chess programs search deeply.

The focus on the current state's subtree is exactly the "relevant states" focusing from the last note — *massively* concentrated computation.

---

## 🎲 Rollout Algorithms (§8.10)

For each candidate action $a$ in the current state: simulate many episodes that start with $a$ and then follow a fixed **rollout policy**; average the returns → Monte Carlo estimate of $q_{\text{rollout}}(s, a)$; pick the best action. Repeat at the next state.

- This is **policy improvement on the fly**: acting greedily w.r.t. the rollout policy's values gives a *better* policy than the rollout policy itself (the policy improvement theorem, made instant).
- Not a learning method — nothing is stored! It's a way to *squeeze a better decision* out of a simulator and a mediocre policy.
- Better rollout policy → better results (but slower simulations). Classic compute/quality dial.

---

## 🌳 Monte Carlo Tree Search (§8.11) — rollouts + a growing tree + smart selection

**MCTS** = the decision-time planner behind computer Go's revolution and AlphaGo (Ch. 16). It's a rollout algorithm that **accumulates value estimates in a partial tree** to direct simulations toward promising lines.

Each of (typically thousands of) iterations per move:

1. **Selection** — from the root, descend the existing tree using a **tree policy** that balances exploration/exploitation (e.g., **UCB applied to tree nodes** — that's "UCT"). 🧭
2. **Expansion** — add child node(s) for unexplored actions at the frontier.
3. **Simulation (rollout)** — from the new node, play out to the end with the cheap rollout policy. 🎲
4. **Backup** — propagate the simulated return up the traversed tree nodes, updating their value statistics. ⬆️

```text
        (root = current state)
        /        |        \
     tried     tried     untried ← expansion happens here
      /\         |            \
    ...        (tree grows      rollout ~~~> terminal, return G
                where results                 backs up the path
                are promising)
```

After the time budget: pick the root action with the best statistics (e.g., most visits / highest value). Move; advance the tree's root (often reusing the relevant subtree); repeat.

**Why MCTS works so well:**
- Focuses simulations on trajectories whose **beginnings look promising** (extending earlier high-return paths);
- Grows the "memorized" tree **only where it matters**;
- Underneath, it's just Monte Carlo value estimation + sampled trajectories + the focusing ideas of this whole chapter. No hand-crafted evaluation function needed (though adding learned values — AlphaGo — makes it stronger still).

---

## 📋 Part I wrap-up: the dimensions of methods (§8.12–8.13)

All methods we've seen share a skeleton — estimate value functions, back up values along (actual or possible) trajectories, follow GPI. They differ along a small set of **dimensions**, e.g.:

```text
                width of update
              sample ◄─────► expected
        TD(0) ●                    ● DP          ▲ shallow (1-step bootstrap)
              │                    │             │ depth of update
           MC ●                    ● exhaustive  ▼ deep (full returns)
                                     search
```

Plus: on-policy vs off-policy; episodic vs continuing; tabular vs approximate (→ Part II); model-free vs model-based. Keep this map — every algorithm you'll ever meet sits somewhere in this cube.

---

## 🎯 Key Takeaways

1. **Decision-time planning** concentrates all compute on the move you must make *now*.
2. **Heuristic search** = deep, focused, tree-structured greedification.
3. **Rollouts** = instant policy improvement via simulation; **MCTS** adds a selectively-grown tree + UCB selection → superhuman game play.
4. Part I complete: tabular methods, unified as value backups + GPI. Part II asks: what if there are *too many states for a table*?

---

➡️ **Next (Part II!):** [9.1 — Value-function Approximation](09-01-value-function-approximation.md) — replacing tables with parameterized functions: features, gradients, and generalization.
