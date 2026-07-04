// ============================================================================
//  data-part1.js — Chapters 03–08 (Tabular Solution Methods)
// ============================================================================

// ── Chapter 03 — Finite Markov Decision Processes ───────────────────────────
QUESTIONS["03"] = [
  {
    q: "What does the Markov property state about a state signal?",
    options: [
      "The state must be fully observable by cameras",
      "The future is independent of the past given the present state (the state summarizes all relevant history)",
      "Rewards must always be positive",
      "The environment must be deterministic",
    ],
    answer: 1,
    explain: "A state has the Markov property if it retains all relevant information — the transition and reward depend only on the current state and action, not on the earlier history. This lets the dynamics be written p(s',r | s,a).",
  },
  {
    q: "The return G_t in the discounted, continuing case is defined as...",
    options: [
      "The immediate reward R_{t+1} only",
      "The sum of all future rewards with no discounting",
      "G_t = R_{t+1} + γR_{t+2} + γ²R_{t+3} + … = Σ γ^k R_{t+k+1}",
      "The average reward per step",
    ],
    answer: 2,
    explain: "The discounted return is G_t = R_{t+1} + γR_{t+2} + γ²R_{t+3} + …, where 0 ≤ γ ≤ 1 is the discount rate. It satisfies the recursive relation G_t = R_{t+1} + γG_{t+1}.",
  },
  {
    q: "What is the effect of the discount rate γ approaching 0?",
    options: [
      "The agent becomes far-sighted, weighting distant rewards heavily",
      "The agent becomes myopic (short-sighted), caring almost only about immediate reward",
      "The return becomes infinite",
      "The policy becomes deterministic",
    ],
    answer: 1,
    explain: "With γ near 0 the agent is 'myopic' — it maximizes essentially the immediate reward R_{t+1}. As γ → 1 the agent becomes more far-sighted, weighting future rewards more strongly.",
  },
  {
    q: "The state-value function v_π(s) is defined as...",
    options: [
      "The immediate reward in state s",
      "The expected return when starting in s and following policy π thereafter",
      "The number of times s is visited",
      "The best possible reward in s",
    ],
    answer: 1,
    explain: "v_π(s) = E_π[G_t | S_t = s], the expected return starting from state s and following policy π. The action-value q_π(s,a) is the expected return starting from s, taking a, then following π.",
  },
  {
    q: "The reward hypothesis states that all goals can be framed as...",
    options: [
      "Minimizing a supervised loss",
      "The maximization of the expected value of the cumulative sum of a received scalar reward signal",
      "Reaching a fixed terminal state",
      "Imitating an expert policy",
    ],
    answer: 1,
    explain: "The reward hypothesis holds that what we mean by goals and purposes can be represented as the maximization of the expected cumulative sum of a scalar reward signal. Reward should signal WHAT to achieve, not HOW.",
  },
  {
    q: "The Bellman equation for v_π expresses the value of a state as...",
    options: [
      "The maximum immediate reward available",
      "A relationship between the value of a state and the (discounted) values of its successor states",
      "The sum of all rewards ever received",
      "An unrelated quantity to successor states",
    ],
    answer: 1,
    explain: "The Bellman equation v_π(s) = Σ_a π(a|s) Σ_{s',r} p(s',r|s,a)[r + γ v_π(s')] relates a state's value to the expected immediate reward plus the discounted value of successor states — a consistency condition satisfied by v_π.",
  },
  {
    q: "A policy π is defined to be at least as good as π' if...",
    options: [
      "It has fewer parameters",
      "v_π(s) ≥ v_π'(s) for all states s",
      "It reaches the goal faster in one episode",
      "It uses less exploration",
    ],
    answer: 1,
    explain: "Policies are partially ordered by their value functions: π ≥ π' iff v_π(s) ≥ v_π'(s) for every state s. An optimal policy is one that is ≥ all others; all optimal policies share the optimal value function v*.",
  },
  {
    q: "The Bellman OPTIMALITY equation for v* differs from the Bellman equation for v_π in that it...",
    options: [
      "Averages over actions using the policy π",
      "Takes a MAX over actions instead of averaging under a policy",
      "Ignores the discount factor",
      "Requires no model of the dynamics",
    ],
    answer: 1,
    explain: "v*(s) = max_a Σ_{s',r} p(s',r|s,a)[r + γ v*(s')]. The optimality equation replaces the policy-weighted average over actions with a maximization — the value of a state under an optimal policy equals the expected return for the best action.",
  },
  {
    q: "Given the optimal action-value function q*, how do you act optimally?",
    options: [
      "Solve a system of linear equations at every step",
      "Act greedily: in each state pick the action a that maximizes q*(s,a)",
      "Average over all actions",
      "Follow a random policy",
    ],
    answer: 1,
    explain: "With q* in hand, an optimal policy is simply to select, in each state, an action that maximizes q*(s,a). No search or model is needed — q* already caches the results of one-step-ahead optimal behavior.",
  },
  {
    q: "The boundary between agent and environment in the MDP framework is typically drawn...",
    options: [
      "At the agent's physical body",
      "At the limit of the agent's absolute control — things it cannot change arbitrarily are part of the environment",
      "Wherever rewards are largest",
      "So the reward computation is inside the agent",
    ],
    answer: 1,
    explain: "The agent–environment boundary is the limit of the agent's absolute control, not of its knowledge. Anything the agent cannot arbitrarily change (including reward computation and even its 'muscles') is treated as part of the environment.",
  },
];

