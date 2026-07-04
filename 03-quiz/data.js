// ============================================================================
//  Reinforcement Learning Quiz Data — Sutton & Barto, 2nd edition
//  data.js        →  TOPICS list, config, and chapters 01–02
//  data-part1.js  →  chapters 03–08 (Tabular Solution Methods)
//  data-part2.js  →  chapters 09–13 (Approximate Solution Methods)
//  data-part3.js  →  chapters 14–17 (Looking Deeper)
//  data-mixed.js  →  cumulative mixed quizzes
// ============================================================================

const TOPICS = [
  { id: "01", title: "Introduction" },
  { id: "02", title: "Multi-armed Bandits" },
  { id: "03", title: "Finite Markov Decision Processes" },
  { id: "04", title: "Dynamic Programming" },
  { id: "05", title: "Monte Carlo Methods" },
  { id: "06", title: "Temporal-Difference Learning" },
  { id: "07", title: "n-step Bootstrapping" },
  { id: "08", title: "Planning and Learning" },
  { id: "09", title: "On-policy Prediction with Approximation" },
  { id: "10", title: "On-policy Control with Approximation" },
  { id: "11", title: "Off-policy Methods with Approximation" },
  { id: "12", title: "Eligibility Traces" },
  { id: "13", title: "Policy Gradient Methods" },
  { id: "14", title: "Psychology" },
  { id: "15", title: "Neuroscience" },
  { id: "16", title: "Applications and Case Studies" },
  { id: "17", title: "Frontiers" },
  { id: "mixed-1", title: "Mixed Quiz 1 — Foundations & Tabular" },
  { id: "mixed-2", title: "Mixed Quiz 2 — Approximation & Beyond" },
  { id: "mixed-3", title: "Mixed Quiz 3 — Full Book Review" },
];

// ── Quiz sizing ─────────────────────────────────────────────────────────────
// Each attempt draws a RANDOM subset of this many questions from the topic
// pool (re-picked on every retry). If a pool is smaller than the configured
// size, the whole pool is used. Override per attempt with a ?n= URL parameter.
const QUIZ_CONFIG = {
  defaultAttempt: 10,
  attempt: {
    "mixed-1": 20,
    "mixed-2": 20,
    "mixed-3": 30,
  },
};

// How many questions a given topic shows per attempt (capped at pool size).
function attemptSizeFor(topicId, poolLen) {
  const cfg = (QUIZ_CONFIG.attempt && QUIZ_CONFIG.attempt[topicId]) || QUIZ_CONFIG.defaultAttempt;
  return Math.min(cfg, poolLen);
}

const QUESTIONS = {};

