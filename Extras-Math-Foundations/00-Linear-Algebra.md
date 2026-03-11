# Linear Algebra for LLMs: The Silent Foundation

**Why This Matters First:** Every embedding you've seen, every vector database query, every attention mechanism — it's all linear algebra. This is the bedrock.

---

## 1. Vectors: How to Represent Meaning

### What is a Vector in LLM Context?

A vector is a list of numbers representing meaning.

```
Text: "cat"
↓
Vector (embeddings): [-0.2, 0.5, -0.1, 0.8, ...]
                      ↑     ↑     ↑     ↑
                      dim1  dim2  dim3  dim4

What each dimension captures is mysterious,
but collectively they encode semantic meaning.
```

Real example from OpenAI embeddings (1536 dimensions):
```
"cat" → [-0.0012, 0.0034, -0.0089, ... (1534 more numbers)]
"dog" → [-0.0011, 0.0031, -0.0085, ... (1534 more numbers)]
           ↑        ↑       ↑
           Similar! Similar! Similar!
```

**Key insight:** Similar meanings = similar vectors.

### Vector Properties You'll Use

**Magnitude (Length):**
```
Vector: [3, 4]
Magnitude: √(3² + 4²) = √(9 + 16) = 5

Why it matters for LLMs:
- Normalized vectors have magnitude 1
- Makes similarity comparison fair
- "the dog" and "the CAT" (different lengths) 
  shouldn't have different similarity just because 
  of word length
```

**Direction:**
```
[3, 4] and [6, 8] point in same direction
but different magnitudes.

Normalized (direction only):
[3, 4] / 5 = [0.6, 0.8]
[6, 8] / 10 = [0.6, 0.8]
              ↑ Same direction!
```

Real-world: Two sentences with same meaning should point the same direction, even if different lengths.

---

## 2. Dot Product: The Core of Similarity Search

### What Is Dot Product?

Multiply corresponding elements, sum them.

```
Vector A: [1, 2, 3]
Vector B: [4, 5, 6]

Dot product = (1×4) + (2×5) + (3×6)
            = 4 + 10 + 18
            = 32
```

### How LLMs Use It: Embedding Search

```
User query: "fast cars"
Query embedding: [0.1, 0.8, -0.2]

Document 1: "rapid vehicles"
Doc embedding: [0.15, 0.75, -0.25]

Dot product = (0.1×0.15) + (0.8×0.75) + (-0.2×-0.25)
            = 0.015 + 0.6 + 0.05
            = 0.665 ← Similarity score!

Document 2: "slow animals"
Doc embedding: [-0.2, -0.1, 0.9]

Dot product = (0.1×-0.2) + (0.8×-0.1) + (-0.2×0.9)
            = -0.02 - 0.08 - 0.18
            = -0.28 ← Low score, not similar
```

**The practical magic:** Higher dot product = more similar.

### Cosine Similarity (Dot Product Normalized)

Problem with raw dot product: It depends on vector magnitude.

```
Vector A: [1, 1]     (magnitude √2)
Vector B: [2, 2]     (magnitude 2√2, same direction!)

Dot product A·B = (1×2) + (1×2) = 4
Dot product A·A = (1×1) + (1×1) = 2
Dot product B·B = (2×2) + (2×2) = 8

Cosine similarity = A·B / (|A| × |B|)
                  = 4 / (√2 × 2√2)
                  = 4 / 4
                  = 1.0 ← Perfect similarity!
```

**Real LLM application:**
```
Query: "dog"
Vector: [0.02, -0.15, 0.08]  (short)

Doc 1: "dogs are animals" 
Vector: [0.04, -0.30, 0.16]  (longer, same direction)

Cosine similarity: 1.0 ← Still max! ✓

Raw dot product would be lower due to length difference ✗
```

**In Vector DBs:**
```
Every retrieval query uses cosine similarity:
1. User query → embedding
2. Compute cosine similarity vs all docs
3. Return top K closest (highest similarity)
4. This is powered by dot product!
```

---

## 3. Matrix Multiplication: How Neural Networks Work

### Basic Concept

Matrix = Grid of numbers.

```
Matrix A (2×3):      Matrix B (3×2):
[1  2  3]            [4  5]
[6  7  8]            [9  10]
                     [11 12]

Multiply A × B (2×3 × 3×2 = 2×2 result):

Result[0,0] = (1×4) + (2×9) + (3×11) = 4 + 18 + 33 = 55
Result[0,1] = (1×5) + (2×10) + (3×12) = 5 + 20 + 36 = 61
Result[1,0] = (6×4) + (7×9) + (8×11) = 24 + 63 + 88 = 175
Result[1,1] = (6×5) + (7×10) + (8×12) = 30 + 70 + 96 = 196

Result:
[55   61]
[175  196]
```

