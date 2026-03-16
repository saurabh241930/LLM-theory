# Phase 2: RAG — Questions & Answers

## Category 1: Chunking Strategies

### Q1: You have documents of varying sizes (100 tokens to 5000 tokens). How should you chunk them?

**A:**

Use **recursive chunking**. It respects document structure while preserving semantics.

```
Algorithm:
1. Try splitting by paragraph (\n\n)
   → If all chunks < 500 tokens: Done!
   → If some chunks > 500 tokens: Next step

2. Split oversized chunks by line (\n)
   → If all chunks < 500 tokens: Done!
   → If some still > 500 tokens: Next step

3. Split by sentence (.)
   → Continue until all chunks fit

Benefits:
- Respects document structure (paragraphs before sentences)
- Preserves meaning boundaries
- O(n) complexity, simple to implement
```

**Alternative if documents are structured (headers, sections):**
Use **document-aware chunking** — split by section headers.

---

### Q2: Should you use fixed-size or semantic chunking? What are the trade-offs?

**A:**

**Fixed-size chunking:**
```
Chunk size: 500 tokens
Simple split: every 500 tokens

Pros:
✓ Predictable sizes (cache planning)
✓ Fast (no embedding needed)
✓ Simple to implement

Cons:
✗ Breaks meaning boundaries
✗ May split mid-sentence
✗ Poor retrieval quality
```

**Semantic chunking:**
```
Chunk based on similarity between sentences
If similarity < 0.5 between sentences → new chunk

Pros:
✓ Preserves meaning boundaries
✓ Better retrieval quality
✓ Variable-sized chunks (natural clustering)

Cons:
✗ Expensive (embed every sentence)
✗ Need threshold tuning
✗ Slower to implement
```

**Decision tree:**
```
Need production-quality RAG?
  ├─ YES → Semantic chunking (better quality is worth cost)
  └─ NO → Fixed-size/Recursive (fast prototyping)

Many documents (> 10K)?
  ├─ YES → Fixed-size (semantic is too expensive)
  └─ NO → Can afford semantic

Documents structured (headers)?
  ├─ YES → Document-aware (best for structure)
  └─ NO → Semantic or Recursive
```

**My recommendation:** Start recursive (good balance), switch to semantic if quality is low.

---

### Q3: What chunk size should you target (in tokens)?

**A:**

**Rule of thumb:** `chunk_size = context_window / 3`

**Example:**
```
Model: GPT-4 (context = 128K tokens)
Chunk size: 128K / 3 ≈ 40K tokens per chunk

Wait, that's huge!
```

**Better rule:** `chunk_size = 500-1000 tokens`

**Rationale:**
```
Context window: 4K tokens (typical endpoint)
├─ System prompt: 200 tokens
├─ User query: 100 tokens
├─ Retrieved chunks: X tokens
├─ Space for answer: Y tokens
└─ Total: ≤ 4000 tokens

If chunk = 500 tokens: Can fit 7-8 chunks ✓
If chunk = 2000 tokens: Can fit 2 chunks only ✗
If chunk = 100 tokens: Creates 100+ chunks (expensive) ✗
```

**Practical guidance:**
| Document Type | Chunk Size |
|---|---|
| Legal/Medical | 800-1000 tokens |
| Customer support | 500-700 tokens |
| Long documents | 300-500 tokens |
| Code | 200-400 tokens |

**Validation:** Test on your domain and measure RAGAS metrics.

---

## Category 2: Naive vs Advanced RAG

### Q4: You built a naive RAG system but queries with multiple parts fail. Why and how to fix?

**A:**

**Problem:**
```
Query: "Compare Q3 earnings and Q4 earnings"
Naive RAG embedding:
  [0.5, 0.3, ...]  ← Generic "earnings" direction

Retrieved chunks:
  Only Q3 chunks (maybe zero Q4 chunks)

Answer: Incomplete (can't compare with missing Q4)
```

**Solutions (ranked by effort):**

