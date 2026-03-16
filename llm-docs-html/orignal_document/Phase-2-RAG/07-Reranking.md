# 07. Reranking

## The Problem with Vector Similarity Alone

Vector similarity (cosine) is **fast but noisy**.

```
Query: "How do I return a defective product?"

Retrieved by cosine similarity:
  Chunk 1: "How to return items" (0.95)
  Chunk 2: "Product defect warranty policy" (0.92)
  Chunk 3: "Shipping returns" (0.88)
  Chunk 4: "What does defective mean?" (0.85)

Problem: Chunk 2 is actually most relevant (explicitly about defects)
But ranked 2nd because "return" word appears in chunk 1.

Cosine ignores query-document relationship.
```

**Solution:** Use a **reranker** to re-score chunks considering query + chunk together.

---

## What is a Reranker?

A reranker is a neural network trained to **judge relevance** of query-chunk pairs.

```
┌─────────────────────────────────────────┐
│  Embedding Model (Fast, Coarse)        │
├─────────────────────────────────────────┤
│ Input: Query          → [0.6, 0.2, ...]  │
│ Input: Chunk          → [0.5, 0.3, ...]  │
│ Operation: Cosine similarity             │
│ Output: Score (0-1)    → 0.85             │
│                                          │
│ Time: O(1)  |  Quality: ⭐⭐ Medium     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Reranker Model (Slow, Fine-grained)   │
├─────────────────────────────────────────┤
│ Input: Query "How to return defective?" │
│ Input: Chunk "Policy on defect returns" │
│ Operation: Read both, understand        │
│ Output: Relevance score        → 0.98   │
│                                          │
│ Time: O(length)  |  Quality: ⭐⭐⭐ High │
└─────────────────────────────────────────┘
```

---

## Two-Stage Retrieval Workflow

```
┌──────────────────────────────────────────────────────────┐
│  Two-Stage RAG                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  STAGE 1: FAST RETRIEVAL (Embedding)                   │
│  ├── User query: "return defective product"            │
│  ├── Embed query: [0.6, 0.2, ...]                      │
│  ├── Search vector DB: cosine similarity               │
│  └── Retrieve TOP-100 chunks (fast, noisy)             │
│                                                          │
│  STAGE 2: FINE-GRAINED RERANKING (Reranker)           │
│  ├── Input: query + top-100 chunks                     │
│  ├── Reranker scores each: 0.98, 0.92, 0.85, ...      │
│  ├── Sort by reranker score                           │
│  └── Return TOP-5 chunks (slow, high quality)         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## How Rerankers Work (Internally)

Rerankers are **cross-encoders**: they read query AND chunk together.

```
Cross-Encoder Architecture:

Input:  [CLS] query tokens [SEP] chunk tokens [SEP]
         ↓
    [BERT-like model]
         ↓
Output: Relevance score (0-1)

Example:
[CLS] How return defective product [SEP] 
      Defective items can be returned within 30 days [SEP]

↓ Through BERT ↓

Output: 0.98 (highly relevant!)
```

---

## Popular Rerankers

| Model | Provider | Speed | Quality | Cost |
|---|---|---|---|---|
| **Cohere Rerank** | Cohere | Medium | ⭐⭐⭐ Excellent | $$ API |
| **BGE Reranker** | BAAI | Fast | ⭐⭐⭐ Great | $ Open-source |
| **mmaraco-reranker** | Facebook | Medium | ⭐⭐⭐ Great | $ Open-source |
| **RankFusion** | Custom | Fast | ⭐⭐ Medium | $ Open-source |

### Example: Cohere Rerank API

```python
from cohere import Client

co = Client(api_key='...')

results = co.rerank(
    model="rerank-english-v2.0",
    query="How do I return a defective product?",
    documents=[
        {"text": "How to return items..."},
        {"text": "Product defect warranty policy..."},
        {"text": "Shipping returns..."},
        ...
    ],
    top_n=5  # Return top-5 after reranking
)

# Output:
# Rank 1: "Product defect warranty policy..." (0.98)
# Rank 2: "How to return items..." (0.95)
# Rank 3: "Warranty claims process..." (0.88)
# ...
```

---

## Reranking vs Embedding: Trade-offs

```
Embedding (Initial Retrieval)
├─ Speed: ⚡⚡⚡ Very fast (100 docs in <1ms)
├─ Accuracy: ⭐⭐ Medium
├─ Cost: Low (pre-computed)
└─ Use for: Coarse filtering

