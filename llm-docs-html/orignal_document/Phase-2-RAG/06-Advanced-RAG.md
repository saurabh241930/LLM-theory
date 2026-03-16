# 06. Advanced RAG

## Problem with Naive RAG

Naive RAG fails when:
1. **Query is ambiguous** → embedding misses intent
2. **Answer needs multiple pieces** → one retrieval not enough
3. **Retrieved chunks low quality** → LLM can't answer from garbage

Advanced RAG fixes these.

---

## Technique 1: Query Rewriting

**Problem:** User query is vague/ambiguous.

```
User: "What's the timeline?"
Problem: Unclear! Timeline for what?
Embedding: Generic direction [0.1, 0.2, ...]
Retrieved: Random timeline-related chunks ❌
```

**Solution:** Rewrite query to be more specific.

```
LLM rewrites:
"What's the timeline?" → 
  "What is the project timeline for the Q3 release?"

Rewritten embedding: [0.8, 0.5, ...] (specific direction)
Retrieved: Chunks about Q3 release timeline ✅
```

### How it works

```
User Query
    ↓
[LLM Rewrite Module]
    "Clarify what this question is asking"
    ↓
Rewritten Query(ies)
    ├─ Query 1: "What is project Q3 timeline?"
    ├─ Query 2: "What are Q3 milestones?"
    └─ Query 3: "When is Q3 release scheduled?"
    ↓
[Search Each]
    ├─ Search 1 → chunks about timeline
    ├─ Search 2 → chunks about milestones
    └─ Search 3 → chunks about release date
    ↓
[Combine & Deduplicate]
    ↓
Final Context (high quality)
```

**Pros:**
- ✅ Handles ambiguous queries
- ✅ Captures multi-faceted questions

**Cons:**
- More LLM calls (slower)
- Can over-generate rewrites if not controlled

---

## Technique 2: HyDE (Hypothetical Document Embedding)

**Problem:** Query is too short to embed well.

```
Query: "return policy"
Embedding space might be sparse, matches poorly

What if we generated a hypothetical answer first, then embedded that?
```

**Solution:** Generate a fake document, embed that instead.

```
Step 1: Generate hypothetical answer
  LLM: "Given query 'return policy', write a sample answer"
  Output: "Our return policy allows 30 days for returns. 
           Refunds are processed within 5-7 days. 
           Original packaging required..."

Step 2: Embed the hypothetical document
  Embedding: [0.8, 0.3, ...] more informative!

Step 3: Search using this embedding
  Retrieved: Chunks about return policies ✅
```

### Why it works

```
Original query embedding: [0.5, 0.2, 0.1]  (too sparse)
Hypothetical doc embedding: [0.95, 0.8, 0.7]  (dense, informative)

Dense embedding matches better ✅
```

---

## Technique 3: Hybrid Search

**Problem:** Embedding similarity alone misses keyword matches.

```
Query: "CEO salary in company X"

Dense search (embedding):
  Finds: Articles about compensation ✅
  Misses: "CEO" exact mention in docs

Sparse search (keyword):
  Finds: Exact "CEO" mentions ✅
  Misses: Semantic variations like "chief executive pay"
```

**Solution:** Use both dense + sparse, combine results.

```
┌──────────────────────────────────────────────────────┐
│  Hybrid Search Pipeline                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Query: "CEO salary"                                │
│                                                      │
│  ┌─ Dense Search (embedding)                        │
│  │    Embed query → find similar chunks             │
│  │    Results: [chunk_A (0.92), chunk_B (0.85)]    │
│  │                                                   │
│  ├─ Sparse Search (BM25 keyword)                    │
│  │    Split to keywords: ["CEO", "salary"]          │
│  │    Find matching chunks                          │
│  │    Results: [chunk_C (BM25=0.8), chunk_A (0.6)] │
│  │                                                   │
│  └─ Combine (RRF = Reciprocal Rank Fusion)          │
│       Rank 1: chunk_A (in both searches)            │
│       Rank 2: chunk_B (dense only)                  │
│       Rank 3: chunk_C (sparse only)                 │
│       Final: [A, B, C]                              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### BM25 (Sparse Search)

BM25 is standard **keyword matching** in retrieval.

```
Score = keyword relevance based on:
  1. How many times keyword appears (TF)
  2. How rare the keyword is (IDF)
  3. Document length (normalization)

Formula (simplified):
  score = Σ(word_frequency × importance) / (1 + doc_length)

Where importance = log(total_docs / docs_with_keyword)
```

**Example:**
```
Query: "machine learning"
Doc A: "machine learning is powerful"  (2 matches)
Doc B: "neural networks and AI"         (0 matches)

BM25(A) > BM25(B)

