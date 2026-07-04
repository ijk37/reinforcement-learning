# Chapter 1 — Introduction · Exercises

> Practice for notes [1.1](../01-notes/01-01-what-is-reinforcement-learning.md), [1.2](../01-notes/01-02-elements-of-rl.md), [1.3](../01-notes/01-03-tic-tac-toe-example.md).
> Each exercise has a **💡 Hint** you can read first, and a **collapsible full answer** — try it yourself before expanding!

---

## 🧠 Conceptual

### 1.1 — Why is RL a "third paradigm"?
Explain, in your own words, why reinforcement learning is neither supervised nor unsupervised learning. Give one concrete scenario that *cannot* be framed as supervised learning.

💡 **Hint:** Think about what kind of *feedback* the learner receives in each paradigm.

<details>
<summary>✅ Full Answer</summary>

- **Supervised learning** is trained on labeled examples — for each input there is a known *correct output*, and the goal is to generalize to unseen inputs. The feedback is **instructive** ("the right answer was X").
- **Unsupervised learning** receives unlabeled data and looks for hidden structure (clusters, density). There is no notion of "good" or "bad" outcomes.
- **Reinforcement learning** receives **evaluative** feedback — a scalar reward telling it *how good* an action was, but **not** what the best action would have been. The agent must *discover* good behavior by trial and error, and actions affect future situations.

**A scenario that can't be supervised:** learning to play a new board game well against an imperfect opponent. Nobody can label "the correct move" for every position (that's what we're trying to learn!), and the only signal is win/lose at the end — delayed and evaluative. That's RL, not supervised learning.
</details>

---

### 1.2 — Exploration vs. exploitation in real life
Describe the exploration–exploitation trade-off using a non-restaurant example from your own life. Identify what "exploit" and "explore" mean in your example, and what the cost of *pure* exploitation would be.

💡 **Hint:** Any repeated decision where you have a current favorite but alternatives might be better works.

<details>
<summary>✅ Full Answer</summary>

Example answer (commuting route 🚗):
- **Exploit:** take the route you currently believe is fastest.
- **Explore:** try a different route to gather information about its travel time.
- **Cost of pure exploitation:** if a faster route exists but you never try it (maybe a new road opened, or traffic patterns changed), you'll *never discover it* and will be permanently suboptimal. Pure exploitation locks in your current (possibly wrong) estimate.
- **Cost of pure exploration:** you'd waste time on routes you already know are slow.

The point: you need *both*, and the right balance depends on how much commuting you have left to do (long horizon → more exploration pays off). This connects to the formal bandit treatment in Chapter 2.
</details>

---

### 1.3 — The four elements
For a **self-driving delivery robot**, identify a plausible: (a) policy, (b) reward signal, (c) what a high *value* but low *immediate reward* state looks like, and (d) a model.

💡 **Hint:** Reward = what's good *now*; value = what's good *in the long run*. They can disagree.

<details>
<summary>✅ Full Answer</summary>

- **(a) Policy:** a mapping from sensor state (position, battery, traffic) to driving actions ("if intersection clear → proceed; if battery < 15% → route to charger").
- **(b) Reward:** +10 per successful delivery, −1 per minute elapsed, −100 for a collision.
- **(c) High value, low immediate reward:** sitting at a charging station. *Immediate* reward is slightly negative (time passing, no deliveries), but the *value* is high — recharging enables many future deliveries. A short-sighted agent maximizing immediate reward would never charge; a value-based agent will.
- **(d) Model:** an internal map predicting "if I take this road, I'll arrive at that intersection in ~2 minutes" — used to *plan* routes before driving them.
</details>

---

## 🔢 Math / Worked

### 1.4 — One TD update by hand
Using the tic-tac-toe value update $V(S_t) \leftarrow V(S_t) + \alpha[V(S_{t+1}) - V(S_t)]$ with $\alpha = 0.2$: your current state value is $V(A) = 0.4$, and after your greedy move you reach state $B$ with $V(B) = 0.9$. Compute the new $V(A)$. Then explain in words what just happened.

