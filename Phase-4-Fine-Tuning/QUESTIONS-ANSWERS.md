# Phase 4: Fine-Tuning — Questions & Answers

## Category 1: When to Fine-Tune

### Q1: A colleague suggests fine-tuning your RAG system to improve accuracy. Should you do it?

**A:**

**Likely NO.** Before fine-tuning, ask:

```
Diagnostic questions:
1. What's the current accuracy? (Measure with RAGAS)
   └─ If 60-70% → Problem is retrieval, not generation
   └─ If 85-90% → Close, might be worth fine-tuning
   └─ If <60% → RAG is broken, fix first

2. Have you tried:
   □ Better prompting? (few-shot examples)
   □ Reranking? (cross-encoders)
   □ Better chunking? (semantic, document-aware)
   └─ If no to any → Fix those first (cheaper, faster)

3. Do you have labeled data?
   └─ If no → Can't fine-tune
   └─ If yes → How many examples? (need 50-100 minimum)

4. What would fine-tuning improve?
   └─ If "answer quality" → Problem is retrieval or LLM prompt
       Solution: Better prompting, not fine-tuning
   └─ If "specific domain style" → Fine-tuning makes sense
       Example: "Always include confidence scores"
```

**Recommended flow:**
```
Current accuracy: 70%

Step 1: Improve RAG
├─ Add reranking
├─ Better chunking
└─ Result: 70% → 80%

Step 2: Better prompting
├─ Few-shot examples
├─ Structured output
└─ Result: 80% → 85%

Step 3: Only if still not good, fine-tune
└─ Cost: $1000, time: 1 week
└─ Result: 85% → 90%
```

**Answer to colleague:** "Let's try RAG improvements and better prompting first. If that doesn't work, we'll revisit fine-tuning."

---

### Q2: When is fine-tuning worth it? Give specific scenarios.

**A:**

```
SCENARIO 1: Medical Diagnosis Assistant
├─ Requirement: 98% accuracy (wrong answer = patient harm)
├─ Current: Few-shot prompting = 85%
├─ Gap: 13 percentage points (significant)
├─ Decision: ✅ FINE-TUNE
│  └─ ROI: High (saves lives, avoids liability)
│  └─ Cost: Justified
│  └─ Timeline: Worth the wait

SCENARIO 2: Customer Support Chatbot
├─ Requirement: 80% accuracy (nice-to-have, not critical)
├─ Current: Prompting + RAG = 78%
├─ Gap: 2 percentage points (tiny)
├─ Decision: ❌ DON'T FINE-TUNE
│  └─ ROI: Negative (2% improvement not worth $1000)
│  └─ Alternative: Improve RAG instead

SCENARIO 3: Code Generation for Proprietary API
├─ Requirement: Custom code style + domain-specific patterns
├─ Current: GPT-4 doesn't know your APIs
├─ Problem: Knowledge gap, not quality gap
├─ Decision: ❌ DON'T FINE-TUNE
│  └─ Better solution: RAG + few-shot examples
│  └─ Feed API docs + code examples in prompt

SCENARIO 4: Classifier for Internal Email Triage
├─ Requirement: Classify 100K emails/month by category
├─ Current: Prompting = 88%, but costs $10/month in API
├─ Goal: Reduce costs by using smaller model
├─ Decision: ✅ FINE-TUNE (smaller, cheaper model)
│  └─ Fine-tune Llama-7B with LoRA (costs $1, not $10)
│  └─ Achieves 88% at 10x lower cost
│  └─ ROI: Positive after 100 days

SCENARIO 5: Legal Clause Extraction
├─ Requirement: Extract clauses from contracts
├─ Current: Few-shot example approach = 70%
├─ Gap: 20 percentage points → significant
├─ Problem: Complex pattern matching (legal domain)
├─ Decision: ✅ FINE-TUNE
│  └─ Collect 500 legal contracts with labels
│  └─ Fine-tune on domain-specific task
│  └─ Expected improvement: 70% → 88%
```

**Decision rule:**
```
Fine-tune if:
  (Accuracy gap > 10%) AND
  (Cost benefit > $5K) AND
  (Have 50+ labeled examples)
```

---

## Category 2: Fine-Tuning Methods

### Q3: You have $2000 budget and RTX 4090. Which fine-tuning approach?

**A:**

