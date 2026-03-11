# 12. When to Fine-Tune vs RAG vs Prompt

## The Three Levers

You have three ways to improve LLM outputs:

```
┌──────────────────────────────────────────────────────┐
│  How to Improve LLM Performance                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  LEVER 1: PROMPTING                                 │
│  ├─ Cost: Free                                       │
│  ├─ Time: Minutes                                    │
│  ├─ Best for: Simple tasks, few-shot learning       │
│  └─ Example: "Classify as positive or negative"     │
│                                                      │
│  LEVER 2: RAG (Retrieval)                           │
│  ├─ Cost: Moderate ($0.001 per query)               │
│  ├─ Time: Hours/days (build retrieval pipeline)     │
│  ├─ Best for: Knowledge-heavy, domain-specific      │
│  └─ Example: "Customer support FAQs"                │
│                                                      │
│  LEVER 3: FINE-TUNING                              │
│  ├─ Cost: High ($100s-$1000s)                       │
│  ├─ Time: Days/weeks (collect data, train)          │
│  ├─ Best for: Behavior change, style, decisions     │
│  └─ Example: "Classify medical reports like Dr X"   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Decision Tree

```
Question: "How should I improve my LLM?"

START
└─ Does the model lack KNOWLEDGE about your domain?
   ├─ YES → Use RAG (retrieval adds knowledge without retraining)
   │        Example: Legal docs, medical records, company data
   │
   └─ NO → Continue
      └─ Does the model lack STYLE/BEHAVIOR in your domain?
         ├─ YES → Fine-tune (teach desired behavior)
         │        Example: Customer support tone, medical terminology
         │
         └─ NO → Continue
            └─ Can you solve with better PROMPTS?
               ├─ YES → Use prompting (free, fast)
               │        Example: Add examples, ask to think step by step
               │
               └─ NO → Fine-tune (last resort)
```

---

## Comparison: Prompting vs RAG vs Fine-Tuning

| Aspect | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| **Problem it solves** | "How do I guide the model?" | "How do I add knowledge?" | "How do I change behavior?" |
| **Cost** | $0 | $0.001-0.01 per query | $100-5000 initial + compute |
| **Speed** | Minutes (write prompt) | Hours-Days (build pipeline) | Days-Weeks (collect data, train) |
| **Knowledge** | Uses pretraining | Adds new knowledge (retrieval) | Doesn't add knowledge (wastes capacity) |
| **Behavior** | Limited control | Medium control (with examples) | Full control |
| **Setup complexity** | Simple (just write) | Medium (embeddings, DB) | Hard (data, compute, tuning) |
| **Performance ceiling** | ~80% (what pretraining allows) | ~90% (with good retrieval) | ~95%+ (if data is good) |

---

## Real Examples: Which Lever?

### Example 1: Customer Support Chatbot

```
Requirements:
├─ Answer questions about policies
├─ Maintain company tone (friendly, professional)
└─ Handle 10,000 FAQs