// ── Chapter 04 — Dynamic Programming ─────────────────────────────────────────
QUESTIONS["04"] = [
  {
    q: "Dynamic programming (DP) methods for RL require...",
    options: [
      "No model at all",
      "A perfect model of the environment as a Markov decision process",
      "Only sample transitions from experience",
      "A neural network function approximator",
    ],
    answer: 1,
    explain: "DP assumes a perfect model of the environment's dynamics p(s',r|s,a). This limits its practicality, but DP provides the theoretical foundation (and the target that other methods approximate without a model).",
  },
  {
    q: "Iterative policy evaluation computes v_π by...",
    options: [
      "Taking the max over actions each sweep",
      "Repeatedly applying the Bellman equation for v_π as an update until values converge",
      "Running episodes and averaging returns",
      "Solving a single linear equation",
    ],
    answer: 1,
    explain: "Policy evaluation turns the Bellman equation for v_π into an update rule (an expected update) and sweeps through the states repeatedly. The sequence of value functions converges to v_π as the number of sweeps → ∞.",
  },
  {
    q: "The policy improvement theorem guarantees that acting greedily with respect to v_π yields a policy that is...",
    options: [
      "Always strictly worse",
      "At least as good as π (and strictly better unless π is already optimal)",
      "Optimal after a single step in all cases",
      "Unrelated to π",
    ],
    answer: 1,
    explain: "The policy improvement theorem: if π' is greedy with respect to v_π, then π' ≥ π. If π' is no better than π, then both are optimal. This is what makes alternating evaluation and improvement converge to an optimal policy.",
  },
  {
    q: "Policy iteration consists of...",
    options: [
      "A single sweep of value updates",
      "Alternating complete policy evaluation with policy improvement until the policy stops changing",
      "Random restarts of the policy",
      "Only improving the policy, never evaluating it",
    ],
    answer: 1,
    explain: "Policy iteration alternates two steps: (1) policy evaluation (compute v_π), and (2) policy improvement (make π greedy w.r.t. v_π). Because a finite MDP has finitely many policies, this converges to an optimal policy in a finite number of iterations.",
  },
  {
    q: "How does value iteration differ from policy iteration?",
    options: [
      "It never uses the Bellman equation",
      "It truncates policy evaluation to a single sweep and folds in the max (Bellman optimality update)",
      "It requires no model",
      "It cannot find an optimal policy",
    ],
    answer: 1,
    explain: "Value iteration combines one sweep of policy evaluation with policy improvement by using the Bellman OPTIMALITY update v(s) ← max_a Σ p(s',r|s,a)[r+γv(s')]. It avoids waiting for evaluation to fully converge each round.",
  },
  {
    q: "What is 'bootstrapping' in the context of DP?",
    options: [
      "Sampling complete returns to the end of the episode",
      "Updating value estimates on the basis of other estimated values (successor state values)",
      "Randomly initializing the policy",
      "Using a physical robot",
    ],
    answer: 1,
    explain: "Bootstrapping means updating an estimate using other estimates — DP updates v(s) using the estimated values v(s') of successor states, rather than waiting for actual returns. TD methods also bootstrap; Monte Carlo does not.",
  },
  {
    q: "Asynchronous DP algorithms...",
    options: [
      "Must sweep the entire state set in a fixed order each iteration",
      "Update states in any order, using whatever values are available, and can still converge if all states are updated infinitely often",
      "Cannot converge to v*",
      "Require two copies of the value array",
    ],
    answer: 1,
    explain: "Asynchronous DP updates states in an arbitrary order, in place, using whatever values happen to be available. It can converge as long as it continues to update all states. This flexibility allows focusing computation where it helps most.",
  },
  {
    q: "Generalized Policy Iteration (GPI) refers to...",
    options: [
      "A specific algorithm with full evaluation then full improvement",
      "The general idea of letting evaluation and improvement processes interact, regardless of granularity",
      "Policy gradient methods only",
      "Evaluation without any improvement",
    ],
    answer: 1,
    explain: "GPI is the general idea of two interacting processes — one making the value function consistent with the policy (evaluation), the other making the policy greedy w.r.t. the value function (improvement). Almost all RL methods are instances of GPI.",
  },
];

