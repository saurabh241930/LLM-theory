# 14. Instruction Tuning, RLHF, and DPO

## The Alignment Problem

A pre-trained LLM can do many things, but it's **not optimized for being helpful**.

```
Pre-trained LLM: Generates text based on patterns in training data

Problem:
├─ Might output toxic content
├─ Might refuse to help (data had few examples)
├─ Might hallucinate (never trained to say "I don't know")
└─ Might not follow complex instructions

Solution: **Alignment** = teach the model to be helpful, harmless, honest
```

---

## Technique 1: Instruction Tuning

**Instruction tuning** = teach the model to follow instructions.

### The Idea

Train on high-quality {instruction, response} pairs.

```
Dataset (instruction tuning):
├─ Input: "Classify this as positive or negative: 'I love this!'"
│  Output: "Positive"
│
├─ Input: "Summarize in 3 sentences: [long article]"
│  Output: "[3-sentence summary]"
│
├─ Input: "What is quantum computing?"
│  Output: "[educational explanation]"
└─ More examples...

Training:
├─ Fine-tune on all {instruction, output} pairs
├─ Model learns: "Follow instructions well"
└─ Result: Instruction-following model
```

### Why it matters

```
Before instruction tuning:
Q: "Do task X"
A: Random continuation of text (doesn't follow instruction)

After instruction tuning:
Q: "Do task X"
A: Properly completed task X
```

### Popular datasets

```
Alpaca (52K examples):
├─ Instruction: "Explain why the sky is blue"
├─ Input: (optional context)
└─ Output: "The sky appears blue because..."

ShareGPT (500K examples):
├─ Real user conversations with ChatGPT
├─ Diverse tasks: coding, writing, analysis
└─ Very high quality

Evol-Instruct:
├─ 144K complex instructions
├─ Iteratively made harder
└─ Forces model to handle nuance
```

---

## Technique 2: RLHF (Reinforcement Learning from Human Feedback)

**RLHF** is how ChatGPT and Claude were made so helpful.

### The Problem RLHF Solves

```
Instructions alone aren't enough.

Example: "Write a poem"
Instruction-tuned model: [generates a poem]
But which poem is GOOD?
├─ Rhyming or free verse?
├─ Happy or sad?
└─ 4 lines or 20 lines?

Many valid answers. Instructions don't specify preference.

Solution: Use human feedback to teach preference.
```

### How RLHF Works

```
STEP 1: GENERATE CANDIDATES
├─ Prompt: "Write a poem about summer"
├─ Generate N responses from model
└─ Keep top-3 (varies by method)

STEP 2: HUMAN RANKING
├─ Show 3 responses to human annotators
├─ Rank: 1st best, 2nd, 3rd best
├─ Example:
│  Rank 1: "Summer heat beats down..." [detailed, beautiful]
│  Rank 2: "Summer is warm and bright" [okay, generic]
│  Rank 3: "Summer..." [incomplete, bad]
└─ Collect thousands of such rankings

STEP 3: TRAIN REWARD MODEL
├─ Use rankings to train a "reward model"
├─ Reward model learns: "Detailed + poetic = high reward"
├─ Input: response text
├─ Output: score (0-1)

STEP 4: RL TRAINING
├─ Use reward model to train LLM
├─ Objective: "Maximize reward for your outputs"
├─ Method: Policy Gradient (PPO algorithm)
├─ LLM learns: "Generate high-reward responses"

RESULT: Model generates responses humans like!
```

### Why it's effective

```
Humans prefer:
├─ Helpful responses (answer the question)
├─ Harmless responses (no toxic content)
├─ Honest responses (admit uncertainty)
└─ Detailed responses (explain, don't summarize)

RLHF teaches all of this by example.
├─ Annotators show preference for helpful content
├─ Reward model learns this preference
├─ LLM optimizes for the preference
```

---

## Technique 3: DPO (Direct Preference Optimization)

**DPO** is a newer alternative to RLHF. Simpler, faster.

### The Problem with RLHF

```
RLHF has 3 stages:
1. Train instruction-tuned model ← complex
2. Collect human preferences & train reward model ← time-consuming
3. Run RL training with PPO ← computationally expensive

Total time: weeks
Total cost: $100K+
```

### How DPO Works (Simplified)

