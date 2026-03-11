# Phase 1: Foundations — Questions & Answers

## Category 1: Embeddings & Vector Search

### Q1: Explain embeddings and why we need them. What's the difference from traditional text search?

**A:**
An embedding is a dense numerical representation of text meaning. Instead of storing words, we store high-dimensional vectors (e.g., 768 numbers for SBERT). Similar meanings cluster close together in vector space.

**Why we need them:**
Traditional text search (keyword matching) only finds exact word matches.
```
Query: "cat"
Doc 1: "cat" ✅ match
Doc 2: "feline" ❌ no match (but semantically related)
```

With embeddings:
```
Query: "cat" → [0.8, 0.2, 0.5]
Doc 1: "cat" → [0.79, 0.21, 0.51] ✅ similar (cosine = 0.99)
Doc 2: "feline" → [0.77, 0.19, 0.48] ✅ similar (cosine = 0.98)
Doc 3: "pizza" → [0.1, 0.1, 0.9] ❌ different (cosine = 0.3)
```

**Trade-off:** Embeddings capture semantics but are slow to compute for ALL docs. That's why we pre-compute offline and store in vector DBs.

---

### Q2: How does cosine similarity work? Why not use Euclidean distance?

**A:**
Cosine similarity measures the **angle** between two vectors:

$$\text{cosine\_similarity} = \frac{A \cdot B}{||A|| \times ||B||}$$

Result: -1 to 1 (1 = identical direction, 0 = orthogonal, -1 = opposite)

**Why not Euclidean distance?**
Distance measures straight-line distance between points. Two problems:
1. **Magnitude matters:** Two vectors with identical direction but different magnitude would have large distance
2. **Curse of dimensionality:** In high-dimensional space (768 dims), all vectors are far from each other!

```
Vector A: [1, 0, 0, ..., 0]       (unit vector, norm = 1)
Vector B: [100, 0, 0, ..., 0]     (scaled version, norm = 100)

Euclidean: distance = 99 (far!)
Cosine: similarity = 1.0 (identical direction!)  ✅ right answer
```

Cosine ignores magnitude and focuses on **direction = meaning**.

---

### Q3: A database has 1 million documents. How do vector databases make similarity search fast?

**A:**
Naive approach: For each query, compute cosine similarity with all 1M docs → O(n) = slow!

Vector DBs use **spatial indexing** to skip irrelevant vectors:

**HNSW (Hierarchical Navigable Small World):**
```
Layer 3:  A --- B --- C           (few neighbors, sparse)
           \   / \   /
Layer 2:  A-D-B-E-C-F            (more neighbors)
           |/ \| |/ \|
Layer 1:  A-D-G-B-E-H-C-F       (dense, all neighbors)
           └─→ Dense layer at bottom

Query: Find documents similar to X
Step 1: Start at top layer (Layer 3)
Step 2: Move to closest neighbor (fewer comparisons)
Step 3: Drop to next layer
Step 4: Refine search
Result: O(log n) instead of O(n) ✅
```

Other strategies: IVF (partitioning space into clusters), LSH (hashing)

**Cost:** HNSW is ~10x faster but uses more memory.

---

### Q4: You're building a RAG system. Should you use OpenAI's embedding API or a open-source model like BGE?

**A:**
**Factors to decide:**

| Criteria | OpenAI (API) | BGE (Open-source) |
|---|---|---|
| Cost | $$ per query | $ (free locally) |
| Speed | Slower (API call) | Faster (local inference) |
| Privacy | Data to OpenAI | Local (data stays home) |
| Domain shift | General (works OK for specialized) | Fine-tunable for your domain |
| Reliability | Depends on OpenAI API uptime | You manage it |

**Decision tree:**
```
Cost is a concern? → BGE
Privacy matters? → BGE
Need best general performance? → OpenAI
Need to fine-tune for domain? → BGE
Query volume > 100K/month? → BGE (API would cost $$$)
Need simplicity? → OpenAI (no infrastructure)
```

**My recommendation:** Start with free BGE locally, switch to OpenAI if performance is bad.

---

## Category 2: Tokenization & Context Windows

### Q5: You have a 10-page document (4000 tokens). Your model's context window is 2000 tokens. What do you do?

