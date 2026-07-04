# 16.1 — Applications & Case Studies

> **Chapter 16: Applications and Case Studies** · Book sections: §16.1–§16.8
> Previous: [15.2 — Neural Actor–Critic & Brain RL](15-02-neural-actor-critic-and-brain-rl.md) · Next: [17.1 — Frontiers](17-01-frontiers-and-future.md)

---

## 🌱 The Big Picture

This chapter shows the ideas of the whole book **working at scale** on hard, real problems. Each case study is a recombination of tools you now know. Here are the landmarks every RL student should be able to talk about.

---

## 🎲 TD-Gammon (§16.1) — the one that started the deep-RL dream

Gerald Tesauro, ~1992. A backgammon player that learned by **TD(λ) + a neural network**, trained almost entirely by **self-play**.

- Value function = a multilayer neural net estimating the probability of winning from a board position; trained with the TD error as in Chapter 12; **afterstates** (Ch. 6) as the representation.
- From ~**1.5 million self-play games**, TD-Gammon reached **world-championship level** and even discovered opening moves that **changed how human experts play**. ♟️🤯
- **Why it's pivotal:** it proved nonlinear function approximation + TD could conquer a huge stochastic domain — the direct ancestor of everything "deep RL." Backgammon's dice-driven stochasticity (large branching) is exactly why sample-based TD self-play worked so well here.

## ♟️ Samuel's Checkers & Watson (§16.2–§16.3)
- **Samuel's checkers player** (1959): a stunningly early precursor — learned an evaluation function by a TD-like update and self-play, decades before the theory existed.
- **Watson's Daily-Double wagering** (Jeopardy!): used value estimates to make real-time betting decisions — RL in a famous commercial AI system.

## 🕹️ Human-level Atari with DQN (§16.5) — deep RL arrives

DeepMind's **Deep Q-Network** (2015): one architecture learned to play **49 Atari games** from **raw pixels + score**, reaching human level on many — without game-specific tuning.

- **Algorithm:** Q-learning (Ch. 6) + a deep **convolutional** network for $\hat q(s, a, \mathbf{w})$ (Ch. 9).
- **Two stabilizing tricks** that tame the deadly triad (Ch. 11) in practice:
  1. **Experience replay** — store transitions, train on random minibatches → breaks correlations, reuses data, smooths the distribution.
  2. **Target network** — bootstrap toward a *slowly-updated frozen copy* of the network → keeps the moving target from chasing itself into divergence.
- **Why it mattered:** showed value-based deep RL could learn rich perception and control end-to-end. The engineering answer to "how do you survive FA + bootstrapping + off-policy."

## 🏆 Mastering Go: AlphaGo & AlphaGo Zero (§16.6) — the summit

Go has ~$10^{170}$ states — far beyond brute force; long considered AI's grand challenge.

- **AlphaGo (2016):** combined **deep neural networks** (policy + value nets, Ch. 9 & 13) with **Monte Carlo Tree Search** (Ch. 8). Initialized from human expert games, refined by **self-play policy gradient**, then used the nets to guide MCTS at play time. Beat Lee Sedol 4–1. 🌏
- **AlphaGo Zero (2017):** dropped human data entirely — learned **purely from self-play**, from random initialization. A single network guides MCTS; MCTS outputs become improved training targets (a GPI loop: MCTS = policy improvement, network = policy evaluation 🤝). It **surpassed all prior versions** and generalized (AlphaZero) to chess and shogi.
- **The RL lesson:** the book's two halves — **learning** (self-play value/policy nets) and **planning** (MCTS) — fused into one system, which is exactly the Chapter 8 thesis taken to its triumphant conclusion.

## 🔧 Other studies (§16.4, §16.7–§16.8)
- **Optimizing memory control** (DRAM scheduling), **personalized web services** (recommendations as contextual bandits/RL), and **thermal soaring** (a glider learning to ride thermals like a bird 🦅) — RL beyond games, in systems and the physical world.

---

## 🎯 Key Takeaways

1. **TD-Gammon**: TD(λ) + neural net + self-play → world-class backgammon; birth of the deep-RL idea.
2. **DQN**: Q-learning + deep convnet + **experience replay** + **target network** → human-level Atari from pixels; the practical taming of the deadly triad.
3. **AlphaGo/Zero**: deep policy+value nets + **MCTS** + self-play → superhuman Go; learning and planning unified (a giant GPI).
4. Every breakthrough = **familiar pieces from this book**, scaled up with the right engineering.

---

➡️ **Next chapter:** [17.1 — Frontiers](17-01-frontiers-and-future.md) — what's still unsolved, and where RL is heading.
