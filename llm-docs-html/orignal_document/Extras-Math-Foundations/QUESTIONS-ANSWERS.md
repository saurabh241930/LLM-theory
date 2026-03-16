# Math Foundations — Questions & Answers

## Category 1: Linear Algebra & Vector Operations

### Q1: What is a vector in the context of LLMs, and why do similar meanings produce similar vectors?

**Define:**
A vector is a list of numbers representing meaning. In LLMs, text is converted to vectors through embeddings. "cat" becomes [-0.2, 0.5, -0.1, 0.8, ...] (usually 768 or 1536 dimensions).

**Mechanism Explained:**

During training, the embedding model learns to place similar words near each other in vector space. This happens because:
1. Model sees "cat" and "dog" in similar contexts (contexts predict both)
2. Training optimizes to make their vectors nearly identical
3. Different contexts → different vectors (cat as animal vs cat as verb)

The neural network automatically discovers that "semantic similarity" maps to "spatial proximity."

**Why This Matters:**
- Vector database search uses cosine similarity (dot product of normalized vectors)
- Identical meaning → identical direction (dot product = 1)
- Different meaning → different direction (dot product < 1)

**Visual Example:**
```
Semantic space (2D simplified):
      |    dog •
      |       /
      |      /  ← Similar vectors (same direction)
      |     /
      |  • cat
      |________________
      
      |  • table
      |           chair •
      |           /
      |          /  ← Different direction
      |         /
      |__________|
      
Cosine sim(cat, dog) ≈ 0.95 (very similar)
Cosine sim(cat, table) ≈ 0.2 (different)
```

**Real Interview Answer (2 minutes):**

"In LLMs, embeddings map text to high-dimensional vectors. The key insight is that during pre-training, the model learns to represent similar meanings with similar vectors because they appear in similar contexts. When you compute cosine similarity (normalized dot product) between vectors, semantically close words score high (close to 1.0) and dissimilar words score low. This is why vector search works: query vector times document vector gives a similarity score, and you retrieve documents with highest scores."

---

### Q2: Explain cosine similarity and why we use it instead of raw dot product for embedding search.

**Define:**
Cosine similarity = Dot product of normalized vectors. It measures angle between vectors, not magnitude.

**Formula:**
```
cosine_sim(A, B) = (A · B) / (|A| × |B|)

Where:
A · B = dot product
|A|, |B| = magnitudes (lengths) of vectors
```

**Why Not Raw Dot Product:**

Raw dot product problem:
```
Vector A: [1, 1]       (magnitude √2)
Vector B: [2, 2]       (magnitude 2√2)

Same direction! But:
A · B = 1×2 + 1×2 = 4
A · A = 1×1 + 1×1 = 2

By dot product: B looks 2x more similar to A than A is to itself!
That's nonsensical.
```

**Cosine similarity solution:**
```
cos_sim(A, B) = 4 / (√2 × 2√2) = 4/4 = 1.0 ← Perfect similarity!
cos_sim(A, A) = 2 / (√2 × √2) = 2/2 = 1.0 ← Also perfect! ✓

Same direction = similarity 1.0, regardless of magnitude
```

**Real-world LLM example:**
```
Short query: "dog"
Vector: [0.02, -0.15, 0.08]  (length 0.18)

Long document: "dogs are wonderful animals"
Vector: [0.04, -0.30, 0.16]  (length 0.36, twice as long!)

Raw dot product:
(0.02×0.04) + (-0.15×-0.30) + (0.08×0.16) = 0.058

Cosine similarity:
0.058 / (0.18 × 0.36) = 0.057 / 0.0648 ≈ 0.9 (very similar!)

Cosine correctly identifies same meaning despite length difference.
```

**Trade-offs:**

✅ Cosine Similarity:
- Independent of magnitude (fair comparison)
- Range [0, 1] (intuitive)
- Computationally efficient (just normalize once)
- Standard in production (vector DBs implement it)

