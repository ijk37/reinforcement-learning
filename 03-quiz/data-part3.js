// ============================================================================
//  data-part3.js — Chapters 14–17 (Looking Deeper)
// ============================================================================

// ── Chapter 14 — Psychology ──────────────────────────────────────────────────
QUESTIONS["14"] = [
  {
    q: "In classical (Pavlovian) conditioning, learning is about...",
    options: [
      "Choosing actions to obtain reward",
      "Predicting a biologically significant event (US) from a neutral stimulus (CS)",
      "Building a model of the environment's transitions",
      "Maximizing average reward",
    ],
    answer: 1,
    explain: "Classical conditioning is prediction learning: an initially neutral conditioned stimulus (CS) comes to predict an unconditioned stimulus (US), eliciting a conditioned response. It maps onto RL's PREDICTION problem (value learning), not control.",
  },
  {
    q: "The TD model of classical conditioning improves on the Rescorla–Wagner model mainly by...",
    options: [
      "Removing the notion of prediction error",
      "Accounting for the TIMING within trials and higher-order (second-order) conditioning via a temporal-difference prediction error",
      "Requiring a full model of the brain",
      "Ignoring stimulus timing",
    ],
    answer: 1,
    explain: "Rescorla–Wagner explains trial-level effects using a prediction error but ignores within-trial timing. The TD model uses a temporal-difference error over time steps, capturing the timing of responses and phenomena like second-order conditioning that R–W cannot.",
  },
  {
    q: "The 'blocking' phenomenon — where a previously conditioned stimulus prevents learning about a new one — is explained by...",
    options: [
      "The total reward being too small",
      "Error-driven learning: if the outcome is already predicted, the prediction error is ~0, so no new learning occurs",
      "A lack of exploration",
      "The discount factor being 1",
    ],
    answer: 1,
    explain: "Blocking supports error-driven (not mere contiguity) learning: when stimulus A already predicts the US, adding stimulus B produces little prediction error, so B acquires little associative strength. This matches the TD/Rescorla–Wagner error term.",
  },
  {
    q: "In instrumental (operant) conditioning, behavior is...",
    options: [
      "Purely reflexive and independent of outcome",
      "Controlled by its consequences — actions followed by reward are strengthened (maps onto RL's CONTROL problem)",
      "Only about predicting stimuli",
      "Unrelated to reinforcement learning",
    ],
    answer: 1,
    explain: "Instrumental conditioning is about learning behavior from its consequences (the Law of Effect): responses followed by satisfying outcomes are strengthened. This corresponds to RL's control problem — improving a policy from reward.",
  },
  {
    q: "The distinction between habitual and goal-directed behavior parallels which RL distinction?",
    options: [
      "On-policy vs. off-policy",
      "Model-free (habitual, cached values) vs. model-based (goal-directed, planning with a model)",
      "Episodic vs. continuing",
      "Prediction vs. reward",
    ],
    answer: 1,
    explain: "Habits are like model-free learning: fast, cached action values insensitive to current goal value. Goal-directed behavior is like model-based planning: it uses a model of action–outcome relations and is sensitive to outcome revaluation.",
  },
  {
    q: "The RL concept that corresponds to a psychological 'secondary reinforcer' is...",
    options: [
      "The discount factor",
      "A learned value/prediction that itself becomes rewarding (as in TD bootstrapping toward predicted value)",
      "The behavior policy",
      "The importance-sampling ratio",
    ],
    answer: 1,
    explain: "A secondary (conditioned) reinforcer is a stimulus that gains reinforcing power by predicting primary reward — analogous to how a TD value estimate acts as a proxy target, so that reaching a high-value state is itself 'rewarding' through bootstrapping.",
  },
];

