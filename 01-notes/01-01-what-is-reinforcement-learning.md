# 1.1 — What is Reinforcement Learning?

> **Chapter 1: Introduction** · Book sections: §1.1, §1.2, §1.4
> Next note: [1.2 — Elements of RL](01-02-elements-of-rl.md)

---

## 🌱 The Big Picture

Think about how a baby learns to walk. Nobody hands the baby a manual that says *"contract this muscle, then that one."* The baby **tries things**, falls down (bad outcome), takes a step (good outcome), and gradually figures out what works — purely by **interacting with the world** and noticing the consequences.

That is the heart of **Reinforcement Learning (RL)**:

> **Reinforcement Learning is learning *what to do* — how to map situations to actions — so as to maximize a numerical reward signal.**

The learner is **not told** which actions to take. Instead, it must **discover** which actions yield the most reward by *trying them out*.

---

## 🧩 The Two Defining Features

RL problems have two characteristics that make them different from everything else in machine learning:

1. **Trial-and-error search** — the agent must try actions to learn their value; nobody labels the "correct" action.
2. **Delayed reward** — an action may affect not only the immediate reward, but also the *next situation* and *all future rewards*. A chess move may look harmless now and lose you the game 20 moves later.

These two features — **search** and **delayed consequences** — are the two most important distinguishing features of reinforcement learning.

---

## 🔍 RL vs. Supervised vs. Unsupervised Learning

This is the most common beginner confusion, so let's make it crystal clear:

| | **Supervised Learning** | **Unsupervised Learning** | **Reinforcement Learning** |
|---|---|---|---|
| **Data** | Labeled examples (input → correct output) | Unlabeled data | Experience from interaction |
| **Feedback** | "The right answer was X" | None (find hidden structure) | "Your action got reward +3" |
| **Goal** | Generalize to unseen examples | Discover patterns/clusters | Maximize cumulative reward |
| **Example** | Classify photos of cats vs. dogs | Group customers by behavior | Learn to play chess by playing |

Two key insights:

- **RL is not supervised learning.** In supervised learning, a teacher tells you the *correct* action. In RL, the reward only tells you *how good* your action was — not what the *best* action would have been. "You got +3" is very different from "you should have chosen action B."
- **RL is not unsupervised learning either.** RL is not trying to find hidden structure; it is trying to **maximize reward**. That makes RL a *third paradigm* of machine learning, alongside the other two.

---

## ⚖️ Exploration vs. Exploitation — The Fundamental Dilemma

Here is a dilemma that exists in RL and in **no other kind of machine learning**:

> To get a lot of reward, the agent must prefer actions it has found effective (**exploit**).
> But to *discover* such actions, it has to try actions it has never selected before (**explore**).

**Real-life analogy 🍕:** You're picking a restaurant for dinner.
- **Exploit:** go to your favorite pizza place — guaranteed good meal.
- **Explore:** try the new Thai place — might be amazing, might be terrible.

If you *only* exploit, you'll never find anything better than your current favorite. If you *only* explore, you waste many dinners on bad food. **Neither pure strategy works** — you must balance them. This *exploration–exploitation trade-off* will follow us through the entire book, starting seriously in Chapter 2.

---

## 🤖 Examples of RL Problems

Notice how different these look on the surface, yet they share the same skeleton — an **agent** interacting with an **environment** to achieve a **goal**:

- A **chess player** makes a move: planning ahead, but final reward (win/lose) comes only at the end.
- An **adaptive controller** in a petroleum refinery adjusts parameters in real time to optimize yield/cost.
- A **gazelle calf** struggles to its feet and is running 20 mph half an hour after birth.
- A **mobile robot** decides whether to enter another room to collect trash or head back to recharge — based on the battery level and past experience finding the charger.
- **You making breakfast** — a deeply nested web of goals and sub-goals (get the bowl, open the fridge, pour the milk), each guided by predictions and ongoing sensing.

In all cases:
- The agent's actions **change the future situation** (next board position, battery level, refinery state).
- The consequences **can't be fully predicted**, so the agent must monitor and react.
- The agent can use experience to **improve over time**.

---

## 🚧 Limitations and Scope (§1.4)

A few honest boundary-markers before we dive in:

- **RL depends heavily on the notion of "state".** Most of this book assumes the state signal is given; *how to build/learn* a state representation is mostly out of scope (Chapter 17 touches it).
- **Most methods here estimate value functions** (we'll define these in the next note). But some approaches — like **evolutionary methods** (genetic algorithms) — solve RL problems *without* ever estimating values, by directly evolving whole behaviors. They can work when policies are small or when the agent can't sense its state well, but they ignore useful information (which individual actions led to reward!) and are usually less efficient. This book focuses on methods that **learn while interacting**.

---

## 🎯 Key Takeaways

1. RL = learning **what to do** by **trial and error** to maximize **cumulative reward**.
2. Two defining features: **no teacher** (only reward feedback) and **delayed consequences**.
3. RL is a **third paradigm**, distinct from supervised and unsupervised learning.
4. The **exploration–exploitation dilemma** is unique to RL and unavoidable.
5. RL takes the **whole-problem view**: a complete, goal-seeking agent interacting with an uncertain environment — not an isolated subproblem.

---

➡️ **Next:** [1.2 — Elements of Reinforcement Learning](01-02-elements-of-rl.md) — the four building blocks every RL system has: policy, reward, value function, and (optionally) a model.