❌ Issues:
- Doesn't capture "strength" (both strong and weak signals normalize to same direction)
- In rare cases, might want magnitude (very long document might be more relevant)

**Answer for Interview (2 minutes):**

"Cosine similarity measures the angle between vectors, not their magnitude. We use it instead of raw dot product because embedding vectors can have different magnitudes without changing their semantic meaning. For example, a short query and a long document can express the same concept with different vector magnitudes. Cosine similarity normalizes by magnitude, so identical meaning gets score 1.0 regardless of length. This is critical in retrieval — you want 'dog' to match 'dogs' perfectly even if word frequency differs."

---

### Q3: What is low-rank decomposition and how does it explain LoRA?

**Define:**
Low-rank decomposition approximates a large matrix W as the product of two smaller matrices: W ≈ A × B, where A and B together have far fewer parameters than W.

**Mechanism:**

Standard fine-tuning:
```
Update weight matrix W: 4096 × 4096
Parameters to update: 4096² = 16.7M
Memory: ~64MB per layer × 100 layers = 6.4GB
```

LoRA decomposition:
```
Update as: W + ΔW ≈ W + A × B

Where:
A: 4096 × r  (r is small, typically 8 or 16)
B: r × 4096

Total params: (4096 × 8) + (8 × 4096) = 65,536
Original: 16.7M

Reduction: 99.6% fewer parameters!
Memory: ~260KB per layer × 100 layers = 26MB (yes, kilobytes!)
```

**Why This Works:**

Empirical observation: The update to pre-trained weights is actually low-rank. Most of the "important" changes can be captured by a small rank r.

```
Intuition: Pre-training is general knowledge (English language)
Fine-tuning is specific knowledge (medical domain)

The "gap" between general and specific is often expressible
in a lower-dimensional subspace.

Rank-8 often captures 95% of the improvement of full fine-tuning!
```

**Concrete Example:**

```
Pre-trained model on general text:
"The patient has [MASK]"
Predicts: {syndrome, disease, condition, ...}

Fine-tune on medical data with LoRA:
Train A and B such that: W + A×B better predicts medical terms
New prediction: {syndrome, carcinoma, necrosis, ...}

The shift in what the model predicts is "medical domain shift"
This shift is low-rank (doesn't require retraining all 16M params)
```

**Trade-offs:**

✅ LoRA:
- 99% memory reduction
- Trains 4x faster
- Still achieves 95%+ of full fine-tuning performance
- Easy to swap (just load different A, B matrices)

❌ LoRA:
- Slightly lower quality than full fine-tuning
- Limited expressiveness (low-rank assumption might fail for some tasks)
- Can't update biases (though bias updates are minor)

**Production Implication:**

```
Full fine-tuning: Train once, get one model
LoRA fine-tuning: Train many specialized versions
├─ Medical LoRA: A_med, B_med
├─ Legal LoRA: A_legal, B_legal
├─ Code LoRA: A_code, B_code
└─ Load whichever needed for user request

Single GPU can train 10+ LoRAs in time it takes to full fine-tune 1 model!
```

**Answer for Interview (3 minutes):**

"Low-rank decomposition is the mathematical foundation of LoRA. Pre-trained models have weight matrices like 4096×4096 — updating all 16M parameters is expensive. But empirically, the fine-tuning update to these weights is low-rank, meaning it can be approximated as A×B where A is 4096×8 and B is 8×4096. You only train 65K parameters instead of 16M — a 99.6% reduction. This works because fine-tuning is adapting general knowledge to a specific domain, which is fundamentally a lower-dimensional transformation. In practice, LoRA achieves 95% of full fine-tuning quality on 1% of the parameters and memory."

---

## Category 2: Probability & Softmax

### Q4: Explain how softmax converts neural network outputs to valid probabilities. Why is this necessary?

