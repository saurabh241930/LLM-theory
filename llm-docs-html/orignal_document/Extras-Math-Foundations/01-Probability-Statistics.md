# Probability & Statistics for LLMs: Why Models Are Distributions

**Core Truth:** An LLM is not deterministic logic. It's a probability distribution over tokens. Everything it does is probability.

---

## 1. Probability Distributions: What Is an LLM Actually?

### LLM = Probability Distribution Over Tokens

When you ask GPT-4 a question, it doesn't "think" — it predicts:

```
Question: "The capital of France is"

LLM returns distribution:
P("Paris") = 0.95
P("Paris,") = 0.04
P("France") = 0.005
P("Lyon") = 0.002
...

It samples from this distribution (usually picks argmax = "Paris")
```

**At every step:**
```
Generated so far: "The capital of France is"
Next token distribution:
P(Paris) = 0.92
P("the") = 0.02
P("a") = 0.01
...

Sample again → "Paris"

Generated so far: "The capital of France is Paris"
Next token distribution:
P(".") = 0.70
P("!") = 0.15
P(",") = 0.10
...
```

**This IS the LLM.** It's probabilities all the way down.

### What Variables Affect These Probabilities?

```
P(next_token | input_tokens, weights)

Input affects probabilities:
- Different input → different P()
- But weights are fixed (after training)

Temperature (model parameter):
- Low temp (0.1): P(Paris) = 0.99, sharp distribution
- High temp (1.0): P(Paris) = 0.30, flat distribution
```

---

## 2. Softmax: How LLMs Become Probabilities

### The Problem: Neural Network Outputs Are Just Numbers

```
Last neural network layer outputs:
[2.3, -1.5, 0.8, 3.1, -0.2]

These are scores, not probabilities:
- Can be negative (probabilities can't!)
- Don't sum to 1
- Are unbounded
```

### The Solution: Softmax Function

Converts scores to valid probabilities:

```
softmax(x_i) = e^(x_i) / Σ(e^(x_j) for all j)

Example with scores [2.3, -1.5, 0.8]:
e^2.3 = 10.0
e^-1.5 = 0.22
e^0.8 = 2.23

Softmax:
P(token1) = 10.0 / (10.0 + 0.22 + 2.23) = 10.0 / 12.45 = 0.80
P(token2) = 0.22 / 12.45 = 0.018
P(token3) = 2.23 / 12.45 = 0.179

Sum = 0.80 + 0.018 + 0.179 = 1.0 ✓ Valid probability!
```

### Why This Shape?

```
Softmax amplifies differences:
Scores: [-1, 0, 1]
Softmax: [0.09, 0.24, 0.67]
         ↑ Small score difference becomes big probability difference

This is WHY high logits "win"
```

**In LLMs:** After each transformer layer, softmax over vocabulary (50K+ tokens) gives next token probabilities.

---

## 3. Bayes Theorem: How Retrieval Scoring Works

### What Is Bayes Theorem?

```
P(A | B) = P(B | A) × P(A) / P(B)

Translation:
Posterior = (Likelihood × Prior) / Evidence
```

### Real LLM Application: Ranking Retrieved Documents

In RAG, you retrieve documents and need to rank them.

**Naive approach (without Bayes):**
```
Similarity score between query and doc = 0.75

Is this document relevant?
0.75 is... good? bad? depends...
```

**Bayesian approach:**
```
P(relevant | score=0.75) = P(score=0.75 | relevant) × P(relevant) / P(score=0.75)

P(score=0.75 | relevant) ≈ 0.9    (relevant docs usually score high)
P(relevant) ≈ 0.1                  (prior: 10% of docs are relevant)
P(score=0.75) ≈ 0.3               (overall, 30% of docs score 0.75)

P(relevant | score=0.75) = 0.9 × 0.1 / 0.3 = 0.3

So: Score 0.75 means 30% likely to be relevant.
```

**Why this matters:** Same score means different things depending on context.

### Cross-Encoder Reranking (Bayesian Intuition)

```
Dense retrieval: "Is this relevant?"
Answer: 0.75 similarity score

Cross-encoder: "Given context, is this relevant?"
Runs: P(relevant | query, document) = 0.92
      P(relevant | query, document2) = 0.34

Better ranking by incorporating more info.
This is Bayesian: Using conditioning to improve inference.
```

---

## 4. Cross-Entropy Loss: How LLMs Learn

### What Is a Loss Function?

A score of "how wrong" the model is.

```
True distribution:    P(next_token) = [1, 0, 0]  (token1 is correct)
Model predicts:       P(next_token) = [0.7, 0.2, 0.1]

Loss = How wrong is the model?
Should penalize: predicting 0.7 when true is 1.0
Should ignore: predicting 0.1 when true is 0.0 (both say "not this")
```

### Cross-Entropy Loss