**A:**
You **cannot** fit it directly. Options:

**Option 1: Summarization**
- Summarize each page → 200 tokens per page
- Total: 2000 tokens ✅ fits
- Trade-off: Lose detail

**Option 2: Chunking (RAG approach)** ⭐ Best for search/QA
- Split into 5 chunks (800 tokens each)
- For each chunk: Create separate embeddings
- At query time: Retrieve only relevant chunks
- Include only 1-2 relevant chunks in prompt
- Trade-off: Need a good retrieval mechanism

**Option 3: Filtering**
- Extract only relevant sections (e.g., "Financial" section for Q: "What's the revenue?")
- Drop everything else
- Total: 500 tokens ✅ fits
- Trade-off: Manual extraction

**For production RAG:** Option 2 (chunking + retrieval) is standard. You pre-chunk offline, embed each chunk, store in vector DB. At runtime, retrieve only relevant chunks.

---

### Q6: Same model, same document. User asks: "Compare findings from page 3 and page 8."

**A:**
Chunking alone won't work — you need **both** pieces of info.

**Solutions:**

**Solution 1: Hybrid retrieval**
- Retrieve chunk from page 3 (300 tokens)
- Retrieve chunk from page 8 (300 tokens)
- Include both in prompt (600 tokens total, fits in 2K window)
- Good if question is clear

**Solution 2: Adaptive retrieval**
- Detect this is a "comparison" query
- Automatically retrieve multiple chunks
- Include relevant chunks from multiple pages

**Solution 3: Summarize + Compare**
- Summarize page 3 (100 tokens)
- Summarize page 8 (100 tokens)
- Ask comparison on summaries (200 tokens)
- Faster but loses detail

**Best practice:** Use vector search to find relevant chunks, **then** validate that you have all pieces needed to answer the query. If not, retrieve additional chunks.

---

### Q7: How many tokens does "The quick brown fox" have in GPT-4?

**A:**
Use the tokenizer!

```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4")
text = "The quick brown fox"
tokens = enc.encode(text)
print(len(tokens))  # Likely 5-6 tokens
```

**Without computing:** Use the rule of thumb:
- 1 word ≈ 1.3 tokens
- "The quick brown fox" = 4 words ≈ 5 tokens ✅

**But remember:** Different models have different tokenizers!
- GPT-4: 5 tokens
- Claude: 4 tokens (might be different)
- Llama: 5 tokens

**Always count** before sending to API if cost/latency matters.

---

## Category 3: Prompt Engineering

### Q8: You ask an LLM a complex reasoning task and it fails. What are 3 prompting techniques to fix this?

**A:**

**Technique 1: Chain-of-Thought (CoT)**
```
❌ Bad: "Is 23 × 45 = 1035?"

✅ Good: "Let's work through this step by step:
   - 23 × 40 = 920
   - 23 × 5 = 115
   - 920 + 115 = 1035
   Is this correct?"
```
**Effect:** Forces intermediate steps, catches reasoning errors.

**Technique 2: Few-Shot Prompting**
```
❌ Bad: "Translate 'hello' to French"
✅ Good: "
Example: 'goodbye' → 'au revoir'
Example: 'good morning' → 'bonjour'
Now translate: 'hello' → ?"
```
**Effect:** Teaches the model by example, especially useful for specific formats.

**Technique 3: Structured Output**
```
❌ Bad: "Extract entities from: 'John works at Google'"
✅ Good: "Extract entities in JSON:
{
  'person': '...',
  'company': '...'
}"
```
**Effect:** Constrains output format, reduces hallucinations.

**General rule:** CoT for reasoning, few-shot for formats, structured output for extraction.

---

### Q9: What's the difference between zero-shot and few-shot prompting? When use each?

**A:**

| Aspect | Zero-Shot | Few-Shot |
|---|---|---|
| Definition | No examples provided | Examples shown before task |
| Accuracy | Lower (relies on pretraining) | Higher (learns from examples) |
| Tokens | Fewer | More (examples consume tokens) |
| Speed | Faster | Slower |

**When to use zero-shot:**
- Simple, unambiguous tasks ("Classify as positive/negative")
- You're prototyping fast
- Token budget is tight

