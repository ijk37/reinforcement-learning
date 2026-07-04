"""
Project 3 — Blackjack with Monte Carlo
======================================
Monte Carlo prediction and control on Blackjack (Chapter 5, Examples 5.1 & 5.3).
Blackjack is the perfect MC showcase: simulating games is trivial, but writing
the transition probabilities would be a nightmare. MC just averages returns.

State  = (player_sum 12..21, dealer_showing 1..10, usable_ace bool)
Actions= 0 (stick), 1 (hit)
Reward = +1 win / 0 draw / -1 loss, only at the end of the episode.

Run:
    python blackjack_mc.py                  # MC control via exploring starts
    python blackjack_mc.py --episodes 500000
Dependencies: numpy.
"""
import argparse
import sys
import numpy as np
from collections import defaultdict

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

rng = np.random.default_rng(0)


def draw_card():
    c = rng.integers(1, 14)         # 1..13
    return min(c, 10)               # face cards = 10


def draw_hand():
    return [draw_card(), draw_card()]


def hand_value(hand):
    """Return (total, usable_ace). An ace counts as 11 if it fits."""
    total = sum(hand)
    usable = 1 in hand and total + 10 <= 21
    return (total + 10, True) if usable else (total, False)


def play_episode(policy):
    """policy(state) -> action. Returns list of (state, action) and final reward."""
    player = draw_hand()
    dealer = draw_hand()
    dealer_showing = dealer[0]

    # player may already have a natural; keep it simple and let policy act from 12+
    trajectory = []
    # ensure player total is at least 12 (hit on anything lower automatically)
    while True:
        total, usable = hand_value(player)
        if total < 12:
            player.append(draw_card())
            continue
        if total > 21:
            return trajectory, -1.0     # bust before acting
        break

    # player's turn
    while True:
        total, usable = hand_value(player)
        state = (total, dealer_showing, int(usable))
        if total > 21:
            return trajectory, -1.0
        a = policy(state)
        trajectory.append((state, a))
        if a == 0:        # stick
            break
        player.append(draw_card())
        if hand_value(player)[0] > 21:
            return trajectory, -1.0

    # dealer's turn: hit until 17+
    while hand_value(dealer)[0] < 17:
        dealer.append(draw_card())

    p_total = hand_value(player)[0]
    d_total = hand_value(dealer)[0]
    if d_total > 21 or p_total > d_total:
        reward = 1.0
    elif p_total < d_total:
        reward = -1.0
    else:
        reward = 0.0
    return trajectory, reward


def mc_control_es(episodes):
    """Monte Carlo control with Exploring Starts -> optimal policy."""
    Q = defaultdict(lambda: np.zeros(2))
    counts = defaultdict(lambda: np.zeros(2))
    # policy is greedy w.r.t. Q, but exploring starts force a random first action
    pi = {}

    def greedy(state):
        return pi.get(state, 0)

    for ep in range(episodes):
        # exploring start: random initial action for the first state visited
        forced_first = rng.integers(2)
        first = [True]

        def policy(state):
            if first[0]:
                first[0] = False
                return forced_first
            return greedy(state)

        traj, reward = play_episode(policy)
        # first-visit-style: blackjack states don't repeat within an episode
        for (state, a) in traj:
            counts[state][a] += 1
            Q[state][a] += (reward - Q[state][a]) / counts[state][a]
            pi[state] = int(np.argmax(Q[state]))
    return Q, pi


def evaluate_policy(pi, n=100000):
    """Win/draw/loss rates of a greedy policy."""
    def policy(state):
        return pi.get(state, 0)
    wins = draws = losses = 0
    for _ in range(n):
        _, r = play_episode(policy)
        wins += r > 0; draws += r == 0; losses += r < 0
    return wins / n, draws / n, losses / n


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--episodes", type=int, default=200000)
    args = p.parse_args()

    print(f"Monte Carlo control (exploring starts), {args.episodes} episodes...")
    Q, pi = mc_control_es(args.episodes)

    # Show the learned policy for the no-usable-ace case as a hit/stick grid
    print("\nLearned policy (no usable ace).  H=hit  S=stick")
    print("rows = player sum 21..12, cols = dealer showing 1..10")
    for total in range(21, 11, -1):
        row = []
        for dealer in range(1, 11):
            a = pi.get((total, dealer, 0), 0)
            row.append("H" if a == 1 else "S")
        print(f" {total:2d} | " + " ".join(row))

    w, d, l = evaluate_policy(pi)
    print(f"\nGreedy policy outcome over 100k games:  win={w:.3f}  draw={d:.3f}  loss={l:.3f}")
    print("(Blackjack favors the dealer, so a net loss rate near ~0.5 is expected even for good play.)")


if __name__ == "__main__":
    main()