// ── Chapter 01 — Introduction ───────────────────────────────────────────────
QUESTIONS["01"] = [
  {
    q: "How is reinforcement learning best defined?",
    options: [
      "Learning to map situations to actions so as to maximize a numerical reward signal",
      "Learning a function from labeled input–output examples",
      "Finding hidden structure in unlabeled data",
      "Memorizing the correct action for every state from a teacher",
    ],
    answer: 0,
    explain: "RL is learning what to do — how to map situations to actions — so as to maximize a numerical reward signal. The learner is not told which actions to take; it must discover them by trying them out.",
  },
  {
    q: "What are the two most important distinguishing features of reinforcement learning?",
    options: [
      "Large datasets and gradient descent",
      "Trial-and-error search and delayed reward",
      "Supervised labels and cross-validation",
      "Clustering and dimensionality reduction",
    ],
    answer: 1,
    explain: "The two characteristics that set RL apart are trial-and-error search (nobody labels the correct action) and delayed reward (an action can affect not only the immediate reward but also future situations and rewards).",
  },
  {
    q: "The trade-off unique to reinforcement learning, absent from supervised and unsupervised learning, is between...",
    options: [
      "Bias and variance",
      "Training and test error",
      "Exploration and exploitation",
      "Precision and recall",
    ],
    answer: 2,
    explain: "To maximize reward the agent must exploit actions it already knows are good, but it must also explore to discover better actions. Balancing exploration and exploitation is a challenge that does not arise in supervised or unsupervised learning.",
  },
  {
    q: "Why is reinforcement learning NOT considered a form of supervised learning?",
    options: [
      "It never uses function approximation",
      "There is no external supervisor providing correct actions; the agent learns from a reward signal by interacting",
      "It only works on unlabeled images",
      "It requires the true model of the environment in advance",
    ],
    answer: 1,
    explain: "Supervised learning learns from a training set of labeled examples (the correct action for each situation). In RL there is no such supervisor — the agent learns from its own experience and a scalar reward, which is different from being told the right answer.",
  },
  {
    q: "Which of the following is NOT one of the four main elements of a reinforcement learning system?",
    options: ["A policy", "A reward signal", "A value function", "A loss function"],
    answer: 3,
    explain: "The four main sub-elements are a policy, a reward signal, a value function, and (optionally) a model of the environment. 'Loss function' is not one of them.",
  },
  {
    q: "What is a policy in reinforcement learning?",
    options: [
      "A mapping from states to actions (the agent's way of behaving)",
      "The total reward accumulated over an episode",
      "A model that predicts the next state",
      "The discount rate applied to future rewards",
    ],
    answer: 0,
    explain: "A policy defines the learning agent's way of behaving at a given time — a mapping from perceived states to actions to be taken. It is the core of an RL agent and may be stochastic.",
  },
  {
    q: "What is the key distinction between a reward and a value?",
    options: [
      "Reward is long-term desirability; value is immediate",
      "Reward signals immediate, intrinsic desirability; value estimates long-term desirability (expected future reward)",
      "They are identical",
      "Value is given by the environment; reward is estimated by the agent",
    ],
    answer: 1,
    explain: "Reward is the immediate, intrinsic desirability of a state. Value is the total amount of reward an agent can expect to accumulate over the future starting from that state. We seek actions that bring highest value, not highest immediate reward.",
  },
  {
    q: "In the tic-tac-toe example used to introduce RL, how are the state values updated?",
    options: [
      "By a supervised label after each game",
      "By backing up the value of a later state toward the current state (a temporal-difference update)",
      "By exhaustively enumerating the full game tree",
      "By a fixed lookup table that never changes",
    ],
    answer: 1,
    explain: "The tic-tac-toe example uses a temporal-difference update: after a greedy move, the value of the earlier state is adjusted toward the value of the later state, V(S_t) ← V(S_t) + α[V(S_{t+1}) − V(S_t)]. This is learning from experience without a model of the opponent.",
  },
];