Reranking (Fine Tuning)
├─ Speed: ⚡ Slower (100 docs in 500ms)
├─ Accuracy: ⭐⭐⭐ High
├─ Cost: High (API calls or compute)
└─ Use for: Top-k precision
```

---

## Two-Stage Pipeline (Recommended)

```
Stage 1: Embedding (Fast, Coarse)
├─ Retrieve top-100 with vector similarity
├─ Cost: ~$0.0001 per query
└─ Time: 10ms

Stage 2: Reranking (Slow, Precise)
├─ Rerank top-100 with cross-encoder
├─ Cost: ~$0.001 per query
└─ Time: 500ms

Total Latency: ~510ms ✓
Total Cost: ~$0.0011 per query (very cheap!)
Final Accuracy: ⭐⭐⭐ High

Alternative: Just rerank all 1M documents ❌
├─ Would need to score 1M chunks
├─ Cost: ~$10 per query ❌
└─ Time: 1000s of seconds ❌
```

---

## When to Add Reranking

```
Question: "Do I need reranking?"

Does embedding retrieval often return irrelevant chunks?
  ├─ NO  → Skip reranking (not needed)
  └─ YES → Add reranking ✓

Is latency critical (< 100ms)?
  ├─ YES → Skip reranking (too slow)
  └─ NO  → Can afford reranking ✓

Is accuracy critical (legal, medical, financial)?
  ├─ YES → Add reranking ✓
  └─ NO  → Embedding might be enough

Budget for API calls?
  ├─ YES → Use Cohere Rerank (simple)
  └─ NO  → Use BGE Reranker locally (free)
```

---

## End-to-End Example: Customer Support Bot

```
SCENARIO: Customer asks "How do I return a defective product?"

STAGE 1: RETRIEVAL (Embedding)
├─ Embed query
├─ Search vector DB → retrieve top-20 chunks
└─ Retrieved (sorted by cosine):
   1. "How to return items..." (0.92)
   2. "Defect warranty..." (0.88)
   3. "Shipping cost..." (0.85)
   4. "Return address..." (0.84)
   5. ...

STAGE 2: RERANKING
├─ Input all 20 chunks to reranker
└─ Reranked (sorted by relevance):
   1. "Defect warranty + return process..." (0.98)
   2. "How to return items..." (0.95)
   3. "Return address..." (0.87)
   4. "Return shipping cost..." (0.82)
   5. ...

STAGE 3: GENERATION
├─ Use top-3 reranked chunks
├─ Prompt: "Given these docs, answer: How do I return 
   a defective product?"
└─ LLM: "1. Check if product is defective (within warranty)
          2. Contact customer service
          3. Send back with prepaid label
          4. Receive replacement or refund"

RESULT: ✅ Answer is accurate and specific!
```

---

## Reranking Pitfalls

❌ **Not using reranking when data is noisy**
- Retrieved chunks are borderline relevant
- Cosine score alone misses true matches
- → Add reranking for better quality

❌ **Reranking too many chunks**
- Reranking 1000 chunks = 1000 cross-encoder passes = slow/expensive
- → Only rerank top-k from embedding (e.g., top-100)

❌ **Using reranker with bad initial retrieval**
- If embedding retrieves wrong chunks, reranker can't fix it
- Garbage in, garbage out
- → Fix embedding retrieval first, then add reranker

❌ **Over-relying on reranker**
- Reranker is only as good as its training data
- Domain-specific queries might have poor reranker
- → Test reranker quality on your domain first

---

## Key Takeaways

✅ **Vector similarity is fast but coarse** — misses relevant chunks ranked low

✅ **Rerankers (cross-encoders) read query + chunk together** — accurate but slow

✅ **Two-stage: Embedding (fast, coarse) → Reranking (slow, precise)**

✅ **Rerank top-k chunks only** (e.g., top-100) not all documents

✅ **Cost-effective:** ~$0.001 per query for top-quality results

✅ **Use when:** Accuracy matters, latency allows, budget available

✅ **Skip when:** Latency critical (<100ms) or embedding already good

**Next:** Measure RAG quality with metrics → RAG Evaluation