// ── Chapter 15 — Neuroscience ────────────────────────────────────────────────
QUESTIONS["15"] = [
  {
    q: "The reward prediction error hypothesis of dopamine states that...",
    options: [
      "Dopamine encodes the absolute amount of reward received",
      "The phasic activity of dopamine neurons signals a reward prediction error, closely resembling the TD error δ",
      "Dopamine encodes the current state",
      "Dopamine is unrelated to reward",
    ],
    answer: 1,
    explain: "The influential hypothesis (Schultz, Montague, Dayan) is that phasic dopamine signals a reward PREDICTION ERROR — not reward itself — behaving like the TD error δ = R + γV(S') − V(S). This is a landmark link between RL theory and the brain.",
  },
  {
    q: "A hallmark finding supporting this hypothesis: after learning, dopamine neurons fire most strongly at...",
    options: [
      "The delivery of the (now-predicted) reward",
      "The earliest reliable predictor (the cue), and DIP below baseline if a predicted reward is omitted",
      "Random times",
      "Only during sleep",
    ],
    answer: 1,
    explain: "Before learning, dopamine responds to the reward. After learning, the response shifts to the earliest predictive cue, and if an expected reward is omitted, firing dips below baseline at the expected time — exactly the sign pattern of a TD prediction error.",
  },
  {
    q: "The brain structure most associated with actor–critic-like reinforcement learning is the...",
    options: [
      "Cerebellum",
      "Basal ganglia (with dorsal/ventral striatum proposed as actor/critic)",
      "Primary visual cortex",
      "Spinal cord",
    ],
    answer: 1,
    explain: "The basal ganglia, modulated by dopamine, are widely modeled as implementing actor–critic RL: the ventral striatum resembling a critic (value/prediction) and the dorsal striatum an actor (action selection), with dopaminergic TD error as the teaching signal.",
  },
  {
    q: "In the neural actor–critic model, the dopamine prediction-error signal is used to...",
    options: [
      "Only update the critic",
      "Train BOTH the critic (value estimates) and the actor (action preferences/policy)",
      "Only update the actor",
      "Reset the environment",
    ],
    answer: 1,
    explain: "The same TD/dopamine error trains both components: it adjusts the critic's value predictions and reinforces the actor's action tendencies (increasing propensity for actions that led to positive prediction error), mirroring the algorithmic actor–critic.",
  },
  {
    q: "What does it mean that reward signals in the brain are largely 'internal'?",
    options: [
      "Rewards come only from outside the organism",
      "Reward signals are generated by the brain/body itself (e.g., via neural reward circuitry), consistent with RL placing the reward signal inside the agent–environment boundary appropriately",
      "The brain ignores external events",
      "Reward equals sensory input",
    ],
    answer: 1,
    explain: "Biological reward signals are produced internally by the nervous system, not handed to the organism as a number. The book notes this fits the RL framework, where the reward signal is defined at the agent–environment interface and reflects the organism's own evaluative systems.",
  },
];

// ── Chapter 16 — Applications and Case Studies ───────────────────────────────
QUESTIONS["16"] = [
  {
    q: "TD-Gammon, Tesauro's backgammon program, achieved strong play by combining...",
    options: [
      "A hand-coded rule base only",
      "TD(λ) learning with a multilayer neural network trained largely through self-play",
      "Exhaustive minimax search of the full game tree",
      "Supervised learning from human games only",
    ],
    answer: 1,
    explain: "TD-Gammon used TD(λ) to train a neural network value function through self-play, reaching near-expert (and novel) play. It is a celebrated early demonstration of RL plus nonlinear function approximation on a hard problem.",
  },
  {
    q: "Samuel's checkers player, an early milestone, notably used...",
    options: [
      "Deep reinforcement learning on GPUs",
      "A form of temporal-difference learning and self-play to tune an evaluation function, decades before the term 'TD' existed",
      "Only random play",
      "A complete game-tree solution",
    ],
    answer: 1,
    explain: "Arthur Samuel's 1950s–60s checkers program used self-play and an early form of temporal-difference learning (with a heuristic evaluation function and lookahead), anticipating key RL ideas long before they were formalized.",
  },
  {
    q: "DeepMind's DQN reached human-level play on many Atari 2600 games by...",
    options: [
      "Using a hand-crafted feature for each game",
      "Learning Q-values end-to-end from raw pixels with a convolutional network, experience replay, and a target network",
      "Using a full model of each game",
      "Policy gradients only",
    ],
    answer: 1,
    explain: "DQN combined Q-learning with a deep convolutional network taking raw pixels, plus two stabilizers: experience replay (breaking correlations, reusing data) and a periodically updated target network. It learned many Atari games from the same architecture.",
  },
  {
    q: "In DQN, the purpose of experience replay is to...",
    options: [
      "Increase the discount factor",
      "Store transitions and sample them randomly, breaking temporal correlations and reusing each transition many times",
      "Remove the need for a reward",
      "Make learning on-policy",
    ],
    answer: 1,
    explain: "Experience replay stores transitions in a buffer and trains on random minibatches. This decorrelates consecutive updates (stabilizing the deadly-triad combination) and improves data efficiency by reusing experience. The target network further stabilizes the bootstrap target.",
  },
  {
    q: "AlphaGo defeated top human Go players by combining...",
    options: [
      "Only supervised learning from human games",
      "Deep neural networks (policy and value) with Monte Carlo Tree Search, trained via supervised learning and self-play RL",
      "Brute-force full-width search",
      "Tabular Q-learning",
    ],
    answer: 1,
    explain: "AlphaGo paired deep policy and value networks with MCTS. It was bootstrapped from human games (supervised) then improved by self-play reinforcement learning. AlphaGo Zero later learned entirely from self-play with no human data.",
  },
  {
    q: "A common theme across these case studies is that RL succeeds on hard problems when combined with...",
    options: [
      "Small tabular representations",
      "Powerful function approximation (often deep networks), self-play or simulation, and sometimes search",
      "No exploration",
      "A perfect model given in advance",
    ],
    answer: 1,
    explain: "The landmark successes share a recipe: RL algorithms scaled up with strong function approximation (neural networks), abundant self-generated experience (self-play/simulation), and, where useful, planning/search — turning RL principles into superhuman systems.",
  },
];

