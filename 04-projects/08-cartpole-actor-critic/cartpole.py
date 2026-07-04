"""
A self-contained CartPole environment (classic control), no gym dependency.
Physics adapted from the standard CartPole-v1 dynamics.

State  = [cart position, cart velocity, pole angle, pole angular velocity]
Actions= 0 (push left), 1 (push right)
Reward = +1 per timestep the pole stays up; episode ends if the pole falls
         (|angle| > 12 deg) or the cart leaves the track, or after 500 steps.
"""
import numpy as np


class CartPole:
    def __init__(self, rng=None, max_steps=500):
        self.rng = rng or np.random.default_rng()
        self.max_steps = max_steps
        # physics constants
        self.g = 9.8
        self.mass_cart = 1.0
        self.mass_pole = 0.1
        self.total_mass = self.mass_cart + self.mass_pole
        self.length = 0.5                 # half pole length
        self.pole_ml = self.mass_pole * self.length
        self.force_mag = 10.0
        self.dt = 0.02
        self.theta_threshold = 12 * np.pi / 180
        self.x_threshold = 2.4

    def reset(self):
        self.state = self.rng.uniform(-0.05, 0.05, size=4)
        self.steps = 0
        return self.state.copy()

    def step(self, action):
        x, x_dot, theta, theta_dot = self.state
        force = self.force_mag if action == 1 else -self.force_mag
        cos, sin = np.cos(theta), np.sin(theta)

        temp = (force + self.pole_ml * theta_dot**2 * sin) / self.total_mass
        theta_acc = (self.g * sin - cos * temp) / (
            self.length * (4.0 / 3.0 - self.mass_pole * cos**2 / self.total_mass))
        x_acc = temp - self.pole_ml * theta_acc * cos / self.total_mass

        x += self.dt * x_dot
        x_dot += self.dt * x_acc
        theta += self.dt * theta_dot
        theta_dot += self.dt * theta_acc
        self.state = np.array([x, x_dot, theta, theta_dot])
        self.steps += 1

        done = (abs(x) > self.x_threshold or abs(theta) > self.theta_threshold
                or self.steps >= self.max_steps)
        return self.state.copy(), 1.0, done

    @property
    def n_actions(self):
        return 2

    @property
    def state_dim(self):
        return 4
