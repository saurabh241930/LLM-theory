# 08. RAG Evaluation

## The Problem: How Good is Your RAG?

You built a RAG system, but how do you know if it's working well?

```
Question: "What's the return policy?"
Retrieved chunks: [chunk_A, chunk_B, chunk_C]
Generated answer: "Return items within 30 days"

✓ Looks correct, but is it?
- Did we retrieve the right chunks?
- Is the answer faithful to those chunks?
- Did we cover all relevant information?
```

You need metrics.

---

## RAGAS Framework

**RAGAS = Retrieval-Augmented Generation Assessment**

RAGAS measures RAG quality with 4 key metrics:

```
┌─────────────────────────────────────────────────┐
│  RAGAS: 4 Metrics for RAG Evaluation            │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. FAITHFULNESS      (0-1)                    │
│     Is answer faithful to retrieved chunks?    │
│                                                 │
│  2. ANSWER_RELEVANCY  (0-1)                    │
│     Does answer address the question?          │
│                                                 │
│  3. CONTEXT_RECALL    (0-1)                    │
│     Did we retrieve all needed information?    │
│                                                 │
│  4. CONTEXT_PRECISION (0-1)                    │
│     Are retrieved chunks relevant?             │
│                                                 │
│  Overall Score: Usually average of 4 metrics   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Metric 1: Faithfulness

**Definition:** Is the generated answer based on retrieved chunks?

**Why it matters:** Answer might be correct but hallucinated (not from actual chunks).

```
Question: "What's the CEO's name?"
Retrieved: ["John Smith is the CEO... Founded in 1998"]
Answer: "John Smith is the CEO"  ✅ Faithful

vs.

Question: "What's the CEO's name?"
Retrieved: ["This company was founded in 1998"]
Answer: "John Smith is the CEO"  ❌ Hallucinated (not in chunks!)
```

**How RAGAS measures it:**
Uses an LLM to check if each claim in answer is supported by context.

```python
answer = "John Smith is the CEO and founder"
context = ["John Smith is the CEO"]

LLM: "Is 'John Smith is the CEO' in context? YES"
LLM: "Is 'founder' mentioned in context? NO"

2 claims, 1 supported → faithfulness = 1/2 = 0.5
```

**Score interpretation:**
```
Faithfulness = 1.0 → Perfect (all claims supported)
Faithfulness = 0.7 → Good (most claims supported)
Faithfulness = 0.3 → Bad (most hallucinated)
```

---

## Metric 2: Answer Relevancy

**Definition:** Does the answer actually answer the question?

**Why it matters:** You might answer correctly but off-topic.

```
Question: "What does the company do?"
Answer: "The company was founded in 1950"  ❌ Doesn't answer

Question: "What does the company do?"
Answer: "The company builds software for healthcare"  ✅ Directly answers
```

**How RAGAS measures it:**
Uses LLM to judge if answer addresses the question.

```python
question = "What does the company do?"
answer = "The company was founded in 1950"

LLM: "Does answer explain what company does? NO"
LLM: Relevancy score → 0.2 (low)
```

**Score interpretation:**
```
Answer_Relevancy = 1.0 → Perfectly answers question
Answer_Relevancy = 0.6 → Partially answers
Answer_Relevancy = 0.1 → Off-topic
```

---

## Metric 3: Context Recall

**Definition:** Did we retrieve all chunks needed to answer?

**Why it matters:** If answer quality is good but based on incomplete retrieved chunks, it's luck.

```
Question: "Compare Q3 and Q4 earnings"
Retrieved: [Q3 earnings chunk]  ❌ Missing Q4 chunk

Answer relies on incomplete context.
```

**How RAGAS measures it:**
Uses LLM to check if all claims in answer are supported by retrieved chunks.

```python
answer = "Q3 was $10M and Q4 was $12M"
context = ["Q3 earnings: $10M"]

LLM: "Is Q3 figure in context? YES"
LLM: "Is Q4 figure in context? NO"  ← Missing!

Context_Recall = 1/2 = 0.5 (should be 1.0 ideally)
```

**Score interpretation:**
```
Context_Recall = 1.0 → Retrieved everything needed
Context_Recall = 0.8 → Retrieved most needed chunks
Context_Recall = 0.3 → Missed important chunks
```

---

## Metric 4: Context Precision

**Definition:** Are retrieved chunks relevant to the question?

**Why it matters:** If you retrieve 100 chunks but only 5 are useful, precision is low.

```
Question: "What's the return policy?"
Retrieved: [return_policy_chunk, CEO_bio_chunk, office_hours_chunk]

Precision = 1/3 = 0.33 (only return_policy is relevant)
```

**How RAGAS measures it:**
Uses LLM to judge if each chunk is actually relevant.

```python
question = "What's the return policy?"
chunks = [
  "Return policy: 30 days...",  ✅ Relevant
  "CEO founded company",         ❌ Not relevant
  "Office in NYC",               ❌ Not relevant
]

Context_Precision = 1/3 = 0.33
```

**Score interpretation:**
```
Context_Precision = 1.0 → All retrieved chunks relevant
Context_Precision = 0.8 → Most chunks relevant
Context_Precision = 0.3 → Many irrelevant chunks
```

---

## RAGAS in Practice

### Example: Customer Support RAG

```
Question: "What's the warranty period for electronics?"