// ── Chapter 02 — Multi-armed Bandits ────────────────────────────────────────
QUESTIONS["02"] = [
  {
    q: "In the k-armed bandit problem, what is the agent trying to do?",
    options: [
      "Reach a goal state in as few steps as possible",
      "Repeatedly choose among k actions to maximize expected total reward over time",
      "Learn a model of state transitions",
      "Minimize the number of arms pulled",
    ],
    answer: 1,
    explain: "In the k-armed bandit you repeatedly face a choice among k actions; each yields a reward from a stationary probability distribution. The objective is to maximize expected total reward over some time period — a single-state problem with no delayed consequences.",
  },
  {
    q: "The true value q*(a) of an action a is defined as...",
    options: [
      "The reward received the last time a was selected",
      "The expected (mean) reward given that a is selected",
      "The number of times a has been chosen",
      "The maximum reward ever observed for a",
    ],
    answer: 1,
    explain: "q*(a) = E[R_t | A_t = a], the expected reward given that action a is selected. Because we don't know q*(a), we form estimates Q_t(a) and use them to choose actions.",
  },
  {
    q: "The sample-average method estimates an action's value as...",
    options: [
      "The most recent reward for that action",
      "The average of all rewards received so far when that action was taken",
      "A weighted average that forgets old rewards exponentially",
      "The sum of all rewards across all actions",
    ],
    answer: 1,
    explain: "The sample-average estimate is the mean of the rewards actually received when the action was taken. By the law of large numbers it converges to q*(a) as the action is selected infinitely often.",
  },
  {
    q: "What does an ε-greedy action-selection method do?",
    options: [
      "Always selects the action with the highest estimated value",
      "Selects a random action every step",
      "Selects the greedy action most of the time but with probability ε selects a random action",
      "Selects actions in proportion to their estimated values",
    ],
    answer: 2,
    explain: "ε-greedy exploits (picks the highest-estimate action) with probability 1−ε and explores (picks uniformly at random among all actions) with probability ε. This guarantees every action is sampled infinitely often in the limit.",
  },
  {
    q: "The general incremental update rule NewEstimate ← OldEstimate + StepSize · [Target − OldEstimate] moves the estimate...",
    options: [
      "Away from the target",
      "Toward the target by a fraction given by the step size",
      "To exactly the target in one step regardless of step size",
      "Randomly",
    ],
    answer: 1,
    explain: "This is the ubiquitous update form in the book: the estimate is nudged toward the target by an amount proportional to the step size (learning rate). For sample averages the step size is 1/n.",
  },
  {
    q: "For a NONSTATIONARY bandit problem (true values drift over time), what step size is preferred over 1/n?",
    options: [
      "A constant step size α, giving an exponentially weighted recency average",
      "A step size that shrinks to zero as 1/n",
      "A step size of exactly 1 every step",
      "A negative step size",
    ],
    answer: 0,
    explain: "A constant α weights recent rewards more heavily (exponential recency-weighted average), so the estimate tracks the changing true values. The 1/n step size gives equal weight to all past rewards and converges — good only for stationary problems.",
  },
  {
    q: "How do optimistic initial values encourage exploration?",
    options: [
      "By adding random noise to each estimate",
      "By setting initial estimates much higher than plausible rewards, so early disappointment drives the agent to try other actions",
      "By decreasing ε over time",
      "By using a softmax over preferences",
    ],
    answer: 1,
    explain: "If initial estimates are set optimistically high, whichever actions are tried yield rewards below the estimate, so the learner becomes 'disappointed' and switches to others — driving systematic early exploration even for a greedy method. It is a simple trick effective mainly in stationary problems.",
  },
  {
    q: "Upper-Confidence-Bound (UCB) action selection adds a term that...",
    options: [
      "Penalizes actions that have been tried often",
      "Grows with uncertainty, favoring actions selected fewer times (a bonus of c·sqrt(ln t / N_t(a)))",
      "Is proportional to the immediate reward",
      "Randomizes the greedy choice with probability ε",
    ],
    answer: 1,
    explain: "UCB selects the action maximizing Q_t(a) + c·sqrt(ln t / N_t(a)). The square-root term is an uncertainty/confidence bonus: actions chosen fewer times have larger uncertainty and get explored, but the bonus shrinks as an action is tried more.",
  },
  {
    q: "Gradient bandit algorithms select actions by...",
    options: [
      "Estimating action values and picking the greedy one",
      "Learning numerical preferences H(a) and using a softmax distribution over them",
      "Always exploring uniformly at random",
      "Solving the Bellman equation",
    ],
    answer: 1,
    explain: "Gradient bandits learn a preference H_t(a) for each action (not a value estimate) and choose actions via a soft-max (Gibbs/Boltzmann) distribution. Preferences are updated by stochastic gradient ascent on expected reward, often using the average reward as a baseline.",
  },
  {
    q: "In a stationary k-armed bandit, if ε = 0 (pure greedy) and estimates start at 0, what is the risk?",
    options: [
      "The agent explores too much and never converges",
      "The agent may lock onto a suboptimal action and never discover a better one",
      "The step size becomes negative",
      "The reward distribution changes",
    ],
    answer: 1,
    explain: "A pure-greedy agent never explores: it exploits whatever looks best from limited early samples and can get stuck on a suboptimal action, never sampling the truly best one. Some exploration (ε>0, UCB, or optimistic starts) is needed.",
  },
];
