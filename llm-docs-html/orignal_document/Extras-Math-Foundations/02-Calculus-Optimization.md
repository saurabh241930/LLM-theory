# Calculus & Optimization for LLMs: Why Models Learn

**The Core Question:** How do we get a model from random weights to understanding language? Calculus is the answer.

---

## 1. Derivatives: Measuring Change

### What Is a Derivative?

The rate of change of a function.

```
Simple example - a line:
f(x) = 2x + 3

Derivative f'(x) = 2
↑ "For every 1 unit increase in x, f(x) increases by 2"

Graphically:
f(x) = 2x + 3
  |     /
  |    /
  |   /
  |__/___
       Slope = 2 (the derivative)
```

### Non-Linear Example (Parabola)

```
f(x) = x²

Derivative f'(x) = 2x
↑ Changes with x!

At x = 1: f'(1) = 2  (curve going up at slope 2)
At x = 2: f'(2) = 4  (steeper)
At x = -1: f'(-1) = -2 (going down)
At x = 0: f'(0) = 0  (flat, minimum point)
```

**Key insight:** Derivative tells you:
- Where is the slope steepest?
- Where is the minimum/maximum? (where derivative = 0)

---

## 2. Gradient Descent: How Models Learn

### The Problem: 7 Billion Parameters to Update

```
Model has 7B parameters (weights).
Current loss = 2.3 (high, bad)
Goal: Reduce loss to 0.1

How do we adjust 7B weights in the right direction?
```

### The Solution: Follow the Gradient Downhill

Imagine loss as a landscape:

```
Loss surface (2D visualization of 7B parameters):
        ╱╲
       ╱  ╲
      ╱    ╲    ← Peak (high loss)
     ╱      ╲
    ╱   ●    ╲   ● = current position
   ╱╱╱╱╱║╲╲╲╲╲
  ╱╱╱╱╱╱║╱╱╱╱╱╱
       ║
       ↓
      Valley ← Goal: get here (low loss)

Gradient: Points in direction of steepest increase
Negative gradient: Points in direction of steepest decrease ✓
```

### Gradient Descent Algorithm

```
1. Calculate gradient of loss
   (how much does loss change for each parameter?)

2. Update parameters:
   new_weight = old_weight - learning_rate × gradient
                ↑ subtract because we want to DECREASE loss

3. Repeat!

Example with one weight w:
Loss = (prediction - truth)²

w = 0.5
Loss = 10 (bad)
Gradient = 5 (steep decrease in direction for positive w)

new_w = 0.5 - 0.1 × 5 = 0.5 - 0.5 = 0.0
Loss = 1 (better!)

new_w = 0.0 - 0.1 × 0 = 0.0
Loss = 1 (flat, minimum reached)
```

---

## 3. Chain Rule: Backpropagation Explained

### Simple Chain Rule

If f(g(x)):
```
df/dx = df/dg × dg/dx

Example:
f(g(x)) = (x²)³
g(x) = x²
f(u) = u³

df/dx = df/du × du/dx
      = 3u² × 2x
      = 3(x²)² × 2x
      = 6x⁵
```

### How This Solves LLM Training

Neural network is a chain:
```
Input → Linear(W1) → ReLU → Linear(W2) → Softmax → Loss

Loss = f(W2, f(W1, X))

To update W1, we need gradient of loss with respect to W1:
dLoss/dW1 = dLoss/dW2 × dW2/dW1  ← Chain rule!

This is backpropagation: Computing gradients by working backwards.
```

### Concrete Example: 2-Layer Network

```
Input: x = [1, 0.5]

Layer 1: h = ReLU(x · W1)
W1 = [[0.2, 0.3], [0.4, 0.1]]
h = ReLU([1×0.2 + 0.5×0.4, 1×0.3 + 0.5×0.1])
  = ReLU([0.4, 0.35])
  = [0.4, 0.35]

Layer 2: y = softmax(h · W2)
W2 = [[0.5, -0.2], [-0.3, 0.4]]
logits = [0.4×0.5 + 0.35×(-0.3), 0.4×(-0.2) + 0.35×0.4]
       = [0.095, 0.06]
probs = softmax([0.095, 0.06]) = [0.52, 0.48]

True label: [1, 0] (first token)
Loss = -log(0.52) = 0.65

Backprop:
dLoss/dW2 = ... (chain rule applied)
dLoss/dW1 = ... (chain rule through ReLU and W2)

Update:
W1 = W1 - 0.01 × dLoss/dW1
W2 = W2 - 0.01 × dLoss/dW2
```

**This is training.** Repeat on millions of tokens, loss goes down.

---

## 4. Learning Rate: Tuning the Step Size

### The Tradeoff: Too Fast vs Too Slow

```
Learning rate α = 0.0001 (too small):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 9.999
Iteration 3: Loss = 9.998
...
Need 1M iterations to reach minimum!
↑ Slow convergence
```

```
Learning rate α = 1.0 (too large):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 50.0  ← Jumped way too far!
Iteration 3: Loss = 200.0 ← Diverges!
↑ Unstable, diverges
```

```
Learning rate α = 0.01 (just right):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 5.0
Iteration 3: Loss = 2.5
Iteration 4: Loss = 1.2
...
Reaches minimum in ~50 iterations
↑ Fast, stable convergence
```

### Why Learning Rate Matters in Fine-Tuning

```
Pre-trained model weights: Very good (already trained on 10T tokens)
Fine-tuning goal: Adapt slightly without breaking it

High learning rate (0.1):
"Great, I'll change all weights a lot!"
Result: Forget everything! Catastrophic forgetting. ✗

Low learning rate (0.0001):
"I'll change weights very carefully"
Result: Barely adapt to new domain. ✗

Sweet spot (0.00005 for LoRA):
Just enough to adapt, not enough to break.
✓
```