Retrieved chunks:
1. "Electronics warranty: 2 years from purchase"
2. "How to claim warranty..."
3. "Shipping costs to NYC"

Generated answer:
"Electronics have a 2-year warranty from purchase date."

RAGAS EVALUATION:
├─ Faithfulness = 1.0 (answer supported by chunk 1)
├─ Answer_Relevancy = 1.0 (directly answers question)
├─ Context_Recall = 0.95 (retrieves relevant chunks, minor detail missed)
├─ Context_Precision = 0.67 (chunks 1-2 relevant, chunk 3 not)
└─ Overall Score: (1.0 + 1.0 + 0.95 + 0.67) / 4 = 0.91 ✅ Excellent!
```

### Another Example: Poor RAG

```
Question: "What's the return policy?"

Retrieved chunks:
1. "Shipping costs..."
2. "Company history..."
3. "Office locations..."

Generated answer:
"I don't know the exact policy, but you should contact customer service."

RAGAS EVALUATION:
├─ Faithfulness = 1.0 (answer is truthful: "I don't know")
├─ Answer_Relevancy = 0.3 (doesn't answer the question)
├─ Context_Recall = 0.0 (no relevant chunks retrieved)
├─ Context_Precision = 0.0 (no relevant chunks)
└─ Overall Score: (1.0 + 0.3 + 0.0 + 0.0) / 4 = 0.325 ❌ Poor!

Problem: Wrong chunks retrieved → Retrieval failure
```

---

## How to Use RAGAS

### Step 1: Install RAGAS

```bash
pip install ragas
```

### Step 2: Evaluate Your RAG

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall

# Prepare test dataset
eval_dataset = [
    {
        "question": "What's the return policy?",
        "ground_truth": "Return within 30 days of purchase",  # Expected answer
        "answer": "Return items within 30 days",               # Your RAG's answer
        "contexts": ["Return policy: 30 days from purchase..."] # Retrieved chunks
    },
    # ... more examples
]

# Evaluate
results = evaluate(
    eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)

print(results)
# Output:
# faithfulness:      0.95
# answer_relevancy:  0.92
# context_precision: 0.88
# context_recall:    0.89
```

---

## Interpreting RAGAS Results

### Diagnostic Guide

```
💚 All scores > 0.80?
└─ Your RAG is excellent ✅

🟢 Most scores 0.60-0.80?
├─ Retrieval is decent
└─ Focus on improving answer generation

🟡 Context scores < 0.60?
├─ Problem: Retrieval is failing
└─ Fix: Improve embedding model, chunking, or add reranking

🔴 Answer_Relevancy < 0.60?
├─ Problem: Generated answer doesn't answer question
└─ Fix: Improve prompt engineering, add few-shot examples

🔴 Faithfulness < 0.60?
├─ Problem: LLM is hallucinating
└─ Fix: Use better model, stricter prompt ("answer only from context")
```

---

## Creating a Test Dataset

For evaluation, you need ground truth (expected answers).

```python
test_dataset = [
    {
        "question": "What is the CEO's name?",
        "ground_truth": "John Smith",
        "answer": "The CEO is John Smith",
        "contexts": ["John Smith became CEO in 2020..."]
    },
    {
        "question": "What year was the company founded?",
        "ground_truth": "1995",
        "answer": "The company was founded in 1995",
        "contexts": ["Founded in 1995 by..."]
    },
    # ... more examples
]
```

**Recommendation:** Start with 10-20 test questions, expand to 100+ for comprehensive evaluation.

---

## Improving RAG Based on RAGAS

```
RAGAS Result: Low Context_Precision (0.4)

Problem: Retrieving irrelevant chunks

Solutions (in order of effort + impact):
1. Add reranking (1 hour) → Impact: +0.2
2. Improve chunking strategy (2 hours) → Impact: +0.15
3. Fine-tune embedding model (1-2 days) → Impact: +0.25
4. Hybrid search (1 hour) → Impact: +0.1

Start with #1 (quick win), then add more as needed.
```

---

## Beyond RAGAS: Human Evaluation

RAGAS is automatic but imperfect. Always do **human spot-checks**.

```python
# Sample 10 test cases
# Have humans rate:
# 1. Is answer correct? (Yes/No)
# 2. Is answer complete? (Yes/No)
# 3. Is answer helpful? (1-5 scale)

# Compare human ratings vs RAGAS scores
# Identify where RAGAS disagrees with humans
# Improve metrics or system accordingly
```

---

## Key Takeaways

✅ **Faithfulness** — Answer supported by chunks (not hallucinated)

✅ **Answer Relevancy** — Answer addresses the question

✅ **Context Recall** — Retrieved all needed information

✅ **Context Precision** — Retrieved chunks are relevant

✅ **RAGAS** provides automatic evaluation using LLM-as-judge

✅ Create test datasets with ground truth answers

✅ Use RAGAS scores to diagnose problems (retrieval vs generation)

✅ Always validate with human evaluation

✅ Iterate: Test → Evaluate → Improve → Repeat

**Next:** Structured outputs from LLMs → Function Calling & NL-to-SQL