```
Instead of 3 stages, do 1 simplified stage.

Core idea:
└─ Use preference pairs directly without explicit reward model
   └─ Just grade comparisons: "Response A > Response B"

Process:
1. Collect preference pairs
   ├─ Prompt: "Write a short poem"
   ├─ Response A: [detailed poem]
   ├─ Response B: [one-liner]
   ├─ Label: A is better

2. Fine-tune directly on preferences
   ├─ Objective: "Make preferred responses more likely"
   ├─ No explicit reward model needed
   ├─ No separate RL stage
   └─ Result: Aligned model!

Timeline: Days instead of weeks
Cost: 10x cheaper than RLHF
```

### DPO vs RLHF

| Aspect | RLHF | DPO |
|---|---|---|
| **Stages** | 3 (instruction → reward → RL) | 1 (direct preference training) |
| **Time** | 2-4 weeks | 2-5 days |
| **Cost** | $100K+ | $10K |
| **Accuracy** | ⭐⭐⭐⭐ Very good | ⭐⭐⭐⭐ Similar or better |
| **Implementation** | Complex (PPO algorithm) | Simple (supervised fine-tune) |
| **Adoption** | ChatGPT, Claude | Recent, gaining adoption |

---

## Comparison: Instruction Tuning vs RLHF vs DPO

```
┌─────────────────────────────────────────────────────┐
│  Three Ways to Align Models                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  INSTRUCTION TUNING                                │
│  ├─ Train on {instruction, output} pairs          │
│  ├─ Teaches: How to follow instructions           │
│  ├─ Cost: Low ($10K)                              │
│  ├─ Result: Good at tasks (70-80% quality)        │
│  └─ Example: Text-davinci-003                     │
│                                                     │
│  RLHF                                              │
│  ├─ Train reward model, then use RL               │
│  ├─ Teaches: What humans prefer                   │
│  ├─ Cost: High ($100K+)                           │
│  ├─ Result: Very helpful, polished (90%+)         │
│  └─ Example: ChatGPT, Claude 1                    │
│                                                     │
│  DPO                                               │
│  ├─ Direct fine-tune on preferences               │
│  ├─ Teaches: What humans prefer                   │
│  ├─ Cost: Moderate ($10-50K)                      │
│  ├─ Result: Similar to RLHF, simpler              │
│  └─ Example: Llama 2-Chat, Claude 3.5             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Quality Progression

```
Raw pre-trained model:
  Performance: 30-50% (can hallucinate, refuse to help)

+ Instruction tuning:
  Performance: 70-80% (follows instructions)

+ RLHF or DPO:
  Performance: 90%+ (helpful, polished, preferred by humans)
```

---

## Real Example: Fine-tuning with DPO

```
Goal: Align an open-source model to match company tone

SETUP:
├─ Base model: Llama-7B-Instruct
├─ Method: DPO (faster than RLHF)
└─ Data: 1000 preference pairs

PROCESS:
1. Collect preference pairs
   ├─ Prompt: "What's the best way to invest?"
   ├─ Response A: [risky, aggressive]
   ├─ Response B: [balanced, conservative]
   ├─ Label: B preferred (matches company risk profile)
   └─ Collect 1000 such pairs

2. Fine-tune with DPO
   ├─ Objective: Increase likelihood of preferred responses
   ├─ Training time: 4 hours (single GPU)
   ├─ Cost: ~$50
   └─ Result: Model learns company preferences

3. Evaluate
   ├─ Test on new prompts
   ├─ Human raters: "Does model match company tone?" 
   └─ Accuracy: 92% match (vs 40% before)

4. Deploy
   └─ Use aligned model in production
```

---

## When To Use What

```
Question: How should I align my LLM?

Do you have human preference data?
├─ NO → Instruction tuning only (still decent)
└─ YES → Continue

Budget limitation?
├─ Tight ($10K max) → DPO
├─ Moderate ($50K) → DPO + some RLHF
└─ High ($100K+) → Full RLHF

Need production-ready immediately?
├─ YES → DPO (days to train)
└─ NO → Can do RLHF (weeks, better results)

Using open-source model?
├─ YES → DPO works well, cheaper
└─ NO (using API) → Use model's built-in alignment
```

---

## Key Takeaways

✅ **Instruction tuning** — Teaches model to follow instructions (70-80% quality)

✅ **RLHF** — Uses human feedback + RL to optimize for preferences (90%+ quality)

✅ **DPO** — Simpler, faster alternative to RLHF (similar quality, lower cost)

✅ **Quality progression:** Pre-trained (50%) → Instruction-tuned (75%) → RLHF/DPO (90%+)

✅ **Modern trend:** DPO gaining adoption due to simplicity

✅ **For interviews:** Understand the concepts, not the math

**Next:** Understand data formats needed for fine-tuning → Dataset Formats