### Learning Rate Schedules

```
Don't use constant learning rate.
Use schedule: Start high, decay over time.

Cosine schedule (common):
LR decreases from 0.0001 to 0.00001 as training progresses
  ├─ Early: Large steps (explore)
  └─ Late: Small steps (fine-tune)

Warmup then decay:
  LR = 0 → 0.0001 over 1000 steps (linear warmup)
  Then LR = 0.0001 → 0.00001 over remaining steps

Why: Early iterations have bad gradients,
don't want to take huge steps based on bad info.
```

---

## 5. Partial Derivatives: Multi-Parameter Optimization

### Single Parameter Approach (Doesn't Work)

```
Update one parameter at a time:
w1 = w1 - lr × dLoss/dw1
w2 = w2 - lr × dLoss/dw2
w3 = w3 - lr × dLoss/dw3
...
w_7B = w_7B - lr × dLoss/dw_7B

Problem: 7B sequential updates!
Method: Sequential, slow.
```

### Gradient Vector Approach (What We Use)

Compute gradient with respect to ALL parameters simultaneously:

```
∇Loss = [dLoss/dw1, dLoss/dw2, ..., dLoss/dw_7B]
        ↑ Vector of size 7B

Update all at once:
W = W - learning_rate × ∇Loss

Why:
✓ Vectorized (matrix operations, GPU accelerated)
✓ One forward pass computes all gradients via backprop
✓ Update all 7B parameters in milliseconds
```

### Example: Loss Function with 2 Parameters

```
Loss = (y_pred - y_true)²

y_pred = w1 × x1 + w2 × x2

dLoss/dw1 = 2(y_pred - y_true) × x1
dLoss/dw2 = 2(y_pred - y_true) × x2

Gradient = [2(y_pred - y_true) × x1, 2(y_pred - y_true) × x2]

Update:
[w1, w2] = [w1, w2] - lr × Gradient
```

---

## 6. Second-Order Optimization: Momentum & Adam

### Problem with Pure Gradient Descent

```
Scenario: Lost landscape with valley and cliff:

  |     ╱╲╱╲
  |    ╱  ╲  ╲
  |   ╱    ╲  ╲
  |__╱______╲__╲____
      Valley   Cliff

Pure gradient descent:
├─ In valley: Gradient = 0, we stop (but not at cliff bottom)
├─ At cliff: Large gradient, huge update, overshoots
└─ Result: Oscillates around minimum, doesn't converge

Solution: Add momentum!
"Remember previous direction, keep going even if gradient is small"
```

### Momentum: Gradient Descent with Inertia

```
velocity = 0
for step in range(iterations):
    gradient = compute_gradient(loss)
    velocity = 0.9 × velocity + 0.1 × gradient
               ↑ Remember where we've been
    W = W - learning_rate × velocity
```

**Effect:**
```
Iteration 1: gradient = 5, velocity = 0.5 (small step)
Iteration 2: gradient = 5, velocity = 1.0 (bigger step)
Iteration 3: gradient = 0, velocity = 0.9 (still moving forward!)
...
Eventually reaches minimum smoothly.
```

### Adam: Adaptive Moment Estimation

Adam combines:
1. Momentum (remember past gradients)
2. Adaptive learning rates (bigger steps for sparse params)

```
Used in almost every LLM training:
├─ Tracks first moment (mean of gradients)
├─ Tracks second moment (variance of gradients)
└─ Combines both for adaptive updates

Result: Robust optimization across different parameter scales.
```

---

## 7. Loss Landscapes & Local Minima

### The Optimization Surface

```
Real neural network loss landscape (simplified 2D):
        ╱╲  ╱╲
       ╱  ╲╱  ╲
      ╱        ╲
     ╱ Valleys  ╲  ← Multiple minima
    ╱____________╲
    ↓             ↓
  Local min    Global min
  (get stuck)   (goal)
```

### Does Gradient Descent Get Stuck?

Surprising answer: **Usually NO for large models!**

```
Theory says: Yes, local minima trap you.

Practice in LLMs:
- With 7B parameters, loss landscape has many "valleys"
- But they're all similar (similar loss values)
- Gradient descent escapes shallow valleys naturally
- Only gets truly stuck at regions with ZERO gradient
  (very rare in practice)

Empirical observation: Random initialization → gradient descent
→ Similar final loss, similar performance.
Suggests landscape is surprisingly "smooth"
```

### Saddle Points (More Common Than Local Minima)

```
A saddle point:
      ╱╲
  ___╱__╲___ ← Flat in some directions
    ╲__╱
      ╲╱

Gradient is zero (looks like stuck)
But it's not a minimum (curves downward in other direction)

How to escape:
- Add noise (SGD has noise from mini-batches)
- Second-order methods (check Hessian, see which way curves down)
- Momentum (moves through noise)

Result: Usually escapes naturally in practice.
```

---

## Summary: Calculus in LLM Training

| Concept | LLM Use |
|---------|---------|
| Derivative | Measure change, find direction to improve |
| Gradient | Multi-parameter derivative (7B at once) |
| Gradient descent | Core algorithm: follow gradient downhill |
| Chain rule | Backpropagation computes gradients |
| Learning rate | Controls step size (trade-off speed vs stability) |
| Momentum | Smooth convergence, avoid oscillation |
| Adam | Adaptive learning rates, standard optimizer |

**One sentence:** Calculus tells you which direction to nudge 7B parameters to reduce loss. That's training.

LLMs aren't magical — they're just optimizers following gradients.