**When to use few-shot:**
- Complex/ambiguous tasks (NL-to-SQL, entity extraction)
- Output format is non-standard
- Accuracy is critical

**Example:**
```
Zero-shot: "Translate 'hello' to French"
→ Output: "Bonjour" ✅ (works, pretraining covers it)

Zero-shot: "Convert English to Pig Latin"
→ Output: Garbage ❌ (not in pretraining)

Few-shot: Show 2 examples, then convert
→ Output: "ellohay" ✅ (learns from examples)
```

**Rule of thumb:** If output accuracy is low with zero-shot, add few-shot.

---

### Q10: You need to extract structured data from user input. Describe your prompt design.

**A:**
**Structured approach:**

```
SYSTEM PROMPT:
"You are a data extraction assistant. Extract only the requested fields.
If a field is missing, return null."

TASK DEFINITION:
"Extract from: 'John Smith, age 28, works at Google as engineer'"

OUTPUT FORMAT:
{
  "name": "...",
  "age": "...",
  "company": "...",
  "title": "..."
}

OPTIONAL: Provide 1-2 examples
{
  "name": "Alice", "age": 25, "company": "Meta", "title": "PM"
}
```

**Why this design:**
1. **System prompt** sets role and constraints
2. **Task definition** is clear
3. **Output format** is specified (JSON) → easier to parse
4. **Examples** show edge cases (what if data is ambiguous?)

**Extra: Use JSON mode** (if available)
```python
response = client.chat.completions.create(
  messages=[...],
  response_format={"type": "json_object"}
)
# Guaranteed valid JSON output ✅
```

---

## Category 4: Integration (Cross-Topic)

### Q11: You're building a legal document QA system. Design the full Phase 1 pipeline (embeddings + chunking + prompting).

**A:**

```
STEP 1: EMBEDDING CHOICE
├─ Domain: Legal documents (specialized)
├─ Volume: ~5,000 documents
├─ Decision: Use open-source BGE (fine-tuned for long texts)
├─ Why: Legal specificity matters, cost-effective for this volume
└─ Embedding dim: 768

STEP 2: TOKENIZATION & CHUNKING
├─ Token limit: Target 1000 tokens per chunk (fits in context)
├─ Strategy: Semantic chunking (split at paragraph level, not mid-sentence)
├─ Why: Legal paragraphs form semantic units
└─ Result: ~50,000 chunks from 5,000 docs

STEP 3: STORAGE
├─ Tool: pgvector (PostgreSQL) — no infrastructure, already using DB
├─ Index: HNSW for fast search
├─ Metadata: {doc_id, page_num, section, date}
└─ Total index size: ~40MB

STEP 4: RETRIEVAL
├─ User asks: "What are penalties for breach?"
├─ Embed query: "penalties breach" → [0.5, -0.3, ...]
├─ Search: Top-5 chunks from pgvector
├─ Rerank: (optional) use Cohere Rerank if precision matters
└─ Result: 2-3 most relevant chunks

STEP 5: PROMPTING
Prompt template:
  "You are a legal assistant. Answer based ONLY on provided docs.
  
  DOCUMENTS:
  {retrieved_chunks}
  
  QUESTION: {user_query}
  
  Answer in 3 bullet points. If unsure, say so."

Why this design:
- Few-shot optional (add 1 example for complex Q&A)
- Structured output (bullet points) for clarity
- Token-aware chunking (fits in context window)
- Semantic retrieval (legal documents need meaning, not keywords)
```

---

## Key Insights (Distilled)

✅ **Embeddings** capture meaning as vectors; retrieve semantically similar docs

✅ **Cosine similarity** measures angle (direction = meaning); ignore magnitude

✅ **Vector DBs** use spatial indexing (HNSW, IVF) → O(log n) instead of O(n)

✅ **Tokens** are variable-length; count before sending to API

✅ **Context windows** are hard limits; use chunking/summarization for long docs

✅ **CoT prompting** ("think step by step") fixes reasoning tasks

✅ **Few-shot** beats zero-shot for accuracy; costs more tokens

✅ **Structured output** prompting reduces hallucinations and parsing errors

✅ **Integration:** Embeddings → retrieval → chunking → prompting = RAG foundation