**Define:**
Softmax transforms a vector of arbitrary real numbers (logits) into a vector of probabilities that sum to 1.

**Formula:**
```
softmax(x_i) = e^(x_i) / Σ(e^(x_j) for all j)
```

**Why Necessary:**

Raw neural network output:
```
Last layer outputs: [2.3, -1.5, 0.8]

Problems:
• Can be negative (-1.5) — probabilities can't!
• Don't sum to 1 (2.3 - 1.5 + 0.8 = 1.6) — probabilities must!
• Unbounded (could be 100 or -100)
• How do you sample from this? No clear interpretation.
```

**Softmax Solution:**

```
e^2.3 = 10.0
e^-1.5 = 0.22
e^0.8 = 2.23
Sum = 12.45

softmax:
P(token1) = 10.0 / 12.45 = 0.803
P(token2) = 0.22 / 12.45 = 0.018
P(token3) = 2.23 / 12.45 = 0.179

Check: 0.803 + 0.018 + 0.179 = 1.0 ✓
All probabilities ✓
```

**Key Properties:**

**1. Exponential amplifies differences:**
```
Logits: [1.0, 1.1]  (only 0.1 difference)
Softmax: [0.268, 0.732]  (26.8% vs 73.2%, huge difference!)

This is GOOD because:
├─ Higher logits should dominate (increase gap)
└─ Enables clear decisions (argmax winner)
```

**2. Temperature control:**
```
softmax_T(x_i) = e^(x_i/T) / Σ(e^(x_j/T))

Low temperature (T=0.5):
[2.3, -1.5, 0.8] → [0.92, 0.01, 0.07]
Very confident distribution

High temperature (T=2.0):
[2.3, -1.5, 0.8] → [0.51, 0.14, 0.35]
More uniform distribution

Why: Lower temp sharps distribution, higher temp flattens it
```

**Application in LLMs:**

```
At each token generation step:
1. Run transformer → logits vector (50K dimensions for vocabulary)
2. Apply softmax → probability over all 50K tokens
3. Sample token from this distribution
4. Add to sequence
5. Repeat

The softmax creates valid probability distribution to sample from!
```

**Answer for Interview (2 minutes):**

"Softmax transforms logits (raw neural network outputs) into valid probability distributions. Raw outputs can be negative and don't sum to 1. Softmax exponentiates each logit and normalizes by the sum, creating probabilities that sum to 1 and are all in [0,1]. The exponential function is key — it amplifies differences between logits, so the highest logit dominates. This is why argmax (picking highest probability) works well. Temperature control lets you trade between confident predictions (low temp) and diverse sampling (high temp). In LLM inference, this is literally how the model samples the next token at each step."

---

### Q5: What does zero temperature vs high temperature mean in LLM sampling? When would you use each?

**Zero Temperature (Greedy Decoding):**

```
Effective softmax with T → 0:
P(best_token) → 1.0
P(all_other_tokens) → 0

Behavior: Always pick argmax (highest probability token)

Example:
"The capital of France is"
P(Paris) = 0.95
After T → 0:
P(Paris) = 1.0, P(everything else) = 0

Next token: Always "Paris"
Same input → Same output (deterministic)
```

**High Temperature (Diverse Sampling):**

```
Effective softmax with T → ∞:
All probabilities → uniform
P(each_token) → 1/vocab_size

Example with high T:
P(Paris) = 0.95, P(dog) = 0.02, P(cat) = 0.01
After high T:
P(Paris) = 0.35, P(dog) = 0.32, P(cat) = 0.33

Almost equal probabilities!
Lots of randomness, creative outputs
```

**When to Use Each:**

| Temperature | Use Case | Why |
|-------------|----------|-----|
| 0 (greedy) | Factual Q&A, Code generation, Deterministic tasks | Need correct answer, not creative |
| 0.7 (default) | General chat, balanced | Balance consistency and creativity |
| 1.5+ (high) | Creative writing, Brainstorming | Want diverse, unexpected outputs |

