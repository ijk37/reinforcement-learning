# 8.4 — Trajectory Sampling & Real-time Dynamic Programming

> **Chapter 8: Planning and Learning with Tabular Methods** · Book sections: §8.6–§8.7
> Previous: [8.3 — Prioritized Sweeping](08-03-prioritized-sweeping-and-update-choices.md) · Next: [8.5 — Decision-time Planning & MCTS](08-05-decision-time-planning-and-mcts.md)

---

## 🛤️ Trajectory Sampling (§8.6) — where should planning effort go?

Two ways to distribute updates across the state space:

1. **Exhaustive sweeps** (classical DP): visit every state equally. Problem: most of a large state space is **irrelevant** — unreachable or reached only under terrible policies. A sweep devotes equal time to all of it. 🗑️
2. **Trajectory sampling:** *simulate whole trajectories* under the current policy and update the states/actions encountered along the way — i.e., distribute updates according to the **on-policy distribution** (what the agent would actually experience).

**Is on-policy focusing actually better?** The book's experiments (randomly generated MDPs, Figure 8.8):

- **Short/medium term: yes, substantially** — especially for **large problems** with **small branching factors**, on-policy focusing makes planning dramatically faster at first. The frequently-visited core of the state space gets accurate fast.
- **Long term: it can hurt slightly** — commonly-visited states already have correct values; sweeping rare states would add the last bits of accuracy that focused sampling neglects.
- For problems like backgammon ($10^{20}$ states), sweeps are simply impossible — on-policy trajectory sampling is the *only* option, and its bias toward "states real games actually reach" is exactly why TD-Gammon worked.

> 💡 The agent **ignores the parts of the world its own behavior makes irrelevant**. This is one of RL's superpowers over classical exact methods.

---

## 🤖 Real-time Dynamic Programming (RTDP) (§8.7)

RTDP = trajectory sampling + DP's **expected value-iteration updates**: an on-policy trajectory-sampling version of value iteration.

- While interacting (or simulating), at each visited state apply the full Bellman optimality update: $V(S_t) \leftarrow \max_a \sum_{s',r} p(s',r|S_t,a)[r + \gamma V(s')]$ (possibly also for a few related states).
- Actions are chosen **greedily** w.r.t. the current V (no ε needed — exploration emerges because optimistic initial values + stochastic starts keep trajectories varied).

### Why RTDP is special 🌟

For a meaningful class of problems (stochastic optimal path problems with appropriate initial conditions — e.g., initial V optimistic/admissible), RTDP is **guaranteed to find a policy that is optimal on the relevant states** *without visiting irrelevant states even once*. 

The book's racetrack experiment: RTDP reached a near-optimal policy while visiting only ~2% of the states that conventional sweep-based DP needed to update — roughly **50× fewer updates**. Some states are *never touched*. 🎯

It's also an elegant bridge: **DP's exact updates + RL's experience-driven focus** — the chapter's "planning and learning are one family" thesis in a single algorithm.

---

## 🎯 Key Takeaways

1. Exhaustive sweeps waste effort on irrelevant states; **trajectory sampling** focuses updates on the **on-policy distribution**.
2. On-policy focusing is a big win early and for large, low-branching problems; slight drag asymptotically.
3. **RTDP** = greedy on-policy trajectories + Bellman optimality updates; converges to optimal-on-relevant-states while skipping irrelevant ones entirely.
4. Theme: let **what the agent will actually encounter** drive where computation is spent.

---

➡️ **Next:** [8.5 — Decision-time Planning, Rollouts & Monte Carlo Tree Search](08-05-decision-time-planning-and-mcts.md) — planning not in the background, but *right now, for this very move* — the technology behind AlphaGo.
