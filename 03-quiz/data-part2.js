// ============================================================================
//  data-part2.js — Chapters 09–13 (Approximate Solution Methods)
// ============================================================================

// ── Chapter 09 — On-policy Prediction with Approximation ────────────────────
QUESTIONS["09"] = [
  {
    q: "Why is function approximation needed in large-scale reinforcement learning?",
    options: [
      "To make the math simpler",
      "The state space is too large to store a separate value for every state; we must generalize from limited experience",
      "Because tabular methods cannot bootstrap",
      "To avoid using rewards",
    ],
    answer: 1,
    explain: "In problems with enormous or continuous state spaces, a table entry per state is infeasible and most states are never visited. Function approximation represents the value function with a parameter vector w and generalizes across similar states.",
  },
  {
    q: "The prediction objective for on-policy value approximation is the Mean Squared Value Error, weighted by...",
    options: [
      "A uniform weighting over all states",
      "The on-policy state distribution μ(s) (how often each state is visited under π)",
      "The reward magnitude",
      "The number of actions",
    ],
    answer: 1,
    explain: "VE(w) = Σ_s μ(s)[v_π(s) − v̂(s,w)]², where μ is the on-policy distribution. States are weighted by how often they occur under the policy, so the approximator focuses accuracy where the agent actually spends time.",
  },
  {
    q: "A 'semi-gradient' method is so called because...",
    options: [
      "It uses only half the learning rate",
      "It takes the gradient of the value estimate but treats the bootstrapped target as fixed, ignoring its dependence on w",
      "It approximates the gradient with finite differences",
      "It only updates half the weights",
    ],
    answer: 1,
    explain: "Semi-gradient TD updates w toward a bootstrapped target (e.g., R + γv̂(S',w)) but does NOT differentiate that target with respect to w — so it is not a true gradient of any objective. It typically learns faster and enables online/continual learning.",
  },
  {
    q: "For LINEAR function approximation, the value estimate is...",
    options: [
      "A lookup table",
      "An inner product w·x(s) of a weight vector with a feature vector x(s)",
      "A deep neural network",
      "The maximum feature value",
    ],
    answer: 1,
    explain: "Linear methods represent v̂(s,w) = wᵀx(s), a weighted sum of features. The gradient is simply x(s), making updates cheap and analysis tractable. Much of the strongest RL theory applies to the linear case.",
  },
  {
    q: "Under linear semi-gradient TD(0), the weights converge (in the on-policy case) to...",
    options: [
      "The global minimum of the value error",
      "The TD fixed point, whose error is bounded by 1/(1−γ) times the minimum possible error",
      "Zero",
      "A random point",
    ],
    answer: 1,
    explain: "Linear semi-gradient TD(0) converges to the TD fixed point w_TD. Its value error is at most 1/(1−γ) times the smallest achievable error (the best linear approximation). Bootstrapping thus trades some asymptotic accuracy for efficiency.",
  },
  {
    q: "Tile coding is a feature-construction technique that...",
    options: [
      "Uses a single tiling of the state space",
      "Overlays multiple offset tilings (grids) so that a state activates one tile per tiling, giving coarse coding with controllable resolution",
      "Requires a neural network",
      "Only works in one dimension",
    ],
    answer: 1,
    explain: "Tile coding partitions the state space with several overlapping tilings, each offset. A state activates exactly one tile per tiling; the union of active tiles forms a binary feature vector. It gives efficient, tunable generalization and is fast to compute.",
  },
  {
    q: "Compared with narrow features, using broader (more overlapping) receptive fields in coarse coding produces...",
    options: [
      "Finer discrimination but slower initial generalization",
      "Broader generalization (faster early learning) but limits the finest achievable resolution",
      "No effect on generalization",
      "Exact tabular behavior",
    ],
    answer: 1,
    explain: "The size/shape of features controls generalization. Broad features generalize widely, speeding early learning but coarsening the final resolution; narrow features allow fine detail but generalize less. Number of features governs ultimate resolution.",
  },
  {
    q: "Which statement about state aggregation is correct?",
    options: [
      "It is a nonlinear method",
      "It is a special case of linear function approximation where states are grouped, sharing one value per group",
      "It requires the true model",
      "It cannot be used for prediction",
    ],
    answer: 1,
    explain: "State aggregation partitions states into groups and gives each group a single estimated value — a simple special case of linear approximation with one-hot group features. It is a useful, interpretable baseline (e.g., the 1000-state random walk).",
  },
];

