# 04. Chunking Strategies

## Why Chunking Exists

Documents are too long for context windows. Chunking is the solution.

```
Long Document: 10,000 tokens
Context Window: 2,000 tokens

❌ Can't fit directly

Solution: Split into chunks
Chunk 1: 500 tokens
Chunk 2: 500 tokens
Chunk 3: 500 tokens
Chunk 4: 500 tokens

✅ Now each chunk fits!
```

The goal: **Preserve semantic meaning while keeping chunks small**.

---

## Strategy 1: Fixed-Size Chunking

Split text into fixed-length chunks (e.g., 500 tokens).

```
Document: "The cat sat on the mat. It was very comfortable..."

Chunk 1 (500 tokens): "The cat sat on the mat..."
Chunk 2 (500 tokens): "...and then it slept."
Chunk 3 (500 tokens): "The next morning..."
```

**Pros:**
- Simple to implement
- Predictable chunk sizes
- Fast

**Cons:**
- ❌ Breaks semantic boundaries (might split a sentence mid-way)
- ❌ Loss of meaning at chunk boundaries
- ❌ Chunks might not be meaningful units

```
❌ Bad split:
Chunk ends with: "The cat is a very"
Chunk starts with: "smart animal"
```

---

## Strategy 2: Sliding Window

Fixed size, but nearby chunks overlap.

```
Chunk 1: tokens [0-500]
Chunk 2: tokens [250-750]         ← overlaps by 250 with Chunk 1
Chunk 3: tokens [500-1000]        ← overlaps by 250 with Chunk 2
```

**Visual:**
```
Document: [====Chunk 1====][overlap][====Chunk 2====][overlap][====Chunk 3====]
```

**Pros:**
- Preserves context at boundaries
- Similar chunk sizes
- No information loss at edges

**Cons:**
- Redundant storage (overlapping data)
- More chunks to embed/store
- Query results might return similar chunks

**When to use:** When boundary context matters (medical, legal documents)

---

## Strategy 3: Semantic Chunking

Split based on meaning, not fixed size.

```
Document:
"The economy grew 3% last year.
 This is good news.
 
 However, inflation increased.
 Prices are higher.
 This is concerning."

Chunks:
Chunk 1: "The economy grew... This is good news."  (semantic unit: positive)
Chunk 2: "However, inflation... This is concerning."  (semantic unit: negative)
```

**How it works:**
```
Step 1: Embed each sentence
Step 2: Calculate similarity between consecutive sentences
Step 3: If similarity < threshold → start new chunk

Similarity decreases here ↓
Sentence 1: "Economy grew..." ──→ [0.8, -0.3, 0.5]
Sentence 2: "Good news" ────→ [0.75, -0.2, 0.52]  (similar)
Sentence 3: "However, inflation..." → [0.1, 0.8, -0.2]  (different!)
                                      ↑ NEW CHUNK
```

**Pros:**
- ✅ Preserves meaning boundaries
- ✅ Variable-size chunks (all coherent)
- ✅ Better for retrieval quality

**Cons:**
- Expensive (must embed each sentence)
- Variable chunk sizes (might be very large or very small)
- Requires tunable threshold

---

## Strategy 4: Recursive Chunking

Split at multiple levels (paragraph → sentence → tokens).

```
Document
  └─ Split by: "\n\n" (paragraphs)
      └─ If too large, split by: "\n" (lines)
          └─ If still too large, split by: "." (sentences)
              └─ If still too large, split by: " " (words)
                  └─ If still too large, split by: "" (characters)
```

**Algorithm:**
```python
def recursive_chunk(text, size=500, separators=["\n\n", "\n", ".", " "]):
    chunks = []
    for separator in separators:
        # Try splitting by this separator
        splits = text.split(separator)
        
        # If all splits fit size limit, use them
        if all(len(s) <= size for s in splits):
            return splits
        
        # Otherwise, recursively chunk each split
    return chunks
```

**Pros:**
- ✅ Respects document structure
- ✅ Preserves semantics (splits at paragraphs first, then sentences)
- ✅ Clean implementation

**Cons:**
- More complex than fixed-size
- Still might break meaning in edge cases

---

## Strategy 5: Document-Aware Chunking

Split based on document structure (headers, sections).