```
BUDGET BREAKDOWN:
├─ Data labeling: $500-1000
├─ Compute (GPU hours): $500
└─ API calls + overhead: $500

APPROACH 1: LoRA Fine-Tuning ⭐ BEST
├─ Method: LoRA on Llama-7B or similar
├─ Training time: 6-12 hours on RTX 4090
├─ Cost: $0 (free GPU time) + $500 data + API
├─ Result: 88-92% accuracy achievable
├─ Why: Good balance of cost/accuracy/speed

APPROACH 2: QLoRA Fine-Tuning
├─ Method: Quantized LoRA (even more compressed)
├─ Advantage: Could train 13B model instead of 7B
├─ Cost: Same, but better potential performance
├─ Result: 90-93% accuracy
├─ Why: Only slightly more complex, better results

APPROACH 3: Full Fine-Tuning
├─ Method: Fine-tune all params
├─ Cost: Compute costs explode ($2000+ for GPUs)
├─ Result: 93-95% accuracy
├─ Why: Too expensive for this budget

APPROACH 4: Hybrid (RAG + Light Fine-Tune)
├─ Method: Build RAG system ($1000), then LoRA fine-tune ($500)
├─ Cost: $1500 total
├─ Result: 88-92% (combined RAG + fine-tuning)
├─ Why: More comprehensive, better for knowledge+behavior gaps

RECOMMENDATION: Go with APPROACH 1 (LoRA)
├─ Easiest to implement
├─ Under budget
├─ Good results from RTX 4090
├─ If results not good enough, upgrade to APPROACH 2
```

---

### Q4: Explain LoRA. Why is rank=16 a good default?

**A:**

**LoRA (Low-Rank Adaptation):**

```
Concept:
└─ Don't update all 7B parameters
└─ Instead, add a small "correction matrix" that's trainable

The math (simplified):
  Standard: Output = W × Input
  LoRA: Output = (W + A @ B) × Input
  
  Where:
  └─ W = original 7B params (frozen)
  └─ A @ B = small update matrix (trainable, rank × embedding_dim)

Memory impact:
├─ Base model: 56GB (7B params × 4 bytes)
├─ LoRA rank=16: 56GB + 0.3GB = 56.3GB
│  └─ (only 0.5% overhead!)
└─ Trainable: 0.3GB (tiny!)
```

**Why rank=16?**

```
Trade-off spectrum:

Rank 4 (smallest):
├─ Params: 1M
├─ Memory: 12GB
├─ Accuracy: 84%
└─ Use when: Super resource-constrained

Rank 8:
├─ Params: 2M
├─ Memory: 14GB
├─ Accuracy: 87%
└─ Use when: Limited budget

Rank 16 ⭐ SWEET SPOT:
├─ Params: 3.7M
├─ Memory: 16GB
├─ Accuracy: 90%
└─ Use when: Production, good balance

Rank 32:
├─ Params: 7.4M
├─ Memory: 24GB
├─ Accuracy: 91%
└─ Use when: Need top accuracy

Rank 64 (large):
├─ Params: 14.8M
├─ Memory: 40GB
├─ Accuracy: 92%
└─ Use when: Approaching full fine-tune
```

**Why 16 is the default:**
```
Empirical finding:
└─ rank=16 captures 80-90% of improvement vs full fine-tune
└─ rank=32+ shows diminishing returns (small accuracy gain)

Cost-benefit:
├─ rank=8 → rank=16: +3% accuracy, +50% cost (worth it)
├─ rank=16 → rank=32: +1% accuracy, +50% cost (marginal)
└─ rank=32 → rank=64: +0.5% accuracy, +100% cost (not worth it)

Practical: Start with 16, adjust if needed
```

---

### Q5: You tried LoRA but got worse accuracy (from 85% to 82%). What went wrong?

**A:**