// ── Chapter 10 — On-policy Control with Approximation ────────────────────────
QUESTIONS["10"] = [
  {
    q: "Episodic semi-gradient Sarsa extends prediction to control by...",
    options: [
      "Approximating state values v̂ only",
      "Approximating action values q̂(s,a,w) and acting ε-greedily with respect to them",
      "Requiring a full model",
      "Using Monte Carlo returns exclusively",
    ],
    answer: 1,
    explain: "For control we approximate q̂(s,a,w) and update it with a semi-gradient Sarsa rule toward R + γq̂(S',A',w), choosing actions ε-greedily (or via another soft policy) w.r.t. the current estimates — GPI with function approximation.",
  },
  {
    q: "On the Mountain Car task, why can't the car simply accelerate straight toward the goal?",
    options: [
      "The engine is off",
      "Gravity is stronger than the engine, so the agent must first build energy by reversing up the opposite slope",
      "The goal is unreachable",
      "There is no reward",
    ],
    answer: 1,
    explain: "Mountain Car is a classic continuous-state control problem where the car's engine is too weak to climb directly; the agent must learn to move away from the goal first to build momentum. Tile-coded semi-gradient Sarsa solves it well.",
  },
  {
    q: "In continuing (non-episodic) tasks with function approximation, the book replaces discounting with...",
    options: [
      "A larger discount factor",
      "The average-reward setting, where the agent maximizes the average reward per time step",
      "Monte Carlo returns",
      "Undiscounted episodic returns",
    ],
    answer: 1,
    explain: "For continuing problems the book argues discounting is problematic with function approximation and introduces the average-reward setting: maximize r(π), the long-run average reward per step. Values are then defined relative to this average.",
  },
  {
    q: "In the average-reward setting, the 'differential' return is defined using...",
    options: [
      "Rewards discounted by γ",
      "Rewards minus the average reward r(π): G_t = (R_{t+1} − r(π)) + (R_{t+2} − r(π)) + …",
      "Only the first reward",
      "The squared rewards",
    ],
    answer: 1,
    explain: "Differential returns subtract the average reward r(π) from each reward, giving G_t = Σ (R_{t+k+1} − r(π)). Differential value functions and a differential form of the Bellman equations (with no γ) then apply.",
  },
  {
    q: "The differential semi-gradient Sarsa update uses a TD error of the form...",
    options: [
      "R − V(S)",
      "δ = R − R̄ + q̂(S',A',w) − q̂(S,A,w), where R̄ is an estimate of the average reward",
      "R + γ max_a q̂(S',a,w) − q̂(S,A,w)",
      "R only",
    ],
    answer: 1,
    explain: "In the average-reward formulation the TD error is δ = R − R̄ + q̂(S',A',w) − q̂(S,A,w) (no discount factor); R̄ is updated toward the observed reward. This drives control in continuing tasks without discounting.",
  },
  {
    q: "Why is the choice of discounting said to be problematic for CONTINUING tasks with function approximation?",
    options: [
      "Discounting makes the return infinite",
      "With function approximation the policy-ranking guarantee of discounted value can be lost, and the average of discounted returns is proportional to the average reward anyway",
      "Discounting cannot be computed",
      "It only affects episodic tasks",
    ],
    answer: 1,
    explain: "The book shows that with function approximation, the ordering of policies by discounted value need not be preserved, and the discounted objective essentially reduces to the average-reward objective. Hence the average-reward setting is preferred for continuing control.",
  },
];