**Real Examples:**

```
Low temp (T=0.2):
Prompt: "Complete this sentence: 2+2="
Output: "4" (always)
Output: "4" (always)  ← Deterministic!

High temp (T=1.5):
Prompt: "Tell me a creative story about..."
Output: "Once upon a time in a silver forest..."
Output: "In a distant galaxy, three travelers..."  ← Different each time
```

**Answer for Interview (2 minutes):**

"Temperature controls the diversity of sampling in language models. At zero temperature, softmax becomes argmax — you always pick the highest probability token, making output deterministic. For factual tasks like math or code, this is ideal because you want the 'best' answer. High temperature flattens the probability distribution, making low-probability tokens more likely. So the same prompt produces different outputs each time, enabling creative writing. Default is around 0.7–1.0 for balanced generation. In production APIs, you control this per request: use low temp for chatbots answering FAQs, high temp for creative applications."

---

## Category 3: Information Theory & Loss

### Q6: Explain cross-entropy loss and why it's the standard training objective for LLMs.

**Define:**
Cross-entropy loss measures how 'surprised' a probability model is when it sees data drawn from the true distribution.

**Formula:**
```
Loss = -Σ y_i × log(p_i)

Where:
y_i = true probability (1 for correct class, 0 for others)
p_i = model's predicted probability
```

**Why This Formula?**

```
True label: [1, 0, 0]  (first token is correct)
Model pred: [0.7, 0.2, 0.1]

Loss = -(1 × log(0.7) + 0 × log(0.2) + 0 × log(0.1))
     = -log(0.7)
     = 0.357

If model predicted [0.9, 0.05, 0.05]:
Loss = -log(0.9) = 0.105

Better prediction (correct with higher confidence) → lower loss ✓
```

**Why Not Other Loss Functions?**

Mean Squared Error alternative:
```
True: [1, 0, 0]
Pred: [0.7, 0.2, 0.1]

MSE = ((0.7-1)² + (0.2-0)² + (0.1-0)²) / 3
    = (0.09 + 0.04 + 0.01) / 3
    = 0.047

Pred: [0.01, 0.49, 0.49]  (wrong!)
MSE = ((0.01-1)² + (0.49-0)² + (0.49-0)²) / 3
    = (0.98 + 0.24 + 0.24) / 3
    = 0.487

Cross-entropy for second case:
Loss = -log(0.01) = 4.6  ← SEVERE PENALTY!

Cross-entropy punishes confident wrong predictions much harder.
For classification, this is crucial!
```

**Why Cross-Entropy Is Critical:**

```
LLM training needs to:
✓ Heavily penalize predicting wrong tokens
✓ Especially when it's confident
✓ Gently reward correct predictions
✓ Have smooth gradient for optimization

Cross-entropy does all of this!
Log function has nice derivatives for gradient descent.
```

**Scaling to LLMs:**

```
Training corpus: 300B tokens
Each token: Compute cross-entropy loss
Average loss across all tokens = training loss

Gradient descent: Update weights to minimize this loss
After 1M iterations: Loss converges (model learns)

At test time: Model outputs probabilities (softmax)
These probabilities are trained by minimizing cross-entropy!
```

**Answer for Interview (2.5 minutes):**

"Cross-entropy loss is the foundation of LLM training. Given the true next token (one-hot encoded) and the model's predicted probability distribution, cross-entropy measures how 'surprised' the model is. The formula is -log(p_correct), so if the model confidently predicts the wrong token, it gets heavily penalized. This is crucial: we want the model to be very confident about correct predictions and uncertain about wrong ones. MSE provides softer penalties and doesn't work well for classification. Cross-entropy also has nice mathematical properties for gradient descent, making it stable to optimize. In practice, you compute cross-entropy loss for every token in the training data, average it, and gradient descent updates weights to minimize this loss. That's literally how LLMs learn language."

---

