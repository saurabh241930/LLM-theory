# 01. Embeddings & Vector Search

## What is an Embedding?

An embedding is a dense numerical representation of meaning.

```
Raw Text                      →  Embedding                      →  Vector Space
"The cat sat on the mat"        [0.21, -0.45, 0.89, ..., 0.12]    points in space
```

Instead of storing raw text, we store numbers. Each position (dimension) captures some aspect of meaning.

💡 **Key Insight:** Similar meanings = similar vectors (close in space)

---

## Why Embeddings Matter

### Traditional Text Search (BAD)
```
Query: "cat"
Docs:  ["cat", "dog", "feline", "animal"]
       Matches: only exact word "cat"
       Problem: Misses "feline" and "animal" which are semantically related
```

### Embedding Search (GOOD)
```
Query:        "cat"        →  [0.8, 0.2, 0.5]
Document 1:   "cat"        →  [0.79, 0.21, 0.51]   ✅ close
Document 2:   "feline"     →  [0.77, 0.19, 0.48]   ✅ close
Document 3:   "dog"        →  [0.3, 0.8, 0.2]      ❌ far
Document 4:   "pizza"      →  [0.1, 0.1, 0.9]      ❌ far
```

---

## The Math (Just Enough)

### Cosine Similarity - How Close Are Two Vectors?

```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)

Where:
  · = dot product (multiply corresponding elements, sum them)
  ||A|| = magnitude (length) of vector A
```

**Result:** A number between -1 and 1
- **1.0** = identical direction (identical meaning)
- **0.5** = moderate similarity
- **0.0** = orthogonal (unrelated)
- **-1.0** = opposite direction

**Example:**
```
Vector A: [1, 0]
Vector B: [0.707, 0.707]  (45° angle)

A · B = (1 × 0.707) + (0 × 0.707) = 0.707
||A|| = 1
||B|| = 1

cosine_similarity = 0.707 / (1 × 1) = 0.707  ✅ pretty similar
```

💡 **Why Cosine?** It measures angle, not distance. Two vectors with same direction = high similarity, regardless of magnitude.

---

## How Vector Databases Work

Vector DBs are optimized for **"find similar vectors"** queries. They don't compare your query against every vector sequentially.

### Naive Approach (❌ slow)
```
Query vector: [0.5, 0.3, 0.8]

For each of 1 million documents:
  1. Calculate cosine_similarity(query, doc)
  2. Sort by similarity
  3. Return top-10

Time: O(n) — compare against every document
```

### Vector DB Approach (✅ fast)
Uses **indexing** to skip irrelevant vectors:

```
┌─────────────────────────────────────────┐
│  Vector Database Index                  │
├─────────────────────────────────────────┤
│  Uses spatial partitioning:             │
│                                         │
│  Query [0.5, 0.3, 0.8]                  │
│         └─→ check only nearby cluster   │
│             (skip 99% of data)          │
│         └─→ return top-10               │
│                                         │
│  Time: O(log n) per query              │
└─────────────────────────────────────────┘
```

**Common indexing strategies:**
- **HNSW** (Hierarchical Navigable Small World) — graph-based, very fast
- **IVF** (Inverted File) — partitions space into clusters
- **LSH** (Locality-Sensitive Hashing) — hash functions preserve similarity

---

## Popular Vector Databases

| DB | Speed | Cost | Best For |
|---|---|---|---|
| **Pinecone** | ⚡⚡⚡ Fast | $$ Managed | Production RAG, serverless |
| **Weaviate** | ⚡⚡ Medium | $ Self-hosted | Complex queries, hybrid search |
| **Chroma** | ⚡ Local | Free | Local dev, prototyping |
| **pgvector** (PostgreSQL) | ⚡⚡ Medium | $ Self-hosted | Existing Postgres setup |
| **Milvus** | ⚡⚡⚡ Very fast | Free | High-volume ingestion |

---

## Embedding Models (How do we get embeddings?)

You need a model to convert text → vectors.

```
Text Input                           Embedding Model                 Output Vector
┌──────────────────────┐            ┌─────────────────┐          ┌──────────────┐
│ "The cat is fluffy"  │ ──────→    │ sentence-BERT   │ ────→    │ [0.2, 0.5,   │
└──────────────────────┘            │ (trained NN)    │          │  ..., 0.8]   │
                                    └─────────────────┘          └──────────────┘
                                         768 dimensions
```

### Popular Models

| Model | Dimensions | Speed | Cost | Use Case |
|---|---|---|---|---|
| **OpenAI text-embedding-3-small** | 512 | Fast | $ API | General purpose, simple |
| **Sentence-BERT (SBERT)** | 384-768 | Fast | Free | Local, sentence similarity |
| **BGE (BAAI)** | 768 | Fast | Free | Strong performance, open-source |
| **Voyage AI** | Variable | Medium | $$ | Specialized (code, long docs) |

**Choosing an embedding model:**
1. Do you need local inference (free model) or OK with API cost (OpenAI)?
2. How many documents? (affects index size)
3. Domain-specific? (code? medical?) → specialized model helps

---

## End-to-End Example

### Scenario: Law firm RAG system

```
INDEXING PHASE (offline, once)
├─ Load 10,000 legal documents
├─ Split into chunks (300 tokens each)
├─ Convert each chunk to embedding: "legal chunk" → [0.12, -0.5, ...]
└─ Store in Pinecone with metadata (page, section, date)

RETRIEVAL PHASE (runtime, per query)
├─ User asks: "What are penalties for contract breach?"
├─ Convert query to embedding: [0.15, -0.48, ...]
├─ Vector DB finds top-5 most similar document chunks
├─ Return: chunks + similarity scores
└─ Pass to LLM with prompt: "Answer based on these docs..."
```

---

## Common Pitfalls

❌ **Using the wrong embedding model**
- Trained on general text, but you're searching legal documents
- → Solution: Use domain-specific or fine-tuned embeddings

❌ **Embedding too-long documents**
- Model has max length → chunks get truncated
- → Solution: Chunk BEFORE embedding

❌ **Assuming cosine similarity is perfect**
- Two vectors can be close by similarity but semantically different
- → Solution: Use reranking (cross-encoders) to validate

❌ **Not updating old embeddings**
- You re-train your embedding model, but old vectors in DB are stale
- → Solution: Re-embed all documents when you upgrade models

---

## Key Takeaways

✅ Embeddings = dense numerical vectors = semantics as numbers

✅ Cosine similarity measures how related two vectors are

✅ Vector DBs use indexing (HNSW, IVF) for fast search in high dimensions

✅ Embedding quality depends on the model — choose based on domain & cost

✅ Embeddings are the foundation of RAG, reranking, and semantic search

**Next:** Understand how LLMs read text → Tokenization
