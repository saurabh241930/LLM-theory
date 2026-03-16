# Information Theory for LLMs: Measuring Information & Uncertainty

**Core Insight:** Information theory quantifies surprise and uncertainty. This is surprisingly useful for understanding LLMs.

---

## 1. Entropy: Measuring Uncertainty

### What Is Entropy?

A measure of "how uncertain" a distribution is.

```
Entropy H(X) = -Σ P(x_i) × log(P(x_i))

Intuition: Higher entropy = more surprise = less predictable
```

### Extreme Examples

**Certain outcome (low entropy):**
```
P(token="the") = 1.0
P(anything else) = 0

H = -[1.0 × log(1.0) + 0 × ... + 0]
  = -[1.0 × 0]
  = 0

Entropy = 0 (maximum certainty, minimum surprise)
```

**Uniform distribution (high entropy):**
```
50K vocabulary tokens
Each P(token) = 1/50K = 0.00002

H = -Σ (1/50K × log(1/50K))
  = -50K × (1/50K × log(1/50K))
  = -log(1/50K)
  = log(50K)
  ≈ 10.82 bits

Maximum entropy (maximum uncertainty, maximum surprise)
```

### LLM Application: Language Difficulty

```
Easy text (repetitive, predictable):
"The the the the the"
Entropy = low (each token is very predictable)

Difficult text (diverse, surprising):
"The polynya's amelioration precipitated schism"
Entropy = high (unexpected tokens)

Training on diverse data → Model learns higher entropy distribution
```

---

## 2. Cross-Entropy: Loss Function Connection

### Cross-Entropy Defined

```
H(P, Q) = -Σ P(x_i) × log Q(x_i)

Where:
P = true distribution
Q = model's predicted distribution

Intuition: "How surprised is Q by P's actual outcomes?"
```

### Why It's The LLM Loss Function

```
True distribution P:
[1, 0, 0]  (first token is definitely correct)

Model predicts Q:
[0.7, 0.2, 0.1]

Cross-entropy = -[1 × log(0.7) + 0 × log(0.2) + 0 × log(0.1)]
              = -log(0.7)
              = 0.357

If model predicted Q = [0.95, 0.03, 0.02]:
Cross-entropy = -log(0.95) = 0.051

Better prediction → lower cross-entropy ✓
```

### Why Not Mean Squared Error?

MSE (mean squared error) would be:
```
MSE = ((0.7 - 1)² + (0.2 - 0)² + (0.1 - 0)²) / 3
    = (0.09 + 0.04 + 0.01) / 3
    = 0.047

Looks similar to cross-entropy (0.357), right?

Actually no!
Cross-entropy penalizes confident wrong answers much more:
- Predicting 0.01 when truth is 1.0: CE = log(100) = 4.6
- Predicting 0.01 when truth is 1.0: MSE = 0.99

Cross-entropy → huge penalty, forces correct predictions
MSE → moderate penalty, might accept "close enough"

For classification (tokens), cross-entropy is better!
```

---

## 3. Perplexity: Evaluation Metric

### What Is Perplexity?

```
Perplexity = 2^(cross-entropy loss)

Or equivalently (for base e):
Perplexity = e^(cross-entropy loss)
```

### Intuition

```
Perplexity = "How many equally likely tokens could come next?"

Model with perplexity = 50?
Equivalent to choosing uniformly from 50 tokens
(Could be any of 50 with equal probability)

Model with perplexity = 5?
Equivalent to choosing uniformly from 5 tokens
(More confident, fewer likely options)
```

### Real Example

```
Text: "The quick brown fox jumps over the"

Next token is: "lazy" (correct)

Model 1 predicts:
P(lazy) = 0.20
P(dog) = 0.10
P(cat) = 0.05
... (rest: 0.65 spread over 50K tokens)

Cross-entropy = -log(0.20) = 1.609
Perplexity = e^1.609 = 5.0

Model 2 predicts:
P(lazy) = 0.001
P(dog) = 0.001
... (spread over 50K tokens)

Cross-entropy = -log(0.001) = 6.908
Perplexity = e^6.908 = 1000.0

Model 1 is much better (lower perplexity)
```

### Perplexity Benchmarks

```
Shakespeare dataset:
- Random model: perplexity ≈ 100,000
- Basic n-gram: perplexity ≈ 50
- Transformer-small: perplexity ≈ 20
- GPT-3: perplexity ≈ 3-5

Lower is better.
Typical good LLM: perplexity 15-25 on test set
```

---

## 4. KL Divergence: Distance Between Distributions

### KL Divergence Defined

```
KL(P || Q) = Σ P(x_i) × log(P(x_i) / Q(x_i))
           = Σ P(x_i) × [log P(x_i) - log Q(x_i)]
           = Σ P(x_i) × log(P(x_i)) - Σ P(x_i) × log(Q(x_i))
           = -H(P) - H(P, Q)
             ↑ Entropy of P  ↑ Cross-entropy

Intuition: How different is Q from P?
KL = 0 means identical distributions
KL → ∞ means very different distributions
```

### Example