```
Diagnosis: LoRA made accuracy worse!

Possible causes (in order of likelihood):

CAUSE 1: Overfitting (Most common)
├─ Symptom: Training loss drops, validation loss increases
├─ Problem: Too many epochs on small dataset
├─ Fix: 
│  └─ Reduce epochs from 5 to 2
│  └─ Add early stopping (stop when loss plateaus)
│  └─ Or collect more training data

CAUSE 2: Wrong learning rate
├─ Symptom: Loss is erratic or doesn't decrease
├─ Problem: Learning rate too high (unstable) or too low (no learning)
├─ Fix:
│  └─ Try learning rates: 5e-5, 1e-4, 2e-4, 5e-4
│  └─ Usually 2e-4 works well

CAUSE 3: Rank too large
├─ Symptom: Model learns noise in training data
├─ Problem: rank=64 is overparameterized for your data
├─ Fix:
│  └─ Reduce rank from 64 to 16
│  └─ Re-train

CAUSE 4: Bad training data
├─ Symptom: Accuracy decreases across the board
├─ Problem: Labels are wrong or data is misaligned
├─ Fix:
│  └─ Manually inspect training examples
│  └─ Check for label errors
│  └─ Verify ground truth

CAUSE 5: Not actually using LoRA
├─ Symptom: Using default model (not the fine-tuned one)
├─ Problem: Forgot to load LoRA weights
├─ Fix:
│  └─ Verify LoRA model is loaded at inference

RECOMMENDED DEBUG PROCESS:
1. Check loss curves (are they going down?)
   └─ If no → adjust learning rate
   
2. Check validation accuracy per epoch
   └─ If decreasing after epoch 2 → overfitting, reduce epochs
   
3. Inspect training data
   └─ If noisy → clean labels
   
4. Try rank=8 (smaller)
   └─ If better → original rank was too large
   
5. If still worse, revert to base model
   └─ LoRA didn't help for this task
   └─ Use RAG or prompt engineering instead
```

---

## Category 3: Alignment

### Q6: Explain RLHF. Why is DPO becoming popular?

**A:**

**RLHF (Reinforcement Learning from Human Feedback):**

```
Goal: Train model to match human preferences

Process:
1. Instruction-tune base model
   └─ Teaches model to follow instructions

2. Gather human preferences
   ├─ Show humans 2-3 model responses
   ├─ Ask: "Which is better?"
   └─ Collect 10K+ pairwise rankings

3. Train reward model
   ├─ Learn: "What makes a response good?"
   ├─ Input: response text
   ├─ Output: score (0-100)

4. Use RL to optimize model
   ├─ Objective: Maximize reward
   ├─ Method: Policy Gradient (PPO algorithm)
   └─ Result: Model generates high-reward responses

Timeline: 4-8 weeks
Cost: $100K+ (human labeling + compute)
Result: ChatGPT-level quality (90%+)
```

**DPO (Direct Preference Optimization):**

```
Goal: Same as RLHF, but simpler

Process:
1. Instruction-tune base model
   └─ Same as RLHF

2. Gather human preferences
   ├─ Show humans 2 model responses
   ├─ Ask: "Which is better?"
   └─ Collect 5K+ pairwise preferences

3. Fine-tune directly
   ├─ Objective: Make preferred responses more likely
   ├─ No separate reward model needed!
   ├─ No PPO algorithm needed!
   └─ Just standard supervised fine-tuning

Timeline: 3-5 days
Cost: $10-40K (cheaper human labeling + compute)
Result: Similar to RLHF (89-91%)
```

**Why DPO is winning:**

```
DPO advantages:
├─ No separate reward model (simpler)
├─ No PPO training (less complex, fewer bugs)
├─ Faster (days vs weeks)
├─ Cheaper ($10K vs $100K)
├─ Empirically similar results to RLHF
└─ Can implement in a week if you know fine-tuning

RLHF advantages:
├─ Slightly better results (91-92% vs 89-91%)
├─ More flexible (reward model is separate)
└─ More established (studied longer)
```

**Current trend:**
```
2022: Everyone using RLHF
2023: DPO research shows it works well
2024: Companies switching to DPO (simpler, faster)

Why DPO is practical:
└─ Fine-tuning is now easier (LoRA, QLoRA, Unsloth)
└─ DPO is essentially fine-tuning on preferences
└─ So: Instruction tune → DPO → Done! (weeks, not months)
```

---

### Q7: You have preference data for 1000 examples. Which alignment method?

**A:**

```
Given: 1000 human preference pairs {response_A, response_B, preference}

DECISION:
├─ Budget: <$20K? → DPO
├─ Budget: $50K+? → RLHF (slightly better results)
├─ Timeline: <1 week? → DPO
└─ Timeline: 2+ weeks? → RLHF

RECOMMENDATION: DPO ⭐

Why:
├─ 1000 examples is moderate (fits DPO well)
├─ DPO results are nearly as good as RLHF
├─ Much faster to implement
├─ Easier to debug
└─ Save money for other things

Process:
1. Instruction-tune base model
   ├─ Dataset: Alpaca or ShareGPT (50K examples)
   ├─ Time: 1-2 days
   └─ Result: Base model that follows instructions

2. Run DPO on preferences
   ├─ Dataset: Your 1000 preference pairs
   ├─ Time: 4-6 hours
   ├─ Result: Aligned model that matches your preferences
   └─ Expected accuracy: 88-91%

Total timeline: 2-3 days
Total cost: <$5K
Result: Production-ready aligned model
```