### Why This Is EVERYTHING in LLMs

Every layer in a transformer is matrix multiplication:

```
Input tokens: [1, 0, 0, 1, 1]  (5 tokens)
Weight matrix W: 768×768

Output = Input × W
       = [1, 0, 0, 1, 1] × W
       = New vector (transformed representation)

This repeats 12 times (12 layers in GPT-2):
token vectors → multiply by W1 → ReLU → 
multiply by W2 → multiply by W3 ... → final output
```

### Attention Is Matrix Multiplication

Query, Key, Value matrices:

```
Input: [token1_vector, token2_vector, token3_vector]
Query matrix Q:    (hidden_dim × hidden_dim)
Key matrix K:      (hidden_dim × hidden_dim)
Value matrix V:    (hidden_dim × hidden_dim)

Query vectors: Input × Q
Key vectors:   Input × K
Value vectors: Input × V

Attention = softmax(Query · Key^T / sqrt(dim)) × Value
            ↑ This is all matrix multiplication!
```

**Concrete:**
```
If query·key gives high value → "pay attention to this token"
Attention(query, key, value) = weighted sum of values
where weights come from query·key similarity
```

---

## 4. Low-Rank Decomposition: This IS LoRA

### The Problem: Full Fine-Tuning Is Expensive

Pretrained model: 7B parameters (7 billion numbers to update)
```
Weight matrix W: 4096 × 4096
Full update: Need to store and update all 16M numbers
Memory: 16M × 4 bytes = 64 MB per layer
Model has 100+ layers → 6+ GB of memory needed
```

### The Solution: Low-Rank Approximation

Instead of updating W directly, approximate update as:
```
ΔW ≈ A × B

Where:
A: 4096 × r  (r is small, like 8)
B: r × 4096

Total new params: (4096×8) + (8×4096) = 65,536
Original params: 16,777,216

Reduction: 99.6% fewer parameters! ✓
```

### Why This Works: Low-Rank Assumption

Most real-world matrices don't need full rank to represent them well.

```
Full rank matrix:    Low-rank approximation:
[100  200]           [1  2]   [100  5]
[300  400]    ≈      [3  4] × [6    7]
              ↑ This is fine-grained
              Low rank captures the pattern with 
              fewer numbers
```

**Empirical observation:** LoRA works because the "important" updates to a language model are actually low-rank. The model doesn't need to change every dimension equally.

### LoRA in Practice

Fine-tuning on new domain (medical):

```
Original: Output = x × W

With LoRA: Output = x × W + x × A × B
                    ↑ frozen   ↑ fine-tune these

You only train A and B (0.01% of parameters),
but get 95% of full fine-tuning performance!

Training: 4GB memory (vs 24GB for full)
Time: 1 hour (vs 4 hours for full)
Performance: 98% as good
```

---

## 5. Eigenvalues & PCA: Dimensionality Reduction

### The Problem: 1536 Dimensions Are Too Many

LLM embeddings: 1536 dimensions (OpenAI)
Visualize in 2D: Impossible (need to reduce)

```
High-dim space          Reduce to 2D
(1536 dims)             (PCA)
   •                      •
  • •              →         •
 •   •                    •       •
• • • •                 •   •  •
```

### PCA: Principal Component Analysis

Find the directions where data varies most.

```
Original data scattered in 1536 dimensions.
Find: Top 2 directions (eigenvectors) where data spreads most.
Project all points onto these 2 directions.

You lose info but retain 95% of variance.
```

**Why:**
- First eigenvector: Direction of maximum spread
- Second eigenvector: Perpendicular direction, second-most spread
- Rest: Less important

Eigenvalues tell you: "How much variance does this dimension capture?"

### LLM Application: Embedding Visualization

```
GPT-3 embeddings (1536D) 
        ↓ PCA to 2D
        ↓
Scatter plot shows clusters:
- All animals cluster together
- All foods cluster together
- All verbs cluster together

Without PCA: Can't visualize at all!
```

---

## Summary: Why Linear Algebra Is LLM Bedrock

| Concept | LLM Use |
|---------|---------|
| Vectors | Represent text meaning |
| Dot product | Similarity search scoring |
| Cosine similarity | Normalize similarity (0-1 scale) |
| Matrix multiplication | Every network layer & attention |
| Low-rank decomposition | LoRA fine-tuning (99% memory savings) |
| Eigenvalues/PCA | Visualize embeddings, reduce dims |

**One sentence:** LLMs are applied linear algebra. Master this, understand LLMs.