// ── Chapter 05 — Monte Carlo Methods ─────────────────────────────────────────
QUESTIONS["05"] = [
  {
    q: "Monte Carlo methods learn value functions from...",
    options: [
      "A complete model of the environment",
      "Complete episodes of experience, averaging the actual returns observed",
      "One-step bootstrapped estimates",
      "The Bellman optimality equation solved exactly",
    ],
    answer: 1,
    explain: "Monte Carlo methods require only experience — sample sequences of states, actions, and rewards. They estimate value as the average of the actual returns following visits to a state, and require episodes to terminate (returns must be defined).",
  },
  {
    q: "What is the difference between first-visit and every-visit Monte Carlo prediction?",
    options: [
      "First-visit averages returns only after the first time a state is visited in each episode; every-visit averages returns after every visit",
      "First-visit bootstraps; every-visit does not",
      "They require different models",
      "Every-visit only works for deterministic policies",
    ],
    answer: 0,
    explain: "First-visit MC averages the returns following the first visit to s in each episode; every-visit MC averages returns following all visits. Both converge to v_π as visits grow, with slightly different theoretical properties.",
  },
  {
    q: "Why does Monte Carlo control need to estimate ACTION values q(s,a) rather than just state values?",
    options: [
      "Because state values are impossible to compute",
      "Without a model, state values alone don't tell you which action to take; you need q to act greedily",
      "Because rewards are unavailable",
      "To reduce memory usage",
    ],
    answer: 1,
    explain: "With no model of the dynamics, state values are insufficient for choosing actions (you'd need to know the transitions). Estimating q(s,a) lets you pick the greedy action directly as argmax_a q(s,a).",
  },
  {
    q: "The 'exploring starts' assumption ensures...",
    options: [
      "Every episode ends in the same state",
      "Every state–action pair has nonzero probability of being the start, so all pairs are eventually visited",
      "The policy is deterministic",
      "The discount factor is 1",
    ],
    answer: 1,
    explain: "Exploring starts guarantees every state–action pair can begin an episode, so all pairs are visited infinitely often — necessary for MC control to estimate q for all actions. It is often impractical, motivating ε-soft policies instead.",
  },
  {
    q: "An ε-soft policy is one in which...",
    options: [
      "Every action has probability at least ε/|A(s)| in every state",
      "The greedy action always has probability 1",
      "Exploration is impossible",
      "Only the best action is ever taken",
    ],
    answer: 0,
    explain: "ε-soft policies assign at least ε/|A(s)| probability to every action, guaranteeing continual exploration without exploring starts. ε-greedy is the ε-soft policy closest to greedy. MC control can find the best ε-soft policy.",
  },
  {
    q: "In off-policy learning, the behavior policy and target policy are...",
    options: [
      "Always identical",
      "Different: the agent behaves with b (exploratory) while learning about a different target policy π",
      "Both required to be greedy",
      "Both required to be random",
    ],
    answer: 1,
    explain: "Off-policy methods learn about a target policy π while following a different behavior policy b. This separates exploration (b) from the policy being learned (π), but requires correcting for the mismatch — usually via importance sampling.",
  },
  {
    q: "Importance sampling in off-policy MC corrects returns by...",
    options: [
      "Discarding all episodes from the behavior policy",
      "Weighting returns by the ratio of the probabilities of the trajectory under π versus b (the importance-sampling ratio)",
      "Adding a constant baseline",
      "Bootstrapping from successor states",
    ],
    answer: 1,
    explain: "The importance-sampling ratio ρ = Π π(A_k|S_k)/b(A_k|S_k) reweights returns generated under b so their expectation equals the value under π. Ordinary IS is unbiased but high-variance; weighted IS is biased but far lower variance.",
  },
  {
    q: "Compared with weighted importance sampling, ordinary importance sampling has...",
    options: [
      "Lower variance and is biased",
      "Higher (sometimes infinite) variance but is unbiased",
      "Identical behavior in all cases",
      "No dependence on the ratio ρ",
    ],
    answer: 1,
    explain: "Ordinary IS is unbiased but can have very large or even infinite variance. Weighted IS is biased (bias → 0 as samples grow) but has dramatically lower, bounded variance, so it is usually strongly preferred in practice.",
  },
];