### Q7: What is perplexity and why is it the standard LLM evaluation metric?

**Define:**
Perplexity = e^(average cross-entropy loss). It represents "how many equally likely tokens could come next?"

**Formula:**
```
Perplexity = e^(average_loss)
           = e^(-Σ log(p_correct_token) / num_tokens)
```

**Intuition:**

```
Perplexity = 50?
Equivalent to uniform distribution over 50 tokens.
On average, you need to consider 50 equally likely options.

Perplexity = 5?
Equivalent to 5 equally likely options.
Model is more confident (fewer plausible next tokens).

Lower perplexity = model more confident = better!
```

**Examples:**

```
Text: "The quick brown fox jumps over the"
True next: "lazy"

Model 1:
P(lazy) = 0.8
Cross-entropy = -log(0.8) = 0.223
Perplexity = e^0.223 = 1.25

Interpretation: Model thinks only ~1.25 tokens are plausible
(Very confident it's "lazy")

Model 2:
P(lazy) = 0.02 (bad!)
Cross-entropy = -log(0.02) = 3.912
Perplexity = e^3.912 = 50

Interpretation: ~50 equally likely tokens
(Model is confused, very uncertain)

Model 1 is much better!
```

**Perplexity Benchmarks:**

```
Random model (choose uniformly): Perplexity ≈ 50K (vocab size)
Basic n-gram: Perplexity ≈ 100
Fine-tuned transformer: Perplexity ≈ 20-50
GPT-3 on test set: Perplexity ≈ 15-25
State-of-art systems: Perplexity ≈ 10-15

Lower = better!
Perplexity 20 means "on average, only 20 tokens seem plausible"
Perplexity 50 means "model is confused, 50 options seem equally likely"
```

**Why Perplexity Instead of Accuracy?**

```
Accuracy: "Did you predict the exact right token?"
Problem: Ignores near-misses
- Predicting "wonderful" when "great" is correct: 0% accuracy
- But these are very similar! Should get partial credit

Perplexity: "How confident was your probability?"
Advantage: Scores continuous probability
- Predicting P(correct)=0.95: Low perplexity (good!)
- Predicting P(correct)=0.05: High perplexity (bad)
- Predicting P(correct)=0.50: Medium perplexity (okay)
```

**Answer for Interview (2.5 minutes):**

"Perplexity is the standard LLM evaluation metric because it measures how confident the model is about correct predictions. Mathematically, perplexity is e raised to the average cross-entropy loss. Intuitively, it answers: how many equally likely tokens does the model think could come next? Perplexity 50 means the model thinks ~50 tokens are equally plausible; perplexity 5 means only ~5 tokens are plausible. Lower perplexity is better. We use perplexity instead of accuracy because it's more nuanced — on a hard problem, getting 40% with high confidence is actually worse than getting 40% with uncertainty distributed across many options. Typical good LLMs have test perplexity around 20-40. When fine-tuning, you watch perplexity decrease as training progresses, ensuring the model is learning."

---

## Category 4: Optimization & Training

### Q8: Explain gradient descent and why the learning rate is critical for training stability.

**Define:**
Gradient descent is an iterative algorithm that updates model parameters in the direction that reduces loss. Learning rate controls the step size.

**Core Algorithm:**

```
Repeat:
1. Compute gradient: ∇Loss (derivative of loss w.r.t. each parameter)
2. Update: W_new = W_old - learning_rate × ∇Loss
           ↑ Subtract because we want to reduce loss
3. Until convergence (loss stops decreasing)
```

**Visual:**

```
Loss landscape (1 parameter, for visualization):

Loss
  |     ╱╲
  |    ╱  ╲
  |   ╱    ╲
  |__╱______╲___
  W: ●      

Goal: Move left to reach minimum

Gradient at ● points right (uphill)
Negative gradient points left (downhill) ← Direction to go!
```

**Learning Rate: The Goldilocks Problem**