```
Loss = -Σ(y_i × log(p_i))

Where:
y_i = true probability (1 for correct token, 0 for others)
p_i = model's predicted probability

Example:
True: [1, 0, 0]  (token A is correct)
Pred: [0.7, 0.2, 0.1]

Loss = -(1 × log(0.7) + 0 × log(0.2) + 0 × log(0.1))
     = -log(0.7)
     = 0.357

If model predicted [0.9, 0.05, 0.05]:
Loss = -log(0.9) = 0.105

Better prediction → lower loss ✓
```

### Why Cross-Entropy for LLMs?

```
Advantages:
✓ Rewards confident correct predictions (log amplifies)
✓ Penalizes confident wrong predictions
✓ Smooth gradient for learning
✓ Probabilistically principled

This is THE loss function for language models:
Every LLM is trained by minimizing cross-entropy loss
over tokens in training data.
```

**Scaling up:** Compute loss on 1M tokens, average it, update weights to reduce it. Repeat.

---

## 5. KL Divergence: How Alignment Training Works

### What Is KL Divergence?

"Distance" between two probability distributions.

```
KL(P || Q) measures: "How different is Q from P?"

P = true distribution  [0.7, 0.2, 0.1]
Q = model distribution [0.6, 0.3, 0.1]

KL(P || Q) = Σ(P_i × log(P_i / Q_i))
           = 0.7 × log(0.7 / 0.6) + 0.2 × log(0.2 / 0.3) + 0.1 × log(0.1 / 0.1)
           ≈ 0.041

Identical distributions: KL = 0
Very different distributions: KL = ∞
```

### Real LLM Application: RLHF & DPO

**RLHF (Reinforcement Learning from Human Feedback):**

```
Start: LLM trained on next-token prediction
Goal: Make it follow human preferences (be nice, helpful, honest)

Loss = Cross-entropy loss on current task
     + Weight × KL(original_model || new_model)
       ↑ Prevents catastrophic forgetting
       Keeps new model close to original

High weight → Model barely changes, but safe
Low weight → Model changes a lot, might forget language

Balance via KL divergence!
```

**DPO (Direct Preference Optimization):**

```
Human feedback: "Answer A is better than Answer B"

Standard RLHF:
1. Train reward model: P(answer_is_good)
2. RL training: Maximize reward - λ × KL(original || new)

DPO insight: Do it directly!
Loss = KL divergence between preferred and non-preferred answers

Simpler: Just use KL divergence to measure which answer the model prefers.
```

---

## 6. Confidence Intervals & Uncertainty

### Problem: Model Says "The Answer Is 0.95"

But is it?

```
Model outputs: P(correct) = 0.95

Reality:
Sample 100 similar questions:
Correct answers: 93, 94, 96, 95, 97, ...
Average: ~95%

But with variance:
95% ± 2% confidence interval
(Could be as low as 93%, as high as 97%)
```

### Standard Deviation & Confidence

```
Model outputs over many examples:
[0.90, 0.94, 0.93, 0.95, 0.97]
Mean = 0.938
Std Dev = 0.025  (about 2.5%)

95% confidence interval: 0.938 ± 1.96 × 0.025 = [0.89, 0.99]

Interpretation: We're 95% confident true accuracy is in this range.
```

### LLM Application: Hallucination Detection

```
When LLM says something with high confidence:
"Paris is capital of France" → confidence 0.98

Does it have grounds? Could do:
1. Generate same answer 5 times
2. Calculate variation
3. If all similar (low std dev) → likely correct
4. If varied → maybe hallucinating
```

---

## 7. Bayes in Action: Building Better Rerankers

### Two-Stage Retrieval (Using Probability Theory)

```
Stage 1: Dense retrieval
Query embedding → cosine similarity
Get 100 candidates with scores [0.75, 0.73, 0.71, ...]

Stage 2: Reranking
For top 10:
  For each doc:
    Reranker outputs: P(relevant | query, doc)
    
Why it works:
Dense retrieval ≈ First approximation
Reranker = Bayesian refinement (P(A|B) given more context)
```

### Concrete Example

```
Query: "How to use LoRA?"

Dense retrieval returns:
Doc1: "LoRA is low-rank..." (similarity: 0.79)
Doc2: "Optimization tutorial..." (similarity: 0.75)

Reranker scores:
Doc1: P(relevant | query, doc1_full_text) = 0.92
Doc2: P(relevant | query, doc2_full_text) = 0.45

Reranked order: Doc1, Doc2 (matched intuition)

Without reranking: Would trust similarity score
With reranking: Use Bayesian update on full text
```

---

## Summary: Probability in LLMs

| Concept | LLM Use |
|---------|---------|
| Distributions | Model outputs probabilities per token |
| Softmax | Convert scores to probabilities |
| Bayes Theorem | Reranking, retrieval scoring |
| Cross-entropy | Training objective (minimize) |
| KL divergence | RLHF/DPO alignment, fine-tuning |
| Confidence intervals | Detect uncertainty, hallucination detection |

**Core insight:** Understanding probability = understanding how LLMs work from the inside.

An LLM is not a thinker — it's a probability machine.