💡 **Hint:** Just plug in — then interpret the sign of the change.

<details>
<summary>✅ Full Answer</summary>

$$V(A) \leftarrow 0.4 + 0.2 \times (0.9 - 0.4) = 0.4 + 0.2 \times 0.5 = 0.4 + 0.1 = 0.5$$

**Interpretation:** state $A$ led to a much better-looking state $B$ (0.9 vs. our estimate 0.4), so $A$ was *underrated*. We nudge $V(A)$ upward by 20% of the gap, from 0.4 to 0.5. Over many games these adjustments propagate accurate win-probabilities backward from terminal states to early states.
</details>

---

### 1.5 — Why don't we update on exploratory moves?
In the Chapter 1 tic-tac-toe agent, value updates are applied only after **greedy** moves, not exploratory ones. Why? What would go wrong if we updated after exploratory moves too (in this simple scheme)?

💡 **Hint:** The value of a state is supposed to estimate the outcome under our *intended (greedy)* play.

<details>
<summary>✅ Full Answer</summary>

$V(s)$ is meant to estimate the probability of winning **if we play our best (greedy) line from $s$**. An exploratory move is, by definition, *not* what we believe is best — it's a deliberate experiment. If we backed up the value of an exploratory move into the earlier state, we'd be teaching $V$ that the earlier state leads to whatever the (deliberately suboptimal) exploration produced, polluting the estimate of greedy play.

So in this simple scheme we skip updates on exploratory moves. (Later, the book formalizes ways to *correctly* learn from exploratory actions — this is the **on-policy vs. off-policy** distinction, Chapters 5–6. Off-policy methods learn the greedy policy's values *while* behaving exploratorily.)
</details>

---

## 💻 Code

### 1.6 — A self-play tic-tac-toe value learner (mini project)
Write pseudocode (or real Python) for a value-table tic-tac-toe agent that learns by self-play using the TD update from note 1.3. Specify: how states are keyed, how values are initialized, the ε-greedy move selection, and where the update goes.

💡 **Hint:** A dict keyed by a board-string works for state values. Initialize wins=1, losses/draws=0, others=0.5.

<details>
<summary>✅ Full Answer</summary>

```python
import random

V = {}                      # board_key (str) -> estimated win probability
ALPHA, EPSILON = 0.1, 0.1

def value(board_key, is_win, is_loss_or_draw):
    if board_key not in V:
        V[board_key] = 1.0 if is_win else (0.0 if is_loss_or_draw else 0.5)
    return V[board_key]

def play_game():
    state = empty_board()
    prev_key = None
    while not terminal(state):
        moves = legal_moves(state)
        if random.random() < EPSILON:
            move = random.choice(moves)
            greedy = False
        else:
            # pick move leading to the highest-valued afterstate
            move = max(moves, key=lambda m: value_of(apply(state, m)))
            greedy = True

        next_state = apply(state, move)
        cur_key = key(next_state)

        # TD update on the PREVIOUS greedy state's value
        if greedy and prev_key is not None:
            V[prev_key] += ALPHA * (value_of(next_state) - V[prev_key])

        if greedy:
            prev_key = cur_key       # only remember greedy states for updating
        state = next_state

    # final backup toward the terminal outcome (1 win / 0 otherwise)
    if prev_key is not None:
        V[prev_key] += ALPHA * (terminal_value(state) - V[prev_key])
```

Key design points:
- **State keying:** a canonical string of the 9 cells (optionally fold symmetric boards together to learn faster).
- **Initialization:** wins → 1, losses/draws → 0, everything else → 0.5 ("I don't know yet").
- **ε-greedy:** explore with probability ε, otherwise pick the move to the highest-valued afterstate.
- **Update placement:** after each *greedy* move, nudge the *previous* greedy state toward the new state's value; at game end, nudge toward the actual result.

Train over tens of thousands of games and `V` converges to win probabilities against the opponent it played.
</details>

---

➡️ Next: [Chapter 2 — Multi-armed Bandits exercises](02-bandits-exercises.md)