Analysis:
├─ Knowledge-heavy? YES → Need RAG (can't memorize 10K FAQs)
├─ Behavior specific? MAYBE → Tone is somewhat standard
└─ Simple problem? NO → Complex knowledge base

SOLUTION: RAG + Prompting
├─ RAG: Store FAQ embeddings, retrieve relevant docs
├─ Prompting: "You are a helpful support agent. Be friendly but professional."
└─ Skip fine-tuning (overkill for this)

Cost: ~$100/month in API calls
```

### Example 2: Medical Report Classification

```
Requirements:
├─ Classify reports as urgent/non-urgent
├─ Match hospital's specific criteria
└─ High accuracy required

Analysis:
├─ Knowledge-heavy? NO (rules are simple)
├─ Behavior specific? YES (needs to learn hospital's decision criteria)
└─ Needs examples? YES (many edge cases)

SOLUTION: Prompting + Fine-tuning
├─ Prompting first: Few-shot examples (might be enough)
├─ If accuracy still low → Fine-tune on annotated reports
└─ Skip RAG (not knowledge-heavy)

Cost: Few-shot = free; Fine-tuning = $1000
```

### Example 3: Code Generation

```
Requirements:
├─ Generate Python code for data science tasks
├─ Use company libraries/conventions
└─ Handle proprietary APIs

Analysis:
├─ Knowledge-heavy? YES (company libs, APIs)
├─ Behavior specific? YES (coding style, architecture)
└─ Both! → Combination approach

SOLUTION: RAG + Fine-tuning (Both)
├─ RAG: Embed code examples, API docs, retrieve context
├─ Fine-tuning: Small dataset of {task, desired code}
└─ Together: Model has knowledge (RAG) + style (fine-tuned)

Cost: moderate ($500-2000)
```

---

## When Prompting is Enough

```
✅ Use prompting if:

1. Task is simple
   └─ "Classify sentiment" (not " answer legal questions")

2. Model already knows the domain
   └─ "Summarize news" (model was trained on news)

3. Few-shot examples work
   └─ Accuracy goes from 60% → 90% with 5 examples

4. You want immediate results
   └─ No 2-hour setup time

5. Cost matters
   └─ Can't afford $1000s for training

Example problems to solve with prompting:
├─ Classification (positive/negative/neutral)
├─ Summarization
├─ Translation
├─ Format conversion (CSV → JSON)
└─ Simple question answering (when knowledge is in pretraining)
```

---

## When RAG is Needed

```
✅ Use RAG if:

1. You have external documents
   └─ "Answer questions about company policies"

2. Knowledge is frequently updated
   └─ Docs change weekly → can't retrain
   └─ Just re-embed new docs

3. You need to attribute sources
   └─ "Which document contains this fact?"

4. Query latency > 1 second is acceptable
   └─ (RAG adds 100-500ms)

5. You want to avoid retraining infrastructure
   └─ Cheaper than fine-tuning

Example problems ideal for RAG:
├─ Customer support (FAQ databases)
├─ Legal Q&A (contracts, policies)
├─ Medical Q&A (clinical guidelines)
├─ Internal knowledge bases (wikis, runbooks)
└─ Document QA (research papers, books)
```

---

## When Fine-Tuning is Necessary

```
✅ Invest in fine-tuning if:

1. Prompting/few-shot doesn't reach target accuracy
   └─ You need 95% accuracy, few-shot gets 70%

2. You need cost reduction at scale
   └─ 1M queries/month → smaller model needed
   └─ Fine-tune cheaper model vs API calls

3. You need latency guarantees
   └─ Local inference (no API calls)
   └─ Fine-tune small model, deploy locally

4. You need specific behavior/style
   └─ "Answer like a Shakespearean character"
   └─ "Always use technical jargon"

5. You need to remove knowledge
   └─ "Don't mention competitor X"
   └─ Fine-tune to decline answering

Example problems requiring fine-tuning:
├─ Specialized classification (medical, legal)
├─ Style/tone matching (brand voice)
├─ Domain-specific generation (protein design, code gen)
├─ Instruction following (specific formats)
└─ Behavioral constraints (safety, refusals)
```

---

## Cost Analysis Framework

```
Calculate cost-benefit for each approach:

PROMPTING:
  Cost: ~$0
  Setup time: 2 hours
  Query cost: $0 (free examples)
  Total: minimal
  If works: ✅ STOP HERE (best outcome)

RAG:
  Cost: ~$500 (vector DB, embeddings)
  Setup time: 20 hours
  Query cost: $0.001 per query
  For 100K queries/month: $100
  Total first month: ~$600
  If improves accuracy by 20%: ✅ GOOD ROI

FINE-TUNING:
  Cost: $1000-5000 (data collection + training)
  Setup time: 100-200 hours
  Query cost: ~$0 (local inference)
  For 100K queries/month: maybe $500 compute
  Total first month: ~$2000 (plus ongoing)
  
  Breakeven analysis:
  └─ If reduces query costs by $1/query
     → Fine-tuning breaks even after 2000 queries
  └─ If improves accuracy (business value)
     → ROI depends on business impact
```

---

## The Common Mistake

**People jump straight to fine-tuning.**

```
Mistaken thinking:
"Fine-tuning sounds hardcore. Let me do it."

Reality:
├─ 80% of problems solvable with better prompting
├─ 15% need RAG
└─ 5% actually need fine-tuning

Consequences:
├─ Waste $1000s on data annotation
├─ 2-4 week timeline (vs 1 day for RAG)
├─ May not even improve results!

Better approach:
1. Try prompting (30 minutes)
2. Try RAG (1-2 days)
3. Only then, fine-tune (if needed)
```

---

## Decision Checklist

```
Question: Should I fine-tune?

□ Have I tried few-shot prompting? (Required)
  └─ If not, try it first!

□ Is my problem knowledge-heavy?
  └─ If YES → Use RAG instead
  └─ If NO → Continue

□ Have I built a RAG system?
  └─ If not → Try RAG first!
  └─ If already done and still not good → Continue

□ Do I have a labeled dataset (50+ examples)?
  └─ If no → Can't fine-tune effectively

□ Is accuracy gap significant?
  └─ Current: 70%, Target: 95%?
  └─ If only 70 → 75%, probablynot worth fine-tuning

□ Do I have compute infrastructure?
  └─ GPU/TPU, monitoring, deployment pipeline?
  └─ If no → Expensive and risky

If all above ✅, then fine-tune. Otherwise, reconsider.
```

---

## Key Takeaways

✅ **Prompting** — Free, fast, try first (good for simple tasks)

✅ **RAG** — Adds knowledge without retraining (good for docs/FAQs)

✅ **Fine-tuning** — Changes behavior/style (expensive, slow, last resort)

✅ **Decision:** Knowledge-heavy? → RAG. Behavior-specific? → Fine-tune. Simple? → Prompt.

✅ **Most systems** should be: Prompting + RAG, NOT fine-tuning

✅ **Fine-tuning ROI** is positive only for high-volume, high-accuracy needs

**Next:** If you decide to fine-tune, understand the techniques → Fine-tuning Methods