```
Document:
# Section 1: Introduction
  Introduction paragraph...

## Subsection 1.1: Background
  Background paragraph...

## Subsection 1.2: Methods
  Methods paragraph...

# Section 2: Results
  Results paragraph...

Chunks:
Chunk 1: [Section 1.1 header] + [Background paragraph]
Chunk 2: [Section 1.2 header] + [Methods paragraph]
Chunk 3: [Section 2 header] + [Results paragraph]
```

**Why it works:**
- Document structure (headers, sections) already marks semantic boundaries
- Each chunk retains context (header tells you what section it's from)

**Pros:**
- ✅ Perfect for structured docs (papers, documentation, legal)
- ✅ Preserves hierarchy

**Cons:**
- Only works if documents are well-structured
- Requires parsing document structure (headers, bullet points, etc.)

---

## Comparison Table

| Strategy | Size Predictability | Semantic Quality | Implementation | Cost |
|---|---|---|---|---|
| **Fixed-Size** | ✅ Predictable | ❌ Poor | ✅ Simple | $ |
| **Sliding Window** | ✅ Predictable | ⭐ Better | ✅ Simple | $$$ (redundant) |
| **Semantic** | ❌ Variable | ✅✅ Excellent | ⭐ Medium | $$$ (embed all) |
| **Recursive** | ⭐ Balanced | ✅ Good | ⭐ Medium | $ |
| **Document-Aware** | ⭐ Variable | ✅✅ Excellent | ⭐ Medium | $ |

---

## Choosing a Strategy: Quick Decision Tree

```
Is your document structured (headers, sections)?
  ├─ YES → Use Document-Aware Chunking
  └─ NO → Continue...

Is semantic accuracy critical (law, medicine)?
  ├─ YES → Use Semantic Chunking
  └─ NO → Continue...

Do you need simple, fast solution?
  ├─ YES → Use Fixed-Size or Recursive
  └─ NO → Use Semantic

Budget for embedding all sentences?
  ├─ YES → Semantic Chunking ⭐ Best
  └─ NO → Recursive or Document-Aware
```

---

## Practical Example: Chunking a Legal Contract

```
Contract:

# SECTION 1: PARTIES
This agreement is between Party A and Party B...

# SECTION 2: PAYMENT TERMS
2.1 Payment shall be due by...
2.2 Late payments incur penalties...

# SECTION 3: TERMINATION
If either party breaches...
```

**Best approach:** Document-Aware (respect headers)

```
Chunk 1:
  Header: "SECTION 1: PARTIES"
  Content: "This agreement is between..."

Chunk 2:
  Header: "SECTION 2: PAYMENT TERMS"
  Content: "2.1 Payment shall be due by..."

Chunk 3:
  Header: "SECTION 2: PAYMENT TERMS"
  Content: "2.2 Late payments incur penalties..."

Chunk 4:
  Header: "SECTION 3: TERMINATION"
  Content: "If either party breaches..."
```

**Why this works:**
- Each chunk is a semantic unit (section)
- Header provides context
- Easy to implement (parse markdown/structure)

---

## Common Pitfalls

❌ **Chunk too small (100 tokens)**
- Problem: Loses context, creates too many chunks to retrieve
- Solution: Target 500-1000 tokens per chunk

❌ **Chunk too large (5000 tokens)**
- Problem: Doesn't fit in context window, defeats purpose
- Solution: Reduce to context_window / 3

❌ **No overlap in boundaries**
- Problem: Loses meaning at chunk edges
- Solution: Add sliding window or overlap

❌ **Not including metadata**
- Problem: Can't trace chunk back to original doc
- Solution: Store {doc_id, section, page_num} with each chunk

---

## Key Takeaways

✅ Chunking breaks long documents into context-window-sized pieces

✅ Fixed-size: simple but poor semantic quality

✅ Semantic: best quality but expensive (must embed all sentences)

✅ Recursive: good balance (structure-aware, moderate cost)

✅ Document-Aware: best for structured docs (headers, sections)

✅ Always add metadata (doc_id, page, section) to chunks

✅ Target chunk size ≈ context_window / 3 (to leave room for query + prompt)

**Next:** Use chunks in a basic RAG pipeline → Naive RAG