---

## Category 4: Integration

### Q8: Design a complete fine-tuning system for classifying customer feedback (50K reviews/year).

**A:**

```
REQUIREMENTS ANALYSIS:
├─ Task: Classify reviews (positive/negative/mixed)
├─ Volume: 50K reviews/year (4.2K/month)
├─ Current state: Zero in-house
├─ Accuracy need: 90%+ (business decision matters)
└─ Timeline: 4 weeks to production

APPROACH CHOICE:
├─ Start with: Prompting (good baseline)
├─ If needed: Fine-tune smaller model (cost-effective)
└─ Don't use: RAG (this is classification, not retrieval)

ARCHITECTURE:

PHASE 1: BASELINE (Week 1)
├─ Use GPT-4 with few-shot prompting
├─ Cost: $50/month for 50K reviews
├─ Accuracy: ~85% (baseline)
└─ Use while building custom solution

PHASE 2: FINE-TUNING PREP (Week 2)
├─ Collect labeled data
│  ├─ Label 500 reviews manually or semi-auto
│  ├─ Split: 400 train, 100 test
│  └─ Cost: $500 (or internal if you label)
│
├─ Data format:
│  {"instruction": "Classify sentiment",
│   "input": "I love this product!",
│   "output": "Positive"}
│
└─ Validate labelin (check agreement of 20%)

PHASE 3: FINE-TUNING (Week 3)
├─ Choose model: Llama-7B (open, cheap to run)
├─ Method: LoRA (cost-effective)
├─ Configuration:
│  ├─ Rank: 16
│  ├─ Learning rate: 2e-4
│  ├─ Epochs: 3
│  └─ Batch size: 8
│
├─ Training:
│  ├─ Hardware: RTX 4090 (6 hours)
│  ├─ Cost: $50-100
│  └─ Result: ~90% accuracy on test set
│
└─ Save model: 7.2GB merged weights

PHASE 4: EVALUATION (Week 3)
├─ Evaluate on 100 test reviews
├─ Compare to baseline (GPT-4 ~ 85%)
├─ Expected: 90-91% (5-6% improvement)
└─ If good, move to production

PHASE 5: DEPLOYMENT (Week 4)
├─ Load fine-tuned model on-premises (GPU server)
├─ Build inference API:
│  ├─ Input: review text
│  ├─ Output: sentiment + confidence
│  └─ Latency: <1 second
│
├─ Monitor:
│  ├─ Accuracy vs ground truth
│  ├─ Latency
│  └─ Cost
│
└─ Feedback loop:
   ├─ Collect human corrections
   ├─ Periodically retrain (quarterly)
   └─ Improve over time

COST ANALYSIS:
├─ Phase 1 (baseline): $50
├─ Phase 2 (labeling): $500
├─ Phase 3 (training): $100
├─ Phase 5 (deployment): ~$200/month (GPU server)
│
└─ Total first year: $50 + $500 + $100 + $2400 = $3050

ROI:
├─ GPT-4 API: $50 × 12 = $600/year
├─ Fine-tuned model: ~$3000 first year
├─ After breakeven (5 years), fine-tuned is cheaper
└─ Plus: Own data, integrated system, fast inference

EXPECTED ACCURACY:
├─ Baseline (prompting): 85%
├─ Fine-tuned: 90-91%
└─ Improvement: 5-6 percentage points

SUCCESS METRICS:
├─ Accuracy: > 90% (target met)
├─ Latency: < 1 second (acceptable)
├─ Cost: < $300/month (within budget)
└─ User satisfaction: Human spot-checks pass
```

---

## Key Insights

✅ **Fine-tune only after trying prompting + RAG first**

✅ **LoRA is the default** for parameter-efficient fine-tuning

✅ **Rank=16 is the sweet spot** for most use cases

✅ **DPO is the modern choice** for alignment (replacing RLHF)

✅ **Overfitting is common** with small datasets; watch your validation loss

✅ **Test thoroughly** before deploying fine-tuned models

✅ **Monitor continuously** after deployment