If "machine" is rare: higher weight ↑
If "learning" is common: lower weight ↓
```

---

## Combining Dense + Sparse

### Method 1: Reciprocal Rank Fusion (RRF)

```
Dense Ranking:     Sparse Ranking:
1. chunk_A (0.95)  1. chunk_C (0.8)
2. chunk_B (0.85)  2. chunk_A (0.7)
3. chunk_D (0.75)  3. chunk_B (0.6)

RRF Formula:
  score = 1/(k + rank_dense) + 1/(k + rank_sparse)
  where k=60 (constant)

Final scores:
  chunk_A: 1/61 + 1/62 = 0.033   ← Top!
  chunk_C: 1/100 + 1/61 = 0.026
  chunk_B: 1/62 + 1/63 = 0.032
  
Final ranking: [A, B, C, D]
```

### Method 2: Weighted Combination

```
score = α × dense_score + (1-α) × sparse_score

where α = 0.5 (equal weight) or tuned

Example:
  chunk_A: 0.5 × 0.95 + 0.5 × 0.7 = 0.825
  chunk_C: 0.5 × 0.5 + 0.5 × 0.8 = 0.65  (only keyword match)
  
Final ranking: [A, C]
```

---

## Full Advanced RAG Pipeline

```
User Query: "Compare Q3 and Q4 earnings"

STEP 1: QUERY REWRITING
  LLM rewrite check:
  Original: "Compare Q3 and Q4 earnings"
  Rewritten: [
    "What were Q3 earnings?",
    "What were Q4 earnings?",
    "How did earnings change from Q3 to Q4?"
  ]

STEP 2: MULTI-QUERY RETRIEVAL
  For each rewritten query:
    ├─ Embed query (dense search)
    ├─ Keyword search (sparse/BM25)
    ├─ Combine (RRF)
    └─ Get top-5 chunks
  
  Result: 15 chunks (5 × 3 queries)

STEP 3: DEDUPLICATION
  Remove duplicate chunks
  Result: 10 unique chunks

STEP 4: RERANKING (optional)
  Use cross-encoder to score relevance
  Final: Top-5 chunks

STEP 5: GENERATE ANSWER
  Prompt: "Compare Q3 and Q4 based on:
           {top_5_chunks}
           
           Q: Compare Q3 and Q4 earnings"
  
  LLM: "Q3 earnings were $X, Q4 earnings were $Y,
         representing a Z% increase"
```

---

## Common Advanced Techniques

### Semantic Caching
Store previous queries + answers.
```
User asks: "What's return policy?" → cache
User asks: "Return policy" (similar) → retrieve from cache ✅
Skip embedding + retrieval
```

### Query Expansion
Generate related keywords.
```
Query: "CEO compensation"
Expanded: ["CEO pay", "executive salary", "chief executive earnings", ...]
Search all → get diverse results
```

### Metadata Filtering
Use document metadata to pre-filter.
```
Retrieved top-100 by similarity
Filter by: date > 2024, source = "official"
Result: top-20 from filtered set
```

---

## When to Use What

| Technique | Problem Solves | Cost | Complexity |
|---|---|---|---|
| Query Rewriting | Ambiguous queries | Medium (1 LLM call) | Low |
| HyDE | Short queries | Medium (1 LLM call) | Low |
| Hybrid Search | Keyword relevance | Low (just BM25) | Low |
| Multi-Query | Multi-faceted questions | High (K×LLM calls) | Medium |
| Metadata Filtering | Unwanted results | Low | Low |
| Semantic Caching | Repeated queries | Low | Medium |

---

## Decision Tree

```
Is query ambiguous?
  ├─ YES → Add query rewriting
  └─ NO → Continue

Does query need multiple pieces of info?
  ├─ YES → Add multi-query retrieval
  └─ NO → Continue

Query is very short (1-2 words)?
  ├─ YES → Add HyDE
  └─ NO → Continue

Need keyword matching too?
  ├─ YES → Add hybrid search (dense + sparse)
  └─ NO → Continue

Retrieved chunks often irrelevant?
  ├─ YES → Add reranking
  └─ NO → Done!

Filter by date/source?
  ├─ YES → Add metadata filtering
  └─ NO → Done!
```

---

## Key Takeaways

✅ **Query Rewriting** — clarify ambiguous queries before embedding

✅ **HyDE** — generate hypothetical documents to embed (better than short queries)

✅ **Hybrid Search** — combine dense (embeddings) + sparse (keywords/BM25)

✅ **Multi-Query** — rewrite complex questions into multiple searches

✅ **Combine results** using reciprocal rank fusion (RRF)

✅ **Advanced RAG handles:** ambiguity, complex questions, keyword matching, caching

✅ Start simple (naive RAG), add techniques as needed

**Next:** Use cross-encoders to validate retrieved chunks → Reranking