**Solution 1: Query Rewriting (⭐ Recommended)**
```
LLM rewrites complex query:
Original: "Compare Q3 earnings and Q4 earnings"
Rewritten:
  1. "What were Q3 earnings?"
  2. "What were Q4 earnings?"
  3. "What's the change from Q3 to Q4?"

For each rewritten query:
  → Retrieve relevant chunks
  → Combine results

Effort: 1-2 hours (implement LLM rewrite)
Impact: High (handles most complex queries)
```

**Solution 2: Multi-Query Retrieval (with same embedding)**
```
Smart system recognizes "Compare X and Y"
Automatically constructs multiple searches:
  → Search "X"
  → Search "Y"
  → Search "X vs Y"

Effort: 2-3 hours
Impact: Medium (heuristic-based, not general)
```

**Solution 3: Better Chunking**
```
Instead of chunk-level retrieval, use hierarchical:
  Section level (higher) for broad search
  Paragraph level (detail) for specific search

For comparison query:
  → Find Q3 and Q4 sections
  → Then find relevant paragraphs in each

Effort: 1-2 days
Impact: Medium (helps some cases)
```

**Choose Solution 1 (Query Rewriting)** — best balance of effort and generality.

---

### Q5: What's the difference between Naive RAG and Advanced RAG?

**A:**

| Aspect | Naive RAG | Advanced RAG |
|---|---|---|
| Retrieval | Direct embedding → top-k | Embedding + query rewriting + reranking |
| Query handling | Single search | Multiple rewrites, multiple searches |
| Chunk quality | Raw cosine scores | Reranked by cross-encoder |
| Ambiguity handling | Fails on vague queries | Rewrites to clarify |
| Cost | Low (just vector search) | Higher (LLM rewrites + reranking) |
| Latency | 50ms | 500ms-1s |
| Accuracy | ⭐⭐ Medium | ⭐⭐⭐ High |

**When to use Naive RAG:**
- Simple Q&A (straightforward questions)
- Speed critical (< 100ms)
- Small budget

**When to use Advanced RAG:**
- Complex queries
- Accuracy critical
- Can afford 500ms latency

---

## Category 3: Reranking

### Q6: You're building a medical RAG system. Should you use reranking? Why?

**A:**

**Yes, absolutely.** Medical domain requires **high accuracy**.

**Reasoning:**
```
Medical queries are high-risk:
├─ Wrong answer can harm patients
├─ Need 100% accuracy, not 90%
└─ Can afford higher latency

Reranking helps:
├─ Catches wrong chunks retrieved by embedding
├─ Validates relevance decision
├─ Improves from 0.90 → 0.98 accuracy

Worth the cost:
├─ Cost: $0.001 per query
├─ Latency: 500ms extra (acceptable)
└─ Benefit: High confidence in answer
```

**Implementation:**
```
Stage 1: Embedding retrieval
├─ Retrieve top-100 chunks fast
└─ Cost: $0.0001

Stage 2: Reranking
├─ Input all 100 to cross-encoder
├─ Get relevance scores
├─ Return top-5
└─ Cost: $0.001

Total: ~$0.0011 per query

For medical accuracy: Worth it ✓
```

**Alternative if API cost matters:**
Use open-source BGE Reranker (local, free).

```python
from sentence_transformers import CrossEncoder

model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Rerank retrieved chunks
scores = model.predict(
    [[query, chunk["text"] for chunk in retrieved_chunks]]
)

# Return top-k
top_k = sorted(zip(chunks, scores), key=lambda x: x[1], reverse=True)[:5]
```

---

### Q7: When should you NOT use reranking?

**A:**

```
Latency < 100ms required?
  ├─ YES → Don't use reranking (too slow: 500ms)
  └─ NO → Can use

Embedding quality already excellent?
  ├─ YES → Maybe skip (cosine similarity fine)
  └─ NO → Add reranking

Query volume > 1M/day and cost matters?
  ├─ YES → Skip (API cost will explode)
  └─ NO → Can afford

Domain where wrong answer = minor inconvenience?
  ├─ YES → Skip reranking (extra 0.05 accuracy not worth 10x cost)
  └─ NO → Add reranking

Decision: Track your data!
├─ Without reranking: Measure RAGAS scores
├─ Is Context_Precision > 0.85?
│   ├─ YES → Don't need reranking
│   ├─ NO → Add reranking
```