// ── Chapter 06 — Temporal-Difference Learning ───────────────────────────────
QUESTIONS["06"] = [
  {
    q: "The TD(0) update for prediction is V(S_t) ← V(S_t) + α[ ___ − V(S_t)]. What is the target?",
    options: [
      "The full return G_t",
      "R_{t+1} + γV(S_{t+1}) — the TD target",
      "R_{t+1} only",
      "max_a Q(S_t,a)",
    ],
    answer: 1,
    explain: "TD(0) uses the bootstrapped target R_{t+1} + γV(S_{t+1}). The quantity δ_t = R_{t+1} + γV(S_{t+1}) − V(S_t) is the TD error. Unlike MC, TD updates every step without waiting for the episode to end.",
  },
  {
    q: "What advantage does TD learning have over Monte Carlo methods?",
    options: [
      "It requires a complete model of the environment",
      "It can learn online after every step, without waiting for the episode to end, and works in continuing tasks",
      "It has zero variance",
      "It never bootstraps",
    ],
    answer: 1,
    explain: "TD methods update from each transition immediately (online, incremental) and work in continuing (non-episodic) tasks, whereas MC must wait for a complete return. TD combines sampling (like MC) with bootstrapping (like DP).",
  },
  {
    q: "Sarsa is an ON-policy TD control method. Its update uses the tuple...",
    options: [
      "(S, A, R, S', max_a Q(S',a))",
      "(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1}) — the action actually taken next",
      "Only (S, A, R)",
      "The full Monte Carlo return",
    ],
    answer: 1,
    explain: "Sarsa updates Q(S_t,A_t) toward R_{t+1} + γQ(S_{t+1},A_{t+1}), using the next action A_{t+1} actually selected by the current policy. Because it evaluates the policy it follows (including exploration), it is on-policy.",
  },
  {
    q: "Q-learning's update target is R_{t+1} + γ·max_a Q(S_{t+1}, a). This makes it...",
    options: [
      "An on-policy method",
      "An off-policy method that directly approximates q* regardless of the behavior policy",
      "A Monte Carlo method",
      "A model-based method",
    ],
    answer: 1,
    explain: "Q-learning uses the max over next actions, learning about the greedy target policy while behaving with an exploratory policy — so it is off-policy. It directly approximates q* independent of the policy being followed.",
  },
  {
    q: "On the cliff-walking task, why does Sarsa learn a safer (longer) path than Q-learning?",
    options: [
      "Sarsa uses a model and Q-learning does not",
      "Sarsa is on-policy, so it accounts for the exploratory ε-greedy actions that occasionally step off the cliff, and avoids the edge",
      "Q-learning cannot represent the cliff",
      "Sarsa ignores rewards",
    ],
    answer: 1,
    explain: "Because Sarsa evaluates the actual ε-greedy behavior, it 'knows' random exploratory moves near the cliff are costly and learns a safer route. Q-learning learns the optimal (edge-hugging) greedy path but earns lower online reward due to exploratory falls.",
  },
  {
    q: "Expected Sarsa replaces the sampled next action value with...",
    options: [
      "The maximum next-action value",
      "The expected value over next actions under the policy: Σ_a π(a|S_{t+1}) Q(S_{t+1},a)",
      "A random next-action value",
      "Zero",
    ],
    answer: 1,
    explain: "Expected Sarsa uses the expectation E[Q(S_{t+1},A_{t+1})] = Σ_a π(a|S_{t+1})Q(S_{t+1},a). This eliminates the variance from randomly sampling A_{t+1}, generally improving on Sarsa at the cost of more computation.",
  },
  {
    q: "What is maximization bias, seen in Q-learning?",
    options: [
      "A bias from using too small a learning rate",
      "A positive bias in value estimates caused by using a maximum over noisy estimated values as an estimate of the maximum true value",
      "Bias introduced by the discount factor",
      "The tendency to underestimate all actions",
    ],
    answer: 1,
    explain: "Using max over estimated action values to estimate the value of the best action causes a systematic positive (maximization) bias, because the max of noisy estimates overestimates the true max. Double learning corrects this.",
  },
  {
    q: "How does Double Q-learning reduce maximization bias?",
    options: [
      "By using a smaller discount factor",
      "By learning two independent value estimates and using one to select the maximizing action and the other to evaluate it",
      "By averaging rewards over two episodes",
      "By doubling the learning rate",
    ],
    answer: 1,
    explain: "Double Q-learning maintains Q1 and Q2. One is used to pick the greedy action, argmax_a Q1(a), and the OTHER to evaluate it, Q2(argmax). Decoupling selection from evaluation removes the systematic overestimation of the single-estimator max.",
  },
];