// ── Chapter 11 — Off-policy Methods with Approximation ───────────────────────
QUESTIONS["11"] = [
  {
    q: "The 'deadly triad' of divergence risk in RL is the combination of...",
    options: [
      "Exploration, exploitation, and discounting",
      "Function approximation, bootstrapping, and off-policy training",
      "Rewards, states, and actions",
      "Monte Carlo, TD, and DP",
    ],
    answer: 1,
    explain: "Instability and divergence can arise when three elements are combined: function approximation, bootstrapping (as in TD/DP), and off-policy training. Any two together are generally safe; all three can cause the parameters to blow up.",
  },
  {
    q: "In Baird's counterexample, semi-gradient off-policy TD with linear approximation...",
    options: [
      "Converges quickly to the true values",
      "Can cause the weights to diverge to infinity, illustrating the deadly triad",
      "Requires no function approximation",
      "Is a control (not prediction) problem",
    ],
    answer: 1,
    explain: "Baird's counterexample is a small MDP where off-policy semi-gradient TD(0) with linear features makes the weights diverge, even though a good solution exists. It is the canonical demonstration that the deadly triad can destabilize learning.",
  },
  {
    q: "Why can off-policy learning combined with bootstrapping be unstable, whereas off-policy Monte Carlo is not?",
    options: [
      "Monte Carlo uses a model",
      "Bootstrapping updates toward estimates under a distribution that no longer matches the target policy's, so errors can compound; MC uses full returns and avoids this",
      "Monte Carlo never uses importance sampling",
      "Bootstrapping is always unbiased",
    ],
    answer: 1,
    explain: "Off-policy training means the update distribution (from b) differs from the target policy's distribution. Bootstrapping updates toward possibly-wrong estimates weighted by that mismatched distribution, which can amplify error. MC's full-return targets sidestep this bootstrapping instability.",
  },
  {
    q: "Gradient-TD methods (e.g., GTD2, TDC) achieve stability by...",
    options: [
      "Removing bootstrapping entirely",
      "Performing true stochastic gradient descent on an objective (the projected Bellman error), guaranteeing convergence with function approximation off-policy",
      "Using a tabular representation",
      "Ignoring the target policy",
    ],
    answer: 1,
    explain: "Gradient-TD methods minimize the Mean Squared Projected Bellman Error (PBE) by genuine SGD, so they are guaranteed to converge even under the deadly triad. The cost is a second set of weights and roughly double the computation.",
  },
  {
    q: "The Bellman error (BE) versus the projected Bellman error (PBE): a key result in this chapter is that...",
    options: [
      "They are always equal",
      "The Bellman error is not learnable from data in general, whereas the PBE (projected into the representable space) can be minimized",
      "Neither can be minimized",
      "The PBE requires a full model",
    ],
    answer: 1,
    explain: "The chapter shows the Bellman error is generally not learnable (different MDPs producing identical data can have different BE), motivating the projected Bellman error as the practical objective — the target Bellman update projected back onto the space of representable value functions.",
  },
  {
    q: "Emphatic-TD methods restore stability under the deadly triad by...",
    options: [
      "Using a smaller step size",
      "Reweighting updates with an 'emphasis' that restores a distribution under which semi-gradient bootstrapping is stable",
      "Switching to Monte Carlo",
      "Removing the target policy",
    ],
    answer: 1,
    explain: "Emphatic-TD scales each update by a state-dependent emphasis (accumulated from interest and prior emphasis), effectively reweighting the state distribution so that off-policy linear semi-gradient TD becomes convergent — a different remedy than gradient-TD.",
  },
];

// ── Chapter 12 — Eligibility Traces ──────────────────────────────────────────
QUESTIONS["12"] = [
  {
    q: "The λ-return G_t^λ is a weighted average of...",
    options: [
      "Only the Monte Carlo return",
      "All n-step returns, each weighted by (1−λ)λ^{n−1}",
      "Only the one-step return",
      "The rewards, ignoring bootstrapping",
    ],
    answer: 1,
    explain: "G_t^λ = (1−λ) Σ_{n=1}^∞ λ^{n−1} G_{t:t+n} geometrically weights every n-step return by (1−λ)λ^{n−1}. λ=0 gives the one-step TD return; λ=1 gives the Monte Carlo return. It smoothly interpolates between them.",
  },
  {
    q: "An eligibility trace is a short-term memory vector that...",
    options: [
      "Stores the full history of states visited",
      "Accumulates the gradient of recently visited states and decays by γλ, marking them as eligible for updates",
      "Replaces the value function",
      "Holds the reward for each state",
    ],
    answer: 1,
    explain: "The eligibility trace z_t accumulates the (discounted, λ-decayed) gradients of recently visited states: z_t = γλ z_{t−1} + ∇v̂(S_t,w). When a TD error occurs, all recently eligible states are updated in proportion to their trace — a backward, incremental view.",
  },
  {
    q: "TD(λ) with a trace approximates the λ-return method but with the advantage of being...",
    options: [
      "Offline and requiring the whole episode",
      "Online and incremental — updates happen every step using a running trace, with memory independent of episode length",
      "Model-based",
      "Exact for all λ",
    ],
    answer: 1,
    explain: "The forward view (λ-return) is conceptual but non-causal (needs future rewards). TD(λ) uses the backward view with an eligibility trace to achieve nearly the same updates online and incrementally, with computation/memory independent of how long the episode is.",
  },
  {
    q: "Setting λ = 0 in TD(λ) recovers ___, and λ = 1 approximately recovers ___.",
    options: [
      "Monte Carlo; one-step TD",
      "One-step TD(0); Monte Carlo (every-visit)",
      "Dynamic programming; Sarsa",
      "Q-learning; policy iteration",
    ],
    answer: 1,
    explain: "λ=0 makes the trace decay instantly, so only the current state is updated → TD(0). λ=1 makes traces decay only by γ, so credit propagates all the way back like Monte Carlo (the 'TD(1)' equivalence to every-visit MC).",
  },
  {
    q: "True Online TD(λ) is notable because it...",
    options: [
      "Is slower and less accurate than ordinary TD(λ)",
      "Exactly reproduces the online λ-return (forward-view) updates step by step, using a 'dutch' trace",
      "Requires a model",
      "Only works offline",
    ],
    answer: 1,
    explain: "True Online TD(λ) uses a dutch trace and a corrected update to reproduce the ideal online λ-return algorithm exactly at each step. It matches the forward view precisely and often outperforms conventional TD(λ), especially for larger step sizes.",
  },
  {
    q: "Sarsa(λ) applies eligibility traces to...",
    options: [
      "State values for prediction only",
      "Action values for control, so a reward updates the whole recent trajectory of state–action pairs",
      "The model of the environment",
      "The reward signal directly",
    ],
    answer: 1,
    explain: "Sarsa(λ) keeps traces over state–action features and combines them with the Sarsa TD error, so credit is assigned to all recently visited (s,a) pairs at once. This dramatically speeds up control by propagating a reward back along the trajectory.",
  },
];