**Cost-benefit analysis:**
```
Cost of reranking: $10 per 10K queries
Benefit: +5% accuracy improvement

Your use case:
├─ FAQ bot: Not worth it (5% matters little)
├─ Legal system: Worth it (5% matters a lot)
└─ Customer support: Depends on impact
```

---

## Category 4: RAG Evaluation

### Q8: You evaluated your RAG with RAGAS and got: F=0.92, AR=0.88, CR=0.7, CP=0.6. What's wrong?

**A:**

```
RAGAS Scores:
├─ Faithfulness = 0.92     ✅ Good (answer is truthful)
├─ Answer_Relevancy = 0.88 ✅ Good (addresses question)
├─ Context_Recall = 0.7    🟡 Medium (missing some chunks)
└─ Context_Precision = 0.6 🔴 Poor (retrieved irrelevant chunks)

Problem Analysis:
├─ Faithfulness & Answer_Relevancy OK → Generation is good
├─ Context_Recall = 0.7 → Missing 30% of needed info
├─ Context_Precision = 0.6 → 40% of retrieved chunks irrelevant

Root Cause: RETRIEVAL IS BAD
├─ Finding wrong chunks
├─ Missing necessary chunks
└─ LLM works around it, but fragile
```

**Fixes (in priority order):**

**1. Improve Embedding Quality (2-3 hours)**
```
Issue: Generic embeddings miss domain specifics
Solution:
  ├─ Switch to domain embedding (legal, medical, code)
  ├─ Or fine-tune embedding on your domain
  └─ Expected improvement: 0.6 → 0.75

Test: Already have embedding model?
  └─ If not, try: BGE-large (better than OpenAI for precision)
```

**2. Add Reranking (1 hour)**
```
Issue: Cosine similarity ranks wrong chunks first
Solution:
  ├─ Add cross-encoder reranker
  └─ Expected improvement: 0.6 → 0.75

Tool: Cohere Rerank or BGE Reranker
Cost: ~$0.001 per query
```

**3. Fix Chunking (2-4 hours)**
```
Issue: Chunks not semantic units
Solution:
  ├─ Switch to semantic chunking
  └─ Or document-aware chunking
  └─ Expected improvement: 0.6 → 0.7

Validate: Manually check 10 retrieved chunks
```

**4. Hybrid Search (1-2 hours)**
```
Issue: Keyword relevance missed by embedding
Solution:
  ├─ Add BM25 (sparse retrieval)
  ├─ Combine with dense (reciprocal rank fusion)
  └─ Expected improvement: 0.6 → 0.7

Simple to implement, effective for keyword-heavy queries
```

**Start with #1 or #2 (quick wins), then #3 if needed.**

---

### Q9: How many test cases do you need for RAGAS evaluation?

**A:**

**Depends on your sampling error tolerance:**

| Data Quality Requirement | Min Test Cases | Ideal |
|---|---|---|
| Prototype/POC | 5-10 | 10 |
| Internal tool | 20-30 | 50 |
| Production system | 50-100 | 100-200 |
| High-accuracy system | 100+ | 500+ |

**Practical approach:**
```
Week 1: Collect 10 test cases
  ├─ Run RAGAS evaluation
  ├─ Identify main issues
  └─ Iterate on system

Week 2: Expand to 30 test cases
  ├─ Re-evaluate
  ├─ Confirm improvements
  └─ Identify edge cases

Week 3: Expand to 100 test cases
  ├─ Final validation
  ├─ Compare to human evaluation
  └─ Deploy to production
```

**Test case distribution:**
```
Aim for diversity:
├─ 30% simple questions (one-fact answers)
├─ 40% moderate questions (multi-part)
├─ 20% complex questions (comparison, reasoning)
├─ 10% edge cases (ambiguous, contradictory)
```

**Example **30-case dataset:**
```
9 simple:   "What is X?", "Who is Y?", "When was Z?"
12 moderate: "Compare X and Y", "List advantages", "How to do X?"
6 complex:  "Analyze X in context of Y", "Recommend based on..."
3 edge:     "Contradicting docs", "No relevant docs", "Ambiguous terms"
```