// ── Chapter 07 — n-step Bootstrapping ────────────────────────────────────────
QUESTIONS["07"] = [
  {
    q: "n-step TD methods unify one-step TD and Monte Carlo by...",
    options: [
      "Using a model of the environment",
      "Bootstrapping after n steps of real rewards, so n=1 is TD(0) and n=∞ is Monte Carlo",
      "Only ever looking one step ahead",
      "Discarding all intermediate rewards",
    ],
    answer: 1,
    explain: "The n-step return uses n real rewards then bootstraps off the estimated value n steps later: G_{t:t+n} = R_{t+1}+…+γ^{n-1}R_{t+n} + γ^n V(S_{t+n}). n=1 recovers TD(0); n→∞ (to episode end) recovers Monte Carlo.",
  },
  {
    q: "In practice, the best performance on many tasks is often achieved with...",
    options: [
      "n = 1 always",
      "An intermediate value of n (neither pure one-step TD nor pure Monte Carlo)",
      "n = ∞ always",
      "n chosen equal to the number of states",
    ],
    answer: 1,
    explain: "Empirically, an intermediate n usually works best — it balances the bias of heavy bootstrapping (small n) against the variance of long sampled returns (large n). This motivates eligibility traces, which average over n smoothly.",
  },
  {
    q: "n-step Sarsa updates an action value toward...",
    options: [
      "A one-step target only",
      "The n-step return G_{t:t+n} that ends by bootstrapping off Q(S_{t+n}, A_{t+n})",
      "The maximum over all actions at every step",
      "The Monte Carlo return exclusively",
    ],
    answer: 1,
    explain: "n-step Sarsa forms the n-step return ending in γ^n Q(S_{t+n},A_{t+n}) and updates Q(S_t,A_t) toward it. It speeds credit assignment: a single high reward can update the values of the n preceding state–action pairs.",
  },
  {
    q: "A drawback of n-step methods relative to one-step TD is that...",
    options: [
      "They cannot bootstrap",
      "They require a delay of n steps and storage of the last n states/actions/rewards before updating",
      "They require a full model",
      "They only work for prediction, never control",
    ],
    answer: 1,
    explain: "n-step updates cannot be made until n steps have elapsed, so they involve a delay and require remembering the last n states, actions, and rewards. Eligibility traces achieve a similar effect with a mechanistic, incremental implementation.",
  },
  {
    q: "The n-step tree-backup algorithm is notable because it...",
    options: [
      "Requires importance sampling for off-policy learning",
      "Performs off-policy learning WITHOUT importance sampling by backing up expected values over untaken actions",
      "Only works on-policy",
      "Ignores the actions not taken",
    ],
    answer: 1,
    explain: "Tree backup does off-policy learning without importance sampling: at each level it backs up the expected values of the actions NOT taken (weighted by the target policy) plus the sampled taken action, forming a tree of one-step expectations.",
  },
  {
    q: "Off-policy n-step Sarsa uses importance-sampling ratios to...",
    options: [
      "Increase the learning rate",
      "Correct the n-step return for the difference between the behavior policy and the target policy over the n steps",
      "Select the greedy action",
      "Remove the discount factor",
    ],
    answer: 1,
    explain: "Off-policy n-step methods multiply the update (or the return) by the product of per-step importance ratios π(A_k|S_k)/b(A_k|S_k) over the relevant steps, correcting for having generated the data under b rather than π. This raises variance.",
  },
];

