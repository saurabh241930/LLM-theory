# 05. Naive RAG

## What is RAG?

**RAG = Retrieval-Augmented Generation**

Instead of asking an LLM from memory, you **retrieve relevant context first**, then ask.

```
WITHOUT RAG (Naive LLM):
User: "What's the company policy on remote work?"
LLM: "I don't know, I wasn't trained on your internal docs"
❌

WITH RAG (Retrieval + Generation):
User: "What's the company policy on remote work?"
Step 1: Search docs → find policy document
Step 2: Pass to LLM: "Based on this doc, answer: ..."
LLM: "The policy allows 2 days per week remote work"
✅
```

---

## The Naive RAG Pipeline

Naive RAG is the simplest version: retrieve → pass to LLM → generate answer.

```
┌─────────────────────────────────────────────────────────┐
│  Naive RAG Pipeline                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. USER QUERY                                         │
│     "What's the return policy?"                        │
│                                                         │
│  2. RETRIEVE (from vector DB)                         │
│     Query → Embed → Find top-5 similar chunks         │
│     Retrieved: [chunk_A, chunk_B, ...]                │
│                                                         │
│  3. BUILD PROMPT                                      │
│     "Context: {chunks}                                │
│      Question: {query}                                │
│      Answer:"                                         │
│                                                         │
│  4. GENERATE                                          │
│     LLM processes prompt → generates answer           │
│                                                         │
│  5. RETURN ANSWER                                     │
│     User sees: "Return policy: 30 days from purchase" │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1: Offline Indexing (One-time)

```python
# Pseudo-code for indexing

documents = load_documents("docs/")           # Load all docs

chunks = []
for doc in documents:
    doc_chunks = chunk(doc, size=500)        # Split into chunks
    chunks.extend(doc_chunks)

embeddings = []
for chunk in chunks:
    embedding = embed_model.encode(chunk)    # Embed each chunk
    embeddings.append({
        "text": chunk,
        "embedding": embedding,
        "metadata": {...}
    })

vector_db.index(embeddings)                  # Store in vector DB
```

**Result:** Vector DB now has 10,000 chunks indexed and searchable.

---

## Step 2: Runtime Query Processing

```python
# When user asks a question

user_query = "What's the return policy?"

# Step A: Embed the query
query_embedding = embed_model.encode(user_query)

# Step B: Search vector DB
results = vector_db.search(
    query_embedding,
    k=5  # retrieve top-5 chunks
)

# Returns:
# [
#   {"text": "Return within 30 days...", "score": 0.95},
#   {"text": "Refund process: ...", "score": 0.92},
#   ...
# ]
```

---

## Step 3: Build RAG Prompt

```
Combine retrieved chunks + query into prompt:

┌──────────────────────────────────────────────┐
│ SYSTEM PROMPT (optional)                     │
│ "You are a helpful customer service bot."   │
│                                              │
│ CONTEXT (retrieved chunks)                   │
│ "Based on these docs:                       │
│  Doc 1: Return within 30 days from purchase │
│  Doc 2: Refund process takes 5-7 days       │
│  Doc 3: ..."                                │
│                                              │
│ USER QUESTION                                │
│ "What's the return policy?"                 │
│                                              │
│ INSTRUCTIONS                                │
│ "Answer using only the provided context..." │
└──────────────────────────────────────────────┘
```

---

## Step 4: Generate Answer

```python
response = llm.complete(rag_prompt)

# Result:
# "Based on the company policy, you can return items 
#  within 30 days of purchase. The refund process 
#  takes 5-7 business days."
```

---

## Why Naive RAG Works

```
Without RAG:
├─ LLM only knows what it learned during training
├─ Can't answer questions about recent docs/company-specific info
└─ Hallucinate answers ❌