// ── Chapter 13 — Policy Gradient Methods ─────────────────────────────────────
QUESTIONS["13"] = [
  {
    q: "Policy gradient methods differ from value-based methods in that they...",
    options: [
      "Learn a value function and act greedily",
      "Learn a parameterized policy π(a|s,θ) directly and optimize θ by gradient ascent on performance",
      "Require a model of the environment",
      "Cannot handle stochastic policies",
    ],
    answer: 1,
    explain: "Policy gradient methods parameterize the policy itself, π(a|s,θ), and update θ to ascend a performance measure J(θ) via its gradient. Action selection does not consult a value function (though a critic may still be learned to help).",
  },
  {
    q: "One key advantage of policy parameterization over ε-greedy action-value methods is that...",
    options: [
      "It always converges faster",
      "The policy can approach a deterministic optimum smoothly and can represent arbitrary stochastic (probabilistic) optimal policies",
      "It never needs exploration",
      "It requires fewer parameters",
    ],
    answer: 1,
    explain: "A parameterized policy can shift action probabilities smoothly, approaching determinism gradually (better convergence), and can represent optimal stochastic policies (e.g., in games or partially observable tasks) that ε-greedy over action values cannot.",
  },
  {
    q: "The policy gradient theorem is important because it gives the gradient of performance...",
    options: [
      "Requiring the derivative of the state distribution with respect to θ",
      "WITHOUT needing the derivative of the state distribution, in terms of ∇π and q_π",
      "Only for deterministic policies",
      "Only when a model is available",
    ],
    answer: 1,
    explain: "The policy gradient theorem expresses ∇J(θ) ∝ Σ_s μ(s) Σ_a q_π(s,a) ∇π(a|s,θ), with NO term for the gradient of the state distribution μ (which depends on θ and the unknown environment). This is what makes stochastic-gradient estimation feasible.",
  },
  {
    q: "REINFORCE is a Monte Carlo policy gradient method whose update is proportional to...",
    options: [
      "The TD error times the value gradient",
      "The return G_t times the gradient of the log-policy, ∇ln π(A_t|S_t,θ)",
      "The maximum action value",
      "The reward only",
    ],
    answer: 1,
    explain: "REINFORCE updates θ ← θ + α G_t ∇ln π(A_t|S_t,θ). Using the sampled return G_t as an unbiased estimate of q_π and the 'eligibility' ∇ln π, it performs stochastic gradient ascent on J. It is unbiased but high-variance.",
  },
  {
    q: "Adding a baseline b(s) (e.g., a learned state value) to REINFORCE...",
    options: [
      "Introduces bias into the gradient estimate",
      "Leaves the expected update unbiased while reducing its variance",
      "Changes which policy is optimal",
      "Requires a model",
    ],
    answer: 1,
    explain: "Subtracting a state-dependent baseline, α(G_t − b(S_t))∇ln π, does not change the expected gradient (since Σ_a ∇π = 0) but can greatly reduce variance. A natural choice is b(s) = v̂(s,w), the estimated state value.",
  },
  {
    q: "What distinguishes an actor–critic method from REINFORCE with a baseline?",
    options: [
      "The critic is used only as a baseline, not for bootstrapping",
      "The critic bootstraps — it provides a TD-based estimate used in the target, introducing bias but reducing variance and enabling online updates",
      "Actor–critic uses no value function",
      "Actor–critic requires the full return",
    ],
    answer: 1,
    explain: "In REINFORCE-with-baseline the state-value is only a baseline (no bootstrapping). In actor–critic the critic bootstraps: the actor is updated using the TD error δ = R + γv̂(S') − v̂(S). Bootstrapping adds bias but reduces variance and allows fully online, continual learning.",
  },
  {
    q: "For CONTINUOUS action spaces, a common policy parameterization is to...",
    options: [
      "Use a softmax over infinitely many actions",
      "Output the mean and standard deviation of a Gaussian distribution over actions as functions of the state",
      "Enumerate all actions",
      "Use ε-greedy selection",
    ],
    answer: 1,
    explain: "For continuous actions the policy can be a Gaussian whose mean μ(s,θ) and standard deviation σ(s,θ) are parameterized functions of the state. Actions are sampled from N(μ,σ²); learning σ lets the agent control its own exploration.",
  },
];