```
Too small (lr = 0.00001):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 9.999
Iteration 3: Loss = 9.998
...
Need 1,000,000 iterations to converge
Problem: Takes forever! ❌
```

```
Too large (lr = 0.1):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 50.0  ← Jumped way too far!
Iteration 3: Loss = 200.0 ← Diverging!
...
Problem: Diverges, gets worse! ❌
```

```
Just right (lr = 0.001):
Iteration 1: Loss = 10.0
Iteration 2: Loss = 5.0
Iteration 3: Loss = 2.5
Iteration 4: Loss = 1.2
...
Converges smoothly in ~100 iterations ✓
```

**Why Critical for LLMs:**

```
Pre-trained model (from 1T token training):
All 7B weights are finely tuned to English

Fine-tuning goal: Adapt slightly, don't break

High learning rate (0.1):
W_new = W + 0.1 × ∇Loss
"Change weights a lot!"
Result: Forget pre-training (catastrophic forgetting) ❌

Low learning rate (0.00001):
W_new = W + 0.00001 × ∇Loss
"Change weights barely"
Result: Don't adapt to new domain ❌

Perfect balance (0.00005 for LoRA):
Adapt to domain, preserve pre-training ✓
```

**Pratical Recommendations:**

```
LoRA fine-tuning: 0.0001 to 0.0005
Full fine-tuning: 0.00001 to 0.00005
Pre-training: 0.0001 to 0.001 (usually with warmup + decay)

General principle:
Fine-tuning << Pre-training learning rates
(Don't want large changes to pre-trained weights)
```

**Answer for Interview (2.5 minutes):**

"Gradient descent is optimization: compute the gradient (derivative) of loss, and take a small step opposite the gradient direction. The learning rate controls step size. Too small and training takes forever; too large and it diverges. For LLMs, this is critical during fine-tuning: pre-trained weights are valuable, so you need a small learning rate (like 0.0001) to adapt without forgetting. Common mistake is using learning rates from pre-training for fine-tuning — that's way too high. In practice, you might use a schedule (start high, decay over time) or even use adaptive optimizers like Adam that automatically adjust per-parameter. But the fundamental tension remains: fast adaptation vs. preserving pre-training."

---

## Integration Question: Design Math For a Complete ML Pipeline

### Q9: You're building a recommendation system using embeddings, LoRA fine-tuning, and RLHF alignment. Explain the math connecting all components.

**System Architecture:**

```
User preference data → Embedding vectors
                     → LoRA fine-tuning
                     → Cross-entropy loss minimization
                     → RLHF alignment
                     → KL divergence regularization
                     → Final model
```

**Component 1: Embeddings (Linear Algebra)**

```
Input: User history [item1, item2, ...], item attributes
Embedding model: Maps to 768-dimensional space

Math:
├─ Each item i → embedding v_i (768 dims)
├─ User preference → weighted sum of item embeddings
├─ New recommendation: nearest neighbor in embedding space
└─ Use cosine similarity for ranking

Why:
Similar items (in same context) → similar embeddings
Users like items → recommend similar items
```

**Component 2: LoRA Fine-tuning (Linear Algebra + Optimization)**

```
Base model: Pre-trained on general items (movies, books, etc.)
Goal: Adapt to domain (e.g., musical instruments)

LoRA decomposition:
├─ Don't update full W (too expensive)
├─ Instead, update small A (d × 8) and B (8 × d)
├─ Final: W + A×B (adds low-rank update)
└─ 99% fewer parameters!

Training:
├─ Forward: compute output using W + A×B
├─ Loss: cross-entropy on user preferences
├─ Backward: gradient descent updates A and B
└─ Learning rate: 0.0005 (careful, don't break base model!)
```

**Component 3: Training Loss (Information Theory + Optimization)**