With Naive RAG:
├─ LLM gets fresh, relevant context
├─ Answers based on actual documents
└─ Fewer hallucinations ✅
```

---

## Naive RAG Implementation (Pseudocode)

```python
class NaiveRAG:
    def __init__(self, vector_db, llm, embed_model):
        self.vector_db = vector_db      # Pinecone, Chroma, etc.
        self.llm = llm                  # OpenAI, Claude, etc.
        self.embed_model = embed_model  # BGE, OpenAI embeddings, etc.
    
    def index_documents(self, documents):
        """Offline: Index all documents"""
        for doc in documents:
            chunks = chunk(doc, size=500)
            for chunk in chunks:
                embedding = self.embed_model.encode(chunk)
                self.vector_db.add({
                    "text": chunk,
                    "embedding": embedding,
                    "metadata": {"source": doc.name}
                })
    
    def query(self, user_query):
        """Runtime: Answer user question"""
        # Step 1: Embed query
        query_embedding = self.embed_model.encode(user_query)
        
        # Step 2: Retrieve top-k chunks
        retrieved = self.vector_db.search(query_embedding, k=5)
        context = "\n".join([r["text"] for r in retrieved])
        
        # Step 3: Build prompt
        prompt = f"""Context:
{context}

Question: {user_query}

Answer based on the context above:"""
        
        # Step 4: Generate answer
        answer = self.llm.complete(prompt)
        return answer
```

---

## Example: Legal Document QA

```
INDEXING PHASE:
├─ Load: 100 legal contracts (50,000 tokens total)
├─ Chunk: Split into 500-token chunks → 100 chunks
├─ Embed: Each chunk → 768-dim vector (BGE)
├─ Index: Store in Pinecone
└─ Total: 100 chunks indexed

QUERY TIME:
User: "What are the penalty terms in the contract?"

1. Embed query: [0.5, -0.3, 0.2, ...]
2. Search: Find top-3 chunks about penalties
3. Prompt: "Context: {penalty_chunks}
            Q: What are penalty terms?
            A:"
4. LLM generates: "Penalties include $100/day for late payment,
                   capped at $5000 per incident."
```

---

## Limitations of Naive RAG

❌ **Retrieval can fail silently**
```
Query: "Return policy for electronics"
Retrieved: Chunks about clothing return policy
LLM answers based on wrong chunk ❌
Problem: Similarity alone doesn't guarantee relevance
```

❌ **Top-k might not be enough**
```
Query is complex, needs multiple fragments
Top-5 chunks might not contain all needed info
Answer is incomplete ❌
```

❌ **No reranking**
```
Vector similarity: [0.95, 0.92, 0.88, 0.87, 0.85]
What if chunk 3 is actually more relevant? (similarity is noisy)
```

❌ **No query understanding**
```
User asks: "Compare pricing in Q3 vs Q4"
Vector search finds Q3 data
But misses Q4 data (two separate queries needed)
```

❌ **Embedding drift**
```
Query about "latest earnings report"
Embedding trained on old data
Misses semantic meaning of "latest" ❌
```

---

## When Naive RAG is Good Enough

✅ Simple question-answering (FAQ bots)
✅ High-quality retrieved chunks guaranteed to contain answer
✅ Homogeneous documents (all same format)
✅ Questions are straightforward (not comparative, multi-hop)
✅ Fast speed is more important than perfect accuracy

---

## When You Need Advanced RAG

❌ Complex queries (multi-hop reasoning)
❌ Retrieved chunks might be noisy
❌ Need to compare multiple pieces of info
❌ Accuracy is critical (legal, medical, financial)

**→ Move to Advanced RAG** (query rewriting, HyDE, reranking, etc.)

---

## Key Takeaways

✅ Naive RAG = retrieve top-k chunks + pass to LLM

✅ Three main phases: **Indexing (offline)** → **Retrieval (runtime)** → **Generation**

✅ Works well for simple QA tasks where document is clearly relevant

✅ Fails when similarity alone doesn't guarantee relevance

✅ Fails on complex, multi-step questions

✅ Silent failures: retrieved wrong chunk, LLM answers confidentl

y but wrongly

**Next:** Improve retrieval quality with advanced RAG techniques → Advanced RAG