// ── Chapter 08 — Planning and Learning with Tabular Methods ──────────────────
QUESTIONS["08"] = [
  {
    q: "In this chapter, what is a 'model' of the environment?",
    options: [
      "A neural network policy",
      "Anything the agent uses to predict how the environment will respond to actions (next states and rewards)",
      "The value function",
      "The reward signal itself",
    ],
    answer: 1,
    explain: "A model is anything an agent can use to predict how the environment will respond to its actions — i.e., produce predicted next states and rewards. Planning is any process that uses a model to produce or improve a policy.",
  },
  {
    q: "What is the difference between a distribution model and a sample model?",
    options: [
      "A distribution model produces all possible next states and their probabilities; a sample model produces one sampled next state/reward",
      "They are the same",
      "A sample model requires the full dynamics; a distribution model does not",
      "Only sample models can be learned",
    ],
    answer: 0,
    explain: "A distribution model gives the probabilities of all possible outcomes (like the DP p(s',r|s,a)); a sample model produces just one outcome sampled according to those probabilities. Sample models are often much easier to obtain.",
  },
  {
    q: "The Dyna-Q architecture integrates...",
    options: [
      "Only direct RL from real experience",
      "Direct RL from real experience AND planning (model-based updates) from simulated experience, plus model learning",
      "Only planning from a given model",
      "Supervised learning of the policy",
    ],
    answer: 1,
    explain: "Dyna-Q interleaves acting, model learning, direct RL (Q-learning on real transitions), and planning (running the same Q-learning update on transitions sampled from the learned model). Planning steps let each real experience be reused many times.",
  },
  {
    q: "In Dyna-Q, increasing the number of planning steps per real step generally...",
    options: [
      "Slows learning in terms of real environment interactions",
      "Speeds learning per real step, because more computation is spent propagating values from the model",
      "Has no effect",
      "Requires more real experience",
    ],
    answer: 1,
    explain: "More planning steps propagate value information further per real interaction, so the agent reaches a good policy in fewer real steps (trading computation for data). With enough planning, Dyna-Q can solve a maze in far fewer episodes.",
  },
  {
    q: "Dyna-Q+ encourages exploration of long-untried state–action pairs by...",
    options: [
      "Adding a bonus reward proportional to sqrt(time since the pair was last tried) during planning",
      "Removing the model",
      "Increasing the discount factor",
      "Using importance sampling",
    ],
    answer: 0,
    explain: "Dyna-Q+ adds an exploration bonus κ·sqrt(τ) (τ = time steps since the pair was last tried) to modeled rewards. This makes the agent periodically revisit stale transitions, helping it detect a changing environment (e.g., a shortcut that opens up).",
  },
  {
    q: "Prioritized sweeping improves planning efficiency by...",
    options: [
      "Updating states in random order",
      "Prioritizing updates to states whose values would change the most (largest TD error), working backward from them",
      "Only updating the current state",
      "Ignoring the model",
    ],
    answer: 1,
    explain: "Prioritized sweeping keeps a queue of state–action pairs prioritized by the magnitude of their expected value change. It updates high-priority pairs first and propagates changes backward to predecessors, focusing computation where it matters most.",
  },
  {
    q: "Monte Carlo Tree Search (MCTS) is an example of...",
    options: [
      "Background planning that updates a global value table",
      "Decision-time planning: focused simulation from the current state to select the next action",
      "A model-free TD method",
      "Dynamic programming with a full model sweep",
    ],
    answer: 1,
    explain: "MCTS is decision-time planning — it runs many simulated trajectories from the current state (selection, expansion, rollout, backup) to decide the immediate action, then discards most of the tree. It powered strong game-playing agents like AlphaGo.",
  },
];