```
User sees item, rates it: 1-5 stars
Convert to probability: P(user_likes) based on rating

Training objective (cross-entropy):
Loss = -log(P(predicted_preference))

Example:
User rates item 5 stars (loves it)
True distribution: P(love) = 1.0, P(hate) = 0.0

Model predicts: P(love) = 0.7, P(hate) = 0.3
Loss = -log(0.7) = 0.357

Model predicts: P(love) = 0.95, P(hate) = 0.05
Loss = -log(0.95) = 0.051

Better predictions → lower loss!
Training minimizes this over all user-item pairs.
```

**Component 4: RLHF Alignment (Probability + Information Theory)**

```
Humans rate recommendations:
"Did you like these suggestions?" → Yes / No

Train reward model:
├─ Input: user history + recommendations
├─ Output: P(good recommendation)
└─ Train with cross-entropy loss

Apply reward to LoRA training:
New loss = Recommendation_loss - β × KL(original_model || new_model)
           ↑ What it was optimizing       ↑ Don't drift far from base

Why KL divergence?
├─ Original model (pre-trained): Knows English + general preferences
├─ New model (fine-tuned): Domain-specific recommendations
├─ KL(orig || new) = "How far did we drift?"
└─ High β = conservative (stay close), Low β = aggressive (adapt fast)

Typical β = 0.1 (gentle penalty)
```

**Component 5: Perplexity Evaluation (Information Theory)**

```
Test on held-out user ratings:
├─ For each user-item pair: compute P(actual_rating)
├─ Average cross-entropy loss over test set
├─ Perplexity = e^(average loss)

Interpretation:
├─ Perplexity 20 = Model thinks ~20 items equally likely
├─ Perplexity 100 = Model confused, many items seem likely
└─ Goal: Minimize perplexity on test set
```

**Putting It Together:**

```
1. User history → Embeddings (linear algebra: cosine similarity)
2. Embeddings → LoRA fine-tuning (linear algebra + optimization)
3. Training: Minimize cross-entropy (information theory + calculus)
4. RLHF: Add KL penalty to stay close to original (KL divergence)
5. Optimize: Gradient descent on the combined loss (calculus)
6. Evaluate: Measure perplexity on test set (information theory)

Math Stack:
├─ Linear algebra: Embeddings, LoRA decomposition
├─ Calculus: Gradient descent, chain rule (backprop)
├─ Probability: Softmax, cross-entropy, perplexity
├─ Information theory: KL divergence, entropy
└─ All connected through optimization!
```

**Complete Loss Function:**

```
Total_loss = Cross_entropy_loss + 0.1 × KL_divergence + Regularization

Where:
├─ Cross_entropy: Make recommendations match user preferences
├─ KL divergence: Keep recommendations general (don't overfit)
├─ Regularization: Prevent overfitting (L2 norm of LoRA matrices)

Gradient descent:
∂Loss/∂A, ∂Loss/∂B = (via chain rule and backprop)
Update A, B accordingly

Repeat until perplexity converges
```

---

## Summary: Math in LLMs

| Domain | Core Concept | LLM Application |
|--------|--------------|-----------------|
| Linear Algebra | Dot product, cosine similarity | Embedding search |
| Linear Algebra | Low-rank decomposition | LoRA fine-tuning |
| Probability | Softmax | Convert logits to probabilities |
| Information Theory | Cross-entropy loss | Training objective |
| Information Theory | KL divergence | RLHF, fine-tuning penalty |
| Information Theory | Perplexity | Evaluation metric |
| Calculus | Gradient descent | Parameter updates |
| Calculus | Chain rule | Backpropagation |

**The Grand Unification:**

An LLM is fundamentally an optimization problem. You start with random weights, define a loss function (cross-entropy), and use calculus (gradient descent) to find better weights. The weights are organized as matrices (linear algebra), updated through low-rank approximations (LoRA). Probabilities come from softmax. Evaluation uses perplexity (information theory). Alignment uses KL divergence (information theory). Every component is math; none is magic.