---

## Category 5: Integration (Cross-Topic)

### Q10: Design a complete RAG system for a startup's internal knowledge base (5000 documents, 50 employees).

**A:**

```
REQUIREMENTS ANALYSIS:
├─ Volume: 5000 docs (manageable)
├─ Users: 50 internal (safety critical)
├─ Use cases: FAQ, onboarding, policy lookup
└─ Latency budget: 1 second OK

ARCHITECTURE:
├─ Documents: Wiki pages, policy docs, meeting notes
├─ Chunk size: 500-800 tokens (semantic unit)
├─ Embedding: BGE or OpenAI (domain: generic, so OpenAI OK)
├─ Vector DB: Pinecone (serverless, low maintenance)
├─ Reranking: Yes (internal use → accuracy > speed)
├─ LLM: Claude or GPT-4 (quality matters)

IMPLEMENTATION PLAN:

PHASE 1: INDEXING (1 week)
├─ Load all 5000 docs
├─ Chunk with recursive strategy
│  └─ Respect headers/sections when present
├─ Embed with BGE
│  └─ ~5K chunks × 768 dims = 40MB index size
├─ Store in Pinecone
│  └─ Free tier might work initially
└─ Add metadata: {doc_id, section, file_type, updated_at}

PHASE 2: RAG PIPELINE (2 weeks)
├─ Retrieval:
│  ├─ User query → embed
│  ├─ Search Pinecone (top-20)
│  └─ Rerank with BGE reranker (top-5)
├─ Prompt:
│  ├─ System: "You are a helpful assistant..."
│  ├─ Context: {top_5_chunks}
│  ├─ User question: {query}
│  └─ Format: Clear, concise answer with sources
├─ Generation:
│  └─ Claude answers with citations to source docs
└─ Return: Answer + source links

PHASE 3: EVALUATION (1 week)
├─ Create 30 test questions (diverse)
├─ Run RAGAS evaluation
├─ Target scores:
│  ├─ Faithfulness: > 0.90
│  ├─ Answer_Relevancy: > 0.85
│  ├─ Context_Recall: > 0.80
│  └─ Context_Precision: > 0.75
├─ Human spot-check: 5-10 answers
└─ Iterate (improve chunking, reranking if scores low)

PHASE 4: DEPLOYMENT (1 week)
├─ Integrate with company Slack/website
├─ Set up logging (track usage, failures)
├─ Establish feedback loop (users rate answers)
└─ Weekly metrics review

TIMELINE: 4-5 weeks
TEAM: 1-2 engineers (no ML experts needed)
COST: $100-500/month (embedding API + Pinecone)

KEY DECISIONS:
√ Recursive chunking: Balance quality/speed
√ Reranking: Yes (accuracy > speed for internal tool)
√ BGE embedding: Free, good quality
√ Pinecone: Low ops overhead

RISKS & MITIGATIONS:
├─ Hallucination
│  └─ Mitigation: Few-shot examples, "answer only from context"
├─ Missing docs
│  └─ Mitigation: Feedback loop, metadata to route questions
├─ Stale docs
│  └─ Mitigation: Re-index weekly, track doc update dates
└─ Quality regression
│  └─ Mitigation: Automated RAGAS evals, human spot-checks
```

---

## Key Insights (Distilled)

✅ **Chunking:** Recursive (default), semantic (high quality), document-aware (structured)

✅ **Chunk size:** ~500-1000 tokens (context_window / 3-5)

✅ **Naive RAG:** Simple, fast, good for straightforward QA

✅ **Advanced RAG:** Add query rewriting, reranking for complex/accurate queries

✅ **Reranking:** Worth cost for medical/legal/financial (high-risk domains)

✅ **RAGAS metrics:** Diagnose problems (retrieval vs generation)

✅ **Low Context_Precision?** → Problem is retrieval, fix embedding/chunking

✅ **Low Context_Recall?** → Missing needed chunks, add more or rewrite query

✅ **Test dataset:** 30-100 cases, diverse difficulty levels

✅ **Iteration:** Measure → identify bottleneck → improve → repeat