```
True: P = [0.60, 0.30, 0.10]  (token distribution in real text)
Model: Q = [0.50, 0.40, 0.10]  (model's prediction)

KL(P || Q) = 0.60 × log(0.60/0.50) + 0.30 × log(0.30/0.40) + 0.10 × log(0.10/0.10)
           = 0.60 × log(1.2) + 0.30 × log(0.75) + 0.10 × log(1)
           = 0.60 × 0.182 + 0.30 × (-0.288) + 0.10 × 0
           = 0.109 - 0.086 + 0
           = 0.023

Very small KL → distributions are similar ✓
```

### Why KL ≠ Symmetric

```
KL(P || Q) = 0.023  (is Q close to P?)
KL(Q || P) = ?

Q = [0.50, 0.40, 0.10]
P = [0.60, 0.30, 0.10]

KL(Q || P) = 0.50 × log(0.50/0.60) + 0.40 × log(0.40/0.30) + 0.10 × log(0.10/0.10)
           = 0.50 × (-0.182) + 0.40 × 0.288 + 0
           = -0.091 + 0.115
           = 0.024

Similar but not identical!
KL is not symmetric: KL(P||Q) ≠ KL(Q||P)

Why matters for LLMs:
KL(original_model || new_model) = Does new model stay similar to original?
KL(new_model || original_model) = Does new model preserve original behavior?
Different penalty structures!
```

### LLM Application: RLHF & Fine-Tuning

```
RLHF Loss = Reward - β × KL(original_model || new_model)
                     ↑ Penalty for diverging too much

Why?
If β is high: Keep model close to original (safe, but less adaptation)
If β is low: Allow big changes (adaptive, but might forget language)

Typical β value: 0.1 (small penalty)

Training loop:
└─ Maximize reward while keeping KL divergence low
   = Get better at user preferences without forgetting English

LoRA fine-tuning uses similar principle:
└─ Add small perturbation ΔW (not full retraining)
   = Small KL divergence from original
```

---

## 5. Mutual Information: What Do Variables Tell About Each Other?

### Mutual Information Defined

```
I(X;Y) = H(X) + H(Y) - H(X,Y)

Intuition: "How much does knowing Y reduce uncertainty about X?"

I(X;Y) = 0: X and Y are independent (knowing Y tells nothing about X)
I(X;Y) = H(X): Y completely determines X (maximum info)
```

### Example

```
X = "Is it raining?" → {Yes, No}
Y = "Is the grass wet?" → {Yes, No}

H(X) ≈ 1 bit (fair coin flip probability)
H(Y) ≈ 1 bit
H(X,Y) ≈ 1 bit (strong correlation)

I(X;Y) = 1 + 1 - 1 = 1 bit

Interpretation: Knowing the grass is wet gives 1 full bit of info
about whether it rained (high mutual information)
```

### LLM Application: Token Importance

```
Context tokens: [token1, token2, token3, ... token_n]
Prediction task: Predict next_token

Mutual information tells:
I(token_i; next_token) = How much does token_i help predict next_token?

High MI: Important token (pay attention to it)
Low MI: Irrelevant token (ignore)

This is how attention mechanisms work!
(They learn to weight tokens by their information content)
```

---

## 6. TF-IDF: Quantifying Relevance in Retrieval

### TF-IDF = Term Frequency × Inverse Document Frequency

```
TF(t, d) = (count of t in d) / (total words in d)
         ↑ How common is term t in this document?

IDF(t) = log(total documents / documents containing t)
       ↑ Is this term rare or common overall?

TF-IDF(t, d) = TF(t, d) × IDF(t)
             = How unique and concentrated is term t?
```

### Example

```
Query: "machine learning"
Document 1: "This article about machine learning"
Document 2: "The machine broke, learning experience"

TF("machine", doc1) = 1/5 = 0.2
TF("machine", doc2) = 1/6 ≈ 0.167

Let's say 1000 docs total, "machine" appears in 200 docs:
IDF("machine") = log(1000 / 200) = log(5) ≈ 1.609

TF-IDF("machine", doc1) = 0.2 × 1.609 = 0.322
TF-IDF("machine", doc2) = 0.167 × 1.609 = 0.269

Doc1 more relevant (higher TF-IDF) ✓

"machine" itself is common (IDF multiplier is low)
But doc1 uses it more concentrated → higher score
```

### Why This IS Information Theory

```
Rare term in document = High information content
(If doc mentions rare term, probably relevant to that term)

Common term in document = Low information content
(Doesn't tell us much; very document has common words)

TF-IDF captures: Information-theoretic relevance!
```

### Modern Alternative: BM25

BM25 improves on TF-IDF:
```
BM25 = Better normalization for document length
     = Empirically better ranking than TF-IDF
     = Still based on information theory principles
```

---

## Summary: Information Theory in LLMs

| Concept | LLM Use |
|---------|---------|
| Entropy | Measure surprise in predictions |
| Cross-entropy | Training loss (minimize) |
| Perplexity | Evaluation metric (lower is better) |
| KL Divergence | Fine-tuning penalty, RLHF alignment |
| Mutual Information | Attention weight (which tokens matter?) |
| TF-IDF | Search relevance, hybrid search weighting |

**One sentence:** Information theory reduces intuitive concepts to precise numbers, enabling optimization (training) and ranking (retrieval).

Every ranking and training update ultimately uses information theory.