// ── Chapter 17 — Frontiers ───────────────────────────────────────────────────
QUESTIONS["17"] = [
  {
    q: "General Value Functions (GVFs) generalize value functions by...",
    options: [
      "Only predicting the standard reward",
      "Predicting arbitrary signals (pseudo-rewards/cumulants) under arbitrary policies and terminations, enabling rich predictive knowledge",
      "Removing the discount factor",
      "Requiring a full model",
    ],
    answer: 1,
    explain: "GVFs extend value functions to predict many different cumulant signals (not just reward), each under its own target policy and termination function. A large collection of GVFs can represent much of an agent's predictive knowledge of the world.",
  },
  {
    q: "Temporal abstraction via 'options' refers to...",
    options: [
      "Choosing the discount factor",
      "Treating extended courses of action (with their own policies and termination conditions) as higher-level actions for planning and learning",
      "A type of eligibility trace",
      "An exploration bonus",
    ],
    answer: 1,
    explain: "Options are closed-loop temporally extended behaviors — each has an internal policy, an initiation set, and a termination condition. They let agents plan and learn at multiple time scales, a core idea in hierarchical reinforcement learning.",
  },
  {
    q: "The chapter emphasizes that designing the REWARD signal is difficult because...",
    options: [
      "Rewards must always be sparse",
      "A poorly shaped reward can be exploited or lead to unintended behavior; the reward must faithfully capture the true goal",
      "Rewards cannot be negative",
      "Reward design is fully automated",
    ],
    answer: 1,
    explain: "Reward design is subtle: agents optimize exactly what is rewarded, so mis-specified or naively shaped rewards can produce unintended, 'gamed' behavior. Getting the reward to reflect the designer's true objective is a central practical and safety challenge.",
  },
  {
    q: "An 'off-policy' architecture for learning many predictions in parallel (like Horde) relies on...",
    options: [
      "A single on-policy value function",
      "Many independent GVF learners (demons) that learn off-policy from one shared stream of experience",
      "A perfect model of the world",
      "Supervised labels for every prediction",
    ],
    answer: 1,
    explain: "The Horde architecture runs many independent reinforcement-learning 'demons' in parallel, each learning a GVF off-policy from the same behavior stream. Off-policy learning is what allows one experience stream to train predictions about many different target policies at once.",
  },
  {
    q: "Regarding the future, the book argues that a promising direction is agents that...",
    options: [
      "Rely entirely on hand-engineered features",
      "Learn features/representations and predictive knowledge autonomously from experience, scaling with computation and data",
      "Avoid function approximation",
      "Only use tabular methods",
    ],
    answer: 1,
    explain: "The frontiers chapter looks toward agents that construct their own representations and predictive world knowledge through experience, leaning on learning and search that scale with computation — rather than depending on human-engineered features.",
  },
];
