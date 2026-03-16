# 02. Tokenization & Context Windows

## What is a Token?

A token is the **atomic unit** that LLMs read.

```
Text:       "Hello, world!"
Tokens:     ["Hello", ",", "world", "!"]  or  ["Hel", "lo", ",", "wo", "rld", "!"]

An LLM doesn't see characters or words — it sees token IDs:
"Hello" → token_id: 15496
","     → token_id: 11

Then the model processes: [15496, 11, 28357, 28808]
```

**Key insight:** Tokens are NOT words. They're variable-length pieces.

---

## How Tokenization Works

Text → **Tokenizer** → Token IDs → **LLM** → Output Tokens → **Detokenizer** → Text

### The Process

```
Input Text:  "The quick brown fox"

Step 1: Vocabulary Lookup
  "The"    → [1, 0, 0, 0]  (index 1 in vocab)
  "quick"  → [0, 1, 0, 0]  (index 1)
  "brown"  → [0, 0, 1, 0]  (index 2)
  "fox"    → [0, 0, 0, 1]  (index 3)

Step 2: Feed to LLM
  Model processes sequence: [1, 1, 2, 3]
  
Step 3: Output tokens → detokenize back to text
  Output IDs: [4, 5, 3]  →  "Excellent brown fox"
```

---

## Different Tokenizers Exist

Different LLMs use different tokenizers!

| Model | Tokenizer | Tokens Per Word |
|---|---|---|
| **ChatGPT (gpt-4)** | cl100k_base | ~1.3 |
| **Claude** | Claude tokenizer | ~1.2 |
| **Llama 2** | tiktoken-based | ~1.2 |
| **GPT-2** | BPE (byte-pair encoding) | ~1.4 |

**Why it matters:** Same prompt = different token counts in different models! 

```
Prompt: "Hello, how are you today?"

OpenAI:   5 tokens
Claude:   6 tokens
Llama:    5 tokens
```

---

## Context Window

The **context window** is the maximum number of tokens an LLM can process at once.

```
┌─────────────────────────────────────────────────────┐
│  LLM Context Window (e.g., 4K tokens)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [System Prompt]  +  [User Message]  +  [History]  │
│    200 tokens        1000 tokens       2000 tokens  │
│                                                     │
│  ← This all fits in 4K window ✅                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Window Limits by Model

| Model | Context Window | Cost for Extra? |
|---|---|---|
| **GPT-4o mini** | 128K tokens | No extra |
| **Claude 3.5 Sonnet** | 200K tokens | No extra |
| **Llama 3.1 (Open)** | 128K tokens | Free |
| **GPT-4 Turbo** | 128K tokens | Same price |

---

## What Happens When You Exceed Context?

```
Your Input:  1500 tokens
Model Limit: 1024 tokens

Result:  ❌ ERROR or ❌ TRUNCATION

Common behaviors:
  1. Error: "Input exceeds max length"
  2. Truncate: Keep only first 1024 tokens (lose tail)
  3. Sliding window: Keep recent tokens, drop old ones
```

### The Problem Chain

```
Long Document (10,000 tokens)
    ↓
Exceeds context window (4K)
    ↓
Must be broken into chunks
    ↓
Chunks sent separately to LLM
    ↓
Chunks ranked/reranked
    ↓
Only best chunks included in prompt
```

💡 This is why **chunking** exists — foundation for RAG!

---

## Token Counting

Before you send a prompt, count tokens:

```
Python Example (using tiktoken):

import tiktoken
enc = tiktoken.encoding_for_model("gpt-4")

text = "Hello, how are you?"
tokens = enc.encode(text)
print(len(tokens))  # Output: 5
```

### Rule of Thumb

```
1 word     ≈ 1.3 tokens
1 sentence ≈ 5-10 tokens
1 paragraph ≈ 50-100 tokens
1 page     ≈ 300-500 tokens
```

---

## Context Window Optimization

### Strategy 1: Summarization
```
Long doc (8K tokens) → Summarize → (500 tokens) ✅ fits in window
```

### Strategy 2: Chunking + Retrieval (RAG)
```
Long doc (8K) → Split into 4 chunks (2K each)
              → Only retrieve relevant chunk
              → Include in prompt (fits!)
```

### Strategy 3: Prompt Compression
```
Original: "The quick brown fox jumps over the lazy dog"
Compressed: "Fox over dog"
(keeps meaning, cuts tokens)
```

---

## Special Tokens

LLMs also use special tokens you don't see:

```
<|start_of_prompt|>  [Marks beginning of your input]
<|end_of_prompt|>    [Marks end of your input]
<|im_start|>         [Message boundary in multi-turn]
<|im_end|>           [End of turn]
```

These consume tokens but are invisible!

```
Your input: "Hello"
Actual tokens to model: <start> Hello <end>  = 3 tokens, not 1!
```

---

## Why This Matters for RAG

```
STEP 1: User Query
  Tokens: 50

STEP 2: Retrieve Chunks from Vector DB
  3 chunks × 300 tokens each = 900 tokens

STEP 3: System Prompt + Instructions
  Tokens: 200

STEP 4: Historical Context
  Tokens: 100

TOTAL: 50 + 900 + 200 + 100 = 1250 tokens

If model limit is 2K: ✅ fits
If model limit is 1K:  ❌ need to trim chunks
```

---

## Practical Example: Building a RAG System

### Bad Approach
```
User: "Explain X"
Retrieved: top-10 chunks (each 500 tokens) = 5000 tokens
System: 500 tokens
Total: 5500 tokens → EXCEEDS GPT-4 mini's 128K ✅ fits, but expensive!
```

### Good Approach
```
User: "Explain X"
Retrieved: top-3 chunks (300 tokens each) = 900 tokens
System: 200 tokens
Total: 1100 tokens → ✅ fits, cheaper, faster
```

**Trade-off:** Fewer chunks = faster/cheaper but less context

---

## Common Pitfalls

❌ **Not counting tokens before API call**
- Surprise! Your 8K prompt exceeds limit
- → Solution: Always estimate/count before sending

❌ **Including unnecessary context**
- Passing entire document when only summary needed
- → Solution: Extract relevant section first

❌ **Forgetting special token overhead**
- Raw text = 100 tokens, but with special tokens = 120 tokens
- → Solution: Add 10-20% buffer when estimating

❌ **Using old tokenizer data**
- You optimized for GPT-3, but now using GPT-4 (different tokenizer)
- → Solution: Re-count for each model

---

## Key Takeaways

✅ Tokens are variable-length pieces, not words (1 word ≈ 1.3 tokens)

✅ Different models have different tokenizers — same text = different token count

✅ Context window = max tokens the model can process at once

✅ When input exceeds window, it gets truncated or errors

✅ This is why chunking + retrieval (RAG) is essential for long documents

✅ Always estimate token count before sending to API

**Next:** How to engineer prompts to maximize model output quality → Prompt Engineering
